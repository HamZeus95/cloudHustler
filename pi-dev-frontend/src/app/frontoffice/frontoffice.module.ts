import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { MarketComponent } from './pages/market/market.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FactureClientComponent } from './pages/livraison/facture-client/facture-client.component';
import { LivraisonClientComponent } from './pages/livraison/livraison-client/livraison-client.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { DialogModule } from 'primeng/dialog';
import { LivraisonClientdetailsComponent } from './pages/livraison/livraison-clientdetails/livraison-clientdetails.component';
import { FactureClientdetailsComponent } from './pages/livraison/facture-clientdetails/facture-clientdetails.component';

import { MapComponent } from './pages/livraison/map/map.component';
import { LivraisondriverComponent } from './pages/livraison/livraisondriver/livraisondriver.component';


@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    AboutComponent,
    BlogComponent,
    ContactComponent,
    EventComponent,
    HomeComponent,
    JobsComponent,
    MarketComponent,
    NotFoundComponent,
    FactureClientComponent,
    LivraisonClientComponent,
    LivraisonClientdetailsComponent,
    FactureClientdetailsComponent,
    LivraisonClientdetailsComponent,

    MapComponent,
      LivraisondriverComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    FrontofficeRoutingModule,
    RouterModule,
    DialogModule,
    NgChartsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: []
})
export class FrontofficeModule { }
