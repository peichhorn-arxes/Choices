const s = o =>
  Object.keys(o)
    .map(key => `${key}:${o[key]}`)
    .join(';');

export default class FixedPositionDropdownContainer {
  constructor({ container, dropdown }) {
    Object.assign(this, { container, dropdown });
  }

  position(isFlipped = this.container.isFlipped) {
    if (this.element) {
      const outerRect = this.container.element.getBoundingClientRect();
      let top;
      if (isFlipped) {
        top = outerRect.top;
      } else {
        top = outerRect.top + outerRect.height;
      }
      this.element.setAttribute(
        'style',
        s({
          position: 'fixed',
          top: `${top}px`,
          left: `${outerRect.left}px`,
          width: `${outerRect.width}px`,
          height: '0',
        }),
      );
    }
  }

  destroy() {
    this.destroyResizeObserver();
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  createResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => this.position());
    this.resizeObserver.observe(this.container.element);
  }

  destroyResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  open(dropdownPos) {
    const shouldFlip = this.container.shouldFlip(dropdownPos);
    if (this.element) {
      this.position(shouldFlip);
    } else {
      this.element = this.container.element.cloneNode(false);
      this.element.classList.add('choices--cloned');

      if (shouldFlip) {
        this.element.classList.add(this.container.classNames.flippedState);
      }

      this.position(shouldFlip);

      this.container.element.removeChild(this.dropdown.element);
      this.element.appendChild(this.dropdown.element);
      document.body.appendChild(this.element);

      this.element.classList.add(this.container.classNames.openState);
      this.element.setAttribute('aria-expanded', 'true');

      this.createResizeObserver();
    }
  }

  close() {
    if (this.element) {
      this.element.parentNode.removeChild(this.element);
      this.element.removeChild(this.dropdown.element);
      this.container.element.appendChild(this.dropdown.element);
      this.element = null;
    }
    this.destroyResizeObserver();
  }
}
