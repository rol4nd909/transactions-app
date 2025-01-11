import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TransactionDetailComponent } from './transaction-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from '../../services/transaction.service';

describe('TransactionDetailComponent', () => {
  let component: TransactionDetailComponent;
  let fixture: ComponentFixture<TransactionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionDetailComponent, // Import the standalone component
        HttpClientTestingModule, // Import HttpClient module for mocking
        RouterTestingModule.withRoutes([]), // Provide router utilities
      ],
      providers: [
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
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load transaction details', () => {
    const transactionService = TestBed.inject(TransactionService);
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

    expect(component.transaction?.id).toBe(1);
    expect(component.transaction?.amountInEur).toBe(100.5);
    expect(component.transaction?.description).toBe('Sample transaction');
  });
});
