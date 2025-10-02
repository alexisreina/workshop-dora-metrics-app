<template>
  <div class="filter-bar">
    <div class="filter-bar-content">
      <div class="filter-section">
        <label class="filter-label">Time Period</label>
        <TimeFilter
          v-model="selectedPeriod"
          :options="filterOptions"
          :disabled="loading"
          @change="handlePeriodChange"
        />
      </div>

      <div v-if="showCustomRange" class="filter-section">
        <label class="filter-label">Custom Range</label>
        <div class="custom-range-inputs">
          <Calendar
            v-model="customStartDate"
            placeholder="Start Date"
            :disabled="loading || !isCustomRangeMode"
            date-format="yy-mm-dd"
            :max-date="maxStartDate"
            class="custom-date-input"
            @date-select="handleCustomDateChange"
          />
          <Calendar
            v-model="customEndDate"
            placeholder="End Date"
            :disabled="loading || !isCustomRangeMode"
            date-format="yy-mm-dd"
            :min-date="minEndDate"
            :max-date="maxEndDate"
            class="custom-date-input"
            @date-select="handleCustomDateChange"
          />
        </div>
      </div>

      <div v-if="showActions" class="filter-actions">
        <Button
          v-if="showCustomRange"
          :label="isCustomRangeMode ? 'Use Preset' : 'Custom Range'"
          :icon="isCustomRangeMode ? 'pi pi-calendar' : 'pi pi-calendar-plus'"
          severity="secondary"
          size="small"
          :disabled="loading"
          @click="toggleCustomRange"
        />

        <Button
          v-if="showRefresh"
          icon="pi pi-refresh"
          severity="secondary"
          size="small"
          :loading="loading"
          :disabled="loading"
          @click="handleRefresh"
        />

        <Button
          v-if="showReset"
          label="Reset"
          icon="pi pi-undo"
          severity="secondary"
          size="small"
          :disabled="loading"
          @click="handleReset"
        />
      </div>
    </div>

    <div v-if="currentRangeLabel" class="filter-summary">
      <span class="range-label">{{ currentRangeLabel }}</span>
      <span v-if="lastUpdated" class="last-updated">
        Last updated: {{ formatLastUpdated(lastUpdated) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import TimeFilter from '~/components/atoms/TimeFilter.vue';
import type { TimeFilterOption } from '~/composables/useTimeFiltering';
import { TimePeriodType } from '~/types/enums';

interface Props {
  modelValue: TimePeriodType;
  customStartDate?: Date | null;
  customEndDate?: Date | null;
  filterOptions?: TimeFilterOption[];
  loading?: boolean;
  showCustomRange?: boolean;
  showActions?: boolean;
  showRefresh?: boolean;
  showReset?: boolean;
  lastUpdated?: string;
}

interface Emits {
  (e: 'update:modelValue', value: TimePeriodType): void;
  (e: 'update:customStartDate', value: Date | null): void;
  (e: 'update:customEndDate', value: Date | null): void;
  (e: 'period-change', value: TimePeriodType): void;
  (
    e: 'custom-range-change',
    startDate: Date | null,
    endDate: Date | null
  ): void;
  (e: 'refresh'): void;
  (e: 'reset'): void;
}

const props = withDefaults(defineProps<Props>(), {
  showCustomRange: true,
  showActions: true,
  showRefresh: true,
  showReset: true,
});

const emit = defineEmits<Emits>();

const isCustomRangeMode = ref(false);

const selectedPeriod = computed({
  get: () => props.modelValue,
  set: (value: TimePeriodType) => {
    emit('update:modelValue', value);
  },
});

const customStartDate = computed({
  get: () => props.customStartDate,
  set: (value: Date | null) => {
    emit('update:customStartDate', value);
  },
});

const customEndDate = computed({
  get: () => props.customEndDate,
  set: (value: Date | null) => {
    emit('update:customEndDate', value);
  },
});

const maxStartDate = computed(() => {
  return props.customEndDate
    ? new Date(props.customEndDate.getTime() - 24 * 60 * 60 * 1000)
    : new Date();
});

const minEndDate = computed(() => {
  return props.customStartDate
    ? new Date(props.customStartDate.getTime() + 24 * 60 * 60 * 1000)
    : null;
});

const maxEndDate = computed(() => new Date());

const currentRangeLabel = computed(() => {
  if (isCustomRangeMode.value && props.customStartDate && props.customEndDate) {
    const start = props.customStartDate.toLocaleDateString();
    const end = props.customEndDate.toLocaleDateString();
    return `${start} - ${end}`;
  }

  const option = props.filterOptions?.find(
    (opt) => opt.value === selectedPeriod.value
  );
  return option?.description || 'Last 30 days';
});

const handlePeriodChange = (value: TimePeriodType) => {
  isCustomRangeMode.value = false;
  emit('period-change', value);
};

const handleCustomDateChange = () => {
  if (props.customStartDate && props.customEndDate) {
    emit('custom-range-change', props.customStartDate, props.customEndDate);
  }
};

const toggleCustomRange = () => {
  isCustomRangeMode.value = !isCustomRangeMode.value;

  if (!isCustomRangeMode.value) {
    // Reset custom dates when switching back to preset
    emit('update:customStartDate', null);
    emit('update:customEndDate', null);
  }
};

const handleRefresh = () => {
  emit('refresh');
};

const handleReset = () => {
  isCustomRangeMode.value = false;
  emit('reset');
};

const formatLastUpdated = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
.filter-bar {
  @apply space-y-4 rounded-lg border border-gray-200 bg-white p-4;
}

.filter-bar-content {
  @apply flex flex-wrap items-end gap-4;
}

.filter-section {
  @apply flex min-w-0 flex-col gap-2;
}

.filter-label {
  @apply text-sm font-medium text-gray-700;
}

.custom-range-inputs {
  @apply flex gap-2;
}

.custom-date-input {
  @apply min-w-32 flex-1;
}

.filter-actions {
  @apply ml-auto flex items-center gap-2;
}

.filter-summary {
  @apply flex items-center justify-between border-t border-gray-100 pt-2 text-sm text-gray-600;
}

.range-label {
  @apply font-medium;
}

.last-updated {
  @apply text-gray-500;
}

@media (max-width: 768px) {
  .filter-bar-content {
    @apply flex-col items-stretch;
  }

  .filter-actions {
    @apply ml-0 justify-center;
  }

  .filter-summary {
    @apply flex-col items-start gap-1;
  }
}
</style>
