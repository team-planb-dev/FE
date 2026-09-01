import "./EditNote.css";

type EditNoteProps = {
  /** 393:9064 / 393:9069 — 바뀐 내용 한 줄씩 */
  items: string[];
};

/** 393:9063 */
const TITLE = "수정 사항";

/**
 * Figma: edit_note (393:9071) — r10, padding 12, 세로 gap 20
 *  그림자 0 2px 20px rgba(0,0,0,0.04)
 *
 * ⚠ 컴포넌트 선언 폭은 240 인데 [9-2] 인스턴스는 342 로 늘어나 있어
 *   쓰는 쪽에서 폭을 잡습니다.
 */
export default function EditNote({ items }: EditNoteProps) {
  return (
    <div className="edit-note">
      <p className="edit-note__title">{TITLE}</p>

      {/* 393:9070 — 세로 gap 8 */}
      <ul className="edit-note__list">
        {items.map((item) => (
          <li className="edit-note__item" key={item}>
            {/* icn (393:9051) — 20×20 체크.
                TODO(asset): 에셋이 없어 자리만 잡았습니다. */}
            <span className="edit-note__icon" aria-hidden="true" />
            <span className="edit-note__text">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
