// eslint-disable-next-line no-unused-vars
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';
import { authMiddleware, tokenAuthMiddleware } from '../middleware/auth';
import { APIError, errorResponse } from '../middleware/error';

/**
 * Inject routes
 */
const injectRoutes = (api) => {
    api.get('/status', AppController.getStatus);
    api.get('/stats', AppController.getStats);

    api.get('/connect', authMiddleware, AuthController.getConnect);
    api.get('/disconnect', tokenAuthMiddleware, AuthController.getDisconnect);

    api.post('/users', UsersController.postNew);
    api.get('/users/me', tokenAuthMiddleware, UsersController.getMe);

    api.post('/files', tokenAuthMiddleware, FilesController.postUpload);
    api.get('/files/:id', tokenAuthMiddleware, FilesController.getShow);
    api.get('/files', tokenAuthMiddleware, FilesController.getIndex);
    api.put('/files/:id/publish', tokenAuthMiddleware, FilesController.putPublish);
    api.put('/files/:id/unpublish', tokenAuthMiddleware, FilesController.putUnpublish);
    api.get('/files/:id/data', FilesController.getFile);

    api.all('*', (req, res, next) => {
        errorResponse(new APIError(404, `Cannot ${req.method} ${req.url}`), req, res, next);
    });
    api.use(errorResponse);
};

export default injectRoutes;