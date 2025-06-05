const ingestionStore = require('../models/ingestionStore');

const statusController = {
  async getStatus(req, res) {
    try {
      const { id } = req.params;
      const ingestion = ingestionStore.getIngestion(id);

      if (!ingestion) {
        return res.status(404).json({ error: 'Ingestion not found' });
      }

      res.json({
        ingestion_id: ingestion.ingestion_id,
        status: ingestion.status,
        batches: ingestion.batches
      });
    } catch (error) {
      console.error('Error in getStatus:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = statusController; 