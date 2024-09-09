import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6"
import { GiBoxUnpacking } from "react-icons/gi";
import {
  Card,
  Image,
  IconButton,
  Text,
  Flex,
  Spacer,
  Progress,
  WrapItem,
  Stack,
  useColorMode,
  LightMode,
  HStack,
  VStack,
  Tooltip,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Icon,
  Box
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency'
import { useGoals, Goal } from '../../contexts/GoalContext';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import AddGoalModal from '../../components/AddGoalModal';
import { useTransactions } from '../../contexts/TransactionContext';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion'

const MotionCard = motion(Card)

const animationVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: {duration: [0.4], ease: "backIn",}
  },
}

const GoalsCards: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency()
  const { colorMode } = useColorMode()
  const { goals, deleteGoal, fetchGoals } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const isGoalsEmpty = goals.length === 0;
  const { transactions, fetchTransactions } = useTransactions();

  const handleDeleteGoal = async () => {
    if (selectedGoal) {
      await deleteGoal(selectedGoal);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddModalOpen(true);
  };

  const getGoalTotal = (goalName: string) => {
    return transactions
      .filter(transaction => transaction.transaction_name === goalName)
      .reduce((total, transaction) => total + Number(transaction.transaction_amount), 0);
  };

  const getCategoryTransactionCount = (goalName: string) => {
    return transactions
      .filter(transaction => transaction.transaction_name === goalName).length;
  };

  useEffect(() => {
    fetchGoals();
    fetchTransactions();
  }, [fetchGoals, fetchTransactions]);

  return (
    <>
      {!isGoalsEmpty ? (
        <AnimatePresence>
          {goals.map((goal, index) => {
            const totalAmount = getGoalTotal((goal.goal_name ?? ''));
            const transactionCount = getCategoryTransactionCount((goal.goal_name ?? ''));
            const goalCompleted = totalAmount >= (goal.goal_amount ?? 0);
            const imageUrl = goal.goal_image 
            ? `${goal.goal_image}` 
            : '/media/placeholder.png';

            return (
              <WrapItem key={index}>
                <MotionCard
                  layerStyle={colorMode === 'dark' ? 'darkCard' : 'lightCard'}
                  gap={5}
                  w={{ base: 370, md: 550, lg: 470}}
                  p={5}
                  variants={animationVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  whileHover={{
                    zIndex: 99,
                    scale: 1.15,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Text
                    fontWeight='bold'
                    fontSize='lg'
                  >
                    <HStack>
                      {goalCompleted && <Icon as={FaCircleCheck} color='green' />}
                      <Text>{goal.goal_name}</Text>
                      <Text>{goalCompleted ? `(${t('completed')})` : ''}</Text>
                    </HStack>
                  </Text>
                  <Box
                    w="100%"
                    h={250}
                    position="relative"
                    overflow="hidden"
                  >
                    <Image
                      w="100%"
                      h="100%"
                      backgroundPosition="center"
                      backgroundRepeat="no-repeat"
                      backgroundSize="cover"
                      position="absolute"
                      src={imageUrl}
                      alt={goal.goal_name || 'Goal Image'}
                    />
                  </Box>
                  <HStack justify='end'>
                    {goal.goal_date && (
                      <>
                        <Text fontSize={13}>
                          {t('savingsUntil')}: 
                        </Text>
                        <Text fontSize={13} mx={2}>
                          {moment(goal.goal_date).format('DD/MM/YYYY')}
                        </Text>
                      </>
                    )}
                    <Spacer />
                    <IconButton
                      variant='ghost'
                      aria-label={t('edit')}
                      _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                      icon={<FaRegEdit size={20} color='#3a9e64' />}
                      onClick={() => handleEditGoal(goal)}
                    />
                    <IconButton
                      variant='ghost'
                      aria-label={t('delete')}
                      _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                      icon={<FaRegTrashAlt size={20} color='#b94a4a' />}
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </HStack>
                  <Text fontSize='md'>{goal.goal_description}</Text>
                  <Tooltip
                    bg={goalCompleted ? 'green.600' : ''}
                    hasArrow
                    placement='top'
                    label={
                      <Stack gap={1}>
                        <Heading size='sm' my={1}>{goal.goal_name}</Heading>
                        <Table size="xs" variant='unstyled'>
                          <Tbody>
                            <Tr>
                              <Td>{t('totalRaisedToDate')}</Td>
                              <Td>{formatAmount(totalAmount, currency)}</Td>
                            </Tr>
                            <Tr>
                              <Td>{t('stipulatedGoalValue')}</Td>
                              <Td>{formatAmount((goal.goal_amount ?? 0), currency)}</Td>
                            </Tr>
                            <Tr>
                              <Td>{t('linkedTransaction', { count: transactionCount })}</Td>
                              <Td>{transactionCount === 0 ? '' : transactionCount}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Stack>
                    }
                  >
                    <Stack my={4}>
                      <LightMode>
                        <Progress
                          borderRadius={5}
                          hasStripe
                          colorScheme={goalCompleted ? 'green' : 'purple'}
                          value={(goal.amount_raised ?? 0) * 100 / (goal.goal_amount ?? 0)}
                        />
                      </LightMode>
                      <Text fontSize={12} style={{alignSelf: 'flex-end'}}>
                        ({((goal.amount_raised ?? 0) * 100 / (goal.goal_amount ?? 0)).toFixed(1)}/100%)
                      </Text>
                    </Stack>
                  </Tooltip>
                  <Flex gap={2} fontSize={14}>
                    <Text>{t('raised')}</Text>
                    <Text>{formatAmount((goal.amount_raised ?? 0), currency)}</Text>
                    <Spacer />
                    <Text>{t('goalAmount')}</Text>
                    <Text>{formatAmount((goal.goal_amount ?? 0), currency)}</Text>
                  </Flex>
                </MotionCard>
              </WrapItem>
            )
          })}
        </AnimatePresence>
      ) : (
        <VStack
          bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
          color={colorMode === 'dark' ? 'gray.700' : 'gray.400'}
          h={150}
          w='100%'
          p={5}
          borderRadius={6}
          justify='center'
        >
          <GiBoxUnpacking size={30} />
          <Text fontWeight='bold' fontSize='md'>
            {t('NoData')}
          </Text>
        </VStack>
      )}

      {selectedGoal && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteGoal}
          type='goal'
        />
      )}

      {selectedGoal && (
        <AddGoalModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          goal={selectedGoal}
        />
      )}
    </>
  )
}

export default GoalsCards