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

function formatDate(dateKey: string) {
  return dateKey.replaceAll("-", ".");
}

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

/** 입력 정보 확인. 각 행에서 해당 단계로 돌아갑니다 */
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
      <Header
        className="trip-confirm__header"
        onBack={() => navigate(PATHS.tripFood)}
      />

      <div className="trip-confirm__heading">
        <TitleL>
          입력한 여행 정보를
          <br />
          다시 한 번 확인해주세요.
        </TitleL>
        <Subtitle>아이콘을 눌러 다시 수정할 수 있어요.</Subtitle>
      </div>

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

      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripLoading)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
