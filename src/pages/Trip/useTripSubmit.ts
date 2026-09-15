import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiRequestError } from "../../api/client";
import { ERROR_CODE } from "../../api/schema";
import type { CreatePlanResponse } from "../../api/schema";
import { createTravelPlan } from "../../api/travel";

import { toCreateTravelRequest } from "./tripForm";
import { useTripForm } from "./tripFormContext";
import { tripDetailPath } from "../../routes/paths";

const CREATE_FAILED = "일정을 만들지 못했어요.";
const NETWORK_FAILED = "잠시 후 다시 시도해주세요.";
/** 만들어진 일정을 다시 불러오려면 travelId 가 꼭 있어야 합니다 */
const NO_TRAVEL_ID = "응답에 travelId 가 없습니다";

/**
 * 코드별 안내. add-with-recommend 의 Swagger 설명 기준입니다.
 *
 * ⚠ PLAN.EXCEPTION.INVALID_AI_PLACE 는 일부러 넣지 않았습니다.
 *   이름은 "장소" 지만 서버가 검증 실패 전반에 쓰고 있어서
 *   ("일정 장소 검증 실패: 복약 기준시간 누락" 도 이 코드였습니다)
 *   문구를 지어내면 진짜 사유를 덮어버립니다. 서버 문구를 그대로 씁니다
 */
const FAILURE_TEXT: Record<string, string> = {
  [ERROR_CODE.companionRequired]: "여행 구성원을 한 명 이상 골라주세요.",
  [ERROR_CODE.companionNotOwned]: "내가 등록한 구성원만 넣을 수 있어요.",
  [ERROR_CODE.aiTemporarilyUnavailable]:
    "AI 가 잠시 응답하지 못했어요. 다시 시도해주세요.",
  [ERROR_CODE.aiResponseRejected]:
    "조건에 맞는 일정을 만들지 못했어요. 조건을 조금 바꿔보시겠어요?",
  [ERROR_CODE.aiInternalError]:
    "일정을 만들다 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
};

/** 화면 문구와, 그 밑에 작게 붙일 서버 원문 */
export type TripFailure = { message: string; detail: string | null };

/**
 * [7-10] 여행 조건 등록 + AI 일정 생성.
 *
 * AI 가 만드는 데 오래 걸려서 [7-10] 로딩 화면에 들어오자마자 보내고
 * 응답이 오면 일정 화면으로 넘깁니다.
 *
 * ⚠ 여행을 실제로 만드는 요청이라 한 번만 보내야 합니다.
 *   StrictMode 는 개발 중 effect 를 두 번 실행하므로, 보낸 요청을 ref 에 들고
 *   두 번째 실행에서는 같은 요청의 결과를 기다립니다.
 *   같은 이유로 화면을 벗어나도 요청을 끊지 않고 결과만 버립니다
 */
export function useTripSubmit() {
  const navigate = useNavigate();
  const { form } = useTripForm();

  const [failure, setFailure] = useState<TripFailure | null>(null);
  const [attempt, setAttempt] = useState(0);

  const sentAttempt = useRef(-1);
  const pending = useRef<Promise<CreatePlanResponse> | null>(null);

  // 8단계를 건너뛰고 들어오면 빠진 값이 있습니다. 보내기 전에 걸러냅니다
  const built = useMemo(() => toCreateTravelRequest(form), [form]);

  useEffect(() => {
    if (!built.ok) return;

    if (sentAttempt.current !== attempt) {
      sentAttempt.current = attempt;
      pending.current = createTravelPlan(built.body);
    }

    const request = pending.current;
    if (!request) return;

    let alive = true;

    request
      .then((plan) => {
        if (!alive) return;

        if (typeof plan.travelId !== "number") {
          setFailure({ message: CREATE_FAILED, detail: NO_TRAVEL_ID });
          return;
        }

        navigate(tripDetailPath(plan.travelId), { replace: true });
      })
      .catch((caught: unknown) => {
        if (alive) setFailure(failureOf(caught));
      });

    return () => {
      alive = false;
    };
  }, [built, navigate, attempt]);

  const retry = () => {
    setFailure(null);
    setAttempt((n) => n + 1);
  };

  const error: TripFailure | null = built.ok
    ? failure
    : { message: built.message, detail: null };

  return { error, retry };
}

function failureOf(caught: unknown): TripFailure {
  if (!(caught instanceof ApiRequestError)) {
    return { message: NETWORK_FAILED, detail: null };
  }

  const fromServer = caught.message.trim();
  const known = caught.errorCode ? FAILURE_TEXT[caught.errorCode] : undefined;
  const message = known || fromServer || CREATE_FAILED;

  // 같은 코드가 여러 사유로 오기 때문에 원문을 같이 남깁니다
  const parts = [caught.errorCode, message === fromServer ? "" : fromServer];
  const detail = parts.filter(Boolean).join(" · ");

  return { message, detail: detail || null };
}
