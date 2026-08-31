import { useNavigate } from "react-router-dom";

import "./MemberConsent.css";

import Header from "../../components/Header/Header";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import {
  SENSITIVE_CONSENT_BODY,
  SENSITIVE_CONSENT_ITEMS,
  SENSITIVE_CONSENT_REST,
  SENSITIVE_CONSENT_TITLE,
} from "./sensitiveConsentText";
import { useMemberForm } from "./memberFormContext";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-6] 민감정보 수집·이용 동의 전체보기 (237:6649)
 *
 * [S3-6] 약관 전체보기와 달리 본문 전문이 디자인에 작성되어 있습니다.
 * 본문 높이가 720px 이라 프레임(844)을 넘어가므로 세로 스크롤을 넣었습니다.
 *
 * 하단 버튼 동작은 [S3-6] 약관 전체보기와 같게 맞췄습니다 —
 * [동의하기]는 체크하고 닫고, [닫기]는 체크하지 않고 닫습니다.
 */
export default function MemberConsent() {
  const navigate = useNavigate();
  const { setField } = useMemberForm();

  const close = () => navigate(PATHS.memberNew);

  return (
    <div className="member-consent">
      {/* Header / Variant3 (237:6650) */}
      <Header
        className="member-consent__header"
        variant="close"
        onBack={close}
      />

      {/* 237:6652 — y74, 16px Medium / 1.7 / -0.32px / neutral-800
          ⚠ 피그마 x 는 25 인데 본문은 24 입니다. 24 로 맞췄습니다. */}
      <p className="member-consent__title">{SENSITIVE_CONSENT_TITLE}</p>

      {/* 237:6651 — x24 y125, w342, 14px Medium / 1.7 / -0.28px / neutral-600 */}
      <div className="member-consent__body">
        <p className="member-consent__paragraph">{SENSITIVE_CONSENT_BODY}</p>
        <ul className="member-consent__list">
          {SENSITIVE_CONSENT_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="member-consent__paragraph">{SENSITIVE_CONSENT_REST}</p>
      </div>

      {/* bottom (237:6653) */}
      <BottomBar>
        <Btn variant="outline" onClick={close}>
          닫기
        </Btn>
        <Btn
          variant="primary"
          onClick={() => {
            setField("sensitiveAgreed", true);
            close();
          }}
        >
          동의하기
        </Btn>
      </BottomBar>
    </div>
  );
}
