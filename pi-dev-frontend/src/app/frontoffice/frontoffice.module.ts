import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EventComponent } from './components/event/event.component';
import { HttpClient } from '@angular/common/http';
import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AboutComponent,
    HomeComponent,
    NotFoundComponent,
    FooterComponent,
    NavbarComponent,
    EventComponent
  ],
  imports: [
    CommonModule,
    FrontofficeRoutingModule,
    FormsModule,        // Required for Template-Driven Forms (ngModel)
    ReactiveFormsModule
  ]
})
export class FrontofficeModule { }
