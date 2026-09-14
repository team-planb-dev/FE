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

import {
  NOT_MATCHED_MESSAGE,
  recoveryErrorMessage,
} from "../../api/recoveryError";
import { findUsername } from "../../api/user";
import { useRecoveryQuestions } from "../../api/useRecoveryQuestions";
import { PATHS } from "../../routes/paths";

import searchIcon from "../../assets/icn_search.svg";

/** 이메일 찾기 */
export default function FindEmail() {
  const navigate = useNavigate();
  const { options, codeOf } = useRecoveryQuestions();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = question.length > 0 && answer.trim().length > 0;

  const submit = async () => {
    if (!canSubmit || submitting) return;

    const code = codeOf(question);
    if (!code) return;

    setSubmitting(true);
    setError(null);

    try {
      const data = await findUsername({
        recoveryQuestion: code,
        recoveryAnswer: answer.trim(),
      });

      // 일치하는 계정이 없으면 빈 값으로 올 수 있습니다
      if (!data?.maskedUsername) {
        setError(NOT_MATCHED_MESSAGE);
        setSubmitting(false);
        return;
      }

      navigate(PATHS.findEmailResult, {
        state: { email: data.maskedUsername },
      });
    } catch (caught) {
      setError(recoveryErrorMessage(caught));
      setSubmitting(false);
    }
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
              setError(null);
            }}
            options={options}
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
              setError(null);
            }}
            placeholder="placeholder"
            leadingIcon={searchIcon}
          />
        </Field>
      </div>

      <BottomBar>
        <Btn
          variant={canSubmit && !submitting ? "primary" : "muted"}
          disabled={!canSubmit || submitting}
          onClick={() => void submit()}
        >
          {submitting ? "확인 중" : "확인"}
        </Btn>
      </BottomBar>

      {error && <Snackbar className="find-email__snackbar">{error}</Snackbar>}
    </div>
  );
}
