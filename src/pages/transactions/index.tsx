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
  Stack,
  useColorMode,
  useDisclosure,
  SkeletonText,
} from '@chakra-ui/react';
import { TransactionTable } from './TransactionTable';
import { SpendingByCategoryTable } from './SpendingByCategoryTable';
import { UpcomingPaymentsTable } from './UpcomingPaymentsTable';
import CustomButton from '../../components/CustomButton';
import AddCategoryModal from '../../components/AddCategoryModal';
import AddTransactionModal from '../../components/AddTransactionModal';
import { useTransactions } from '../../contexts/TransactionContext';
import { useCategories } from '../../contexts/CategoryContext';

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const { transactions, fetchTransactions } = useTransactions();
  const { fetchCategories } = useCategories();
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTransactions(), fetchCategories()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchTransactions, fetchCategories]);

  return (
    <Stack
      gap={5}
      align="stretch"
      direction={{ base: 'column', md: 'column', lg: 'row' }}
      w={{ base: '100%', xl: '90%' }}
      alignItems={{ base: 'center', xl: 'stretch' }}
    >
      <Card layerStyle={colorMode} w={{ xs: '100%', sm: 390, md: 800, lg: 1000 }} >
        <CardHeader>
          <Flex gap="2">
            <Heading
              as="h1"
              size="lg"
              display="flex"
              alignItems="center"
            >
              {t('transactions')}
            </Heading>
            <Spacer />
            <CustomButton
              w={180}
              leftIcon={<FaPlus />}
              title={isCategoryTab ? t('newCategory') : t('newTransaction')}
              onClick={isCategoryTab ? openCategoryModal : openTransactionModal}
            />
          </Flex>
        </CardHeader>

        <CardBody p={{ base: 1 }}>
          <Tabs variant="enclosed">
            <TabList fontWeight="bold" w="96.7%" ml={4}>
              <Tab
                _selected={{
                  color: 'purple.500',
                  bg: colorMode === 'dark' ? 'gray.700' : 'gray.100'
                }}
                onClick={() => setIsCategoryTab(false)}
              >
                {t('transactions')}
              </Tab>
              <Tab
                _selected={{
                  color: 'purple.500',
                  bg: colorMode === 'dark' ? 'gray.700' : 'gray.100'
                }}
                onClick={() => setIsCategoryTab(true)}
              >
                {t('spendingByCategory')}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={{ xs: 0, sm: 4 }}>
                <SkeletonText
                  noOfLines={8}
                  spacing="3"
                  skeletonHeight="4"
                  isLoaded={!isLoading}
                >
                  <TransactionTable />
                </SkeletonText>
              </TabPanel>
              <TabPanel>
                <SkeletonText
                  noOfLines={8}
                  spacing="3"
                  skeletonHeight="4"
                  isLoaded={!isLoading}
                >
                  <SpendingByCategoryTable transactions={transactions} />
                </SkeletonText>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      <Card layerStyle={colorMode} w={{ base: '100%', md: 800, lg: 435 }} >
        <CardHeader>
          <Flex>
            <Heading as="h1" size="lg">
              {t('upcomingPayments')}
            </Heading>
          </Flex>
        </CardHeader>

        <CardBody px={{ xs: 1, sm: 4 }}>
          <UpcomingPaymentsTable />
        </CardBody>
      </Card>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
      />
      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
      />
    </Stack>
  );
};

export default Transactions;
