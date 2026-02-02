export default class InitMethodDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      const initExample = await slice.build('CodeVisualizer', {
         value: `export default class UserProfile extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);
      slice.controller.setComponentProps(this, props);
   }

   async init() {
      // DOM references
      this.$userInfo = this.querySelector(".user-info");
      this.$avatar = this.querySelector(".avatar");

      // Fetch initial data once
      this.userData = await this.fetchUserData(this.userId);

      // Create static child components
      this.editButton = await slice.build("Button", {
         sliceId: "edit-profile-btn",
         value: "Edit Profile",
         onClickCallback: () => this.editProfile()
      });

      // Attach event listeners once
      this.addEventListener("click", this.handleClick.bind(this));

      // Initial render
      this.updateUserUI();
      this.appendChild(this.editButton);
   }

   updateUserUI() {
      this.$userInfo.textContent = this.userData.name;
      this.$avatar.src = this.userData.avatar;
   }
}

customElements.define("slice-user-profile", UserProfile);`,
         language: 'javascript'
      });

      const bestPractices = await slice.build('CodeVisualizer', {
         value: `// ✅ init() Best Practices

// 1) Query DOM after template is attached
this.$container = this.querySelector(".container");

// 2) Fetch initial data once
this.initialData = await this.fetchInitialData();

// 3) Create static child components
this.header = await slice.build("Header", { title: "Dashboard" });

// 4) Add listeners that live for the component lifetime
this.$button.addEventListener("click", this.onClick.bind(this));`,
         language: 'javascript'
      });

      const pitfalls = await slice.build('CodeVisualizer', {
         value: `// ❌ init() Pitfalls

// 1) Accessing DOM in constructor
constructor(props) {
   super();
   slice.attachTemplate(this);
   // ❌ Wrong: template not attached yet
   this.$button = this.querySelector(".btn");
}

// 2) Creating dynamic lists here
async init() {
   for (const item of this.items) {
      const card = await slice.build("Card", { data: item });
      this.appendChild(card);
   }
   // ✅ Move dynamic list creation to update() with cleanup
}`,
         language: 'javascript'
      });

      this.querySelector('.init-example').appendChild(initExample);
      this.querySelector('.best-practices').appendChild(bestPractices);
      this.querySelector('.pitfalls').appendChild(pitfalls);
   }
}

customElements.define('slice-initmethoddocumentation', InitMethodDocumentation);
