import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CategoryService } from '../../service/category.service';
import { Category } from '../../models/category.model';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-home-categories',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './home-categories.html',
  styleUrls: ['./home-categories.css']
})
export class HomeCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  categories$!: Observable<Category[]>;
  baseURL = "https://www.jiomart.com";

  // State for sidebar
  selectedVertical = 'Groceries'; // Default
  verticals = [
    { name: 'Groceries', icon: 'assets/icons/groceries.png' }, // Placeholder icons
    { name: 'Fashion', icon: 'assets/icons/fashion.png' },
    { name: 'Electronics', icon: 'assets/icons/electronics.png' },
    { name: 'Precious Jewellery', icon: 'assets/icons/jewellery.png' },
    { name: 'Home & Lifestyle', icon: 'assets/icons/home.png' },
  ];

  // State for accordion
  expandedCategoryId: number | null = null;

  ngOnInit() {
    this.categories$ = this.categoryService.getCategoriesWithSubcategories().pipe(
      tap(categories => {
        // Auto-expand the first category by default
        if (categories.length > 0) {
          this.expandedCategoryId = categories[0].id;
        }
      })
    );
  }

  toggleCategory(categoryId: number) {
    if (this.expandedCategoryId === categoryId) {
      this.expandedCategoryId = null; // Collapse
    } else {
      this.expandedCategoryId = categoryId; // Expand
    }
  }

  selectVertical(verticalName: string) {
    this.selectedVertical = verticalName;
    // In a real app, this would filter categories$.
    // Since we only have Grocery data, we just update the UI state.
  }
}
