import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { User } from './models/user';
import { HandlerService } from '../app/handler.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	public cachedHeaders?: HttpHeaders;
	public registerUrl = 'http://localhost:3000/api/user';
	public loginUrl = 'http://localhost:3000/api/user/login';
	public authLink = 'http://localhost:3000/api/user/current';
	public localUserId: any;
	public localUserToken: any;
	public localUserEmail: any;
	public isLoggedIn: boolean;

	constructor(private http: HttpClient, private handler: HandlerService) {}

	public getHeaders(fresh: boolean = false): HttpHeaders {
		// Create headers

		if (this.localUserToken) {
			this.cachedHeaders = new HttpHeaders({
				'Content-Type': 'application/json'
			}).set('Authorization', 'Token ' + this.localUserToken);
			//.set('User', 'id' + this.localUserId);
		} else {
			this.cachedHeaders = new HttpHeaders({
				'Content-Type': 'application/json'
			});
		}

		return this.cachedHeaders;
	}

	public getToken() {
		if (localStorage.length == 0) {
			return false;
		} else {
			this.localUserToken = localStorage.getItem('token');
			// this.localUserId = localStorage.getItem('id');
			return true;
		}
	}

	public post(user: User): Observable<Object> {
		this.handler.showLoader();

		return this.http.post(this.registerUrl, user).pipe(
			tap((result) => {
				this.handler.log('AuthService', `POST user`, {
					body: user,
					result: result
				});
				this.handler.hideLoader();
			}),
			catchError(this.handler.error<User>('AuthService::post'))
		);
	}

	public login(user: any): Observable<Object> {
		this.handler.showLoader();

		return this.http.post(this.loginUrl, user).pipe(
			tap((result) => {
				this.handler.log('AuthService', `POST user`, {
					body: user,
					result: result
				});

				localStorage.setItem('id', result['user']._id);
				localStorage.setItem('token', result['user'].token);
				localStorage.setItem('email', result['user'].email);

				this.localUserToken = localStorage.getItem('token');

				/*	localStorage.setItem(
					'currentUser',
					JSON.stringify({ token: result['user'].token, id: result['user']._id })
				); */

				this.handler.hideLoader();
			}),
			catchError(this.handler.error<User>('AuthService::post'))
		);
	}
}
