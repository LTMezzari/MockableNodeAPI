import Configuration from "../configurator/Configuration";

import IRouteExtractor from "./IRouteExtractor";
import IFactoryAdapter from "../adapter/IFactoryAdapter";
import IRoute from "../model/route/IRoute";

import sendRequest from '../utils/RequestUtils';

export class Extractor {
	extractRoutes(request: any): IRoute[] {
		const routes = [];
		for (const [endpoint, content] of Object.entries(request.paths)) {
			routes.push(this.extractRoute(endpoint, content, request));
		}
		return routes;
	}

	extractRoute(endpoint: string, content: any, request: any) {
		const path = endpoint.split('?')[0] ?? endpoint;
		const method = Object.getOwnPropertyNames(content)[0];
		const description = content[method].summary;
		const status = parseInt(Object.getOwnPropertyNames(content[method].responses)[0])

		const queries = [];
		let body = undefined;
		for (const param of content[method].parameters ?? []) {
			if (param.in === 'body') {
				if (!param.schema || !param.schema['$ref']) {
					body = this.createDummy(param, request);
					continue;
				}

				const rawBodyLink = param.schema['$ref'];
				const bodyLink = this.extractLink(rawBodyLink);
				body = this.extractBody(bodyLink, request);
				continue;
			}

			if (param.in !== 'query') {
				continue;
			}

			queries.push({
				name: param.name,
				value: this.createDummy(param, request)
			});
        }

		const rawResponseLink = content[method].responses[status].schema['$ref'];
		const responseLink = this.extractLink(rawResponseLink);
		const responseBody = this.extractBody(responseLink, request);

		return {
			path: path,
			method: method.toUpperCase(),
			description: description,
			response: responseBody,
			status: status,
			isActive: true,
			logs: [],
			queries,
			body,
		};
    }

	extractLink(value) {
		return value.split('/')[value.split('/').length - 1];
	}

	extractBody(link: string, response: any) {
		return this.createDummy(response.definitions[link], response);
	}

	createDummy(body: any, response: any) {
		switch (body.type) {
			case 'string':
				return 'string';
			case 'boolean':
				return true;
			case 'date-time':
				return new Date().toString();
			case 'integer':
				return 0;
			case 'number':
				return 0.0;
			case 'array':
				const ref = body.items['$ref'];
				if (ref) {
					return [this.extractBody(this.extractLink(ref), response)];
				}
				return [this.createDummy(body.items, response)];
			case 'object':
				const result = {};
				const properties = body.properties;
				if (!properties) {
					return {};
				}
				for (const [name, content] of Object.entries(body.properties)) {
					const ref = content['$ref'];
					if (ref) {
						result[name] = this.extractBody(this.extractLink(ref), response);
						continue;
					}
					result[name] = this.createDummy(content, response);
				}
				return result;
			default:
				return undefined;
		}
	}
}

export class SwaggerAdapter implements IFactoryAdapter {
	createRoutes(request: any): IRoute[] {
		try {
			const extractor = new Extractor();
			return extractor.extractRoutes(request);
		} catch (_: any) {
			return;
		}
	}

	createRoute(_: any): IRoute {
		return;
	}
}

export default class SwaggerExtractor implements IRouteExtractor {
    routeExtractor(server: any, configuration: Configuration) {
        configuration.factory.adapters.push(new SwaggerAdapter());
        server.route({
            path: '/ws/extract/swagger',
            method: 'POST',
            handler: async (request: any, reply: any) => {
                try {
                    const response = await this.getSwaggerData(request);
                    const routes = configuration.factory.createRoutes(response);
                    configuration.repository.addRoutes(routes);
                    configuration.handler.registerRoutes(server, routes, configuration.repository, configuration.authenticator)
                    return reply.response({
                        code: 201,
                        message: `${routes.length} Routes Created`,
                        data: routes,
                    }).code(201);
                } catch (error: any) {
                    console.error(error.message);
                    return reply.response({
                        code: 400,
                        error: error.message
                    }).code(400);
                }

            }
        });
    }

    async getSwaggerData(request: any) {
        const url = request.payload.url;
        const hostname = url.split('https://')[1].split('/')[0];
        const path = url.split(`https://${hostname}`)[1];
        const stringResponse = await sendRequest({
            hostname: hostname,
            path: path,
            method: 'GET'
        });
        return JSON.parse(stringResponse);
    }
}