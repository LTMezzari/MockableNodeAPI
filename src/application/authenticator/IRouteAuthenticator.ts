import IRoute from "../../domain/model/route/IRoute";

export default interface IRouteAuthenticator {
    isRouteAuthenticated: (request: any, route: IRoute) => boolean
}