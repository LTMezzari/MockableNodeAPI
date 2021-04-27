import IRouteController from "../controller/IRouteController";

export const ReservedRoutes = {
    Create: '/ws/route',
    List: '/ws/routes',
    GetUpdateDelete: '/ws/route/{id}',
};

export function routeApplication(server: any, controller: IRouteController) {
    server.route({
        method: 'POST',
        path: ReservedRoutes.Create,
        handler: (request: any, reply: any) => controller.postRoute(server, request, reply),
    });

    server.route({
        method: 'GET',
        path: ReservedRoutes.List,
        handler: controller.getRoutes,
    });

    server.route({
        method: 'GET',
        path: ReservedRoutes.GetUpdateDelete,
        handler: controller.getRoute,
    });

    server.route({
        method: 'PUT',
        path: ReservedRoutes.GetUpdateDelete,
        handler: controller.putRoute,
    });

    server.route({
        method: 'DELETE',
        path: ReservedRoutes.GetUpdateDelete,
        handler: controller.deleteRoute,
    });
}