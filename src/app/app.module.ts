import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from "@angular/forms";

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { HeaderComponent } from './header/header.component';
import { ContextMenuComponent } from './maps/context-menu/context-menu.component';
import { RestAdapterService } from "./services/rest/rest-adapter.service";
import { CoordinatesComponent } from './maps/coordinates/coordinates.component';
import { MarkersPopupComponent } from './maps/markers-popup/markers-popup.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToasterModule} from "angular2-toaster";
import {DistributionService} from "./services/distribution/distribution.service";
import { NavigatorComponent } from './header/navigator/navigator.component';
import {CoordinatesService} from "./services/coordinates/coordinates.service";
import {WindowService} from "./services/window/window.service";
import { CheckboxGroupComponent } from './header/navigator/checkbox-group/checkbox-group.component';

@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    HeaderComponent,
    ContextMenuComponent,
    CoordinatesComponent,
    MarkersPopupComponent,
    NavigatorComponent,
    CheckboxGroupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToasterModule.forRoot()
  ],
  providers: [
    RestAdapterService,
    DistributionService,
    CoordinatesService,
    WindowService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
