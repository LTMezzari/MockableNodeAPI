import ReservedRoute from '../model/route/ReservedRoute';
import ILog from '../model/ILog';
import IRouteRepository from './IRouteRepository';

export default class ReservedRouteRepository implements IRouteRepository {
    routes: ReservedRoute[];
    index: number;

    constructor() {
        this.routes = [];
        this.index = 0;
    }

    addRoutes(routes: ReservedRoute[], options: any) {
        for (const route of routes) {
            const old = this.routes.find((r) =>
                r.path === route.path
                && r.method === route.method
                && options.collection === r.owner,
            );
            if (old) {
                this.updateRoute(old, route);
                continue;
            }
            this.addRoute(route, options);
        }
        return true;
    }

    addRoute(route: ReservedRoute, options: any): boolean {
        const old = this.routes.find((r) =>
            r.path === route.path
            && r.method === route.method
            && options.collection === r.owner,
        );

        if (old) {
            throw Error(`Duplicated Route (${old.method} => ${old.path})`);
        }

        route.id = this.index;
        this.routes.push(route);
        this.index++;
        return true;
    }

    putRoute(route: ReservedRoute, options: any): boolean {
        const old = this.routes.find((r) => r.id == route.id && r.owner === options.collection);
        if (!old) {
            return false;
        }

        if (old.path !== route.path || old.method !== route.method) {
            throw Error(`Method or Path different (${old.method} => ${old.path})`);
        }

        this.updateRoute(old, route);
        return true;
    }

    deleteRoute(identifier: any, options: any): boolean {
        const route = this.routes.find((r) => r.id == identifier && r.owner === options.collection);

        if (route) {
            const index = this.routes.indexOf(route);
            this.routes.splice(index, 1);
            return true;
        }
        return false;
    }

    getRoute(identifier: any, options: any): ReservedRoute | null {
        const route = this.routes.find((r) => r.id === identifier && r.owner === options.collection);
        if (route) {
            return route;
        }

        return null;
    }

    getRoutes(options: any): ReservedRoute[] {
        return this.routes.filter((r: ReservedRoute) => r.owner === options.collection) ?? [];
    }

    saveLog(route: ReservedRoute, log: ILog) {
        route.logs.push(log);
    }

    private updateRoute(old: ReservedRoute, route: ReservedRoute) {
        const index = this.routes.indexOf(old);
        if (index === -1) {
            throw Error(`Route not found (${route.method} => ${route.path})`);
        }
        route.id = old.id;
        this.routes[index] = {
            ...route,
            logs: old.logs
        };
    }
}