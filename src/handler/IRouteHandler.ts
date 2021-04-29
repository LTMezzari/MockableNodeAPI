import IRoute from '../model/route/IRoute';
import IRouteRepository from '../repository/IRouteRepository';

export default interface IRouteHandler {
    registerRoute: (route: IRoute, repository: IRouteRepository, server: any) => void;

    registerRoutes: (routes: IRoute[], repository: IRouteRepository, server: any) => void;
}