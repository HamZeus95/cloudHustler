import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Assurez-vous que ceci est importé
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceeComponent } from './servicee/servicee.component';
import { ServiceRequestsComponent } from './service-requests/service-requests.component';
import { ServiceeService } from './services/servicee.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServiceRequestsService } from './services/service-requests.service';

@NgModule({
  declarations: [
    AppComponent,
    ServiceeComponent,
    ServiceRequestsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    HttpClientModule// Ajoutez FormsModule ici

  ],
  providers: [ServiceeService,ServiceRequestsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
