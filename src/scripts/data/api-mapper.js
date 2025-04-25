import { Map } from '../utils/map.js';

export async function reportMapper(stories) {
    return {
      ...stories,
      location: {
        ...stories.location,
        placeName: await Map.getPlaceNameByCoordinate(
          stories.location.latitude,
          stories.location.longitude,
        ),
      },
    };
  }