<template>
  <div class="time-filter">
    <Select
      v-model="selectedValue"
      :options="filterOptions"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      class="time-filter-select"
      @change="handleChange"
    />
    <div
      v-if="showDescription && currentOption"
      class="time-filter-description"
    >
      {{ currentOption.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Select from 'primevue/select';
import type { TimeFilterOption } from '~/composables/useTimeFiltering';
import { TimePeriodType } from '~/types/enums';

interface Props {
  modelValue: TimePeriodType;
  options?: TimeFilterOption[];
  placeholder?: string;
  showDescription?: boolean;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: TimePeriodType): void;
  (e: 'change', value: TimePeriodType): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select time period',
  showDescription: true,
  disabled: false,
});

const emit = defineEmits<Emits>();

const defaultOptions: TimeFilterOption[] = [
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

const filterOptions = computed(() => props.options || defaultOptions);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: TimePeriodType) => {
    emit('update:modelValue', value);
  },
});

const currentOption = computed(() => {
  return filterOptions.value.find(
    (option) => option.value === selectedValue.value
  );
});

const handleChange = (event: any) => {
  const value = event.value as TimePeriodType;
  emit('change', value);
};
</script>

<style scoped>
.time-filter {
  @apply space-y-2;
}

.time-filter-select {
  @apply w-full;
}

.time-filter-description {
  @apply text-xs text-gray-500;
}
</style>
