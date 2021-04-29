import IRoute from "../model/route/IRoute";
import IFactoryAdapter from "./IFactoryAdapter";

export default class SwaggerAdapter implements IFactoryAdapter {
	createRoutes(request: any): IRoute[] {
		try {
			const routes = [];
			for (const [endpoint, content] of Object.entries(request.paths)) {
				const path = endpoint.split('?')[0] ?? endpoint;
				const method = Object.getOwnPropertyNames(content)[0];
				const description = content[method].summary;
				const status = parseInt(Object.getOwnPropertyNames(content[method].responses)[0])

				const rawResponseLink = content[method].responses[status].schema['$ref'];
				const responseLink = this.extractLink(rawResponseLink);
				const responseBody = this.extractBody(responseLink, request);

				routes.push({
					path: path,
					method: method.toUpperCase(),
					description: description,
					response: responseBody,
					status: status,
					isActive: true
				});
			}
			return routes;
		} catch (_: any) {
			return;
        }
    }

	createRoute(_: any): IRoute {
		return;
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