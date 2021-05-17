import Configuration from '../../configurator/Configuration';
import IRouteController from './IRouteController';

export default class RouteController implements IRouteController {
    configuration: Configuration;


    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    postRoute(server: any, request: any, reply: any) {
        try {
            const options = this.configuration.factory.createOptions(request);
            const route = this.configuration.factory.createRoute(request);
            const result = this.configuration.repository.addRoute(route, options);
            if (result) {
                this.configuration.handler.registerRoute(server, route, this.configuration);
            }

            return reply.response({
                code: 201,
                success: result,
                data: route,
            }).code(201);
        } catch (error: any) {
            return this.dispatchError(error, reply);
        }
    }

    getRoutes(request: any, reply: any) {
        try {
            const options = this.configuration.factory.createOptions(request);
            const routes = this.configuration.repository.getRoutes(options);
            return reply.response({
                code: 200,
                success: true,
                data: routes.map((route: any) => ({
                    ...route,
                    logs: undefined,
                }))
            }).code(200);
        } catch (error: any) {
            return this.dispatchError(error, reply);
        }

    }

    getRoute(request: any, reply: any) {
        try {
            const options = this.configuration.factory.createOptions(request);
            const identifier = this.configuration.factory.createIdentifier(request);
            const route = this.configuration.repository.getRoute(identifier, options);
            if (!route) {
                return reply.response({
                    code: 404,
                    error: 'Not Found',
                    message: 'The requested route was not found'
                }).code(404);
            }

            return reply.response({
                code: 200,
                success: true,
                data: route
            }).code(200);
        } catch (error: any) {
            return this.dispatchError(error, reply);
        }
    }

    putRoute(request: any, reply: any) {
        try {
            const options = this.configuration.factory.createOptions(request);
            const route = this.configuration.factory.createRoute(request);
            const result = this.configuration.repository.putRoute(route, options);
            if (!result) {
                return reply.response({
                    code: 404,
                    error: 'Not Found',
                    message: 'The requested route was not found to edit'
                }).code(404);
            }

            return reply.response({
                code: 200,
                success: result,
                data: route,
            }).code(200);
        } catch (error: any) {
            return this.dispatchError(error, reply);
        }
    }

    deleteRoute(request: any, reply: any) {
        try {
            const options = this.configuration.factory.createOptions(request);
            const identifier = this.configuration.factory.createIdentifier(request);
            const result = this.configuration.repository.deleteRoute(identifier, options);
            if (!result) {
                return reply.response({
                    code: 404,
                    error: 'Not Found',
                    message: 'The requested route was not found to delete'
                }).code(404);
            }

            return reply.response({
                code: 200,
                success: result
            }).code(200);
        } catch (error: any) {
            return this.dispatchError(error, reply);
        }
    }

    getServerLogs(request: any, reply: any) {
        try {
            const options = this.configuration.factory.createOptions(request);
            const routes = this.configuration.repository.getRoutes(options);
            const logs = [];
            routes.forEach((route: any) => {
                logs.push(...route.logs);
            });
            logs.sort((log1: any, log2: any) => log2.time - log1.time);
            return reply.response({
                code: 200,
                success: logs,
            }).code(200);
        } catch (error: any) {
            return this.dispatchError(error, reply);
        }
    }

    dispatchError(error: any, reply: any) {
        console.log(error.message);
        return reply.response({
            code: 400,
            error: 'Bad Request',
            message: error.message
        }).code(400);
    }
}