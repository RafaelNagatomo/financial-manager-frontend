import {
  Card,
  Image,
  Badge,
  Text,
  Flex,
  Spacer,
  Progress,
  WrapItem
} from '@chakra-ui/react';

const GoalsCards: React.FC<{
  goals: any[],
  t: (key: string) => string,
}> = ({
  goals,
  t
}) => {
  return (
    <>
      {goals.map((goal, index) => (
        <WrapItem>
          <Card key={index} bg="white" w={350} gap={5} p={5}>
            <Image src={goal.url} />
            <Badge size='sm' w={100} variant='solid' colorScheme='purple'>{2} Month left</Badge>
            <Text fontWeight='bold' fontSize='lg'>{goal.goal}</Text>
            <Text fontSize='md'>{goal.description}</Text>
            <Progress
              bg="purple.100"
              colorScheme="purple"
              borderRadius={3}
              hasStripe
              size="sm"
              value={goal.raised * 100 / goal.goalAmount}
            />
            <Flex gap={2}>
              <Text>{t('raised')}</Text>
              <Text>{goal.raised}</Text>
              <Spacer />
              <Text>{t('goalAmount')}</Text>
              <Text>{goal.goalAmount}</Text>
            </Flex>
          </Card>
        </WrapItem>
      ))}
    </>
  )
}

export default GoalsCards