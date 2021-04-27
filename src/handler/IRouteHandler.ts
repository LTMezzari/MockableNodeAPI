import IRoute from '../model/IRoute';
import Configuration from '../configurator/Configuration';

export default interface IRouteHandler {
    registerRoute: (route: IRoute, routes: IRoute[], server: any) => void;
}