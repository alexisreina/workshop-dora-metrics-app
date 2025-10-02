import type { Grouping } from '~/utils/df/types';

export function useDfSelection() {
  const preset = ref<'14d' | '30d' | '90d' | '6m' | 'custom'>('6m');
  const groupBy = ref<Grouping>('day');
  const startDate = ref<string | undefined>(undefined);
  const endDate = ref<string | undefined>(undefined);
  const project = ref<string | undefined>(undefined);
  const repository = ref<string | undefined>(undefined);
  const environment = ref<string | undefined>(undefined);
  const rollingAvg = ref<boolean>(false);

  function setPreset(value: typeof preset.value) {
    preset.value = value;
    if (value !== 'custom') {
      startDate.value = undefined;
      endDate.value = undefined;
    }
  }

  return {
    preset,
    groupBy,
    startDate,
    endDate,
    project,
    repository,
    environment,
    rollingAvg,
    setPreset,
  };
}
