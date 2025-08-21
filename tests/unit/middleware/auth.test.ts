import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken, requireRole } from '../../../src/middleware/auth.js';
import { prisma, createTestUser, generateTestToken } from '../../setup.js';

// Mock Express objects
const mockRequest = (overrides = {}) => ({
  headers: {},
  user: null,
  ...overrides
} as Partial<Request>);

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn() as NextFunction;

describe('Authentication Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user.id, user.role);
      
      const req = mockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = mockResponse();

      await authenticateToken(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toEqual(
        expect.objectContaining({
          userId: user.id,
          role: user.role
        })
      );
    });

    it('should reject request without token', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await authenticateToken(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access token required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      const req = mockRequest({
        headers: { authorization: 'Bearer invalid-token' }
      });
      const res = mockResponse();

      await authenticateToken(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject expired token', async () => {
      const user = await createTestUser();
      const expiredToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '-1h' }
      );
      
      const req = mockRequest({
        headers: { authorization: `Bearer ${expiredToken}` }
      });
      const res = mockResponse();

      await authenticateToken(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', async () => {
      const req = mockRequest({
        headers: { authorization: 'InvalidFormat' }
      });
      const res = mockResponse();

      await authenticateToken(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access token required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should allow access for correct role', async () => {
      const user = await createTestUser({ role: 'BRAND_MANAGER' });
      const req = mockRequest({
        user: { userId: user.id, role: 'BRAND_MANAGER' }
      });
      const res = mockResponse();

      const middleware = requireRole(['BRAND_MANAGER']);
      middleware(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow access for multiple allowed roles', async () => {
      const user = await createTestUser({ role: 'CREATOR' });
      const req = mockRequest({
        user: { userId: user.id, role: 'CREATOR' }
      });
      const res = mockResponse();

      const middleware = requireRole(['BRAND_MANAGER', 'CREATOR']);
      middleware(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access for incorrect role', async () => {
      const user = await createTestUser({ role: 'CREATOR' });
      const req = mockRequest({
        user: { userId: user.id, role: 'CREATOR' }
      });
      const res = mockResponse();

      const middleware = requireRole(['BRAND_MANAGER']);
      middleware(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when user is not authenticated', async () => {
      const req = mockRequest(); // No user object
      const res = mockResponse();

      const middleware = requireRole(['BRAND_MANAGER']);
      middleware(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow admin access to all roles', async () => {
      const user = await createTestUser({ role: 'ADMIN' });
      const req = mockRequest({
        user: { userId: user.id, role: 'ADMIN' }
      });
      const res = mockResponse();

      const middleware = requireRole(['BRAND_MANAGER']);
      middleware(req as Request, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error('Database error'));
      
      const user = await createTestUser();
      const token = generateTestToken(user.id, user.role);
      
      const req = mockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = mockResponse();

      await authenticateToken(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle user not found', async () => {
      const token = generateTestToken('non-existent-user-id', 'BRAND_MANAGER');
      
      const req = mockRequest({
        headers: { authorization: `Bearer ${token}` }
      });
      const res = mockResponse();

      await authenticateToken(req as Request, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
