import {
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode
} from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useCategories, Category } from '../contexts/CategoryContext'

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
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>, goalImageFile?: File) => Promise<void>;
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
  
    if (data.length === 0) {
      const categoriesResponse = await fetch('http://localhost:3001/categories/');
      const categories = await categoriesResponse.json();
  
      const goalCategory = categories.find((cat: Category) => cat.category_name === 'goals');
      if (goalCategory) {
        const deleteResponse = await fetch(`http://localhost:3001/categories/delete/${goalCategory.id}`, {
          method: 'DELETE',
        });
        if (!deleteResponse.ok) {
          console.error('Failed to delete goals category');
        }
      }
    } else {
      const updatedGoals = data.map((goal: Goal) => ({
        ...goal,
        goal_image: goal.goal_image ? `http://localhost:3001/uploads/${goal.goal_image}` : '',
      }));
      setGoals(updatedGoals);
    }
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      if (goals.length === 0) {
        let categoryExists = categories.some(cat => cat.category_name === 'goals');

        if (!categoryExists) {
          const categoryResponse = await fetch('http://localhost:3001/categories/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
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
      const formData = new FormData();
        formData.append('user_id', "3695f015-9880-4d70-98dc-3610c328357f");
        formData.append('goal_name', goal.goal_name || '');
        formData.append('goal_description', goal.goal_description || '');
        formData.append('goal_amount', goal.goal_amount ? goal.goal_amount.toString() : '0');
        formData.append('amount_raised', goal.amount_raised?.toString() || '0');
        formData.append('goal_date', goal.goal_date ? new Date(goal.goal_date).toISOString() : '');
        formData.append('goal_image', goal.goal_image || '');

        console.log(formData);

      const response = await fetch('http://localhost:3001/goals/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        shortToast(t('goalAddedSuccessfully'), 'success');
        fetchGoals();
      } else {
        const errorText = await response.text()
        console.error(errorText)
        shortToast(t('failedToAddGoal'), 'error');
      }
    } catch (error) {
      console.error(error)
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
    const formData = new FormData();
    formData.append('user_id', "3695f015-9880-4d70-98dc-3610c328357f");
    if (goal.goal_name) {
      formData.append('goal_name', goal.goal_name);
    }
    if (goal.goal_description) {
      formData.append('goal_description', goal.goal_description);
    }
    if (goal.goal_amount !== undefined && goal.goal_amount !== null) {
      formData.append('goal_amount', goal.goal_amount.toString());
    }
    if (goal.amount_raised !== undefined && goal.amount_raised !== null) {
      formData.append('amount_raised', goal.amount_raised.toString());
    }
    if (goal.goal_date) {
      formData.append('goal_date', new Date(goal.goal_date).toISOString());
    }
    if (goal.goal_image) {formData.append('goal_image', goal.goal_image)}

      try {
        const response = await fetch(`http://localhost:3001/goals/edit/${goal.id}`, {
          method: 'PUT',
          body: formData,
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
