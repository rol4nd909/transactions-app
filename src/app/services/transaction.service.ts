import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../environment';
import { Transaction, TransactionsDay } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http
      .get<{ days: TransactionsDay[] }>(`${environment.apiUrl}`)
      .pipe(
        map((data) =>
          data.days.flatMap((day) =>
            day.transactions.map((transaction) => {
              const { currencyRate, ...mappedTransaction } = transaction; // Omit currencyRate
              return {
                ...mappedTransaction,
                date: day.id,
                amountInEur:
                  transaction.currencyCode === 'USD' && transaction.currencyRate
                    ? transaction.amount / transaction.currencyRate
                    : transaction.amount,
              };
            })
          )
        )
      );
  }

  getTransactionById(id: number): Observable<Transaction | undefined> {
    return this.getTransactions().pipe(
      map((transactions) =>
        transactions.find((transaction) => transaction.id === id)
      )
    );
  }
}
