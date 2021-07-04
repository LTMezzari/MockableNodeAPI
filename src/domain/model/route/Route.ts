import ILog from '../ILog';
import IValidation from '../IValidation';
import BaseRoute from './BaseRoute';

export default class Route extends BaseRoute {
    id: number;
    path: string;
    method: string;
    name?: string;
    status?: number;
    response?: any;
    description?: string;
    queries?: any[];
    body?: any;
    timeOut?: number;
    authentication?: any;
    logs: ILog[];
    validation?: IValidation;

    constructor(
        id: number,
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
        this.path = path;
        this.method = method;
        this.name = name;
        this.description = description;
        this.queries = queries;
        this.response = response;
        this.body = body;
        this.status = status;
        this.authentication = authentication;
        this.timeOut = timeOut;
        this.validation = validation;
        this.id = id;
    }
}