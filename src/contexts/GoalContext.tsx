import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useCategories } from '../contexts/CategoryContext'

export interface Goal {
  id: string;
  goal_name: string;
  goal_description: string;
  goal_amount: number;
  amount_raised: number;
  goal_image: string;
  goal_date: string;
}

interface GoalContextProps {
  goals: Goal[];
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  deleteGoal: (goal: Goal) => Promise<void>;
  editGoal: (goal: Goal) => Promise<void>;
}

const GoalContext = createContext<GoalContextProps | undefined>(undefined);

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { shortToast } = useCustomToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const { categories, fetchCategories } = useCategories();

  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
      return [];
    }
  };

  const fetchGoals = useCallback(async () => {
    const data = await fetchData('http://localhost:3001/goals/');
    setGoals(data);
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      if (goals.length === 0) {
        let categoryExists = categories.some(cat => cat.category_name === 'goals');

        if (!categoryExists) {
          const categoryResponse = await fetch('http://localhost:3001/categories/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: "3695f015-9880-4d70-98dc-3610c328357f",
              category_name: 'goals',
              max_amount: null
            }),
          });

          if (!categoryResponse.ok) {
            throw new Error('Failed to add goals category');
          }
          await fetchCategories();
        }
      }
      const data = {
        ...goal,
        user_id: "3695f015-9880-4d70-98dc-3610c328357f",
        expiration_date: goal.goal_date ? new Date(goal.goal_date).toISOString() : null,
        category_name: 'goals'
      };
      const response = await fetch('http://localhost:3001/goals/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        shortToast(t('goalAddedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToAddGoal'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
    }
  };

  const deleteGoal = async (goal: Goal) => {
    try {
      const response = await fetch(`http://localhost:3001/goals/delete/${goal.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setGoals(goals.filter(item => item.id !== goal.id));
        shortToast(t('successfullyDeleted'), 'success');
        fetchGoals()
      } else {
        shortToast(t('failedToDelete'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
    }
  };

  const editGoal = async (goal: Goal) => {
    const data = {
      ...goal,
      user_id: "3695f015-9880-4d70-98dc-3610c328357f",
      expiration_date: goal.goal_date ? new Date(goal.goal_date).toISOString() : null,
    };
    try {
      const response = await fetch(`http://localhost:3001/goals/edit/${goal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        shortToast(t('goalEditedSuccessfully'), 'success');
        fetchGoals();
      } else {
        shortToast(t('failedToEditGoal'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured'), 'error');
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
