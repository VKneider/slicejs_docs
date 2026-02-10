export default class Tabs extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      this.$headerWrapper = this.querySelector('.tabs-header-wrapper');
      this.$listContainer = this.querySelector('.tab-list-container');
      this.$tabList = this.querySelector('.tab-list');
      this.$tabContent = this.querySelector('.tab-content');
      this.$highlight = this.querySelector('.tab-highlight');
      this.$prevBtn = this.querySelector('.tab-scroll-btn.prev');
      this.$nextBtn = this.querySelector('.tab-scroll-btn.next');
      
      this.items = [];
      this.orientation = 'vertical'; // 'vertical' or 'horizontal'
      
      this.checkOverflow = this.checkOverflow.bind(this);
      
      slice.controller.setComponentProps(this, props);
   }

   set items(value) {
      this._items = value;
      this.render();
   }

   get items() {
      return this._items || [];
   }

   async init() {
      // styles will handle orientation
      this.classList.add(this.orientation);
      this.render();
      
      // Setup Scroll Buttons
      this.$prevBtn.addEventListener('click', () => this.scrollTabs('left'));
      this.$nextBtn.addEventListener('click', () => this.scrollTabs('right'));
      
      this.$tabList.addEventListener('scroll', this.checkOverflow);
      window.addEventListener('resize', this.checkOverflow);
      
      // Initial check
      requestAnimationFrame(this.checkOverflow);
   }
   
   scrollTabs(direction) {
      const scrollAmount = 200;
      if (direction === 'left') {
          this.$tabList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
          this.$tabList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
   }

   centerTab(targetBtn) {
      const list = this.$tabList;
      // Calculations relative to the scroll container
      // We want: (btn.offsetLeft) - (list.width / 2) + (btn.width / 2)
      
      const scrollLeft = targetBtn.offsetLeft - (list.clientWidth / 2) + (targetBtn.offsetWidth / 2);
      
      list.scrollTo({
         left: scrollLeft,
         behavior: 'smooth'
      });
   }
   
   checkOverflow() {
       const { scrollLeft, scrollWidth, clientWidth } = this.$tabList;
       
       // Show prev button if scrolled right
       if (scrollLeft > 0) {
           this.$prevBtn.classList.add('visible');
       } else {
           this.$prevBtn.classList.remove('visible');
       }
       
       // Show next button if can scroll right
       // Use a small buffer (1px) for float calculation issues
       if (scrollWidth - scrollLeft - clientWidth > 1) {
           this.$nextBtn.classList.add('visible');
       } else {
           this.$nextBtn.classList.remove('visible');
       }
   }

   render() {
      if (!this.items || this.items.length === 0) return;
      
      this.$tabList.innerHTML = '';
      this.$tabContent.innerHTML = '';
      
      // Re-add highlight element
      this.$tabList.appendChild(this.$highlight);


      this.items.forEach((item, index) => {
         // Create Tab Button
         const btn = document.createElement('button');
         btn.className = 'tab-button';
         btn.innerHTML = `<span>${item.label}</span>`;
         btn.setAttribute('role', 'tab');
         btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
         btn.dataset.index = index; // Robust selection
         
         if (index === 0) btn.classList.add('active');
         
         btn.addEventListener('click', (e) => this.switchTab(index, e.currentTarget));
         
         this.$tabList.appendChild(btn);

         // Create Panel
         const panel = document.createElement('div');
         panel.className = 'tab-panel';
         panel.id = `panel-${index}`;
         panel.setAttribute('role', 'tabpanel');
         panel.setAttribute('aria-labelledby', `tab-${index}`);
         panel.hidden = index !== 0;
         
         if (index === 0) panel.classList.add('active');

         if (item.content instanceof Node) {
            panel.appendChild(item.content);
         } else {
            panel.innerHTML = item.content;
         }
         
         this.$tabContent.appendChild(panel);
      });

      // Initial Highlight Position
      requestAnimationFrame(() => {
          const firstBtn = this.$tabList.querySelector('.tab-button');
          if(firstBtn) this.updateHighlight(firstBtn);
      });
      
      // Update highlight on resize
      window.addEventListener('resize', () => {
         const activeBtn = this.$tabList.querySelector('.tab-button.active');
         if(activeBtn) this.updateHighlight(activeBtn);
      });
   }

   switchTab(index, btn) {
      // Update Buttons
      const buttons = this.$tabList.querySelectorAll('.tab-button');
      buttons.forEach(b => {
         b.classList.remove('active');
         b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      // Ensure button is visible in scroll view with custom logic to avoid page jumps
      this.centerTab(btn);

      // Update Panels
      const panels = this.$tabContent.querySelectorAll('.tab-panel');
      panels.forEach((p, i) => {
         if (i === index) {
            p.hidden = false;
            p.classList.add('active');
         } else {
            p.hidden = true;
            p.classList.remove('active');
         }
      });

      this.updateHighlight(btn);
      
      // Emit event
      this.dispatchEvent(new CustomEvent('tab-change', {
          detail: { index: index }
      }));
   }
   
   activateTab(index) {
       console.log('Activating tab', index);
       // Use data attribute selector which is safer than ID
       const btn = this.$tabList.querySelector(`.tab-button[data-index="${index}"]`);
       if (btn) {
           this.switchTab(index, btn);
       } else {
           console.warn('Tab button not found for index', index);
       }
   }

   updateHighlight(targetBtn) {
      if(this.classList.contains('vertical')) {
         this.$highlight.style.height = `${targetBtn.offsetHeight}px`;
         this.$highlight.style.width = `3px`;
         this.$highlight.style.transform = `translateY(${targetBtn.offsetTop}px)`;
      } else {
         this.$highlight.style.width = `${targetBtn.offsetWidth}px`;
         this.$highlight.style.height = `3px`;
         this.$highlight.style.transform = `translateX(${targetBtn.offsetLeft}px)`;
      }
   }
}

customElements.define('slice-tabs', Tabs);