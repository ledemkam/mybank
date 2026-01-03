import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { TransactionService } from './transactions.service';

interface MockTransactionService {
  getTransactions: jest.MockedFunction<() => any>;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;
  let mockTransactionService: MockTransactionService;

  beforeEach(async () => {
    mockTransactionService = {
      getTransactions: jest.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });



  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.detectChanges();
    const titleElement = compiled.querySelector('h1');
    expect(titleElement?.textContent).toContain('Willkommen zu meinem Bank🏦💳💸!');
  });

  it('should render table with 3 columns', () => {
    const mockTransactions = [
      { id: 1, name: 'Test Transaction', amount: 100, date: '2023-01-01' }
    ];

    mockTransactionService.getTransactions.mockReturnValue(of(mockTransactions));
    fixture.detectChanges();

    const headers = compiled.querySelectorAll('th');

    expect(headers).toHaveLength(3);
    expect(headers[0].textContent).toBe('TransactionName');
    expect(headers[1].textContent).toBe('Beitrag');
    expect(headers[2].textContent).toBe('Datum');
  });

  it('should initialize transactionList signal with empty array', () => {
    expect(component.transactionList()).toEqual([]);
  });

  it('should update transactionList signal when service returns data', () => {
    const mockTransactions = [
      { id: 1, name: 'Salary', amount: 5000, date: '2023-01-01' },
      { id: 2, name: 'Groceries', amount: -100, date: '2023-01-02' }
    ];

    mockTransactionService.getTransactions.mockReturnValue(of(mockTransactions));

    // Créer un nouveau composant avec les nouvelles données mockées
    const newFixture = TestBed.createComponent(AppComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.transactionList()).toEqual(mockTransactions);
  });

  it('should call getTransactions once on component initialization', () => {
    expect(mockTransactionService.getTransactions).toHaveBeenCalledTimes(1);
  });

  it('should have transactionList signal exposed as readonly', () => {
    expect(component.transactionList).toBeDefined();
    expect(typeof component.transactionList).toBe('function');
  });

  it('should handle empty transaction data correctly', () => {
    mockTransactionService.getTransactions.mockReturnValue(of([]));

    const newFixture = TestBed.createComponent(AppComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.transactionList()).toEqual([]);
  });


});
