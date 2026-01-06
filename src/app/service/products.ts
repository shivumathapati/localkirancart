import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where,doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product/product-module';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
 
   private categorySource = new BehaviorSubject<string>('');
  selectedCategory$ = this.categorySource.asObservable();

  setCategory(categoryId: string) {
    this.categorySource.next(categoryId);
  }

  getAllProducts(): Observable<Product[]> {
    // Get reference to the 'products' collection
    const productsRef = collection(this.firestore, 'products');
    
    // Return the data as an observable
    // idField: 'upc' ensures the document ID is included in the object
    return collectionData(productsRef, { idField: 'upc' }) as Observable<Product[]>;
  }

  getProductByCategory(category: string): Observable<Product[]>  {
    const productsRef = collection(this.firestore, 'products');
    const categoryQuery = query(productsRef, where('category', '==', category));
    return collectionData(categoryQuery, { idField: 'upc' }) as Observable<Product[]>;
  }
  getProductBySubcategory(subcategory: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const subcategoryQuery = query(productsRef, where('subcategory', '==', subcategory));
  return collectionData(subcategoryQuery, { idField: 'upc' }) as Observable<Product[]>;
  }



  uploadProducts() {
    this.http.get<Product[]>('products_100.json')
    .subscribe(async (products) => {
      
      const productRef = collection(this.firestore, 'products');
      
      for (const product of products) {
        const docRef = doc(productRef, product.upc);
        await setDoc(docRef, product);
        }
        
        console.log('✅ Products uploaded successfully');
      });
    }
    
  }
  
