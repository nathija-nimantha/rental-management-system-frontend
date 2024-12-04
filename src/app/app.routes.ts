import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ManageCustomersComponent } from './pages/manage-customers/manage-customers.component';
import { ManageItemsComponent } from './pages/manage-items/manage-items.component';
import { ManageRentalsComponent } from './pages/manage-rentals/manage-rentals.component';
import { RentalBillComponent } from './pages/rental-bill/rental-bill.component';

export const routes: Routes = [
  {
    path: "",
    component: HomePageComponent
  },
  {
    path: "customers",
    component: ManageCustomersComponent
  },
  {
    path: "items",
    component: ManageItemsComponent
  },
  {
    path: "rentals",
    component: ManageRentalsComponent
  },
  {
    path: 'rental-bill',
    component: RentalBillComponent },
];
