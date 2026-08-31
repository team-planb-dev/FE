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

/** 분 간격 선택지 — 디자인에 목록이 없어 일반적인 값으로 채웠습니다. */
const INTERVALS = ["30", "60", "90", "120"];

/**
 * Figma: [6-6] 약 이름 + 복약 시점 (237:6690 / 237:6704 / 237:6717)
 *
 * 개발 노트
 *  · '특정 시간대에 먹어요'를 고르면 복약 시간 옵션이 나타납니다 (237:6731).
 *  · '식사를 기준으로 기억해요'를 고르면 복약 시간 옵션과
 *    '정확한 간격(선택)' 옵션이 나타납니다 (237:6753).
 *  · 스크롤이 길어져도 하단 버튼은 고정입니다 (237:6804).
 */
export default function MemberMedsDetail() {
  const navigate = useNavigate();
  /** [6-7] 등록 중 이탈 확인 모달 (237:7248) */
  const [exitOpen, setExitOpen] = useState(false);
  const { form, setField, setMealMeds } = useMemberForm();

  const byTime = form.medsTiming === "특정 시간대에 먹어요";
  const byMeal = form.medsTiming === "식사를 기준으로 기억해요";

  // '특정 시간대'는 시간 3칸, '식사 기준'은 끼니를 하나 이상 골라야 넘어갑니다.
  // '잘 모르겠어요'는 뒤따르는 화면이 없어 시점만 고르면 됩니다.
  const detailDone = byTime
    ? Boolean(form.medsTime.meridiem && form.medsTime.hour && form.medsTime.minute)
    : byMeal
      ? MEALS.some((m) => form.mealMeds[m].checked)
      : true;

  const canSubmit =
    form.medsLabel.trim().length > 0 && form.medsTiming !== null && detailDone;

  return (
    <div className="member-meds-detail">
      {/* Header / Variant3 (237:6691) */}
      <Header
        className="member-meds-detail__header"
        variant="close"
        backLabel="구성원 등록 그만두기"
        onBack={() => setExitOpen(true)}
      />

      {/* heading (237:6700) — 복약 여부 화면과 같은 제목·부제 */}
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

      {/* 237:6692 — x24 y228, w342, gap 40 */}
      <div className="member-meds-detail__form">
        {/* Frame 133 (237:6693) — padding 8/0, gap 8 → 라벨 36 + 인풋 54 + 패딩 16 = 114 */}
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

        {/* 237:6694 — 라벨 36 + gap 8 + 칩 3줄(gap 12) */}
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

        {/* 237:6740 — '특정 시간대에 먹어요' 를 고르면 나타납니다 (개발 노트) */}
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

        {/* 237:6763 — '식사를 기준으로 기억해요' 를 고르면 나타납니다 (개발 노트) */}
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

            {/* 237:6796 — 필수 표시가 없습니다(선택 항목) */}
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

      {/* bottom (237:6703) — 이전으로 / 다음으로.
          개발 노트: 스크롤이 길어져도 하단 버튼은 고정입니다 (237:6804). */}
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

      {/* [6-7] 등록 중 이탈 (237:7248) — 딤이 하단 바까지 덮도록 맨 뒤에 둡니다 */}
      <ExitRegistrationModal open={exitOpen} onCancel={() => setExitOpen(false)} />
    </div>
  );
}
