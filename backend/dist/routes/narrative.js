"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NarrativeGenerator_1 = require("../services/narrative/NarrativeGenerator");
const router = express_1.default.Router();
const narrativeGenerator = new NarrativeGenerator_1.NarrativeGenerator();
// Generate a complete game narrative
router.post('/generate', async (req, res) => {
    try {
        const config = {
            theme: req.body.theme || 'fantasy',
            complexity: Math.min(10, Math.max(1, req.body.complexity || 5)),
            numLevels: Math.min(20, Math.max(1, req.body.numLevels || 5)),
            numQuests: Math.min(50, Math.max(1, req.body.numQuests || 10)),
            levelParams: {
                minWidth: Math.max(5, req.body.minWidth || 10),
                maxWidth: Math.min(100, req.body.maxWidth || 20),
                minHeight: Math.max(5, req.body.minHeight || 10),
                maxHeight: Math.min(100, req.body.maxHeight || 20)
            }
        };
        const narrative = narrativeGenerator.generateGameNarrative(config);
        res.json(narrative);
    }
    catch (error) {
        console.error('Error generating narrative:', error);
        res.status(500).json({ error: 'Failed to generate narrative' });
    }
});
// Generate just a story
router.post('/story', async (req, res) => {
    try {
        const theme = req.body.theme || 'fantasy';
        const complexity = Math.min(10, Math.max(1, req.body.complexity || 5));
        const story = narrativeGenerator.getStoryGenerator().generateStoryArc(theme, complexity);
        res.json(story);
    }
    catch (error) {
        console.error('Error generating story:', error);
        res.status(500).json({ error: 'Failed to generate story' });
    }
});
// Generate a single level
router.post('/level', async (req, res) => {
    try {
        const params = {
            width: Math.min(100, Math.max(5, req.body.width || 20)),
            height: Math.min(100, Math.max(5, req.body.height || 20)),
            difficulty: Math.min(10, Math.max(1, req.body.difficulty || 5)),
            theme: req.body.theme || 'fantasy'
        };
        const level = narrativeGenerator.getLevelGenerator().generateLevel(params);
        res.json(level);
    }
    catch (error) {
        console.error('Error generating level:', error);
        res.status(500).json({ error: 'Failed to generate level' });
    }
});
// Generate a single quest
router.post('/quest', async (req, res) => {
    try {
        const params = {
            theme: req.body.theme || 'fantasy',
            difficulty: Math.min(10, Math.max(1, req.body.difficulty || 5)),
            type: req.body.type || 'side',
            requiredElements: req.body.requiredElements || []
        };
        const quest = narrativeGenerator.getQuestGenerator().generateQuest(params);
        res.json(quest);
    }
    catch (error) {
        console.error('Error generating quest:', error);
        res.status(500).json({ error: 'Failed to generate quest' });
    }
});
exports.default = router;
