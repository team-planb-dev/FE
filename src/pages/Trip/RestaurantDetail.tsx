import { Fragment } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./RestaurantDetail.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Tag from "../../components/Tag/Tag";
import KakaoMap from "../../components/KakaoMap/KakaoMap";
import {
  onThumbnailError,
  thumbnailSrc,
} from "../../components/common/defaultThumbnail";

import { NUTRITION_NOTICE, toRestaurant } from "./restaurantData";
import type { ApiRestaurantDetail, CodeValue } from "../../api/planTypes";

const MISSING_TEXT = "식당 정보를 불러올 수 없어요. 일정에서 다시 열어주세요.";
const NO_LOCATION_TEXT = "위치 정보가 없어 지도를 띄울 수 없어요.";

/** 식당 상세. 대표 메뉴 · 영양 정보 · 식당 정보 · 지도 */
export default function RestaurantDetail() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const passed = useLocation().state as {
    name?: string;
    detail?: ApiRestaurantDetail | null;
    tags?: CodeValue[];
  } | null;

  /*
   * ⚠ 식당 하나만 조회하는 API 가 없어서 일정 화면이 넘겨준 값에 의존합니다.
   *   새로고침하거나 주소로 바로 들어오면 값이 없습니다
   */
  const place =
    passed?.detail && placeId
      ? toRestaurant(placeId, passed.name ?? "", passed.detail, passed.tags)
      : null;

  if (!place) {
    return (
      <div className="restaurant-detail">
        <Header
          className="restaurant-detail__header"
          variant="title"
          title="여행 일정 생성"
          onBack={() => navigate(-1)}
        />
        <p className="restaurant-detail__status">{MISSING_TEXT}</p>
      </div>
    );
  }

  const nutritionRows = [
    { key: "carbohydrate", label: "탄수화물", value: place.nutrition.carbohydrate },
    { key: "sodium", label: "나트륨", value: place.nutrition.sodium },
    { key: "fat", label: "지방", value: place.nutrition.fat },
  ];

  // 값이 없으면 라벨만 덩그러니 남아서, 영양 정보와 같이 자리표시자를 둡니다
  const infoRows = [
    { key: "hours", label: "영업 시간", value: place.openingHours || "--" },
    { key: "address", label: "주소", value: place.address || "--" },
  ];

  return (
    <div className="restaurant-detail">
      <Header
        className="restaurant-detail__header"
        variant="title"
        title="여행 일정 생성"
        onBack={() => navigate(-1)}
      />

      <div className="restaurant-detail__body">
        <div className="restaurant-detail__img">
          <img
            src={thumbnailSrc(place.image, "food", "wide")}
            onError={onThumbnailError("food", "wide")}
            alt=""
          />
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

              {place.lat !== null && place.lng !== null ? (
                <KakaoMap lat={place.lat} lng={place.lng} />
              ) : (
                <p className="restaurant-detail__status restaurant-detail__status--inline">
                  {NO_LOCATION_TEXT}
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
