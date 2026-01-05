import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product/product-module';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = inject(Firestore);

  getAllProducts(): Observable<Product[]> {
    // Get reference to the 'products' collection
    const productsRef = collection(this.firestore, 'products');
    
    // Return the data as an observable
    // idField: 'upc' ensures the document ID is included in the object
    return collectionData(productsRef, { idField: 'upc' }) as Observable<Product[]>;
  }
}