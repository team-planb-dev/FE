import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiRequestError } from "../../api/client";
import { addCompanion, updateCompanion } from "../../api/companion";

import { toCompanionRequest } from "./companionForm";
import { useMemberForm } from "./memberFormContext";
import { PATHS } from "../../routes/paths";

const REGISTER_FAILED = "등록하지 못했어요.";
const SAVE_FAILED = "저장하지 못했어요.";
const NETWORK_FAILED = "잠시 후 다시 시도해주세요.";

/** 구성원 등록([6-6])과 수정([6-4]) 요청을 보냅니다 */
export function useMemberSubmit() {
  const navigate = useNavigate();
  const { form, reset } = useMemberForm();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const registeredName = form.name.trim();

    try {
      await addCompanion(toCompanionRequest(form));
    } catch (caught) {
      setError(messageOf(caught, REGISTER_FAILED));
      setSubmitting(false);
      return;
    }

    // 다음 등록을 위해 폼을 비우고 목록으로 돌아갑니다
    reset();
    navigate(PATHS.planMembers, {
      state: { justRegistered: true, registeredName },
      replace: true,
    });
  };

  const save = async (memberId: string, backTo: string, backState?: unknown) => {
    if (submitting) return;

    const healthId = Number(memberId);
    if (!Number.isFinite(healthId)) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateCompanion({ healthId, ...toCompanionRequest(form) });
    } catch (caught) {
      setError(messageOf(caught, SAVE_FAILED));
      setSubmitting(false);
      return;
    }

    reset();
    navigate(backTo, { state: backState });
  };

  return { register, save, submitting, error };
}

function messageOf(caught: unknown, fallback: string): string {
  if (!(caught instanceof ApiRequestError)) return NETWORK_FAILED;

  // Snackbar 가 한 줄이라 서버 문구가 길면 잘립니다
  const fromServer = caught.message.trim();
  return fromServer && fromServer.length <= 20 ? fromServer : fallback;
}
