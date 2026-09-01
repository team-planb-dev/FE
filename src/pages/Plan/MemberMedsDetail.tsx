import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MemberMedsDetail.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import Chips from "../../components/Chips/Chips";
import ChipsM from "../../components/ChipsM/ChipsM";
import Checkbox from "../../components/Checkbox/Checkbox";
import Select from "../../components/Select/Select";
import TimeSelect from "../../components/TimeSelect/TimeSelect";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import {
  MEALS,
  MEAL_RELATIONS,
  MEDS_TIMINGS,
  useMemberForm,
} from "./memberFormContext";
import ExitRegistrationModal from "./ExitRegistrationModal";
import { PATHS } from "../../routes/paths";

const INTERVALS = ["30", "60", "90", "120"];

/** 약 이름과 복약 시점 입력 */
export default function MemberMedsDetail() {
  const navigate = useNavigate();

  const [exitOpen, setExitOpen] = useState(false);
  const { form, setField, setMealMeds } = useMemberForm();

  const byTime = form.medsTiming === "특정 시간대에 먹어요";
  const byMeal = form.medsTiming === "식사를 기준으로 기억해요";

  const detailDone = byTime
    ? Boolean(form.medsTime.meridiem && form.medsTime.hour && form.medsTime.minute)
    : byMeal
      ? MEALS.some((m) => form.mealMeds[m].checked)
      : true;

  const canSubmit =
    form.medsLabel.trim().length > 0 && form.medsTiming !== null && detailDone;

  return (
    <div className="member-meds-detail">
      <Header
        className="member-meds-detail__header"
        variant="close"
        backLabel="구성원 등록 그만두기"
        onBack={() => setExitOpen(true)}
      />

      <div className="member-meds-detail__heading">
        <TitleL>
          {form.name || "{구성원 이름}"} 님의
          <br />
          복약정보를 알려주세요
        </TitleL>
        <Subtitle>
          처방전이나  안내받은 내용이 있을 때만 입력해주세요.
          <br />
          {"{서비스명}"}이 복약시간을 새로 결정하지 않습니다.
        </Subtitle>
      </div>

      <div className="member-meds-detail__form">
        <Field
          label="일정에서 약을 어떤 이름으로 보여드릴까요? "
          htmlFor="meds-label"
          required
          spacing="default"
        >
          <TextInput
            id="meds-label"
            value={form.medsLabel}
            onChange={(v) => setField("medsLabel", v)}
            placeholder="placeholder"
          />
        </Field>

        <Field
          label="언제 챙기면 되나요?"
          htmlFor="meds-timing"
          required
          spacing="gap"
        >
          <div className="member-meds-detail__chips" id="meds-timing">
            {MEDS_TIMINGS.map((timing) => (
              <Chips
                key={timing}
                selected={form.medsTiming === timing}
                onClick={() => setField("medsTiming", timing)}
              >
                {timing}
              </Chips>
            ))}
          </div>
        </Field>

        {byTime && (
          <Field label="복약 시간" htmlFor="meds-time" required spacing="gap">
            <div id="meds-time">
              <TimeSelect
                idPrefix="meds"
                value={form.medsTime}
                onChange={(v) => setField("medsTime", v)}
              />
            </div>
          </Field>
        )}

        {byMeal && (
          <>
            <Field
              label="식사를 기준으로 복약 시간을 설정해주세요."
              htmlFor="meal-meds"
              required
              spacing="gap"
            >
              <div className="meal-meds" id="meal-meds">
                {MEALS.map((meal) => (
                  <div className="meal-meds__row" key={meal}>
                    <span className="meal-meds__check">
                      <Checkbox
                        id={`meal-${meal}`}
                        checked={form.mealMeds[meal].checked}
                        onChange={(checked) => setMealMeds(meal, { checked })}
                      />
                      <label
                        className="meal-meds__label"
                        htmlFor={`meal-${meal}`}
                      >
                        {meal}
                      </label>
                    </span>

                    <div className="meal-meds__relations">
                      {MEAL_RELATIONS.map((relation) => (
                        <ChipsM
                          key={relation}
                          selected={form.mealMeds[meal].relation === relation}
                          onClick={() =>
                            setMealMeds(meal, { relation, checked: true })
                          }
                        >
                          {relation}
                        </ChipsM>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Field>

            <Field
              label="정확한 간격을 안내받았다면"
              htmlFor="meds-interval"
              spacing="gap"
            >
              <div className="meds-interval" id="meds-interval">
                <div className="meds-interval__select">
                  <Select
                    id="meds-interval-select"
                    value={form.medsIntervalMinutes}
                    onChange={(v) => setField("medsIntervalMinutes", v)}
                    options={INTERVALS}
                    placeholder="00"
                  />
                </div>
                <span className="meds-interval__unit">분 간격</span>
              </div>
            </Field>
          </>
        )}
      </div>

      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.memberNewMeds)}>
          이전으로
        </Btn>
        <Btn
          variant={canSubmit ? "primary" : "muted"}
          disabled={!canSubmit}
          onClick={() => canSubmit && navigate(PATHS.memberNewMealtime)}
        >
          다음으로
        </Btn>
      </BottomBar>

      <ExitRegistrationModal open={exitOpen} onCancel={() => setExitOpen(false)} />
    </div>
  );
}
