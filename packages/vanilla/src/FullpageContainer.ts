import { CSSTimingKeyword } from "@safe-fullpage/core/types";
import { ERROR_CODE, fullpageFactory } from "@safe-fullpage/core";

const template = document.createElement("template");
template.innerHTML = /* html */ `

<style>
  #safe-fullpage-container {
    --safefullpage-translate-value: 0;
    --safefullpage-viewport-height: 100dvh;
    width: 100%;
    position: relative;
    transition: transform 0.9s ease 0s;
    transform: translateY(
      calc(
        var(--safefullpage-viewport-height) * var(--safefullpage-translate-value)
      )
    );
    height: 100vh;
    height: 100dvh;
    max-height: var(--safefullpage-viewport-height);
    position: fixed;
    margin: 0;
    padding: 0;
  }
  .safe-fullpage-element {
    width: 100%;
    position: relative;
  }
</style>
<div id='safe-fullpage-container'>
</div>
`;
export class FullpageContainer extends HTMLElement {
  private _enableKeydown!: boolean;
  private _scrollDelay!: number;
  private _touchMovementThreshold!: number;
  private _duration!: number;
  private _timingMethod!: CSSTimingKeyword;
  constructor() {
    super();

    const nodes = [];
    const nodesToRemove = [];
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].tagName !== "span") {
        nodes.push(this.children[i].cloneNode(true));
        nodesToRemove.push(this.children[i]);
      }
    }
    for (const node of nodesToRemove) {
      node.remove();
    }
    const templateNode = template.content.cloneNode(true) as Element;
    const container = templateNode.children.namedItem(
      "safe-fullpage-container"
    )!;
    for (const node of nodes) {
      container.appendChild(node);
    }
    this.appendChild(templateNode);
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
    setTimeout(() => {
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

      const container = this.children.namedItem("safe-fullpage-container")!;
      const { resizeListener, attatchFullpage, detatchFullpage } =
        fullpageFactory({
          container: container as HTMLElement,
          enableKeydown: this._enableKeydown,
          scrollDelay: this._scrollDelay,
          duration: this._duration,
          touchMovementThreshold: this._touchMovementThreshold,
          timingMethod: this._timingMethod,
        });
      window.addEventListener("resize", resizeListener);
      detatchFullpage();
      attatchFullpage();
    }, 0);
  }
}

customElements.define("safe-fullpage-container", FullpageContainer);
