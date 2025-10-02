<template>
  <div class="flex flex-wrap items-end gap-2" data-testid="df-filters">
    <div>
      <label class="block text-sm">Preset</label>
      <select v-model="model.preset" class="p-inputtext p-component">
        <option value="14d">14d</option>
        <option value="30d">30d</option>
        <option value="90d">90d</option>
        <option value="6m">6m</option>
        <option value="custom">custom</option>
      </select>
    </div>
    <div>
      <label class="block text-sm">Grouping</label>
      <select v-model="model.groupBy" class="p-inputtext p-component">
        <option value="day">day</option>
        <option value="week">week</option>
        <option value="month">month</option>
      </select>
    </div>
    <div>
      <label class="block text-sm">Project</label>
      <select v-model="model.project" class="p-inputtext p-component">
        <option v-for="p in projects" :key="p" :value="p">{{ p }}</option>
      </select>
    </div>
    <div>
      <label class="block text-sm">Repository</label>
      <select v-model="model.repository" class="p-inputtext p-component">
        <option v-for="r in repositories" :key="r" :value="r">{{ r }}</option>
      </select>
    </div>
    <div>
      <label class="block text-sm">Environment</label>
      <select v-model="model.environment" class="p-inputtext p-component">
        <option v-for="e in environments" :key="e" :value="e">{{ e }}</option>
      </select>
    </div>
    <div v-if="model.groupBy === 'day'">
      <label class="inline-flex items-center gap-2">
        <input v-model="model.rollingAvg" type="checkbox" >
        <span>7d rolling avg</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  STATIC_ENVIRONMENTS,
  STATIC_PROJECTS,
  STATIC_REPOSITORIES,
} from '~/utils/df/filters';

const model = defineModel<any>({ required: true });
const projects = STATIC_PROJECTS;
const repositories = STATIC_REPOSITORIES;
const environments = STATIC_ENVIRONMENTS;
</script>
