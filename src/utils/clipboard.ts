/** 클립보드 복사 */

/**
 * 텍스트를 클립보드에 넣습니다. 성공 여부를 돌려줍니다.
 *
 * 브라우저는 "사용자가 방금 누른 동작" 안에서만 복사를 허용합니다.
 * 그래서 이 함수를 부르기 전에 서버 요청 같은 기다림을 끼워 넣으면 안 됩니다.
 *
 * 최신 API 가 막히는 경우(창이 포커스를 잃었거나 권한이 꺼졌거나)를 대비해
 * 예전 방식으로 한 번 더 시도합니다.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 아래 폴백으로 넘어갑니다 */
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.opacity = "0";

    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);

    const copied = document.execCommand("copy");
    document.body.removeChild(area);

    return copied;
  } catch {
    return false;
  }
}
