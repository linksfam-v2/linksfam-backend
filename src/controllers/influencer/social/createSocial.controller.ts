import { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { NodeHttpClient } from '@shlinkio/shlink-js-sdk/node';
import { Request, Response } from 'express';

const serverInfo = { baseUrl: 'https://s.linksfam.com', apiKey: '0b9e77fc-9265-4c5b-b037-c55e046a27b0' };

const createSocialController = (req: Request, res: Response): void => {
  const apiClient = new ShlinkApiClient(new NodeHttpClient(), serverInfo);
  
  res.success({ status: 'OK', message: apiClient });
};

export default createSocialController;
