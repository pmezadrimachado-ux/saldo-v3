import { renderCard } from '../components/base/card.component.js';
import { renderStatCard } from '../components/finance/stat-card.component.js';
import { renderWeekBarChart } from '../components/analytics/week-bar-chart.component.js';
import { renderTransactionList } from '../components/finance/transaction-list.component.js';
import { renderCategoryRanking } from '../components/finance/category-ranking.component.js';
import { renderInsightList } from '../components/dashboard/insight-card.component.js';
import { renderGoalList } from '../components/finance/goal-card.component.js';
import { renderFutureCommitment } from '../components/analytics/future-commitment.component.js';
import { renderCardBillList } from '../components/finance/card-bill.component.js';
import { getCardBillData } from '../../services/card-bill.service.js';
import { getProjectionData } from '../../services/projection.service.js';
import { renderProjectionSummary } from '../components/analytics/projection-chart.component.js';
import { getDashboardData } from '../../services/dashboard.service.js';
import { formatCurrency } from '../../utils/currency.js';

export function renderDashboardPage({ state }) {
  const dashboard = getDashboardData(state);
  const cardBillData = getCardBillData(state);
  const projectionData = getProjectionData(state);
  return `
    <section class="page dashboard-page">
      <p class="page__eyebrow">Resumo inteligente</p>
      <h2>Dashboard</h2>
      <p>Leitura rápida da sua situação financeira atual.</p>

      ${renderInsightList(dashboard.insights)}

      <div class="settings-grid">
        ${renderStatCard({ label: 'Saldo total', value: formatCurrency(dashboard.totalBalance), description: 'Saldo inicial + receitas - despesas.', tone: dashboard.totalBalance >= 0 ? 'positive' : 'negative' })}
        ${renderStatCard({ label: 'Hoje', value: formatCurrency(dashboard.todayExpenses), description: 'Despesas registradas hoje.' })}
        ${renderStatCard({ label: 'Semana', value: formatCurrency(dashboard.weekExpenses), description: 'Despesas da semana atual.' })}
        ${renderStatCard({ label: 'Mês', value: formatCurrency(dashboard.monthlySummary.expenseTotal), description: `${dashboard.monthlySummary.transactionCount} lançamento(s) no período.` })}
      </div>

      <div class="settings-grid">
        ${renderStatCard({ label: 'Receitas', value: formatCurrency(dashboard.monthlySummary.incomeTotal), description: 'Entradas confirmadas no mês.', tone: 'positive' })}
        ${renderStatCard({ label: 'Resultado', value: formatCurrency(dashboard.monthlySummary.netResult), description: 'Receitas menos despesas.', tone: dashboard.monthlySummary.netResult >= 0 ? 'positive' : 'negative' })}
        ${renderStatCard({ label: 'Média diária', value: formatCurrency(dashboard.dailyAverage), description: 'Gasto médio diário do mês.' })}
        ${renderStatCard({ label: 'Pode gastar/dia', value: formatCurrency(dashboard.safeDailyBudget), description: 'Estimativa até o fim do mês.', tone: 'positive' })}
      </div>

      ${renderCard({ eyebrow: 'Categorias', title: dashboard.topCategory ? `Maior categoria: ${dashboard.topCategory.category.name}` : 'Categorias', description: dashboard.topCategory ? `${formatCurrency(dashboard.topCategory.total)} no mês.` : 'Sem despesas no mês.', content: renderCategoryRanking(dashboard.categoryRanking) })}
      ${renderCard({ eyebrow: 'Maior despesa', title: dashboard.largestExpense ? dashboard.largestExpense.description || 'Despesa' : 'Sem dados', description: dashboard.largestExpense ? formatCurrency(dashboard.largestExpense.amount) : 'Nenhuma despesa registrada no mês.' })}
      ${renderCard({
        eyebrow: 'Projeção',
        title: 'Próximos meses',
        content: renderProjectionSummary(projectionData.summary),
      })}

      ${renderCard({
        eyebrow: 'Cartões',
        title: 'Faturas do mês',
        content: renderCardBillList(cardBillData.bills),
      })}

      ${renderCard({
        eyebrow: 'Parcelamentos',
        title: 'Comprometimento futuro',
        content: renderFutureCommitment(dashboard.futureCommitment ?? []),
      })}

      ${renderCard({
        eyebrow: 'Metas',
        title: 'Objetivos financeiros',
        content: renderGoalList(state.data.goals.filter((goal) => goal.status !== 'archived').slice(0, 2), {
          emptyMessage: 'Nenhuma meta ativa.',
        }),
      })}

      ${renderCard({ eyebrow: 'Histórico', title: 'Últimos lançamentos', content: renderTransactionList({ transactions: dashboard.recentTransactions, accounts: state.data.accounts, categories: state.data.categories }) })}
      ${renderCard({ eyebrow: 'Visual semanal', title: 'Ritmo da semana', description: 'Gráfico placeholder até a Sprint 8 conectar dados por dia.', content: renderWeekBarChart({ values: [12, 28, 18, 34, 26, 44, 20] }) })}
    </section>
  `;
}
