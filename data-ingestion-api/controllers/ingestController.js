const { v4: uuidv4 } = require('uuid');
const ingestionStore = require('../models/ingestionStore');
const priorityQueue = require('../utils/priorityQueue');

const createBatches = (ids, batchSize = 3) => {
  const batches = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    batches.push({
      batch_id: uuidv4(),
      ids: ids.slice(i, i + batchSize),
      status: 'yet_to_start'
    });
  }
  return batches;
};

const ingestController = {
  async createIngestion(req, res) {
    try {
      const { ids, priority } = req.body;

      // Validate input
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids must be a non-empty array' });
      }
      if (!['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
        return res.status(400).json({ error: 'priority must be HIGH, MEDIUM, or LOW' });
      }

      // Generate ingestion ID and create batches
      const ingestionId = uuidv4();
      const batches = createBatches(ids);

      // Store ingestion data
      ingestionStore.createIngestion(ingestionId, batches, priority);

      // Add batches to priority queue
      batches.forEach(batch => {
        priorityQueue.enqueue({
          ingestion_id: ingestionId,
          batch_id: batch.batch_id,
          priority,
          createdAt: new Date()
        });
      });

      res.status(201).json({
        ingestion_id: ingestionId,
        status: 'yet_to_start',
        batches
      });
    } catch (error) {
      console.error('Error in createIngestion:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = ingestController; 