import { Component } from '@angular/core';
import { ProductTile } from "../product-tile/product-tile";

@Component({
  selector: 'app-dashboard',
  imports: [ProductTile],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
