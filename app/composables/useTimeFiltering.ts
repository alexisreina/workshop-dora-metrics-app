import { TimePeriodType } from '~/types/enums';

export interface TimeFilterOption {
  value: TimePeriodType;
  label: string;
  description: string;
}

export interface CustomDateRange {
  startDate: string;
  endDate: string;
}

export const useTimeFiltering = () => {
  // Reactive state
  const selectedPeriod = ref<TimePeriodType>(TimePeriodType.MONTHLY);
  const customDateRange = ref<CustomDateRange | null>(null);
  const isCustomRange = ref(false);

  // Available filter options
  const filterOptions: TimeFilterOption[] = [
    {
      value: TimePeriodType.DAILY,
      label: 'Daily',
      description: 'Last 24 hours',
    },
    {
      value: TimePeriodType.WEEKLY,
      label: 'Weekly',
      description: 'Last 7 days',
    },
    {
      value: TimePeriodType.MONTHLY,
      label: 'Monthly',
      description: 'Last 30 days',
    },
    {
      value: TimePeriodType.QUARTERLY,
      label: 'Quarterly',
      description: 'Last 90 days',
    },
  ];

  // Computed properties
  const currentFilterOption = computed(() => {
    return filterOptions.find(
      (option) => option.value === selectedPeriod.value
    );
  });

  const isValidCustomRange = computed(() => {
    if (!customDateRange.value) return false;

    const start = new Date(customDateRange.value.startDate);
    const end = new Date(customDateRange.value.endDate);

    return (
      !isNaN(start.getTime()) &&
      !isNaN(end.getTime()) &&
      start < end &&
      end <= new Date()
    );
  });

  const effectivePeriod = computed(() => {
    return isCustomRange.value && isValidCustomRange.value
      ? null
      : selectedPeriod.value;
  });

  const effectiveDateRange = computed(() => {
    return isCustomRange.value && isValidCustomRange.value
      ? customDateRange.value
      : null;
  });

  // Methods
  const setPeriod = (period: TimePeriodType) => {
    selectedPeriod.value = period;
    isCustomRange.value = false;
    customDateRange.value = null;
  };

  const setCustomDateRange = (startDate: string, endDate: string) => {
    customDateRange.value = { startDate, endDate };
    isCustomRange.value = true;
  };

  const clearCustomRange = () => {
    customDateRange.value = null;
    isCustomRange.value = false;
  };

  const resetToDefault = () => {
    selectedPeriod.value = TimePeriodType.MONTHLY;
    clearCustomRange();
  };

  // Utility methods
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDateRangeLabel = (): string => {
    if (
      isCustomRange.value &&
      customDateRange.value &&
      isValidCustomRange.value
    ) {
      return `${formatDateForDisplay(customDateRange.value.startDate)} - ${formatDateForDisplay(customDateRange.value.endDate)}`;
    }

    return currentFilterOption.value?.description || 'Last 30 days';
  };

  const getPreviousPeriodDates = (): CustomDateRange | null => {
    if (
      isCustomRange.value &&
      customDateRange.value &&
      isValidCustomRange.value
    ) {
      const start = new Date(customDateRange.value.startDate);
      const end = new Date(customDateRange.value.endDate);
      const duration = end.getTime() - start.getTime();

      const prevEnd = new Date(start.getTime() - 1); // One day before current start
      const prevStart = new Date(prevEnd.getTime() - duration);

      return {
        startDate: prevStart.toISOString().split('T')[0],
        endDate: prevEnd.toISOString().split('T')[0],
      };
    }

    // For predefined periods, calculate previous period
    const now = new Date();
    let duration: number;

    switch (selectedPeriod.value) {
      case TimePeriodType.DAILY:
        duration = 24 * 60 * 60 * 1000;
        break;
      case TimePeriodType.WEEKLY:
        duration = 7 * 24 * 60 * 60 * 1000;
        break;
      case TimePeriodType.MONTHLY:
        duration = 30 * 24 * 60 * 60 * 1000;
        break;
      case TimePeriodType.QUARTERLY:
        duration = 90 * 24 * 60 * 60 * 1000;
        break;
      default:
        duration = 30 * 24 * 60 * 60 * 1000;
    }

    const currentStart = new Date(now.getTime() - duration);
    const prevEnd = new Date(currentStart.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);

    return {
      startDate: prevStart.toISOString().split('T')[0],
      endDate: prevEnd.toISOString().split('T')[0],
    };
  };

  return {
    // State
    selectedPeriod: readonly(selectedPeriod),
    customDateRange: readonly(customDateRange),
    isCustomRange: readonly(isCustomRange),

    // Computed
    filterOptions,
    currentFilterOption,
    isValidCustomRange,
    effectivePeriod,
    effectiveDateRange,

    // Methods
    setPeriod,
    setCustomDateRange,
    clearCustomRange,
    resetToDefault,
    formatDateForDisplay,
    getDateRangeLabel,
    getPreviousPeriodDates,
  };
};
