export interface Config {
  maxConcurrentTasks: number;
}

export const DefaultConfig: Config = {
  maxConcurrentTasks: 5
};
