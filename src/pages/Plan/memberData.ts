/** 여행 구성원 목록. API 연결 전까지 쓰는 목업 */
export type Member = {
  id: string;
  name: string;
  tags: string[];
};

export const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "{구성원 이름}", tags: ["알레르기 주의", "복약", "당뇨"] },
  { id: "2", name: "{구성원 이름}", tags: ["알레르기 주의", "복약", "당뇨"] },
];

/** 구성원 수정 화면을 오갈 때 넘기는 값 */
export type MemberNavState = {
  edit?: boolean;
  memberId?: string;
  /** 수정을 마치면 돌아갈 화면 */
  from?: string;
  /** 확정 화면으로 돌아갈 때 다시 보여줄 목록 */
  members?: Member[];
};
