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

// Token getter function for JWT module
export function tokenGetter() {
  return localStorage.getItem('auth-token');
}

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
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200"],
        disallowedRoutes: [
          "localhost:4200/api/v1/auth/authenticate",
          "localhost:4200/api/v1/auth/register",
          "localhost:4200/api/v1/auth/refresh-token",
          "localhost:4200/api/v1/auth/logout",
          "localhost:4200/api/v1/auth/validate-session"
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
