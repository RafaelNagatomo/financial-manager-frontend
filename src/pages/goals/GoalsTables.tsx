import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
  } from '@chakra-ui/react';

export const GoalsTable: React.FC<{
    goals: any[],
    t: (key: string) => string,
  }> = ({
    goals,
    t
  }) => (
    <Table variant="striped" w={400} minW={350}>
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
            <Td>{goal.goalAmount - goal.raised}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );