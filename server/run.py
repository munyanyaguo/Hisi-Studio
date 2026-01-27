"""
Application entry point
Runs the Flask development server
"""

from app import create_app
from app.extensions import db

# Create app instance
app = create_app('development')

# Shell context (useful for flask shell)
@app.shell_context_processor
def make_shell_context():
    """Make database and models available in flask shell"""
    return {
        'db': db,
        'app': app
    }

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
