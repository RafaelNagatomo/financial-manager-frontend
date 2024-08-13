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
  VStack,
  Text
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency'
import { useGoals } from '../../contexts/GoalContext';

export const GoalsOverviewsTable: React.FC = () => {
  const { t } = useTranslation();
  const { currency } = useCurrency()
  const { colorMode } = useColorMode()
  const { goals } = useGoals();
  const isGoalsEmpty = goals.length === 0;

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
        {!isGoalsEmpty ? goals.map((goal, index) => (
          <Tr key={index}>
            <Td>{goal.goal_name}</Td>
            <Td>{formatAmount((goal.goal_amount ?? 0) - (goal.amount_raised ?? 0), currency)}</Td>
          </Tr>
        )) : (
          <Tr>
              <Td colSpan={7} textAlign="center">
                <VStack
                  bg={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
                  color={colorMode === 'dark' ? 'gray.700' : 'gray.400'}
                  h={100}
                  p={5}
                  borderRadius={6}
                  justify='center'
                >
                  <GiBoxUnpacking size={30} />
                  <Text fontWeight='bold' fontSize='md'>
                    {t('NoData')}
                  </Text>
                </VStack>
              </Td>
            </Tr>
        )}
      </Tbody>
    </Table>
  );
}