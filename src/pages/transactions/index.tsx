import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa6';
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Spacer,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react';
import { TransactionTable, SpendingByCategoryTable, UpcomingPaymentsTable } from './TransactionsTables';
import FilterButton from '../../components/FilterButton';
import CustomButton from '../../components/CustomButton';
import AddCategoryModal from '../../components/AddCategoryModal';
import AddTransactionModal from '../../components/AddTransactionModal';

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const [transactions, setTransactions] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [changeTabCategory, setChangeTabCategory] = useState<boolean>(false);
  
  const { isOpen: isOpenCategory, onOpen: onOpenCategory, onClose: onCloseCategory } = useDisclosure();
  const { isOpen: isOpenTransaction, onOpen: onOpenTransaction, onClose: onCloseTransaction } = useDisclosure();

  const fetchData = async (endpoint: any) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await fetchData('http://localhost:3001/transactions/');
      setTransactions(data);
    };

    const fetchSpendingByCategory = async () => {
      const data = await fetchData('http://localhost:3001/categories/');
      setSpendingByCategory(data);
    };

    fetchTransactions();
    fetchSpendingByCategory();
  }, []);

  return (
    <HStack gap={5} align='stretch'>
      <Card layerStyle={colorMode}>
        <CardHeader>
          <Flex gap='2'>
            <Heading as="h1" size="lg" display="flex" alignItems="center">
              {t('transactions')}
            </Heading>
            <Spacer />
            <FilterButton />
            <CustomButton
              leftIcon={<FaPlus />}
              title={changeTabCategory ? t('newCategory') : t('newTransaction')}
              onClick={changeTabCategory ? onOpenCategory : onOpenTransaction}
            />
          </Flex>
        </CardHeader>

        <CardBody>
          <Tabs variant="enclosed">
            <TabList fontWeight='bold' w='95%' ml={5}>
              <Tab
                _selected={{ color: 'purple.500', bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
                onClick={() => setChangeTabCategory(false)}
              >
                {t('transactions')}
              </Tab>
              <Tab
                _selected={{ color: 'purple.500', bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
                onClick={() => setChangeTabCategory(true)}
              >
                {t('spendingByCategory')}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <TransactionTable transactions={transactions} t={t} />
              </TabPanel>
              <TabPanel>
                <SpendingByCategoryTable spendingByCategory={spendingByCategory} t={t} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      <Card layerStyle={colorMode}>
        <CardHeader>
          <Flex>
            <Heading as="h1" size="lg">
              {t('upcomingPayments')}
            </Heading>
            <Spacer />
            <FilterButton />
          </Flex>
        </CardHeader>

        <CardBody>
          <Tabs variant="enclosed">
            <TabPanels>
              <TabPanel>
                <UpcomingPaymentsTable upcomingPayments={upcomingPayments} t={t} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
      
      <AddCategoryModal isOpen={isOpenCategory} onClose={onCloseCategory} />
      <AddTransactionModal isOpen={isOpenTransaction} onClose={onCloseTransaction} />
    </HStack>
  );
};

export default Transactions;
