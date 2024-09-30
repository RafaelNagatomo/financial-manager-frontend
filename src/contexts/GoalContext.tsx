import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useCategories, Category } from '../contexts/CategoryContext'
import { useAuth } from '../contexts/AuthContext'
import { getAuthHeaders } from '../utils/getAuthHeaders'
import { useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export interface Goal {
  id?: number;
  goal_name?: string;
  goal_description?: string;
  goal_amount?: number;
  amount_raised?: number;
  goal_image?: string;
  goal_date?: string | null;
}

interface GoalContextProps {
  goals: Goal[];
  fetchGoals: () => Promise<Goal[]>;
  addGoal: (goal: Omit<Goal, 'id'>, goalImageFile?: File) => Promise<void>;
  deleteGoal: (goal: Goal) => Promise<void>;
  editGoal: (goal: Goal) => Promise<void>;
}

const GoalContext = createContext<GoalContextProps | undefined>(undefined);

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { shortToast } = useCustomToast();
  const [goals, setGoals] = useState<Goal[]>(
    queryClient.getQueryData<Goal[]>(['goals']) || []
  );
  const { categories, fetchCategories } = useCategories();
  const { user } = useAuth();

  const fetchGoals = useCallback(async () => {
    const cachedGoals = queryClient.getQueryData<Goal[]>(['goals']);
    if (cachedGoals) {
      setGoals(cachedGoals);
      return cachedGoals;
    }

    try {
      const response = await api.get('/goals/', {
        headers: getAuthHeaders(),
        params: { userId: user?.id }
      });
      const goalsResponse = response.data;

      if (goalsResponse.length === 0) {
        const categoriesResponse = await api.get('/categories/', {
          headers: getAuthHeaders(),
          params: { userId: user?.id }
        });
        const categories = await categoriesResponse.data;
    
        const goalCategory = categories.find((cat: Category) => cat.category_name === 'goals');
        if (goalCategory) {
          await api.delete(`/categories/delete/${goalCategory.id}`, {
            headers: getAuthHeaders(),
          });
        }
      } else {
        const updatedGoals = goalsResponse.map((goal: Goal) => ({
          ...goal,
          goal_image: goal.goal_image ? `${process.env.REACT_APP_API_URL}/uploads/${goal.goal_image}` : '',
        }));

        queryClient.setQueryData<Goal[]>(['goals'], updatedGoals);
        setGoals(updatedGoals);
        return updatedGoals;
      }
    } catch (error) {
      shortToast(t('Erro ao buscar metas ou categorias:') + `${error}`, 'error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      if (goals.length === 0) {
        let categoryExists = categories.some(cat => cat.category_name === 'goals');

        if (!categoryExists) {
          await api.post('/categories/add', {
              user_id: user?.id,
              category_name: 'goals',
              max_amount: null
          }, {
            headers: getAuthHeaders(),
          });
          await fetchCategories();
        }
      }
      const formData = new FormData();
        formData.append('user_id', user?.id || '');
        formData.append('goal_name', goal.goal_name || '');
        formData.append('goal_description', goal.goal_description || '');
        formData.append('goal_amount', goal.goal_amount ? goal.goal_amount.toString() : '0');
        formData.append('amount_raised', goal.amount_raised?.toString() || '0');
        formData.append('goal_date', goal.goal_date ? new Date(goal.goal_date).toISOString() : '');
        formData.append('goal_image', goal.goal_image || '');

      const response = await api.post('/goals/add', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        queryClient.setQueryData<Goal[]>(['goals'], (oldGoals = []) => [
          ...oldGoals,
          response.data,
        ]);
        console.log('final', response.data)
        fetchGoals();
        shortToast(t('goalAddedSuccessfully'), 'success');
      } else {
        const errorText = await response.data
        shortToast(t('failedToAddGoal') + `${errorText}`, 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  const deleteGoal = async (goal: Goal) => {
    try {
      const response = await api.delete(`/goals/delete/${goal.id}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        queryClient.setQueryData<Goal[]>(['goals'], (oldGoals = []) =>
          oldGoals.filter(item => item.id !== goal.id)
        );

        setGoals(goals.filter(item => item.id !== goal.id));
        shortToast(t('successfullyDeleted'), 'success');
        fetchGoals()
      } else {
        shortToast(t('failedToDelete'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  const editGoal = async (goal: Goal) => {
    const formData = new FormData();
    formData.append('user_id', user?.id || '');
    if (goal.goal_name) {
      formData.append('goal_name', goal.goal_name);
    }
    if (goal.goal_description) {
      formData.append('goal_description', goal.goal_description);
    }
    if (goal.goal_amount !== undefined && goal.goal_amount !== null) {
      formData.append('goal_amount', goal.goal_amount.toString());
    }
    if (goal.goal_date) {
      formData.append('goal_date', new Date(goal.goal_date).toISOString());
    }
    if (goal.goal_image) {formData.append('goal_image', goal.goal_image)}

      try {
        const response = await api.put(`/goals/edit/${goal.id}`, formData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        });

      if (response.status === 200) {
        queryClient.setQueryData<Goal[]>(['goals'], (oldGoals = []) =>
          oldGoals.map(item =>
            item.id === goal.id
              ? {
                  ...response.data,
                }
              : item
          )
        );

        fetchGoals();
        shortToast(t('goalEditedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToEditGoal'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        fetchGoals,
        addGoal,
        deleteGoal,
        editGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
