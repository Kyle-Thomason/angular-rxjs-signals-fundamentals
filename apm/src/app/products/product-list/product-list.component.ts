// product-list.component.ts
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'pm-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <h1>{{ pageTitle }}</h1>
      
      <div *ngIf="state.errorMessage" class="error-message">
        {{ state.errorMessage }}
      </div>

      <div *ngIf="state.products.length > 0" class="product-grid">
        <div *ngFor="let product of state.products" 
             [ngClass]="{'selected': product.id === state.selectedProductId}"
             (click)="onProductSelected(product.id)">
          {{ product.productName }}
        </div>
      </div>

      <div *ngIf="!state.products.length && !state.errorMessage" class="loading">
        Loading products...
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly productService = inject(ProductService);
  private readonly notificationService = inject(NotificationService);

  readonly pageTitle = 'Products';
  
  state = {
    products: [] as Product[],
    selectedProductId: null as number | null,
    errorMessage: ''
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onProductSelected(productId: number): void {
    this.updateSelectedProduct(productId);
    this.notifyProductSelection(productId);
  }

  private loadProducts(): void {
    this.productService.getProducts()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (products) => this.handleProductsLoaded(products),
        error: (error) => this.handleError(error)
      });
  }

  private handleProductsLoaded(products: Product[]): void {
    this.state = {
      ...this.state,
      products,
      errorMessage: ''
    };
  }

  private handleError(error: any): void {
    this.state = {
      ...this.state,
      errorMessage: error,
      products: []
    };
    
    this.notificationService.showNotification({
      message: 'Error retrieving products',
      action: 'Close',
      type: 'error'
    });
  }

  private updateSelectedProduct(productId: number): void {
    this.state = {
      ...this.state,
      selectedProductId: productId
    };
  }

  private notifyProductSelection(productId: number): void {
    this.notificationService.showNotification({
      message: `Product ${productId} selected`,
      action: 'Close',
      type: 'info'
    });
  }
}