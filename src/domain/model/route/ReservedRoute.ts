import IRoute from './IRoute';

export default class ReservedRoute extends IRoute {
    id: number;
    owner: string;

    constructor(
        id: number,
        owner: string,
        path: string,
        method: string,
        name?: string,
        description?: string,
        queries?: any[],
        response?: any,
        body?: any,
        status: number = 200,
        authentication: any = false,
        timeOut?: number,
        validation?: any
    ) {
        super(path, method, name, description, queries, response, body, status, authentication, timeOut, validation);
        this.id = id;
        this.owner = owner;
    }
}