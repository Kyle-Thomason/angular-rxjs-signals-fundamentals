import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
imports: [
  NgIf, 
  NgFor, 
  NgClass, 
  ProductDetailComponent
],
providers: [MatSnackBar]
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage = '';
  sub! : Subscription;

  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  products: Product[] = [];

  selectedProductId: number = 0;

  ngOnInit(): void {
    this.sub = this.productService.getProducts()
    .pipe(
      tap(() => console.log('In component pipeline:')),
      catchError(err => {
        this.errorMessage = err;
        this.showSnackBar('Error retrieving products', 'Close','error');
        return EMPTY;
      })
    ).subscribe(products => {
      this.products = products;
      console.log(this.products);
    });
    
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelected(productId: number): void {
    this.selectedProductId = productId;
    this.showSnackBar('Product ' + productId + ' selected', 'Close','info');
  }

  showSnackBar(message: string, action: string, type: 'error' | 'info' = 'info'): void {
    const duration = type === 'error' ? undefined : 2000; // No duration for errors, 2000ms for info
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
