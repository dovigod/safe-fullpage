import { fullpageFactoryOption, ScrollLockOption } from "./types";
import { ERROR_CODE } from "./error";
import { keyCodesToPrevent } from "./constant";
import { safeFullpage, _dispatchUserAction } from "./fullpage";
import { FullpageEvent } from "./event";

let debounceTimer: NodeJS.Timeout | number | null = null; // resize debouncer

export function fullpageFactory(option: fullpageFactoryOption) {
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

  const dispatchUserAction = _dispatchUserAction.bind(
    null,
    container,
    scrollDelay!,
    touchMovementThreshold!
  );
  const resizeListener = _resizeListener.bind(null, container);
  const safeFullpageHandler = async function (event: FullpageEvent) {
    if (onFullpageStart) {
      await onFullpageStart(event);
    }
    event.stateTransition();
    safeFullpage(event);
    event.stateTransition();
    if (onFullpageEnd) {
      await onFullpageEnd(event);
    }
  };
  const attatchFullpage = _attatchFullpage.bind(
    null,
    {
      enableKeydown: enableKeydown!,
    },
    dispatchUserAction,
    safeFullpageHandler
  );
  const detatchFullpage = _detatchFullpage.bind(
    null,
    {
      enableKeydown: enableKeydown!,
    },
    dispatchUserAction,
    safeFullpageHandler
  );

  return {
    resizeListener,
    attatchFullpage,
    detatchFullpage,
    //lock
    //scrollTo
    //
  };
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
