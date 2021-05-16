import IRouteAuthenticator from '../authenticator/IRouteAuthenticator';
import IRoute from '../../domain/model/route/IRoute';
import IRouteRepository from '../../domain/repository/IRouteRepository';

export default interface IRouteHandler {
    registerRoute: (server: any, route: IRoute, repository: IRouteRepository, authenticator?: IRouteAuthenticator) => void;

    registerRoutes: (server: any, routes: IRoute[], repository: IRouteRepository, authenticator?: IRouteAuthenticator) => void;
}