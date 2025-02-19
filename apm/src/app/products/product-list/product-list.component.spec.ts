import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Product } from '../product';

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let productServiceSpy: jasmine.SpyObj<ProductService>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    const mockProducts: Product[] = [
        { id: 1, productName: 'Product 1', productCode: 'P1', description: 'Description 1', price: 100, quantityInStock: 10, hasReviews: true, reviews: [] },
        { id: 2, productName: 'Product 2', productCode: 'P2', description: 'Description 2', price: 200, quantityInStock: 20, hasReviews: false, reviews: [] }
    ];

    beforeEach(async () => {
        // Create spies before TestBed configuration
        productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        await TestBed.configureTestingModule({
            imports: [
                ProductListComponent,
                NoopAnimationsModule
            ],
            providers: [
                { provide: ProductService, useValue: productServiceSpy },
                { provide: MatSnackBar, useValue: snackBarSpy }  // Use spy instead of real service
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
    });

    it('should load products in ngOnInit', fakeAsync(() => {
        // Arrange
        productServiceSpy.getProducts.and.returnValue(of(mockProducts));

        // Act
        fixture.detectChanges(); // Triggers ngOnInit
        tick(); // Process any pending asynchronous activities

        // Assert
        expect(productServiceSpy.getProducts).toHaveBeenCalled();
        expect(component.products).toEqual(mockProducts);
    }));



});
