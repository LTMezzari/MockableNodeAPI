import Configuration from "../../configurator/Configuration";
import IRoute from "../../domain/model/route/IRoute";
import IRouteExtractor from "./IRouteExtractor";

export const ExtractorRoute: string = '/ws/extract/postman';

export class Extractor {
    extractRoutes(items: any[]): IRoute[] {
        return this.extractItems(items, []);
    }

    extractItems(items: any[], routes: IRoute[]): IRoute[] {
        for (const item of items) {
            const subItems = item.items ?? item.item;
            if (subItems?.length > 0) {
                this.extractItems(subItems, routes);
                continue;
            }
            routes.push(this.extractRoute(item));
        }
        return routes;
    }

    extractRoute(item: any): IRoute {
        return {
            path: item.request.url.path.length > 0 ? '/' + item.request.url.path.join('/').replace(/\{{/g, '{').replace(/\}}/g, '}') : '/',
            method: item.request.method,
            description: item.request.description,
            status: item.response.length > 0 ? item.response[0].code : 200,
            response: item.response.length > 0 ? JSON.parse(item.response[0].body) : undefined,
            queries: item.request.url.query?.length > 0 ? item.request.url.query : undefined,
            body: item.request.body?.raw ? JSON.parse(item.request.body?.raw) : undefined,
            needsAuthentication: false,
            logs: []
        }
    }
}

export default class PostmanExtractor implements IRouteExtractor {
    routeExtractor(server: any, configuration: Configuration) {
        server.route({
            method: 'POST',
            path: ExtractorRoute,
            handler: (request: any, reply: any) => {
                try {
                    const extractor = new Extractor();
                    const routes = extractor.extractRoutes(request.payload.items ?? request.payload.item);
                    configuration.repository.addRoutes(routes);
                    configuration.handler.registerRoutes(server, routes, configuration.repository, configuration.authenticator)
                    return reply.response({
                        code: 201,
                        message: `${routes.length} Routes Created`,
                        data: routes,
                    }).code(201);
                } catch (error: any) {
                    console.log(error.message);
                    return reply.response({
                        code: 400,
                        error: 'Bad Request',
                        message: error.message
                    }).code(400);
                }
            }
        })
    }
}