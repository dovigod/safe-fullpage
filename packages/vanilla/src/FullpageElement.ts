// const template = document.createElement("template");
// template.innerHTML = /* html */ ``;

export class FullpageElement extends HTMLElement {
  constructor() {
    super();

    this.classList.add("safe-fullpage-element");
    // this.appendChild(this.appendChild(template));
  }
}

customElements.define("safe-fullpage-element", FullpageElement);
