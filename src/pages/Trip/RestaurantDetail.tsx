import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import "./RestaurantDetail.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Tag from "../../components/Tag/Tag";
import KakaoMap from "../../components/KakaoMap/KakaoMap";

import { MOCK_RESTAURANT, NUTRITION_NOTICE } from "./restaurantData";
import { PATHS } from "../../routes/paths";

/** 식당 상세. 대표 메뉴 · 영양 정보 · 식당 정보 · 지도 */
export default function RestaurantDetail() {
  const navigate = useNavigate();
  const place = MOCK_RESTAURANT;

  const nutritionRows = [
    { key: "carbohydrate", label: "탄수화물", value: place.nutrition.carbohydrate },
    { key: "sodium", label: "나트륨", value: place.nutrition.sodium },
    { key: "fat", label: "지방", value: place.nutrition.fat },
  ];

  const infoRows = [
    { key: "hours", label: "영업 시간", value: place.openingHours },
    { key: "address", label: "주소", value: place.address },
  ];

  return (
    <div className="restaurant-detail">
      <Header
        className="restaurant-detail__header"
        variant="title"
        title="여행 일정 생성"
        onBack={() => navigate(PATHS.tripDetail)}
      />

      <div className="restaurant-detail__body">
        <div className="restaurant-detail__img">
          {place.image ? <img src={place.image} alt="" /> : null}
        </div>

        <div className="restaurant-detail__content">
          <TitleL>{place.name}</TitleL>

          <div className="restaurant-detail__sections">
            <section className="restaurant-detail__menu">
              <p className="restaurant-detail__label">대표 메뉴</p>
              <p className="restaurant-detail__menu-name">
                {place.representativeMenu}
              </p>
            </section>

            <section className="restaurant-detail__nutrition">
              <div className="restaurant-detail__nutrition-head">
                <p className="restaurant-detail__label">영양 정보</p>
                {place.nutritionTag && (
                  <Tag tone="orange">{place.nutritionTag}</Tag>
                )}
              </div>

              <div className="restaurant-detail__nutrition-box">
                {nutritionRows.map((row, i) => (
                  <Fragment key={row.key}>
                    {i > 0 && (
                      <span
                        className="restaurant-detail__divider"
                        aria-hidden="true"
                      />
                    )}
                    <div
                      className={`restaurant-detail__cell restaurant-detail__cell--${row.key}`}
                    >
                      <span className="restaurant-detail__cell-label">
                        {row.label}
                      </span>
                      <span className="restaurant-detail__cell-value">
                        {row.value}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>

              <p className="restaurant-detail__notice">{NUTRITION_NOTICE}</p>
            </section>

            <section className="restaurant-detail__info">
              <div className="restaurant-detail__info-texts">
                <p className="restaurant-detail__label">식당 정보</p>
                <div className="restaurant-detail__info-rows">
                  {infoRows.map((row) => (
                    <div className="restaurant-detail__info-row" key={row.key}>
                      <span className="restaurant-detail__info-label">
                        {row.label}
                      </span>
                      <span className="restaurant-detail__info-value">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <KakaoMap lat={place.lat} lng={place.lng} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
