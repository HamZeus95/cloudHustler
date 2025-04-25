import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { BillingComponent } from './components/billing/billing.component';
import { TablesComponent } from './components/tables/tables.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { FarmDetailsComponent } from './components/farm-details/farm-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { DashboardCardsComponent } from './components/dashboard-cards/dashboard-cards.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { EventComponent } from './pages/event/event.component';
import { FarmManagmentComponent } from './pages/farm-managment/farm-managment.component';
import { FarmTableComponent } from './components/farm-table/farm-table.component';
import { BlogManagmentComponent } from './pages/blog-managment/blog-managment.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MarketplaceManagementComponent } from './pages/marketplace-management/marketplace-management.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductslistComponent } from './components/productslist/productslist.component';
import { ProductCategorieslistComponent } from './components/product-categorieslist/product-categorieslist.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { TopSellingProductsComponent } from './components/top-selling-products/top-selling-products.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    //declarations of components
    FarmDetailsComponent,
    SideBarComponent,
    BillingComponent,
    TablesComponent,
    TaskManagementComponent,
    DashboardCardsComponent,
    NavbarComponent,
    SettingsPanelComponent,
    FarmTableComponent,
    //declarations of pages
    FarmManagmentComponent,
    EventComponent,
    BlogManagmentComponent,
    MarketplaceManagementComponent,
    ProductslistComponent,
    ProductCategorieslistComponent,
    OrderListComponent,
    TopSellingProductsComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    HttpClientModule,
    NgChartsModule
    
  ]
  //styles



})
export class BackofficeModule { }
