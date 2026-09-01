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

/** 민감정보 수집·이용 동의 전문 */
export default function MemberConsent() {
  const navigate = useNavigate();
  const { setField } = useMemberForm();

  const close = () => navigate(PATHS.memberNew);

  return (
    <div className="member-consent">
      <Header
        className="member-consent__header"
        variant="close"
        onBack={close}
      />

      <p className="member-consent__title">{SENSITIVE_CONSENT_TITLE}</p>
      <div className="member-consent__body">
        <p className="member-consent__paragraph">{SENSITIVE_CONSENT_BODY}</p>
        <ul className="member-consent__list">
          {SENSITIVE_CONSENT_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="member-consent__paragraph">{SENSITIVE_CONSENT_REST}</p>
      </div>

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
