import IRoute from '../model/IRoute';
import IRouteRepository from '../repository/IRouteRepository';

export default interface IRouteHandler {
    registerRoute: (route: IRoute, repository: IRouteRepository, server: any) => void;
}