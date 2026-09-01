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
 *   - Textarea (120:1143 변형) 300×88, r10, 배경 neutral-50, padding 16
 *   - 전송 버튼 (393:8293) 40×40, r2000, 배경 Brand/Accent(#35A68E)
 *
 * TODO(asset): 전송 아이콘(393:8402, icn_empty_s 20×20) 에셋이 없어
 *   `sendIcon` 을 안 주면 빈 자리로 둡니다.
 *
 * ⚠ 전송 버튼은 393:8293 의 Enabled 변형만 디자인에 있습니다. 입력이 비어 있을 때의
 *   모습이 없어 비활성 처리를 하지 않았습니다(확인 필요 문서 참고).
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
