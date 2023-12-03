import { DeviceType, Direction } from "./types";
import { FullpageEvent } from "./event";
import { detectDeviceType } from "./utils";
let hold = false;
let pointer = 0;

function _getChildElementHeightsAndElementType(container: HTMLElement) {
  const elementInfos: { height: number; elementType: "content" | "footer" }[] =
    [];
  for (const elem of container.children) {
    if (elem.tagName === "SAFE-FULLPAGE-ELEMENT") {
      if (elem.firstElementChild) {
        elementInfos.push({
          height: (elem.firstElementChild as HTMLElement).clientHeight,
          elementType: elem.elementType,
        });
      }
    } else {
      elementInfos.push({
        height: elem.clientHeight,
        elementType: elem.elementType,
      });
    }
  }
  return elementInfos;
}

function _scrollDown(translateVal: number, container: HTMLElement) {
  const elementInfos = _getChildElementHeightsAndElementType(container);
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

function _scrollUp(translateVal: number, container: HTMLElement) {
  const elementInfos = _getChildElementHeightsAndElementType(container);
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

export function _dispatchUserAction(
  container: HTMLElement,
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
    const prevSectionIdx = pointer;
    const lastIdx = container.children.length - 1;
    let sectionIdx =
      direction === Direction.DOWN
        ? pointer + 1
        : direction === Direction.UP
        ? pointer - 1
        : pointer;
    if (sectionIdx < 0) {
      sectionIdx = 0;
    }
    if (sectionIdx > lastIdx) {
      sectionIdx = lastIdx;
    }

    const safeFullpageEvent = new FullpageEvent({
      direction,
      prevSectionIdx,
      sectionIdx,
      isStart: sectionIdx === 0,
      isEnd: sectionIdx === lastIdx,
      deviceType: detectDeviceType() as DeviceType,
      container,
      touchMovementThreshold,
      scrollDelay,
    });
    dispatchEvent(safeFullpageEvent);
  }
}

export function safeFullpage(event: FullpageEvent) {
  hold = true;
  const { direction, safeFullpageContainer: container, scrollDelay } = event;
  const computedStyle = getComputedStyle(container);
  const translateVal = Number(
    computedStyle.getPropertyValue("--safefullpage-translate-value")
  );
  container.style.setProperty(
    "--safefullpage-translate-value",
    direction === "down"
      ? _scrollDown(translateVal, container)
      : direction === "up"
      ? _scrollUp(translateVal, container)
      : String(translateVal)
  );

  setTimeout(() => {
    hold = false;
  }, scrollDelay);
}
