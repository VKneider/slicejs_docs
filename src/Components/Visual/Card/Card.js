export default class Card extends HTMLElement {

   static props = {
      title: { 
         type: 'string', 
         default: null 
      },
      text: { 
         type: 'string', 
         default: null 
      },
      icon: { 
         type: 'object', 
         default: { name: 'sliceJs', iconStyle: 'filled' } 
      },
      customColor: { 
         type: 'object', 
         default: null 
      },
      image: {
         type: 'string',
         default: null
      },
      actions: {
         type: 'array',
         default: []
      },
      variant: {
         type: 'string',
         default: 'default' // default, elevated, outlined, minimal
      },
      interactive: {
         type: 'boolean',
         default: true
      },
      onClick: {
         type: 'function',
         default: null
      },
      isOpen: { 
         type: 'boolean',
         default: false
      },
      details: {
         type: 'string',
         default: null
      },
      badge: {
         type: 'string',
         default: null
      },
      progress: {
         type: 'number',
         default: null // 0-100
      },
      loading: {
         type: 'boolean',
         default: false
      },
      disabled: {
         type: 'boolean', 
         default: false 
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      
      // DOM caching - TODOS los elementos necesarios para setters
      this.$card = this.querySelector('.slice-card');
      this.$title = this.querySelector('.card-title');
      this.$text = this.querySelector('.card-text');
      this.$textTooltip = this.querySelector('.card-text-tooltip');
      this.$media = this.querySelector('.card-media');
      this.$details = this.querySelector('.card-details');
      this.$detailsContent = this.querySelector('.card-details-content');
      this.$badge = this.querySelector('.card-badge');
      this.$toggle = this.querySelector('.card-toggle');
      this.$progress = this.querySelector('.card-progress');
      // Cache remaining DOM elements (only ones not needed for setters)
      this.$mediaContent = this.querySelector('.card-media-content');
      this.$actions = this.querySelector('.card-actions');
      slice.controller.setComponentProps(this, props);

   }

   async init() {
      
      
      
      // Setup everything
      this.setupVariant();
      this.setupContent();
      await this.setupMedia();
      await this.setupActions();
      this.setupToggle();
      this.setupEventListeners();
      this.applyCustomStyling();
      this.updateState();
      
      this._initialized = true;
   }

   setupVariant() {
      // Remove all variant classes
      this.$card.classList.remove('card-default', 'card-elevated', 'card-outlined', 'card-minimal');
      
      // Add current variant class
      if (this.variant) {
         this.$card.classList.add(`card-${this.variant}`);
      } else {
         this.$card.classList.add('card-default');
      }
   }

   setupContent() {
      // Set title
      if (this.$title) {
         if (this.title) {
            this.$title.textContent = this.title;
            this.$title.style.display = 'block';
         } else {
            this.$title.style.display = 'none';
         }
      }

      // Set text (simplified for scroll design)
      if (this.$text) {
         if (this.text) {
            this.$text.textContent = this.text;
            this.$text.style.display = 'block';
         } else {
            this.$text.style.display = 'none';
         }
      }

      // Set details
      if (this.$details && this.$detailsContent) {
         if (this.details) {
            this.$detailsContent.textContent = this.details;
            this.$details.style.display = 'block';
         } else {
            this.$details.style.display = 'none';
         }
      }

      // Set badge
      if (this.$badge) {
         if (this.badge) {
            this.$badge.textContent = this.badge;
         } else {
            this.$badge.textContent = '';
         }
      }

      // Set progress
      if (this.$progress) {
         if (this.progress !== null && this.progress >= 0 && this.progress <= 100) {
            this.$progress.style.setProperty('--progress', this.progress);
            this.$progress.setAttribute('data-progress', this.progress);
         } else {
            this.$progress.removeAttribute('data-progress');
            this.$progress.style.removeProperty('--progress');
         }
      }
   }

   setupTextTooltip() {
      // Simplified - no longer needed with scroll design
      return;
   }

   async setupMedia() {
      // Clear previous content
      this.$mediaContent.innerHTML = '';

      if (this.image) {
         // If image URL is provided
         const img = document.createElement('img');
         img.src = this.image;
         img.alt = this.title || 'Card image';
         img.classList.add('card-image');
         img.onerror = () => {
            // Fallback to icon if image fails to load
            this.setupIconInMedia();
         };
         this.$mediaContent.appendChild(img);
      } else if (this.icon) {
         // Use icon
         this.setupIconInMedia();
      } else {
         // Hide media section if no content
         this.$media.style.display = 'none';
         return;
      }

      this.$media.style.display = 'flex';
   }

   async setupIconInMedia() {
      try {
         const iconElement = await slice.build('Icon', {
            name: this.icon?.name || 'sliceJs',
            iconStyle: this.icon?.iconStyle || 'filled',
            size: '32px',
            color: 'var(--primary-color-contrast)'
         });
         this.$mediaContent.appendChild(iconElement);
      } catch (error) {
         console.warn('Card: Failed to create icon', error);
      }
   }

   async setupActions() {
      // Clear previous actions
      this.$actions.innerHTML = '';

      if (!this.actions || this.actions.length === 0) {
         this.$actions.style.display = 'none';
         return;
      }

      this.$actions.style.display = 'flex';

      // Create action buttons
      for (const action of this.actions) {
         try {
            const button = await slice.build('Button', {
               text: action.text || 'Action',
               variant: action.variant || 'outlined',
               size: 'small',
               onClick: action.onClick || (() => {})
            });
            this.$actions.appendChild(button);
         } catch (error) {
            console.warn('Card: Failed to create action button', error);
         }
      }
   }

   setupToggle() {
      // Show/hide toggle button based on details availability
      if (this.details) {
         this.$toggle.style.display = 'flex';
      } else {
         this.$toggle.style.display = 'none';
      }
   }

   setupEventListeners() {
      // Remove existing listeners to avoid duplicates
      if (this._toggleListener) {
         this.$toggle.removeEventListener('click', this._toggleListener);
      }
      if (this._cardClickListener) {
         this.$card.removeEventListener('click', this._cardClickListener);
      }
      if (this._keydownListener) {
         this.$card.removeEventListener('keydown', this._keydownListener);
      }

      // Toggle functionality
      this._toggleListener = (e) => {
         e.stopPropagation();
         this.toggleOpen();
      };
      this.$toggle.addEventListener('click', this._toggleListener);

      // Card click handler
      if (this.interactive && this.onClick) {
         this._cardClickListener = (e) => {
            if (!this.disabled && !e.target.closest('.card-toggle') && !e.target.closest('.card-actions')) {
               this.onClick(e);
            }
         };
         this.$card.addEventListener('click', this._cardClickListener);
      }

      // Keyboard navigation
      this._keydownListener = (e) => {
         if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (this.details) {
               this.toggleOpen();
            } else if (this.onClick && this.interactive) {
               this.onClick(e);
            }
         }
      };
      this.$card.addEventListener('keydown', this._keydownListener);

      // Make card focusable if interactive
      if (this.interactive) {
         this.$card.setAttribute('tabindex', '0');
         this.$card.setAttribute('role', 'button');
      }
   }

   toggleOpen() {
      this.isOpen = !this.isOpen;
      this.updateOpenState();
   }

   updateOpenState() {
      if (this.isOpen) {
         this.$card.classList.add('is-open');
         this.$card.setAttribute('aria-expanded', 'true');
      } else {
         this.$card.classList.remove('is-open');
         this.$card.setAttribute('aria-expanded', 'false');
      }
   }

   updateState() {
      // Update loading state
      if (this.loading) {
         this.$card.classList.add('loading');
         this.$card.setAttribute('aria-busy', 'true');
      } else {
         this.$card.classList.remove('loading');
         this.$card.removeAttribute('aria-busy');
      }

      // Update disabled state
      if (this.disabled) {
         this.$card.classList.add('disabled');
         this.$card.setAttribute('aria-disabled', 'true');
         this.$card.style.pointerEvents = 'none';
         this.$card.style.opacity = '0.6';
      } else {
         this.$card.classList.remove('disabled');
         this.$card.removeAttribute('aria-disabled');
         this.$card.style.pointerEvents = '';
         this.$card.style.opacity = '';
      }

      // Update interactive state
      if (this.interactive) {
         this.$card.classList.add('interactive');
      } else {
         this.$card.classList.remove('interactive');
      }

      // Update open state
      this.updateOpenState();
   }

   applyCustomStyling() {
      if (this.customColor) {
         if (this.customColor.accent) {
            this.$card.style.setProperty('--custom-accent', this.customColor.accent);
         }
         if (this.customColor.background) {
            this.$card.style.setProperty('--custom-bg', this.customColor.background);
         }
         if (this.customColor.text) {
            this.$card.style.setProperty('--custom-text', this.customColor.text);
         }
         if (this.customColor.card && this.$media) {
            this.$media.style.background = this.customColor.card;
         }
      }
   }

   // Getters and Setters following Slice pattern
   get title() { return this._title; }
   set title(value) {
      this._title = value;
      if (this.$title) {
         this.setupContent();
      }
   }

   get text() { return this._text; }
   set text(value) {
      this._text = value;
      if (this.$text && this._initialized) {
         this.setupContent();
      }
   }

   get details() { return this._details; }
   set details(value) { 
      this._details = value;
      if (this.$details) {
         this.setupContent();
         this.setupToggle();
      }
   }

   get badge() { return this._badge; }
   set badge(value) { 
      this._badge = value;
      if (this.$badge) {
         this.setupContent();
      }
   }

   get variant() { return this._variant || 'default'; }
   set variant(value) { 
      this._variant = value;
      if (this.$card && this._initialized) {
         this.setupVariant();
      }
   }

   get isOpen() { return this._isOpen || false; }
   set isOpen(value) {
      this._isOpen = Boolean(value);
      if (this.$card) {
      this.updateOpenState();
      }
   }

   get loading() { return this._loading || false; }
   set loading(value) { 
      this._loading = Boolean(value);
      if (this.$card) {
         this.updateState();
      }
   }

   get disabled() { return this._disabled || false; }
   set disabled(value) { 
      this._disabled = Boolean(value);
      if (this.$card) {
         this.updateState();
      }
   }

   get progress() { return this._progress; }
   set progress(value) { 
      this._progress = value;
      if (this.$progress) {
         this.setupContent();
      }
   }

   get interactive() { return this._interactive !== false; }
   set interactive(value) { 
      this._interactive = Boolean(value);
      if (this.$card) {
         this.updateState();
      }
   }

   get customColor() { return this._customColor; }
   set customColor(value) {
      this._customColor = value;
      if (this.$card) {
         this.applyCustomStyling();
      }
   }

   get icon() { return this._icon; }
   set icon(value) {
      this._icon = value;
      if (this.$media) {
         this.setupMedia();
      }
   }

   get image() { return this._image; }
   set image(value) {
      this._image = value;
      if (this.$media) {
         this.setupMedia();
      }
   }

   get actions() { return this._actions || []; }
   set actions(value) {
      this._actions = value;
      if (this.$actions) {
         this.setupActions();
      }
   }

   get onClick() { return this._onClick; }
   set onClick(value) {
      this._onClick = value;
      if (this.$card) {
         this.setupEventListeners();
      }
   }

   // Public API methods
   open() {
      this.isOpen = true;
   }

   close() {
      this.isOpen = false;
   }

   toggle() {
      this.toggleOpen();
   }

   setProgress(value) {
      this.progress = Math.max(0, Math.min(100, value));
   }

   updateActions(newActions) {
      this.actions = newActions;
      this.setupActions();
   }

   showLoading() {
      this.loading = true;
   }

   hideLoading() {
      this.loading = false;
   }

   enable() {
      this.disabled = false;
   }

   disable() {
      this.disabled = true;
   }
}

customElements.define('slice-card', Card);