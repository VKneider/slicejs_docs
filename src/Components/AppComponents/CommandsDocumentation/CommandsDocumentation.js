export default class CommandsDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Create detailed code examples for all CLI commands
      const initExample = await slice.build('CodeVisualizer', {
         value: `# Initialize a new Slice.js project
npm run slice:init

# This will:
# - Set up the basic folder structure
# - Create configuration files
# - Install dependencies`,
         language: 'bash'
      });

      const devExample = await slice.build('CodeVisualizer', {
         value: `# Start development server
npm run slice:dev
# or
npm run slice:start

# This will:
# - Start an Express server on port 3000 (default)
# - Serve your application from /src directory
# - Support live reloading`,
         language: 'bash'
      });

      const createExample = await slice.build('CodeVisualizer', {
         value: `# Create a new local component
npm run slice:component create
# or
npm run slice:comp new

# The CLI will prompt you for:
# - Component name
# - Component category (Visual, Service, AppComponents)
# - Properties for Visual components`,
         language: 'bash'
      });

      const listExample = await slice.build('CodeVisualizer', {
         value: `# List local components
npm run slice:component list
# or
npm run slice:comp ls

# This will display:
# - All components by category
# - Component paths
# - Component types`,
         language: 'bash'
      });

      const deleteExample = await slice.build('CodeVisualizer', {
         value: `# Delete a local component
npm run slice:component delete
# or
npm run slice:comp remove

# The CLI will prompt you to:
# - Select a component to delete
# - Confirm deletion`,
         language: 'bash'
      });

      const getExample = await slice.build('CodeVisualizer', {
         value: `# Get components from official repository
npm run slice:get Button Card Input
npm run slice:get FetchManager --service
npm run slice:get Button --force

# Options:
# -f, --force: Force overwrite existing components
# -s, --service: Install Service components instead of Visual`,
         language: 'bash'
      });

      const browseExample = await slice.build('CodeVisualizer', {
         value: `# Browse available components
npm run slice:browse

# This will display:
# - All available components in official repository
# - Component categories and file types
# - Installation examples`,
         language: 'bash'
      });

      const syncExample = await slice.build('CodeVisualizer', {
         value: `# Sync local components to latest versions
npm run slice:sync
npm run slice:sync --force

# This will:
# - Update all local Visual components
# - Download latest versions from repository
# - Preserve local modifications`,
         language: 'bash'
      });



      const versionExample = await slice.build('CodeVisualizer', {
         value: `# Check version and updates
npm run slice:version
npm run slice:update

# This will:
# - Show current CLI version
# - Check for available updates
# - Display update information`,
         language: 'bash'
      });

      // Add code examples to their respective containers
      this.querySelector('.init-example').appendChild(initExample);
      this.querySelector('.dev-example').appendChild(devExample);
      this.querySelector('.create-example').appendChild(createExample);
      this.querySelector('.list-example').appendChild(listExample);
      this.querySelector('.delete-example').appendChild(deleteExample);
      this.querySelector('.get-example').appendChild(getExample);
      this.querySelector('.browse-example').appendChild(browseExample);
      this.querySelector('.sync-example').appendChild(syncExample);
      this.querySelector('.version-example').appendChild(versionExample);
      
      // Create demo buttons with command actions
      const commandDemo = await slice.build('Details', {
         title: 'Complete CLI Workflow Example',
         text: 'Here is a typical workflow using all Slice.js CLI commands.'
      });
      
      const demoContent = document.createElement('div');
      demoContent.classList.add('command-demo');
      
      const workflowExample = await slice.build('CodeVisualizer', {
         value: `# 1. Initialize your project
npm run slice:init

# 2. Start the development server
npm run slice:dev

# 3. Create local components as needed
npm run slice:component create

# 4. Get components from official repository
npm run slice:get Button Card Input

# 5. Browse available components
npm run slice:browse

# 6. Sync components to latest versions
npm run slice:sync

# 7. Check for updates
npm run slice:update`,
         language: 'bash'
      });
      
      demoContent.appendChild(workflowExample);
      commandDemo.addDetail(demoContent);
      this.querySelector('.command-workflow').appendChild(commandDemo);
   }
}

customElements.define('slice-commandsdocumentation', CommandsDocumentation);