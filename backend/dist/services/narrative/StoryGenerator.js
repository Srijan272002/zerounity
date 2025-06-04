"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryGenerator = void 0;
class StoryGenerator {
    constructor() {
        this.storyElements = new Map();
        this.plotTemplates = [];
        this.initializeDefaultElements();
    }
    initializeDefaultElements() {
        // Initialize with some basic story elements
        const defaultElements = [
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
    generateStoryArc(theme, complexity) {
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
    selectRelevantElements(theme) {
        // Select story elements based on the theme
        return Array.from(this.storyElements.values())
            .filter(element => this.isElementRelevantToTheme(element, theme));
    }
    isElementRelevantToTheme(element, theme) {
        // Implement theme relevance logic
        const themeKeywords = theme.toLowerCase().split(' ');
        const elementKeywords = [
            element.name.toLowerCase(),
            element.description.toLowerCase(),
            ...Object.values(element.attributes).map(attr => typeof attr === 'string' ? attr.toLowerCase() : '')
        ];
        return themeKeywords.some(keyword => elementKeywords.some(elementWord => elementWord.includes(keyword)));
    }
    generatePlotPoints(complexity) {
        const plotPoints = [];
        const numPlotPoints = Math.max(3, Math.floor(complexity * 2));
        for (let i = 0; i < numPlotPoints; i++) {
            plotPoints.push(this.createPlotPoint(i, numPlotPoints));
        }
        return plotPoints;
    }
    createPlotPoint(index, total) {
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
    calculateDifficulty(index, total) {
        const progress = index / total;
        if (progress < 0.3)
            return 'easy';
        if (progress < 0.7)
            return 'medium';
        return 'hard';
    }
    generateTitle(theme) {
        return `The Epic of ${theme}`;
    }
    generateDescription(theme, elements) {
        return `An epic tale set in the world of ${theme}, featuring ${elements.length} key elements.`;
    }
    generateMainObjective(theme) {
        return `Become the greatest ${theme} master in the realm`;
    }
    // Public methods for managing story elements
    addStoryElement(element) {
        this.storyElements.set(element.id, element);
    }
    getStoryElement(id) {
        return this.storyElements.get(id);
    }
    getAllStoryElements() {
        return Array.from(this.storyElements.values());
    }
}
exports.StoryGenerator = StoryGenerator;
