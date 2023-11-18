import { Direction } from "./types";
let touchStart: any = null;
let hold = false;

function _scrollDown(translateVal: number) {
  let res: string | null = null;
  const nextVal = Math.max(-4, translateVal - 1);

  if (nextVal === -4) {
    const footer = document.getElementById("footer");
    const footerHeight = footer!.clientHeight;
    const ratio = footerHeight / window.innerHeight;

    res = (translateVal - ratio).toString();
    // footer
  } else {
    res = nextVal.toString();
  }

  return res;
}

function _scrollUp(translateVal: number) {
  let res: string | null = null;
  const nextVal = Math.min(0, translateVal + 1).toString();

  if (translateVal < -3) {
    res = "-3";
    // footer
  } else {
    res = nextVal.toString();
  }
  return res;
}
function _scroll(
  direction: Direction,
  container: HTMLDivElement,
  scrollDelay: number
) {
  hold = true;
  const computedStyle = getComputedStyle(container);

  const translateVal = Number(
    computedStyle.getPropertyValue("--translate-value")
  );

  container!.style.setProperty(
    "--translate-value",
    direction === "down" ? _scrollDown(translateVal) : _scrollUp(translateVal)
  );

  setTimeout(() => {
    hold = false;
  }, scrollDelay);
}
export function _fullpage(
  container: HTMLDivElement,
  scrollDelay: number,
  touchMovementThreshold: number,
  e: any
) {
  let direction = Direction.NEUTRAL;
  e.preventDefault();

  if (e.type === "touchmove") {
    direction = Direction.NEUTRAL;
    const touchThreshold =
      Math.abs(touchStart - e.pageY) > touchMovementThreshold;
    if (touchThreshold) {
      direction = touchStart - e.pageY > 0 ? Direction.DOWN : Direction.UP;
    }
  } else {
    direction = (e as WheelEvent).deltaY < 0 ? Direction.UP : Direction.DOWN;
  }
  if (direction !== Direction.NEUTRAL && !hold) {
    _scroll(direction as Direction, container, scrollDelay);
  }
}
