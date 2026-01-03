import { ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from './transactions.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  readonly #transactionService = inject(TransactionService);
  readonly transactionList = toSignal(
    this.#transactionService.getTransactions(),
    { initialValue: [] }
  );


}
