const NAMES = [
  'address-book','adjustments-horizontal','adjustments-vertical','align-center','angle-down','angle-left',
  'angle-right','angle-up','annotation','apple','archive','archive-arrow-down','arrow-down',
  'arrow-down-to-bracket','arrow-left','arrow-left-to-bracket','arrow-right','arrow-right-alt',
  'arrow-right-to-bracket','arrow-sort-letters','arrow-up','arrow-up-down','arrow-up-from-bracket',
  'arrow-up-right-down-left','arrow-up-right-from-square','arrows-repeat','arrows-repeat-count','atom',
  'backward-step','badge-check','bars','bars-from-left','bell','bell-active','bell-active-alt','bell-ring',
  'blender-phone','book','book-open','bookmark','brain','briefcase','bug','building','bullhorn',
  'calendar-edit','calendar-month','calendar-plus','calendar-week','camera-photo','caption','caret-down',
  'caret-left','caret-right','caret-sort','caret-up','cart','cart-plus','cart-plus-alt','cash','chart',
  'chart-line-down','chart-line-up','chart-mixed','chart-mixed-dollar','chart-pie','check','check-circle',
  'check-plus-circle','chevron-double-down','chevron-double-left','chevron-double-right','chevron-double-up',
  'chevron-down','chevron-left','chevron-right','chevron-sort','chevron-up','circle-pause','circle-plus',
  'clapperboard-play','clipboard','clipboard-check','clipboard-list','clock','close','close-circle',
  'cloud-arrow-up','code','code-branch','code-fork','code-merge','code-pull-request','cog','column',
  'command','compress','computer-speaker','credit-card','css','database','desktop-pc','discord','dna',
  'dollar','dots-horizontal','dots-vertical','download','draw-square','dribbble','dropbox','edit',
  'envelope','envelope-open','euro','exclamation-circle','expand','eye','eye-slash','face-explode',
  'face-grin','face-grin-stars','face-laugh','facebook','file','file-chart-bar','file-check',
  'file-circle-plus','file-clone','file-code','file-copy','file-copy-alt','file-csv','file-export',
  'file-image','file-import','file-invoice','file-lines','file-music','file-paste','file-pdf','file-pen',
  'file-ppt','file-search','file-shield','file-video','file-word','file-zip','filter','fingerprint',
  'fire','flag','flowbite','folder','folder-arrow-right','folder-duplicate','folder-open','folder-plus',
  'forward','forward-step','gift-box','github','globe','google','grid','grid-plus','headphones','heart',
  'home','hourglass','html','image','inbox','inbox-full','indent','info-circle','javascript','keyboard',
  'label','landmark','layers','letter-bold','letter-italic','letter-underline','life-saver','lightbulb',
  'link','linkedin','list','list-music','lock','lock-open','lock-time','mail-box','map-pin','map-pin-alt',
  'message-caption','message-dots','messages','microphone','minimize','minus','mobile-phone','moon',
  'newspaper','npm','ordered-list','outdent','palette','paper-clip','paper-plane','paragraph','pause',
  'pen','pen-nib','phone','play','plus','printer','profile-card','question-circle','quote','react',
  'receipt','rectangle-list','redo','refresh','reply','reply-all','restore-window','rocket',
  'ruler-combined','sale-percent','scale-balanced','search','share-all','share-nodes','shield',
  'shield-check','shopping-bag','shuffle','singleSlice','sliceJs','sliceLogo','slicePizza','sort',
  'sort-horizontal','stackoverflow','star','star-half','star-half-stroke','store','sun','swatchbook',
  'table-column','table-row','tablet','tag','tailwind','terminal','text-size','text-slash','thumbs-down',
  'thumbs-up','ticket','trash-bin','truck','twitter','undo','upload','user','user-add','user-circle',
  'user-edit','user-headset','user-remove','user-settings','users','users-group','video-camera','vue',
  'volume-down','volume-up','wallet','wand-magic-sparkles','window','window-restore','X','youtube',
  'zoom-in','zoom-out'
];

const NAMES_SET = new Set(NAMES);
const styleTypes = { outlined: 'out', filled: 'fil' };

export default class Icon extends HTMLElement {

   static props = {
      name: {
         type: 'string',
         default: 'youtube'
      },
      size: {
         type: 'string',
         default: 'small'
      },
      color: {
         type: 'string',
         default: 'black'
      },
      iconStyle: {
         type: 'string',
         default: 'filled'
      }
   };

   constructor(props) {
      super();

      slice.attachTemplate(this);
      this.$icon = this.querySelector('i');

      slice.controller.setComponentProps(this, props);
   }

   get random() {
      return this.$icon.classList;
   }

   set random(value) {}

   init() {
      if (this._name && !NAMES_SET.has(this._name)) {
         console.warn(
            `[Icon] "${this._name}" is not a valid icon name. ` +
            `Check the Icon reference for valid names.`
         );
      }
   }

   update() {
      if (this.$icon) {
         if (this._name) this.name = this._name;
         if (this._iconStyle) this.iconStyle = this._iconStyle;
         if (this._size) this.size = this._size;
         if (this._color) this.color = this._color;
      }
   }

   get name() {
      return this._name;
   }

   set name(value) {
      this._name = value;
      if (this.$icon) {
         this.$icon.className = '';
         this.$icon.classList.add(`slc-${styleTypes[this._iconStyle]}${value}`);
      }
   }

   get iconStyle() {
      return this._iconStyle;
   }

   set iconStyle(value) {
      if (value !== 'filled' && value !== 'outlined') value = 'filled';
      this._iconStyle = value;
      this.name = this._name;
   }

   get size() {
      return this._size;
   }

   set size(value) {
      switch (value) {
         case 'small':
            this._size = '16px';
            break;
         case 'medium':
            this._size = '20px';
            break;
         case 'large':
            this._size = '24px';
            break;
         default:
            this._size = value;
      }

      if (this.$icon) {
         this.$icon.style.fontSize = this._size;
      }
   }

   get color() {
      return this._color;
   }

   set color(value) {
      this._color = value;
      if (this.$icon) {
         this.$icon.style.color = value;
      }
   }
}

customElements.define('slice-icon', Icon);
