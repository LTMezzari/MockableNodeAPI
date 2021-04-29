import IRoute from '../model/route/IRoute';
import IRouteRepository from '../repository/IRouteRepository';
import IRouteHandler from './IRouteHandler';

export default class DefaultHandler implements IRouteHandler {
    registerRoutes(routes: IRoute[], repository: IRouteRepository, server: any) {
        for (const route of routes) {
            this.registerRoute(route, repository, server);
        }
    }

    registerRoute(route: IRoute, repository: IRouteRepository, server: any) {
        server.route({
            method: route.method,
            path: route.path,
            handler: function (request: any, reply: any) {
                const current = repository.getRoutes().find((r: IRoute) =>
                    r.path === route.path
                    && r.method === route.method
                );

                if (current?.isActive) {
                    current.logs.push({
                        message: 'REQUEST RECEIVED',
                        data: {
                            headers: request.headers,
                            body: request.payload,
                            params: request.params,
                            query: request.query,
                            response: current.response,
                            status: current.status,
                        }
                    })
                    return reply.response(current.response).code(current.status);
                }

                return reply.response({
                    statusCode: 404,
                    error: 'Not Found',
                    message: 'Not Found'
                }).code(404);
            }
        })
    }
}