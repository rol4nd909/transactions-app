import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { environment } from '../../../environment';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController; // Inject HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import the module
      providers: [TransactionService], // Provide the service
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController); // Inject HttpTestingController
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
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
              timestamp: '2025-01-10T10:00:00Z', // Add timestamp field
            },
          ],
        },
      ],
    };

    service.getTransactions().subscribe((transactions) => {
      expect(transactions).toEqual([
        {
          id: 1,
          date: '2025-01-10',
          amount: 100,
          currencyCode: 'USD',
          description: 'Transaction A',
          timestamp: '2025-01-10T10:00:00Z',
          amountInEur: 100,
        },
      ]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Mock the response
  });
});
