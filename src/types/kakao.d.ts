/** 카카오맵 SDK 중 이 프로젝트에서 쓰는 부분만 */
declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number);
  }
  class Map {
    constructor(container: HTMLElement, options: { center: LatLng; level?: number });
    setCenter(latlng: LatLng): void;
  }
  class Marker {
    constructor(options: { position: LatLng; map?: Map });
  }
  function load(callback: () => void): void;
}

interface Window {
  kakao?: { maps: typeof kakao.maps };
}
