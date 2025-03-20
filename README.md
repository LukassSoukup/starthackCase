# HarvestGuard

A START Hack project

## Overview

The backend is built with Python, while the frontend is a Next.js application.

## Repository Structure

- **backend/**
  - **app/**  
    Contains:
    - [`api.py`](backend/app/api.py) — Module to get data from syngenta API
    - [`gemini.py`](backend/app/gemini.py) — Recomendation System (LLM).
    - [`main.py`](backend/app/main.py) — Application entry point and endpoints.
    - **syngenta/** — Contains modules specific to Syngenta.
  - [`requirements.txt`](backend/requirements.txt) — Python dependencies.

- **docs/**
  - [`syngenta_algorithms.md`](docs/syngenta_algorithms.md) — Documentation on Syngenta algorithms.
  - [`syngenta_products.md`](docs/syngenta_products.md) — Documentation on Syngenta products.

- **frontend/**
  - **app/** — Next.js application pages.
  - [`package.json`](frontend/package.json) — Node.js dependencies and scripts.
  - [`next.config.ts`](frontend/next.config.ts) — Next.js configuration.
  - [`tsconfig.json`](frontend/tsconfig.json) — TypeScript configuration.
  - **components/**, **lib/**, **public/** — Application assets and utilities.

## Getting Started

### Backend Setup

1. **Navigate to the backend directory:**
    ```sh
    cd backend
    ```
2. **Create a virtual environment and install dependencies:**
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    pip install -r requirements.txt
    ```
3. **Configure your environment variables:**  
   Copy the [`.env`](backend/app/.env) file and adjust as needed.

4. **Run the application:**
    ```sh
    python app/main.py
    ```

### Frontend Setup

1. **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```
2. **Install Node.js dependencies:**
    ```sh
    npm install
    ```
3. **Start the development server:**
    ```sh
    npm run dev
    ```
