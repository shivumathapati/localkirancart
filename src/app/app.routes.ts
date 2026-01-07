import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { authGuard } from './guards/auth.guard';
import { Checkout } from './checkout/checkout';

export const routes: Routes = [{
    path: '', component: Login
}, {
    path: 'dashboard', component: Dashboard, canActivate: [authGuard]
}, {
    path: 'checkout', component: Checkout, canActivate: [authGuard]
},




];
