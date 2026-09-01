import "./ChatInput.css";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  /** 전송 버튼 20×20 아이콘. 없으면 자리만 잡습니다 */
  sendIcon?: string;
  className?: string;
};

/**
 * Figma: chat (393:8410) — 390×120 하단 입력바
 *  흰 배경, 위쪽 모서리 r20, 그림자 0 -2 20 rgba(0,0,0,0.05), padding 16/20
 *  안쪽 (393:8409) 가로 gap 10, 아래 정렬
 *   - textarea 300×88, r10, 배경 neutral-50, padding 16
 *       기본  (120:1143) 테두리 없음, placeholder neutral-400
 *       포커스 (393:8318) 테두리 1px Brand/Solid, 글자 neutral-800  — [9-3] 393:12372
 *   - 전송 버튼 40×40, r2000
 *       Enabled  (393:8293) Brand/Accent #35A68E
 *       Disabled (393:8319) neutral-300 #D4D4D4                    — [9-3] 393:12372
 *
 * TODO(asset): 전송 아이콘(393:8402, icn_empty_s 20×20) 에셋이 없어
 *   `sendIcon` 을 안 주면 빈 자리로 둡니다.
 *
 * ⚠ **언제 비활성인지 디자인이 어긋납니다.** `393:12318` 은 아무것도 안 쓴 상태인데
 *   Enabled 이고, `393:12357` 은 ".." 을 쓴 상태인데 Disabled 입니다.
 *   여기서는 **입력이 비면 비활성**으로 두었습니다(확인 필요 문서 참고).
 */
export default function ChatInput({
  value,
  onChange,
  onSend,
  placeholder,
  sendIcon,
  className,
}: ChatInputProps) {
  return (
    <div className={`chat-input${className ? ` ${className}` : ""}`}>
      <div className="chat-input__row">
        <textarea
          className="chat-input__field"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="chat-input__send"
          aria-label="보내기"
          onClick={onSend}
          disabled={value.trim().length === 0}
        >
          {sendIcon ? (
            <img className="chat-input__send-icon" src={sendIcon} alt="" />
          ) : (
            <span className="chat-input__send-icon" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
