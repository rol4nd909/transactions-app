import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionListComponent } from './transaction-list.component';
import { TransactionService } from '../../services/transaction.service';
import { provideRouter, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Transaction } from '../../models/transaction.model';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let loadingSubject: BehaviorSubject<boolean>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', [
      'getTransactions',
      'groupTransactionsByDate',
    ]);
    loadingSubject = new BehaviorSubject<boolean>(false);

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, TransactionListComponent],
      providers: [
        DatePipe,
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: Router, useValue: routerMock },
        provideRouter([]),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(
      TransactionService
    ) as jasmine.SpyObj<TransactionService>;
    transactionService.loading$ = loadingSubject.asObservable();
    transactionService.getTransactions.and.returnValue(of([])); // Ensure it returns an observable
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display transactions grouped by date', () => {
    const transactions = [
      {
        date: '2023-10-01',
        id: 1,
        timestamp: '2023-10-01T11:11:11',
        amount: -100,
        currencyCode: 'EUR',
        description: 'Some interesting description',
        otherParty: {
          name: 'John Doe',
          iban: 'NL00RABO0123456789',
        },
      },
      {
        date: '2023-10-01',
        id: 2,
        timestamp: '2023-10-01T11:15:11',
        amount: -75,
        currencyCode: 'USD',
        currencyRate: 1.173628,
        description: 'Description',
        otherParty: {
          name: 'Jane Doe',
          iban: 'NL00RABO0987654321',
        },
      },
      {
        date: '2023-10-02',
        id: 3,
        timestamp: '2023-10-02T11:15:11',
        amount: 50,
        currencyCode: 'EUR',
        description: 'Description',
        otherParty: {
          name: 'Jane Doe',
          iban: 'NL00RABO0987654321',
        },
      },
    ];
    const groupedTransactions = new Map<string, Transaction[]>([
      ['2023-10-01', [transactions[0], transactions[1]]],
      ['2023-10-02', [transactions[2]]],
    ]);
    transactionService.getTransactions.and.returnValue(of(transactions));
    transactionService.groupTransactionsByDate.and.returnValue(
      groupedTransactions
    );

    component.transactions = groupedTransactions;
    fixture.detectChanges();

    const sortedDates = component.getSortedDates();
    const transactionGroups = fixture.debugElement.queryAll(
      By.css('[data-test="group"]')
    );
    expect(transactionGroups.length).toBe(2);
    expect(
      transactionGroups[0].query(By.css('[data-test="date"]')).nativeElement
        .textContent
    ).toContain(component.formatDate(sortedDates[0]));
    expect(
      transactionGroups[1].query(By.css('[data-test="date"]')).nativeElement
        .textContent
    ).toContain(component.formatDate(sortedDates[1]));
  });

  it('should navigate to transaction detail on click', () => {
    const transactions = [
      {
        date: '2023-10-01',
        id: 1,
        timestamp: '2023-10-01T11:11:11',
        amount: -100,
        currencyCode: 'EUR',
        description: 'Some interesting description',
        otherParty: {
          name: 'John Doe',
          iban: 'NL00RABO0123456789',
        },
      },
    ];
    const groupedTransactions = new Map<string, Transaction[]>([
      ['2023-10-01', [transactions[0]]],
    ]);
    transactionService.getTransactions.and.returnValue(of(transactions));
    transactionService.groupTransactionsByDate.and.returnValue(
      groupedTransactions
    );

    component.transactions = groupedTransactions;
    fixture.detectChanges();

    const transactionItem = fixture.debugElement.query(
      By.css('[data-test="item"]')
    );
    expect(transactionItem).toBeTruthy();
    transactionItem.triggerEventHandler('click', null);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/transactions', 1]);
  });

  it('should display error message when loading items fails', () => {
    const errorMessage = 'Error fetching transactions. Please try again later.';
    transactionService.error$ = of(errorMessage);
    component.error$ = transactionService.error$;
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(
      By.css('[data-test="error-message"]')
    );
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain(errorMessage);
  });
});
