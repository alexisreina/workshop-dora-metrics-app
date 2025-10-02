<template>
  <div>
    <canvas
      ref="canvasEl"
      aria-label="Deployment Frequency Chart"
      role="img"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';
import type { DeploymentSeries } from '~/utils/df/types';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

const props = defineProps<{ series: DeploymentSeries | null }>();
const canvasEl = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

function render() {
  if (!canvasEl.value || !props.series) return;
  const labels = props.series.buckets.map((b) => b.label);
  const counts = props.series.buckets.map((b) => b.count);
  const rolling = props.series.rollingAverage?.map((r) => r.value) ?? [];

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(
    canvasEl.value.getContext('2d') as CanvasRenderingContext2D,
    {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Deployments',
            data: counts,
            backgroundColor: '#22c55e',
          },
          ...(rolling.length
            ? [
                {
                  type: 'line',
                  label: '7d Rolling Avg',
                  data: rolling,
                  borderColor: '#0ea5e9',
                  backgroundColor: '#0ea5e980',
                  tension: 0.3,
                  yAxisID: 'y',
                },
              ]
            : []),
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { display: true },
          y: { display: true, beginAtZero: true },
        },
      },
    }
  );
}

onMounted(render);
watch(() => props.series, render, { deep: true });
</script>
