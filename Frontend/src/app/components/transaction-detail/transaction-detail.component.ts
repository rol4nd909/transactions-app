import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.scss',
  imports: [CommonModule],
  providers: [DatePipe],
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction | null = null;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const transactionId = +this.route.snapshot.paramMap.get('id')!; // Get ID from the route params
    this.transactionService
      .getTransactionById(transactionId)
      .subscribe((transaction) => {
        this.transaction = transaction ?? null; // Set the transaction if it exists
      });
  }

  // Method to format date to 'd MMMM y' format in Dutch
  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'd MMMM y', 'nl-NL');
  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the overview (or list) page
  }
}
