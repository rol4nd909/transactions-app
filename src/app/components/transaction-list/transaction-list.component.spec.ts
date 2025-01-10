import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TransactionListComponent } from './transaction-list.component';
import { TransactionService } from '../../services/transaction.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', [
      'getTransactions',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]), // Router mock
      ],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTransactions when ngOnInit is called', () => {
    mockTransactionService.getTransactions.and.returnValue(of([])); // Mock with empty array

    component.ngOnInit(); // Trigger ngOnInit

    expect(mockTransactionService.getTransactions).toHaveBeenCalled();
  });

  it('should fetch and group transactions by date on initialization', () => {
    const mockTransactions = [
      {
        id: 1,
        date: '2025-01-10',
        timestamp: '2025-01-10T10:00:00Z',
        amount: 100.5,
        currencyCode: 'EUR',
        amountInEur: 100.5,
        otherParty: { name: 'Party A', iban: 'NL00BANK0123456789' },
        description: 'Transaction A',
      },
      {
        id: 2,
        date: '2025-01-10',
        timestamp: '2025-01-10T11:00:00Z',
        amount: 50,
        currencyCode: 'EUR',
        amountInEur: 50,
        otherParty: { name: 'Party B', iban: 'NL00BANK9876543210' },
        description: 'Transaction B',
      },
    ];

    mockTransactionService.getTransactions.and.returnValue(
      of(mockTransactions)
    ); // Ensure it returns an observable
    component.ngOnInit(); // Trigger ngOnInit

    fixture.detectChanges(); // Trigger change detection

    expect(component.transactions).toEqual({
      '2025-01-10': [mockTransactions[0], mockTransactions[1]],
    });
  });
});
