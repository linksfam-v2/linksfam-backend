import request from 'supertest';
import express from 'express';
import { 
  createTestUser, 
  createTestBrand, 
  generateTestToken, 
  createAuthHeaders,
  mockBrandAnalyzerAgent,
  prisma 
} from '../../setup.js';

// Mock the AutoGen agents
jest.mock('../../../src/agents/BrandAnalyzerAgent.js', () => ({
  BrandAnalyzerAgent: jest.fn().mockImplementation(() => mockBrandAnalyzerAgent)
}));

// Import controller after mocking
import { brandController } from '../../../src/controllers/brandController.js';
import { authenticateToken } from '../../../src/middleware/auth.js';

const app = express();
app.use(express.json());
app.use(authenticateToken);

// Setup routes
app.post('/brands', brandController.createBrand);
app.get('/brands/:id', brandController.getBrandById);
app.put('/brands/:id', brandController.updateBrand);
app.delete('/brands/:id', brandController.deleteBrand);
app.post('/brands/:id/analyze', brandController.analyzeBrand);
app.get('/brands/:id/analyze/status', brandController.getBrandAnalysisStatus);
app.get('/brands/:id/analyze/results', brandController.getBrandAnalysisResults);

describe('Brand Controller', () => {
  let testUser: any;
  let testBrand: any;
  let authToken: string;
  let authHeaders: any;

  beforeEach(async () => {
    testUser = await createTestUser({ role: 'BRAND_MANAGER' });
    testBrand = await createTestBrand(testUser.id);
    authToken = generateTestToken(testUser.id, testUser.role);
    authHeaders = createAuthHeaders(authToken);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('POST /brands', () => {
    it('should create a new brand successfully', async () => {
      const brandData = {
        name: 'New Test Brand',
        description: 'A new brand for testing',
        website: 'https://newtestbrand.com',
        industry: 'Fashion',
        targetAudience: 'Young adults'
      };

      const response = await request(app)
        .post('/brands')
        .set(authHeaders)
        .send(brandData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(brandData.name);
      expect(response.body.data.userId).toBe(testUser.id);

      // Verify brand was created in database
      const createdBrand = await prisma.brand.findUnique({
        where: { id: response.body.data.id }
      });
      expect(createdBrand).toBeTruthy();
      expect(createdBrand?.name).toBe(brandData.name);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/brands')
        .set(authHeaders)
        .send({}) // Empty data
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should prevent duplicate brand names for same user', async () => {
      const brandData = {
        name: testBrand.name, // Same name as existing brand
        description: 'Duplicate brand',
        industry: 'Technology'
      };

      const response = await request(app)
        .post('/brands')
        .set(authHeaders)
        .send(brandData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('GET /brands/:id', () => {
    it('should get brand by ID successfully', async () => {
      const response = await request(app)
        .get(`/brands/${testBrand.id}`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testBrand.id);
      expect(response.body.data.name).toBe(testBrand.name);
    });

    it('should return 404 for non-existent brand', async () => {
      const response = await request(app)
        .get('/brands/non-existent-id')
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should prevent access to other users brands', async () => {
      const otherUser = await createTestUser({ 
        phone: '+9876543210',
        email: 'other@example.com' 
      });
      const otherBrand = await createTestBrand(otherUser.id, { name: 'Other Brand' });

      const response = await request(app)
        .get(`/brands/${otherBrand.id}`)
        .set(authHeaders)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('access');
    });
  });

  describe('PUT /brands/:id', () => {
    it('should update brand successfully', async () => {
      const updateData = {
        name: 'Updated Brand Name',
        description: 'Updated description',
        industry: 'Updated Industry'
      };

      const response = await request(app)
        .put(`/brands/${testBrand.id}`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);

      // Verify update in database
      const updatedBrand = await prisma.brand.findUnique({
        where: { id: testBrand.id }
      });
      expect(updatedBrand?.name).toBe(updateData.name);
    });

    it('should prevent updating other users brands', async () => {
      const otherUser = await createTestUser({ 
        phone: '+9876543210',
        email: 'other@example.com' 
      });
      const otherBrand = await createTestBrand(otherUser.id, { name: 'Other Brand' });

      const response = await request(app)
        .put(`/brands/${otherBrand.id}`)
        .set(authHeaders)
        .send({ name: 'Hacked Brand' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /brands/:id/analyze', () => {
    it('should analyze brand successfully', async () => {
      const response = await request(app)
        .post(`/brands/${testBrand.id}/analyze`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('analysis completed');
      expect(mockBrandAnalyzerAgent.analyzeBrand).toHaveBeenCalledWith(testBrand.id);

      // Verify analysis was stored in database
      const analysis = await prisma.brandAnalysis.findFirst({
        where: { brandId: testBrand.id }
      });
      expect(analysis).toBeTruthy();
      expect(analysis?.status).toBe('COMPLETED');
    });

    it('should handle force refresh parameter', async () => {
      const response = await request(app)
        .post(`/brands/${testBrand.id}/analyze?force_refresh=true`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockBrandAnalyzerAgent.analyzeBrand).toHaveBeenCalledWith(testBrand.id);
    });

    it('should return cached results when available', async () => {
      // Create existing analysis
      await prisma.brandAnalysis.create({
        data: {
          brandId: testBrand.id,
          status: 'COMPLETED',
          results: {
            brandPersonality: { innovative: 0.8 },
            recommendations: ['Test recommendation']
          },
          executedAt: new Date(),
          completedAt: new Date()
        }
      });

      mockBrandAnalyzerAgent.getAnalysisResults.mockResolvedValue({
        success: true,
        cached: true,
        data: { brandPersonality: { innovative: 0.8 } }
      });

      const response = await request(app)
        .post(`/brands/${testBrand.id}/analyze`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cached).toBe(true);
      expect(mockBrandAnalyzerAgent.getAnalysisResults).toHaveBeenCalled();
    });

    it('should handle agent errors gracefully', async () => {
      mockBrandAnalyzerAgent.analyzeBrand.mockRejectedValue(
        new Error('AutoGen agent error')
      );

      const response = await request(app)
        .post(`/brands/${testBrand.id}/analyze`)
        .set(authHeaders)
        .expect(503);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('temporarily unavailable');
    });

    it('should prevent analyzing other users brands', async () => {
      const otherUser = await createTestUser({ 
        phone: '+9876543210',
        email: 'other@example.com' 
      });
      const otherBrand = await createTestBrand(otherUser.id, { name: 'Other Brand' });

      const response = await request(app)
        .post(`/brands/${otherBrand.id}/analyze`)
        .set(authHeaders)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /brands/:id/analyze/status', () => {
    it('should get analysis status successfully', async () => {
      // Create analysis record
      const analysis = await prisma.brandAnalysis.create({
        data: {
          brandId: testBrand.id,
          status: 'RUNNING',
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/brands/${testBrand.id}/analyze/status`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('RUNNING');
      expect(response.body.data.id).toBe(analysis.id);
    });

    it('should return 404 when no analysis exists', async () => {
      const response = await request(app)
        .get(`/brands/${testBrand.id}/analyze/status`)
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No analysis found');
    });
  });

  describe('GET /brands/:id/analyze/results', () => {
    it('should get analysis results successfully', async () => {
      const analysisResults = {
        brandPersonality: { innovative: 0.8, trustworthy: 0.9 },
        recommendations: ['Focus on innovation', 'Highlight trust']
      };

      // Create completed analysis
      await prisma.brandAnalysis.create({
        data: {
          brandId: testBrand.id,
          status: 'COMPLETED',
          results: analysisResults,
          executedAt: new Date(),
          completedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/brands/${testBrand.id}/analyze/results`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.results).toEqual(analysisResults);
    });

    it('should return 404 for incomplete analysis', async () => {
      // Create running analysis
      await prisma.brandAnalysis.create({
        data: {
          brandId: testBrand.id,
          status: 'RUNNING',
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/brands/${testBrand.id}/analyze/results`)
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not completed');
    });
  });

  describe('Authorization', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/brands/${testBrand.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require BRAND_MANAGER role', async () => {
      const creatorUser = await createTestUser({ 
        role: 'CREATOR',
        phone: '+1111111111',
        email: 'creator@example.com'
      });
      const creatorToken = generateTestToken(creatorUser.id, 'CREATOR');
      const creatorHeaders = createAuthHeaders(creatorToken);

      const response = await request(app)
        .post('/brands')
        .set(creatorHeaders)
        .send({
          name: 'Creator Brand',
          description: 'Should not be allowed'
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
