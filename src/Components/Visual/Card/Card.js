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
         default: 'default',
         allowedValues: ['default', 'elevated', 'outlined', 'minimal']
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
         default: null
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

      this.classList.add('slice-card');

      this.$card = this;
      this.$title = this.querySelector('.card-title');
      this.$text = this.querySelector('.card-text');
      this.$textTooltip = this.querySelector('.card-text-tooltip');
      this.$media = this.querySelector('.card-media');
      this.$details = this.querySelector('.card-details');
      this.$detailsContent = this.querySelector('.card-details-content');
      this.$badge = this.querySelector('.card-badge');
      this.$toggle = this.querySelector('.card-toggle');
      this.$progress = this.querySelector('.card-progress');
      this.$mediaContent = this.querySelector('.card-media-content');
      this.$actions = this.querySelector('.card-actions');

      slice.controller.setComponentProps(this, props);
   }

   async init() {
      this.setupVariant();
      this.setupContent();

      if (this._icon || this._image) {
         await this.setupMedia();
      }

      await this.setupActions();
      this.setupToggle();
      this.setupEventListeners();
      this.applyCustomStyling();
      this.updateState();

      this._initialized = true;
   }

   setupVariant() {
      this.$card.classList.remove('card-default', 'card-elevated', 'card-outlined', 'card-minimal');
      if (this.variant) {
         this.$card.classList.add(`card-${this.variant}`);
      } else {
         this.$card.classList.add('card-default');
      }
   }

   setupContent() {
      if (this.$title) {
         if (this.title) {
            this.$title.textContent = this.title;
            this.$title.style.display = 'block';
         } else {
            this.$title.style.display = 'none';
         }
      }

      if (this.$text) {
         if (this.text) {
            this.$text.textContent = this.text;
            this.$text.style.display = 'block';
         } else {
            this.$text.style.display = 'none';
         }
      }

      if (this.$details && this.$detailsContent) {
         if (this.details) {
            this.$detailsContent.textContent = this.details;
            this.$details.style.display = 'block';
         } else {
            this.$details.style.display = 'none';
         }
      }

      if (this.$badge) {
         if (this.badge) {
            this.$badge.textContent = this.badge;
         } else {
            this.$badge.textContent = '';
         }
      }

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
      return;
   }

   async setupMedia() {
      if (this.$mediaContent) {
         this.$mediaContent.innerHTML = '';
      }

      if (this.image) {
         const img = document.createElement('img');
         img.src = this.image;
         img.alt = this.title || 'Card image';
         img.classList.add('card-image');
         img.onerror = () => {
            this.setupIconInMedia();
         };
         this.$mediaContent.appendChild(img);
      } else if (this.icon) {
         await this.setupIconInMedia();
      } else {
         if (this.$media) {
            this.$media.style.display = 'none';
         }
         return;
      }

      if (this.$media) {
         this.$media.style.display = 'flex';
      }
   }

   async setupIconInMedia() {
      try {
         if (!this.$mediaContent) {
            return;
         }

         this.$mediaContent.innerHTML = '';

         if (!this.icon || !this.icon.name) {
            return;
         }

         const iconElement = await slice.build('Icon', {
            name: this.icon.name,
            iconStyle: this.icon.iconStyle || 'filled',
            size: '32px',
            color: 'var(--primary-color)'
         });

         if (iconElement) {
            this.$mediaContent.appendChild(iconElement);
         }
      } catch (error) {
         console.warn('Card: Failed to create icon', error);
      }
   }

   async setupActions() {
      this.$actions.innerHTML = '';

      if (!this.actions || this.actions.length === 0) {
         this.$actions.style.display = 'none';
         return;
      }

      this.$actions.style.display = 'flex';

      for (const action of this.actions) {
         try {
            const opts = {
               value: action.text || 'Action',
               onClickCallback: action.onClick || (() => {})
            };
            if (action.color) {
               opts.customColor = action.color;
            }
            const button = await slice.build('Button', opts);
            this.$actions.appendChild(button);
         } catch (error) {
            console.warn('Card: Failed to create action button', error);
         }
      }
   }

   setupToggle() {
      if (this.details) {
         this.$toggle.style.display = 'flex';
      } else {
         this.$toggle.style.display = 'none';
      }
   }

   setupEventListeners() {
      if (this._toggleListener) {
         this.$toggle.removeEventListener('click', this._toggleListener);
      }
      if (this._cardClickListener) {
         this.$card.removeEventListener('click', this._cardClickListener);
      }
      if (this._keydownListener) {
         this.$card.removeEventListener('keydown', this._keydownListener);
      }

      this._toggleListener = (e) => {
         e.stopPropagation();
         this.toggleOpen();
      };
      this.$toggle.addEventListener('click', this._toggleListener);

      if (this.interactive && this.onClick) {
         this._cardClickListener = (e) => {
            if (!this.disabled && !e.target.closest('.card-toggle') && !e.target.closest('.card-actions')) {
               this.onClick(e);
            }
         };
         this.$card.addEventListener('click', this._cardClickListener);
      }

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
      if (this.loading) {
         this.$card.classList.add('loading');
         this.$card.setAttribute('aria-busy', 'true');
      } else {
         this.$card.classList.remove('loading');
         this.$card.removeAttribute('aria-busy');
      }

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

      if (this.interactive) {
         this.$card.classList.add('interactive');
      } else {
         this.$card.classList.remove('interactive');
      }

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
      if (this._initialized && this.$media && !this._image && this.$mediaContent) {
         this.setupMedia();
      }
   }

   get image() { return this._image; }
   set image(value) {
      this._image = value;
      if (this._initialized && this.$media && !this._icon && this.$mediaContent) {
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

   async refreshMedia() {
      if (this._initialized && this.$media) {
         await this.setupMedia();
      }
   }

   async setIcon(iconData) {
      this._icon = iconData;
      if (this._initialized && this.$media && !this._image) {
         await this.setupMedia();
      }
   }

   async setImage(imageUrl) {
      this._image = imageUrl;
      if (this._initialized && this.$media && !this._icon) {
         await this.setupMedia();
      }
   }
}

customElements.define('slice-card', Card);
