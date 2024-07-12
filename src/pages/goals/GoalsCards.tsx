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
import { useCurrency } from '../../hooks/useCurrency'
import { formatAmount } from '../../utils/formatAmount'

const GoalsCards: React.FC<{
  goals: any[],
  t: (key: string) => string,
}> = ({
  goals,
  t
}) => {
  const { currency } = useCurrency()
  const { colorMode } = useColorMode()

  return (
    <>
      {goals.map((goal, index) => (
        <WrapItem>
          <Card
            layerStyle={colorMode === 'dark' ? 'darkCard' : 'lightCard'}
            key={index}
            gap={5}
            w={350}
            p={5}
          >
            <Image src={goal.url} />
            <Badge size='sm' w={100} variant='solid' colorScheme='purple'>{2} Month left</Badge>
            <Text fontWeight='bold' fontSize='lg'>{goal.goal}</Text>
            <Text fontSize='md'>{goal.description}</Text>
            <Stack my={4}>
              <LightMode>
                <Progress
                  borderRadius={5}
                  hasStripe
                  value={goal.raised * 100 / goal.goalAmount}
                />
              </LightMode>
              <Text fontSize={12} style={{alignSelf: 'flex-end'}}>
                ({(goal.raised * 100 / goal.goalAmount).toFixed(1)}/100%)
              </Text>
            </Stack>
            <Flex gap={2} fontSize={14}>
              <Text>{t('raised')}</Text>
              <Text>{formatAmount(goal.raised, currency)}</Text>
              <Spacer />
              <Text>{t('amount')}</Text>
              <Text>{formatAmount(goal.goalAmount, currency)}</Text>
            </Flex>
          </Card>
        </WrapItem>
      ))}
    </>
  )
}

export default GoalsCards