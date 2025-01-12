import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  imports: [CommonModule],
  providers: [DatePipe],
})
export class TransactionListComponent implements OnInit {
  // Object to hold transactions grouped by date
  transactions: { [date: string]: Transaction[] } = {};
  // Observable to track loading state
  loading$: Observable<boolean>;
  // Observable to track error state
  error$: Observable<string | null>;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    // Initialize loading$ and error$ observables from the transaction service
    this.loading$ = this.transactionService.loading$;
    this.error$ = this.transactionService.error$;
  }

  ngOnInit(): void {
    // Fetch transactions and group them by date
    this.transactionService.getTransactions().subscribe((transactions) => {
      this.transactions =
        this.transactionService.groupTransactionsByDate(transactions);
    });
  }

  /**
   * Formats a date string to 'd MMMM' format in Dutch.
   * @param date - The date string to format.
   * @returns The formatted date string.
   */
  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'd MMMM', 'nl-NL');
  }

  /**
   * Gets the sorted dates from the transactions object.
   * @returns An array of sorted date strings.
   */
  getSortedDates(): string[] {
    return Object.keys(this.transactions).sort((a, b) => (a > b ? -1 : 1));
  }

  /**
   * Navigates to the transaction detail page.
   * @param id - The ID of the transaction to view details for.
   */
  navigateToDetail(id: number): void {
    this.router.navigate(['/transactions', id]);
  }
}
