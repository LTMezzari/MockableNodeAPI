import IRoute from "../model/IRoute";

export default interface IRouteFactory {
    createRoute: (request: any) => IRoute;
    createIdentifier: (request: any) => any;
}