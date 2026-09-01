import { useEffect } from "react";

import "./Modal.css";

import Btn from "../Btn/Btn";

type ModalProps = {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmVariant?: "primary" | "danger";
  onCancel: () => void;
  onConfirm: () => void;
};

/** 확인 모달 */
export default function Modal({
  title,
  description,
  cancelLabel,
  confirmLabel,
  confirmVariant = "primary",
  onCancel,
  onConfirm,
}: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <>
      <div className="modal-dim" />
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >

        <div className="modal__texts">
          <div className="modal__title-row">
            <p className="modal__title" id="modal-title">
              {title}
            </p>
          </div>

          <div className="modal__desc-row">
            <p className="modal__desc" id="modal-desc">
              {description}
            </p>
          </div>
        </div>

        <div className="modal__actions">
          <Btn variant="outline" size="md" onClick={onCancel}>
            {cancelLabel}
          </Btn>
          <Btn variant={confirmVariant} size="md" onClick={onConfirm}>
            {confirmLabel}
          </Btn>
        </div>
      </div>
    </>
  );
}
