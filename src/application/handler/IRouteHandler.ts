import IRoute from '../../domain/model/route/IRoute';
import Configuration from '../../configurator/Configuration';

export default interface IRouteHandler {
    registerRoute: (server: any, route: IRoute, configuration: Configuration) => void;

    registerRoutes: (server: any, routes: IRoute[], configuration: Configuration) => void;
}