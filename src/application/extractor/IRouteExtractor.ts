import IFactoryAdapter from "../../domain/adapter/IFactoryAdapter";
import Configuration from "../../configurator/Configuration";

export default interface IRouteExtractor {
    adapter: IFactoryAdapter;
    routeExtractor: (server: any, configuration: Configuration) => void;
}