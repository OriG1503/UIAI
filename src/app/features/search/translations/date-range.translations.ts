import { DateRangeMode } from '../types/date-range-mode.type';
import { DateFilterOption } from '../types/date-filter-option.type';
import { TimeUnit } from '../types/time-unit.type';

export const DATE_RANGE_MODE_LABELS: Record<DateRangeMode, string> = {
  calendar: 'תאריכים',
  verbal: 'מילולי'
};

export const DATE_FILTER_OPTION_LABELS: Record<DateFilterOption, string> = {
  option1: 'נסיון 1',
  option2: 'נסיון 2'
};

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  days: 'ימים',
  weeks: 'שבועות',
  months: 'חודשים',
  years: 'שנים'
};

export const DATE_RANGE_TRANSLATIONS = {
  defaultLabel: 'בחירת תאריכים',
  apply: 'החל',
  fromPlaceholder: '- - -',
  toPlaceholder: '- - -',
  lastLabel: 'אחרונים'
};
