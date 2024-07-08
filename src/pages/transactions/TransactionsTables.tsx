import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Switch,
} from '@chakra-ui/react';

export const TransactionTable: React.FC<{
  transactions: any[],
  t: (key: string) => string,
}> = ({
  transactions,
  t
}) => (
  <Table variant="striped" w={700} minW={350}>
    <Thead>
      <Tr>
        <Th>{t('description')}</Th>
        <Th>{t('category')}</Th>
        <Th>{t('tag')}</Th>
        <Th>{t('paid')}</Th>
        <Th>{t('amount')}</Th>
      </Tr>
    </Thead>
    <Tbody>
      {transactions.map((transaction, index) => (
        <Tr key={index}>
          <Td>{transaction.description}</Td>
          <Td>{transaction.category}</Td>
          <Td>{transaction.tag}</Td>
          <Td>
            <Switch
              size="sm"
              colorScheme="purple"
              isChecked={transaction.paid}
            />
          </Td>
          <Td>{transaction.amount}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export const SpendingByCategoryTable: React.FC<{
  spendingByCategory: any[],
  t: (key: string) => string,
}> = ({
  spendingByCategory,
  t
}) => (
  <Table variant="striped" w={700} minW={350} >
    <Thead>
      <Tr>
        <Th>{t('description')}</Th>
        <Th>{t('maxAmount')}</Th>
        <Th>{t('progress')}</Th>
      </Tr>
    </Thead>
    <Tbody>
      {spendingByCategory.map((item, index) => (
        <Tr key={index}>
          <Td>{item.description}</Td>
          <Td>{item.maxAmount}</Td>
          <Td>
            <Progress
              bg="purple.100"
              colorScheme="purple"
              borderRadius={3}
              hasStripe
              size="sm"
              value={item.progress}
            />
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export const UpcomingPaymentsTable: React.FC<{
  upcomingPayments: any[],
  t: (key: string) => string,
}> = ({
  upcomingPayments,
  t
}) => (
  <Table variant="striped" minW={350}>
    <Thead>
      <Tr>
        <Th>{t('description')}</Th>
        <Th>{t('amount')}</Th>
        <Th>{t('expireDate')}</Th>
      </Tr>
    </Thead>
    <Tbody>
      {upcomingPayments.map((item, index) => (
        <Tr key={index}>
          <Td>{item.description}</Td>
          <Td>{item.amount}</Td>
          <Td>{item.expirateDate}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);
