import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorMode
  } from '@chakra-ui/react';
import { useCurrency } from '../../hooks/useCurrency'
import { formatAmount } from '../../utils/formatAmount'

export const GoalsTable: React.FC<{
    goals: any[],
    t: (key: string) => string,
  }> = ({
    goals,
    t
  }) => {
    const { currency } = useCurrency()
    const { colorMode } = useColorMode()

    return (
      <Table
        layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
        minW={350}
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
              <Td>{goal.goal}</Td>
              <Td>{formatAmount(goal.goalAmount - goal.raised, currency)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }