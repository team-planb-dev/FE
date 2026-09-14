import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiRequestError } from "../../api/client";
import type { CreatePlanResponse } from "../../api/schema";
import { createTravelPlan } from "../../api/travel";

import { toCreateTravelRequest } from "./tripForm";
import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

const CREATE_FAILED = "일정을 만들지 못했어요.";
const NETWORK_FAILED = "잠시 후 다시 시도해주세요.";

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

  const [failure, setFailure] = useState<string | null>(null);
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
        if (alive) {
          navigate(PATHS.tripDetail, { replace: true, state: { plan } });
        }
      })
      .catch((caught: unknown) => {
        if (alive) setFailure(messageOf(caught));
      });

    return () => {
      alive = false;
    };
  }, [built, navigate, attempt]);

  const retry = () => {
    setFailure(null);
    setAttempt((n) => n + 1);
  };

  return { error: built.ok ? failure : built.message, retry };
}

function messageOf(caught: unknown): string {
  if (!(caught instanceof ApiRequestError)) return NETWORK_FAILED;

  // 한 줄로 보여줘서 서버 문구가 길면 잘립니다
  const fromServer = caught.message.trim();
  return fromServer && fromServer.length <= 20 ? fromServer : CREATE_FAILED;
}
