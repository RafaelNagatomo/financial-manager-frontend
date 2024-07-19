import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Stack,
  Text,
  useColorMode,
  LightMode,
  IconButton,
} from '@chakra-ui/react';
import { formatAmount } from '../../utils/formatAmount'
import { useCurrency } from '../../hooks/useCurrency';

export const SpendingByCategoryTable: React.FC<{
    spendingByCategory: any[],
    t: (key: string) => string,
  }> = ({
    spendingByCategory,
    t
  }) => {
    const { currency } = useCurrency()
    const { colorMode }  = useColorMode();
  
    return (
      <Table
        layerStyle={colorMode === 'dark' ? 'darkTable' : 'lightTable'}
        variant="unstyled"
        w={700}
        minW={350}
        borderRadius={8}
      >
        <Thead>
          <Tr>
            <Th>{t('title')}</Th>
            <Th>{t('maxAmount')}</Th>
            <Th w={250}>{t('progress')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {spendingByCategory.map((item, index) => (
            <Tr key={index}>
              <Td>{item.category_name}</Td>
              <Td>{formatAmount(item.max_amount, currency)}</Td>
              <Td>
                <Stack>
                  <LightMode>
                    <Progress
                      borderRadius={5}
                      hasStripe
                      value={item.max_amount}
                    />
                  </LightMode>
                  <Text fontSize={11} style={{alignSelf: 'flex-end'}}>
                    ({(10).toFixed(1)}/100%)
                  </Text>
                </Stack>
              </Td>
              <Td>
                <Stack spacing={2} direction='row'>
                  <IconButton
                    variant='ghost'
                    aria-label='Edit'
                    _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                    icon={<FaRegEdit size={22} color='#3a9e64'/>}
                  />
                  <IconButton
                    variant='ghost'
                    aria-label='Trash'
                    _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.300' }}
                    icon={<FaRegTrashAlt size={22} color='#b94a4a'/>}
                  />
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }
  