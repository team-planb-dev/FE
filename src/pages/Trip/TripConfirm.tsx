import { useNavigate } from "react-router-dom";

import "./TripConfirm.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import editIcon from "../../assets/icn_edit.svg";
import { ALL_DISTRICTS, NIGHT_OPTIONS, useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** YYYY-MM-DD → 2026.08.01 */
function formatDate(dateKey: string) {
  return dateKey.replaceAll("-", ".");
}

/** 출발일 + 박수 → 2026.08.01 - 2026.08.02 (237:6527) */
function formatRange(startDate: string | null, nights: number) {
  if (!startDate) return "";
  const [y, m, d] = startDate.split("-").map(Number);
  const end = new Date(y, m - 1, d + nights);
  const endKey = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(
    end.getDate(),
  ).padStart(2, "0")}`;
  return nights === 0
    ? formatDate(startDate)
    : `${formatDate(startDate)} - ${formatDate(endKey)}`;
}

/**
 * Figma: [7-9] 입력 정보 확인 (237:6512)
 *
 * 6행 요약 + 각 행의 연필 아이콘으로 해당 화면에 돌아갑니다.
 * [6-4] 구성원 수정과 구조가 같습니다(80 / 38 / 206 그리드).
 *
 * ⚠ [7-1]에서 받은 **일정 이름 행이 없습니다.** 6행에 이름이 안 들어갑니다.
 * ⚠ 값이 비어 있을 때(고르지 않고 넘어온 경우)의 표기가 디자인에 없습니다.
 *   빈 문자열 대신 `-` 를 넣었습니다(확인 필요 문서 참고).
 */
export default function TripConfirm() {
  const navigate = useNavigate();
  const { form } = useTripForm();

  const nightsLabel =
    NIGHT_OPTIONS.find((o) => o.nights === form.nights)?.label ?? "";

  const region = [form.province, form.district !== ALL_DISTRICTS ? form.district : null]
    .filter(Boolean)
    .join(" ");

  const rows = [
    { key: "region", label: "여행 지역", value: region, to: PATHS.tripRegion },
    {
      key: "date",
      label: "여행 일정",
      value: formatRange(form.startDate, form.nights) || nightsLabel,
      to: PATHS.tripDate,
    },
    {
      key: "transport",
      label: "이동 수단",
      value: form.transport ?? "",
      to: PATHS.tripTransport,
    },
    {
      key: "place",
      label: "예약 장소",
      value: form.places.map((p) => p.name).join(", "),
      to: PATHS.tripPlace,
    },
    { key: "style", label: "여행 스타일", value: form.style ?? "", to: PATHS.tripStyle },
    { key: "theme", label: "여행 테마", value: form.theme ?? "", to: PATHS.tripTheme },
  ];

  return (
    <div className="trip-confirm">
      {/* Header / Variant2 (237:6513) */}
      <Header
        className="trip-confirm__header"
        onBack={() => navigate(PATHS.tripFood)}
      />

      {/* heading (343:9197) — y54 */}
      <div className="trip-confirm__heading">
        <TitleL>
          입력한 여행 정보를
          <br />
          다시 한 번 확인해주세요.
        </TitleL>
        <Subtitle>아이콘을 눌러 다시 수정할 수 있어요.</Subtitle>
      </div>

      {/* Frame 91 (237:6520) — x24 y226, 324×244 */}
      <dl className="trip-confirm__rows">
        {rows.map((row) => (
          <div className="trip-confirm__row" key={row.key}>
            <dt className="trip-confirm__label">{row.label}</dt>
            <dd className="trip-confirm__value">
              <span className="trip-confirm__value-text">{row.value || "-"}</span>
              <button
                type="button"
                className="trip-confirm__edit"
                aria-label={`${row.label} 수정`}
                onClick={() => navigate(row.to)}
              >
                <img
                  className="trip-confirm__edit-icon"
                  src={editIcon}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </dd>
          </div>
        ))}
      </dl>

      {/* bottom (343:9208) — 버튼 1개 */}
      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripLoading)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
