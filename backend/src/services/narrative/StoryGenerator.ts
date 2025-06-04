import { StoryArc, StoryElement, PlotPoint } from '../../types/narrative';

export class StoryGenerator {
  private storyElements: Map<string, StoryElement>;
  private plotTemplates: PlotPoint[];

  constructor() {
    this.storyElements = new Map();
    this.plotTemplates = [];
    this.initializeDefaultElements();
  }

  private initializeDefaultElements(): void {
    // Initialize with some basic story elements
    const defaultElements: StoryElement[] = [
      {
        id: 'hero_archetype',
        type: 'character',
        name: 'Hero Archetype',
        description: 'A brave protagonist ready for adventure',
        attributes: {
          role: 'protagonist',
          archetype: 'hero',
          motivations: ['justice', 'adventure']
        }
      },
      {
        id: 'mentor_archetype',
        type: 'character',
        name: 'Mentor Archetype',
        description: 'A wise guide for the hero',
        attributes: {
          role: 'support',
          archetype: 'mentor',
          motivations: ['guidance', 'wisdom']
        }
      }
    ];

    defaultElements.forEach(element => {
      this.storyElements.set(element.id, element);
    });
  }

  public generateStoryArc(theme: string, complexity: number): StoryArc {
    const elements = this.selectRelevantElements(theme);
    const plotPoints = this.generatePlotPoints(complexity);

    return {
      id: `story_${Date.now()}`,
      title: this.generateTitle(theme),
      description: this.generateDescription(theme, elements),
      elements,
      plotPoints,
      mainObjective: this.generateMainObjective(theme)
    };
  }

  private selectRelevantElements(theme: string): StoryElement[] {
    // Select story elements based on the theme
    return Array.from(this.storyElements.values())
      .filter(element => this.isElementRelevantToTheme(element, theme));
  }

  private isElementRelevantToTheme(element: StoryElement, theme: string): boolean {
    // Implement theme relevance logic
    const themeKeywords = theme.toLowerCase().split(' ');
    const elementKeywords = [
      element.name.toLowerCase(),
      element.description.toLowerCase(),
      ...Object.values(element.attributes).map(attr => 
        typeof attr === 'string' ? attr.toLowerCase() : ''
      )
    ];

    return themeKeywords.some(keyword =>
      elementKeywords.some(elementWord => elementWord.includes(keyword))
    );
  }

  private generatePlotPoints(complexity: number): PlotPoint[] {
    const plotPoints: PlotPoint[] = [];
    const numPlotPoints = Math.max(3, Math.floor(complexity * 2));

    for (let i = 0; i < numPlotPoints; i++) {
      plotPoints.push(this.createPlotPoint(i, numPlotPoints));
    }

    return plotPoints;
  }

  private createPlotPoint(index: number, total: number): PlotPoint {
    const isMainPlot = index <= Math.floor(total * 0.3);
    
    return {
      id: `plot_${Date.now()}_${index}`,
      title: `Plot Point ${index + 1}`,
      description: `Description for plot point ${index + 1}`,
      prerequisites: index > 0 ? [`plot_${index - 1}`] : [],
      consequences: [],
      type: isMainPlot ? 'main' : 'side',
      difficulty: this.calculateDifficulty(index, total)
    };
  }

  private calculateDifficulty(index: number, total: number): 'easy' | 'medium' | 'hard' {
    const progress = index / total;
    if (progress < 0.3) return 'easy';
    if (progress < 0.7) return 'medium';
    return 'hard';
  }

  private generateTitle(theme: string): string {
    return `The Epic of ${theme}`;
  }

  private generateDescription(theme: string, elements: StoryElement[]): string {
    return `An epic tale set in the world of ${theme}, featuring ${elements.length} key elements.`;
  }

  private generateMainObjective(theme: string): string {
    return `Become the greatest ${theme} master in the realm`;
  }

  // Public methods for managing story elements
  public addStoryElement(element: StoryElement): void {
    this.storyElements.set(element.id, element);
  }

  public getStoryElement(id: string): StoryElement | undefined {
    return this.storyElements.get(id);
  }

  public getAllStoryElements(): StoryElement[] {
    return Array.from(this.storyElements.values());
  }
} 