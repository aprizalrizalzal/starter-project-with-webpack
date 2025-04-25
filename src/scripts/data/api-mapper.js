import Map from '../utils/leaflet/map.js';

export async function storyMapper(story) {
    return {
      ...story, 
      location: {
        placeName: await Map.getPlaceNameByCoordinate(
          story.lat,
          story.lon,
        ),
      },
    };
  }