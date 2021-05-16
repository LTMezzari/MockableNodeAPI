import IRoute from "../../domain/model/route/IRoute";
import IRouteAuthenticator from "./IRouteAuthenticator";

export default class DefaultAuthenticator implements IRouteAuthenticator {
    isRouteAuthenticated(request: any, route: IRoute): boolean {
        const authorization = request.headers.authorization;
        if (route.needsAuthentication) {
            return !!authorization;
        }
        return true
    }
}