import { renderCard } from '../components/base/card.component.js';
import { renderWeekBarChart } from '../components/analytics/week-bar-chart.component.js';
import { renderCategoryRanking } from '../components/finance/category-ranking.component.js';
import { renderBudgetStatusList } from '../components/finance/budget-card.component.js';
import { renderHorizontalBarChart } from '../components/analytics/horizontal-bar-chart.component.js';
import { renderEvolutionChart } from '../components/analytics/evolution-chart.component.js';
import { renderIncomeExpenseComparison } from '../components/analytics/comparison-bar.component.js';
import { renderFutureCommitment } from '../components/analytics/future-commitment.component.js';
import { renderCardBillList } from '../components/finance/card-bill.component.js';
import { getCardBillData } from '../../services/card-bill.service.js';
import { getProjectionData } from '../../services/projection.service.js';
import { renderProjectionChart, renderProjectionSummary } from '../components/analytics/projection-chart.component.js';
import { renderTransactionList } from '../components/finance/transaction-list.component.js';
import { getAnalyticsData } from '../../services/analytics.service.js';
import { generateFinancialInsights } from '../../domain/analytics/insights.js';
import { renderInsightList } from '../components/dashboard/insight-card.component.js';
import { formatCurrency } from '../../utils/currency.js';

export function renderAnalyticsPage({ state }) {
  const analytics = getAnalyticsData(state);
  const cardBillData = getCardBillData(state);
  const projectionData = getProjectionData(state);
  const insights = generateFinancialInsights({
    monthlySummary: analytics.totals,
    todayExpenses: analytics.todayExpenses,
    weekExpenses: analytics.currentWeekExpenses,
    weekExpensesByDay: analytics.weekExpenses,
    topCategory: analytics.categoryRanking[0] ?? null,
    largestExpense: analytics.largestExpense,
    safeDailyBudget: 0,
    budgetsStatus: analytics.budgetsStatus,
    categoryRanking: analytics.categoryRanking,
    monthlyEvolution: analytics.monthlyEvolution,
  });

  return `
    <section class="page analytics-center-page">
      <p class="page__eyebrow">Inteligência financeira</p>
      <h2>Análises</h2>
      <p>Entenda como seu dinheiro se movimenta por mês, categoria, conta e período.</p>

      ${renderInsightList(insights)}

      <div class="settings-grid">
        ${renderCard({
          eyebrow: 'Despesas',
          title: formatCurrency(analytics.totals.expenseTotal),
          description: `${analytics.totals.transactionCount} lançamento(s) no mês.`,
        })}
        ${renderCard({
          eyebrow: 'Resultado',
          title: formatCurrency(analytics.totals.netResult),
          description: analytics.totals.netResult >= 0 ? 'Resultado positivo no mês.' : 'Despesas acima das receitas.',
        })}
      </div>

      ${renderCard({
        eyebrow: 'Receita × Despesa',
        title: 'Comparativo mensal',
        content: renderIncomeExpenseComparison(analytics.incomeExpenseComparison),
      })}

      ${renderCard({
        eyebrow: 'Semana',
        title: 'Gastos por dia da semana',
        content: renderWeekBarChart({
          values: analytics.weekExpenses.map((item) => item.total),
          labels: analytics.weekExpenses.map((item) => item.label.slice(0, 1)),
        }),
      })}

      ${renderCard({
        eyebrow: 'Categorias',
        title: 'Para onde seu dinheiro foi',
        content: renderCategoryRanking(analytics.categoryRanking),
      })}

      ${renderCard({
        eyebrow: 'Contas e cartões',
        title: 'Uso por conta',
        content: renderHorizontalBarChart({
          items: analytics.accountRanking.map((item) => ({
            label: item.account.name,
            value: item.total,
            color: item.account.color,
          })),
          emptyMessage: 'Nenhum gasto por conta neste mês.',
        }),
      })}

      ${renderCard({
        eyebrow: 'Evolução',
        title: 'Últimos meses',
        content: renderEvolutionChart(analytics.monthlyEvolution),
      })}

      ${renderCard({
        eyebrow: 'Maiores gastos',
        title: 'Top despesas do mês',
        content: renderTransactionList({
          transactions: analytics.largestExpenses,
          accounts: state.data.accounts,
          categories: state.data.categories,
        }),
      })}

      ${renderCard({
        eyebrow: 'Projeção futura',
        title: 'Comprometimento dos próximos meses',
        content: `
          ${renderProjectionSummary(projectionData.summary)}
          ${renderProjectionChart(projectionData.projection)}
        `,
      })}

      ${renderCard({
        eyebrow: 'Cartões',
        title: 'Faturas do mês',
        content: renderCardBillList(cardBillData.bills),
      })}

      ${renderCard({
        eyebrow: 'Parcelamentos',
        title: 'Comprometimento futuro',
        content: renderFutureCommitment(analytics.futureCommitment),
      })}

      ${renderCard({
        eyebrow: 'Orçamentos',
        title: 'Uso dos limites',
        content: renderBudgetStatusList(analytics.budgetsStatus),
      })}
    </section>
  `;
}
