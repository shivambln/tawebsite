import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import { map } from 'rxjs/operators';
// import { flatMap, switchMap } from 'rxjs/operators';
// import { catchError} from 'rxjs/operators';
// import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';

import 'rxjs/add/operator/catch';
import 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(public http: HttpClient) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('login') > 0) {
            console.log('login interceptor');
            return next.handle(req);
        } else {
          // const token = localStorage.getItem('jwttoken');

        //    if (token) {
            req = req.clone({ setHeaders: { Authorization: localStorage.getItem('jwtToken') } });
            console.log(req);
            // }
          //  const token = localStorage.getItem('jwtToken');

            return next.handle(req).catch(err => {
                console.log(err);
                if (err.status === 401) {
                    if (err.error.message === 'refreshToken') {
                        // Genrate params for token refreshing
                        const params = localStorage.getItem('objectid');


                        return this.http.post('api/userjwt/' + params, '').flatMap(
                            (data: any) => {
                                // If reload successful update tokens
                                if (data.status === '200') {

                                    localStorage.setItem('jwtToken', data.Token);
                                    // Clone our fieled request ant try to resend it
                                    req = req.clone({ setHeaders: { Authorization: localStorage.getItem('jwtToken') } });
                                    return next.handle(req).catch(error => {
                                        return Observable.throw(error);
                                    });

                                } else {
                                    // Logout from account
                                }
                            }
                        );
                    } else {
                        // Logout from account or do some other stuff
                    }
                }
                return Observable.throw(err);
            });


        }// else

    }
}
