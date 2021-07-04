import ILog from "../ILog";
import IValidation from "../IValidation";
import IRoute from "./IRoute";

export default abstract class BaseRoute implements IRoute {
    path: string;
    method: string;
    name?: string;
    status?: number;
    response?: any;
    description?: string;
    queries?: any[];
    body?: any;
    timeOut?: number;
    authentication?: boolean = false;
    logs: ILog[] = [];
    validation?: IValidation;

    constructor(path: string, method: string, name?: string, description?: string, queries?: any[], response?: any, body?: any, status?: number, authentication?: boolean, timeOut?: number, validation?: any) {
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
    }
}