import Configuration from "../configurator/Configuration";
import IRouteExtractor from "./IRouteExtractor";

import SwaggerAdapter from '../adapter/SwaggerAdapter';

import sendRequest from '../utils/RequestUtils';

export default class SwaggerExtractor implements IRouteExtractor {
    routeExtractor(server: any, configuration: Configuration) {
        configuration.factory.adapters.push(new SwaggerAdapter());
        server.route({
            path: '/ws/extract/swagger',
            method: 'POST',
            handler: async (request: any, reply: any) => {
                try {
                    const url = request.payload.url;
                    const hostname = url.split('https://')[1].split('/')[0];
                    const path = url.split(`https://${hostname}`)[1];
                    const stringResponse = await sendRequest({
                        hostname: hostname,
                        path: path,
                        method: 'GET'
                    });
                    const response = JSON.parse(stringResponse);
                    const routes = configuration.factory.createRoutes(response);
                    configuration.repository.addRoutes(routes);
                    configuration.handler.registerRoutes(routes, configuration.repository, server)
                    return reply.response({
                        code: 201,
                        message: `${routes.length} Routes Created`,
                        data: routes,
                    }).code(201);
                } catch (error: any) {
                    console.error(error.message);
                    return reply.response({
                        code: 400,
                        error: error.message
                    }).code(400);
                }

            }
        });
    }
}