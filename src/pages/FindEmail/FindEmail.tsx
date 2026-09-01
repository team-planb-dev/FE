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

const NOT_MATCHED_MESSAGE = "답변이 일치하지 않아요.";

/** 이메일 찾기 */
export default function FindEmail() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [notMatched, setNotMatched] = useState(false);

  const canSubmit = question.length > 0 && answer.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (!notMatched) {
      setNotMatched(true);
      return;
    }
    navigate(PATHS.findEmailResult, { state: { email: "ye***@gmail.com" } });
  };

  return (
    <div className="find-email">
      <Header className="find-email__header" onBack={() => navigate(PATHS.login)} />
      <div className="find-email__content">
        <TitleL className="find-email__title">
          이메일을 잊어버리셨나요?
          <br />
          가입 시에 작성한 질문에 답해주세요.
        </TitleL>

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

      <BottomBar>
        <Btn variant={canSubmit ? "primary" : "muted"} onClick={handleSubmit}>
          확인
        </Btn>
      </BottomBar>

      {notMatched && (
        <Snackbar className="find-email__snackbar">
          {NOT_MATCHED_MESSAGE}
        </Snackbar>
      )}
    </div>
  );
}
