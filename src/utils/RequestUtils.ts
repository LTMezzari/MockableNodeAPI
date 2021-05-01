import * as https from 'https';

export interface IRequestOptions {
    hostname?: string;
    path?: string;
    body?: any;
    [key: string]: any;
}

export default function sendRequest(options: IRequestOptions): Promise<any> {
    return new Promise((resolve: (value: any) => void, reject: (reason: any) => void) => {
        const request = https.request(options, response => {
            let buffer = '';
            response.on('data', chunk => {
                buffer += chunk;
            });
            response.on('end', chunk => {
                if (response.statusCode < 400) {
                    return resolve(buffer);
                }
                return reject(buffer);
            });
        }).on('error', error => {
            reject(error);
        });
        if (options.body) {
            request.write(options.body);
        }
        request.end();
    });
}