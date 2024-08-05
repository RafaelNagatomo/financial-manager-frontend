import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Image,
  Badge,
  Text,
  Flex,
  Spacer,
  Progress,
  WrapItem,
  Stack,
  useColorMode,
  LightMode
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency'
import { useGoals, Goal } from '../../contexts/GoalContext';

const GoalsCards: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency()
  const { colorMode } = useColorMode()
  const { goals, fetchGoals, deleteGoal } = useGoals();

  return (
    <>
      {goals.map((goal, index) => (
        <WrapItem key={index}>
          <Card
            layerStyle={colorMode === 'dark' ? 'darkCard' : 'lightCard'}
            gap={5}
            w={350}
            p={5}
          >
            <Text fontWeight='bold' fontSize='lg'>{goal.goal_name}</Text>
            <Image
              // src={goal.goal_image}
              src={'https://images.tripadeal.com.au/cdn-cgi/image/format=auto,width=2400/https://cstad.s3.ap-southeast-2.amazonaws.com/4456_19D_Taste_of_Italy_Web.jpg'}
            />
            {/* <Badge size='sm' w={100} variant='solid' colorScheme='purple'>{2} Month left</Badge> */}
            <Text fontWeight='bold' fontSize='lg'>{goal.goal_name}</Text>
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
      ))}
    </>
  )
}

export default GoalsCards