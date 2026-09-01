import "./ChatInput.css";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  sendIcon?: string;
  className?: string;
};

/** AI 수정 화면 하단 입력바 */
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
