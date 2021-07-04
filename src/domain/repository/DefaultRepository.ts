import ILog from '../model/ILog';
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

    async addRoutes(routes: Route[]) {
        for (const route of routes) {
            const old = this.routes.find((r) =>
                r.path === route.path
                && r.method === route.method
            );
            if (old) {
                this.updateRoute(old, route);
                continue;
            }
            this.addRoute(route);
        }
        return true;
    }

    async addRoute(route: Route) {
        const old = this.routes.find((r) =>
            r.path === route.path
            && r.method === route.method
        );

        if (old) {
            throw Error(`Duplicated Route (${old.method} => ${old.path})`);
        }

        route.id = this.index;
        this.routes.push(route);
        this.index++;
        return true;
    }

    async putRoute(route: Route) {
        const old = this.routes.find((r) => r.id == route.id);
        if (!old) {
            return false;
        }

        if (old.path !== route.path || old.method !== route.method) {
            throw Error(`Method or Path different (${old.method} => ${old.path})`);
        }

        this.updateRoute(old, route);
        return true;
    }

    async deleteRoute(identifier: any) {
        const route = this.routes.find((r) => r.id == identifier);

        if (route) {
            const index = this.routes.indexOf(route);
            this.routes.splice(index, 1);
            return true;
        }
        return false;
    }

    async getRoute(identifier: any) {
        const route = this.routes.find((r) => r.id === identifier);
        if (route) {
            return route;
        }

        return null;
    }

    async getRoutes() {
        return this.routes ?? [];
    }

    async saveLog(route: IRoute, log: ILog) {
        if (!route.logs) {
            route.logs = [];
        }
        route.logs.push(log);
        return true;
    }

    private updateRoute(old: Route, route: Route) {
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