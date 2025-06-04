import { LevelDesign, LevelLayout, TerrainType, Position3D, PointOfInterest, Challenge, Reward } from '../../types/narrative';

export class LevelGenerator {
  private terrainTypes: string[];
  private challengeTemplates: Challenge[] = [];
  private rewardTemplates: Reward[] = [];

  constructor() {
    this.terrainTypes = ['plain', 'mountain', 'forest', 'water', 'desert'];
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    this.challengeTemplates = [
      {
        id: 'combat_basic',
        type: 'combat',
        difficulty: 1,
        requirements: [],
        rewards: []
      },
      {
        id: 'puzzle_basic',
        type: 'puzzle',
        difficulty: 1,
        requirements: [],
        rewards: []
      }
    ];

    this.rewardTemplates = [
      {
        id: 'gold_small',
        type: 'currency',
        value: 100,
        description: 'A small pouch of gold'
      },
      {
        id: 'xp_basic',
        type: 'experience',
        value: 50,
        description: 'Basic experience points'
      }
    ];
  }

  public generateLevel(params: {
    width: number;
    height: number;
    difficulty: number;
    theme: string;
  }): LevelDesign {
    const { width, height, difficulty, theme } = params;

    const layout = this.generateLayout(width, height);
    const challenges = this.generateChallenges(difficulty);
    const rewards = this.generateRewards(difficulty);
    const objectives = this.generateObjectives(theme, difficulty);

    return {
      id: `level_${Date.now()}`,
      name: this.generateLevelName(theme),
      description: this.generateLevelDescription(theme),
      layout,
      objectives,
      challenges,
      rewards
    };
  }

  private generateLayout(width: number, height: number): LevelLayout {
    return {
      dimensions: { width, height },
      terrain: this.generateTerrain(width, height),
      points_of_interest: this.generatePointsOfInterest(width, height)
    };
  }

  private generateTerrain(width: number, height: number): TerrainType[] {
    const terrain: TerrainType[] = [];
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        terrain.push({
          type: this.getRandomTerrainType(),
          position: { x, y, z: 0 },
          properties: {}
        });
      }
    }

    return terrain;
  }

  private getRandomTerrainType(): string {
    const index = Math.floor(Math.random() * this.terrainTypes.length);
    return this.terrainTypes[index];
  }

  private generatePointsOfInterest(width: number, height: number): PointOfInterest[] {
    const numPoints = Math.max(3, Math.floor((width + height) / 4));
    const points: PointOfInterest[] = [];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        id: `poi_${Date.now()}_${i}`,
        type: this.getRandomPoiType(),
        position: this.getRandomPosition(width, height),
        data: {}
      });
    }

    return points;
  }

  private getRandomPoiType(): 'quest' | 'treasure' | 'encounter' | 'landmark' {
    const types: ('quest' | 'treasure' | 'encounter' | 'landmark')[] = 
      ['quest', 'treasure', 'encounter', 'landmark'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomPosition(width: number, height: number): Position3D {
    return {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      z: 0
    };
  }

  private generateChallenges(difficulty: number): Challenge[] {
    const numChallenges = Math.max(2, Math.floor(difficulty * 1.5));
    const challenges: Challenge[] = [];

    for (let i = 0; i < numChallenges; i++) {
      const template = this.challengeTemplates[
        Math.floor(Math.random() * this.challengeTemplates.length)
      ];

      challenges.push({
        ...template,
        id: `challenge_${Date.now()}_${i}`,
        difficulty: Math.ceil(difficulty * (0.5 + Math.random() * 0.5)),
        rewards: this.generateRewards(difficulty * 0.5)
      });
    }

    return challenges;
  }

  private generateRewards(difficulty: number): Reward[] {
    const numRewards = Math.max(1, Math.floor(difficulty));
    const rewards: Reward[] = [];

    for (let i = 0; i < numRewards; i++) {
      const template = this.rewardTemplates[
        Math.floor(Math.random() * this.rewardTemplates.length)
      ];

      rewards.push({
        ...template,
        id: `reward_${Date.now()}_${i}`,
        value: Math.floor(template.value * (0.8 + difficulty * 0.4))
      });
    }

    return rewards;
  }

  private generateObjectives(theme: string, difficulty: number): string[] {
    const numObjectives = Math.max(1, Math.floor(difficulty));
    const objectives: string[] = [];

    for (let i = 0; i < numObjectives; i++) {
      objectives.push(`${theme} objective ${i + 1}`);
    }

    return objectives;
  }

  private generateLevelName(theme: string): string {
    return `${theme} Level`;
  }

  private generateLevelDescription(theme: string): string {
    return `A challenging level themed around ${theme}`;
  }

  // Public methods for managing templates
  public addTerrainType(type: string): void {
    if (!this.terrainTypes.includes(type)) {
      this.terrainTypes.push(type);
    }
  }

  public addChallengeTemplate(challenge: Challenge): void {
    this.challengeTemplates.push(challenge);
  }

  public addRewardTemplate(reward: Reward): void {
    this.rewardTemplates.push(reward);
  }
} 