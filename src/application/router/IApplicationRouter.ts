import Configuration from "../../configurator/Configuration";
import IRouteController from "../controller/IRouteController";

export default interface IApplicationRouter {
    controller: IRouteController;

    createRoutes(server: any, configuration: Configuration);
}