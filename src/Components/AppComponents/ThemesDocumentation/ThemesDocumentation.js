export default class ThemesDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Code examples to show in the documentation
      const themeConfigExample = await slice.build("CodeVisualizer", {
         language: "json",
         value: `{
  "themeManager": {
    "enabled": true,
    "defaultTheme": "LIGHT",
    "saveThemeLocally": true,
    "useBrowserTheme": false
  }
}`
      });
      this.querySelector(".theme-config-example").appendChild(themeConfigExample);

      const themeApplyExample = await slice.build("CodeVisualizer", {
         language: "javascript",
         value: `// Change to a specific theme
await slice.setTheme("DARK");

// Get current theme
const currentTheme = slice.theme; // Returns theme name, e.g. "DARK"

// In a button or switch to toggle themes
const themeToggleButton = await slice.build("Button", {
   value: "Change Theme",
   onClickCallback: async () => {
      if (slice.theme === "LIGHT") {
         await slice.setTheme("DARK");
      } else {
         await slice.setTheme("LIGHT");
      }
   }
});`
      });
      this.querySelector(".theme-apply-example").appendChild(themeApplyExample);

      const cssVarsExample = await slice.build("CodeVisualizer", {
         language: "css",
         value: `:root {
  /* Main colors */
  --primary-color: #0066ff;
  --primary-color-rgb: rgb(0, 102, 255);
  --primary-background-color: #fff;
  --primary-color-contrast: #fff;
  --primary-color-shade: #ddd;
  
  /* Secondary colors */
  --secondary-color: #63ccfd;
  --secondary-background-color: #ddd;
  --secondary-color-contrast: #fff;
  
  /* State colors */
  --success-color: #00ff40;
  --warning-color: #ffff40;
  --danger-color: #ff0000;
  
  /* Typography */
  --font-primary-color: #000;
  --font-secondary-color: #474747;
  
  /* Other styles */
  --border-radius-slice: 5px;
  --slice-border: 1px;
  --font-family: system-ui, sans-serif;
}`
      });
      this.querySelector(".css-vars-example").appendChild(cssVarsExample);

      const customThemeExample = await slice.build("CodeVisualizer", {
         language: "css",
         value: `/* src/Themes/MyCustomTheme.css */
:root {
  /* Slice branded light variation */
  --primary-color: #9333ea;
  --primary-color-rgb: rgb(147, 51, 234);
  --primary-background-color: #fefbff;
  --primary-color-contrast: #ffffff;
  --primary-color-shade: #7c3aed;

  --secondary-color: #10b981;
  --secondary-background-color: #f0fdf4;
  --secondary-color-contrast: #ffffff;

  --success-color: #059669;
  --warning-color: #f59e0b;
  --danger-color: #dc2626;

  --font-primary-color: #1a0b2e;
  --font-secondary-color: #6b46c1;
}`
      });
      this.querySelector(".custom-theme-example").appendChild(customThemeExample);

      // Create visual theme examples
      const themeGrid = await slice.build("Grid", {
         columns: 3,
         rows: 1
      });

      // Create color samples for themes
      const createThemeSample = async (themeName, primaryColor, bgColor, textColor) => {
         const sample = document.createElement("div");
         sample.classList.add("theme-sample");
         sample.style.backgroundColor = bgColor;
         sample.style.color = textColor;
         sample.style.borderColor = primaryColor;
         
         const title = document.createElement("h3");
         title.textContent = themeName;
         
         const button = await slice.build("Button", {
            value: "Example Button",
            customColor: {
               button: primaryColor,
               label: textColor
            }
         });
         
         sample.appendChild(title);
         sample.appendChild(button);
         
         return sample;
      };

const lightSample = await createThemeSample("LIGHT", "#9333EA", "#FEFBFF", "#1A0B2E");
const darkSample = await createThemeSample("DARK", "#A855F7", "#140F1F", "#F4ECFF");
      const legacySample = await createThemeSample("Legacy (migration)", "#64748B", "#F8FAFC", "#334155");
      
await themeGrid.setItem(lightSample);
await themeGrid.setItem(darkSample);
      await themeGrid.setItem(legacySample);

      this.querySelector(".theme-samples").appendChild(themeGrid);
   }
}

customElements.define("slice-themesdocumentation", ThemesDocumentation);

