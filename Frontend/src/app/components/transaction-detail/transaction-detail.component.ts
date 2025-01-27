import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.scss',
  imports: [CommonModule],
  providers: [DatePipe],
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction | undefined = undefined;
  // Observable to track loading state
  loading$: Observable<boolean>;

  /**
   * Constructor to initialize the component with necessary services.
   * @param transactionService Service to fetch transaction data.
   * @param route ActivatedRoute to access route parameters.
   * @param router Router to navigate between routes.
   * @param datePipe DatePipe to format dates.
   */
  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.loading$ = this.transactionService.loading$; // Initialize loading$ in the constructor
  }

  /**
   * OnInit lifecycle hook to fetch transaction details based on route parameter.
   */
  ngOnInit(): void {
    const transactionDate = this.route.snapshot.paramMap.get('date')!; // Get date from the route params
    const transactionId = +this.route.snapshot.paramMap.get('id')!; // Get ID from the route params
    this.transactionService
      .getTransactionByDateAndId(transactionDate, transactionId)
      .subscribe((transaction) => {
        this.transaction = transaction; // Set the transaction if it exists
      });
  }

  /**
   * Method to format date to 'd MMMM y' format in Dutch.
   * @param date The date string to format.
   * @returns The formatted date string or null if the input is invalid.
   */
  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'd MMMM y', 'nl-NL');
  }

  /**
   * Method to navigate back to the overview (or list) page.
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
