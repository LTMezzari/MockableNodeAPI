import Configuration from "../../configurator/Configuration";
import IRouteConverter from "./IRouteConverter";
import ReservedRoute, { RouteSchema as RouteDB } from '../../domain/model/route/ReservedRoute';

export default class MongoDBConverter implements IRouteConverter {
    async routeConverter(server: any, configuration: Configuration) {
        const savedRoutes = await RouteDB.find({}).exec();
        const routes = savedRoutes.map((item: any) => (new ReservedRoute({ ...item._doc, id: item._id })));
        configuration.handler.registerRoutes(server, routes, configuration);
    }
}