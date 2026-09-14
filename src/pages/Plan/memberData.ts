/** [6-3] 목록 카드에 쓰는 모양. 서버 요약 응답을 companionForm 에서 이 모양으로 바꿉니다 */
export type Member = {
  /** healthId 를 문자열로 담습니다 */
  id: string;
  name: string;
  tags: string[];
};

/** 구성원 수정 화면을 오갈 때 넘기는 값 */
export type MemberNavState = {
  edit?: boolean;
  memberId?: string;
  /** 수정을 마치면 돌아갈 화면 */
  from?: string;
  /** 확정 화면으로 돌아갈 때 다시 보여줄 목록 */
  members?: Member[];
};

/** 등록을 마치고 [6-3] 으로 돌아올 때 넘기는 값 */
export type RegisteredNavState = {
  justRegistered?: boolean;
  /**
   * 방금 등록한 구성원 이름.
   *
   * ⚠ add-traveler 응답이 이름과 메시지만 주고 healthId 를 주지 않아서
   *   목록을 다시 불러온 뒤 이름으로 찾아 선택합니다
   */
  registeredName?: string;
};

/** healthId 목록. 여행 생성 요청에 그대로 들어갑니다 */
export function healthIdsOf(members: Member[]): number[] {
  return members
    .map((member) => Number(member.id))
    .filter((id) => Number.isFinite(id));
}
