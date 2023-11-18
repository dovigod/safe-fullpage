import { EventListenerOption, ScrollLockOption } from "./types";
import { ERROR_CODE } from "./error";
import { keyCodesToPrevent } from "./constant";
import { _fullpage } from "./fullpage";
let debounceTimer: number | null = null;

function preventDefaultForScrollKeys(e: KeyboardEvent) {
  if (keyCodesToPrevent[e.key as keyof typeof keyCodesToPrevent]) {
    e.preventDefault();
    return false;
  }
}

export function _detatchFullPageListeners(
  option: ScrollLockOption,
  fullpage: any
) {
  if (option.enableKeydown) {
    window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
  }
  window.removeEventListener("DOMMouseScroll", fullpage, false);
  window.removeEventListener("scroll", fullpage, false);
  window.removeEventListener("wheel", fullpage, false);
  window.removeEventListener("mousewheel", fullpage, false);
  window.removeEventListener("touchmove", fullpage, false);
}
export function _attatchFullPageListeners(
  option: ScrollLockOption,
  fullpage: any
) {
  if (option.enableKeydown) {
    window.addEventListener("keydown", preventDefaultForScrollKeys, {
      passive: false,
    });
  }
  window.addEventListener("DOMMouseScroll", fullpage, {
    passive: false,
  });
  window.addEventListener("scroll", fullpage, { passive: false });
  window.addEventListener("touchmove", fullpage, { passive: false }); // mobile
  window.addEventListener("wheel", fullpage, {
    passive: false,
  });
  window.addEventListener("mousewheel", fullpage, {
    passive: false,
  });
}

export function _resizeListener(container: HTMLDivElement, e: any) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    container.style.setProperty(
      "--viewport-height",
      e.target.document.documentElement.clientHeight + "px"
    );
  }, 100);
}

export function eventListenerFactory(option: EventListenerOption) {
  let enableKeydown = option.enableKeydown;
  let scrollDelay = option.scrollDelay;
  let touchMovementThreshold = option.touchMovementThreshold;
  const container = option.container;

  //defaults
  if (typeof option.enableKeydown === "undefined") {
    enableKeydown = false;
  }
  if (typeof option.scrollDelay === "undefined") {
    scrollDelay = 1500;
  }
  if (typeof option.touchMovementThreshold === "undefined") {
    touchMovementThreshold = 20;
  }

  //validation
  if (!container || container instanceof HTMLDivElement) {
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
  if (typeof scrollDelay !== "boolean") {
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

  const fullpage = _fullpage.bind(
    null,
    container,
    scrollDelay!,
    touchMovementThreshold!
  );
  const resizeListener = _resizeListener.bind(null, container);
  const disableScroll = _attatchFullPageListeners.bind(
    null,
    {
      enableKeydown: enableKeydown!,
    },
    fullpage
  );

  return {
    resizeListener,
    disableScroll,
  };
}
