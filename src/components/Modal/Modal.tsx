import { useEffect } from "react";

import "./Modal.css";

import Btn from "../Btn/Btn";

type ModalProps = {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  /** 확인 버튼 색 — 되돌릴 수 없는 동작은 "danger" */
  confirmVariant?: "primary" | "danger";
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Figma: Modal (235:3342) — 340×196, r20, padding 20/0, 딤 rgba(0,0,0,0.6)
 * [6-5] 구성원 삭제(237:7222)에서 처음 등장합니다.
 *
 * ⚠ 딤을 눌렀을 때의 동작이 디자인에 없어 넣지 않았습니다.
 *   Esc 는 접근성상 필요해 취소로 연결했습니다.
 */
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
      {/* 237:7231 — 390×844, rgba(0,0,0,0.6) */}
      <div className="modal-dim" />

      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        {/* 235:3368 */}
        <div className="modal__texts">
          {/* 235:3340 — padding 8/16, 20px SemiBold / 1.4 / -0.2px */}
          <div className="modal__title-row">
            <p className="modal__title" id="modal-title">
              {title}
            </p>
          </div>
          {/* 235:3341 — padding 8/16, 14px Medium / 1.5 / -0.28px / neutral-500 */}
          <div className="modal__desc-row">
            <p className="modal__desc" id="modal-desc">
              {description}
            </p>
          </div>
        </div>

        {/* 235:3362 — w308, 버튼 150×48 두 개 */}
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
