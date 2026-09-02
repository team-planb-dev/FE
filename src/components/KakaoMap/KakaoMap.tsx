import { useEffect, useRef, useState } from "react";

import "./KakaoMap.css";

const APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined;
const SDK_ID = "kakao-maps-sdk";
const FALLBACK = "지도를 불러오지 못했어요.";

let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (!APP_KEY) return Promise.reject(new Error("VITE_KAKAO_MAP_KEY 없음"));
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SDK_ID);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = SDK_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("카카오맵 SDK 로드 실패"));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

type KakaoMapProps = {
  lat: number;
  lng: number;
  className?: string;
};

/** 카카오맵. 좌표 한 곳에 마커를 찍습니다 */
export default function KakaoMap({ lat, lng, className }: KakaoMapProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadSdk()
      .then(() => {
        if (!alive || !window.kakao || !boxRef.current) return;
        const maps = window.kakao.maps;
        maps.load(() => {
          if (!alive || !boxRef.current) return;
          const center = new maps.LatLng(lat, lng);
          const map = new maps.Map(boxRef.current, { center, level: 3 });
          new maps.Marker({ position: center, map });
        });
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [lat, lng]);

  return (
    <div className={`kakao-map${className ? ` ${className}` : ""}`}>
      <div className="kakao-map__canvas" ref={boxRef} />
      {failed && <p className="kakao-map__fallback">{FALLBACK}</p>}
    </div>
  );
}
