import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CoreDirectivesModule } from "../core/directives/directives";
import { EventComponent } from "./components/event/event.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FrontofficeRoutingModule } from "./frontoffice-routing.module";
import { AboutComponent } from "./pages/about/about.component";
import { ForgotPasswordComponent } from "./pages/auth/forgot-password/forgot-password.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { LogoutComponent } from "./pages/auth/logout/logout.component";
import { OtpComponent } from "./pages/auth/otp/otp.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { ResetPasswordComponent } from "./pages/auth/reset-password/reset-password.component";
import { BlogComponent } from "./pages/blog/blog.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { HomeComponent } from "./pages/home/home.component";
import { JobsComponent } from "./pages/jobs/jobs.component";
import { MarketComponent } from "./pages/market/market.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";



@NgModule({
  declarations: [
    AboutComponent,
    HomeComponent,
    NotFoundComponent,
    FooterComponent,
    NavbarComponent,
    EventComponent,
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
    LoginComponent,
    RegisterComponent,
    OtpComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FrontofficeRoutingModule,
    CoreDirectivesModule,
    CommonModule,
    FrontofficeRoutingModule,
    FormsModule,        // Required for Template-Driven Forms (ngModel)
    ReactiveFormsModule
  ]
})
export class FrontofficeModule { }
