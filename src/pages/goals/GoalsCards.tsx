import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
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
  Box,
  VStack
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency'
import { useGoals, Goal } from '../../contexts/GoalContext';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import AddGoalModal from '../../components/AddGoalModal';
import moment from 'moment';

const GoalsCards: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency()
  const { colorMode } = useColorMode()
  const { goals, deleteGoal } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const isGoalsEmpty = goals.length === 0;

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

  return (
    <>
      {!isGoalsEmpty ? goals.map((goal, index) => (
        <WrapItem key={index}>
          <Card
            layerStyle={colorMode === 'dark' ? 'darkCard' : 'lightCard'}
            gap={5}
            maxW={470}
            p={5}
          >
            <Text fontWeight='bold' fontSize='lg'>{goal.goal_name}</Text>
            <Image
              // src={goal.goal_image}
              src={'https://images.tripadeal.com.au/cdn-cgi/image/format=auto,width=2400/https://cstad.s3.ap-southeast-2.amazonaws.com/4456_19D_Taste_of_Italy_Web.jpg'}
            />
            <HStack gap='0 !important' justify='end'>
              {goal.goal_date && (
                <Box>
                  <Text fontSize={12}>
                    {t('savingsUntil')}: 
                  </Text>
                  <Text fontSize={12}>
                    {moment(goal.goal_date).format('DD/MM/YYYY')}
                  </Text>
                </Box>
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
            <Stack my={4}>
              <LightMode>
                <Progress
                  borderRadius={5}
                  hasStripe
                  value={goal.amount_raised * 100 / goal.goal_amount}
                />
              </LightMode>
              <Text fontSize={12} style={{alignSelf: 'flex-end'}}>
                ({(goal.amount_raised * 100 / goal.goal_amount).toFixed(1)}/100%)
              </Text>
            </Stack>
            <Flex gap={2} fontSize={14}>
              <Text>{t('raised')}</Text>
              <Text>{formatAmount(goal.amount_raised, currency)}</Text>
              <Spacer />
              <Text>{t('amount')}</Text>
              <Text>{formatAmount(goal.goal_amount, currency)}</Text>
            </Flex>
          </Card>
        </WrapItem>
      )) : (
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