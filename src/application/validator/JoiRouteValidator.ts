import * as Joi from 'joi';
import IValidation from '../../domain/model/IValidation';
import IRoute from '../../domain/model/route/IRoute';
import IRouteValidator from './IRouteValidator';

export default class JoyRouteValidator implements IRouteValidator {
    isRouteValid(request: any, route: IRoute) {
        if (!route.validation) {
            return true;
        }
        return this.validateRequest(request, route.validation);
    }

    private validateRequest(request: any, validation: IValidation): boolean {
        return this.validateHeaders(request, validation)
            && this.validateParams(request, validation)
            && this.validateQuery(request, validation)
            && this.validatePayload(request, validation);
    }

    private validateHeaders(request: any, validation: IValidation): boolean {
        if (!validation.headers) {
            return true;
        }

        const schema = this.createSchema(validation.headers).unknown();
        return this.validateSchema(schema, request.headers);
    }

    private validateParams(request: any, validation: IValidation): boolean {
        if (!validation.params) {
            return true;
        }

        const schema = this.createSchema(validation.params);
        return this.validateSchema(schema, request.params);
    }

    private validateQuery(request: any, validation: IValidation): boolean {
        if (!validation.query) {
            return true;
        }

        const schema = this.createSchema(validation.query);
        return this.validateSchema(schema, request.query);
    }

    private validatePayload(request: any, validation: IValidation): boolean {
        if (!validation.payload) {
            return true;
        }

        const schema = this.createSchema(validation.payload);
        return this.validateSchema(schema, request.payload);
    }

    private validateSchema(schema: any, data: any): boolean {
        const { error } = schema.validate(data);
        if (error) {
            throw Error(error);
        }
        return true
    }

    private createSchema(data: any): any {
        const schema = {};
        for (const [key, content] of Object.entries(data)) {
            schema[key] = this.executeMethods(content, Joi);
        }
        return Joi.object(schema);
    }

    private executeMethods(data: any, property: any): any | undefined {
        if (!data || !property) {
            return property;
        }
        let result = null;
        for (const [key, content] of Object.entries(data)) {
            result = this.executeMethod(key, content, property) ?? result;
        }
        return result;
    }

    private executeMethod(key: string, content: any, property: any): any | undefined {
        if (key === 'value') {
            return property;
        }

        if (key === 'object') {
            return this.createSchema(content);
        }

        if (typeof property[key] === 'function') {
            if (!content || (typeof content === 'object' && !Array.isArray(content) && !content.value)) {
                const result = property[key]();
                return this.executeMethods(content, result);
            }

            if (typeof content === 'object') {
                if (Array.isArray(content) || Array.isArray(content.value)) {
                    const args = content.value || content;
                    const result = property[key](...args);
                    return this.executeMethods(content, result);
                }

                const result = this.safeExecute(key, content.value, property, () => property[key](content.value));
                return this.executeMethods(content, result);
            }
            return this.safeExecute(key, content.value, property, () => property[key](content));
        }
    }

    private safeExecute(key: string, content: any, property: any, block: () => any): any {
        if (key === 'pattern') {
            return property[key](new RegExp(content))
        }
        if (key === 'required') {
            return property[key]()
        }
        if (key === 'optional') {
            return property[key]()
        }
        return block();
    }
}