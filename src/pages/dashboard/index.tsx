import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward, IoIosArrowBack  } from "react-icons/io";
import moment from 'moment';
import {
  Card,
  Flex,
  Spacer,
  Heading,
  HStack,
  Text,
  useColorMode,
  Stack,
  Grid,
  GridItem,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  IconButton,
  Center,
  VStack,
  Button,
  LightMode,
} from '@chakra-ui/react';
import { useCurrency } from '../../hooks/useCurrency';
import { formatAmount } from '../../utils/formatAmount'
import CustomSelect from '../../components/CustomSelect';
import {
  getCategoryTotal,
  getTransactionsTotal,
  getTransactionsPaidTotal
} from '../../utils/getTotals'
import { generateMonthlyData } from '../../utils/getTotalByDate'
import { useGoals } from '../../contexts/GoalContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { useCategories } from '../../contexts/CategoryContext';

import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import DoughnutChart from './charts/DoughnutChart';

const Dashboard: React.FC = () =>  {
  const { t } = useTranslation()
  const { currency } = useCurrency();
  const { colorMode }  = useColorMode();
  const { categories, fetchCategories } = useCategories();
  const { goals, fetchGoals } = useGoals();
  const { transactions, fetchTransactions } = useTransactions();
  const [translateX, setTranslateX] = useState(0);
  const [pieChartColors, setPieChartColors] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const incomesTotal = getCategoryTotal('income', transactions)
  const expensesTotal = getTransactionsTotal('expense', transactions)
  const goalsAmountTotal = goals.reduce((total, goal) => total + Number(goal.goal_amount), 0)

  const categoriesArray = Object.values(categories)
  const itemWidth = 288;
  const visibleItems = 3;
  const maxTranslateX = -(itemWidth * (categoriesArray.length - visibleItems));

  const categoryBalance = categories
    .filter(category => category.category_name !== 'goals')
    .map(category => category.max_amount - getCategoryTotal(category.category_name, transactions))

  const years: number[] = Array.from(
    new Set(transactions.map(transaction => moment(transaction.created_at).year()))
  )

  const generateColors = (numColors: number, resetColors: boolean = false): string[] => {
    const letters = '123456789ABCDE'
    const existingColors = resetColors
    ? new Set<string>()
    : new Set<string>(JSON.parse(localStorage.getItem('generatedColors') || '[]'))
  
    while (existingColors.size < numColors) {
      const color = '#' + Array.from({ length: 6 },
        () => letters[Math.floor(Math.random() * letters.length)]).join('')
      existingColors.add(color)
    }
    const colorsArray = Array.from(existingColors)
    localStorage.setItem('generatedColors', JSON.stringify(colorsArray))
    return colorsArray
  }

  const handleResetColors = () => {
    const colors = generateColors(categories.length, true)
    setPieChartColors(colors)
  }  

  const handleArrowClick = (direction: any) => {
    setTranslateX((prev) => {
      const newValue =
        direction === 'right'
          ? Math.max(prev - itemWidth, maxTranslateX)
          : Math.min(prev + itemWidth, 0);
      return newValue;
    });
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(Number(value));
  };

  const lineData = {
    labels: [
      t('January'), t('February'), t('March'), t('April'), t('May'),
      t('June'), t('July'), t('August'), t('September'),
      t('October'), t('November'), t('December')
    ],
    datasets: [
      {
        label: t('incomes'),
        data: generateMonthlyData(transactions, 'income', selectedYear ?? undefined),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: t('expenses'),
        data: generateMonthlyData(transactions, 'expense', selectedYear ?? undefined),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const pieData = {
    labels: categories
      .filter(category => category.category_name !== 'goals')
      .map(category => t(category.category_name)),
    datasets: [
      {
        label: t('balance'),
        data: categoryBalance,
        backgroundColor: pieChartColors,
      },
    ],
  };

  const dougnutIncomeData = {
    labels: [t('paid'), t('notPaid')],
    datasets: [
      {
        label: t(''),
        data: [
          getTransactionsPaidTotal('income', true, transactions),
          getTransactionsPaidTotal('income', false, transactions)
        ],
        backgroundColor: [
          'rgba(54, 163, 235, 0.555)',
          'rgba(255, 99, 133, 0.589)'
        ],
      },
    ],
  };

  const dougnutExpenseData = {
    labels: [t('paid'), t('notPaid')],
    datasets: [
      {
        label: t(''),
        data: [
          getTransactionsPaidTotal('expense', true, transactions),
          getTransactionsPaidTotal('expense', false, transactions)
        ],
        backgroundColor: [
          'rgba(54, 163, 235, 0.555)',
          'rgba(255, 99, 133, 0.589)'
        ],
      },
    ],
  };

  const dougnutSavingsData = {
    labels: [t('income'), t('expense')],
    datasets: [
      {
        label: t(''),
        data: [
          getTransactionsPaidTotal('income', true, transactions),
          getTransactionsPaidTotal('expense', true, transactions)
        ],
        backgroundColor: [
          'rgba(54, 163, 235, 0.555)',
          'rgba(255, 99, 133, 0.589)'
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      },
    },
  };

  const optionsDisplay = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: false,
      },
    },
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    }
  };

  useEffect(() => {
    const colors = generateColors(categories.length)
    const filteredColors = categories
      .filter(category => category.category_name !== 'goals')
      .map((_, index) => colors[index])
  
    setPieChartColors(filteredColors)
  }, [categories]);

  useEffect(() => {
    fetchGoals();
    fetchTransactions();
    fetchCategories();
  }, [fetchGoals, fetchTransactions, fetchCategories]);

  return (
    <Stack w='calc(100% - 100px)' h='100%'>
      <Heading as="h1" size="lg">
        {t('dashboard')}
      </Heading>
      <Grid
        h='100%'
        w='100%'
        templateRows='repeat(4, 1fr)'
        templateColumns='repeat(3, 1fr)'
        borderRadius={8}
        gap={4}
      >
        <GridItem
          borderRadius={8}
          rowSpan={1}
          colSpan={1}
          layerStyle={colorMode}
          boxShadow='rgba(0, 0, 0, 0.39) 0px 3px 8px'
        >
          <HStack  py='15px' px='80px'>
            <Stat>
              <Stack gap={2}>
                <StatLabel fontSize='20px'>
                  {t('incomes')}
                </StatLabel>
                <StatNumber fontSize='40px'>
                  {formatAmount(incomesTotal, currency)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type='increase' />
                  100.00%
                </StatHelpText>
              </Stack>
            </Stat>

            <VStack>
              <Text fontSize='12px'>{t('paidNotpaid')}</Text>
              <Box w={81} h={81}>
                <DoughnutChart data={dougnutIncomeData} options={options} />
              </Box>
            </VStack>
          </HStack>
        </GridItem>

        <GridItem
          borderRadius={8}
          rowSpan={1}
          colSpan={1}
          layerStyle={colorMode}
          boxShadow='rgba(0, 0, 0, 0.39) 0px 3px 8px'
        >
          <HStack  py='15px' px='80px'>
            <Stat>
              <Stack gap={2}>
                <StatLabel fontSize='20px'>
                  {t('expenses')}
                </StatLabel>
                <StatNumber fontSize='40px'>
                  {formatAmount(expensesTotal, currency)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type='decrease' />
                  {(expensesTotal * 100 / incomesTotal).toFixed(2)}%
                </StatHelpText>
              </Stack>
            </Stat>

            <VStack>
              <Text fontSize='12px'>{t('paidNotpaid')}</Text>
              <Box w={81} h={81}>
                <DoughnutChart data={dougnutExpenseData} options={options} />
              </Box>
            </VStack>
          </HStack>
        </GridItem>

        <GridItem
          borderRadius={8}
          rowSpan={1}
          colSpan={1}
          layerStyle={colorMode}
          boxShadow='rgba(0, 0, 0, 0.39) 0px 3px 8px'
        >
          <HStack  py='15px' px='80px'>
            <Stat>
              <Stack gap={2}>
                <StatLabel fontSize='20px'>
                  {t('savings')}
                </StatLabel>
                <StatNumber fontSize='40px'>
                  {formatAmount(incomesTotal - expensesTotal, currency)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={incomesTotal > expensesTotal ? 'increase' : 'decrease'} />
                  {((incomesTotal - expensesTotal) * 100 / incomesTotal).toFixed(2)}%
                </StatHelpText>
              </Stack>
            </Stat>

            <VStack>
              <Text fontSize='12px'>{t('transactions')}</Text>
              <Box w={81} h={81}>
                <DoughnutChart data={dougnutSavingsData} options={options} />
              </Box>
            </VStack>
          </HStack>
        </GridItem>

        <GridItem
          p='15px'
          borderRadius={8}
          colSpan={2}
          layerStyle={colorMode}
          boxShadow='rgba(0, 0, 0, 0.39) 0px 3px 8px'
        >
          <Heading size="md" mb={2}>
            {t('spendingByCategory')}
          </Heading>
          <Center position="relative">
            <Flex
              overflow="hidden"
              w="95%"
            >
              <HStack
                transform={`translateX(${translateX}px)`}
                transition="transform 0.3s ease-in-out"
                whiteSpace="nowrap"
              >
                {categories.map((category, index) => {
                  const totalAmount = getCategoryTotal(category.category_name, transactions);
                  const barData = {
                    labels: [''],
                    datasets: [
                      {
                        label: t('Total Gasto'),
                        data: [totalAmount],
                        backgroundColor: 'rgba(255, 99, 133, 0.589)',
                      },
                      {
                        label: t('Total Restante'),
                        data: [
                          category.category_name === 'goals'
                          ? goalsAmountTotal - totalAmount
                          : category.max_amount - totalAmount
                        ],
                        backgroundColor: 'rgba(54, 163, 235, 0.555)',
                      },
                    ],
                  };

                  return (
                    <Card
                      key={index}
                      p='0 30px'
                      my='4px'
                      w={280}
                      h={100}
                      justify='center'
                      layerStyle={colorMode === 'dark' ? 'darkCard' : 'lightCard'}
                      flexShrink={0}
                      boxShadow='rgba(0, 0, 0, 0.178) 4px 2px 2px'
                    >
                      <HStack>
                        <VStack>
                          <Heading size="16px">
                            {`${t(category.category_name)}`}
                          </Heading>
                          <Text fontSize='15px'>
                            {formatAmount(totalAmount, currency)}
                          </Text>
                        </VStack>
                        <Spacer />
                        <Box w={150} h={50}>
                          <BarChart data={barData} options={barOptions} />
                        </Box>
                      </HStack>
                    </Card>
                  )
                })}
              </HStack>
            </Flex>
              <IconButton
                icon={
                  <IoIosArrowBack
                    size={30}
                    color={colorMode === 'dark' ? '#d9d9e0' : '#3f3f3f'}
                  />
                }
                position="absolute"
                left="-8px"
                h='100%'
                top="50%"
                transform="translateY(-50%)"
                onClick={() => handleArrowClick('left')}
                variant="outline"
                border="none"
                zIndex={1}
                isDisabled={translateX === 0 || categories.length < 3}
                transition="opacity 0.4s"
                aria-label={''}
              />
              <IconButton
                icon={
                  <IoIosArrowForward
                    size={30}
                    color={colorMode === 'dark' ? '#d9d9e0' : '#3f3f3f'}
                  />
                }
                position="absolute"
                right="-8px"
                h='100%'
                top="50%"
                transform="translateY(-50%)"
                onClick={() => handleArrowClick('right')}
                variant="outline"
                border="none"
                zIndex={1}
                isDisabled={translateX === maxTranslateX || categories.length < 3}
                transition="opacity 0.4s"
                aria-label={''}
              />
          </Center>
        </GridItem>
          
        <GridItem
          borderRadius={8}
          rowSpan={3}
          colSpan={1}
          layerStyle={colorMode}
          boxShadow='rgba(0, 0, 0, 0.39) 0px 3px 8px'
        >
          <Stack p={4} h='100%'>
            <HStack align='stretch'>
              <Heading size="md" mb={4}>
                {t('balanceByCategory')}
              </Heading>
              <Spacer />
              <LightMode>
                <Button onClick={handleResetColors}>
                  {t('resetColors')}
                </Button>
              </LightMode>
            </HStack>
            <Box w='100%' h='100%'>
              <PieChart data={pieData} options={optionsDisplay} />
            </Box>
          </Stack>
        </GridItem>
        
        <GridItem
          borderRadius={8}
          rowSpan={2}
          colSpan={2}
          layerStyle={colorMode}
          boxShadow='rgba(0, 0, 0, 0.39) 0px 3px 8px'
        >
          <Stack p={4} h='100%'>
            <HStack>
              <Heading size="md" mb={4}>
                {t('monthlyBalance')}
              </Heading>
              <Spacer />
              <CustomSelect
                h={35}
                placeholder={t('selectYear')}
                options={years.map(year => ({ value: year.toString(), label: year.toString() }))}
                onChange={(e) => handleYearChange(e.target.value)}
                value={selectedYear?.toString() || ''}
              />
            </HStack>
            <Box w='100%' h='100%'>
              <LineChart data={lineData} options={optionsDisplay} />
            </Box>
          </Stack>
        </GridItem>

      </Grid>
    </Stack>
  )
}

export default Dashboard