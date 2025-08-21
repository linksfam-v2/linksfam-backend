import request from 'supertest';
import express from 'express';
import { 
  createTestUser, 
  createTestCreator, 
  generateTestToken, 
  createAuthHeaders,
  mockContentAnalyzerAgent,
  prisma 
} from '../../setup.js';

// Mock the AutoGen agents
jest.mock('../../../src/agents/ContentAnalyzerAgent.js', () => ({
  ContentAnalyzerAgent: jest.fn().mockImplementation(() => mockContentAnalyzerAgent)
}));

// Import controller after mocking
import { creatorController } from '../../../src/controllers/creatorController.js';
import { authenticateToken } from '../../../src/middleware/auth.js';

const app = express();
app.use(express.json());
app.use(authenticateToken);

// Setup routes
app.post('/creators', creatorController.createCreator);
app.get('/creators/:id', creatorController.getCreatorById);
app.put('/creators/:id', creatorController.updateCreator);
app.post('/creators/:id/analyze', creatorController.analyzeContent);
app.get('/creators/:id/analyze/status', creatorController.getContentAnalysisStatus);
app.get('/creators/:id/analyze/results', creatorController.getContentAnalysisResults);
app.post('/creators/batch/analyze', creatorController.batchAnalyzeContent);

describe('Creator Controller', () => {
  let testUser: any;
  let testCreator: any;
  let authToken: string;
  let authHeaders: any;

  beforeEach(async () => {
    testUser = await createTestUser({ role: 'CREATOR' });
    testCreator = await createTestCreator(testUser.id);
    authToken = generateTestToken(testUser.id, testUser.role);
    authHeaders = createAuthHeaders(authToken);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('POST /creators', () => {
    it('should create a new creator profile successfully', async () => {
      const creatorData = {
        displayName: 'New Test Creator',
        bio: 'A new creator for testing',
        followerCount: 5000,
        engagementRate: 4.2,
        categories: ['Technology', 'Gaming']
      };

      const response = await request(app)
        .post('/creators')
        .set(authHeaders)
        .send(creatorData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.displayName).toBe(creatorData.displayName);
      expect(response.body.data.userId).toBe(testUser.id);

      // Verify creator was created in database
      const createdCreator = await prisma.creatorProfile.findUnique({
        where: { id: response.body.data.id }
      });
      expect(createdCreator).toBeTruthy();
      expect(createdCreator?.displayName).toBe(creatorData.displayName);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/creators')
        .set(authHeaders)
        .send({}) // Empty data
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should prevent duplicate creator profiles for same user', async () => {
      const response = await request(app)
        .post('/creators')
        .set(authHeaders)
        .send({
          displayName: 'Duplicate Creator',
          bio: 'Should fail'
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('GET /creators/:id', () => {
    it('should get creator by ID successfully', async () => {
      const response = await request(app)
        .get(`/creators/${testCreator.id}`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testCreator.id);
      expect(response.body.data.displayName).toBe(testCreator.displayName);
    });

    it('should return 404 for non-existent creator', async () => {
      const response = await request(app)
        .get('/creators/non-existent-id')
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should allow brand managers to view creator profiles', async () => {
      const brandUser = await createTestUser({ 
        role: 'BRAND_MANAGER',
        phone: '+9876543210',
        email: 'brand@example.com' 
      });
      const brandToken = generateTestToken(brandUser.id, 'BRAND_MANAGER');
      const brandHeaders = createAuthHeaders(brandToken);

      const response = await request(app)
        .get(`/creators/${testCreator.id}`)
        .set(brandHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testCreator.id);
    });
  });

  describe('PUT /creators/:id', () => {
    it('should update creator profile successfully', async () => {
      const updateData = {
        displayName: 'Updated Creator Name',
        bio: 'Updated bio',
        followerCount: 15000,
        engagementRate: 5.5
      };

      const response = await request(app)
        .put(`/creators/${testCreator.id}`)
        .set(authHeaders)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.displayName).toBe(updateData.displayName);
      expect(response.body.data.followerCount).toBe(updateData.followerCount);

      // Verify update in database
      const updatedCreator = await prisma.creatorProfile.findUnique({
        where: { id: testCreator.id }
      });
      expect(updatedCreator?.displayName).toBe(updateData.displayName);
    });

    it('should prevent updating other users creator profiles', async () => {
      const otherUser = await createTestUser({ 
        phone: '+9876543210',
        email: 'other@example.com',
        role: 'CREATOR'
      });
      const otherCreator = await createTestCreator(otherUser.id, { 
        displayName: 'Other Creator' 
      });

      const response = await request(app)
        .put(`/creators/${otherCreator.id}`)
        .set(authHeaders)
        .send({ displayName: 'Hacked Creator' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /creators/:id/analyze', () => {
    it('should analyze creator content successfully', async () => {
      const response = await request(app)
        .post(`/creators/${testCreator.id}/analyze`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('analysis completed');
      expect(mockContentAnalyzerAgent.analyzeCreatorContent).toHaveBeenCalledWith(testCreator.id);

      // Verify analysis was stored in database
      const analysis = await prisma.contentAnalysis.findFirst({
        where: { creatorId: testCreator.id }
      });
      expect(analysis).toBeTruthy();
      expect(analysis?.status).toBe('COMPLETED');
    });

    it('should handle force refresh parameter', async () => {
      const response = await request(app)
        .post(`/creators/${testCreator.id}/analyze?force_refresh=true`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockContentAnalyzerAgent.analyzeCreatorContent).toHaveBeenCalledWith(testCreator.id);
    });

    it('should return cached results when available', async () => {
      // Create existing analysis
      await prisma.contentAnalysis.create({
        data: {
          creatorId: testCreator.id,
          status: 'COMPLETED',
          results: {
            contentThemes: ['technology'],
            engagementPatterns: { avgLikes: 1000 },
            recommendations: ['Post more tech content']
          },
          executedAt: new Date(),
          completedAt: new Date()
        }
      });

      mockContentAnalyzerAgent.getAnalysisResults.mockResolvedValue({
        success: true,
        cached: true,
        data: { contentThemes: ['technology'] }
      });

      const response = await request(app)
        .post(`/creators/${testCreator.id}/analyze`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cached).toBe(true);
      expect(mockContentAnalyzerAgent.getAnalysisResults).toHaveBeenCalled();
    });

    it('should handle agent errors gracefully', async () => {
      mockContentAnalyzerAgent.analyzeCreatorContent.mockRejectedValue(
        new Error('AutoGen agent error')
      );

      const response = await request(app)
        .post(`/creators/${testCreator.id}/analyze`)
        .set(authHeaders)
        .expect(503);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('temporarily unavailable');
    });

    it('should allow brand managers to analyze creator content', async () => {
      const brandUser = await createTestUser({ 
        role: 'BRAND_MANAGER',
        phone: '+9876543210',
        email: 'brand@example.com' 
      });
      const brandToken = generateTestToken(brandUser.id, 'BRAND_MANAGER');
      const brandHeaders = createAuthHeaders(brandToken);

      const response = await request(app)
        .post(`/creators/${testCreator.id}/analyze`)
        .set(brandHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(mockContentAnalyzerAgent.analyzeCreatorContent).toHaveBeenCalled();
    });
  });

  describe('POST /creators/batch/analyze', () => {
    let testCreator2: any;

    beforeEach(async () => {
      const user2 = await createTestUser({ 
        role: 'CREATOR',
        phone: '+1111111111',
        email: 'creator2@example.com'
      });
      testCreator2 = await createTestCreator(user2.id, { 
        displayName: 'Test Creator 2' 
      });
    });

    it('should batch analyze multiple creators successfully', async () => {
      const creatorIds = [testCreator.id, testCreator2.id];

      const response = await request(app)
        .post('/creators/batch/analyze')
        .set(authHeaders)
        .send({ creator_ids: creatorIds })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(mockContentAnalyzerAgent.analyzeCreatorContent).toHaveBeenCalledTimes(2);

      // Verify analyses were stored in database
      const analyses = await prisma.contentAnalysis.findMany({
        where: { creatorId: { in: creatorIds } }
      });
      expect(analyses).toHaveLength(2);
    });

    it('should validate creator_ids parameter', async () => {
      const response = await request(app)
        .post('/creators/batch/analyze')
        .set(authHeaders)
        .send({}) // Missing creator_ids
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('creator_ids');
    });

    it('should handle partial failures in batch analysis', async () => {
      mockContentAnalyzerAgent.analyzeCreatorContent
        .mockResolvedValueOnce({ success: true, data: {} })
        .mockRejectedValueOnce(new Error('Analysis failed'));

      const creatorIds = [testCreator.id, testCreator2.id];

      const response = await request(app)
        .post('/creators/batch/analyze')
        .set(authHeaders)
        .send({ creator_ids: creatorIds })
        .expect(207); // Partial success

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].success).toBe(true);
      expect(response.body.data[1].success).toBe(false);
    });
  });

  describe('GET /creators/:id/analyze/status', () => {
    it('should get content analysis status successfully', async () => {
      // Create analysis record
      const analysis = await prisma.contentAnalysis.create({
        data: {
          creatorId: testCreator.id,
          status: 'RUNNING',
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/creators/${testCreator.id}/analyze/status`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('RUNNING');
      expect(response.body.data.id).toBe(analysis.id);
    });

    it('should return 404 when no analysis exists', async () => {
      const response = await request(app)
        .get(`/creators/${testCreator.id}/analyze/status`)
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No analysis found');
    });
  });

  describe('GET /creators/:id/analyze/results', () => {
    it('should get content analysis results successfully', async () => {
      const analysisResults = {
        contentThemes: ['technology', 'gaming'],
        engagementPatterns: { avgLikes: 1500, avgComments: 75 },
        audienceInsights: { demographics: { age: '18-34' } },
        recommendations: ['Post more gaming content', 'Engage with tech community']
      };

      // Create completed analysis
      await prisma.contentAnalysis.create({
        data: {
          creatorId: testCreator.id,
          status: 'COMPLETED',
          results: analysisResults,
          executedAt: new Date(),
          completedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/creators/${testCreator.id}/analyze/results`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.results).toEqual(analysisResults);
    });

    it('should return 404 for incomplete analysis', async () => {
      // Create running analysis
      await prisma.contentAnalysis.create({
        data: {
          creatorId: testCreator.id,
          status: 'RUNNING',
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/creators/${testCreator.id}/analyze/results`)
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not completed');
    });
  });

  describe('Authorization', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/creators/${testCreator.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should allow both CREATOR and BRAND_MANAGER roles', async () => {
      const brandUser = await createTestUser({ 
        role: 'BRAND_MANAGER',
        phone: '+9876543210',
        email: 'brand@example.com' 
      });
      const brandToken = generateTestToken(brandUser.id, 'BRAND_MANAGER');
      const brandHeaders = createAuthHeaders(brandToken);

      const response = await request(app)
        .get(`/creators/${testCreator.id}`)
        .set(brandHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
