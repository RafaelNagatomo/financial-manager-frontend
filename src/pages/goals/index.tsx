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
  HStack,
  Wrap,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import FilterButton from '../../components/FilterButton'
import CustomButton from '../../components/CustomButton'
import { GoalsTable } from './GoalsTables'
import GoalsCards from './GoalsCards';
import { useGoals } from '../../contexts/GoalContext';
import AddGoalModal from '../../components/AddGoalModal';

const Goals: React.FC = () =>  {
  const { t } = useTranslation()
  const { colorMode }  = useColorMode();
  const { fetchGoals } = useGoals();

  const {
    isOpen: isGoalModalOpen,
    onOpen: openGoalModal,
    onClose: closeGoalModal,
  } = useDisclosure();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return (
    <HStack gap={5} align='stretch'>
      <Card layerStyle={colorMode} w={1000}>
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
            <FilterButton />
            <CustomButton
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

      <Card layerStyle={colorMode} w={360}>
        <CardHeader>
          <Flex>
            <Heading
              as="h1"
              size="lg"
            >
              {t('overview')}
            </Heading>
            <Spacer />
            <FilterButton />
          </Flex>
        </CardHeader>

        <CardBody>
          <GoalsTable />
        </CardBody>
      </Card>

      <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={closeGoalModal}
      />
    </HStack>
  )
}

export default Goals