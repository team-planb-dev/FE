import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./TripDetail.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Chips from "../../components/Chips/Chips";
import PlanCard from "../../components/PlanCard/PlanCard";
import PlanSide from "../../components/PlanSide/PlanSide";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";
import Snackbar from "../../components/Snackbar/Snackbar";

import { TRAVEL_STYLE_LABEL, TRAVEL_THEME_LABEL } from "../../api/labels";
import { formatDate } from "../../api/planFormat";
import type { GetAiPlanResponse } from "../../api/schema";
import { fetchSharedTravel, fetchTravelPlan, saveTravel } from "../../api/travel";

import { dayTabLabels, toPlanItems } from "./planData";
import { toPlanDays } from "./planNormalize";
import {
  PATHS,
  restaurantDetailPath,
  tripSavedPath,
} from "../../routes/paths";

type TripDetailMode = "edit" | "saved" | "shared";

const COPIED_TEXT = "링크가 클립보드에 복사되었습니다.";
const SAVE_FAILED = "저장하지 못했어요.";
const LOADING_TEXT = "일정을 불러오는 중이에요...";
const MISSING_TEXT = "일정을 찾을 수 없어요.";
const SNACKBAR_MS = 2000;

const HEADER_TITLE: Record<TripDetailMode, string> = {
  edit: "여행 일정 생성",
  saved: "내 일정",
  shared: "여행 일정 생성",
};

/**
 * 생성된 여행 일정. mode 로 저장 전 / 저장 후 / 공유받은 화면을 구분합니다.
 *
 * 주소의 travelId(공유는 shareToken)로 매번 다시 불러옵니다.
 * 새로고침하거나 뒤로 갔다 와도 같은 일정이 나와야 하기 때문입니다
 */
export default function TripDetail({
  mode = "edit",
}: {
  mode?: TripDetailMode;
}) {
  const navigate = useNavigate();
  const { travelId: idParam, shareToken } = useParams();

  const saved = mode !== "edit";

  // 공유 화면은 토큰으로, 나머지는 번호로 부릅니다
  const target = useMemo<number | string | null>(() => {
    if (mode === "shared") return shareToken ?? null;

    const id = Number(idParam);
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [mode, idParam, shareToken]);

  const [plan, setPlan] = useState<GetAiPlanResponse | null>(null);
  const [failed, setFailed] = useState(false);

  const [dayIndex, setDayIndex] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (target === null) return;

    let alive = true;

    const request =
      typeof target === "string"
        ? fetchSharedTravel(target)
        : fetchTravelPlan(target);

    request
      .then((loaded) => {
        if (alive) setPlan(loaded);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
    };
  }, [target]);

  const days = useMemo(() => toPlanDays(plan?.planDays), [plan]);

  const missing = target === null || failed;
  const loading = !missing && !plan;

  const conditions = [
    plan?.travelStyle ? TRAVEL_STYLE_LABEL[plan.travelStyle] : null,
    plan?.travelTheme ? TRAVEL_THEME_LABEL[plan.travelTheme] : null,
  ].filter(Boolean) as string[];

  const nightsLabel =
    days.length <= 1 ? "당일치기" : `${days.length - 1}박 ${days.length}일`;

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(null), SNACKBAR_MS);
  };

  const share = () => {
    // TODO([S10]): share/issue 로 받은 shareToken 주소를 복사해야 합니다
    void navigator.clipboard?.writeText(window.location.href);
    flash(COPIED_TEXT);
  };

  const save = () => {
    if (saving || typeof target !== "number") return;

    setSaving(true);

    saveTravel(target)
      .then(() => navigate(tripSavedPath(target), { replace: true }))
      .catch(() => {
        setSaving(false);
        flash(SAVE_FAILED);
      });
  };

  if (missing || loading) {
    return (
      <div className="trip-detail">
        <Header
          className="trip-detail__header"
          variant="title"
          title={HEADER_TITLE[mode]}
          onBack={() => navigate(PATHS.home)}
        />
        <p className="trip-detail__status">
          {missing ? MISSING_TEXT : LOADING_TEXT}
        </p>
      </div>
    );
  }

  const shownDay = days[Math.min(dayIndex, days.length - 1)];
  const items = shownDay ? toPlanItems(shownDay) : [];

  const firstDate = days[0]?.date ?? null;
  const lastDate = days[days.length - 1]?.date ?? null;

  return (
    <div className={`trip-detail${saved ? " trip-detail--saved" : ""}`}>
      <Header
        className="trip-detail__header"
        variant="title"
        title={HEADER_TITLE[mode]}
        onBack={mode === "saved" ? () => navigate(PATHS.home) : undefined}
        action={saved ? { label: "일정 공유하기", onClick: share } : undefined}
      />

      <div className="trip-detail__top">
        <div className="trip-detail__heading">
          <TitleL>{plan?.planName || "여행 일정"}</TitleL>
          <div className="trip-detail__dates">
            <p className="trip-detail__dates-text">
              <span>{formatDate(firstDate)}</span>
              <span>-</span>
              <span>{formatDate(lastDate)}</span>
              <span>({nightsLabel})</span>
            </p>
          </div>
        </div>

        <div className="trip-detail__ai">
          <div className="trip-detail__ai-inner">
            <span className="trip-detail__ai-avatar" aria-hidden="true" />
            <p className="trip-detail__ai-text">
              AI가{" "}
              <span className="trip-detail__ai-strong">
                {conditions.join(", ")}
              </span>
              를 고려하여
              <br />
              맞춤 일정을 생성했어요!
            </p>
          </div>
        </div>

        <div className="trip-detail__days">
          {dayTabLabels(days.length).map((label, i) => (
            <Chips
              key={label}
              selected={dayIndex === i}
              onClick={() => setDayIndex(i)}
            >
              {label}
            </Chips>
          ))}
        </div>
      </div>

      <div className="trip-detail__list">
        {items.map((item) =>
          item.type === "stop" ? (
            <PlanCard
              key={item.stop.id}
              stop={item.stop}
              onDetail={
                item.stop.kind === "food" && mode !== "shared"
                  ? () =>
                      navigate(restaurantDetailPath(item.stop.id), {
                        state: {
                          name: item.stop.name,
                          detail: item.schedule.restaurantDetail,
                        },
                      })
                  : undefined
              }
            />
          ) : (
            <PlanSide key={item.gap.id} gap={item.gap} />
          ),
        )}
      </div>

      {notice && (
        <Snackbar className="trip-detail__snackbar" withIcon={false}>
          {notice}
        </Snackbar>
      )}

      {!saved && (
        <BottomBar>
          <Btn variant="outline" onClick={() => navigate(PATHS.tripEdit)}>
            수정하기
          </Btn>
          <Btn variant={saving ? "muted" : "primary"} onClick={save}>
            저장하기
          </Btn>
        </BottomBar>
      )}
    </div>
  );
}
