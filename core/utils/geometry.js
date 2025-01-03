import { config as maptilerClientConfig, geocoding } from '@maptiler/client';

maptilerClientConfig.apiKey = process.env.MAPTILER_API_KEY;
export default async function getGeometry(location) {
    const geoData = await geocoding.forward(location, { limit: 1 });
    return geoData.features.length === 0 ? null : geoData.features[0].geometry;
}