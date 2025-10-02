import type { DeploymentEvent, DeploymentStatus } from '~/utils/df/types';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomBetween(rand: () => number, min: number, max: number): number {
  return Math.floor(min + rand() * (max - min + 1));
}

export interface FakeDataOptions {
  seed: number;
  monthsBack: number; // default 6
}

const PROJECTS = ['Alpha', 'Beta', 'Gamma'];
const REPOS = ['frontend', 'backend', 'infra'];
const ENVS = ['dev', 'staging', 'prod', 'production'];

export function generateFakeEvents(
  options: FakeDataOptions
): DeploymentEvent[] {
  const seed = options.seed ?? 42;
  const monthsBack = options.monthsBack ?? 6;
  const rand = mulberry32(seed);

  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth() - monthsBack,
    now.getDate()
  );

  const events: DeploymentEvent[] = [];

  for (
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    d <= now;
    d.setDate(d.getDate() + 1)
  ) {
    const day = d.getDay(); // 0=Sun..6=Sat
    const base = day >= 2 && day <= 4 ? 6 : day === 0 || day === 6 ? 2 : 4; // Tue-Thu higher, weekend lower
    const noise = randomBetween(rand, -1, 2);
    const totalDeploys = Math.max(0, base + noise);

    for (let i = 0; i < totalDeploys; i++) {
      const hour = randomBetween(rand, 8, 20);
      const minute = randomBetween(rand, 0, 59);
      const ts = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        hour,
        minute,
        0,
        0
      );

      const environment = pick(rand, ENVS);
      const project = pick(rand, PROJECTS);
      const repository = pick(rand, REPOS);

      const failureRate = 0.12;
      const status: DeploymentStatus =
        rand() < failureRate ? 'failure' : 'success';
      const favorProdSuccess =
        environment.toLowerCase() === 'prod' ||
        environment.toLowerCase() === 'production';
      const finalStatus: DeploymentStatus =
        favorProdSuccess && status === 'failure' && rand() < 0.6
          ? 'success'
          : status;

      events.push({
        id: `${+ts}-${i}-${Math.floor(rand() * 1e6)}`,
        timestamp: ts.toISOString(),
        project,
        repository,
        environment,
        status: finalStatus,
      });
    }

    // occasional bursts
    if (rand() < 0.05) {
      const bursts = randomBetween(rand, 2, 5);
      for (let j = 0; j < bursts; j++) {
        const ts = new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          randomBetween(rand, 9, 19),
          randomBetween(rand, 0, 59)
        );
        events.push({
          id: `${+ts}-b-${j}-${Math.floor(rand() * 1e6)}`,
          timestamp: ts.toISOString(),
          project: pick(rand, PROJECTS),
          repository: pick(rand, REPOS),
          environment: pick(rand, ENVS),
          status: rand() < 0.15 ? 'failure' : 'success',
        });
      }
    }
  }

  return events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
