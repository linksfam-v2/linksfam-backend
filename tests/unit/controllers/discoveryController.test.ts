import request from 'supertest';
import express from 'express';
import { 
  createTestUser, 
  createTestBrand, 
  createTestCreator,
  generateTestToken, 
  createAuthHeaders,
  mockCreatorDiscoveryAgent,
  mockMultiAgentPipeline,
  prisma 
} from '../../setup.js';

// Mock the AutoGen agents
jest.mock('../../../src/agents/CreatorDiscoveryAgent.js', () => ({
  CreatorDiscoveryAgent: jest.fn().mockImplementation(() => mockCreatorDiscoveryAgent)
}));

jest.mock('../../../src/agents/MultiAgentPipeline.js', () => ({
  MultiAgentPipeline: jest.fn().mockImplementation(() => mockMultiAgentPipeline)
}));

// Import controller after mocking
import { discoveryController } from '../../../src/controllers/discoveryController.js';
import { authenticateToken } from '../../../src/middleware/auth.js';

const app = express();
app.use(express.json());
app.use(authenticateToken);

// Setup routes
app.post('/discovery/creators', discoveryController.discoverCreators);
app.get('/discovery/creators/:id/status', discoveryController.getDiscoveryStatus);
app.get('/discovery/creators/:id/results', discoveryController.getDiscoveryResults);
app.post('/discovery/pipeline/execute', discoveryController.executeMultiAgentPipeline);
app.get('/discovery/pipeline/:id/status', discoveryController.getPipelineStatus);
app.get('/discovery/pipeline/:id/results', discoveryController.getPipelineResults);

describe('Discovery Controller', () => {
  let testUser: any;
  let testBrand: any;
  let testCreator: any;
  let authToken: string;
  let authHeaders: any;

  beforeEach(async () => {
    testUser = await createTestUser({ role: 'BRAND_MANAGER' });
    testBrand = await createTestBrand(testUser.id);
    
    const creatorUser = await createTestUser({ 
      role: 'CREATOR',
      phone: '+1111111111',
      email: 'creator@example.com'
    });
    testCreator = await createTestCreator(creatorUser.id);
    
    authToken = generateTestToken(testUser.id, testUser.role);
    authHeaders = createAuthHeaders(authToken);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('POST /discovery/creators', () => {
    it('should discover creators successfully', async () => {
      const discoveryParams = {
        brandId: testBrand.id,
        query: 'tech influencers with high engagement',
        filters: {
          minFollowers: 10000,
          maxFollowers: 100000,
          categories: ['Technology'],
          platforms: ['Instagram', 'YouTube']
        }
      };

      const response = await request(app)
        .post('/discovery/creators')
        .set(authHeaders)
        .send(discoveryParams)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('discovery completed');
      expect(mockCreatorDiscoveryAgent.discoverCreators).toHaveBeenCalledWith(
        testBrand.id,
        discoveryParams.query,
        discoveryParams.filters
      );

      // Verify discovery was stored in database
      const discovery = await prisma.creatorDiscovery.findFirst({
        where: { brandId: testBrand.id }
      });
      expect(discovery).toBeTruthy();
      expect(discovery?.status).toBe('COMPLETED');
    });

    it('should validate required parameters', async () => {
      const response = await request(app)
        .post('/discovery/creators')
        .set(authHeaders)
        .send({}) // Missing required fields
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should handle agent errors gracefully', async () => {
      mockCreatorDiscoveryAgent.discoverCreators.mockRejectedValue(
        new Error('AutoGen agent error')
      );

      const discoveryParams = {
        brandId: testBrand.id,
        query: 'test query'
      };

      const response = await request(app)
        .post('/discovery/creators')
        .set(authHeaders)
        .send(discoveryParams)
        .expect(503);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('temporarily unavailable');
    });

    it('should prevent discovery for other users brands', async () => {
      const otherUser = await createTestUser({ 
        phone: '+9876543210',
        email: 'other@example.com',
        role: 'BRAND_MANAGER'
      });
      const otherBrand = await createTestBrand(otherUser.id, { name: 'Other Brand' });

      const discoveryParams = {
        brandId: otherBrand.id,
        query: 'test query'
      };

      const response = await request(app)
        .post('/discovery/creators')
        .set(authHeaders)
        .send(discoveryParams)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /discovery/creators/:id/status', () => {
    it('should get discovery status successfully', async () => {
      // Create discovery record
      const discovery = await prisma.creatorDiscovery.create({
        data: {
          brandId: testBrand.id,
          query: 'test query',
          status: 'RUNNING',
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/discovery/creators/${discovery.id}/status`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('RUNNING');
      expect(response.body.data.id).toBe(discovery.id);
    });

    it('should return 404 for non-existent discovery', async () => {
      const response = await request(app)
        .get('/discovery/creators/non-existent-id/status')
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should prevent access to other users discoveries', async () => {
      const otherUser = await createTestUser({ 
        phone: '+9876543210',
        email: 'other@example.com',
        role: 'BRAND_MANAGER'
      });
      const otherBrand = await createTestBrand(otherUser.id, { name: 'Other Brand' });
      
      const otherDiscovery = await prisma.creatorDiscovery.create({
        data: {
          brandId: otherBrand.id,
          query: 'other query',
          status: 'COMPLETED',
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/discovery/creators/${otherDiscovery.id}/status`)
        .set(authHeaders)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /discovery/creators/:id/results', () => {
    it('should get discovery results successfully', async () => {
      const discoveryResults = {
        creators: [
          {
            id: testCreator.id,
            matchScore: 0.85,
            reasons: ['High engagement', 'Relevant niche']
          }
        ],
        totalFound: 1,
        filters: { categories: ['Technology'] }
      };

      // Create completed discovery
      const discovery = await prisma.creatorDiscovery.create({
        data: {
          brandId: testBrand.id,
          query: 'test query',
          status: 'COMPLETED',
          results: discoveryResults,
          executedAt: new Date(),
          completedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/discovery/creators/${discovery.id}/results`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.results).toEqual(discoveryResults);
    });

    it('should return 404 for incomplete discovery', async () => {
      // Create running discovery
      const discovery = await prisma.creatorDiscovery.create({
        data: {
          brandId: testBrand.id,
          query: 'test query',
          status: 'RUNNING',
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/discovery/creators/${discovery.id}/results`)
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not completed');
    });
  });

  describe('POST /discovery/pipeline/execute', () => {
    it('should execute multi-agent pipeline successfully', async () => {
      const pipelineParams = {
        brandId: testBrand.id,
        creatorIds: [testCreator.id],
        analysisTypes: ['brand_analysis', 'content_analysis', 'creator_discovery']
      };

      const response = await request(app)
        .post('/discovery/pipeline/execute')
        .set(authHeaders)
        .send(pipelineParams)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('pipeline execution started');
      expect(mockMultiAgentPipeline.executePipeline).toHaveBeenCalledWith(
        testBrand.id,
        pipelineParams.creatorIds,
        pipelineParams.analysisTypes
      );

      // Verify pipeline execution was stored in database
      const execution = await prisma.pipelineExecution.findFirst({
        where: { brandId: testBrand.id }
      });
      expect(execution).toBeTruthy();
      expect(execution?.status).toBe('RUNNING');
    });

    it('should validate pipeline parameters', async () => {
      const response = await request(app)
        .post('/discovery/pipeline/execute')
        .set(authHeaders)
        .send({}) // Missing required fields
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should handle pipeline errors gracefully', async () => {
      mockMultiAgentPipeline.executePipeline.mockRejectedValue(
        new Error('Pipeline execution failed')
      );

      const pipelineParams = {
        brandId: testBrand.id,
        creatorIds: [testCreator.id],
        analysisTypes: ['brand_analysis']
      };

      const response = await request(app)
        .post('/discovery/pipeline/execute')
        .set(authHeaders)
        .send(pipelineParams)
        .expect(503);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('temporarily unavailable');
    });

    it('should validate creator IDs exist', async () => {
      const pipelineParams = {
        brandId: testBrand.id,
        creatorIds: ['non-existent-creator-id'],
        analysisTypes: ['brand_analysis']
      };

      const response = await request(app)
        .post('/discovery/pipeline/execute')
        .set(authHeaders)
        .send(pipelineParams)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid creator IDs');
    });
  });

  describe('GET /discovery/pipeline/:id/status', () => {
    it('should get pipeline status successfully', async () => {
      // Create pipeline execution record
      const execution = await prisma.pipelineExecution.create({
        data: {
          brandId: testBrand.id,
          creatorIds: [testCreator.id],
          analysisTypes: ['brand_analysis'],
          status: 'RUNNING',
          progress: 0.5,
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/discovery/pipeline/${execution.id}/status`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('RUNNING');
      expect(response.body.data.progress).toBe(0.5);
      expect(response.body.data.id).toBe(execution.id);
    });

    it('should return 404 for non-existent pipeline execution', async () => {
      const response = await request(app)
        .get('/discovery/pipeline/non-existent-id/status')
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('GET /discovery/pipeline/:id/results', () => {
    it('should get pipeline results successfully', async () => {
      const pipelineResults = {
        brandAnalysis: {
          brandPersonality: { innovative: 0.8 },
          recommendations: ['Focus on innovation']
        },
        contentAnalysis: {
          [testCreator.id]: {
            themes: ['technology'],
            engagement: { avgLikes: 1000 }
          }
        },
        creatorDiscovery: {
          matches: [
            { creatorId: testCreator.id, score: 0.9 }
          ]
        },
        summary: {
          totalCreatorsAnalyzed: 1,
          topMatches: 1,
          avgMatchScore: 0.9
        }
      };

      // Create completed pipeline execution
      const execution = await prisma.pipelineExecution.create({
        data: {
          brandId: testBrand.id,
          creatorIds: [testCreator.id],
          analysisTypes: ['brand_analysis', 'content_analysis', 'creator_discovery'],
          status: 'COMPLETED',
          progress: 1.0,
          results: pipelineResults,
          executedAt: new Date(),
          completedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/discovery/pipeline/${execution.id}/results`)
        .set(authHeaders)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.results).toEqual(pipelineResults);
    });

    it('should return 404 for incomplete pipeline execution', async () => {
      // Create running pipeline execution
      const execution = await prisma.pipelineExecution.create({
        data: {
          brandId: testBrand.id,
          creatorIds: [testCreator.id],
          analysisTypes: ['brand_analysis'],
          status: 'RUNNING',
          progress: 0.3,
          executedAt: new Date()
        }
      });

      const response = await request(app)
        .get(`/discovery/pipeline/${execution.id}/results`)
        .set(authHeaders)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not completed');
    });
  });

  describe('Authorization', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/discovery/creators')
        .send({ brandId: testBrand.id, query: 'test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require BRAND_MANAGER role for discovery operations', async () => {
      const creatorUser = await createTestUser({ 
        role: 'CREATOR',
        phone: '+1111111111',
        email: 'creator@example.com'
      });
      const creatorToken = generateTestToken(creatorUser.id, 'CREATOR');
      const creatorHeaders = createAuthHeaders(creatorToken);

      const response = await request(app)
        .post('/discovery/creators')
        .set(creatorHeaders)
        .send({ brandId: testBrand.id, query: 'test' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should allow admin access to all operations', async () => {
      const adminUser = await createTestUser({ 
        role: 'ADMIN',
        phone: '+2222222222',
        email: 'admin@example.com'
      });
      const adminToken = generateTestToken(adminUser.id, 'ADMIN');
      const adminHeaders = createAuthHeaders(adminToken);

      const response = await request(app)
        .post('/discovery/creators')
        .set(adminHeaders)
        .send({ brandId: testBrand.id, query: 'test' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
