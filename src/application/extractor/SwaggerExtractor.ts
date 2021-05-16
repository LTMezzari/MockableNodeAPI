import Configuration from "../../configurator/Configuration";

import IRouteExtractor from "./IRouteExtractor";
import IRoute from "../../domain/model/route/IRoute";

import sendRequest from '../../utils/RequestUtils';

export const ExtractorRoute: string = '/ws/extract/swagger';

export class Extractor {
	extractRoutes(request: any): IRoute[] {
		const routes = [];
		for (const [endpoint, content] of Object.entries(request.paths)) {
			const path = endpoint.split('?')[0] ?? endpoint;
			for (const [method, data] of Object.entries(content)) {
				routes.push(this.extractRoute(path, method, data, request));
            }
		}
		return routes;
	}

	extractRoute(path: string, method: string, content: any, request: any) {
		const description = content.summary;
		const status = parseInt(Object.getOwnPropertyNames(content.responses)[0])

		const queries = [];
		let body = undefined;
		for (const param of content.parameters ?? []) {
			if (param.in === 'body') {
				if (!param.schema || !param.schema['$ref']) {
					body = this.createDummy(param.schema, request);
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
				key: param.name,
				value: this.createDummy(param, request)
			});
        }

		const rawResponseLink = content.responses[status].schema['$ref'];
		const responseLink = this.extractLink(rawResponseLink);
		const responseBody = this.extractBody(responseLink, request);

		return {
			path: path,
			method: method.toUpperCase(),
			description: description,
			response: responseBody,
			status: status,
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

export default class SwaggerExtractor implements IRouteExtractor {
    routeExtractor(server: any, configuration: Configuration) {
		server.route({
			path: ExtractorRoute,
            method: 'POST',
            handler: async (request: any, reply: any) => {
                try {
					const response = await this.getSwaggerData(request);
					const extractor = new Extractor();
					const routes = extractor.extractRoutes(response);
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
						error: 'Bad Request',
                        message: error.message
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