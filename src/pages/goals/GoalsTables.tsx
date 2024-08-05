import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency'
import { useGoals, Goal } from '../../contexts/GoalContext';

export const GoalsTable: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency()
  const { colorMode } = useColorMode()
  const { goals, fetchGoals, deleteGoal } = useGoals();

  return (
    <Table
      layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
      variant='unstyled'
      borderRadius={8}
    >
      <Thead>
        <Tr>
          <Th>{t('goal')}</Th>
          <Th>{t('remaining')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {goals.map((goal, index) => (
          <Tr key={index}>
            <Td>{goal.goal_name}</Td>
            <Td>{formatAmount(goal.goal_amount - goal.amount_raised, currency)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}