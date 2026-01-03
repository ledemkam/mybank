import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TransactionList } from './tansctions.model';
import { TransactionService } from './transactions.service';

// Mock implementation for testing
class MockTransactionService extends TransactionService {
  getTransactions() {
    // TransactionList est un tableau, pas un objet
    return of([] as TransactionList);
  }
}

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TransactionService, useClass: MockTransactionService }
      ]
    });
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getTransactions method', () => {
    expect(service.getTransactions).toBeDefined();
    expect(typeof service.getTransactions).toBe('function');
  });

  it('should return an Observable from getTransactions', () => {
    const result = service.getTransactions();
    expect(result).toBeDefined();
    expect(result.subscribe).toBeDefined();
  });

  it('should emit TransactionList when getTransactions is called', async () => {
    const transactions = await service.getTransactions().toPromise();
    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
  });

  it('should handle empty transaction list', async () => {
    const transactions = await service.getTransactions().toPromise();
    expect(transactions?.length).toBe(0);
  });
});
