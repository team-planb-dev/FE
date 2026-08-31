import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TripDate.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import DatePicker from "../../components/DatePicker/DatePicker";
import { toDateKey } from "../../components/DatePicker/dateKey";
import Chips from "../../components/Chips/Chips";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { NIGHT_OPTIONS, useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [7-3] 여행 날짜 작성
 *  237:6347 당일치기(9일 하루만) · 343:8086 2박 3일(9·10·11 연속)
 *
 * 출발일 하나를 고르고 박수를 고르면 그만큼이 이어서 칠해집니다.
 *
 * ⚠ 캘린더가 다른 디자인 시스템에서 온 컴포넌트입니다 — 글꼴이 Geist 이고
 *   요일·월 표기가 영어입니다. `DatePicker` 주석과 확인 필요 문서를 봐주세요.
 * ⚠ 디자인의 달은 "May 2025" 목업이라 오늘이 속한 달로 시작합니다.
 */
export default function TripDate() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // 출발일부터 박수만큼 이어지는 날짜들
  const selectedDays: string[] = [];
  if (form.startDate) {
    const [y, m, d] = form.startDate.split("-").map(Number);
    for (let i = 0; i <= form.nights; i += 1) {
      selectedDays.push(toDateKey(new Date(y, m - 1, d + i)));
    }
  }

  return (
    <div className="trip-date">
      {/* Header / Variant2 (237:6348) */}
      <Header
        className="trip-date__header"
        onBack={() => navigate(PATHS.tripRegion)}
      />

      <TitleL className="trip-date__title">언제 출발하시나요?</TitleL>

      {/* Date Picker (237:6361) — x23.5 y186 */}
      <div className="trip-date__calendar">
        <DatePicker
          month={month}
          onMonthChange={setMonth}
          selected={selectedDays}
          onSelect={(dateKey) => setField("startDate", dateKey)}
        />
      </div>

      {/* Frame 79 (237:6354) — x24 y568 */}
      <div className="trip-date__nights">
        <p className="trip-date__nights-title">몇 일 일정인가요?</p>
        <div className="trip-date__nights-chips">
          {NIGHT_OPTIONS.map((option) => (
            <Chips
              key={option.nights}
              selected={form.nights === option.nights}
              onClick={() => setField("nights", option.nights)}
            >
              {option.label}
            </Chips>
          ))}
        </div>
      </div>

      {/* bottom (343:8079) — 이전으로 / 다음으로 */}
      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripRegion)}>
          이전으로
        </Btn>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripTransport)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
