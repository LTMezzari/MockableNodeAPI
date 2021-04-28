import Configuration from '../configurator/Configuration';
import IRoute from '../model/IRoute';
import IRouteRepository from '../repository/IRouteRepository';
import IRouteHandler from './IRouteHandler';

export default class DefaultHandler implements IRouteHandler {
    registerRoute(route: IRoute, repository: IRouteRepository, server: any) {
        server.route({
            method: route.method,
            path: route.path,
            handler: function (_, r) {
                const current = repository.getRoutes().find((r: IRoute) =>
                    r.path === route.path
                    && r.method === route.method
                );

                if (current?.isActive()) {
                    return r.response(current.response).code(current.status);
                }

                return r.response({
                    statusCode: 404,
                    error: 'Not Found',
                    message: 'Not Found'
                }).code(404);
            }
        })
    }
}