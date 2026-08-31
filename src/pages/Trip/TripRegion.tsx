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

/**
 * Figma: [7-2] 여행 지역
 *  237:6295 초기(=343:7981) · 343:7871 시/도 선택 · 343:8021 검색
 *
 * 한 화면의 세 상태입니다. 시/도를 고르면 구분선과 시/군/구 칩이 나타납니다.
 *
 * ⚠ 지역 목록이 디자인에 일부만 그려져 있습니다 — `regionData.ts` 참고.
 * ⚠ 검색창의 동작이 적혀 있지 않습니다. 그려진 화면을 그대로 재현했습니다
 *   (`강릉` 입력 → 강원 선택 + 시/군 목록, 시/군은 `전체` 유지).
 */
export default function TripRegion() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const selected = REGIONS.find((r) => r.name === form.province) ?? null;

  const selectProvince = (name: string) => {
    setField("province", name);
    // 시/도를 바꾸면 이전 시/군/구는 의미가 없어 기본값으로 되돌립니다.
    setField("district", ALL_DISTRICTS);
  };

  // 343:8021 — 검색어를 넣으면 맞는 시/도가 선택됩니다.
  const handleQuery = (value: string) => {
    setField("regionQuery", value);
    const matched = findRegionByQuery(value);
    if (matched && matched.name !== form.province) {
      selectProvince(matched.name);
    }
  };

  return (
    <div className="trip-region">
      {/* Header / Variant2 (237:6296) */}
      <Header
        className="trip-region__header"
        onBack={() => navigate(PATHS.tripName)}
      />

      {/* Frame 1707482558 (343:7863) — y54, gap 20 */}
      <div className="trip-region__body">
        <TitleL className="trip-region__title">어디로 떠나시나요?</TitleL>

        {/* Frame 1707482557 (343:6928) — x24 w342, gap 20 */}
        <div className="trip-region__form">
          {/* Input (343:6918) — 돋보기 + 지우기 */}
          <TextInput
            id="trip-region-search"
            value={form.regionQuery}
            onChange={handleQuery}
            placeholder="지역을 검색해보세요"
            leadingIcon={searchIcon}
          />

          {/* Frame 58 (237:6309) — 시/도 */}
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

          {/* 343:7906 / 343:7908 — 시/도를 골라야 나타납니다 */}
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

      {/* bottom (343:7864) — 이전으로 / 다음으로 */}
      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripName)}>
          이전으로
        </Btn>
        {/* ⚠ [7-1]과 같은 이유로 항상 활성입니다 — 아무것도 안 고른 초기 화면
              (237:6295)에도 `다음으로` 가 활성색으로 그려져 있습니다. */}
        <Btn variant="primary" onClick={() => navigate(PATHS.tripDate)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
