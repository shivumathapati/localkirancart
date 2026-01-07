import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { map } from 'rxjs/operators';
import { ProductService } from '../service/products';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule, AsyncPipe, DatePipe, CurrencyPipe, MatCardModule, MatButtonModule, MatExpansionModule, MatCheckboxModule, FormsModule, MatTabsModule],
    templateUrl: './admin-orders.html',
    styleUrl: './admin-orders.css'
})
export class AdminOrders {
    productService = inject(ProductService);

    // Fetch all orders and sort by date desc
    orders$ = this.productService.getOrders().pipe(
        map(orders => {
            return orders.map(order => {
                let date: Date;
                if (order.createdAt && typeof order.createdAt.toDate === 'function') {
                    date = order.createdAt.toDate();
                } else {
                    date = new Date(order.createdAt);
                }
                return { ...order, createdAt: date };
            }).sort((a, b) => {
                if (a.status == "pending") {
                    return a.createdAt.getTime() - b.createdAt.getTime(); // Newest first
                }
                return b.createdAt.getTime() - a.createdAt.getTime(); // Newest first

            });
        })
    );

    getOrdersByStatus(orders: any[], status: string): any[] {
        if (!orders) return [];
        return orders.filter(o => o.status === status);
    }

    async updateStatus(orderId: string, status: string) {
        if (confirm(`Update status to ${status}?`)) {
            await this.productService.updateOrderStatus(orderId, status);
            alert('Order Updated');
        }
    }

    async toggleItemAvailability(order: any, itemIndex: number, currentStatus: boolean | undefined) {
        // If availability is undefined, assume available (true). Toggle means false.
        // Actually simplicity: Let's have a checkbox 'Unavailable'.
        const items = [...order.items];
        items[itemIndex].unavailable = !items[itemIndex].unavailable; // Toggle

        await this.productService.updateOrderItems(order.id, items);
    }
}
