import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { TransactionService } from './transaction.service';
import { environment } from '../../../environment';
import { Transaction } from '../models/transaction.model';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [TransactionService, { provide: HttpClient, useValue: spy }],
    });
    service = TestBed.inject(TransactionService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should fetch and map transactions correctly', () => {
    const mockResponse = {
      days: [
        {
          id: '2022-11-08',
          transactions: [
            {
              id: 1,
              amount: 10,
              currencyCode: 'USD',
              description: 'Transaction A',
              timestamp: '2025-01-10T10:00:00Z',
            },
          ],
        },
      ],
    };

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.getTransactions().subscribe((transactions) => {
      expect(transactions).toEqual([
        {
          id: 1,
          amount: 10,
          currencyCode: 'USD',
          description: 'Transaction A',
          timestamp: '2025-01-10T10:00:00Z',
        },
      ]);
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get.calls.mostRecent().args[0]).toBe(
      `${environment.apiUrl}`
    );
  });

  it('should handle error when fetching transactions', () => {
    const errorResponse = new ErrorEvent('Network error');

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

    service.getTransactions().subscribe({
      next: (transactions) => expect(transactions).toEqual([]),
      error: () => fail('expected an empty array, not an error'),
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get.calls.mostRecent().args[0]).toBe(
      `${environment.apiUrl}`
    );
  });

  it('should fetch a transaction by ID', () => {
    const mockResponse = {
      days: [
        {
          id: '2025-01-10',
          transactions: [
            {
              id: 1,
              amount: 100,
              currencyCode: 'USD',
              description: 'Transaction A',
              timestamp: '2025-01-10T10:00:00Z',
            },
            {
              id: 2,
              amount: 200,
              currencyCode: 'EUR',
              description: 'Transaction B',
              timestamp: '2025-01-10T11:00:00Z',
            },
          ],
        },
      ],
    };

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.getTransactionById(1).subscribe((transaction) => {
      expect(transaction).toEqual({
        id: 1,
        amount: 100,
        currencyCode: 'USD',
        description: 'Transaction A',
        timestamp: '2025-01-10T10:00:00Z',
      });
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get.calls.mostRecent().args[0]).toBe(
      `${environment.apiUrl}`
    );
  });

  it('should return undefined for non-existent transaction ID', () => {
    const mockResponse = {
      days: [
        {
          id: '2025-01-10',
          transactions: [
            {
              id: 1,
              amount: 100,
              currencyCode: 'USD',
              currencyRate: 1,
              description: 'Transaction A',
              timestamp: '2025-01-10T10:00:00Z',
            },
          ],
        },
      ],
    };

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.getTransactionById(999).subscribe((transaction) => {
      expect(transaction).toBeUndefined();
    });

    expect(httpClientSpy.get.calls.count()).toBe(1);
    expect(httpClientSpy.get.calls.mostRecent().args[0]).toBe(
      `${environment.apiUrl}`
    );
  });

  it('should group transactions by date', () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        amount: 100,
        currencyCode: 'EUR',
        description: 'Description 1',
        timestamp: '2023-10-01T10:00:00Z',
      },
      {
        id: 2,
        amount: 200,
        currencyCode: 'EUR',
        description: 'Description 2',
        timestamp: '2023-10-01T12:00:00Z',
      },
      {
        id: 3,
        amount: 300,
        currencyCode: 'EUR',
        description: 'Description 3',
        timestamp: '2023-10-02T09:00:00Z',
      },
    ];

    const groupedTransactions = service.groupTransactionsByDate(transactions);

    expect(groupedTransactions.get('2023-10-01')).toEqual([
      {
        id: 1,
        amount: 100,
        currencyCode: 'EUR',
        description: 'Description 1',
        timestamp: '2023-10-01T10:00:00Z',
      },
      {
        id: 2,
        amount: 200,
        currencyCode: 'EUR',
        description: 'Description 2',
        timestamp: '2023-10-01T12:00:00Z',
      },
    ]);

    expect(groupedTransactions.get('2023-10-02')).toEqual([
      {
        id: 3,
        amount: 300,
        currencyCode: 'EUR',
        description: 'Description 3',
        timestamp: '2023-10-02T09:00:00Z',
      },
    ]);
  });
});
