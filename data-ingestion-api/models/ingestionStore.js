class IngestionStore {
  constructor() {
    this.ingestions = new Map();
  }

  createIngestion(ingestionId, batches, priority) {
    this.ingestions.set(ingestionId, {
      ingestion_id: ingestionId,
      status: 'yet_to_start',
      priority,
      batches,
      createdAt: new Date()
    });
  }

  getIngestion(ingestionId) {
    return this.ingestions.get(ingestionId);
  }

  updateBatchStatus(ingestionId, batchId, status) {
    const ingestion = this.ingestions.get(ingestionId);
    if (!ingestion) return null;

    const batch = ingestion.batches.find(b => b.batch_id === batchId);
    if (batch) {
      batch.status = status;
      this.updateIngestionStatus(ingestion);
    }
    return ingestion;
  }

  updateIngestionStatus(ingestion) {
    const batchStatuses = ingestion.batches.map(b => b.status);
    
    if (batchStatuses.every(status => status === 'completed')) {
      ingestion.status = 'completed';
    } else if (batchStatuses.some(status => status === 'triggered')) {
      ingestion.status = 'triggered';
    } else if (batchStatuses.every(status => status === 'yet_to_start')) {
      ingestion.status = 'yet_to_start';
    }
  }
}

module.exports = new IngestionStore(); 