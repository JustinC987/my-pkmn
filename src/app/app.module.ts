import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatDialogModule,
	MatDividerModule,
	MatCardModule,
	MatSlideToggleModule,
	MatProgressSpinnerModule,
	MatProgressBarModule,
	MatFormFieldModule,
	MatInputModule,
	MatTooltipModule,
	MatIconModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatCheckboxModule,
	MatMenuModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

@NgModule({
	declarations: [ AppComponent, HeaderComponent, HomeComponent, FooterComponent ],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MatDialogModule,
		MatDividerModule,
		MatCardModule,
		MatSlideToggleModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatFormFieldModule,
		MatInputModule,
		MatTooltipModule,
		MatIconModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatMenuModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
