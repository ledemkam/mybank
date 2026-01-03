import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TransactionJsonServerService } from './tansaction-json-server.service';
import { Transaction } from './tansctions.model';

describe('TransactionJsonServerService', () => {
  let service: TransactionJsonServerService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:3000/transaktionen';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TransactionJsonServerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    service = TestBed.inject(TransactionJsonServerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTransactions', () => {
    it('should return transactions list when API call is successful', async () => {
      const mockTransactions: Transaction[] = [
        { id: 1, name: 'Transaction 1', amount: 100, date: '2024-01-01' },
        { id: 2, name: 'Transaction 2', amount: -50, date: '2024-01-02' }
      ];

      const transactionsPromise = service.getTransactions().toPromise();

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockTransactions);

      const transactions = await transactionsPromise;
      expect(transactions).toEqual(mockTransactions);
      expect(transactions?.length).toBe(2);
      expect(transactions?.[0].id).toBe(1);
      expect(transactions?.[1].amount).toBe(-50);
    });

    it('should return empty array when no transactions exist', async () => {
      const mockTransactions: Transaction[] = [];

      const transactionsPromise = service.getTransactions().toPromise();

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockTransactions);

      const transactions = await transactionsPromise;
      expect(transactions).toEqual([]);
      expect(transactions?.length).toBe(0);
    });

    it('should handle HTTP errors and rethrow them', async () => {
      const errorMessage = 'Http failure response for http://localhost:3000/transaktionen: 500 Server Error';

      const transactionsPromise = service.getTransactions().toPromise();

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });

      await expect(transactionsPromise).rejects.toBeTruthy();
    });
    it('should preserve transaction data structure', async () => {
      const mockTransaction: Transaction = {
        id: 42,
        name: 'Bank Transfer',
        amount: 250.50,
        date: '2024-12-01'
      };

      const transactionsPromise = service.getTransactions().toPromise();

      const req = httpMock.expectOne(API_URL);
      req.flush([mockTransaction]);

      const transactions = await transactionsPromise;
      expect(transactions).toBeDefined();
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions?.[0]).toEqual(mockTransaction);
    });
  });
});
