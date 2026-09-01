import "./EditNote.css";

import checkIcon from "../../assets/icn_check.svg";

type EditNoteProps = {
  items: string[];
};

const TITLE = "수정 사항";

/** AI 가 바꾼 내용 목록 */
export default function EditNote({ items }: EditNoteProps) {
  return (
    <div className="edit-note">
      <p className="edit-note__title">{TITLE}</p>
      <ul className="edit-note__list">
        {items.map((item) => (
          <li className="edit-note__item" key={item}>
            <span className="edit-note__icon" aria-hidden="true">
              <img src={checkIcon} alt="" />
            </span>
            <span className="edit-note__text">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
