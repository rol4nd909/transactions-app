import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { TransactionService } from './transaction.service';
import { environment } from '../../../environment';

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

    service.getTransactions().subscribe((transactions) => {
      expect(transactions).toEqual([
        {
          id: 1,
          amount: 100,
          currencyCode: 'USD',
          description: 'Transaction A',
          timestamp: '2025-01-10T10:00:00Z',
          amountInEur: 100,
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

    httpClientSpy.get.and.returnValue(
      throwError(() => ({ error: errorResponse }))
    );

    service.getTransactions().subscribe(
      () => fail('expected an error, not transactions'),
      (error) => expect(error.error).toEqual(errorResponse)
    );

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
              currencyRate: 1,
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
        amountInEur: 100,
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
});
