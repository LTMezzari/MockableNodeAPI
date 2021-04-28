import * as Hapi from '@hapi/hapi';

import Configuration, { Builder } from './configurator/Configuration';
import IRouteController from './controller/IRouteController';
import RouteController from './controller/RouteController';
import routeApplication from './router/ApplicationRouter';

const PORT = 3000;

const server = Hapi.server({
    port: PORT,
    routes: {
        cors: {
            origin: 'ignore'
        }
    }
});

const configuration: Configuration = new Builder().build();
const controller: IRouteController = new RouteController(configuration);

const init = async () => {
    routeApplication(server, controller);
    await server.start();
}
init();