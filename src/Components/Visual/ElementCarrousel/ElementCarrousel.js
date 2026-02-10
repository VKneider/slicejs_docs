export default class ElementCarrousel extends HTMLElement {
    constructor(props) {
        super();
        slice.attachTemplate(this);

        this.$track = this.querySelector('.carousel-track');
        this.$prevBtn = this.querySelector('.prev-btn');
        this.$nextBtn = this.querySelector('.next-btn');
        this.$dotsNav = this.querySelector('.carousel-nav');

        this.currentSlideIndex = 0;
        this.slides = [];

        slice.controller.setComponentProps(this, props);
    }

    set elements(value) {
        this._elements = value;
        this.renderElements();
    }

    get elements() {
        return this._elements || [];
    }

    async init() {
        this.addEventListeners();
    }

    renderElements() {
        this.$track.innerHTML = '';
        this.$dotsNav.innerHTML = '';
        this.slides = [];

        if (!this.elements || this.elements.length === 0) return;

        this.elements.forEach((element, index) => {
            const slide = document.createElement('li');
            slide.classList.add('carousel-slide');
            if (index === 0) slide.classList.add('current-slide');
            
            // If element is already a node, append it. If string, set innerHTML
            if (element instanceof Node) {
                slide.appendChild(element);
            } else {
                slide.innerHTML = element;
            }

            this.$track.appendChild(slide);
            this.slides.push(slide);

            // Create dot
            const dot = document.createElement('button');
            dot.classList.add('carousel-indicator');
            if (index === 0) dot.classList.add('current-slide');
            dot.addEventListener('click', () => {
                this.moveToSlide(index);
            });
            this.$dotsNav.appendChild(dot);
        });
        
        // Initial setup
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
        
        // Resize observer to adjust widths
        window.addEventListener('resize', () => {
             this.updateSlidePosition();
        });
        
        // Key navigation
        this.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.$prevBtn.click();
            if (e.key === 'ArrowRight') this.$nextBtn.click();
        });
    }

    moveToSlide(targetIndex) {
        if (targetIndex < 0 || targetIndex >= this.slides.length) return;
        
        const currentDot = this.$dotsNav.children[this.currentSlideIndex];
        const targetDot = this.$dotsNav.children[targetIndex];
        
        if(currentDot) currentDot.classList.remove('current-slide');
        if(targetDot) targetDot.classList.add('current-slide');

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
