#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install pipenv
pipenv install --deploy --ignore-pipfile --system

# Create hisi schema if it doesn't exist
echo "Creating database schema if needed..."
python -c "
from sqlalchemy import create_engine, text
import os

db_url = os.environ.get('DATABASE_URL')
if db_url:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        conn.execute(text('CREATE SCHEMA IF NOT EXISTS hisi'))
        conn.commit()
    print('Schema hisi created or already exists')
"

# Run migrations
flask db upgrade

# Seed initial data (optional, maybe check if already seeded)
# python seed_data.py
