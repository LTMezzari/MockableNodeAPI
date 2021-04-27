import IRoute from '../model/IRoute';
import Route from '../model/Route';
import IRouteRepository from './IRouteRepository';

export default class DefaultRepository implements IRouteRepository {
    routes: Route[];
    index: number;

    constructor() {
        this.routes = [];
        this.index = 0;
    }

    addRoute(route: Route): boolean {
        const old = this.routes.find((r) =>
            r.path === route.path
            && r.method === route.method
        );

        if (old && old.active) {
            throw Error('Duplicated Route');
        }

        if (old && !old.active) {
            const index = this.routes.indexOf(old);
            route.id = index;
            this.routes[index] = route;
            return true;
        }

        route.id = this.index;
        this.routes.push(route);
        this.index++;
        return true;
    }

    putRoute(route: Route): boolean {
        const old = this.routes.find((r) => r.id == route.id);
        if (!old) {
            return false;
        }

        if (old.path !== route.path || old.method !== route.method) {
            throw Error('Method or Path different');
        }

        const index = this.routes.indexOf(old);
        this.routes[index] = {
            ...old,
            id: route.id,
            response: route.response,
            isActive: old.isActive,
        };
        return true;
    }

    deleteRoute(identifier: any): boolean {
        const route = this.routes.find((r) => r.id == identifier);

        if (route) {
            const index = this.routes.indexOf(route);
            this.routes[index].active = false;
            return true;
        }
        return false;
    }

    getRoute(identifier: any): IRoute | null {
        const route = this.routes.find((r) => r.id === identifier);
        if (route && route.active) {
            return route;
        }

        return null;
    }

    getRoutes(): IRoute[] {
        return this.routes.filter((r) => r.active) ?? [];
    }

    find(predicate: (route: IRoute) => boolean): IRoute | null {
        return this.routes.find(predicate)
    }
}