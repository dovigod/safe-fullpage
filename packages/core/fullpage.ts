import {
  CSSTimingKeyword,
  DeviceType,
  Direction,
  fullpageFactoryOption,
  ScrollLockOption,
} from "./types";
import { ERROR_CODE } from "./error";
import { keyCodesToPrevent } from "./constant";
import { FullpageEvent } from "./event";
import { detectDeviceType } from "./utils";

// hold event handler until %scrollDelay% passes.
let hold = false;
//point sectionIdx
let pointer = 0;
// resize debouncer
let debounceTimer: NodeJS.Timeout | number | null = null;
export class Fullpage {
  // instance of Fullpage Element
  public static instance: Fullpage;
  // enable triggering scroll events via keydown
  enableKeydown!: boolean;
  // delay for each fullpage event
  scrollDelay!: number;
  // for Mobile Device, set minimum pan movement px value to trigger event
  touchMovementThreshold!: number;
  // duration for fullpage transition
  transitionDuration!: number;
  // timing function for fullpage transition
  transitionTimingMethod!: CSSTimingKeyword;

  // callbacks for each fullpage event. 'onFullpageEnd' will get trigger on 'processing' -> 'fulfilled' state transition
  onFullpageEnd?: (event: FullpageEvent) => void | Promise<void>;
  // callbacks for each fullpage event. 'onFullpageStart' will get trigger on 'staged' -> 'processing' state transition
  onFullpageStart?: (event: FullpageEvent) => void | Promise<void>;
  // fullpage container
  container!: HTMLElement;

  constructor(option: fullpageFactoryOption) {
    if (Fullpage.instance) {
      return Fullpage.instance;
    }
    let enableKeydown = option.enableKeydown;
    let scrollDelay = option.scrollDelay;
    let touchMovementThreshold = option.touchMovementThreshold;
    let transitionDuration = option.duration;
    let transitionTimingMethod = option.timingMethod;
    const onFullpageEnd = option.onFullpageEnd;
    const onFullpageStart = option.onFullpageStart;

    const container = option.container;

    //defaults
    if (typeof option.enableKeydown === "undefined") {
      enableKeydown = false;
    }
    if (typeof option.scrollDelay === "undefined") {
      scrollDelay = 1500;
    }
    if (typeof option.touchMovementThreshold === "undefined") {
      touchMovementThreshold = 20; // minimum 20px movement to trigger fullpage with pan
    }
    if (typeof option.duration === "undefined") {
      transitionDuration = 900;
    }
    if (typeof option.timingMethod === "undefined") {
      transitionTimingMethod = "ease";
    }

    //validation
    if (!container || !(container instanceof HTMLElement)) {
      throw {
        code: ERROR_CODE.VALIDATION_FAILURE,
        message: `expected container to be HTMLElement instead ${typeof container}`,
      };
    }
    if (typeof enableKeydown !== "boolean") {
      throw {
        code: ERROR_CODE.VALIDATION_FAILURE,
        message: `expected type 'boolean' instead got ${typeof enableKeydown} on option.enableKeydown `,
      };
    }
    if (typeof scrollDelay !== "number") {
      throw {
        code: ERROR_CODE.VALIDATION_FAILURE,
        message: `expected type 'number' instead got ${typeof scrollDelay} on option.scrollDelay `,
      };
    }
    if (typeof touchMovementThreshold !== "number") {
      throw {
        code: ERROR_CODE.VALIDATION_FAILURE,
        message: `expected type 'number' instead got ${typeof touchMovementThreshold} on option.touchMovementThreshold `,
      };
    }
    if (typeof transitionDuration !== "number") {
      throw {
        code: ERROR_CODE.VALIDATION_FAILURE,
        message: `expected type 'number' instead got ${typeof transitionDuration} on option.duration `,
      };
    }
    if (onFullpageStart && typeof onFullpageStart !== "function") {
      throw {
        code: ERROR_CODE.VALIDATION_FAILURE,
        message: `expected type 'function' instead got ${typeof onFullpageStart} on option.onFullpageStart `,
      };
    }
    if (onFullpageEnd && typeof onFullpageEnd !== "function") {
      throw {
        code: ERROR_CODE.VALIDATION_FAILURE,
        message: `expected type 'function' instead got ${typeof onFullpageEnd} on option.onFullpageEnd `,
      };
    }

    const isAvailableTimingFunction = [
      "ease",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "linear",
    ].some((timingMethod) => timingMethod === transitionTimingMethod);

    if (!isAvailableTimingFunction) {
      throw {
        code: ERROR_CODE.VALIDATION_FAILURE,
        message: `expected "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear", instead got ${transitionTimingMethod} on option.timingMethod `,
      };
    }

    for (const elem of container.children) {
      if (!elem.classList.contains("safe-fullpage-element")) {
        console.warn(
          `Detected unsafe child element ${elem.tagName}.${elem.classList.value}, which might cause side effects. Recommend using FullpageElement as a child.`
        );
      }
    }
    container.style.transitionDuration = `${transitionDuration}ms`;
    container.style.transitionTimingFunction = `${transitionTimingMethod}`;

    this.enableKeydown = enableKeydown;
    this.container = container;
    this.onFullpageEnd = onFullpageEnd;
    this.onFullpageStart = onFullpageStart;
    this.scrollDelay = scrollDelay;
    this.touchMovementThreshold = touchMovementThreshold;
    this.transitionDuration = transitionDuration;
    this.transitionTimingMethod = transitionTimingMethod!;

    return new Proxy(this, {
      set(_, __, ___) {
        throw {
          code: ERROR_CODE.INVALID_MUTATION,
          msg: "Manipulating instance configuration is not acceptable",
        };
      },
    });
  }

  getListeners() {
    const dispatchUserAction = _dispatchUserAction.bind(
      this,
      this.container,
      this.scrollDelay,
      this.touchMovementThreshold
    );
    const self = this;
    const resizeListener = _resizeListener.bind(null, this.container);
    const safeFullpageHandler = async function (event: FullpageEvent) {
      if (self.onFullpageStart) {
        await self.onFullpageStart(event);
      }
      event.stateTransition();
      safeFullpage(event);
      event.stateTransition();
      if (self.onFullpageEnd) {
        await self.onFullpageEnd(event);
      }
    };
    const attatch = _attatchFullpage.bind(
      this,
      {
        enableKeydown: this.enableKeydown,
      },
      dispatchUserAction,
      safeFullpageHandler
    );
    const detatch = _detatchFullpage.bind(
      this,
      {
        enableKeydown: this.enableKeydown,
      },
      dispatchUserAction,
      safeFullpageHandler
    );

    return {
      resizeListener,
      attatch,
      detatch,
    };
  }
  scroll(targetSectionIdx: number) {
    let target = targetSectionIdx;

    // cut-off out of boundary cases.
    if (target > this.container.children.length - 1) {
      target = this.container.children.length - 1;
    }
    if (target < 0) {
      target = 0;
    }

    const currentSection = pointer;

    const lastIdx = this.container.children.length - 1;
    let direction = Direction.NEUTRAL;

    if (currentSection < targetSectionIdx) {
      direction = Direction.DOWN;
    }
    if (currentSection > targetSectionIdx) {
      direction = Direction.UP;
    }
    const prevSectionIdx = pointer;
    const sectionIdx = targetSectionIdx;
    const isStart = sectionIdx === 0;
    const isEnd = sectionIdx === lastIdx;
    const scrollDelay = this.scrollDelay;
    const touchMovementThreshold = this.touchMovementThreshold;
    const container = this.container;
    const deviceType = detectDeviceType() as DeviceType;
    const event = new FullpageEvent({
      direction,
      prevSectionIdx,
      sectionIdx,
      isStart,
      isEnd,
      scrollDelay,
      touchMovementThreshold,
      container,
      deviceType,
    });

    dispatchEvent(event);
  }

  getCurrentSectionIdx() {
    return pointer;
  }
}

function _getChildElementHeights(container: HTMLElement) {
  // const elementInfos: { height: number; elementType: "content" | "footer" }[] =
  //   [];
  const elementInfos: { height: number }[] = [];
  for (const elem of container.children) {
    if (elem.tagName === "SAFE-FULLPAGE-ELEMENT") {
      if (elem.firstElementChild) {
        elementInfos.push({
          height: (elem.firstElementChild as HTMLElement).clientHeight,
        });
      }
    } else {
      elementInfos.push({
        height: elem.clientHeight,
      });
    }
  }
  return elementInfos;
}

/**
 *
 * @param translateVal current translateVal , corresponding to CSS variable
 * @param container Fullpage container
 * @param targetSection target to translate
 * @returns
 */
function _scrollDown(
  translateVal: number,
  container: HTMLElement,
  targetSection: number
) {
  // get all height and types of fullpage element
  const elementInfos = _getChildElementHeights(container);
  const indexBoundary = elementInfos.length - 1;

  let nextPointer = targetSection;
  let res: string | null = null;

  if (nextPointer <= indexBoundary) {
    let valueToTranslate = 0;

    // calculate nextTranslateValue.
    // edge case :: if current index is pointing second from the back, it should only translate next element's height (e.g footer)
    for (let i = pointer; i < nextPointer; i++) {
      if (i + 1 === elementInfos.length - 1) {
        valueToTranslate -= elementInfos[i + 1].height / window.innerHeight;
      } else {
        valueToTranslate -= elementInfos[i].height / window.innerHeight;
      }
    }

    const nextTranslateVal = translateVal + valueToTranslate;
    res = nextTranslateVal.toString();

    pointer = nextPointer;
    return res;
  }

  res = translateVal.toString();
  return res;
}

/**
 *
 * @param translateVal current translateVal , corresponding to CSS variable
 * @param container Fullpage container
 * @param targetSection target to translate
 * @returns
 */
function _scrollUp(
  translateVal: number,
  container: HTMLElement,
  targetSection: number
) {
  const elementInfos = _getChildElementHeights(container);
  const indexBoundary = 0;
  let res: string | null = null;
  const nextPointer = targetSection;

  if (nextPointer >= indexBoundary) {
    let valueToTranslate = 0;

    // calculate nextTranslateValue.
    // edge case :: if current index is pointing last element of List of FullpageElement, it should only translate current element's height (e.g footer)
    for (let i = pointer; i > nextPointer; i--) {
      if (i === elementInfos.length - 1) {
        valueToTranslate += elementInfos[i].height / window.innerHeight;
      } else {
        valueToTranslate += elementInfos[i - 1].height / window.innerHeight;
      }
    }

    const nextTranslateVal = translateVal + valueToTranslate;
    res = nextTranslateVal.toString();
    pointer = nextPointer;
    return res;
  }

  res = translateVal.toString();
  return res;
}

function _dispatchUserAction(
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

function safeFullpage(event: FullpageEvent) {
  hold = true;
  const { direction, safeFullpageContainer: container, scrollDelay } = event;
  const computedStyle = getComputedStyle(container);
  const translateVal = Number(
    computedStyle.getPropertyValue("--safefullpage-translate-value")
  );
  container.style.setProperty(
    "--safefullpage-translate-value",
    direction === "down"
      ? _scrollDown(translateVal, container, event.sectionIdx)
      : direction === "up"
      ? _scrollUp(translateVal, container, event.sectionIdx)
      : String(translateVal)
  );

  setTimeout(() => {
    hold = false;
  }, scrollDelay);
}

function _preventDefaultForScrollKeys(e: KeyboardEvent) {
  if (keyCodesToPrevent[e.key as keyof typeof keyCodesToPrevent]) {
    e.preventDefault();
    return false;
  }
}

function _detatchFullpage(
  option: ScrollLockOption,
  dispatchUserAction: any,
  safeFullpageHandler: (event: FullpageEvent) => Promise<void>
) {
  if (option.enableKeydown) {
    window.removeEventListener("keydown", _preventDefaultForScrollKeys, false);
  }
  window.removeEventListener("DOMMouseScroll", dispatchUserAction, false);
  window.removeEventListener("scroll", dispatchUserAction, false);
  window.removeEventListener("wheel", dispatchUserAction, false);
  window.removeEventListener("mousewheel", dispatchUserAction, false);
  window.removeEventListener("touchmove", dispatchUserAction, false);
  window.removeEventListener("safefullpage", safeFullpageHandler);
  window.addEventListener("touchstart", _touchEvent, false);
}
function _attatchFullpage(
  option: ScrollLockOption,
  dispatchUserAction: any,
  safeFullpageHandler: (event: FullpageEvent) => Promise<void>
) {
  if (option.enableKeydown) {
    window.addEventListener("keydown", _preventDefaultForScrollKeys, {
      passive: false,
    });
  }
  window.addEventListener("DOMMouseScroll", dispatchUserAction, {
    passive: false,
  });
  window.addEventListener("scroll", dispatchUserAction, { passive: false });
  window.addEventListener("touchmove", dispatchUserAction, { passive: false });
  window.addEventListener("wheel", dispatchUserAction, {
    passive: false,
  });
  window.addEventListener("mousewheel", dispatchUserAction, {
    passive: false,
  });
  window.addEventListener("touchstart", _touchEvent, { passive: false });
  window.addEventListener("safefullpage", safeFullpageHandler);
}

function _resizeListener(container: HTMLElement, e: any) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    container.style.setProperty(
      "--safefullpage-viewport-height",
      e.target.document.documentElement.clientHeight + "px"
    );
  }, 100);
}

function _touchEvent(e: any) {
  window._touchStart = e.pageY;
}
