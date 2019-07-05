export default customElements.define('infinite-scroll',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<style>:host { display: inline-flex; outline: none; }</style><div><slot></slot></div>`;

      this.scrollListener = this.scrollListener.bind(this);
    }

    getParentElement(el) {
      const scrollParent = this.getScrollParent && this.getScrollParent(el);

      if (scrollParent) return scrollParent;

      return el && el.parentNode;
    }

    calculateTopPosition(el) {
      if (!el) return 0;

      return el.offsetTop + this.calculateTopPosition(el.offsetParent);
    }

    calculateOffset(el, scrollTop) {
      if (!el) return 0;

      return this.calculateTopPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
    }

    detachScrollListener() {
      let scrollEl = this.usewindow ? window : this.getParentElement(this);

      scrollEl.removeEventListener('scroll', this.scrollListener);
      scrollEl.removeEventListener('resize', this.scrollListener);
    }

    scrollListener() {
      const scrollEl = window;
      const parentEl = this.getParentElement(this);

      let offset;
      if (this.usewindow) {
        const doc = document.documentElement || document.body.parentNode || document.body;
        const scrollTop = scrollEl.pageYOffset || doc.scrollTop;
        offset = this.calculateOffset(this, scrollTop);
      } else {
        offset = this.scrollHeight - parentEl.scrollTop - parentEl.clientHeight;
      }

      if (offset <= Number(this.threshold) && this.offsetParent) {
        if (typeof this.loadmore === 'function') {
          this.pageLoaded += 1;
          this.loadmore(this.pageLoaded);
        }
      }
    }

    attachScrollListener() {
      const parentEl = this.getParentElement(this);

      if (!parentEl) return;

      let scrollEl = this.usewindow ? window : parentEl;

      scrollEl.addEventListener('scroll', this.scrollListener);
      scrollEl.addEventListener('resize', this.scrollListener);

      if (this.initialload) {
        this.scrollListener();
      }
    }

    connectedCallback() {
      this.initialload = this.initialload || true;
      this.hasmore = this.hasmore || false;
      this.pagestart = this.pagestart || 0;
      this.pageLoaded = this.pagestart;
      this.threshold = this.threshold || 250;
      this.usewindow = this.usewindow || false;
      this.attachScrollListener();
    }

    disconnectedCallback() {
      this.detachScrollListener();
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
      this[attribute] = newValue;
    }
  }
);
