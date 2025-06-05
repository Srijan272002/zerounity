import express from 'express';
import cors from 'cors';
import codeSynthesisRoutes from './routes/code-synthesis';
import assetGenerationRoutes from './routes/asset-generation';
import unityRoutes from './routes/unity';
import godotRoutes from './routes/godot';
import exportRoutes from './routes/export';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/code-synthesis', codeSynthesisRoutes);
app.use('/api/assets', assetGenerationRoutes);
app.use('/api/unity', unityRoutes);
app.use('/api/godot', godotRoutes);
app.use('/api/export', exportRoutes);

export default app; 