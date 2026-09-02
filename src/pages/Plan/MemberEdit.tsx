import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./MemberEdit.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";

import editIcon from "../../assets/icn_edit.svg";
import { PATHS } from "../../routes/paths";

const MOCK_ROWS = [
  { key: "conditions", label: "관리 질환", value: "당뇨", to: PATHS.memberNewHealth },
  { key: "walk", label: "걷기 정도", value: "많이 걸어도 좋아요", to: PATHS.memberNewHealth },
  { key: "meds", label: "복약 여부", value: "복약정보 있음", to: PATHS.memberNewMeds },
  { key: "medsTime", label: "복약 시간", value: "복약 시간 수정", to: PATHS.memberNewMedsDetail },
  { key: "mealTime", label: "식사 시간", value: "식사 시간 수정", to: PATHS.memberNewMealtime },
  { key: "allergy", label: "알레르기", value: "free text", to: PATHS.memberNewFood },
  { key: "food", label: "기피음식", value: "free text", to: PATHS.memberNewFood },
] as const;

const SUBMIT_LABEL = "확인";

/** 구성원 건강정보 확인·수정 */
export default function MemberEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberId } = useParams();

  const from = (location.state as { from?: string } | null)?.from;
  const backTo = from ?? PATHS.planMembers;

  return (
    <div className="member-edit">
      <Header
        className="member-edit__header"
        variant="title"
        title="여행 일정 설정"
      />

      <div className="member-edit__heading">
        <p className="member-edit__title">
          {"{구성원 이름}"}의
          <br />
          건강정보를 확인해주세요.
        </p>
        <p className="member-edit__subtitle">아이콘을 눌러 다시 수정할 수 있어요.</p>
      </div>

      <dl className="member-edit__rows">
        {MOCK_ROWS.map((row) => (
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
                    state: { edit: true, memberId, from },
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

      <div className="member-edit__bottom">
        <Btn
          variant="primary"
          className="member-edit__submit"
          onClick={() => navigate(backTo)}
        >
          {SUBMIT_LABEL}
        </Btn>
      </div>

      <span hidden data-member-id={memberId} />
    </div>
  );
}
