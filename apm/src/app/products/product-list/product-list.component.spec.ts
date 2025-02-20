import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../product.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { of, throwError } from 'rxjs';
import { Product } from '../product';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockProducts: Product[] = [
    { id: 1, productName: 'Product 1', productCode: 'P1', description: 'Description 1', price: 100 },
    { id: 2, productName: 'Product 2', productCode: 'P2', description: 'Description 2', price: 200 }
  ];

  beforeEach(async () => {
    const mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    const mockNotificationService = jasmine.createSpyObj('NotificationService', ['showNotification']);

    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        MatSnackBarModule
      ],
      providers: [
        provideAnimations(),
        { provide: ProductService, useValue: mockProductService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should load products successfully', fakeAsync(() => {
    // Arrange
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));

    // Act
    fixture.detectChanges();
    tick();

    // Assert
    expect(component.state.products).toEqual(mockProducts);
    expect(component.state.errorMessage).toBe('');
    
    // Check template rendering
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('.product-grid div').length).toBe(2);
  }));

  it('should handle error when loading products fails', fakeAsync(() => {
    // Arrange
    const errorMessage = 'Error loading products';
    productServiceSpy.getProducts.and.returnValue(throwError(() => errorMessage));

    // Act
    fixture.detectChanges();
    tick();

    // Assert
    expect(component.state.errorMessage).toBe(errorMessage);
    expect(component.state.products).toEqual([]);
    expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith({
      message: 'Error retrieving products',
      action: 'Close',
      type: 'error'
    });

    // Check template rendering
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-message')).toBeTruthy();
    expect(compiled.querySelector('.product-grid')).toBeFalsy();
  }));

  it('should select a product', fakeAsync(() => {
    // Arrange
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
    tick();

    // Act
    component.onProductSelected(1);

    // Assert
    expect(component.state.selectedProductId).toBe(1);
    expect(notificationServiceSpy.showNotification).toHaveBeenCalledWith({
      message: 'Product 1 selected',
      action: 'Close',
      type: 'info'
    });
  }));
});