import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConfigProvider } from '../config/config';
import { Md5 } from 'ts-md5';


@Injectable()
export class AuthProvider implements HttpInterceptor {
  consumerKeyEncript: any;
  consumerSecretEncript: any;

  constructor(
    public config: ConfigProvider,
    public md5: Md5,
  ) {
    this.consumerKeyEncript = Md5.hashStr(this.config.consumerKey);
    this.consumerSecretEncript = Md5.hashStr(this.config.consumerSecret);
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let d = new Date();

    request = request.clone({
      setHeaders: {
        'consumer-key': this.consumerKeyEncript,
        'consumer-secret': this.consumerSecretEncript,
        'consumer-nonce': d.getTime().toString(),
        'consumer-device-id': 'device id of the app',
       // 'Content-Type': 'text/plain'
      }
    });
    //console.log(request);
    return next.handle(request);
  }
}
