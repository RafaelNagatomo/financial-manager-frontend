import { Transaction } from "../contexts/TransactionContext";

export const getCategoryTotal = (categoryName: string, transactions: Transaction[]) => {
    return transactions
      .filter(transaction => transaction.category_name === categoryName)
      .reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
  };

export const getTransactionsTotal = (typeName: string, transactions: Transaction[]) => {
    return transactions
      .filter(transaction => transaction.transaction_type === typeName)
      .reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
  };

  export const getTransactionsPaidTotal = (typeName: string, paidStatus: boolean, transactions: Transaction[]) => {
    return transactions
      .filter(transaction => transaction.transaction_type === typeName && transaction.paid === paidStatus)
      .length;
  };
