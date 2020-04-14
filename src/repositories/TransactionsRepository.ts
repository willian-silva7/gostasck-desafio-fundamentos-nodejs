import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const initialBallance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const balance = this.transactions.reduce((acc, transaction) => {
      switch (transaction.type) {
        case 'income':
          return {
            ...acc,
            income: transaction.value + acc.income,
            total: transaction.value + acc.income - acc.outcome,
          };
        case 'outcome':
          return {
            ...acc,
            outcome: transaction.value + acc.outcome,
            total: acc.income - transaction.value - acc.outcome,
          };
        default:
          return acc;
      }
    }, initialBallance);
    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
