import express from 'express';
import cors from 'cors';
import codeSynthesisRoutes from './routes/code-synthesis';
import assetGenerationRoutes from './routes/asset-generation';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/code-synthesis', codeSynthesisRoutes);
app.use('/api/assets', assetGenerationRoutes);

export default app; 