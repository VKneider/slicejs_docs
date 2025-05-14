export default class CommandsDocumentation extends HTMLElement {
   constructor(props) {
      super();
      slice.attachTemplate(this);

      slice.controller.setComponentProps(this, props);
      this.debuggerProps = [];
   }

   async init() {
      // Create detailed code examples
      const initExample = await slice.build('CodeVisualizer', {
         value: `# Initialize a new Slice.js project
npm run slice:init

# This will:
# - Set up the basic folder structure
# - Create configuration files
# - Install dependencies`,
         language: 'bash'
      });

      const createExample = await slice.build('CodeVisualizer', {
         value: `# Create a new component
npm run slice:create

# The CLI will prompt you for:
# - Component name
# - Component category (Visual, Service, AppComponents)
# - Whether to create a template for the component`,
         language: 'bash'
      });

      const listExample = await slice.build('CodeVisualizer', {
         value: `# List all components
npm run slice:list

# This will display:
# - All components by category
# - Component paths
# - Component types`,
         language: 'bash'
      });

      const deleteExample = await slice.build('CodeVisualizer', {
         value: `# Delete a component
npm run slice:delete

# The CLI will prompt you to:
# - Select a component to delete
# - Confirm deletion`,
         language: 'bash'
      });

      const startExample = await slice.build('CodeVisualizer', {
         value: `# Start the development server
npm run slice:start

# This will:
# - Start an Express server on port 3001
# - Serve your application
# - Support live reloading`,
         language: 'bash'
      });

      // Add code examples to their respective containers
      this.querySelector('.init-example').appendChild(initExample);
      this.querySelector('.create-example').appendChild(createExample);
      this.querySelector('.list-example').appendChild(listExample);
      this.querySelector('.delete-example').appendChild(deleteExample);
      this.querySelector('.start-example').appendChild(startExample);
      
      // Create demo buttons with command actions
      const commandDemo = await slice.build('Details', {
         title: 'Example Command Workflow',
         text: 'Here is a typical workflow using Slice.js CLI commands.'
      });
      
      const demoContent = document.createElement('div');
      demoContent.classList.add('command-demo');
      
      const workflowExample = await slice.build('CodeVisualizer', {
         value: `# 1. Initialize your project
npm run slice:init

# 2. Start the development server
npm run slice:start

# 3. In another terminal, create components as needed
npm run slice:create

# 4. List your components to verify
npm run slice:list

# 5. Delete components if necessary
npm run slice:delete`,
         language: 'bash'
      });
      
      demoContent.appendChild(workflowExample);
      commandDemo.addDetail(demoContent);
      this.querySelector('.command-workflow').appendChild(commandDemo);
   }
}

customElements.define('slice-commandsdocumentation', CommandsDocumentation);