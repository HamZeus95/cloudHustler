import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Components
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { BannerComponent } from '../components/banner/banner.component'; 
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

// Additional required modules
import { CoreDirectivesModule } from '../../core/directives/directives';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InitialsPipe } from '../../core/pipes/initials.pipe';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    BannerComponent,
    SideBarComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    CoreDirectivesModule
  ],
  exports: [
    AdminLayoutComponent,
    BannerComponent,
    SideBarComponent,
    NavbarComponent
  ],
  providers: [
    InitialsPipe
  ]
})
export class SharedLayoutsModule { }