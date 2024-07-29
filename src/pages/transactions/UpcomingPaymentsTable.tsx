import { useTranslation } from 'react-i18next';
import { GiBoxUnpacking } from "react-icons/gi";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode,
  Tooltip,
  Text,
  VStack,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount';
import { useCurrency } from '../../hooks/useCurrency';
import moment from 'moment';
import { useTransactions } from '../../contexts/TransactionContext';

const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

export const UpcomingPaymentsTable: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const { colorMode } = useColorMode();
  const { transactions } = useTransactions();
  const unpaidTransactions = transactions.filter(transaction => !transaction.paid);
  const today = getToday();

  return (
    <Table
      layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
      variant="unstyled"
      minW={350}
      borderRadius={8}
    >
      <Thead>
        <Tr>
          <Th>{t('title')}</Th>
          <Th>{t('amount')}</Th>
          <Th>{t('expirationDate')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {unpaidTransactions.length ? unpaidTransactions.map(transaction => (
          <Tooltip
            bg={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
            color={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
            layerStyle={colorMode}
            hasArrow
            placement='top'
            label={t('expiredDate')}
            isDisabled={!(transaction.expiration_date < today)}
          >
            <Tr
              key={transaction.id}
              sx={transaction.expiration_date < today
                ? { color: 'red.500', }
                : {}}
            >
              <Td>{transaction.transaction_name}</Td>
              <Td>{formatAmount(transaction.transaction_amount, currency)}</Td>
              <Td>{moment(transaction.expiration_date).format('DD/MM/YYYY')}</Td>
            </Tr>
          </Tooltip>
          )) : (
          <Tr>
            <Td colSpan={3} textAlign="center">
              <VStack
                bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                color={colorMode === 'dark' ? 'gray.700' : 'gray.400'}
                h={200}
                p={5}
                borderRadius={6}
                spacing={8}
                justify='center'
              >
                <GiBoxUnpacking size={50} />
                <Text fontWeight='bold' fontSize='lg'>
                  {t('NoData')}
                </Text>
              </VStack>
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
