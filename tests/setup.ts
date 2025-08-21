import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';

// Global test database instance
let prisma: PrismaClient;
let testDatabaseUrl: string;

// Setup test database before all tests
beforeAll(async () => {
  // Generate unique test database name
  const testDbName = `test_linksfam_${randomBytes(8).toString('hex')}`;
  testDatabaseUrl = `postgresql://postgres:password@localhost:5432/${testDbName}`;
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = testDatabaseUrl;
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.REDIS_URL = 'redis://localhost:6379/1';
  
  try {
    // Create test database
    execSync(`createdb ${testDbName}`, { stdio: 'ignore' });
    
    // Initialize Prisma client
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: testDatabaseUrl
        }
      }
    });
    
    // Run migrations
    execSync('npx prisma migrate deploy', { 
      env: { ...process.env, DATABASE_URL: testDatabaseUrl },
      stdio: 'ignore'
    });
    
    // Connect to database
    await prisma.$connect();
    
    console.log(`✅ Test database ${testDbName} created and connected`);
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    if (prisma) {
      await prisma.$disconnect();
    }
    
    // Extract database name from URL
    const dbName = testDatabaseUrl.split('/').pop();
    if (dbName) {
      execSync(`dropdb ${dbName}`, { stdio: 'ignore' });
      console.log(`✅ Test database ${dbName} cleaned up`);
    }
  } catch (error) {
    console.error('❌ Failed to cleanup test database:', error);
  }
});

// Clean database between tests
beforeEach(async () => {
  if (prisma) {
    // Clean all tables in reverse dependency order
    await prisma.campaignCreator.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.contentAnalysis.deleteMany();
    await prisma.brandAnalysis.deleteMany();
    await prisma.creatorProfile.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.user.deleteMany();
  }
});

// Export test utilities
export { prisma };

// Test data factories
export const createTestUser = async (overrides = {}) => {
  return await prisma.user.create({
    data: {
      phone: '+1234567890',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'BRAND_MANAGER',
      isVerified: true,
      ...overrides
    }
  });
};

export const createTestBrand = async (userId: string, overrides = {}) => {
  return await prisma.brand.create({
    data: {
      name: 'Test Brand',
      description: 'A test brand for testing purposes',
      website: 'https://testbrand.com',
      industry: 'Technology',
      targetAudience: 'Tech enthusiasts',
      userId,
      ...overrides
    }
  });
};

export const createTestCreator = async (userId: string, overrides = {}) => {
  return await prisma.creatorProfile.create({
    data: {
      displayName: 'Test Creator',
      bio: 'A test creator for testing purposes',
      followerCount: 10000,
      engagementRate: 3.5,
      categories: ['Technology', 'Lifestyle'],
      userId,
      ...overrides
    }
  });
};

// Mock AutoGen agents for testing
export const mockBrandAnalyzerAgent = {
  analyzeBrand: jest.fn().mockResolvedValue({
    success: true,
    data: {
      brandPersonality: { innovative: 0.8, trustworthy: 0.9 },
      targetAudience: { age: '25-35', interests: ['tech', 'innovation'] },
      contentStrategy: { tone: 'professional', style: 'informative' },
      recommendations: ['Focus on innovation messaging', 'Highlight trustworthiness']
    }
  }),
  getAnalysisResults: jest.fn(),
  getAnalysisStatus: jest.fn()
};

export const mockContentAnalyzerAgent = {
  analyzeCreatorContent: jest.fn().mockResolvedValue({
    success: true,
    data: {
      contentThemes: ['technology', 'lifestyle'],
      engagementPatterns: { avgLikes: 1000, avgComments: 50 },
      audienceInsights: { demographics: { age: '18-34' } },
      contentQuality: { score: 8.5 },
      recommendations: ['Post more tech content', 'Engage with audience more']
    }
  }),
  getAnalysisResults: jest.fn(),
  getAnalysisStatus: jest.fn()
};

export const mockCreatorDiscoveryAgent = {
  discoverCreators: jest.fn().mockResolvedValue({
    success: true,
    data: {
      creators: [
        { id: '1', matchScore: 0.9, reasons: ['High engagement', 'Relevant audience'] }
      ],
      totalCount: 1
    }
  })
};

export const mockMultiAgentPipeline = {
  executePipeline: jest.fn().mockResolvedValue({
    success: true,
    data: {
      pipelineId: 'test-pipeline-123',
      status: 'completed',
      results: {
        brandAnalysis: {},
        discoveredCreators: [],
        contentAnalyses: [],
        outreachRecommendations: []
      }
    }
  }),
  getPipelineStatus: jest.fn(),
  getPipelineResults: jest.fn()
};

// JWT token utilities for testing
export const generateTestToken = (userId: string, role: string = 'BRAND_MANAGER') => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// API testing utilities
export const createAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

console.log('🧪 Test setup initialized');
