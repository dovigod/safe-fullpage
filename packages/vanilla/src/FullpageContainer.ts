import { FullpageContainerOption } from "@safe-fullpage/core/types";
import { fullpageFactory } from "@safe-fullpage/core";

/**
 *   enableKeydown?: boolean;
  scrollDelay?: number;
  touchMovementThreshold?: number;
  duration?: number;
  timingMethod?: CSSTimingKeyword;
 */

export class FullpageContainer extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [
      "enableKeydown",
      "scrollDelay",
      "touchMovementThreshold",
      "duration",
      "c",
    ];
  }
  set enableKeydown(_value: string) {
    if (_value) {
      this.setAttribute("enableKeydown", "");
    } else {
      this.removeAttribute("enableKeydown");
    }
  }
  get enableKeydown() {
    return String(this.hasAttribute("enableKeydown"));
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

  connectedCallback(x: any) {
    console.log("enableKeydown :: ", this.enableKeydown);
    console.log("scrollDelay :: ", this.scrollDelay);
    console.log("touchMovementThreshold :: ", this.touchMovementThreshold);
    console.log("duration :: ", this.duration);
    console.log("timingMethod :: ", this.timingMethod);
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
