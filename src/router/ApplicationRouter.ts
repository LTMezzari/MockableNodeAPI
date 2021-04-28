import IRouteController from "../controller/IRouteController";

export const ReservedRoutes = {
    Create: '/ws/route',
    List: '/ws/routes',
    GetUpdateDelete: '/ws/route/{id}',
};

export default function routeApplication(server: any, controller: IRouteController) {
    server.route({
        method: 'POST',
        path: ReservedRoutes.Create,
        handler: (request: any, reply: any) => controller.postRoute(server, request, reply),
    });

    server.route({
        method: 'GET',
        path: ReservedRoutes.List,
        handler: (request: any, reply: any) => controller.getRoutes(request, reply),
    });

    server.route({
        method: 'GET',
        path: ReservedRoutes.GetUpdateDelete,
        handler: (request: any, reply: any) => controller.getRoute(request, reply),
    });

    server.route({
        method: 'PUT',
        path: ReservedRoutes.GetUpdateDelete,
        handler: (request: any, reply: any) => controller.putRoute(request, reply),
    });

    server.route({
        method: 'DELETE',
        path: ReservedRoutes.GetUpdateDelete,
        handler: (request: any, reply: any) => controller.deleteRoute(request, reply),
    });
}