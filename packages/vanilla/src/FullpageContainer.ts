import { CSSTimingKeyword } from "@safe-fullpage/core/types";
import { ERROR_CODE, fullpageFactory } from "@safe-fullpage/core";

/**
 *   enableKeydown?: boolean;
  scrollDelay?: number;
  touchMovementThreshold?: number;
  duration?: number;
  timingMethod?: CSSTimingKeyword;
 */

export class FullpageContainer extends HTMLElement {
  private _enableKeydown!: boolean;
  private _scrollDelay!: number;
  private _touchMovementThreshold!: number;
  private _duration!: number;
  private _timingMethod!: CSSTimingKeyword;
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [
      "enableKeydown",
      "scrollDelay",
      "touchMovementThreshold",
      "duration",
      "timingMethod",
    ];
  }
  set enableKeydown(_value: string) {
    if (_value) {
      if (_value === "false") {
        console.warn(
          "Seems you're trying to set a value to boolean attribute. recommend discarding attribute declaration if you want to set false to it."
        );
        this.removeAttribute("enableKeydown");
      } else {
        this.setAttribute("enableKeydown", "");
      }
    } else {
      this.removeAttribute("enableKeydown");
    }
  }
  get enableKeydown() {
    return this.hasAttribute("enableKeydown") ? "true" : "";
  }

  set scrollDelay(value: string) {
    this.setAttribute("scrollDelay", value);
  }
  get scrollDelay() {
    if (this.hasAttribute("scrollDelay")) {
      return this.getAttribute("scrollDelay")!;
    } else {
      return "1500"; // 1500ms
    }
  }

  set touchMovementThreshold(value: string) {
    this.setAttribute("touchMovementThreshold", value);
  }
  get touchMovementThreshold() {
    if (this.hasAttribute("touchMovementThreshold")) {
      return this.getAttribute("touchMovementThreshold")!;
    } else {
      return "20"; // 20px
    }
  }

  set duration(value: string) {
    this.setAttribute("duration", value);
  }
  get duration() {
    if (this.hasAttribute("duration")) {
      return this.getAttribute("duration")!;
    } else {
      return "900"; // 900ms
    }
  }

  set timingMethod(value: string) {
    this.setAttribute("timingMethod", value);
  }
  get timingMethod() {
    if (this.hasAttribute("timingMethod")) {
      return this.getAttribute("timingMethod")!;
    } else {
      return "ease";
    }
  }

  connectedCallback() {
    const enableKeydown = !!this.enableKeydown;
    let scrollDelay: string | number = this.scrollDelay;
    let touchMovementThreshold: string | number = this.touchMovementThreshold;
    let duration: string | number = this.duration;
    let timingMethod = this.timingMethod;

    if (Number.isNaN(scrollDelay)) {
      throw {
        code: ERROR_CODE.VALIDATION_ERROR,
        message: `expected type 'number' instead got value ${scrollDelay} on for attribute scrollDelay `,
      };
    }
    if (Number.isNaN(touchMovementThreshold)) {
      throw {
        code: ERROR_CODE.VALIDATION_ERROR,
        message: `expected type 'number' instead got value ${touchMovementThreshold} for attribute touchMovementThreshold `,
      };
    }
    if (Number.isNaN(duration)) {
      throw {
        code: ERROR_CODE.VALIDATION_ERROR,
        message: `expected type 'number' instead got value ${duration} for attribute duration `,
      };
    }

    scrollDelay = Number(scrollDelay);
    touchMovementThreshold = Number(touchMovementThreshold);
    duration = Number(duration);

    const isAvailableTimingFunction = [
      "ease",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "linear",
    ].some((method) => method === timingMethod);

    if (!isAvailableTimingFunction) {
      throw {
        code: ERROR_CODE.VALIDATION_ERROR,
        message: `expected "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear", instead got ${timingMethod} for attribute timingMethod `,
      };
    }

    this._enableKeydown = enableKeydown;
    this._scrollDelay = scrollDelay;
    this._duration = duration;
    this._touchMovementThreshold = touchMovementThreshold;
    this._timingMethod = timingMethod as CSSTimingKeyword;

    console.log("enableKeydown :: ", this.enableKeydown, this._enableKeydown);
    console.log("scrollDelay :: ", this.scrollDelay, this._scrollDelay);
    console.log(
      "touchMovementThreshold :: ",
      this.touchMovementThreshold,
      this._touchMovementThreshold
    );
    console.log("duration :: ", this.duration, this._duration);
    console.log("timingMethod :: ", this.timingMethod, this._timingMethod);

    //   const { resizeListener, attatchFullpage, detatchFullpage } =
    //   fullpageFactory({
    //     container: containerRef.current,
    //     ...option,
    //   });
    // window.addEventListener("resize", resizeListener);
    // detatchFullpage();
    // attatchFullpage();
  }
}

customElements.define("safe-fullpage-container", FullpageContainer);
