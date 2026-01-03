import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { Transaction, TransactionList } from "./tansctions.model";
import { TransactionService } from "./transactions.service";


export class TransactionJsonServerService implements TransactionService {
  private readonly TRANSACTION_API_URL = 'http://localhost:3000/transaktionen';
  private readonly http = inject(HttpClient);


  getTransactions(): Observable<TransactionList> {
    return this.http
      .get<Transaction[]>(this.TRANSACTION_API_URL)
  }

}
