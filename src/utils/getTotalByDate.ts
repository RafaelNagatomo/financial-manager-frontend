import moment from 'moment';
import { Transaction } from "../contexts/TransactionContext";

export const generateMonthlyData = (transactions: Transaction[], type: string, year?: number) => {
  const targetYear = year ?? new Date().getFullYear()

  return Array.from({ length: 12 }, (_, month) => {
    return transactions
      .filter(transaction => {
        const date = moment(transaction.created_at)
        return (
          date.month() === month
          && date.year() === targetYear
          && transaction.transaction_type === type
        )
      })
      .reduce((total, transaction) => total + Number(transaction.transaction_amount), 0)
  })
}
