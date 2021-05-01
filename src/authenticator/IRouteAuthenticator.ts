import IRoute from "../model/route/IRoute";

export default interface IRouteAuthenticator {
    isRouteAuthenticated: (request: any, route: IRoute) => boolean
}