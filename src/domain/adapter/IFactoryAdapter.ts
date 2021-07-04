import ILog from "../model/ILog";
import IRoute from "../model/route/IRoute";

export default class IFactoryAdapter {
    bindRoute: (request: any, route: IRoute) => IRoute | undefined;

    bindRoutes: (request: any, routes: IRoute[]) => IRoute[] | undefined;

    bindLog: (request: any, log: ILog) => ILog | undefined;

    bindIdentifier: (request: any, identifier: any) => any;

    bindOptions: (request: any, options?: any) => any | void | null | undefined;
}