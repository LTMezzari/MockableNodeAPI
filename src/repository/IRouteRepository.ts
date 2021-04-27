import IRoute from '../model/IRoute';

export default interface IRouteRepository {

    addRoute: (route: IRoute) => boolean;

    putRoute: (route: IRoute) => boolean;

    deleteRoute: (identifier: any) => boolean;

    getRoute: (identifier: any) => IRoute | null;

    getRoutes: () => IRoute[];

    find: (predicate: (route: IRoute) => boolean) => IRoute | null;
}