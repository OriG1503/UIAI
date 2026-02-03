import { DateRangeMode } from '../types';
import { TimeUnit } from '../types';

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
