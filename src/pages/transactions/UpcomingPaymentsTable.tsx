import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency';

export const UpcomingPaymentsTable: React.FC<{
    upcomingPayments: any[],
    t: (key: string) => string,
  }> = ({
    upcomingPayments,
    t
  }) => {
    const { currency } = useCurrency()
    const { colorMode }  = useColorMode();
  
    return (
      <Table
        layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
        variant="unstyled"
        minW={350}
        borderRadius={8}
      >
        <Thead>
          <Tr>
            <Th>{t('description')}</Th>
            <Th>{t('amount')}</Th>
            <Th>{t('expireDate')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {upcomingPayments.map((item, index) => (
            <Tr key={index}>
              <Td>{item.description}</Td>
              <Td>{formatAmount(item.amount, currency)}</Td>
              <Td>{item.expirateDate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };