import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa6';
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Spacer,
  Heading,
  Stack,
  Wrap,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import CustomButton from '../../components/CustomButton'
import { GoalsOverviewsTable } from './GoalsOverviewsTable'
import GoalsCards from './GoalsCards';
import { useGoals } from '../../contexts/GoalContext';
import { useTransactions } from '../../contexts/TransactionContext';
import AddGoalModal from '../../components/AddGoalModal';

const Goals: React.FC = () =>  {
  const { t } = useTranslation()
  const { colorMode }  = useColorMode();
  const { fetchGoals } = useGoals();
  const { fetchTransactions } = useTransactions();

  const {
    isOpen: isGoalModalOpen,
    onOpen: openGoalModal,
    onClose: closeGoalModal,
  } = useDisclosure();

  useEffect(() => {
    fetchGoals();
    fetchTransactions();
  }, [fetchGoals, fetchTransactions]);

  return (
    <Stack
      gap={5}
      align='stretch'
      direction={{ base: 'column', md: 'column', lg: 'row' }}
    >
      <Card
        layerStyle={colorMode}
        w={{base: 400, md: 600, lg: 1000}}
      >
        <CardHeader>
          <Flex gap='2'>
            <Heading
              as="h1"
              size="lg"
              display="flex"
              alignItems="center"
            >
              {t('goals')}
            </Heading>
            <Spacer />
            <CustomButton
              w={180}
              leftIcon={<FaPlus/>}
              title={t('newGoal')}
              onClick={openGoalModal}
            />
          </Flex>
        </CardHeader>

        <CardBody>
          <Wrap spacing={5} >
            <GoalsCards />
          </Wrap>
        </CardBody>
      </Card>

      <Card layerStyle={colorMode} w={{base: 400, md: 600, lg: 360}}>
        <CardHeader>
          <Flex>
            <Heading
              as="h1"
              size="lg"
            >
              {t('overview')}
            </Heading>
          </Flex>
        </CardHeader>

        <CardBody>
          <GoalsOverviewsTable />
        </CardBody>
      </Card>

      <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={closeGoalModal}
      />
    </Stack>
  )
}

export default Goals