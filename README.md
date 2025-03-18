# Vibe

# DISCLAIMER: NOT MY FAULT IF THIS DELETS YOUR COMPUTER

![You must learn its secret, Conan](https://github.com/snrogers/vibe/blob/main/docs/riddle-of-steel.png?raw=true)


Vibe is an interactive command-line tool powered by Large Language Model (LLM) Agents. It assists with software engineering tasks such as writing code, managing projects, and automating workflows. Vibe offers a chat-based interface where users can input prompts to execute commands, generate project overviews, and more—all within the terminal.

## Features

* **Chat Interface**: Engage with an LLM Agent through a command-line chat system
* **Tool Execution**: Run built-in tools like `bash` for shell commands or `project_overview` for directory trees
* **Debug Mode**: Enable detailed logs and event tracking for troubleshooting
* **Inspector Mode**: View hidden system and tool messages during interactions
* **Non-Interactive Mode**: Execute one-off prompts without entering the interactive CLI

# Installation
Vibe requires Bun, a fast JavaScript runtime, to be installed on your system. Follow the instructions on the official Bun website to install it.
Once Bun is installed, set up Vibe by cloning the repository and installing dependencies:

```bash
git clone https://github.com/snrogers/vibe.git
cd vibe
bun install
```

## MCP Server Configuration

Vibe supports the Model Context Protocol (MCP) for integrating with external tools and services.
To use MCP, you'll need to set up a configuration file at `$HOME/.vibe.mcpServers.js`.

This file defines the MCP servers that Vibe can connect to. If the file doesn't exist, Vibe will create an empty configuration automatically.

Example configuration:

```javascript
module.exports = {
  mcpServers: {
    // Example server configuration
    "server1": {
      command: "path/to/mcp-server",
      args: ["--option1", "--option2"],
      env: {
        "ENV_VAR1": "value1",
        "ENV_VAR2": "value2"
      }
    },
    // You can define multiple servers
    "server2": {
      command: "another/mcp/server",
      args: [],
      env: {}
    }
  }
};
```

The configuration allows you to:
- Define multiple named MCP servers
- Specify the command to start each server
- Provide command-line arguments
- Set environment variables

MCP servers extend Vibe's functionality by providing additional tools that can be called by the LLM.

## Usage
Start Vibe by running:

```bash
bun run index.ts
```

This launches the interactive CLI, where you can type prompts and receive
responses from the LLM Agent.

## Command-Line Options

Vibe supports the following options:

* `-d, --debug`: Enable debug mode to display detailed logs
* `-n="PROMPT", --nonInteractive="PROMPT"`: Run a single prompt non-interactively and exit
* `-h, --help`: Show the help message

## Examples:
Run in debug mode:

```bash
bun run index.ts -d
```

Execute a non-interactive prompt:

```bash
bun run index.ts -n="Show me the project directory structure"
```

## Function Keys

During interactive use, these function keys are available:

* **F1**: Display help information (not yet fully implemented)
* **F2**: Toggle inspector mode to show system and tool messages

## Slash Commands

Vibe supports slash commands within the chat interface:

* `/help`:  Get assistance with using Vibe [UNIMPLEMENTED]
* `/compact`: Compact the conversation to manage context limits
Example
Start Vibe:

```tty
bun run index.ts
```

Type a prompt:

```tty
> What is the current working directory?
```

Response:

```tty
The current working directory is /path/to/your/project.
```

Configuration
**Environment Variables**:

* `GROK_API_KEY`: API key for xAI's Grok LLM (required for default model)
* `DEEPSEEK_API_KEY`: API key for DeepSeek LLM (not configurable without code changes)
* `V_DEBUG`: Set to true to enable debug mode by default

Note: LLM Models are not yet configurable through environment variables.
      To use a different model such as DeepSeek instead of the default Grok,
      you would need to modify the code.

## TODO

The following features and improvements are planned for future releases:

* [ ] **LLM Provider Configuration**: Make LLM model selection configurable within the App
* [ ] **Persistent Chat History**: Implement storage for conversation history between sessions
* [ ] **Improved UI**: Enhance the terminal UI with more interactive elements and visual feedback
* [ ] **Agent Swarms**: Implement multi-agent cooperation for complex problem solving
* [ ] **Vision Model Support**: Add capability to process and analyze images
* [ ] **Image Generation Support**: Integrate with image generation models to create visuals on demand

License
Vibe is released under the MIT License. See the LICENSE file for details.
