import Configuration from "../../configurator/Configuration";
import IRouteExtractor from "./IRouteExtractor";

export default class DefaultExtractor implements IRouteExtractor {
    routeExtractor(server: any, configuration: Configuration) {
        server.route({
            path: '/ws/extract/routes',
            method: 'POST',
            handler: async (request: any, reply: any) => {
                try {
                    const routes = configuration.factory.createRoutes(request);
                    configuration.repository.addRoutes(routes);
                    configuration.handler.registerRoutes(server, routes, configuration.repository, configuration.authenticator)
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