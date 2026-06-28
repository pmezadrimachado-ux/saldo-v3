import {
  buildFutureProjection,
  summarizeProjection,
} from '../domain/projections/projection.calculations.js';

export function getProjectionData(state) {
  const projection = buildFutureProjection({
    transactions: state.data.transactions,
    currentMonthKey: state.session.selectedMonth,
    monthsAhead: 6,
  });

  return {
    projection,
    summary: summarizeProjection(projection),
  };
}
