import IFactoryAdapter from "../adapter/IFactoryAdapter";
import IRoute from "../model/route/IRoute";

export default interface IRouteFactory {
    adapter?: IFactoryAdapter;

    createRoute: (request: any) => IRoute;

    createRoutes: (request: any) => IRoute[];

    createIdentifier: (request: any) => any;

    createOptions: (request: any) => any | null | undefined;
}