import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class authenticationInterceptor {
    constructor() {
        console.log("interceptor");
    }
}