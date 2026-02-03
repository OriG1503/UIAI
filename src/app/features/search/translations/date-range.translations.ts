import { DateRangeMode } from '../types/date-range-mode.type';
import { TimeUnit } from '../types/time-unit.type';

export const DATE_RANGE_MODE_LABELS: Record<DateRangeMode, string> = {
  calendar: 'לוח שנה',
  verbal: 'מילולי'
};

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  days: 'ימים',
  weeks: 'שבועות',
  months: 'חודשים',
  years: 'שנים'
};

export const DATE_RANGE_TRANSLATIONS = {
  selectDateRange: 'בחר טווח תאריכים',
  back: 'חזרה',
  apply: 'החל'
};
