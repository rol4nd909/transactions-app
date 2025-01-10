import { Routes } from '@angular/router';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionDetailComponent } from './components/transaction-detail/transaction-detail.component';

export const routes: Routes = [
  { path: '', component: TransactionListComponent },
  { path: 'transactions/:id', component: TransactionDetailComponent },
  { path: '**', redirectTo: '' },
];
