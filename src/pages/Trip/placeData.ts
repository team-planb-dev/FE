/** [7-5] 검색 결과 한 건. search-planned-place 응답을 tripForm 에서 이 모양으로 바꿉니다 */
export type Place = {
  /**
   * ⚠ 응답에 id 가 없어 "이름|주소" 를 키로 씁니다.
   *   좌표도 없어서 [7-5] 에 지도를 띄울 수 없습니다 (백엔드 확인 대기)
   */
  id: string;
  name: string;
  address: string;
};
