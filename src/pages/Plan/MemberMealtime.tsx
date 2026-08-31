import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MemberMealtime.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import Chips from "../../components/Chips/Chips";
import Checkbox from "../../components/Checkbox/Checkbox";
import TimeSelect from "../../components/TimeSelect/TimeSelect";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { MEALS, useMemberForm } from "./memberFormContext";
import ExitRegistrationModal from "./ExitRegistrationModal";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-6] 식사시간
 *  237:6894 초기 · 237:6914 '네'(끼니별 시간) · 237:6904 '아니오'
 *
 * 이 화면부터는 subtitle 이 없고 title_L 만 있습니다.
 */
export default function MemberMealtime() {
  const navigate = useNavigate();
  /** [6-7] 등록 중 이탈 확인 모달 (237:7248) */
  const [exitOpen, setExitOpen] = useState(false);
  const { form, setField } = useMemberForm();

  const reflects = form.reflectMealtime === "yes";

  // '네' 면 끼니를 하나 이상 골라야 넘어갑니다.
  const canSubmit =
    form.reflectMealtime !== null &&
    (!reflects || MEALS.some((m) => form.mealTimes[m].checked));

  const setMealTime = (
    meal: (typeof MEALS)[number],
    patch: Partial<(typeof form.mealTimes)[typeof meal]>,
  ) =>
    setField("mealTimes", {
      ...form.mealTimes,
      [meal]: { ...form.mealTimes[meal], ...patch },
    });

  return (
    <div className="member-mealtime">
      {/* Header / Variant3 (237:6895) */}
      <Header
        className="member-mealtime__header"
        variant="close"
        backLabel="구성원 등록 그만두기"
        onBack={() => setExitOpen(true)}
      />

      {/* title_L (237:6902) — y54, 86 */}
      <TitleL className="member-mealtime__title">
        {form.name || "{구성원 이름}"} 님의
        <br />
        식사 시간을 알려주세요
      </TitleL>

      {/* 237:6896 / 237:6916 — x24 y160, w342, gap 40 */}
      <div className="member-mealtime__form">
        <Field
          label="평소 식사시간을 여행 일정에 반영할까요?"
          htmlFor="reflect-mealtime"
          required
          spacing="gap"
        >
          <div className="member-mealtime__chips" id="reflect-mealtime">
            <Chips
              selected={form.reflectMealtime === "yes"}
              onClick={() => setField("reflectMealtime", "yes")}
            >
              네
            </Chips>
            <Chips
              selected={form.reflectMealtime === "no"}
              onClick={() => setField("reflectMealtime", "no")}
            >
              아니오
            </Chips>
          </div>
        </Field>

        {/* 237:6923 — '네' 일 때만 나타납니다 */}
        {reflects && (
          <Field
            label="어떤 시간을 반영할까요?"
            htmlFor="meal-times"
            spacing="gap"
          >
            <div className="meal-times" id="meal-times">
              {MEALS.map((meal) => (
                <div className="meal-times__row" key={meal}>
                  <span className="meal-times__check">
                    <Checkbox
                      id={`mealtime-${meal}`}
                      checked={form.mealTimes[meal].checked}
                      onChange={(checked) => setMealTime(meal, { checked })}
                    />
                    <label
                      className="meal-times__label"
                      htmlFor={`mealtime-${meal}`}
                    >
                      {meal}
                    </label>
                  </span>

                  <TimeSelect
                    idPrefix={`mealtime-${meal}`}
                    value={form.mealTimes[meal].time}
                    onChange={(time) => setMealTime(meal, { time, checked: true })}
                  />
                </div>
              ))}
            </div>
          </Field>
        )}
      </div>

      {/* bottom (237:6903) — 이전으로 / 다음으로 */}
      <BottomBar>
        <Btn
          variant="outline"
          onClick={() => navigate(PATHS.memberNewMedsDetail)}
        >
          이전으로
        </Btn>
        <Btn
          variant={canSubmit ? "primary" : "muted"}
          disabled={!canSubmit}
          onClick={() => canSubmit && navigate(PATHS.memberNewFood)}
        >
          다음으로
        </Btn>
      </BottomBar>

      {/* [6-7] 등록 중 이탈 (237:7248) — 딤이 하단 바까지 덮도록 맨 뒤에 둡니다 */}
      <ExitRegistrationModal open={exitOpen} onCancel={() => setExitOpen(false)} />
    </div>
  );
}
