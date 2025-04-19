import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrontofficeModule } from './frontoffice/frontoffice.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';

import { JwtInterceptor } from './auth/interceptors/jwt';
import { TokenStorageService } from './auth/service/token-storage.service';
import { AuthService } from './auth/service/authentication.service';

 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    FrontofficeModule,
    BackofficeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => { return null; },
        allowedDomains: ["localhost:4200"],
        disallowedRoutes: [
          "/api/v1/auth/authenticate",
          "/api/v1/auth/register",
          "/api/v1/auth/refresh-token",
          "/api/v1/auth/logout",
          "/api/v1/auth/validate-session"
        ]
      }
    })
  ],
  providers: [
    TokenStorageService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
