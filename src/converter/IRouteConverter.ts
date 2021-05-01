import Configuration from "../configurator/Configuration";

export default interface IRouteConverter {
    routeConverter: (server: any, configuration: Configuration) => void;
}