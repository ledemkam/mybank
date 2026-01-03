import { Observable } from "rxjs";
import {TransactionList } from "./tansctions.model";


export abstract class TransactionService {
  abstract getTransactions(): Observable<TransactionList>;
}
