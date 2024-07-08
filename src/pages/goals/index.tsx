import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Spacer,
  Heading,
  HStack,
  Tabs,
  TabPanels,
  TabPanel,
  Wrap,
  Box,
  Stack
} from '@chakra-ui/react';
import FilterButton from '../../components/FilterButton'
import AddButton from '../../components/AddButton'
import { GoalsTable } from './GoalsTables'
import GoalsCards from './GoalsCards';



const Goals: React.FC = () =>  {
  const { t } = useTranslation()

  const initialGoals = [
    {
      url: 'https://i0.wp.com/remoteandafloat.com/wp-content/uploads/2019/08/travel-scuba-gear-essentials.jpg?w=900&ssl=1',
      goal: 'Dive Equipments',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus officiis alias officia nam rem.',
      raised: 124,
      goalAmount: 3000
    },
    {
      url: 'https://images.tripadeal.com.au/cdn-cgi/image/format=auto,width=2400/https://cstad.s3.ap-southeast-2.amazonaws.com/4456_19D_Taste_of_Italy_Web.jpg',
      goal: 'Visit Italy',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus officiis alias officia nam rem.',
      raised: 2355,
      goalAmount: 5000
    },
    {
      url: 'https://lilianaandliam.com/cdn/shop/products/asset_782_transformation_10609_ceaa4511-ea6e-4faa-83ce-273298fe6efc.jpg?v=1671473518&width=600',
      goal: 'Present',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus officiis alias officia nam rem.',
      raised: 205,
      goalAmount: 340
    },
  ];

  const [goals] = useState(initialGoals);
  
  return (
    <HStack gap={5} align='stretch'>
      <Card bg="gray.100">
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
            <AddButton title={t('newGoal')} />
          </Flex>
        </CardHeader>

        <CardBody>
          <Wrap spacing={5} justify='center'>
            <GoalsCards goals={goals} t={t} />
          </Wrap>
        </CardBody>
      </Card>

      <Card bg="gray.100">
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
          <Tabs variant="enclosed">

            <TabPanels bg="white">
              <TabPanel>
                <GoalsTable goals={goals} t={t} />
              </TabPanel>
            </TabPanels>

          </Tabs>
        </CardBody>
      </Card>
  </HStack>
  )
}

export default Goals