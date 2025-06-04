import { StoryGenerator } from './StoryGenerator';
import { LevelGenerator } from './LevelGenerator';
import { QuestGenerator } from './QuestGenerator';
import { StoryArc, LevelDesign, Quest, StoryElement } from '../../types/narrative';

export interface GameNarrative {
  story: StoryArc;
  levels: LevelDesign[];
  quests: Quest[];
}

export interface NarrativeConfig {
  theme: string;
  complexity: number;
  numLevels: number;
  numQuests: number;
  levelParams: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };
}

export class NarrativeGenerator {
  private storyGenerator: StoryGenerator;
  private levelGenerator: LevelGenerator;
  private questGenerator: QuestGenerator;

  constructor() {
    this.storyGenerator = new StoryGenerator();
    this.levelGenerator = new LevelGenerator();
    this.questGenerator = new QuestGenerator();
  }

  public generateGameNarrative(config: NarrativeConfig): GameNarrative {
    // Generate the main story
    const story = this.storyGenerator.generateStoryArc(config.theme, config.complexity);

    // Generate levels based on the story
    const levels = this.generateLevels(config, story.elements);

    // Generate quests that tie into the story and levels
    const quests = this.generateQuests(config, story.elements, levels);

    return {
      story,
      levels,
      quests
    };
  }

  private generateLevels(config: NarrativeConfig, storyElements: StoryElement[]): LevelDesign[] {
    const levels: LevelDesign[] = [];

    for (let i = 0; i < config.numLevels; i++) {
      const width = this.getRandomInRange(config.levelParams.minWidth, config.levelParams.maxWidth);
      const height = this.getRandomInRange(config.levelParams.minHeight, config.levelParams.maxHeight);
      const difficulty = this.calculateLevelDifficulty(i, config.numLevels, config.complexity);

      const level = this.levelGenerator.generateLevel({
        width,
        height,
        difficulty,
        theme: `${config.theme}_level_${i + 1}`
      });

      levels.push(level);
    }

    return levels;
  }

  private generateQuests(
    config: NarrativeConfig,
    storyElements: StoryElement[],
    levels: LevelDesign[]
  ): Quest[] {
    const quests: Quest[] = [];
    const mainQuestCount = Math.ceil(config.numQuests * 0.3); // 30% main quests
    const sideQuestCount = config.numQuests - mainQuestCount;

    // Generate main quests
    for (let i = 0; i < mainQuestCount; i++) {
      const difficulty = this.calculateQuestDifficulty(i, mainQuestCount, config.complexity);
      quests.push(
        this.questGenerator.generateQuest({
          theme: `${config.theme}_main`,
          difficulty,
          type: 'main',
          requiredElements: this.selectRelevantStoryElements(storyElements, i)
        })
      );
    }

    // Generate side quests
    for (let i = 0; i < sideQuestCount; i++) {
      const difficulty = this.calculateQuestDifficulty(i, sideQuestCount, config.complexity * 0.7);
      quests.push(
        this.questGenerator.generateQuest({
          theme: `${config.theme}_side`,
          difficulty,
          type: 'side',
          requiredElements: this.selectRelevantStoryElements(storyElements, i)
        })
      );
    }

    return this.distributeQuestsAcrossLevels(quests, levels);
  }

  private calculateLevelDifficulty(levelIndex: number, totalLevels: number, baseComplexity: number): number {
    // Difficulty increases as levels progress
    const progressFactor = (levelIndex + 1) / totalLevels;
    return Math.max(1, Math.floor(baseComplexity * (0.5 + progressFactor * 0.8)));
  }

  private calculateQuestDifficulty(questIndex: number, totalQuests: number, baseComplexity: number): number {
    // Similar to level difficulty but with more variation
    const progressFactor = (questIndex + 1) / totalQuests;
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    return Math.max(1, Math.floor(baseComplexity * progressFactor * randomFactor));
  }

  private selectRelevantStoryElements(elements: StoryElement[], index: number): StoryElement[] {
    // Simple selection - can be made more sophisticated
    return elements.slice(0, Math.min(2 + index, elements.length));
  }

  private distributeQuestsAcrossLevels(quests: Quest[], levels: LevelDesign[]): Quest[] {
    // Add level reference to quest data
    return quests.map((quest, index) => ({
      ...quest,
      data: {
        ...quest,
        levelId: levels[index % levels.length].id
      }
    }));
  }

  private getRandomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Public methods for customization
  public getStoryGenerator(): StoryGenerator {
    return this.storyGenerator;
  }

  public getLevelGenerator(): LevelGenerator {
    return this.levelGenerator;
  }

  public getQuestGenerator(): QuestGenerator {
    return this.questGenerator;
  }
} 