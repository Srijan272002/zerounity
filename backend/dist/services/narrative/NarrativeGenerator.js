"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarrativeGenerator = void 0;
const StoryGenerator_1 = require("./StoryGenerator");
const LevelGenerator_1 = require("./LevelGenerator");
const QuestGenerator_1 = require("./QuestGenerator");
class NarrativeGenerator {
    constructor() {
        this.storyGenerator = new StoryGenerator_1.StoryGenerator();
        this.levelGenerator = new LevelGenerator_1.LevelGenerator();
        this.questGenerator = new QuestGenerator_1.QuestGenerator();
    }
    generateGameNarrative(config) {
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
    generateLevels(config, storyElements) {
        const levels = [];
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
    generateQuests(config, storyElements, levels) {
        const quests = [];
        const mainQuestCount = Math.ceil(config.numQuests * 0.3); // 30% main quests
        const sideQuestCount = config.numQuests - mainQuestCount;
        // Generate main quests
        for (let i = 0; i < mainQuestCount; i++) {
            const difficulty = this.calculateQuestDifficulty(i, mainQuestCount, config.complexity);
            quests.push(this.questGenerator.generateQuest({
                theme: `${config.theme}_main`,
                difficulty,
                type: 'main',
                requiredElements: this.selectRelevantStoryElements(storyElements, i)
            }));
        }
        // Generate side quests
        for (let i = 0; i < sideQuestCount; i++) {
            const difficulty = this.calculateQuestDifficulty(i, sideQuestCount, config.complexity * 0.7);
            quests.push(this.questGenerator.generateQuest({
                theme: `${config.theme}_side`,
                difficulty,
                type: 'side',
                requiredElements: this.selectRelevantStoryElements(storyElements, i)
            }));
        }
        return this.distributeQuestsAcrossLevels(quests, levels);
    }
    calculateLevelDifficulty(levelIndex, totalLevels, baseComplexity) {
        // Difficulty increases as levels progress
        const progressFactor = (levelIndex + 1) / totalLevels;
        return Math.max(1, Math.floor(baseComplexity * (0.5 + progressFactor * 0.8)));
    }
    calculateQuestDifficulty(questIndex, totalQuests, baseComplexity) {
        // Similar to level difficulty but with more variation
        const progressFactor = (questIndex + 1) / totalQuests;
        const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        return Math.max(1, Math.floor(baseComplexity * progressFactor * randomFactor));
    }
    selectRelevantStoryElements(elements, index) {
        // Simple selection - can be made more sophisticated
        return elements.slice(0, Math.min(2 + index, elements.length));
    }
    distributeQuestsAcrossLevels(quests, levels) {
        // Add level reference to quest data
        return quests.map((quest, index) => ({
            ...quest,
            data: {
                ...quest,
                levelId: levels[index % levels.length].id
            }
        }));
    }
    getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Public methods for customization
    getStoryGenerator() {
        return this.storyGenerator;
    }
    getLevelGenerator() {
        return this.levelGenerator;
    }
    getQuestGenerator() {
        return this.questGenerator;
    }
}
exports.NarrativeGenerator = NarrativeGenerator;
