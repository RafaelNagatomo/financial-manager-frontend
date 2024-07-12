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
  Stack,
  Text,
  useColorMode,
  LightMode
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency';

export const TransactionTable: React.FC<{
  transactions: any[],
  t: (key: string) => string,
}> = ({
  transactions,
  t
}) => {
  const { currency } = useCurrency()
  const { colorMode }  = useColorMode();
  
  return (
    <Table
      layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
      variant="unstyled"
      w={700}
      minW={350}
      borderRadius={8}
    >
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
              <LightMode>
                <Switch
                  size="sm"
                  isChecked={transaction.paid}
                />
              </LightMode>
            </Td>
            <Td>{formatAmount(transaction.amount, currency)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const SpendingByCategoryTable: React.FC<{
  spendingByCategory: any[],
  t: (key: string) => string,
}> = ({
  spendingByCategory,
  t
}) => {
  const { currency } = useCurrency()
  const { colorMode }  = useColorMode();

  return (
    <Table
      layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
      variant="unstyled"
      w={700}
      minW={350}
      borderRadius={8}
    >
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
            <Td>{formatAmount(item.maxAmount, currency)}</Td>
            <Td>
              <Stack my={4}>
                <LightMode>
                  <Progress
                    borderRadius={5}
                    hasStripe
                    value={item.progress}
                  />
                </LightMode>
                <Text fontSize={12} style={{alignSelf: 'flex-end'}}>
                  ({(item.progress).toFixed(1)}/100%)
                </Text>
              </Stack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export const UpcomingPaymentsTable: React.FC<{
  upcomingPayments: any[],
  t: (key: string) => string,
}> = ({
  upcomingPayments,
  t
}) => {
  const { currency } = useCurrency()
  const { colorMode }  = useColorMode();

  return (
    <Table
      layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
      variant="unstyled"
      minW={350}
      borderRadius={8}
    >
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
            <Td>{formatAmount(item.amount, currency)}</Td>
            <Td>{item.expirateDate}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
