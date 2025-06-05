const priorityQueue = require('../utils/priorityQueue');
const ingestionStore = require('../models/ingestionStore');

class BatchProcessor {
  constructor() {
    this.isProcessing = false;
    this.start();
  }

  start() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    setInterval(() => {
      this.processNextBatch();
    }, 5000); // Process one batch every 5 seconds
  }

  async processNextBatch() {
    if (priorityQueue.isEmpty()) return;

    const batch = priorityQueue.dequeue();
    if (!batch) return;

    // Update batch status to triggered
    ingestionStore.updateBatchStatus(batch.ingestion_id, batch.batch_id, 'triggered');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update batch status to completed
    ingestionStore.updateBatchStatus(batch.ingestion_id, batch.batch_id, 'completed');
  }
}

// Start the processor
new BatchProcessor();

module.exports = BatchProcessor; 