import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { map, finalize, catchError } from 'rxjs';
import { environment } from '../../../environment';
import { Transaction, TransactionsDay } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
/**
 * Service to handle transactions related operations.
 */
export class TransactionService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadingSubject.next(false); // Ensure loading state is initialized to false
  }

  private convertToEur(transaction: Transaction): Transaction {
    if (transaction.currencyCode === 'USD' && transaction.currencyRate) {
      transaction.amount = transaction.amount / transaction.currencyRate;
    }
    return transaction;
  }

  /**
   * Fetches all transactions from the API.
   * @returns An Observable of an array of Transactions.
   *
   * This method makes an HTTP GET request to the API endpoint specified in the environment configuration.
   * The response is expected to be an object containing an array of `TransactionsDay` objects.
   * Each `TransactionsDay` object contains a date and an array of transactions for that day.
   *
   * The method processes the response to flatten the transactions into a single array.
   * For each transaction, it modifies the `amount` field based on the `currencyCode` and `currencyRate`.
   * If the `currencyCode` is 'USD' and a `currencyRate` is provided, the amount is converted to EUR.
   * Otherwise, the original amount is used.
   */
  getTransactions() {
    this.loadingSubject.next(true);
    this.errorSubject.next(null); // Reset error state
    return this.http
      .get<{ days: TransactionsDay[] }>(`${environment.apiUrl}`)
      .pipe(
        map((data) =>
          data.days.flatMap((day) =>
            day.transactions.map((transaction) =>
              this.convertToEur(transaction)
            )
          )
        ),
        catchError((error) => {
          console.error('Error fetching transactions:', error);
          this.errorSubject.next(
            'Error fetching transactions. Please try again later.'
          );
          return of([] as Transaction[]);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  /**
   * Fetches a transaction by its ID.
   * @param id - The ID of the transaction to fetch.
   * @returns An Observable of the transaction if found, otherwise undefined.
   */
  getTransactionById(id: number) {
    this.loadingSubject.next(true);
    return this.getTransactions().pipe(
      map((transactions) =>
        transactions.find((transaction) => transaction.id === id)
      ),
      catchError((error) => {
        console.error('Error fetching transaction by ID:', error);
        return of(undefined);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  /**
   * Groups transactions by their date.
   * @param transactions - Array of transactions to be grouped.
   * @returns A Map where the keys are dates and the values are arrays of transactions.
   */
  groupTransactionsByDate(transactions: Transaction[]) {
    return transactions.reduce((acc, { timestamp, ...transaction }) => {
      const date = timestamp.split('T')[0];
      // Initialize the array for the date if it doesn't exist
      if (!acc.has(date)) {
        acc.set(date, []);
      }
      acc.get(date)!.push({ timestamp, ...transaction });
      return acc;
    }, new Map<string, Transaction[]>());
  }
}
