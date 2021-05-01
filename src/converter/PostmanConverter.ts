import Configuration from "../configurator/Configuration";
import IRoute from "../model/route/IRoute";
import IRouteRepository from "../repository/IRouteRepository";
import IRouteConverter from "./IRouteConverter";

export const ConverterRoute: string = '/ws/converter/postman';

export default class PostmanConverter implements IRouteConverter {
    routeConverter(server: any, configuration: Configuration) {
        server.route({
            method: 'GET',
            path: ConverterRoute,
            handler: (request: any, reply: any) => {
                try {
                    const name: string | undefined = request.query.name;
                    return reply.response(this.convertRoutes(name, configuration.repository)).code(200);
                } catch (error: any) {
                    console.log(error.message);
                    return reply.response({
                        code: 400,
                        error: 'Bad Request',
                        message: error.message
                    }).code(400);
                }
            }
        })
    }

    convertRoutes(name: string = 'Mocked Collection', repository: IRouteRepository): any {
        return {
            info: {
                name,
                schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
            },
            items: this.extractCollection(repository)
        }
    }

    extractCollection(repository: IRouteRepository): any[] {
        const routes = repository.getRoutes();
        const items = [];
        for (const route of routes) {
            items.push(this.extractItem(route));
        }
        return this.aggroupItems(items);
    }

    aggroupItems(items: any) {
        const aggroupedItems = [];
        for (const item of items) {
            const folder = this.getFolder(item.name, aggroupedItems);
            folder.items.push(item);
        }
        return aggroupedItems;
    }

    getFolder(name: string, list: any[]): any {
        const nextSlash = name.substring(1).indexOf('/');
        const hasSubfolder = nextSlash !== -1;
        const folderName = name.substring(1, !hasSubfolder ? undefined : nextSlash + 1);
        let folder = list.find((f: any) => f.name === folderName);
        if (!folder) {
            folder = { name: folderName, items: [] };
            list.push(folder);
        }
        if (hasSubfolder) {
            return this.getFolder(name.substring(nextSlash + 1), folder.items);
        }
        return folder;
    }

    extractItem(route: IRoute): any {
        const name = route.path;
        const request = this.extractRequest(route);
        return {
            name,
            request: {
                ...request,
                body: this.extractBody(route),
                description: route.description,
            },
            response: [
                {
                    name,
                    originalRequest: request,
                    code: route.status,
                    _postman_previewlanguage: 'json',
                    header: null,
                    cookie: [],
                    body: JSON.stringify(route.response)
                }
            ]
        };
    }

    extractRequest(route: IRoute): any {
        return {
            method: route.method,
            header: [],
            url: this.extractUrl(route),
        };
    }

    extractBody(route: IRoute): any {
        if (!route.body) {
            return undefined;
        }

        return {
            mode: 'raw',
            raw: JSON.stringify(route.body),
            options: {
                raw: {
                    language: 'json'
                }
            }
        };
    }

    extractUrl(route: IRoute): any {
        const HOST = '{{url}}';
        const path = route.path;
        const url = `${HOST}${path}`;
        const splittedUrl = url.split('/');
        const hostname = splittedUrl.splice(0, 1)[0];
        return {
            raw: url,
            host: [
                hostname,
            ],
            path: splittedUrl,
            query: route.queries
        };
    }
}