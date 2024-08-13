import { useEffect, useState } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type Goal = {
    id: number;
    goal_name: string;
  };

interface GoalSelectProps extends SelectProps {}

const GoalSelect: React.FC<GoalSelectProps> = (props) => {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>();

  useEffect(() => {
    fetch('http://localhost:3001/goals/')
      .then(response => response.json())
      .then(data => {
        setGoals(data);
      })
      .catch(error => console.error('Error fetching goals:', error));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGoal(event.target.value);
  };

  return (
    <Select 
      value={selectedGoal} 
      onChange={handleChange}
      {...props}
    >
      {goals.map((goal) => (
        <option key={goal.id} value={(goal.id)}>
          {t(`${goal.goal_name}`)}
        </option>
      ))}
    </Select>
  );
};

export default GoalSelect;
