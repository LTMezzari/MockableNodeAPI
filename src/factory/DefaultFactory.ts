import IFactoryAdapter from '../adapter/IFactoryAdapter';
import IRoute from '../model/route/IRoute';
import Route from '../model/route/Route';
import IRouteFactory from './IRouteFactory';

export default class DefaultFactory implements IRouteFactory {
    adapters: IFactoryAdapter[];

    constructor(adapters: IFactoryAdapter[] = []) {
        this.adapters = adapters;
    }

    createRoute(request: any): IRoute {
        for (const adapter of this.adapters) {
            const route = adapter.createRoute(request);
            if (route) {
                return route;
            }
        }

        return new Route(
            this.createIdentifier(request) ?? 0,
            request.payload.path,
            request.payload.method,
            request.payload.description,
            request.payload.response,
            request.payload.status,
        );
    }

    createRoutes(request: any): IRoute[] {
        for (const adapter of this.adapters) {
            const routes = adapter.createRoutes(request);
            if (routes) {
                return routes;
            }
        }

        return request.payload;
    }

    createIdentifier(request: any): number {
        return request.params?.id;
    }
}