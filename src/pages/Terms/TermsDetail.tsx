import type { ReactNode } from "react";

import "./TermsDetail.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

type TermsDetailProps = {
  /** 화면 상단 제목 — 예: "[필수] 서비스 이용약관" */
  title: string;
  /**
   * 약관 전문.
   * ⚠ 피그마([3-6-1] 237:6043 / [3-6-2] 237:6047)에는 본문이 비어 있습니다.
   *    본문 영역의 여백·타이포가 정해져 있지 않아 제목과 같은 좌우 여백(25px)을 적용했습니다.
   */
  content?: ReactNode;
  onClose?: () => void;
  onAgree?: () => void;
};

/** Figma: [3-6-1] / [3-6-2] 약관 전체보기 (237:6043, 237:6047) */
export default function TermsDetail({
  title,
  content,
  onClose,
  onAgree,
}: TermsDetailProps) {
  return (
    <div className="terms-detail">
      <Header
        className="terms-detail__header"
        variant="close"
        onBack={onClose}
      />

      {/* 237:6045 — x25 y74, w334, 16px Medium / 1.7 / -0.32px */}
      <h1 className="terms-detail__title">{title}</h1>

      {/* 본문 — 제목 아래부터 하단 바 위까지 스크롤 */}
      <div className="terms-detail__body">{content}</div>

      {/* bottom (237:6046) — 390×120, 버튼 2개 gap 8 */}
      <BottomBar>
        <Btn variant="outline" onClick={onClose}>
          닫기
        </Btn>
        <Btn variant="primary" onClick={onAgree}>
          동의하기
        </Btn>
      </BottomBar>
    </div>
  );
}
