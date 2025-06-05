# Data Ingestion API System

A Node.js and Express-based API system for handling data ingestion requests with priority-based processing and rate limiting.

## Features

- POST /ingest: Submit ingestion requests with priority levels
- GET /status/:id: Check batch processing status
- Priority Queue with Rate Limiting (1 batch per 5 seconds)
- Asynchronous batch processing
- Automatic batching (3 IDs per batch)
- Unique ingestion and batch IDs

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd data-ingestion-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```bash
PORT=5000
```

4. Start the server:
```bash
npm start
```

## API Endpoints

### POST /ingest
Submit a new ingestion request.

Request body:
```json
{
  "ids": [1, 2, 3, 4, 5],
  "priority": "HIGH"
}
```

Response:
```json
{
  "ingestion_id": "uuid",
  "status": "yet_to_start",
  "batches": [
    {
      "batch_id": "uuid",
      "ids": [1, 2, 3],
      "status": "yet_to_start"
    },
    {
      "batch_id": "uuid",
      "ids": [4, 5],
      "status": "yet_to_start"
    }
  ]
}
```

### GET /status/:id
Get the status of an ingestion request.

Response:
```json
{
  "ingestion_id": "uuid",
  "status": "triggered",
  "batches": [
    {
      "batch_id": "uuid",
      "ids": [1, 2, 3],
      "status": "completed"
    },
    {
      "batch_id": "uuid",
      "ids": [4, 5],
      "status": "triggered"
    }
  ]
}
```

## Running Tests

```bash
npm test
```

## Priority Levels

- HIGH: Highest priority
- MEDIUM: Medium priority
- LOW: Lowest priority

## Status Types

- yet_to_start: Initial state
- triggered: Processing started
- completed: Processing finished 