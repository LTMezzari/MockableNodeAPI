'use strict';
const PORT = 3000;
const Hapi = require("@hapi/hapi");

const server = Hapi.server({
    port: PORT,
    routes: {
        cors: {
            origin: 'ignore'
        }
    }
});

const routes = [];
let index = 0;

const init = async () => {
    server.route({
        method: 'POST',
        path: '/ws/route',
        handler: (request, reply) => {
            const route = {
                id: index,
                active: true,
                method: request.payload.method,
                path: request.payload.path,
                response: request.payload.response
            };

            const old = routes.find((r) =>
                r.path === route.path
                && r.method === route.method
            )
            if (old && old.active) {
                return reply.response({
                    code: 400,
                    success: false,
                    message: 'Duplicate'
                }).code(400);
            }
            index++;

            if (old && !old.active) {
                const index = routes.indexOf(old);
                routes[index] = {
                    ...old,
                    id: route.id,
                    response: route.response,
                    active: true
                };

                return reply.response({
                    code: 200,
                    success: true
                }).code(201);
            }

            routes.push(route);
            server.route({
                method: route.method,
                path: route.path,
                handler: function (_, r) {
                    const current = routes.find((r) =>
                        r.path === route.path
                        && r.method === route.method
                    );

                    if (current && current.active)
                        return route.response;

                    return r.response({
                        statusCode: 404,
                        error: 'Not Found',
                        message: 'Not Found'
                    }).code(404);
                }
            });

            return reply.response({
                code: 200,
                success: true
            }).code(201);
        }
    });

    server.route({
        method: 'GET',
        path: '/ws/routes',
        handler: () => {
            return {
                code: 200,
                success: true,
                data: routes.filter((r) => r.active)
            };
        }
    });

    server.route({
        method: 'GET',
        path: '/ws/route/{id}',
        handler: (request, r) => {
            const route = routes.find((r) => r.id == request.params.id);

            if (route && route.active) {
                return {
                    code: 200,
                    success: true,
                    data: route
                };
            }

            return r.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Not Found'
            }).code(404);
        }
    });

    server.route({
        method: 'PUT',
        path: '/ws/route/{id}',
        handler: (request, reply) => {
            const route = {
                id: request.params.id,
                method: request.payload.method,
                path: request.payload.path,
                response: request.payload.response
            };

            const old = routes.find((r) => r.id === route.id);
            if (!old) {
                return reply.response({
                    code: 404,
                    success: false,
                    message: 'Id not found'
                }).code(400);
            }

            if (old.path !== route.path || old.method !== route.method) {
                return reply.response({
                    code: 400,
                    success: false,
                    message: 'Method or Path different'
                }).code(400);
            }

            const index = routes.indexOf(old);
            routes[index] = {
                ...old,
                id: route.id,
                response: route.response
            };

            return {
                code: 200,
                success: true
            };
        }
    });

    server.route({
        method: 'DELETE',
        path: '/ws/route/{id}',
        handler: (request, reply) => {
            const route = routes.find((r) => r.id == request.params.id);

            if (route) {
                const index = routes.indexOf(route);
                routes[index] = {
                    ...route,
                    active: false
                };

                return {
                    code: 200,
                    success: true
                };
            }

            return reply.response({
                statusCode: 404,
                error: 'Not Found',
                message: 'Not Found'
            }).code(404);
        }
    });

    await server.start();
};

init();