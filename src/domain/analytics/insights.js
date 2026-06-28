import { formatCurrency } from '../../utils/currency.js';

export function generateDashboardInsights(data = {}) {
  return generateFinancialInsights(data).slice(0, 4);
}

export function generateFinancialInsights({
  monthlySummary,
  todayExpenses,
  weekExpenses,
  weekExpensesByDay = [],
  topCategory,
  largestExpense,
  safeDailyBudget,
  budgetsStatus = [],
  categoryRanking = [],

  monthlyEvolution = [],
} = {}) {
  const insights = [];

  if (!monthlySummary || monthlySummary.transactionCount === 0) {
    return [
      {
        title: 'Comece lançando',
        text: 'Registre suas primeiras receitas e despesas para gerar análises úteis.',
        tone: 'neutral',
        priority: 10,
      },
    ];
  }

  if (todayExpenses > 0) {
    insights.push({
      title: 'Gasto de hoje',
      text: `Você já gastou ${formatCurrency(todayExpenses)} hoje.`,
      tone: 'neutral',
      priority: 30,
    });
  } else {
    insights.push({
      title: 'Hoje ainda está limpo',
      text: 'Nenhuma despesa registrada hoje.',
      tone: 'positive',
      priority: 20,
    });
  }

  if (weekExpenses > 0) {
    insights.push({
      title: 'Semana atual',
      text: `Seus gastos da semana estão em ${formatCurrency(weekExpenses)}.`,
      tone: 'neutral',
      priority: 25,
    });
  }

  if (topCategory) {
    insights.push({
      title: 'Categoria principal',
      text: `${topCategory.category.name} representa ${topCategory.percentage}% das despesas do mês.`,
      tone: topCategory.percentage >= 40 ? 'warning' : 'neutral',
      priority: topCategory.percentage >= 40 ? 60 : 35,
    });
  }

  if (largestExpense) {
    insights.push({
      title: 'Maior despesa',
      text: `${largestExpense.description || 'Despesa'} foi seu maior gasto do mês: ${formatCurrency(largestExpense.amount)}.`,
      tone: 'neutral',
      priority: 40,
    });
  }

  if (monthlySummary.netResult >= 0) {
    insights.push({
      title: 'Resultado positivo',
      text: `Seu resultado mensal está positivo em ${formatCurrency(monthlySummary.netResult)}.`,
      tone: 'positive',
      priority: 55,
    });
  } else {
    insights.push({
      title: 'Atenção ao mês',
      text: `Seu resultado mensal está negativo em ${formatCurrency(Math.abs(monthlySummary.netResult))}.`,
      tone: 'warning',
      priority: 80,
    });
  }

  if (safeDailyBudget > 0) {
    insights.push({
      title: 'Ritmo seguro',
      text: `Você pode gastar cerca de ${formatCurrency(safeDailyBudget)} por dia até o fim do mês.`,
      tone: 'positive',
      priority: 45,
    });
  }

  const exceededBudget = budgetsStatus.find((item) => item.status === 'exceeded');
  const warningBudget = budgetsStatus.find((item) => item.status === 'warning');

  if (exceededBudget) {
    insights.push({
      title: 'Orçamento excedido',
      text: `Um orçamento passou do limite em ${formatCurrency(Math.abs(exceededBudget.remaining))}.`,
      tone: 'danger',
      priority: 100,
    });
  } else if (warningBudget) {
    insights.push({
      title: 'Orçamento em atenção',
      text: `Um orçamento já atingiu ${warningBudget.percentage}% do limite.`,
      tone: 'warning',
      priority: 90,
    });
  }

  const strongestWeekday = [...weekExpensesByDay].sort((a, b) => b.total - a.total)[0];

  if (strongestWeekday && strongestWeekday.total > 0) {
    insights.push({
      title: 'Dia mais caro',
      text: `${strongestWeekday.label} é o dia com maior gasto neste mês: ${formatCurrency(strongestWeekday.total)}.`,
      tone: 'neutral',
      priority: 38,
    });
  }

  const previousMonth = monthlyEvolution.length >= 2 ? monthlyEvolution[monthlyEvolution.length - 2] : null;
  const currentMonth = monthlyEvolution.length >= 1 ? monthlyEvolution[monthlyEvolution.length - 1] : null;

  if (previousMonth && currentMonth && previousMonth.expense > 0) {
    const diff = currentMonth.expense - previousMonth.expense;
    const percentage = Math.round((Math.abs(diff) / previousMonth.expense) * 100);

    insights.push({
      title: diff <= 0 ? 'Gasto menor' : 'Gasto maior',
      text: diff <= 0
        ? `Você gastou ${percentage}% menos que no mês anterior.`
        : `Você gastou ${percentage}% mais que no mês anterior.`,
      tone: diff <= 0 ? 'positive' : 'warning',
      priority: diff <= 0 ? 65 : 75,
    });
  }

  if (categoryRanking.length >= 3) {
    const topThreeTotal = categoryRanking.slice(0, 3).reduce((sum, item) => sum + item.total, 0);
    const expenseTotal = monthlySummary.expenseTotal || 1;
    const concentration = Math.round((topThreeTotal / expenseTotal) * 100);

    insights.push({
      title: 'Concentração de gastos',
      text: `Suas 3 maiores categorias somam ${concentration}% das despesas.`,
      tone: concentration >= 70 ? 'warning' : 'neutral',
      priority: concentration >= 70 ? 70 : 32,
    });
  }

  return insights
    .sort((a, b) => b.priority - a.priority)
    .map(({ priority, ...insight }) => insight);
}
