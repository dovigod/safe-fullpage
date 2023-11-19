import { Direction } from "./types";

let hold = false;
let pointer = 0;

function _getChildElementHeightsAndSnapMethod(container: HTMLDivElement) {
  const heights: { height: number; elementType: "content" | "footer" }[] = [];
  for (const elem of container.children) {
    heights.push({
      height: elem.clientHeight,
      elementType: elem.elementType,
    });
  }
  return heights;
}

function _scrollDown(translateVal: number, container: HTMLDivElement) {
  const elementInfos = _getChildElementHeightsAndSnapMethod(container);
  const indexBoundary = elementInfos.length - 1;
  const nextPointer = pointer + 1;
  let res: string | null = null;

  if (nextPointer <= indexBoundary) {
    const nextElemHeight = -elementInfos[nextPointer].height;
    const currentElemHeight = -elementInfos[pointer].height;
    const elementType = elementInfos[nextPointer].elementType;
    pointer++;
    switch (elementType) {
      case "content": {
        const nextElementHeightRatioToViewPort =
          nextElemHeight / window.innerHeight;
        const nextTranslateVal =
          translateVal + nextElementHeightRatioToViewPort;
        res = nextTranslateVal.toString();
        return res;
      }
      case "footer": {
        const currentElementHeightRatioToViewPort =
          currentElemHeight / window.innerHeight;
        const nextTranslateVal =
          translateVal + currentElementHeightRatioToViewPort;
        res = nextTranslateVal.toString();
        return res;
      }
    }
  }

  res = translateVal.toString();
  return res;
}

function _scrollUp(translateVal: number, container: HTMLDivElement) {
  const elementInfos = _getChildElementHeightsAndSnapMethod(container);
  const indexBoundary = 0;
  let res: string | null = null;
  const nextPointer = pointer - 1;

  if (nextPointer >= indexBoundary) {
    const nextElemHeight = elementInfos[nextPointer].height;
    const currentElemHeight = elementInfos[pointer].height;
    const elementType = elementInfos[pointer].elementType;
    pointer--;

    switch (elementType) {
      case "content": {
        const currentElementHeightRatioToViewPort =
          currentElemHeight / window.innerHeight;
        const nextTranslateVal =
          translateVal + currentElementHeightRatioToViewPort;
        res = nextTranslateVal.toString();
        return res;
      }
      case "footer": {
        const nextElementHeightRatioToViewPort =
          nextElemHeight / window.innerHeight;
        const nextTranslateVal =
          translateVal + nextElementHeightRatioToViewPort;
        res = nextTranslateVal.toString();
        return res;
      }
    }
  }

  res = translateVal.toString();
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
    direction === "down"
      ? _scrollDown(translateVal, container)
      : _scrollUp(translateVal, container)
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
  e.preventDefault();

  let direction = Direction.NEUTRAL;
  const touchStart = window._touchStart;
  if (e.type === "touchmove") {
    direction = Direction.NEUTRAL;
    const touchThreshold =
      Math.abs(touchStart! - e.pageY) > touchMovementThreshold;
    if (touchThreshold) {
      direction = touchStart! - e.pageY > 0 ? Direction.DOWN : Direction.UP;
    }
  } else {
    direction = (e as WheelEvent).deltaY < 0 ? Direction.UP : Direction.DOWN;
  }
  if (direction !== Direction.NEUTRAL && !hold) {
    _scroll(direction as Direction, container, scrollDelay);
  }
}
