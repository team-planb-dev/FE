import { useLocation, useNavigate } from "react-router-dom";

import { memberEditPath } from "../../routes/paths";

type EditState = { edit?: boolean; memberId?: string; from?: string };

/** [6-4]에서 항목 하나만 고치러 들어온 상태. 등록 흐름과 하단 버튼이 달라집니다 */
export function useEditMode() {
  const navigate = useNavigate();
  const state = useLocation().state as EditState | null;

  const memberId = state?.memberId;
  const editing = state?.edit === true && typeof memberId === "string";

  const backToMember = () => {
    if (!memberId) return;
    navigate(memberEditPath(memberId), { state: { from: state?.from } });
  };

  return { editing, backToMember };
}
