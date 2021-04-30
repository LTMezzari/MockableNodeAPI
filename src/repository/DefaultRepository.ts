import IRoute from '../model/route/IRoute';
import Route from '../model/route/Route';
import IRouteRepository from './IRouteRepository';

export default class DefaultRepository implements IRouteRepository {
    routes: Route[];
    index: number;

    constructor() {
        this.routes = [];
        this.index = 0;
    }

    addRoutes(routes: Route[]) {
        for (const route of routes) {
            const old = this.routes.find((r) =>
                r.path === route.path
                && r.method === route.method
                && r.isActive
            );
            if (old) {
                this.updateRoute(old, route);
                continue;
            }
            this.addRoute(route);
        }
        return true;
    }

    addRoute(route: Route): boolean {
        const old = this.routes.find((r) =>
            r.path === route.path
            && r.method === route.method
        );

        if (old && old.isActive) {
            throw Error(`Duplicated Route (${old.method} => ${old.path})`);
        }

        if (old && !old.isActive) {
            const index = this.routes.indexOf(old);
            route.id = index;
            this.routes[index] = route;
            return false;
        }

        route.id = this.index;
        this.routes.push(route);
        this.index++;
        return true;
    }

    putRoute(route: Route): boolean {
        const old = this.routes.find((r) => r.id == route.id && r.isActive);
        if (!old) {
            return false;
        }

        if (old.path !== route.path || old.method !== route.method) {
            throw Error(`Method or Path different (${old.method} => ${old.path})`);
        }

        this.updateRoute(old, route);
        return true;
    }

    deleteRoute(identifier: any): boolean {
        const route = this.routes.find((r) => r.id == identifier && r.isActive);

        if (route) {
            const index = this.routes.indexOf(route);
            this.routes[index].isActive = false;
            return true;
        }
        return false;
    }

    getRoute(identifier: any): IRoute | null {
        const route = this.routes.find((r) => r.id === identifier);
        if (route && route.isActive) {
            return route;
        }

        return null;
    }

    getRoutes(): IRoute[] {
        return this.routes.filter((r) => r.isActive) ?? [];
    }

    updateRoute(old: Route, route: Route) {
        const index = this.routes.indexOf(old);
        this.routes[index] = {
            ...route,
            logs: old.logs
        };
    }
}