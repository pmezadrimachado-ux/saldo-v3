import { roundMoney } from '../../utils/currency.js';

export function calculateGoalProgress(goal) {
  const targetAmount = Number(goal.targetAmount) || 0;
  const currentAmount = Number(goal.currentAmount) || 0;
  const percentage = targetAmount > 0 ? Math.min(roundMoney((currentAmount / targetAmount) * 100), 100) : 0;
  const remaining = Math.max(roundMoney(targetAmount - currentAmount), 0);
  const daysRemaining = calculateDaysRemaining(goal.targetDate);

  return {
    percentage,
    remaining,
    daysRemaining,
    monthlyRequired: calculateMonthlyRequired(remaining, daysRemaining),
  };
}

export function enrichGoals(goals = []) {
  return goals.map((goal) => ({
    goal,
    progress: calculateGoalProgress(goal),
  }));
}

function calculateDaysRemaining(targetDate) {
  if (!targetDate) return null;

  const today = new Date();
  const target = new Date(`${targetDate}T00:00:00`);
  const diff = Math.ceil((target - today) / 86400000);

  return Math.max(diff, 0);
}

function calculateMonthlyRequired(remaining, daysRemaining) {
  if (daysRemaining === null) return null;
  if (daysRemaining <= 0) return remaining;

  return roundMoney(remaining / Math.max(daysRemaining / 30, 1));
}
