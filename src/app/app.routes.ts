import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { Checkout } from './checkout/checkout';
import { AdminOrders } from './admin-orders/admin-orders';
import { MyOrders } from './my-orders/my-orders';

export const routes: Routes = [{
    path: '', component: Login
}, {
    path: 'dashboard', component: Dashboard, canActivate: [authGuard]
}, {
    path: 'checkout', component: Checkout, canActivate: [authGuard]
}, {
    path: 'admin/orders', component: AdminOrders, canActivate: [authGuard, adminGuard]
}, {
    path: 'my-orders', component: MyOrders, canActivate: [authGuard]
},




];
