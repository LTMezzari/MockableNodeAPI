import Configuration from "../../configurator/Configuration";
import IFactoryAdapter from "../../domain/adapter/IFactoryAdapter";
import IRouteExtractor from "./IRouteExtractor";

export default class DefaultExtractor implements IRouteExtractor {
    adapter: IFactoryAdapter;
    routeExtractor(server: any, configuration: Configuration) {
        server.route({
            path: '/ws/extract/routes',
            method: 'POST',
            handler: async (request: any, reply: any) => {
                try {
                    let routes = configuration.factory.createRoutes(request);
                    if (this.adapter) {
                        routes = this.adapter.bindRoutes(request, routes);
                    }
                    await configuration.repository.addRoutes(routes, configuration.factory.createOptions(request));
                    configuration.handler.registerRoutes(server, routes, configuration);
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