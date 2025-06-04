// Types for the narrative generation system

export interface StoryElement {
  id: string;
  type: 'character' | 'location' | 'item' | 'event';
  name: string;
  description: string;
  attributes: Record<string, any>;
}

export interface StoryArc {
  id: string;
  title: string;
  description: string;
  elements: StoryElement[];
  plotPoints: PlotPoint[];
  mainObjective: string;
}

export interface PlotPoint {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  consequences: string[];
  type: 'main' | 'side' | 'hidden';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LevelDesign {
  id: string;
  name: string;
  description: string;
  layout: LevelLayout;
  objectives: string[];
  challenges: Challenge[];
  rewards: Reward[];
}

export interface LevelLayout {
  dimensions: {
    width: number;
    height: number;
    depth?: number;
  };
  terrain: TerrainType[];
  points_of_interest: PointOfInterest[];
}

export interface TerrainType {
  type: string;
  position: Position3D;
  properties: Record<string, any>;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface PointOfInterest {
  id: string;
  type: 'quest' | 'treasure' | 'encounter' | 'landmark';
  position: Position3D;
  data: Record<string, any>;
}

export interface Challenge {
  id: string;
  type: 'combat' | 'puzzle' | 'exploration' | 'dialogue';
  difficulty: number;
  requirements: string[];
  rewards: Reward[];
}

export interface Reward {
  id: string;
  type: 'item' | 'experience' | 'currency' | 'reputation';
  value: number;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'hidden';
  objectives: QuestObjective[];
  prerequisites: string[];
  rewards: Reward[];
  storyElements: StoryElement[];
  difficulty: number;
  estimatedDuration: number;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'collect' | 'kill' | 'interact' | 'explore' | 'escort';
  target: string;
  quantity: number;
  completed: boolean;
  optional: boolean;
} 