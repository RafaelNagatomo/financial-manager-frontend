import { useEffect, useState } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { getAuthHeaders } from '../utils/getAuthHeaders'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api';

type Goal = {
    id: number;
    goal_name: string;
  };

interface GoalSelectProps extends SelectProps {}

const GoalSelect: React.FC<GoalSelectProps> = (props) => {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>();
  const { noticeToast } = useCustomToast();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/goals/', {
      headers: getAuthHeaders(),
      params: { userId: user?.id }
    })
      .then((response) => {
        setGoals(response.data);
      })
      .catch((error) => {
        noticeToast(t('errorFetchingGoals') + `${error}`, 'error')
      });
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
