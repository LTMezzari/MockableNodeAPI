import IFactoryAdapter from '../adapter/IFactoryAdapter';
import ILog from '../model/ILog';
import IRoute from '../model/route/IRoute';
import Route from '../model/route/Route';
import IRouteFactory from './IRouteFactory';

export default class DefaultFactory implements IRouteFactory {
    adapter?: IFactoryAdapter;

    constructor(adapter?: IFactoryAdapter) {
        this.adapter = adapter;
    }

    createRoute(request: any): IRoute {
        const route = new Route(
            this.createIdentifier(request) ?? 0,
            request.payload.path,
            request.payload.method,
            request.payload.name,
            request.payload.description,
            request.payload.queries,
            request.payload.response,
            request.payload.body,
            request.payload.status,
            request.payload.authentication,
            request.payload.timeOut,
            request.payload.validation,
        );

        if (this.adapter) {
            const _route = this.adapter.bindRoute(request, route);
            if (_route) {
                return _route;
            }
        }

        return route;
    }

    createRoutes(request: any): IRoute[] {
        const routes = request.payload;

        if (this.adapter) {
            const _routes = this.adapter.bindRoutes(request, routes);
            if (_routes) {
                return _routes;
            }
        }
        
        return routes;
    }

    createLog(request: any, message: string, data: any): ILog {
        const log = {
            time: new Date(),
            message,
            data,
        }

        if (this.adapter) {
            const _log = this.adapter.bindLog(request, log);
            if (_log) {
                return _log;
            }
        }

        return log;
    }

    createIdentifier(request: any): number {
        const identifier = parseInt(request.params?.id ?? '0');
        if (this.adapter) {
            const _identifier = this.adapter.bindIdentifier(request, identifier);
            if (_identifier) {
                return identifier;
            }
        }
        return identifier;
    }

    createOptions(request: any): any | undefined {
        if (this.adapter) {
            const options = this.adapter.bindOptions(request);
            if (options) {
                return options;
            }
        }
        return undefined;
    }
}