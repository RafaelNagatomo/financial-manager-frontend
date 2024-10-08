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
import { motion, AnimatePresence } from 'framer-motion';
import { formatAmount } from '../../utils/formatAmount';
import { useCurrency } from '../../hooks/useCurrency';
import moment from 'moment';
import { useTransactions } from '../../contexts/TransactionContext';

const MotionTr = motion(Tr)

const animationVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: {duration: [0.4], ease: "backIn",}
  },
}

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
        <AnimatePresence>
          {unpaidTransactions.length ? unpaidTransactions.map(transaction => (
            <Tooltip
              key={transaction.id}
              bg={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
              color={colorMode === 'dark' ? 'gray.700' : 'gray.100'}
              layerStyle={colorMode}
              hasArrow
              placement='top'
              label={t('expiredDate')}
              isDisabled={!(transaction.expiration_date < today)}
            >
              <MotionTr
                variants={animationVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                _hover={{
                  backgroundColor: colorMode === 'dark' ? '#323e52' : '#dbe0e6',
                  transition: 'background-color 0.4s ease',
                }}
                sx={transaction.expiration_date < today
                  ? { color: 'red.500', }
                  : {}
                }
              >
                <Td>{transaction.transaction_name}</Td>
                <Td>{formatAmount(transaction.transaction_amount, currency)}</Td>
                <Td>{transaction.expiration_date ? moment(transaction.expiration_date).format('DD/MM/YYYY') : t('noDate')}</Td>
              </MotionTr>
            </Tooltip>
          )) : (
            <Tr>
              <Td colSpan={3} textAlign="center">
                <VStack
                  bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                  color={colorMode === 'dark' ? 'gray.700' : 'gray.400'}
                  h={100}
                  p={5}
                  borderRadius={6}
                  justify='center'
                >
                  <GiBoxUnpacking size={30} />
                  <Text fontWeight='bold' fontSize='lg'>
                    {t('NoData')}
                  </Text>
                </VStack>
              </Td>
            </Tr>
          )}
        </AnimatePresence>
      </Tbody>
    </Table>
  );
};
