'use strict';
const PORT = 3000;
const Hapi = require("@hapi/hapi");

const server = Hapi.server({
    port: PORT
});

const init = async () => {
    server.route({
        method: 'POST',
        path: '/ws/route',
        handler: (request, reply) => {
            server.route({
                method: request.payload.method,
                path: request.payload.path,
                handler: (_, r) => {
                    return request.payload.response;
                }
            });

            return {
                code: 200,
                success: true
            };
        }
    });
    await server.start();
};

init();