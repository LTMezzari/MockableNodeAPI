import ILog from '../model/ILog';
import ReservedRoute, { RouteSchema as RouteDB } from '../model/route/ReservedRoute';
import IRouteRepository from './IRouteRepository';

export default class ReservedRouteRepository implements IRouteRepository {
    async addRoutes(routes: ReservedRoute[], options: any) {
        for (const route of routes) {
            const old = await this.findOne({
                path: route.path,
                method: route.method,
                owner: options.collection,
            });

            if (old) {
                this.updateRoute(old, route);
                continue;
            }
            this.addRoute(route, options);
        }
        return true;
    }

    async addRoute(route: ReservedRoute, options: any) {
        const old = await this.findOne({
            path: route.path,
            method: route.method,
            owner: options.collection,
        });

        if (old) {
            throw Error(`Duplicated Route (${old.method} => ${old.path})`);
        }

        const r = new RouteDB({
            ...route,
        });
        await r.save();
        route.id = r._id;
        return true;
    }

    async putRoute(route: ReservedRoute, options: any) {
        const old = await this.findOne({ _id: route.id, owner: options.collection });
        if (!old) {
            return false;
        }

        if (old.path !== route.path || old.method !== route.method) {
            throw Error(`Method or Path different (${old.method} => ${old.path})`);
        }

        this.updateRoute(old, route);
        return true;
    }

    async deleteRoute(identifier: any, options: any) {
        const route = await this.findOne({ _id: identifier, owner: options.collection });

        if (route) {
            await RouteDB.deleteOne({ _id: route.id });
            return true;
        }
        return false;
    }

    async getRoute(identifier: any, options: any) {
        const route = await this.findOne({ _id: identifier, owner: options.collection });
        if (route) {
            return route;
        }

        return null;
    }

    async getRoutes(options: any) {
        return await this.find({ owner: options.collection });
    }

    async saveLog(route: ReservedRoute, log: ILog) {
        this.updateRoute(route, new ReservedRoute({ ...route, logs: [...route.logs, log] }));
        return true;
    }

    private async updateRoute(old: ReservedRoute, route: ReservedRoute) {
        await RouteDB.findOneAndUpdate({
            _id: old.id,
            path: old.path,
            method: old.method,
            owner: route.owner,
        }, route);
    }

    private async find(query: any) {
        return (await RouteDB.find(query).exec()).map((item: any) => ({
            ...item._doc,
            id: item._doc._id,
        })) ?? [];
    }

    private async findOne(query: any) {
        const item: any = await RouteDB.findOne(query).exec();
        if (!item) {
            return null;
        }
        return new ReservedRoute({
            ...item._doc,
            id: item._id,
        });
    }
}