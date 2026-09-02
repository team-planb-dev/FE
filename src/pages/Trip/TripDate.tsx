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

/** 여행 날짜와 박수 선택 */
export default function TripDate() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const selectedDays: string[] = [];
  if (form.startDate) {
    const [y, m, d] = form.startDate.split("-").map(Number);
    for (let i = 0; i <= form.nights; i += 1) {
      selectedDays.push(toDateKey(new Date(y, m - 1, d + i)));
    }
  }

  return (
    <div className="trip-date">
      <Header
        className="trip-date__header"
        onBack={() => navigate(PATHS.tripRegion)}
      />

      <TitleL className="trip-date__title">언제 출발하시나요?</TitleL>
      <div className="trip-date__calendar">
        <DatePicker
          month={month}
          onMonthChange={setMonth}
          selected={selectedDays}
          onSelect={(dateKey) => setField("startDate", dateKey)}
        />
      </div>

      <div className="trip-date__nights">
        <p className="trip-date__nights-title">며칠 일정인가요?</p>
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
