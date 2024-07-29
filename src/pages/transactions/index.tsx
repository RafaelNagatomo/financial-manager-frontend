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
  SkeletonText,
} from '@chakra-ui/react';
import { TransactionTable } from './TransactionTable';
import { SpendingByCategoryTable } from './SpendingByCategoryTable';
import { UpcomingPaymentsTable } from './UpcomingPaymentsTable';
import FilterButton from '../../components/FilterButton';
import CustomButton from '../../components/CustomButton';
import AddCategoryModal from '../../components/AddCategoryModal';
import AddTransactionModal from '../../components/AddTransactionModal';
import { useTransactions } from '../../contexts/TransactionContext';
import { useCategories } from '../../contexts/CategoryContext';

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const {
    transactions,
    fetchTransactions,
  } = useTransactions();
  const {
    categories,
    fetchCategories,
  } = useCategories();

  const [isCategoryTab, setIsCategoryTab] = useState<boolean>(false);

  const {
    isOpen: isCategoryModalOpen,
    onOpen: openCategoryModal,
    onClose: closeCategoryModal,
  } = useDisclosure();
  const {
    isOpen: isTransactionModalOpen,
    onOpen: openTransactionModal,
    onClose: closeTransactionModal,
  } = useDisclosure();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  return (
    <HStack gap={5} align="stretch">
      <Card layerStyle={colorMode} w={1000}>
        <CardHeader>
          <Flex gap="2">
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
            <TabList fontWeight="bold" w="96.7%" ml={4}>
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
                <SkeletonText
                  noOfLines={8}
                  spacing="3"
                  skeletonHeight="4"
                  isLoaded={!!transactions}
                >
                  <TransactionTable />
                </SkeletonText>
              </TabPanel>
              <TabPanel>
                <SkeletonText
                  noOfLines={8}
                  spacing="3"
                  skeletonHeight="4"
                  isLoaded={!!categories}
                >
                  <SpendingByCategoryTable transactions={transactions} />
                </SkeletonText>
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
                <UpcomingPaymentsTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      <AddCategoryModal isOpen={isCategoryModalOpen} onClose={closeCategoryModal} />
      <AddTransactionModal isOpen={isTransactionModalOpen} onClose={closeTransactionModal} />
    </HStack>
  );
};

export default Transactions;
