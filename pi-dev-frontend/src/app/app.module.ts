import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FactureComponent } from './components/factures/factures.component'; // Ensure this path is correct and the component is exported properly
import { LivraisonComponent } from './components/livraisons/livraisons.component';
import { SuiviLivraisonComponent } from './components/suivilivraisons/suivilivraisons.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CreatefactureComponent } from './components/createfacture/createfacture.component';

@NgModule({
  declarations: [
    AppComponent,
    FactureComponent,
    LivraisonComponent,
    SuiviLivraisonComponent,
    CreatefactureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
