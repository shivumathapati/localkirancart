import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { ProductService } from '../service/products';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-my-orders',
    standalone: true,
    imports: [CommonModule, AsyncPipe, DatePipe, CurrencyPipe, MatCardModule, MatListModule, MatIconModule, MatChipsModule],
    templateUrl: './my-orders.html',
    styleUrl: './my-orders.css'
})
export class MyOrders {
    private productService = inject(ProductService);
    private authService = inject(AuthService);

    orders$: Observable<any[]> = this.authService.user$.pipe(
        switchMap(user => {
            if (user && user.email) {
                return this.productService.getUserOrders(user.email);
            } else {
                return [];
            }
        })
    );
}
