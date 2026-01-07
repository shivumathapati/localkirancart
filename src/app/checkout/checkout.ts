import { Component, inject, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CartService } from '../service/cart.service';
import { ProductService } from '../service/products';
import { AuthService } from '../service/auth.service';

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
    authService = inject(AuthService);
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
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        this.address.set(data.display_name);
                    } else {
                        // Fallback if address not found, maybe show coords in address field?
                        this.address.set(`Lat: ${lat}, Lng: ${lng}`);
                    }
                } catch (error) {
                    // Fallback on error
                    this.address.set(`Lat: ${lat}, Lng: ${lng}`);
                    alert('Error determining address: ' + error);
                }
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

        const user = this.authService.getCurrentUser();
        const userEmail = user ? user.email : 'guest';

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
            status: 'pending',
            userEmail: userEmail,
            userId: user ? user.uid : 'guest'
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
