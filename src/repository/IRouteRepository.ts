import IRoute from '../model/route/IRoute';

export default interface IRouteRepository {

    addRoute: (route: IRoute) => boolean;

    addRoutes: (routes: IRoute[]) => boolean;

    putRoute: (route: IRoute) => boolean;

    deleteRoute: (identifier: any) => boolean;

    getRoute: (identifier: any) => IRoute | null;

    getRoutes: () => IRoute[];
}