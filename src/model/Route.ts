import IRoute from './IRoute';

export default class Route extends IRoute {
    id: number;
    active: boolean;

    constructor(id: number, active: boolean, path: string, method: string, description?: string, response?: any, status: number = 200) {
        super(path, method, description, response, status);
        this.id = id;
        this.active = active;
    }

    isActive(): boolean {
        return this.active;
    }
}