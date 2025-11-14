# InstitutionGPT - Your Specialized Institutional Assistant

A professional, AI-powered chatbot specifically designed to help users navigate institutional matters. Built with modern web technologies and powered by Groq's fast LLM inference.

## Features

- **🏛️ Institutional Expertise**: Specialized in educational institutions, healthcare systems, government agencies, and corporate structures
- **🎯 Personalized Guidance**: Tailored advice based on your specific institutional needs and goals
- **⚡ Fast AI Responses**: Powered by Groq's high-performance LLM inference with institutional context
- **📝 Smart Quick Actions**: Pre-built questions for common institutional topics
- **💼 Professional Design**: Clean, trustworthy interface designed for professional use
- **📱 Mobile Optimized**: Fully responsive design that works on all devices
- **🔒 Secure**: Environment-based API key management with enterprise-grade security

## Specialized Areas

- **🎓 Educational Institutions**: College admissions, university policies, academic requirements
- **🏥 Healthcare Systems**: Hospital procedures, medical institution navigation
- **🏛️ Government Agencies**: Federal/state processes, regulatory compliance, public services
- **🏢 Corporate Structures**: Organizational guidance, corporate policies, business processes
- **🤝 Non-Profit Organizations**: Foundation procedures, charity operations, grant processes
- **📋 Policy & Compliance**: Institutional policies, regulatory requirements, documentation

## Prerequisites

- Python 3.8 or higher
- Groq API key (get one at [console.groq.com](https://console.groq.com/))

## Quick Start

1. **Clone and Setup**
   ```bash
   # Navigate to the project directory (if not already there)
   cd chatbotproj6
   
   # Create a virtual environment
   python -m venv venv
   
   # Activate the virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   # venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Groq API key
   # GROQ_API_KEY=your_actual_groq_api_key_here
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```

5. **Open in Browser**
   Visit `http://localhost:8080` to start your institutional consultation!

## Project Structure

```
chatbotproj6/
├── app.py                 # Main Flask application with institutional AI
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── .env                  # Your environment variables (create this)
├── templates/
│   └── index.html        # InstitutionGPT interface
├── static/
│   ├── style.css         # Professional institutional styling
│   └── script.js         # Institutional-focused frontend logic
└── .github/
    └── copilot-instructions.md
```

## API Endpoints

- `GET /` - InstitutionGPT main interface
- `POST /chat` - Send institutional questions and receive AI guidance
- `GET /health` - Health check endpoint

## Configuration

### Environment Variables

Create a `.env` file in the project root with:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Groq Models

The application uses the `llama3-8b-8192` model by default. You can modify this in `app.py` to use other available models:

- `llama3-8b-8192`
- `llama3-70b-8192`
- `mixtral-8x7b-32768`

## Customization

### Styling
Edit `static/style.css` to customize the appearance:
- Colors and gradients
- Typography and spacing
- Animations and transitions
- Mobile responsiveness

### AI Behavior
Modify the system prompt in `app.py` to change the AI's personality:
```python
"content": "You are a helpful and friendly AI assistant..."
```

### Features
The modular JavaScript structure in `static/script.js` makes it easy to add features like:
- Message history
- File uploads
- Voice input
- Theme switching

## Development

### Running in Development Mode
```bash
# The app runs in debug mode by default
python app.py
```

### Production Deployment
```bash
# Use gunicorn for production
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure your `.env` file exists and contains a valid Groq API key
   - Check that the API key has sufficient credits

2. **Import Errors**
   - Make sure all dependencies are installed: `pip install -r requirements.txt`
   - Verify you're in the correct virtual environment

3. **Port Conflicts**
   - If port 8080 is in use, modify the port in `app.py`: `app.run(port=8081)`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the Groq API documentation
- Create an issue in the project repository
