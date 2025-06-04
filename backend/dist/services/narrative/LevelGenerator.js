"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelGenerator = void 0;
class LevelGenerator {
    constructor() {
        this.challengeTemplates = [];
        this.rewardTemplates = [];
        this.terrainTypes = ['plain', 'mountain', 'forest', 'water', 'desert'];
        this.initializeTemplates();
    }
    initializeTemplates() {
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
    generateLevel(params) {
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
    generateLayout(width, height) {
        return {
            dimensions: { width, height },
            terrain: this.generateTerrain(width, height),
            points_of_interest: this.generatePointsOfInterest(width, height)
        };
    }
    generateTerrain(width, height) {
        const terrain = [];
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
    getRandomTerrainType() {
        const index = Math.floor(Math.random() * this.terrainTypes.length);
        return this.terrainTypes[index];
    }
    generatePointsOfInterest(width, height) {
        const numPoints = Math.max(3, Math.floor((width + height) / 4));
        const points = [];
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
    getRandomPoiType() {
        const types = ['quest', 'treasure', 'encounter', 'landmark'];
        return types[Math.floor(Math.random() * types.length)];
    }
    getRandomPosition(width, height) {
        return {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
            z: 0
        };
    }
    generateChallenges(difficulty) {
        const numChallenges = Math.max(2, Math.floor(difficulty * 1.5));
        const challenges = [];
        for (let i = 0; i < numChallenges; i++) {
            const template = this.challengeTemplates[Math.floor(Math.random() * this.challengeTemplates.length)];
            challenges.push({
                ...template,
                id: `challenge_${Date.now()}_${i}`,
                difficulty: Math.ceil(difficulty * (0.5 + Math.random() * 0.5)),
                rewards: this.generateRewards(difficulty * 0.5)
            });
        }
        return challenges;
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
    generateObjectives(theme, difficulty) {
        const numObjectives = Math.max(1, Math.floor(difficulty));
        const objectives = [];
        for (let i = 0; i < numObjectives; i++) {
            objectives.push(`${theme} objective ${i + 1}`);
        }
        return objectives;
    }
    generateLevelName(theme) {
        return `${theme} Level`;
    }
    generateLevelDescription(theme) {
        return `A challenging level themed around ${theme}`;
    }
    // Public methods for managing templates
    addTerrainType(type) {
        if (!this.terrainTypes.includes(type)) {
            this.terrainTypes.push(type);
        }
    }
    addChallengeTemplate(challenge) {
        this.challengeTemplates.push(challenge);
    }
    addRewardTemplate(reward) {
        this.rewardTemplates.push(reward);
    }
}
exports.LevelGenerator = LevelGenerator;
