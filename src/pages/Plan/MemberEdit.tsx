import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./MemberEdit.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";

import editIcon from "../../assets/icn_edit.svg";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-4] 구성원 수정 — 건강정보 확인 (237:7164)
 *
 * [6-4]의 첫 화면(237:7154)은 [6-3] 구성원 선택 목록 그대로라 새로 만들지 않았습니다.
 * 카드의 [수정]을 누르면 이 화면으로 옵니다.
 *
 * [11-3] 여행 구성원 수정하기(237:7368)도 **이 화면과 완전히 같습니다**
 * (헤더 문구 "여행 일정 설정"까지 같습니다). 그래서 [11-2] 목록에서도 이리로 옵니다.
 * 어디서 왔는지에 따라 [확인] 이 돌아갈 곳만 달라집니다.
 *
 * ⚠ 이 화면은 다른 [S6] 화면과 규칙이 많이 다릅니다(확인 필요 문서 참고).
 *   · 제목이 title_L(22px)이 아니라 24px 직접 텍스트, 부제도 18px 입니다.
 *   · 색이 팔레트 밖입니다 — #121212 · #414141 · #222 · #636363.
 *   · 하단이 bottom(그라데이션) 이 아니라 x24 y756 342×58 버튼 하나입니다.
 *   · 헤더가 가운데 타이틀형인데 문구가 "여행 일정 설정" 입니다.
 *   전부 원본 그대로 재현했습니다.
 */

/**
 * TODO(api): 구성원 상세 조회 API로 교체하세요.
 * 값은 전부 디자인에 적힌 예시 그대로입니다.
 */
const MOCK_ROWS = [
  { key: "conditions", label: "관리 질환", value: "당뇨", to: PATHS.memberNewHealth },
  { key: "walk", label: "걷기 정도", value: "많이 걸어도 좋아요", to: PATHS.memberNewHealth },
  { key: "meds", label: "복약 여부", value: "복약정보 있음", to: PATHS.memberNewMeds },
  { key: "medsTime", label: "복약 시간", value: "복약 시간 수정", to: PATHS.memberNewMedsDetail },
  { key: "mealTime", label: "식사 시간", value: "식사 시간 수정", to: PATHS.memberNewMealtime },
  { key: "allergy", label: "알레르기", value: "free text", to: PATHS.memberNewFood },
  { key: "food", label: "기피음식", value: "free text", to: PATHS.memberNewFood },
] as const;

/**
 * ⚠ 하단 버튼의 문구가 디자인에 `label` 플레이스홀더 그대로입니다(237:7167).
 *   화면 성격에 맞춰 임시로 작성했습니다. 확정되면 이 상수만 고치면 됩니다.
 */
const SUBMIT_LABEL = "확인";

export default function MemberEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { memberId } = useParams();

  /** [6-3] 구성원 선택에서 왔으면 거기로, [11-2] 마이페이지 목록에서 왔으면 거기로 */
  const from = (location.state as { from?: string } | null)?.from;
  const backTo = from ?? PATHS.planMembers;

  return (
    <div className="member-edit">
      {/* Header (237:7165) — 가운데 타이틀
          ⚠ 구성원 수정 화면인데 문구가 "여행 일정 설정" 입니다. */}
      <Header
        className="member-edit__header"
        variant="title"
        title="여행 일정 설정"
      />

      {/* Frame 76 (237:7168) — x24 y94, 253×107 */}
      <div className="member-edit__heading">
        <p className="member-edit__title">
          {/* TODO(api): 실제 구성원 이름으로 교체하세요. */}
          {"{구성원 이름}"}의
          <br />
          건강정보를 확인해주세요.
        </p>
        <p className="member-edit__subtitle">아이콘을 눌러 다시 수정할 수 있어요.</p>
      </div>

      {/* Frame 91 (237:7172) — x24 y241, 324×288. 80 / 206 두 칸, 간격 38 · 20 */}
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
                onClick={() => navigate(row.to)}
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

      {/* Bottom (237:7166) — x24 y756, 342×58. bottom 컴포넌트가 아닙니다. */}
      <div className="member-edit__bottom">
        <Btn
          variant="primary"
          className="member-edit__submit"
          onClick={() => navigate(backTo)}
        >
          {SUBMIT_LABEL}
        </Btn>
      </div>

      {/* memberId 는 라우트에서 받지만 목업이라 아직 쓰지 않습니다 */}
      <span hidden data-member-id={memberId} />
    </div>
  );
}
