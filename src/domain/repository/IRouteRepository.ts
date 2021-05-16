import IRoute from '../model/route/IRoute';

export default interface IRouteRepository {

    addRoute: (route: IRoute, options?: any) => boolean;

    addRoutes: (routes: IRoute[], options?: any) => boolean;

    putRoute: (route: IRoute, options?: any) => boolean;

    deleteRoute: (identifier: any, options?: any) => boolean;

    getRoute: (identifier: any, options?: any) => IRoute | null;

    getRoutes: (options?: any) => IRoute[];
}