import IRouteAuthenticator from '../authenticator/IRouteAuthenticator';
import IRoute from '../model/route/IRoute';
import IRouteRepository from '../repository/IRouteRepository';
import IRouteHandler from './IRouteHandler';

export default class DefaultHandler implements IRouteHandler {
    registerRoutes(server: any, routes: IRoute[], repository: IRouteRepository, authenticator?: IRouteAuthenticator) {
        for (const route of routes) {
            this.registerRoute(server, route, repository, authenticator);
        }
    }

    registerRoute(server: any, route: IRoute, repository: IRouteRepository, authenticator?: IRouteAuthenticator) {
        if (server.match(route.method, route.path)) {
            return;
        }

        server.route({
            method: route.method,
            path: route.path,
            handler: async (request: any, reply: any) => {
                try {
                    const current = repository.getRoutes().find((r: IRoute) =>
                        r.path === route.path
                        && r.method === route.method
                    );

                    if (!current?.isActive) {
                        return reply.response({
                            statusCode: 404,
                            error: 'Not Found',
                            message: 'The requested method was not found'
                        }).code(404);
                    }

                    await this.handleTimeOut(current);
                    return this.handleRequest(request, reply, current, authenticator);
                } catch (error: any) {
                    console.log(error);
                    return reply.response({
                        statusCode: 400,
                        error: 'Bad Request',
                        message: error.message
                    }).code(400);
                }
            }
        })
    }

    handleTimeOut(route: IRoute): Promise<any> {
        return new Promise((resolve: any) => {
            if (!route?.timeOut) {
                return resolve();
            }
            setTimeout(resolve, route.timeOut);
        })
    }

    handleRequest(request: any, reply: any, route: IRoute, authenticator: IRouteAuthenticator) {
        try {
            if (!authenticator?.isRouteAuthenticated(request, route) ?? false) {
                const response = {
                    statusCode: 401,
                    error: 'Unathorized',
                    message: 'You are not authorized to use this method'
                };
                this.addLog(route, 'REQUEST RECEIVED', this.createLog(request, route.response, 401));
                return reply.response(response).code(401);
            }

            this.addLog(route, 'REQUEST RECEIVED', this.createLog(request, route.response, route.status));
            return reply.response(route.response).code(route.status);
        } catch (error: any) {
            console.log(error);
            const response = {
                statusCode: 400,
                error: 'Bad Request',
                message: error.message
            };
            this.addLog(route, 'BAD REQUEST RECEIVED', this.createLog(request, response, 400))
            return reply.response(response).code(400);
        }
    }

    addLog(route: IRoute, message: string, data: any) {
        route.logs.push({
            message,
            data,
        })
    }

    createLog(request: any, response: any, status: number) {
        return {
            headers: request.headers,
            body: request.payload,
            params: request.params,
            query: request.query,
            response,
            status,
        }
    }
}