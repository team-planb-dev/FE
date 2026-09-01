import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TripDetail.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Chips from "../../components/Chips/Chips";
import PlanCard from "../../components/PlanCard/PlanCard";
import PlanSide from "../../components/PlanSide/PlanSide";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";
import Snackbar from "../../components/Snackbar/Snackbar";

import { MOCK_PLAN_DAYS, dayTabLabels } from "./planData";
import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

const dot = (key: string) => key.replaceAll("-", ".");

type TripDetailMode = "edit" | "saved" | "shared";

const COPIED_TEXT = "링크가 클립보드에 복사되었습니다.";

const HEADER_TITLE: Record<TripDetailMode, string> = {
  edit: "여행 일정 생성",
  saved: "내 일정",
  shared: "여행 일정 생성",
};

/** 생성된 여행 일정. mode 로 저장 전 / 저장 후 / 공유받은 화면을 구분합니다 */
export default function TripDetail({
  mode = "edit",
}: {
  mode?: TripDetailMode;
}) {
  const navigate = useNavigate();
  const { form } = useTripForm();

  const saved = mode !== "edit";
  const days = MOCK_PLAN_DAYS;
  const [dayIndex, setDayIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const share = () => {
    void navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const conditions = [form.style, form.theme].filter(Boolean) as string[];

  const nightsLabel = form.nights === 0 ? "당일치기" : `${form.nights}박 ${form.nights + 1}일`;
  const endDate = (() => {
    if (!form.startDate) return null;
    const [y, m, d] = form.startDate.split("-").map(Number);
    const end = new Date(y, m - 1, d + form.nights);
    return `${end.getFullYear()}.${String(end.getMonth() + 1).padStart(2, "0")}.${String(
      end.getDate(),
    ).padStart(2, "0")}`;
  })();

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
          <TitleL>{form.name || "{일정 이름}"}</TitleL>
          <div className="trip-detail__dates">
            <p className="trip-detail__dates-text">
              {form.startDate ? (
                <>
                  <span>{dot(form.startDate)}</span>
                  <span>-</span>
                  <span>{endDate}</span>
                  <span>({nightsLabel})</span>
                </>
              ) : (
                <>
                  <span>2026.08.01</span>
                  <span>-</span>
                  <span>2026.08.02</span>
                  <span>(1박 2일)</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="trip-detail__ai">
          <div className="trip-detail__ai-inner">
            <span className="trip-detail__ai-avatar" aria-hidden="true" />
            <p className="trip-detail__ai-text">
              AI가{" "}
              <span className="trip-detail__ai-strong">
                {conditions.length > 0
                  ? conditions.join(", ")
                  : "{조건 A}, {조건 B}, {조건 C}"}
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
        {days[dayIndex].map((item) =>
          item.type === "stop" ? (
            <PlanCard
              key={item.stop.id}
              stop={item.stop}
              onDetail={
                item.stop.kind === "food" && mode !== "shared"
                  ? () => undefined
                  : undefined
              }
            />
          ) : (
            <PlanSide key={item.gap.id} gap={item.gap} />
          ),
        )}
      </div>

      {copied && (
        <Snackbar className="trip-detail__snackbar" withIcon={false}>
          {COPIED_TEXT}
        </Snackbar>
      )}

      {!saved && (
        <BottomBar>
          <Btn variant="outline" onClick={() => navigate(PATHS.tripEdit)}>
            수정하기
          </Btn>
          <Btn variant="primary" onClick={() => navigate(PATHS.tripSaved)}>
            저장하기
          </Btn>
        </BottomBar>
      )}
    </div>
  );
}
