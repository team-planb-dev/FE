import "./CardPlace.css";

type CardPlaceProps = {
  name: string;
  address: string;
  onClick: () => void;
};

/**
 * Figma: card_place / Default (343:8999) — 342×78
 * 이름 + 주소 한 줄씩, 아래에 neutral-300 구분선.
 *
 * ⚠ 눌렸을 때(선택된) 상태가 디자인에 없습니다. 누르면 위쪽 태그로 올라가는
 *   구조라 목록에는 선택 표시를 넣지 않았습니다(확인 필요 문서 참고).
 */
export default function CardPlace({ name, address, onClick }: CardPlaceProps) {
  return (
    <button type="button" className="card-place" onClick={onClick}>
      {/* 344:9682 */}
      <span className="card-place__texts">
        <span className="card-place__name">{name}</span>
        <span className="card-place__address">{address}</span>
      </span>
    </button>
  );
}

/** Figma: card_place / Variant3 (344:11109) — 검색 결과가 없을 때 */
export function CardPlaceEmpty({ text }: { text: string }) {
  return (
    <div className="card-place card-place--empty">
      <p className="card-place__empty-text">{text}</p>
    </div>
  );
}
