
export type Victory = {
  id: number;
  name: string;
  description?: string;
  date?: string;
};

export type ConfigData = {
  maxVictories: number;
  victories: Victory[];
};
