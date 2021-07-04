import IFactoryAdapter from "../adapter/IFactoryAdapter";
import IRoute from "../model/route/IRoute";
import ILog from "../model/ILog";

export default interface IRouteFactory {
    adapter?: IFactoryAdapter;

    createRoute: (request: any) => IRoute;

    createRoutes: (request: any) => IRoute[];

    createLog: (request: any, message: string, data: any) => ILog;

    createIdentifier: (request: any) => any;

    createOptions: (request: any) => any | null | undefined;
}