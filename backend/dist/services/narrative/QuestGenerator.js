"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestGenerator = void 0;
class QuestGenerator {
    constructor() {
        this.questTemplates = [];
        this.objectiveTemplates = [];
        this.rewardTemplates = [];
        this.initializeTemplates();
    }
    initializeTemplates() {
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
    generateQuest(params) {
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
    generateObjectives(theme, difficulty) {
        const numObjectives = Math.max(1, Math.floor(difficulty * 1.5));
        const objectives = [];
        for (let i = 0; i < numObjectives; i++) {
            const template = this.objectiveTemplates[Math.floor(Math.random() * this.objectiveTemplates.length)];
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
    generateObjectiveDescription(theme, type) {
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
    generateTarget(theme, type) {
        return `${theme}_${type}_target`;
    }
    generateRewards(difficulty) {
        const numRewards = Math.max(1, Math.floor(difficulty));
        const rewards = [];
        for (let i = 0; i < numRewards; i++) {
            const template = this.rewardTemplates[Math.floor(Math.random() * this.rewardTemplates.length)];
            rewards.push({
                ...template,
                id: `reward_${Date.now()}_${i}`,
                value: Math.floor(template.value * (0.8 + difficulty * 0.4))
            });
        }
        return rewards;
    }
    generatePrerequisites(difficulty) {
        // Simple implementation - can be expanded based on game progression system
        return difficulty > 2 ? ['previous_quest_completion'] : [];
    }
    calculateEstimatedDuration(difficulty, numObjectives) {
        // Duration in minutes
        return Math.floor(15 * difficulty + 5 * numObjectives);
    }
    generateQuestTitle(theme) {
        return `The ${theme} Quest`;
    }
    generateQuestDescription(theme) {
        return `An exciting quest involving ${theme}`;
    }
    // Public methods for managing templates
    addQuestTemplate(template) {
        this.questTemplates.push(template);
    }
    addObjectiveTemplate(template) {
        this.objectiveTemplates.push(template);
    }
    addRewardTemplate(reward) {
        this.rewardTemplates.push(reward);
    }
}
exports.QuestGenerator = QuestGenerator;
