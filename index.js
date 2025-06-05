const express = require('express');
const dotenv = require('dotenv');
const ingestRoutes = require('./data-ingestion-api/routes/ingest');
const statusRoutes = require('./data-ingestion-api/routes/status');


// Load environment variables
dotenv.config();

const app = express();
//const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/ingest', ingestRoutes);
app.use('/status', statusRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server

const MY_PORT = process.env.PORT || 5000;

app.listen(MY_PORT, () => {
  console.log(`Server running on port ${MY_PORT}`);
});

module.exports = app; 