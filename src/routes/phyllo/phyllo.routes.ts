import express from 'express';
import createUserController from '../../controllers/phyllo/createUser.controller.js';
import getAllAccountsController from '../../controllers/phyllo/getAllAccounts.controller.js';
import disconnectController from '../../controllers/phyllo/disconnect.controller.js';

const phylloRouter = express.Router();

phylloRouter.post('/create-user',  createUserController);

phylloRouter.get('/accounts', getAllAccountsController);

phylloRouter.post('/disconnect', disconnectController);

export default phylloRouter;