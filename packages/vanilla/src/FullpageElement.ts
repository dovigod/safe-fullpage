// const template = document.createElement("template");
// template.innerHTML = /* html */ ``;

import { FullpageElementType } from "@safe-fullpage/core";

export class FullpageElement extends HTMLElement {
  static get observedAttributes() {
    return ["elementType"];
  }
  constructor() {
    super();
    const elementType = this.getAttribute("elementType") || "content";
    this.elementType = elementType as FullpageElementType;
    this.classList.add("safe-fullpage-element");
    // this.appendChild(this.appendChild(template));
  }
}

customElements.define("safe-fullpage-element", FullpageElement);
