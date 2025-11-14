<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Chatbot Project Instructions

This is a modern web-based chatbot application that integrates with the Groq Cloud API for AI responses.

## Project Structure
- **Flask Backend**: Uses Python Flask for the web server and API endpoints
- **Modern Frontend**: Clean HTML/CSS/JavaScript interface with responsive design
- **Groq Integration**: Leverages Groq's fast LLM inference for chat responses
- **Environment Configuration**: Uses environment variables for secure API key management

## Key Technologies
- Python Flask for backend API
- Groq Cloud API for AI responses
- Modern CSS with gradients and animations
- Vanilla JavaScript for frontend interactivity
- Font Awesome icons for UI elements

## Development Guidelines
- Follow Flask best practices for route handling
- Implement proper error handling for API calls
- Maintain responsive design principles
- Use semantic HTML and accessible markup
- Keep JavaScript modular and well-documented
- Implement proper environment variable management

## API Integration
- Use the Groq Python client library
- Handle rate limiting and error responses gracefully
- Implement proper request/response validation
- Support different Groq models (llama3-8b-8192, etc.)

## Security Considerations
- Never expose API keys in frontend code
- Use environment variables for sensitive configuration
- Implement proper CORS handling
- Validate all user inputs on the backend
