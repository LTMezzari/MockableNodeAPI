import Route from '../model/Route';
import IRouteFactory from './IRouteFactory';

export default class DefaultFactory implements IRouteFactory {
    createRoute(request: any): Route {
        return new Route(
            this.createIdentifier(request) ?? 0,
            true,
            request.payload.path,
            request.payload.method,
            request.payload.description,
            request.payload.response,
            request.payload.status,
        );
    }

    createIdentifier(request: any): number {
        return request.params.id;
    }
}