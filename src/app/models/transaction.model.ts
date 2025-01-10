export interface TransactionsDay {
  id: string; // Date of the day (e.g., '2022-11-08')
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  timestamp: string;
  amount: number;
  currencyCode: string;
  currencyRate?: number; // Optional, as not all transactions have this field
  description: string;
  otherParty?: OtherParty; // Optional, as some transactions might not have `otherParty`
  amountInEur?: number; // Computed field for converted amount
  date?: string; // Added during transformation
}

export interface OtherParty {
  name: string;
  iban: string;
}
