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

import { MOCK_PLAN_DAYS, dayTabLabels } from "./planData";
import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** YYYY-MM-DD → 2026.08.01 */
const dot = (key: string) => key.replaceAll("-", ".");

/**
 * Figma: [8-1] 여행 조건 생성 (344:9908) · [8-3] 일정 저장 완료 (344:11271)
 * 같은 화면의 저장 전 / 저장 후 상태입니다.
 *
 * 개발 노트
 *  1 (344:11009) [AI 조건 생성] — {조건 A} 여행 스타일(3중1), {조건 B} 여행 테마(4중1),
 *    {조건 C} 구성원 중 복약/알레르기 고려가 있으면 {복약 시간}·{알레르기}.
 *    해당 조건이 없으면 조건 C 는 표시하지 않습니다.
 *  2 (344:11029) [장소 태그] — 카드보다 길어지면 스크롤, 태그 3개까지.
 *  3 (344:11021) [식사/복약시간 고려] — 식사시간을 고려하면 그 시간에 식당 코스를,
 *    복약시간을 고려하면 지정시간 또는 식전/식후로 복약 시간을 배치합니다.
 *  4 (344:11267) [바텀 네비게이션] — [수정하기] → [S9], [저장] → (아래 ⚠ 참고)
 *
 * ⚠ 개발 노트가 서로 어긋납니다. [8-1] 노트 4 는 "[저장]을 누를 경우 **[8-2]로**" 인데
 *   [8-3] 노트 1 은 "[8-1]에서 [저장하기]를 누르면 ... **[8-3] 화면으로**" 입니다.
 *   [8-2]는 식당 상세 페이지라 [8-3]이 맞다고 보고 그렇게 구현했습니다.
 */
export default function TripDetail({ saved = false }: { saved?: boolean }) {
  const navigate = useNavigate();
  const { form } = useTripForm();

  const days = MOCK_PLAN_DAYS;
  const [dayIndex, setDayIndex] = useState(0);

  // 개발 노트 1 — 조건 C 는 해당하는 구성원이 있을 때만 들어갑니다.
  // TODO(api): 구성원의 복약·알레르기 정보를 받아 조건 C 를 채우세요.
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
      {/* Header (344:9909).
          [8-3] 개발 노트 1 — 헤더 화살표를 누르면 홈으로.
          ⚠ 같은 노트의 "공유 아이콘을 누르면 [S10]으로" 는 아이콘 에셋도,
            공유 아이콘이 붙은 헤더 variant 도 디자인에 없어 넣지 못했습니다. */}
      <Header
        className="trip-detail__header"
        onBack={() => navigate(saved ? PATHS.home : PATHS.tripConfirm)}
      />

      {/* top (344:10582) — y54 */}
      <div className="trip-detail__top">
        <div className="trip-detail__heading">
          {/* TODO(api): 실제 일정 이름. [7-1]에서 받은 값을 씁니다. */}
          <TitleL>{form.name || "{일정 이름}"}</TitleL>

          {/* date (344:10192) */}
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
                <span>{"{여행 일정}"}</span>
              )}
            </p>
          </div>
        </div>

        {/* 344:10069 — AI 조건 배너 */}
        <div className="trip-detail__ai">
          <div className="trip-detail__ai-inner">
            {/* Avatar / Variant2 (344:10074) — 24×24.
                TODO(asset): 에셋이 없어 자리만 잡았습니다. */}
            <span className="trip-detail__ai-avatar" aria-hidden="true" />
            <p className="trip-detail__ai-text">
              AI가{" "}
              <span className="trip-detail__ai-strong">
                {conditions.length > 0 ? conditions.join(", ") : "{조건 A}, {조건 B}"}
              </span>
              를 고려하여
              <br />
              맞춤 일정을 생성했어요!
            </p>
          </div>
        </div>

        {/* date (344:10199) — 날짜 탭 */}
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

      {/* Frame 1707482582 (344:10800) — 일정 목록 */}
      <div className="trip-detail__list">
        {days[dayIndex].map((item) =>
          item.type === "stop" ? (
            <PlanCard
              key={item.stop.id}
              stop={item.stop}
              /* TODO(route): [8-2] 식당 상세 화면이 생기면 연결해주세요. */
              onDetail={item.stop.kind === "food" ? () => undefined : undefined}
            />
          ) : (
            <PlanSide key={item.gap.id} gap={item.gap} />
          ),
        )}
      </div>

      {/* bottom (344:11243) — 저장 후에는 사라집니다([8-3] 개발 노트 1) */}
      {!saved && (
        <BottomBar>
          {/* TODO(route): [S9] 일정 수정 화면이 생기면 연결해주세요. */}
          <Btn variant="outline" onClick={() => undefined}>
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
