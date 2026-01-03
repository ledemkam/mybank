import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map, shareReplay } from "rxjs/operators";
import { Transaction, TransactionList } from "./tansctions.model";
import { TransactionService } from "./transactions.service";


export class TransactionJsonServerService implements TransactionService {
  private readonly TRANSACTION_API_URL = 'http://localhost:3000/transaktionen';
  private readonly http = inject(HttpClient);


  getTransactions(): Observable<TransactionList> {
    return this.http
      .get<Transaction[]>(this.TRANSACTION_API_URL)
      .pipe(
        map((transactions) => this.transformTransactions(transactions)),
        catchError((error) => this.handleError(error)),
        shareReplay(1)

      );
  }

   private transformTransactions(tansactions: Transaction[]): TransactionList {
    return tansactions.map((transaction) => ({
      ...transaction,
      // Transformation si nécessaire
    }));
  }

  private handleError(error: unknown): Observable<TransactionList> {
    console.error('API Error:', error);
    // Retourner un tableau vide ou relancer l'erreur
    throw error;
  }

}
