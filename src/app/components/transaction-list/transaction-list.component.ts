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
    [key: string]: Transaction[];
  } {
    return transactions.reduce((acc, transaction) => {
      const date = transaction.date;

      // Ensure date is a valid string
      if (!date) {
        return acc; // or handle it in a way that makes sense for your case
      }

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as { [key: string]: Transaction[] }); // Type assertion to make sure TypeScript knows the return type
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
