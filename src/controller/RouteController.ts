import Configuration from '../configurator/Configuration';
import IRouteController from './IRouteController';

export default class RouteController implements IRouteController {
    configuration: Configuration;


    constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    postRoute(server: any, request: any, reply: any) {
        try {
            const route = this.configuration.factory.createRoute(request);
            const result = this.configuration.repository.addRoute(route);
            if (result) {
                this.configuration.handler.registerRoute(route, this.configuration.repository, server);
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
            return reply.response({
                code: 200,
                success: true,
                data: this.configuration.repository.getRoutes()
            }).code(200);
        } catch (error: any) {
            return this.dispatchError(error, reply);
        }

    }

    getRoute(request: any, reply: any) {
        try {
            const identifier = this.configuration.factory.createIdentifier(request);
            const route = this.configuration.repository.getRoute(identifier);
            if (!route) {
                return reply.response({
                    code: 404,
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
            const route = this.configuration.factory.createRoute(request);
            const result = this.configuration.repository.putRoute(route);
            if (!result) {
                return reply.response({
                    code: 404,
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
            const identifier = this.configuration.factory.createIdentifier(request);
            const result = this.configuration.repository.deleteRoute(identifier);
            if (!result) {
                return reply.response({
                    code: 404,
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

    dispatchError(error: any, reply: any) {
        console.log(error.message);
        return reply.response({
            code: 400,
            message: error.message
        }).code(400);
    }
}