import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
// tslint:disable: indent
import { Observable } from 'rxjs';
import { HandlerService } from './handler.service';
import { AuthService } from '../app/auth.service';
import { Pokemon } from './models/pokemon';
@Injectable({
	providedIn: 'root'
})
export class PokemonService {
	// Put the url to server/tables here
	private allUrl = 'http://localhost:3000/api/pokemon/all';
	private singleUrl = 'http://localhost:3000/api/pokemon/';
	private generationUrl = 'http://localhost:3000/api/pokemon/generation/';

	constructor(private http: HttpClient, public handler: HandlerService, public authService: AuthService) {}

	// crud operations

	public post(musicType): Observable<Object> {
		return this.http.post(this.allUrl, musicType).pipe(
			tap((result) => {
				this.handler.log('UserService', `POST user`, {
					body: musicType,
					result: result
				});
			}),
			catchError(this.handler.error<any>('UserService::post'))
		);
	}

	public getAllPokemon(params: any): Observable<any> {
		return this.http
			.get<any>(this.allUrl, {
				headers: this.authService.getHeaders()
			})
			.pipe(
				map((results) => {
					this.handler.log('PokemonService', 'GET pokemon', {
						results: results
					});

					// Array-ify
					if (!(results instanceof Array)) {
						results = [ results ];
					}

					return results;
				}),
				catchError(this.handler.error<any>('PokemonService::getAllPokemon'))
			);
	}

	public getPokemon(pokemon: Pokemon): Observable<any> {
		return this.http
			.get<any>(this.singleUrl + pokemon, {
				headers: this.authService.getHeaders()
			})
			.pipe(
				map((results) => {
					this.handler.log('PokemonService', 'GET single pokemon', {
						results: results
					});

					return results;
				}),
				catchError(this.handler.error<any>('PokemonService::getSinglePokemon'))
			);
	}

	public getByGeneration(generation: String): Observable<any> {
		return this.http
			.get<any>(this.generationUrl + generation, {
				headers: this.authService.getHeaders()
			})
			.pipe(
				map((results) => {
					this.handler.log('PokemonService', 'GET by generation', {
						results: results
					});

					return results;
				}),
				catchError(this.handler.error<any>('PokemonService::getByGeneration'))
			);
	}
}
