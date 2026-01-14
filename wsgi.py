import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from server.app import create_app

app = create_app()
