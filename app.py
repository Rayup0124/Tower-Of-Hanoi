from flask import Flask, render_template
import os

app = Flask(__name__,
            template_folder='.',
            static_folder='.',
            static_url_path='')

@app.route('/')
def index():
    """Serves the Tower of Hanoi game page."""
    return render_template('index.html')

@app.errorhandler(404)
def not_found(e):
    """Handle file not found errors."""
    return f"File not found: {e}", 404

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
