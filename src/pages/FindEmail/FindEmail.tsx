import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./FindEmail.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import Select from "../../components/Select/Select";
import TextInput from "../../components/Input/TextInput";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";
import Snackbar from "../../components/Snackbar/Snackbar";

import { RECOVERY_QUESTIONS } from "../../constants/recoveryQuestions";
import { PATHS } from "../../routes/paths";

import searchIcon from "../../assets/icn_search.svg";

/**
 * Figma: [S4] 이메일 찾기
 *  237:7456  [4-1]   기본
 *  237:7486  [4-2-1] 드롭다운 열림
 *  237:7497  [4-2-2] 질문 선택됨
 *  237:7508  [4-4]   실패 — Snackbar
 * 디자인 노트 1 — 헤더 왼쪽 화살표를 누르면 [S2] 로그인으로 돌아갑니다.
 */

/** Figma 237:7519 */
const NOT_MATCHED_MESSAGE = "답변이 일치하지 않아요.";

export default function FindEmail() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [notMatched, setNotMatched] = useState(false);

  const canSubmit = question.length > 0 && answer.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    // TODO(api): 이메일 조회 API로 교체하세요.
    // 성공 시 마스킹된 이메일을 결과 화면으로 넘기고, 실패 시 setNotMatched(true).
    //
    // 지금은 서버가 없어 임시로 동작합니다 — 첫 클릭은 실패([4-4] Snackbar),
    // 한 번 더 누르면 성공([4-3])으로 넘어가 두 상태를 모두 확인할 수 있습니다.
    // 성공이 먼저면 화면이 바로 넘어가 실패 상태를 볼 수 없어 이 순서로 두었습니다.
    if (!notMatched) {
      setNotMatched(true);
      return;
    }
    navigate(PATHS.findEmailResult, { state: { email: "ye***@gmail.com" } });
  };

  return (
    <div className="find-email">
      <Header className="find-email__header" onBack={() => navigate(PATHS.login)} />

      {/* Frame 1707482519 (237:7458) — top 54, gap 40 */}
      <div className="find-email__content">
        <TitleL className="find-email__title">
          이메일을 잊어버리셨나요?
          <br />
          가입 시에 작성한 질문에 답해주세요.
        </TitleL>

        {/* Frame 1707482517 (237:7460) — 342×90 */}
        <Field
          className="find-email__field"
          label="가입 시 설정한 계정 복구 질문을 선택해주세요."
          htmlFor="find-email-question"
          spacing="none"
        >
          <Select
            id="find-email-question"
            value={question}
            onChange={(v) => {
              setQuestion(v);
              setNotMatched(false);
            }}
            options={RECOVERY_QUESTIONS}
            placeholder="계정 복구 질문을 선택해주세요."
          />
        </Field>

        {/* Frame 1707482518 (237:7463) — 342×90 */}
        <Field
          className="find-email__field"
          label="질문의 답변을 작성해주세요."
          htmlFor="find-email-answer"
          spacing="none"
        >
          <TextInput
            id="find-email-answer"
            value={answer}
            onChange={(v) => {
              setAnswer(v);
              setNotMatched(false);
            }}
            placeholder="placeholder"
            leadingIcon={searchIcon}
          />
        </Field>
      </div>

      {/* bottom (237:7466) */}
      <BottomBar>
        <Btn variant={canSubmit ? "primary" : "muted"} onClick={handleSubmit}>
          확인
        </Btn>
      </BottomBar>

      {/* [4-4] Snackbar (237:7519) — x24 y670 */}
      {notMatched && (
        <Snackbar className="find-email__snackbar">
          {NOT_MATCHED_MESSAGE}
        </Snackbar>
      )}
    </div>
  );
}
