# Support Ticket System

This project is a full-stack Support Ticket System built as part of a Tech Intern assessment.

## Tech Stack

- Backend: Django, Django REST Framework
- Frontend: React
- Database: PostgreSQL
- LLM Integration: OpenAI API
- Infrastructure: Docker, Docker Compose

## Features

- Create support tickets with title and description
- Auto-suggest category and priority using an LLM
- Users can override suggested category and priority
- List and view all tickets (newest first)
- Update ticket status
- Aggregated statistics endpoint
- Fully containerized setup using Docker

## API Endpoints

- `POST /api/tickets/` – Create a new ticket
- `GET /api/tickets/` – List all tickets (supports filters and search)
- `PATCH /api/tickets/<id>/` – Update ticket fields such as status, category, or priority
- `POST /api/tickets/classify/` – Get LLM-based category and priority suggestions
- `GET /api/tickets/stats/` – Aggregated ticket statistics

## LLM Design

The `/api/tickets/classify/` endpoint sends the ticket description to the OpenAI API with a prompt requesting a suitable category and priority.

OpenAI was chosen due to its reliable text understanding and simple API integration for classification tasks.

If the LLM is unavailable or returns an error, the system handles the failure gracefully and allows the user to manually select the category and priority without blocking ticket creation.

## Setup Instructions

### Prerequisites

- Docker
- Docker Compose
- OpenAI API key

### Running the Application

```bash
export OPENAI_API_KEY=your_api_key_here
docker compose up --build
Accessing the Application

Frontend: http://localhost:3000

Backend API: http://localhost:8000/api/tickets/
```
## Notes

The entire application runs end-to-end with a single docker compose up --build command.

PostgreSQL, backend, and frontend services are all managed via Docker Compose.

The OpenAI API key is provided via environment variables and is not hardcoded.

The project includes the .git directory to allow review of incremental commit history.

