import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TransactionDetailComponent } from './transaction-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TransactionService } from '../../services/transaction.service';

describe('TransactionDetailComponent', () => {
  let component: TransactionDetailComponent;
  let fixture: ComponentFixture<TransactionDetailComponent>;
  let transactionService: TransactionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionDetailComponent, // Import the standalone component
      ],
      providers: [
        provideRouter([]), // Provide router utilities
        provideHttpClient(), // Provide HttpClient utilities
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }, // Mock route params
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load transaction details', () => {
    spyOn(transactionService, 'getTransactionById').and.returnValue(
      of({
        id: 1,
        timestamp: '2025-01-10T10:00:00Z',
        amount: 100.5,
        currencyCode: 'EUR',
        amountInEur: 100.5,
        description: 'Sample transaction',
        otherParty: {
          name: 'Party Name',
          iban: 'NL00BANK0123456789',
        },
      })
    );

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.transaction?.id).toBe(1);
    expect(component.transaction?.amountInEur).toBe(100.5);
    expect(component.transaction?.description).toBe('Sample transaction');
    expect(component.transaction?.otherParty?.name).toBe('Party Name');
    expect(component.transaction?.otherParty?.iban).toBe('NL00BANK0123456789');
  });

  it('should handle null transaction', () => {
    spyOn(transactionService, 'getTransactionById').and.returnValue(
      of(undefined)
    );

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.transaction).toBeUndefined();
  });

  it('should handle error from service', () => {
    spyOn(transactionService, 'getTransactionById').and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.ngOnInit();
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain(
      'Error loading transaction details. Please try again later.'
    );
  });

  it('should handle loading state', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingMessage =
      fixture.nativeElement.querySelector('.loading-message');
    expect(loadingMessage).toBeTruthy();
    expect(loadingMessage.textContent).toContain(
      'Loading transaction details...'
    );
  });
});
