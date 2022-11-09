import { Plant } from '../models/plant';

export function upsertPlantTag(plants: Plant[], plantId: string, tag: string): Plant[] {
  return updateTagOnPlant(plants, plantId, tag, 'upsert');
}

export function removePlantTag(plants: Plant[], plantId: string, tag: string): Plant[] {
  return updateTagOnPlant(plants, plantId, tag, 'remove');
}

function updateTagOnPlant(plants: Plant[], plantId: string, tag: string, action: 'upsert' | 'remove'): Plant[] {
  const plantIndex = plants.findIndex(p => p.id === plantId);

  if (plantIndex === -1) {
    return plants;
  }

  const plant = plants[plantIndex];
  const shouldUpdate = (action === 'upsert' && !plant.tags.includes(tag)) || (action === 'remove' && plant.tags.includes(tag));

  if (!plant || !shouldUpdate) {
    return plants;
  }
  
  const newTags = action === 'upsert' ? [...plant.tags, tag] : [...plant.tags].splice(plant.tags.indexOf(tag), 1);
  const newPlant = {...plant, tags: newTags};
  const newPlants = [...plants];
  newPlants.splice(plantIndex, 1, newPlant);
  return newPlants;
}