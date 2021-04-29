import IFactoryAdapter from "../adapter/IFactoryAdapter";
import IRoute from "../model/route/IRoute";

export default interface IRouteFactory {
    adapters: IFactoryAdapter[];

    createRoute: (request: any) => IRoute;
    createRoutes: (request: any) => IRoute[];
    createIdentifier: (request: any) => any;
}