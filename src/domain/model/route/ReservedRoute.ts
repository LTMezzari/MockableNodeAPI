import IRoute from './IRoute';
import { Schema, Document, model } from 'mongoose';
import IValidation from '../IValidation';
import ILog from '../ILog';

export default class ReservedRoute implements IRoute {
    id: string;
    owner: string;
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


    constructor(data: any) {
        this.id = data.id;
        this.path = data.path;
        this.method = data.method;
        this.name = data.name;
        this.description = data.description;
        this.queries = data.queries;
        this.response = data.response;
        this.body = data.body;
        this.status = data.status ?? 200;
        this.authentication = data.authentication ?? false;
        this.timeOut = data.timeOut;
        this.validation = data.validation;
        this.owner = data.owner;
        this.logs = data.logs ?? [];
    }
}

const schema = new Schema<ReservedRoute>({
    owner: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    queries: [{
        type: Map,
        required: false,
    }],
    response: {
        type: Object,
        required: false,
    },
    body: {
        type: Object,
        required: false,
    },
    status: {
        type: Number,
        required: true,
    },
    authentication: {
        type: Boolean,
        required: false,
    },
    timeOut: {
        type: Number,
        required: false,
    },
    validation: {
        type: Object,
        required: false,
    },
    logs: [{
        type: Object,
        required: false,
    }]
});

export const RouteSchema = model<ReservedRoute>('Route', schema);