import { AirQuality, IAirQuality } from '@src/models/AirQuality';

// **** Functions **** //

/**
 * Get one air quality document by latitude & longitude.
 */
async function getOne(
  latitude: number,
  longitude: number,
): Promise<IAirQuality | null> {
  return AirQuality.findOne({ latitude, longitude });
}

/**
 * Get all air quality documents.
 */
async function getAll(): Promise<IAirQuality[]> {
  return AirQuality.find();
}

/**
 * Get most polluted document by latitude & longitude
 */
async function getMostPolluted(
  latitude: number,
  longitude: number,
): Promise<IAirQuality | null> {
  return AirQuality.findOne({ latitude, longitude }, null, { sort: { 'pollution.aqius': -1 } });
}

/**
 * Add one air quality document.
 */
async function add(airQualityDoc: IAirQuality): Promise<void> {
  await AirQuality.create({
    latitude: airQualityDoc.latitude,
    longitude: airQualityDoc.longitude,
    pollution: {
      ts: airQualityDoc.pollution.ts,
      aqius: airQualityDoc.pollution.aqius,
      mainus: airQualityDoc.pollution.mainus,
      aqicn: airQualityDoc.pollution.aqicn,
      maincn: airQualityDoc.pollution.maincn,
    },
  });
}

// **** Export default **** //

export default {
  getOne,
  getAll,
  getMostPolluted,
  add,
} as const;