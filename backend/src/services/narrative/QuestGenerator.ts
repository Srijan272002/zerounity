import { Quest, QuestObjective, StoryElement, Reward } from '../../types/narrative';

export class QuestGenerator {
  private questTemplates: Partial<Quest>[] = [];
  private objectiveTemplates: Partial<QuestObjective>[] = [];
  private rewardTemplates: Reward[] = [];

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Initialize quest templates
    this.questTemplates = [
      {
        type: 'main',
        difficulty: 3,
        estimatedDuration: 30
      },
      {
        type: 'side',
        difficulty: 1,
        estimatedDuration: 15
      }
    ];

    // Initialize objective templates
    this.objectiveTemplates = [
      {
        type: 'collect',
        quantity: 5,
        optional: false
      },
      {
        type: 'kill',
        quantity: 3,
        optional: false
      },
      {
        type: 'explore',
        quantity: 1,
        optional: true
      }
    ];

    // Initialize reward templates
    this.rewardTemplates = [
      {
        id: 'gold_reward',
        type: 'currency',
        value: 100,
        description: 'Gold coins'
      },
      {
        id: 'xp_reward',
        type: 'experience',
        value: 200,
        description: 'Experience points'
      }
    ];
  }

  public generateQuest(params: {
    theme: string;
    difficulty: number;
    type?: 'main' | 'side' | 'daily' | 'hidden';
    requiredElements?: StoryElement[];
  }): Quest {
    const { theme, difficulty, type = 'side', requiredElements = [] } = params;

    const objectives = this.generateObjectives(theme, difficulty);
    const rewards = this.generateRewards(difficulty);
    const storyElements = [...requiredElements];

    return {
      id: `quest_${Date.now()}`,
      title: this.generateQuestTitle(theme),
      description: this.generateQuestDescription(theme),
      type,
      objectives,
      prerequisites: this.generatePrerequisites(difficulty),
      rewards,
      storyElements,
      difficulty,
      estimatedDuration: this.calculateEstimatedDuration(difficulty, objectives.length)
    };
  }

  private generateObjectives(theme: string, difficulty: number): QuestObjective[] {
    const numObjectives = Math.max(1, Math.floor(difficulty * 1.5));
    const objectives: QuestObjective[] = [];

    for (let i = 0; i < numObjectives; i++) {
      const template = this.objectiveTemplates[
        Math.floor(Math.random() * this.objectiveTemplates.length)
      ];

      objectives.push({
        id: `objective_${Date.now()}_${i}`,
        description: this.generateObjectiveDescription(theme, template.type || 'collect'),
        type: template.type || 'collect',
        target: this.generateTarget(theme, template.type || 'collect'),
        quantity: template.quantity || 1,
        completed: false,
        optional: template.optional || false
      });
    }

    return objectives;
  }

  private generateObjectiveDescription(theme: string, type: string): string {
    switch (type) {
      case 'collect':
        return `Collect items related to ${theme}`;
      case 'kill':
        return `Defeat enemies in the ${theme} area`;
      case 'explore':
        return `Explore the ${theme} region`;
      case 'interact':
        return `Interact with ${theme} elements`;
      case 'escort':
        return `Escort an ally through the ${theme} area`;
      default:
        return `Complete ${theme} objective`;
    }
  }

  private generateTarget(theme: string, type: string): string {
    return `${theme}_${type}_target`;
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

  private generatePrerequisites(difficulty: number): string[] {
    // Simple implementation - can be expanded based on game progression system
    return difficulty > 2 ? ['previous_quest_completion'] : [];
  }

  private calculateEstimatedDuration(difficulty: number, numObjectives: number): number {
    // Duration in minutes
    return Math.floor(15 * difficulty + 5 * numObjectives);
  }

  private generateQuestTitle(theme: string): string {
    return `The ${theme} Quest`;
  }

  private generateQuestDescription(theme: string): string {
    return `An exciting quest involving ${theme}`;
  }

  // Public methods for managing templates
  public addQuestTemplate(template: Partial<Quest>): void {
    this.questTemplates.push(template);
  }

  public addObjectiveTemplate(template: Partial<QuestObjective>): void {
    this.objectiveTemplates.push(template);
  }

  public addRewardTemplate(reward: Reward): void {
    this.rewardTemplates.push(reward);
  }
} 