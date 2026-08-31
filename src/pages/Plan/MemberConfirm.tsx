import { useNavigate } from "react-router-dom";

import "./MemberConfirm.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-6] 여행 구성원 확정 (237:6589)
 *
 * ⚠ 이 화면은 제목 한 줄과 버튼 하나가 전부입니다 — **본문이 비어 있습니다.**
 *   구성원을 확정했다고 알리는 화면인데 확정된 내용이 보이지 않습니다.
 *   디자인에 있는 것만 그대로 두었습니다(확인 필요 문서 참고).
 *
 * Header 는 Variant5(182:1622) — 아이콘이 없는 빈 헤더입니다.
 * 되돌아갈 수 없는 화면이라 그런 것으로 보입니다.
 */
export default function MemberConfirm() {
  const navigate = useNavigate();

  return (
    <div className="member-confirm">
      {/* Header / Variant5 (237:6590) — 빈 헤더 */}
      <Header className="member-confirm__header" variant="empty" />

      {/* title_L (237:6592) — y54, 한 줄이라 55 */}
      <TitleL className="member-confirm__title">여행 구성원을 확정했어요! </TitleL>

      {/* bottom (343:9203) — 버튼 1개 */}
      <BottomBar>
        {/* ⚠ 이 버튼의 목적지가 디자인에 없습니다. 섹션 순서상
            [S7] 여행 일정 생성의 첫 화면([7-1])으로 연결했습니다. */}
        <Btn variant="primary" onClick={() => navigate(PATHS.tripName)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
