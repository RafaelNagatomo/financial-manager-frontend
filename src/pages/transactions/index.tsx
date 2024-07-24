import { useEffect, useState } from 'react';
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
  useDisclosure,
} from '@chakra-ui/react';
import { TransactionTable } from './TransactionTable';
import { SpendingByCategoryTable } from './SpendingByCategoryTable';
import { UpcomingPaymentsTable } from './UpcomingPaymentsTable';
import FilterButton from '../../components/FilterButton';
import CustomButton from '../../components/CustomButton';
import AddCategoryModal from '../../components/AddCategoryModal';
import AddTransactionModal from '../../components/AddTransactionModal';
import useTransactions from '../../hooks/useTransactions';

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const {
    transactions,
    fetchTransactions,
    addTransaction,
  } = useTransactions();

  const [isCategoryTab, setIsCategoryTab] = useState<boolean>(false);

  const {
    isOpen: isCategoryModalOpen,
    onOpen: openCategoryModal,
    onClose: closeCategoryModal
  } = useDisclosure();
  const {
    isOpen: isTransactionModalOpen,
    onOpen: openTransactionModal,
    onClose: closeTransactionModal
  } = useDisclosure();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <HStack gap={5} align='stretch'>
      <Card layerStyle={colorMode} w={1000}>
        <CardHeader>
          <Flex gap='2'>
            <Heading as="h1" size="lg" display="flex" alignItems="center">
              {t('transactions')}
            </Heading>
            <Spacer />
            <FilterButton />
            <CustomButton
              leftIcon={<FaPlus />}
              title={isCategoryTab ? t('newCategory') : t('newTransaction')}
              onClick={isCategoryTab ? openCategoryModal : openTransactionModal}
            />
          </Flex>
        </CardHeader>

        <CardBody>
          <Tabs variant="enclosed">
            <TabList fontWeight='bold' w='95%' ml={5}>
              <Tab
                _selected={{ color: 'purple.500', bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
                onClick={() => setIsCategoryTab(false)}
              >
                {t('transactions')}
              </Tab>
              <Tab
                _selected={{ color: 'purple.500', bg: colorMode === 'dark' ? 'gray.700' : 'gray.100' }}
                onClick={() => setIsCategoryTab(true)}
              >
                {t('spendingByCategory')}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <TransactionTable
                  transactions={transactions}
                  fetchTransactions={fetchTransactions}
                />
              </TabPanel>
              <TabPanel>
                <SpendingByCategoryTable t={t} />
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
                <UpcomingPaymentsTable t={t} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
      />
      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        onTransactionAdded={addTransaction}
      />
    </HStack>
  );
};

export default Transactions;
