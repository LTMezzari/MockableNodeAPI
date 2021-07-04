import ILog from '../model/ILog';
import IRoute from '../model/route/IRoute';
import ReservedRoute from '../model/route/ReservedRoute';
import IFactoryAdapter from './IFactoryAdapter';

export default class ReservedRouteAdapter implements IFactoryAdapter {
    bindRoute(request: any, route: IRoute): ReservedRoute {
        return new ReservedRoute(
            {
                ...route,
                id: request.payload.id ?? request.params.id,
                owner: this.getCollection(request),
            }
        );
    }

    bindRoutes(request: any, routes: IRoute[]): ReservedRoute[] {
        return routes.map((route: IRoute, _: number) => (new ReservedRoute(
            {
                ...route,
                id: request.payload.id ?? request.params.id,
                owner: this.getCollection(request),
            })));
    }

    bindLog(_: any, log: ILog): ILog {
        // Use default log
        return log;
    }

    bindIdentifier(request: any, _: any): any {
        return request.params?.id;
    }

    bindOptions(request: any): any {
        return {
            collection: this.getCollection(request),
        };
    }

    getCollection(request: any): string {
        const collection: string = request.headers.collection;
        if (!collection) {
            throw Error('Missing a collection');
        }
        return collection;
    }
}