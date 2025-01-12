import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDetailComponent } from './transaction-detail.component';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransactionDetailComponent', () => {
  let component: TransactionDetailComponent;
  let fixture: ComponentFixture<TransactionDetailComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', [
      'getTransactionById',
    ]);
    loadingSubject = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [CommonModule, TransactionDetailComponent],
      providers: [
        DatePipe,
        { provide: TransactionService, useValue: transactionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
        provideRouter([]),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(
      TransactionService
    ) as jasmine.SpyObj<TransactionService>;
    transactionService.loading$ = loadingSubject.asObservable();
    transactionService.getTransactionById.and.returnValue(of(undefined)); // Ensure it returns an observable
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display transaction details when loaded', () => {
    const mockTransaction = {
      id: 1,
      amount: 100,
      amountInEur: 85,
      currencyCode: 'USD',
      timestamp: '2023-10-01T12:00:00Z',
      description: 'Test transaction',
      otherParty: { name: 'John Doe', iban: 'NL00RABO0123456789' },
    };
    transactionService.getTransactionById.and.returnValue(of(mockTransaction));
    loadingSubject.next(false);
    fixture.detectChanges();
    const amountElement = fixture.nativeElement.querySelector(
      '[data-test="amount"]'
    );
    expect(amountElement.textContent).toContain('EUR 85');
  });

  it('should display error message if transaction not found', () => {
    transactionService.getTransactionById.and.returnValue(of(undefined));
    loadingSubject.next(false);
    fixture.detectChanges();
    const errorMessage = fixture.nativeElement.querySelector(
      '[data-test="error-message"]'
    );
    expect(errorMessage).toBeTruthy();
  });

  it('should handle errors from the service', () => {
    transactionService.getTransactionById.and.returnValue(
      throwError(() => new Error('Error'))
    );
    loadingSubject.next(false);
    fixture.detectChanges();
    const errorMessage = fixture.nativeElement.querySelector(
      '[data-test="error-message"]'
    );
    expect(errorMessage).toBeTruthy();
  });
});
