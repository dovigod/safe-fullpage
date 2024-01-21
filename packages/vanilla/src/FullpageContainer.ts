import {
  CSSTimingKeyword,
  FullpageContainerOption,
} from "@safe-fullpage/core/types";
import { Fullpage } from "@safe-fullpage/core";
import { FullpageEvent } from "@safe-fullpage/core/event";

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
  enableKeydown?: boolean;
  scrollDelay?: number;
  touchMovementThreshold?: number;
  duration?: number;
  timingMethod?: CSSTimingKeyword;
  onFullpageEnd?: (event: FullpageEvent) => void | Promise<void>;
  onFullpageStart?: (event: FullpageEvent) => void | Promise<void>;

  constructor(option: FullpageContainerOption) {
    super();

    this.onFullpageEnd = option?.onFullpageEnd;
    this.onFullpageStart = option?.onFullpageStart;
    this.duration = Number(this.getAttribute("duration")) || option?.duration;
    this.touchMovementThreshold =
      Number(this.getAttribute("touchMovementThreshold")) ||
      option?.touchMovementThreshold;
    this.scrollDelay =
      Number(this.getAttribute("scrollDelay")) || option?.scrollDelay;
    this.enableKeydown = !!(
      Boolean(typeof this.getAttribute("enableKeydown") === "string") ||
      option?.enableKeydown
    );
    this.timingMethod =
      (this.getAttribute("timingMethod") as CSSTimingKeyword) ||
      option?.timingMethod;

    if (typeof this.duration !== "number" || Number.isNaN(this.duration)) {
      this.duration = 900;
    }
    if (
      typeof this.touchMovementThreshold !== "number" ||
      Number.isNaN(this.touchMovementThreshold)
    ) {
      this.touchMovementThreshold = 20;
    }
    if (
      typeof this.scrollDelay !== "number" ||
      Number.isNaN(this.scrollDelay)
    ) {
      this.scrollDelay = 1500;
    }
    if (typeof this.timingMethod !== "string") {
      this.timingMethod = "ease";
    }

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
      "onFullpageStart",
      "onFullpageEnd",
    ];
  }

  connectedCallback() {
    setTimeout(() => {
      const enableKeydown = !!this.enableKeydown;
      const scrollDelay: number = this.scrollDelay!;
      const touchMovementThreshold: number = this.touchMovementThreshold!;
      const duration: number = this.duration!;
      const timingMethod = this.timingMethod;
      const onFullpageStart = this.onFullpageStart;
      const onFullpageEnd = this.onFullpageEnd;

      const container = this.children.namedItem("safe-fullpage-container")!;
      const instance = new Fullpage({
        container: container as HTMLElement,
        enableKeydown,
        scrollDelay,
        duration,
        touchMovementThreshold,
        timingMethod,
        onFullpageEnd,
        onFullpageStart,
      });
      const { resizeListener, attatch, detatch } = instance.getListeners();
      window.addEventListener("resize", resizeListener);
      detatch();
      attatch();
    }, 0);
  }
}

customElements.define("safe-fullpage-container", FullpageContainer);
