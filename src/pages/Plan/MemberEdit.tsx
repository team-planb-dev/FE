import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./MemberEdit.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";
import Snackbar from "../../components/Snackbar/Snackbar";

import editIcon from "../../assets/icn_edit.svg";
import { fetchCompanionDetail } from "../../api/companion";
import { toMemberForm } from "./companionForm";
import { MEALS, useMemberForm } from "./memberFormContext";
import type { Meal, MemberForm } from "./memberFormContext";
import { useMemberSubmit } from "./useMemberSubmit";
import type { MemberNavState } from "./memberData";
import { PATHS } from "../../routes/paths";

const NONE = "없음";
const LOAD_FAILED = "건강정보를 불러오지 못했어요.";

/** 구성원 건강정보 확인·수정 */
export default function MemberEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberId } = useParams();

  const state = location.state as MemberNavState | null;
  const from = state?.from;
  const members = state?.members;
  const backTo = from ?? PATHS.planMembers;

  const { form, loadedId, hydrate } = useMemberForm();
  const { save, submitting, error: saveError } = useMemberSubmit();

  const [loadFailed, setLoadFailed] = useState(false);

  // 단계 화면을 다녀온 경우에는 폼에 이미 고친 값이 들어 있어 다시 불러오지 않습니다
  const needsLoad = Boolean(memberId) && loadedId !== memberId;
  const loading = needsLoad && !loadFailed;

  useEffect(() => {
    if (!memberId || loadedId === memberId) return;

    let alive = true;

    fetchCompanionDetail(Number(memberId))
      .then((detail) => {
        if (alive) hydrate(toMemberForm(detail), memberId);
      })
      .catch(() => {
        if (alive) setLoadFailed(true);
      });

    return () => {
      alive = false;
    };
  }, [memberId, loadedId, hydrate]);

  const rows = rowsOf(form);
  const error = loadFailed ? LOAD_FAILED : saveError;

  return (
    <div className="member-edit">
      <Header
        className="member-edit__header"
        variant="title"
        title="여행 일정 설정"
      />

      <div className="member-edit__heading">
        <p className="member-edit__title">
          {form.name || "{구성원 이름}"}의
          <br />
          건강정보를 확인해주세요.
        </p>
        <p className="member-edit__subtitle">아이콘을 눌러 다시 수정할 수 있어요.</p>
      </div>

      {loading ? (
        <p className="member-edit__status">불러오는 중…</p>
      ) : (
        <dl className="member-edit__rows">
          {rows.map((row) => (
            <div className="member-edit__row" key={row.key}>
              <dt className="member-edit__label">{row.label}</dt>
              <dd className="member-edit__value">
                <span className="member-edit__value-text">{row.value}</span>
                <button
                  type="button"
                  className="member-edit__edit"
                  aria-label={`${row.label} 수정`}
                  onClick={() =>
                    navigate(row.to, {
                      state: { edit: true, memberId, from, members },
                    })
                  }
                >
                  <img
                    className="member-edit__edit-icon"
                    src={editIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </button>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {error && <Snackbar className="member-edit__snackbar">{error}</Snackbar>}

      <div className="member-edit__bottom">
        <Btn
          variant={loading || submitting ? "muted" : "primary"}
          className="member-edit__submit"
          disabled={loading || submitting}
          onClick={() => memberId && void save(memberId, backTo, { members })}
        >
          {submitting ? "저장 중" : "확인"}
        </Btn>
      </div>
    </div>
  );
}

/* ─────────────────── 표시용 문구 ─────────────────── */

type Row = { key: string; label: string; value: string; to: string };

function rowsOf(form: MemberForm): Row[] {
  return [
    {
      key: "conditions",
      label: "관리 질환",
      value: form.conditions.length > 0 ? form.conditions.join(", ") : NONE,
      to: PATHS.memberNewHealth,
    },
    {
      key: "walk",
      label: "걷기 정도",
      value: form.walkLevel ?? NONE,
      to: PATHS.memberNewHealth,
    },
    {
      key: "meds",
      label: "복약 여부",
      value: form.takesMeds === "yes" ? "복약정보 있음" : "복약정보 없음",
      to: PATHS.memberNewMeds,
    },
    {
      key: "medsTime",
      label: "복약 시간",
      value: medsTimeText(form),
      to: PATHS.memberNewMedsDetail,
    },
    {
      key: "mealTime",
      label: "식사 시간",
      value: mealTimeText(form),
      to: PATHS.memberNewMealtime,
    },
    {
      key: "allergy",
      label: "알레르기",
      value: form.hasAllergy === "yes" ? form.allergyText || NONE : NONE,
      to: PATHS.memberNewFood,
    },
    {
      key: "food",
      label: "기피음식",
      value:
        form.hasDislikedFood === "yes" ? form.dislikedFoodText || NONE : NONE,
      to: PATHS.memberNewFood,
    },
  ];
}

function medsTimeText(form: MemberForm): string {
  if (form.takesMeds !== "yes") return NONE;

  if (form.medsTiming === "특정 시간대에 먹어요") {
    const { meridiem, hour, minute } = form.medsTime;
    return meridiem && hour && minute ? `${meridiem} ${hour}:${minute}` : NONE;
  }

  if (form.medsTiming === "식사를 기준으로 기억해요") {
    const picked = MEALS.filter((meal) => form.mealMeds[meal].checked).map(
      (meal) => `${meal} ${form.mealMeds[meal].relation ?? "무관"}`,
    );
    return picked.length > 0 ? picked.join(", ") : NONE;
  }

  return form.medsTiming ?? NONE;
}

function mealTimeText(form: MemberForm): string {
  if (form.reflectMealtime !== "yes") return "반영 안 함";

  const picked = MEALS.filter((meal) => form.mealTimes[meal].checked).map(
    (meal) => `${meal} ${timeText(form, meal)}`,
  );

  return picked.length > 0 ? picked.join(", ") : NONE;
}

function timeText(form: MemberForm, meal: Meal): string {
  const { meridiem, hour, minute } = form.mealTimes[meal].time;
  return meridiem && hour && minute ? `${meridiem} ${hour}:${minute}` : "";
}
