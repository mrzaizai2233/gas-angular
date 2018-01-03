import { ErrorComponent } from './error/error.component';
import { CategoryService } from './service/category.service';
import { AppRouter } from './app.router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { FormsModule ,ReactiveFormsModule}   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRouter,
    HttpModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule
  ],
  providers: [CategoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
