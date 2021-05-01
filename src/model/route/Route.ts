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
        needsAuthentication: boolean = false,
        timeOut?: number
    ) {
        super(path, method, description, queries, response, body, status, needsAuthentication, timeOut);
        this.id = id;
    }
}