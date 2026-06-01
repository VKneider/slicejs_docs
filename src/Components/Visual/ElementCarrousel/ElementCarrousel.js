export default class ElementCarrousel extends HTMLElement {

  static props = {
    elements: {
      type: 'array',
      default: [],
      required: false
    }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$track = this.querySelector('.slice_carousel_track');
    this.$prevBtn = this.querySelector('.slice_carousel_prev');
    this.$nextBtn = this.querySelector('.slice_carousel_next');
    this.$dotsNav = this.querySelector('.slice_carousel_nav');

    this.currentSlideIndex = 0;
    this.slides = [];

    this.setAttribute('role', 'region');
    this.setAttribute('aria-roledescription', 'carousel');
    this.setAttribute('tabindex', '0'); // focusable so the arrow-key handler works
    this.$prevBtn.setAttribute('aria-label', 'Previous slide');
    this.$nextBtn.setAttribute('aria-label', 'Next slide');

    slice.controller.setComponentProps(this, props);
  }

  get elements() {
    return this._elements || [];
  }

  set elements(value) {
    this._elements = Array.isArray(value) ? value : [];
    this.renderElements();
  }

  init() {
    this.addEventListeners();
  }

  beforeDestroy() {
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
  }

  renderElements() {
    this.$track.innerHTML = '';
    this.$dotsNav.innerHTML = '';
    this.slides = [];
    this.currentSlideIndex = 0;

    if (this.elements.length === 0) return;

    this.elements.forEach((element, index) => {
      const slide = document.createElement('li');
      slide.classList.add('slice_carousel_slide');
      if (index === 0) slide.classList.add('current-slide');

      if (element instanceof Node) {
        slide.appendChild(element);
      } else {
        slide.textContent = String(element);
      }

      this.$track.appendChild(slide);
      this.slides.push(slide);

      const dot = document.createElement('button');
      dot.classList.add('slice_carousel_indicator');
      dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
      if (index === 0) dot.classList.add('current-slide');
      dot.addEventListener('click', () => {
        this.moveToSlide(index);
      });
      this.$dotsNav.appendChild(dot);
    });

    this.updateSlidePosition();
  }

  addEventListeners() {
    this.$prevBtn.addEventListener('click', () => {
      const newIndex = this.currentSlideIndex === 0
        ? this.slides.length - 1
        : this.currentSlideIndex - 1;
      this.moveToSlide(newIndex);
    });

    this.$nextBtn.addEventListener('click', () => {
      const newIndex = this.currentSlideIndex === this.slides.length - 1
        ? 0
        : this.currentSlideIndex + 1;
      this.moveToSlide(newIndex);
    });

    this._resizeHandler = () => this.updateSlidePosition();
    window.addEventListener('resize', this._resizeHandler);

    this.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.$prevBtn.click();
      if (e.key === 'ArrowRight') this.$nextBtn.click();
    });
  }

  moveToSlide(targetIndex) {
    if (targetIndex < 0 || targetIndex >= this.slides.length) return;

    const currentDot = this.$dotsNav.children[this.currentSlideIndex];
    const targetDot = this.$dotsNav.children[targetIndex];

    if (currentDot) currentDot.classList.remove('current-slide');
    if (targetDot) targetDot.classList.add('current-slide');

    this.currentSlideIndex = targetIndex;
    this.updateSlidePosition();
  }

  updateSlidePosition() {
    if (this.slides.length === 0) return;
    const width = this.$track.getBoundingClientRect().width;
    this.$track.style.transform = 'translateX(-' + (width * this.currentSlideIndex) + 'px)';
  }
}

customElements.define('slice-element-carrousel', ElementCarrousel);
