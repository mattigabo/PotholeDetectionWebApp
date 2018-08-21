import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ContextMenuComponent } from './maps/context-menu/context-menu.component';
import { RestAdapterService } from "./rest-adapter.service";
import { CoordinatesComponent } from './maps/coordinates/coordinates.component';
import { MarkersPopupComponent } from './maps/markers-popup/markers-popup.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToasterModule} from "angular2-toaster";

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    FooterComponent,
    HeaderComponent,
    ContextMenuComponent,
    CoordinatesComponent,
    MarkersPopupComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToasterModule.forRoot()
  ],
  providers: [
    RestAdapterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
