import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../models/pokemon';
import { DomSanitizer } from '@angular/platform-browser';
import { gen1Array } from '../../assets/gen1-array';
import { gen2Array } from 'src/assets/gen2-array';
import { gen3Array } from 'src/assets/gen3-array';
import { gen4Array } from 'src/assets/gen4-array';
import { gen5Array } from 'src/assets/gen5-array';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
	public searchForm: FormGroup;
	public hasSubmit: boolean;
	public pokemon?: Pokemon[] = [];
	public pkmn: Pokemon;
	public dataSource;
	public pokemonObj = { pokemon: 'Add Pokemon by clicking the view icon by their sprite', sprite: '' };
	public pokemonSprites = [];
	public pokemonArray = [];
	public newArray = [];
	public pkmnObj = {};
	public generation: String;
	public pokemonType = [];

	public displayedColumns: string[] = [ 'sprite', 'name' ];
	selection = new SelectionModel<any>(true, []);

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private formBuilder: FormBuilder, public pokemonService: PokemonService, private dom: DomSanitizer) {}

	ngOnInit() {
		this.createSearchForm();
		this.getPokemonDefault();
	}

	createSearchForm() {
		this.searchForm = this.formBuilder.group({
			search: [ '', [ Validators.required ] ]
		});
	}

	getPokemonDefault() {
		this.pokemonService.getByGeneration('gen1').subscribe((result) => {
			this.pokemon = result.results;
			this.pokemon.forEach((pkmn, i) => {
				this.pkmnObj = { name: pkmn.name, sprite: gen1Array[i].sprite };
				this.pokemonArray.push(this.pkmnObj);
			});
			this.dataSource = new MatTableDataSource(this.pokemonArray);
		});
	}

	getByGen(event) {
		this.pokemonArray = [];
		let spriteArray = [];
		this.pkmnObj = {};
		this.generation = event.target.dataset.gen;

		if (this.generation == 'gen1') {
			spriteArray = gen1Array;
		}
		if (this.generation == 'gen2') {
			spriteArray = gen2Array;
		}

		if (this.generation == 'gen3') {
			spriteArray = gen3Array;
		}

		if (this.generation == 'gen4') {
			spriteArray = gen4Array;
		}

		if (this.generation == 'gen5') {
			spriteArray = gen5Array;
		}

		this.pokemonService.getByGeneration(this.generation).subscribe((result) => {
			this.pokemon = result.results;
			this.pokemon.forEach((pkmn, i) => {
				this.pkmnObj = { name: pkmn.name, sprite: spriteArray[i].sprite };
				this.pokemonArray.push(this.pkmnObj);
			});
			console.log('Array : ', this.pokemonArray);
			this.dataSource = new MatTableDataSource(this.pokemonArray);
		});
	}

	displayPokemonDetail(pokemon, sprite) {
		this.pokemonType = [];
		this.pokemonService.getPokemon(pokemon).subscribe((result) => {
			this.pkmn = result;
			this.pkmn.sprite = sprite;
			this.pkmn[0].type.forEach((pkmnType) => {
				this.pokemonType.push(pkmnType.type.name);
			});
			console.log('pokemon: ', this.pkmn);
		});
	}

	searchSinglePokemon() {
		const formData = this.searchForm.getRawValue();

		this.pokemonService.getPokemon(formData).subscribe((result) => {
			console.log('search Pokemon: ', result);
		});
	}

	validateField(fieldName: string) {
		const field = this.searchForm.get(fieldName);

		return this.hasSubmit && field && field.invalid && (field.dirty || field.touched);
	}

	check(fieldName: string, validator: string) {
		return this.searchForm.get(fieldName)['errors'][validator];
	}

	/*
	* Mat-Table
	*/

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		if (this.dataSource) {
			const numSelected = this.selection.selected.length;
			const numRows = this.dataSource.data.length;
			return numSelected === numRows;
		}
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		if (this.dataSource) {
			this.isAllSelected()
				? this.selection.clear()
				: this.dataSource.data.forEach((row) => this.selection.select(row));
		}
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: Pokemon): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
	}
}
