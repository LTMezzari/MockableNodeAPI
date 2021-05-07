import IFactoryAdapter from "../adapter/IFactoryAdapter";
import Configuration from "../configurator/Configuration";
import IRoute from "../model/route/IRoute";
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

export class PostmanAdapter implements IFactoryAdapter {
    createRoutes(request: any): IRoute[] {
        try {
            if (request.path !== undefined && request.path !== ExtractorRoute) {
                return;
            }
            const extractor = new Extractor();
            return extractor.extractRoutes(request.payload.items ?? request.payload.item);
        } catch (error: any) {
            console.log(error.message);
            return;
        }
    }

    createRoute(_: any): IRoute {
        return;
    }

}

export default class PostmanExtractor implements IRouteExtractor {
    routeExtractor(server: any, configuration: Configuration) {
        configuration.factory.adapters.push(new PostmanAdapter());
        server.route({
            method: 'POST',
            path: ExtractorRoute,
            handler: (request: any, reply: any) => {
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