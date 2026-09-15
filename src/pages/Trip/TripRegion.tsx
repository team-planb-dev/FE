import { useNavigate } from "react-router-dom";

import "./TripRegion.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import TextInput from "../../components/Input/TextInput";
import Chips from "../../components/Chips/Chips";
import ChipsM from "../../components/ChipsM/ChipsM";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import searchIcon from "../../assets/icn_search.svg";
import { REGIONS, matchRegions } from "./regionData";
import type { Region } from "./regionData";
import { ALL_DISTRICTS, useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** 여행 지역 검색·선택 */
export default function TripRegion() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const typed = form.regionQuery.trim();
  const match = matchRegions(form.regionQuery);

  const selected = REGIONS.find((r) => r.name === form.province) ?? null;

  // 걸리는 게 없으면 전체를 보여줍니다. 빈 화면이 되면 고를 수가 없습니다
  const provinces = match.candidates.length > 0 ? match.candidates : REGIONS;

  // 시/도가 정해졌으면 구 칩도 검색어로 좁힙니다
  const districtHits =
    typed && selected
      ? selected.districts.filter((district) => district.includes(typed))
      : [];
  const districts =
    districtHits.length > 0 ? districtHits : (selected?.districts ?? []);

  const selectProvince = (region: Region) => {
    setField("province", region.name);

    // 검색어가 이 시/도의 구 이름이면 구까지 같이 고릅니다
    setField(
      "district",
      region.districts.includes(typed) ? typed : ALL_DISTRICTS,
    );
  };

  const handleQuery = (value: string) => {
    setField("regionQuery", value);

    const next = matchRegions(value);
    // 후보가 여럿이면(서구 → 인천·대전·…) 찍지 않고 칩만 좁힙니다
    if (!next.region) return;

    setField("province", next.region.name);
    setField("district", next.district ?? ALL_DISTRICTS);
  };

  return (
    <div className="trip-region">
      <Header
        className="trip-region__header"
        onBack={() => navigate(PATHS.tripName)}
      />

      <div className="trip-region__body">
        <TitleL className="trip-region__title">어디로 떠나시나요?</TitleL>
        <div className="trip-region__form">
          <TextInput
            id="trip-region-search"
            value={form.regionQuery}
            onChange={handleQuery}
            placeholder="지역을 검색해보세요"
            leadingIcon={searchIcon}
          />

          <div className="trip-region__provinces">
            {provinces.map((region) => (
              <Chips
                key={region.name}
                selected={form.province === region.name}
                onClick={() => selectProvince(region)}
              >
                {region.name}
              </Chips>
            ))}
          </div>

          {selected && districts.length > 0 && (
            <>
              <hr className="trip-region__divider" />
              <div className="trip-region__districts">
                {[ALL_DISTRICTS, ...districts].map((district) => (
                  <ChipsM
                    key={district}
                    selected={form.district === district}
                    onClick={() => setField("district", district)}
                  >
                    {district}
                  </ChipsM>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripName)}>
          이전으로
        </Btn>

        <Btn variant="primary" onClick={() => navigate(PATHS.tripDate)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
