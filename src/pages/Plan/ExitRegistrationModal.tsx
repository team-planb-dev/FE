import { useNavigate } from "react-router-dom";

import Modal from "../../components/Modal/Modal";

import { useMemberForm } from "./memberFormContext";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-7] 구성원 등록 중 이탈 (237:7233)
 *  237:7236 등록 화면 · 237:7248 딤 + 모달
 *
 * 개발 노트
 *  1 (237:7270) — 상단 네비게이션의 X 를 누르면 [나가기]. 등록 과정에서 아예 이탈합니다.
 *                 이전 스텝으로 돌아가는 [이전으로]와는 다릅니다.
 *  2 (237:7276) — [그만두기] 선택 시 메인 홈으로.
 *
 * 모달 자체는 [6-5] 삭제 확인과 같은 Modal(235:3342)이라 그대로 씁니다.
 * 문구만 다릅니다 — 딤 rgba(0,0,0,0.6), 340×196 @ (25,282) 전부 동일합니다.
 */

type ExitRegistrationModalProps = {
  open: boolean;
  onCancel: () => void;
};

export default function ExitRegistrationModal({
  open,
  onCancel,
}: ExitRegistrationModalProps) {
  const navigate = useNavigate();
  const { reset } = useMemberForm();

  if (!open) return null;

  // 개발 노트 2 — 메인 홈으로. "저장되지 않아요" 이므로 입력값도 비웁니다.
  const leave = () => {
    reset();
    navigate(PATHS.home);
  };

  return (
    <Modal
      title="구성원 등록을 그만둘까요?"
      description="작성 중인 내용은 저장되지 않아요"
      cancelLabel="취소"
      confirmLabel="그만두기"
      confirmVariant="danger"
      onCancel={onCancel}
      onConfirm={leave}
    />
  );
}
