import "./CardPlace.css";

type CardPlaceProps = {
  name: string;
  address: string;
  onClick: () => void;
};

/** 장소 검색 결과 카드 */
export default function CardPlace({ name, address, onClick }: CardPlaceProps) {
  return (
    <button type="button" className="card-place" onClick={onClick}>
      <span className="card-place__texts">
        <span className="card-place__name">{name}</span>
        <span className="card-place__address">{address}</span>
      </span>
    </button>
  );
}

export function CardPlaceEmpty({ text }: { text: string }) {
  return (
    <div className="card-place card-place--empty">
      <p className="card-place__empty-text">{text}</p>
    </div>
  );
}
