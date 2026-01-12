#!/usr/bin/env python3
"""Test script to verify contact info API endpoint"""

import requests
import json

API_URL = "http://localhost:5000/api/v1/contact/info"

try:
    print(f"Testing endpoint: {API_URL}")
    response = requests.get(API_URL)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"\nResponse Body:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
    print(f"Response text: {response.text if 'response' in locals() else 'N/A'}")
