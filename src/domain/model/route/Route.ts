import IRoute from './IRoute';

export default class Route extends IRoute {
    id: number;

    constructor(
        id: number,
        path: string,
        method: string,
        description?: string,
        queries?: any[],
        response?: any,
        body?: any,
        status: number = 200,
        authentication: any = false,
        timeOut?: number,
        validation?: any
    ) {
        super(path, method, description, queries, response, body, status, authentication, timeOut, validation);
        this.id = id;
    }
}