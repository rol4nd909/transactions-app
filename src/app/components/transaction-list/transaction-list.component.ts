import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  imports: [CommonModule],
  providers: [DatePipe],
})
export class TransactionListComponent implements OnInit {
  transactions: { [date: string]: Transaction[] } = {};

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe((transactions) => {
      this.transactions = this.groupTransactionsByDate(transactions);
    });
  }

  private groupTransactionsByDate(transactions: Transaction[]): {
    [date: string]: Transaction[];
  } {
    return transactions.reduce((acc, { timestamp, ...transaction }) => {
      const date = timestamp.split('T')[0];

      // Initialize the array for the date if it doesn't exist
      (acc[date] ||= []).push({ timestamp, ...transaction });

      return acc;
    }, {} as { [date: string]: Transaction[] });
  }

  // Method to format date to 'd MMMM' format in Dutch
  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'd MMMM', 'nl-NL');
  }

  getSortedDates(): string[] {
    return Object.keys(this.transactions).sort((a, b) => (a > b ? -1 : 1));
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/transactions', id]);
  }
}
