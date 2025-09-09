# Rovo Agent Example: Unsplash Integration

This project demonstrates how to build a **Rovo Agent** using Atlassian Forge that can:
- Handle work item assignments
- Respond to @mentions in comments  
- Participate in Rovo chat conversations
- Integrate with external APIs (Unsplash in this example)

## Target Audience

This example is primarily designed for developers looking to integrate their tools and services with Atlassian's Rovo platform. It showcases key integration patterns and best practices for building AI agents that work seamlessly within the Atlassian ecosystem.

## What is a Rovo Agent?

A **Rovo Agent** is an AI-powered assistant that can:
- Be assigned to Jira work items to provide specialized assistance
- Respond when mentioned in comments across Atlassian products
- Participate in natural conversations in Rovo chat
- Execute custom actions to integrate with external systems

## Key Features Demonstrated

### 🎯 Work Item Assignment
- Agent can be assigned to Jira issues, stories, or tasks
- Automatically analyzes work item context (description, comments, fields)
- Provides relevant assistance based on the work item content

### 💬 Comment Integration  
- Responds to @mentions in comments on work items
- Maintains conversation context from previous comments
- Can reference and build upon earlier interactions

### 🤖 Chat Integration
- Participates in Rovo chat conversations
- Supports conversation starters for common use cases
- Maintains natural dialogue flow

### 🔌 External API Integration
- Demonstrates secure API key management
- Shows how to make external API calls from Forge
- Handles API errors and edge cases gracefully

## Project Structure

```
├── manifest.yml           # Forge app configuration and Rovo agent definition
├── package.json           # Node.js dependencies
├── src/
│   ├── actions.js         # Custom actions (e.g., search photos)
│   ├── resolver.js        # Backend resolvers for admin functionality
│   └── frontend/
│       └── admin.jsx      # Admin configuration UI
```

## Key Forge/Rovo Concepts Explained

### 1. Agent Definition (`manifest.yml`)
The `rovo:agent` module defines your AI agent's:
- **Personality & Behavior**: The `prompt` field contains instructions that shape how your agent behaves
- **Capabilities**: What the agent can and cannot do
- **Actions**: Custom functions the agent can execute
- **Conversation Starters**: Pre-defined prompts users can select

### 2. Custom Actions
Actions are functions your agent can execute to perform specific tasks:
- Defined in the `action` module in `manifest.yml`
- Implemented as Forge functions
- Can make external API calls, access databases, or perform computations
- Have structured inputs and outputs for reliable AI integration

### 3. Secure Configuration
- Uses Forge's secure storage (`storage.setSecret()`) for API keys
- Provides admin UI for configuration
- Separates configuration from code for security

### 4. Multi-Modal Interaction
Your agent can handle different types of interactions:
- **Work Items**: Assigned directly to issues/tasks
- **Comments**: @mentioned in conversations
- **Chat**: Direct conversations in Rovo

## Getting Started

### Prerequisites
- [Atlassian Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/)
- Node.js 18+ 
- Atlassian Cloud site with Rovo enabled
- Unsplash Developer Account (for this example)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/kannonboy/unsplash-rovo-agent-example.git
   cd unsplash-rovo-agent-example
   npm install
   ```

2. **Register your own copy of the app**
  ```bash
  forge register
  ```

2. **Deploy to your development environment:**
   ```bash
   forge deploy
   forge install
   ```

3. **Configure the Unsplash integration:**
   - Navigate to your Jira site
   - Go to Apps → Manage Apps → Unsplash Rovo Agent → Configuration
   - Enter your Unsplash Access Key from the [Unsplash Developers portal](https://unsplash.com/developers)

### Usage Examples

#### In Rovo Chat
```
User: Find me a photo relating to nature
Agent: [Searches Unsplash and returns nature photos with thumbnails and details]
```

#### On Work Items
1. Assign the "Unsplash Rovo Agent" to any Jira issue
2. The agent will analyze the issue and suggest relevant images
3. Users can @mention the agent in comments for additional image searches

#### In Comments
```
@Unsplash Rovo Agent can you find some technology images for this feature?
```

## Development Guide

### Adding New Actions

1. **Define the action in `manifest.yml`:**
   ```yaml
   action:
     - key: my-new-action
       name: My New Action
       function: myNewAction
       inputs:
         parameter:
           title: Parameter
           type: string
           required: true
   ```

2. **Implement the function in `src/actions.js`:**
   ```javascript
   export async function myNewAction(payload) {
     const { parameter } = payload;
     // Your logic here
     return { status: 'success', result: 'data' };
   }
   ```

3. **Register the function in `manifest.yml`:**
   ```yaml
   function:
     - key: myNewAction
       handler: actions.myNewAction
   ```

4. **Update the agent prompt to use the new action:**
   ```yaml
   rovo:agent:
     - key: my-agent
       prompt: |
         You can use the "my-new-action" action to...
       actions:
         - my-new-action
   ```

### Best Practices for Agent Prompts

1. **Be Specific About Scope**: Clearly define what your agent can and cannot do
2. **Handle Different Contexts**: Provide guidance for usage in work items, comments, and chat
3. **Error Handling**: Include instructions for when actions fail
4. **User Experience**: Guide the agent to be helpful and informative

## Resources

- [Forge Documentation](https://developer.atlassian.com/platform/forge/)
- [Forge Community](https://community.developer.atlassian.com/)

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

---

**Ready to build your own Rovo Agent?** Start by customizing this example with your own external API integration and agent personality. The patterns demonstrated here will help you create powerful AI assistants that enhance productivity within the Atlassian ecosystem.