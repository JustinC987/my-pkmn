import { PLATFORM_ID, Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class HandlerService {
	public hasError = false;
	public isBrowser: boolean;
	public isLoading = of(false);
	public nLoading = 0;
	public isBackgroundLoading = of(true);
	public nBackgroundLoading = 0;
	public hasSuccess = of(false);

	constructor() {}

	public log(service: string, message: string = 'failed', result?) {
		if (result) {
			console.log(`[${service}] ${message}`, result);
		} else {
			console.log(`[${service}] ${message}`);
		}
	}

	/**
	 * HTTP Error handler
	 */
	public error<T>(service: string, operation = 'Operation', result?: T) {
		return (error: any): Observable<T> => {
			// Print message to log
			// this.log(service, `${operation} failed: ${error.message}`);
			// console.error(error);

			// Error log
			// console.error(error);

			if (
				error.status === 400 || // Bad request
				error.status === 401 || // Unauthorized
				error.status === 402 || // Payment req'd
				error.status === 403 || // Forbidden
				error.status === 408 || // Timeout
				error.status === 409 || // Conflict
				error.status === 410 || // Gone
				error.status === 429 // Rate-limit
			) {
				return of(error);
			}

			if (!this.hasError) {
				this.hasError = true;

				const errorType = error.status === 0 || error.status === 408 ? 'timeout' : 'error';

				// alert('Error');

				this.hideBackgroundLoader();
			}

			// Let the app keep running by returning an empty result.
			this.hideBackgroundLoader();

			return of(result as T);
		};
	}

	public setIsLoading(value: boolean, delay?): void {
		setTimeout(() => {
			this.isLoading = of(value);
		}, delay);
	}

	public setIsBackgroundLoading(value: boolean, delay?): void {
		setTimeout(() => {
			this.isBackgroundLoading = of(value);
		}, delay);
	}

	public setHasSuccess(value: boolean, delay?): void {
		setTimeout(() => {
			this.hasSuccess = of(value);
		}, delay);
	}

	/**
	 * Show loader
	 */
	public showLoader() {
		this.nLoading++;

		if (this.nLoading) {
			this.setIsLoading(true);
		}
	}

	/**
	 * Hide loader
	 */
	public hideLoader(isSuccess = true) {
		if (this.nLoading) {
			this.nLoading--;
		}

		if (!this.nLoading) {
			if (isSuccess) {
				this.setHasSuccess(true);
				this.setHasSuccess(false, 750);
			}
			setTimeout(() => {
				this.setIsLoading(false);
			});
		}
	}

	/**
	 * Show background loader
	 */
	public showBackgroundLoader() {
		this.nBackgroundLoading++;

		if (this.nBackgroundLoading) {
			this.setIsBackgroundLoading(true);
		}
	}

	/**
	 * Hide background loader
	 */
	public hideBackgroundLoader() {
		if (this.nBackgroundLoading) {
			this.nBackgroundLoading--;
		}

		if (!this.nBackgroundLoading) {
			this.setIsBackgroundLoading(false);
		}
	}
}
