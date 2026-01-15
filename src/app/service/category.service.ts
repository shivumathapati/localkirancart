import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable, combineLatest, map, switchMap, of } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private firestore = inject(Firestore);

    /**
     * Fetches all main categories and their immediate subcategories.
     * This handles the specific subcollection structure: categories/{catId}/sub_categorie/{subId}
     */
    getCategoriesWithSubcategories(): Observable<Category[]> {
        const categoriesRef = collection(this.firestore, 'categories');
        // Optional: Order by 'position' if your data has it, or 'name'
        const q = query(categoriesRef, orderBy('position'));

        return collectionData(q, { idField: 'docId' }).pipe(
            switchMap((categories: any[]) => {
                if (categories.length === 0) {
                    return of([]);
                }

                // For each category, fetch its 'sub_categorie' subcollection
                const categoryRequests = categories.map(category => {
                    // Reference to nested 'sub_categorie'
                    const subCategoriesRef = collection(this.firestore, `categories/${category.docId}/sub_categorie`);
                    const subQ = query(subCategoriesRef, orderBy('position'));

                    return collectionData(subQ).pipe(
                        map(subCategories => ({
                            ...category,
                            sub_categorie: subCategories // Attach the fetched subcategories back to the parent
                        }))
                    );
                });

                // Execute all subcollection queries in parallel
                return combineLatest(categoryRequests);
            })
        ) as Observable<Category[]>;
    }
}
