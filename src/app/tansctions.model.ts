export interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
}

export type TransactionList = Transaction[];
