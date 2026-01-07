import { Injectable, inject } from '@angular/core';
import { ProductService } from './products';
import { AuthService } from './auth.service';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private productService = inject(ProductService);
    private authService = inject(AuthService);

    // Admin: Count of all pending orders
    adminPendingCount$: Observable<number> = this.productService.getOrders().pipe(
        map(orders => orders.filter(o => o.status === 'pending').length)
    );

    // User: Count of active orders (not delivered)
    userActiveCount$: Observable<number> = this.authService.user$.pipe(
        switchMap(user => {
            if (!user || notUserEmail(user)) return of(0);
            return this.productService.getUserOrders(user.email!).pipe(
                map(orders => orders.filter(o => o.status !== 'delivered').length)
            );
        })
    );
}

function notUserEmail(user: any): boolean {
    return !user || !user.email;
}
