import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgChartsModule } from "ng2-charts";
import { DialogModule } from "primeng/dialog";
import { AppRoutingModule } from "./app-routing.module";
import { JwtModule } from "@auth0/angular-jwt";
import { AppComponent } from "./app.component";
import { JwtInterceptor } from "./auth/interceptors/jwt";
import { OAuth2RedirectComponent } from "./auth/oauth2/oauth2-redirect.component";
import { TokenStorageService, AuthService } from "./auth/service";
import { FrontofficeModule } from "./frontoffice/frontoffice.module";
import { ErrorDialogComponent } from "./core/error-dialog/error-dialog.component";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackofficeModule } from './backoffice/backoffice.module';
import { Oauth2RestrictedComponent } from './core/oauth2-restricted/oauth2-restricted.component';


@NgModule({
  declarations: [
    AppComponent,
    OAuth2RedirectComponent,
    ErrorDialogComponent,
    Oauth2RestrictedComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    FrontofficeModule,
    BackofficeModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    NgChartsModule,
    DialogModule,
    MatDialogModule,
    MatSnackBarModule,
    //from marketplace
    FormsModule,
    RouterModule,
    FrontofficeModule,
    BackofficeModule,
    NgChartsModule,
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
