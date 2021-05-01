import * as Hapi from '@hapi/hapi';

import Configuration, { Builder } from './configurator/Configuration';
import IRouteController from './controller/IRouteController';
import IApplicationRouter from './router/IApplicationRouter';

import RouteController from './controller/RouteController';
import PostmanConverter from './converter/PostmanConverter';
import SwaggerExtractor from './extractor/SwaggerExtractor';
import ApplicationRouter from './router/ApplicationRouter';
import PostmanExtractor from './extractor/PostmanExtractor';

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
    .addExtractor(new PostmanExtractor())
    .addConverter(new PostmanConverter())
    .build();

const controller: IRouteController = new RouteController(configuration);
const router: IApplicationRouter = new ApplicationRouter(controller);

const init = async () => {
    router.createRoutes(server, configuration);
    await server.start();
}
init();