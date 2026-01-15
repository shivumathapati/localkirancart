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
  selectedVertical = 'Groceries';

  verticals = [
    { name: 'Groceries', icon: 'assets/icons/groceries.png' },
    { name: 'Fashion', icon: 'assets/icons/fashion.png' },
    { name: 'Electronics', icon: 'assets/icons/electronics.png' },
    { name: 'Precious Jewellery', icon: 'assets/icons/jewellery.png' },
    { name: 'Home & Lifestyle', icon: 'assets/icons/home.png' },
  ];

  // State for accordion and breadcrumb
  expandedCategoryId: number | null = null;
  currentCategoryName: string = '';

  ngOnInit() {
    this.categories$ = this.categoryService.getCategoriesWithSubcategories().pipe(
      tap(categories => {
        // Auto-expand the first category by default
        if (categories.length > 0) {
          this.expandedCategoryId = categories[0].id;
          this.currentCategoryName = categories[0].name;
        }
      })
    );
  }

  toggleCategory(category: Category) {
    if (this.expandedCategoryId === category.id) {
      this.expandedCategoryId = null; // Collapse
      this.currentCategoryName = ''; // Reset
    } else {
      this.expandedCategoryId = category.id; // Expand
      this.currentCategoryName = category.name; // Update Name for Breadcrumb
    }
  }

  selectVertical(verticalName: string) {
    this.selectedVertical = verticalName;
    // In a real app, this would filter categories$.
  }
}
