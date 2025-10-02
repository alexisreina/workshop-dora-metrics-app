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
        plugins: {
          legend: {
            labels: {
              color: getComputedStyle(
                document.documentElement
              ).classList.contains('dark')
                ? '#e5e7eb'
                : '#111827',
            },
          },
          tooltip: {
            titleColor: '#111827',
            bodyColor: '#111827',
            backgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            display: true,
            ticks: {
              color: getComputedStyle(
                document.documentElement
              ).classList.contains('dark')
                ? '#d1d5db'
                : '#374151',
            },
            grid: {
              color: getComputedStyle(
                document.documentElement
              ).classList.contains('dark')
                ? 'rgba(75,85,99,0.3)'
                : 'rgba(229,231,235,1)',
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            ticks: {
              color: getComputedStyle(
                document.documentElement
              ).classList.contains('dark')
                ? '#d1d5db'
                : '#374151',
            },
            grid: {
              color: getComputedStyle(
                document.documentElement
              ).classList.contains('dark')
                ? 'rgba(75,85,99,0.3)'
                : 'rgba(229,231,235,1)',
            },
          },
        },
      },
    }
  );
}

onMounted(render);
watch(() => props.series, render, { deep: true });
watch(
  () => document.documentElement.classList.contains('dark'),
  () => {
    render();
  }
);
</script>
