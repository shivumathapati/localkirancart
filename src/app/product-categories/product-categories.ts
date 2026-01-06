import { Component, inject } from '@angular/core';
import { ProductService } from '../service/products';

@Component({
  selector: 'app-product-categories',
  imports: [],
  templateUrl: './product-categories.html',
  styleUrl: './product-categories.css',
})
export class ProductCategories {
private productService = inject(ProductService);
  categories = [
    {
      "id": "CAT01",
      "name": "Staples & Grocery Essentials",
      "subcategories": [
        "Rice",
        "Wheat",
        "Atta",
        "Toor Dal",
        "Chana Dal",
        "Moong Dal",
        "Sugar",
        "Salt",
        "Cooking Oil",
        "Rava"
      ]
    },
    {
      "id": "CAT02",
      "name": "Packaged Food & Snacks",
      "subcategories": [
        "Biscuits",
        "Chips",
        "Namkeen",
        "Instant Noodles",
        "Pasta",
        "Breakfast Cereals",
        "Ready-to-eat Meals",
        "Chocolates",
        "Energy Bars",
        "Popcorn"
      ]
    },
    {
      "id": "CAT03",
      "name": "Dairy & Bakery",
      "subcategories": [
        "Milk",
        "Curd",
        "Butter",
        "Cheese",
        "Paneer",
        "Ghee",
        "Bread",
        "Buns",
        "Cakes",
        "Khoya"
      ]
    },
    {
      "id": "CAT04",
      "name": "Beverages",
      "subcategories": [
        "Tea",
        "Coffee",
        "Soft Drinks",
        "Fruit Juices",
        "Energy Drinks",
        "Health Drinks",
        "Flavoured Milk",
        "Soda",
        "Packaged Water",
        "Coconut Water"
      ]
    },
    {
      "id": "CAT05",
      "name": "Spices & Condiments",
      "subcategories": [
        "Turmeric Powder",
        "Red Chilli Powder",
        "Coriander Powder",
        "Garam Masala",
        "Cumin Seeds",
        "Mustard Seeds",
        "Pickles",
        "Sauces",
        "Ketchup",
        "Vinegar"
      ]
    },
    {
      "id": "CAT06",
      "name": "Personal Care",
      "subcategories": [
        "Bath Soap",
        "Shampoo",
        "Conditioner",
        "Toothpaste",
        "Toothbrush",
        "Hair Oil",
        "Face Wash",
        "Shaving Cream",
        "Deodorant",
        "Sanitary Napkins"
      ]
    },
    {
      "id": "CAT07",
      "name": "Home Care & Cleaning",
      "subcategories": [
        "Detergent Powder",
        "Detergent Liquid",
        "Dishwash Bar",
        "Dishwash Liquid",
        "Floor Cleaner",
        "Toilet Cleaner",
        "Phenyl",
        "Garbage Bags",
        "Room Freshener",
        "Insect Repellent"
      ]
    },
    {
      "id": "CAT08",
      "name": "Baby Care",
      "subcategories": [
        "Baby Food",
        "Baby Milk Formula",
        "Diapers",
        "Baby Wipes",
        "Baby Soap",
        "Baby Shampoo",
        "Baby Oil",
        "Baby Lotion",
        "Baby Powder",
        "Feeding Bottles"
      ]
    },
    {
      "id": "CAT09",
      "name": "Health & Wellness",
      "subcategories": [
        "Protein Powder",
        "Multivitamins",
        "ORS Sachets",
        "Pain Relief Balm",
        "First Aid Kit",
        "Thermometer",
        "Ayurvedic Medicines",
        "Face Masks",
        "Hand Sanitizer",
        "Glucose Powder"
      ]
    },
    {
      "id": "CAT10",
      "name": "Stationery & Miscellaneous",
      "subcategories": [
        "Pens",
        "Notebooks",
        "Pencils",
        "Erasers",
        "Sharpeners",
        "Matchsticks",
        "Candles",
        "Batteries",
        "Rubber Bands",
        "Paper Cups"
      ]
    }
  ]
  selectedCategory: string = '';
  
  selectCategory(category: string) {
    this.productService.setCategory(category);
  }

}
