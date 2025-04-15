import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MarketComponent } from './market/market.component';
import { BlogComponent } from './blog/blog.component';
import { EventComponent } from './event/event.component';
import { JobsComponent } from './jobs/jobs.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardModule } from './dashboard/dashboard.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NgChartsModule } from 'ng2-charts';
import { FactureClientComponent } from './livraison/facture-client/facture-client.component';
import { LivraisonClientComponent } from './livraison/livraison-client/livraison-client.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NotFoundComponent,
    MarketComponent,
    BlogComponent,
    EventComponent,
    JobsComponent,
    ContactComponent,
    FactureClientComponent,
    NavbarComponent,
    FooterComponent,
    LivraisonClientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardModule,
    CommonModule,
    RouterModule,
    DialogModule,
    BrowserAnimationsModule,
    NgChartsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permet l'utilisation de composants personnalisés
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}