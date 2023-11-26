import { fullpageFactoryOption, ScrollLockOption } from "./types";
import { ERROR_CODE } from "./error";
import { keyCodesToPrevent } from "./constant";
import { _fullpage } from "./fullpage";

let debounceTimer: NodeJS.Timeout | number | null = null; // resize debouncer

export function fullpageFactory(option: fullpageFactoryOption) {
  let enableKeydown = option.enableKeydown;
  let scrollDelay = option.scrollDelay;
  let touchMovementThreshold = option.touchMovementThreshold;
  let transitionDuration = option.duration;
  let transitionTimingMethod = option.timingMethod;

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
  if (!container || !(container instanceof HTMLDivElement)) {
    throw {
      code: ERROR_CODE.VALIDATION_ERROR,
      message: `expected container to be HTMLDivElement instead ${typeof container}`,
    };
  }
  if (typeof enableKeydown !== "boolean") {
    throw {
      code: ERROR_CODE.VALIDATION_ERROR,
      message: `expected type 'boolean' instead got ${typeof enableKeydown} on option.enableKeydown `,
    };
  }
  if (typeof scrollDelay !== "number") {
    throw {
      code: ERROR_CODE.VALIDATION_ERROR,
      message: `expected type 'number' instead got ${typeof scrollDelay} on option.scrollDelay `,
    };
  }
  if (typeof touchMovementThreshold !== "number") {
    throw {
      code: ERROR_CODE.VALIDATION_ERROR,
      message: `expected type 'number' instead got ${typeof touchMovementThreshold} on option.touchMovementThreshold `,
    };
  }
  if (typeof transitionDuration !== "number") {
    throw {
      code: ERROR_CODE.VALIDATION_ERROR,
      message: `expected type 'number' instead got ${typeof transitionDuration} on option.duration `,
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
      code: ERROR_CODE.VALIDATION_ERROR,
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

  const fullpage = _fullpage.bind(
    null,
    container,
    scrollDelay!,
    touchMovementThreshold!
  );
  const resizeListener = _resizeListener.bind(null, container);
  const attatchFullpage = _attatchFullpage.bind(
    null,
    {
      enableKeydown: enableKeydown!,
    },
    fullpage
  );
  const detatchFullpage = _detatchFullpage.bind(
    null,
    {
      enableKeydown: enableKeydown!,
    },
    fullpage
  );

  return {
    resizeListener,
    attatchFullpage,
    detatchFullpage,
  };
}

function _preventDefaultForScrollKeys(e: KeyboardEvent) {
  if (keyCodesToPrevent[e.key as keyof typeof keyCodesToPrevent]) {
    e.preventDefault();
    return false;
  }
}

function _detatchFullpage(option: ScrollLockOption, fullpage: any) {
  if (option.enableKeydown) {
    window.removeEventListener("keydown", _preventDefaultForScrollKeys, false);
  }
  window.removeEventListener("DOMMouseScroll", fullpage, false);
  window.removeEventListener("scroll", fullpage, false);
  window.removeEventListener("wheel", fullpage, false);
  window.removeEventListener("mousewheel", fullpage, false);
  window.removeEventListener("touchmove", fullpage, false);
  window.addEventListener("touchstart", _touchEvent, false);
}
function _attatchFullpage(option: ScrollLockOption, fullpage: any) {
  if (option.enableKeydown) {
    window.addEventListener("keydown", _preventDefaultForScrollKeys, {
      passive: false,
    });
  }
  window.addEventListener("DOMMouseScroll", fullpage, {
    passive: false,
  });
  window.addEventListener("scroll", fullpage, { passive: false });
  window.addEventListener("touchmove", fullpage, { passive: false });
  window.addEventListener("wheel", fullpage, {
    passive: false,
  });
  window.addEventListener("mousewheel", fullpage, {
    passive: false,
  });
  window.addEventListener("touchstart", _touchEvent, { passive: false });
}

function _resizeListener(container: HTMLDivElement, e: any) {
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

function setTransitionDuration(container: HTMLDivElement, duration = 900) {
  container.style.transitionDuration = `${duration}ms`;
}
