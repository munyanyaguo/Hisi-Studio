#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install pipenv
pipenv install --deploy --ignore-pipfile --system

# Run migrations
flask db upgrade

# Seed initial data (optional, maybe check if already seeded)
# python seed_data.py
