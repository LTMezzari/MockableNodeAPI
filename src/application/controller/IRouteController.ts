export default interface IRouteController {
    postRoute: (server: any, request: any, reply: any) => void;

    getRoutes: (request: any, reply: any) => void;

    getRoute: (request: any, reply: any) => void;

    putRoute: (request: any, reply: any) => void;

    deleteRoute: (request: any, reply: any) => void;

    getServerLogs: (request: any, reply: any) => void;
}