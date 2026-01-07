import { Component, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CartService } from '../service/cart.service';
import { ProductService } from '../service/products';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css'
})
export class Checkout {
    cartService = inject(CartService);
    productService = inject(ProductService);
    router = inject(Router);

    address = model('');
    locationCoords = signal<{ lat: number, lng: number } | null>(null);

    cartItems = this.cartService.itemsArray;
    totalPrice = this.cartService.totalPrice;

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    shareLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.locationCoords.set({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                alert('Location fetched successfully!');
            }, (error) => {
                alert('Error fetching location: ' + error.message);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    async placeOrder() {
        if (this.cartService.cartCount() === 0) {
            alert('Cart is empty!');
            return;
        }
        if (!this.address() && !this.locationCoords()) {
            alert('Please provide an address or share your location.');
            return;
        }

        const orderData = {
            items: this.cartItems().map(item => ({
                productId: item.product.upc,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            })),
            totalPrice: this.totalPrice(),
            address: this.address(),
            location: this.locationCoords(),
            status: 'pending'
        };

        try {
            const orderId = await this.productService.placeOrder(orderData);
            alert(`Order placed successfully! Order ID: ${orderId}`);
            this.cartService.clearCart();
            this.router.navigate(['/dashboard']);
        } catch (error: any) {
            alert('Failed to place order: ' + error.message);
        }
    }
}
