import Configuration from "../configurator/Configuration";

export default interface IRouteExtractor {
    routeExtractor: (server: any, configuration: Configuration) => void;
}