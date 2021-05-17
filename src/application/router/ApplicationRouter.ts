import * as Joi from 'joi';

import Configuration from "../../configurator/Configuration";
import IRouteController from "../controller/IRouteController";
import IApplicationRouter from "./IApplicationRouter";

export const ReservedRoutes = {
    Create: '/ws/route',
    List: '/ws/routes',
    Logs: '/ws/routes/logs',
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
            options: {
                validate: {
                    payload: Joi.object({
                        path: Joi.string().required().pattern(/(^[/].*)/),
                        method: Joi.string().required(),
                        description: Joi.string().optional(),
                        status: Joi.number().optional(),
                        response: Joi.any().optional(),
                        body: Joi.any().optional(),
                        timeOut: Joi.number().optional(),
                        needsAuthentication: Joi.boolean().optional(),
                    }),
                    options: {
                        allowUnknown: true
                    }
                }
            }
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
            options: {
                validate: {
                    params: Joi.object({
                        id: Joi.any().required()
                    }),
                    options: {
                        allowUnknown: true
                    }
                }
            }
        });

        server.route({
            method: 'PUT',
            path: ReservedRoutes.GetUpdateDelete,
            handler: (request: any, reply: any) => this.controller.putRoute(request, reply),
            options: {
                validate: {
                    params: Joi.object({
                        id: Joi.any().required()
                    }),
                    payload: Joi.object({
                        path: Joi.string().required().pattern(/(^[/].*)/),
                        method: Joi.string().required(),
                        description: Joi.string().optional(),
                        status: Joi.number().optional(),
                        response: Joi.any().optional(),
                        body: Joi.any().optional(),
                        timeOut: Joi.number().optional(),
                        authentication: Joi.any().optional(),
                        validation: Joi.any().optional(),
                    }),
                    options: {
                        allowUnknown: true
                    }
                }
            }
        });

        server.route({
            method: 'DELETE',
            path: ReservedRoutes.GetUpdateDelete,
            handler: (request: any, reply: any) => this.controller.deleteRoute(request, reply),
            options: {
                validate: {
                    params: Joi.object({
                        id: Joi.any().required()
                    }),
                    options: {
                        allowUnknown: true
                    }
                }
            }
        });

        server.route({
            method: 'GET',
            path: ReservedRoutes.Logs,
            handler: (request: any, reply: any) => this.controller.getServerLogs(request, reply),
        });

        for (const extractor of configuration.extractors) {
            extractor.routeExtractor(server, configuration);
        }

        for (const converter of configuration.converters) {
            converter.routeConverter(server, configuration);
        }
    }
}