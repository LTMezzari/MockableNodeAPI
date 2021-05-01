import Configuration from "../configurator/Configuration";
import IRouteController from "../controller/IRouteController";
import IApplicationRouter from "./IApplicationRouter";

export const ReservedRoutes = {
    Create: '/ws/route',
    List: '/ws/routes',
    GetUpdateDelete: '/ws/route/{id}',
};

export default class ApplicationRouter implements IApplicationRouter {
    controller: IRouteController;

    constructor(controller: IRouteController) {
        this.controller = controller;
    }

    createRoutes(server: any, configuration: Configuration) {
        server.route({
            method: 'POST',
            path: ReservedRoutes.Create,
            handler: (request: any, reply: any) => this.controller.postRoute(server, request, reply),
        });

        server.route({
            method: 'GET',
            path: ReservedRoutes.List,
            handler: (request: any, reply: any) => this.controller.getRoutes(request, reply),
        });

        server.route({
            method: 'GET',
            path: ReservedRoutes.GetUpdateDelete,
            handler: (request: any, reply: any) => this.controller.getRoute(request, reply),
        });

        server.route({
            method: 'PUT',
            path: ReservedRoutes.GetUpdateDelete,
            handler: (request: any, reply: any) => this.controller.putRoute(request, reply),
        });

        server.route({
            method: 'DELETE',
            path: ReservedRoutes.GetUpdateDelete,
            handler: (request: any, reply: any) => this.controller.deleteRoute(request, reply),
        });

        for (const extractor of configuration.extractors) {
            extractor.routeExtractor(server, configuration);
        }

        for (const converter of configuration.converters) {
            converter.routeConverter(server, configuration);
        }
    }
}