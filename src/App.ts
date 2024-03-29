import * as Hapi from '@hapi/hapi';

import Configuration, { Builder } from './configurator/Configuration';
import IRouteController from './application/controller/IRouteController';
import IApplicationRouter from './application/router/IApplicationRouter';

import RouteController from './application/controller/RouteController';
import PostmanConverter from './application/converter/PostmanConverter';
import SwaggerExtractor from './application/extractor/SwaggerExtractor';
import ApplicationRouter from './application/router/ApplicationRouter';
import PostmanExtractor from './application/extractor/PostmanExtractor';
import JoyRouteValidator from './application/validator/JoiRouteValidator';

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
    .setValidator(new JoyRouteValidator())
    .build();

const controller: IRouteController = new RouteController(configuration);
const router: IApplicationRouter = new ApplicationRouter(controller);

const init = async () => {
    router.createRoutes(server, configuration);
    await server.start();
}
init();