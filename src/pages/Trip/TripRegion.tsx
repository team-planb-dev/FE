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
import { REGIONS, findRegionByQuery } from "./regionData";
import { ALL_DISTRICTS, useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** 여행 지역 검색·선택 */
export default function TripRegion() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const selected = REGIONS.find((r) => r.name === form.province) ?? null;

  const selectProvince = (name: string) => {
    setField("province", name);

    setField("district", ALL_DISTRICTS);
  };

  const handleQuery = (value: string) => {
    setField("regionQuery", value);
    const matched = findRegionByQuery(value);
    if (matched && matched.name !== form.province) {
      selectProvince(matched.name);
    }
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
            {REGIONS.map((region) => (
              <Chips
                key={region.name}
                selected={form.province === region.name}
                onClick={() => selectProvince(region.name)}
              >
                {region.name}
              </Chips>
            ))}
          </div>

          {selected && (
            <>
              <hr className="trip-region__divider" />
              <div className="trip-region__districts">
                {[ALL_DISTRICTS, ...selected.districts].map((district) => (
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
