import IRoute from '../model/route/IRoute';
import ILog from '../model/ILog';

export default interface IRouteRepository {

    addRoute: (route: IRoute, options?: any) => Promise<boolean>;

    addRoutes: (routes: IRoute[], options?: any) => Promise<boolean>;

    putRoute: (route: IRoute, options?: any) => Promise<boolean>;

    deleteRoute: (identifier: any, options?: any) => Promise<boolean>;

    getRoute: (identifier: any, options?: any) => Promise<IRoute | null>;

    getRoutes: (options?: any) => Promise<IRoute[]>;

    saveLog: (route: IRoute, log: ILog, options?: any) => Promise<boolean>;
}