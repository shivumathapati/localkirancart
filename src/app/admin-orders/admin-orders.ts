import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { ProductService } from '../service/products';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule, AsyncPipe, DatePipe, CurrencyPipe, MatCardModule, MatButtonModule, MatExpansionModule, MatCheckboxModule, FormsModule],
    templateUrl: './admin-orders.html',
    styleUrl: './admin-orders.css'
})
export class AdminOrders {
    productService = inject(ProductService);

    // Fetch all orders
    orders$ = this.productService.getOrders();

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
