import { useNavigate } from "react-router-dom";

import Modal from "../../components/Modal/Modal";

import { useMemberForm } from "./memberFormContext";
import { PATHS } from "../../routes/paths";

type ExitRegistrationModalProps = {
  open: boolean;
  onCancel: () => void;
};

/** 구성원 등록 중 이탈 확인 모달 */
export default function ExitRegistrationModal({
  open,
  onCancel,
}: ExitRegistrationModalProps) {
  const navigate = useNavigate();
  const { reset } = useMemberForm();

  if (!open) return null;

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
