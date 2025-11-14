from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Groq client with API key from environment
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not set in environment")
client = Groq(api_key=GROQ_API_KEY)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json(force=True) or {}
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Build system prompt
        system_prompt = (
            "You are InstitutionGPT, specializing in institutional guidance.\n\n"
            "**FORMAT REQUIREMENTS:**\n"
            "• Use bullet points for all key information\n"
            "• Keep responses under 150 words\n"
            "• Add line spacing between sections\n"
            "• Start with brief overview when relevant\n\n"
            "**EXPERTISE AREAS:**\n"
            "• Educational institutions & admissions\n"
            "• Healthcare systems navigation\n"
            "• Government services & processes\n"
            "• Corporate & non-profit structures\n\n"
            "**RESPONSE STYLE:**\n"
            "Professional, concise, and actionable. Always ask clarifying questions to "
            "provide personalized institutional guidance.\n\n"
            "**STRUCTURE:**\n"
            "Overview: [1 sentence]\n"
            "• Key point 1\n"
            "• Key point 2\n"
            "• Key point 3\n"
            "Next Steps: [if applicable]"
        )

        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1024,
        )

        ai_response = completion.choices[0].message.content.strip()
        
        if not ai_response:
            return jsonify({'error': 'AI response is empty'}), 500

        # Format response to preserve line breaks and bullet points
        # Split by double newlines for sections, then by single newlines for lines
        sections = ai_response.split('\n\n')
        formatted_sections = []
        
        for section in sections:
            lines = section.split('\n')
            formatted_lines = []
            
            for line in lines:
                line = line.strip()
                if line:
                    # Keep existing bullet points or add them if needed
                    if line.startswith('•') or line.startswith('-') or line.startswith('*'):
                        formatted_lines.append(line)
                    elif line.endswith(':') or line.startswith('**') or line.startswith('#'):
                        # Headers or section titles
                        formatted_lines.append(line)
                    else:
                        # Regular content lines that should be bullet points
                        formatted_lines.append(f"• {line}")
            
            if formatted_lines:
                formatted_sections.append('\n'.join(formatted_lines))
        
        formatted_response = '\n\n'.join(formatted_sections)

        return jsonify({'response': formatted_response, 'status': 'success'})

    except Exception as e:
        return jsonify({'error': f'Error processing request: {e}', 'status': 'error'}), 500


@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})


@app.route('/api-info')
def api_info():
    try:
        # Simple sanity check call
        ping = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=1,
        )
        return jsonify({
            'status': 'API is working',
            'model': 'llama3-8b-8192'
        })
    except Exception as e:
        return jsonify({'error': f'API Error: {e}', 'status': 'error'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
