import IRoute from "../../domain/model/route/IRoute";

export default interface IRouteValidator {
    isRouteValid: (request: any, route: IRoute) => boolean;
}