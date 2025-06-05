const request = require('supertest');
const app = require('../app');

describe('Data Ingestion API', () => {
  let ingestionId;

  test('POST /ingest - should create new ingestion', async () => {
    const response = await request(app)
      .post('/ingest')
      .send({
        ids: [1, 2, 3, 4, 5],
        priority: 'HIGH'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('ingestion_id');
    expect(response.body).toHaveProperty('status', 'yet_to_start');
    expect(response.body.batches).toHaveLength(2); // 5 IDs split into batches of 3

    ingestionId = response.body.ingestion_id;
  });

  test('POST /ingest - should validate input', async () => {
    const response = await request(app)
      .post('/ingest')
      .send({
        ids: [],
        priority: 'HIGH'
      });

    expect(response.status).toBe(400);
  });

  test('GET /status/:id - should return ingestion status', async () => {
    const response = await request(app)
      .get(`/status/${ingestionId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('ingestion_id', ingestionId);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('batches');
  });

  test('GET /status/:id - should return 404 for non-existent ingestion', async () => {
    const response = await request(app)
      .get('/status/non-existent-id');

    expect(response.status).toBe(404);
  });
}); 