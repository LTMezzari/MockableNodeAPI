import * as Hapi from '@hapi/hapi';

import Configuration, { Builder } from './configurator/Configuration';
import IRouteController from './controller/IRouteController';
import RouteController from './controller/RouteController';
import SwaggerExtractor from './extractor/SwaggerExtractor';
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

const configuration: Configuration = new Builder()
    .addExtractor(new SwaggerExtractor())
    .build();
const controller: IRouteController = new RouteController(configuration);

const init = async () => {
    routeApplication(server, configuration, controller);
    await server.start();
}
init();