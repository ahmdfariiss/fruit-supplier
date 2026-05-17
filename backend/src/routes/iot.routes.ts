import { Router } from 'express';
import {
  ingestTelemetry,
  getLatestTelemetry,
  updateControlTarget,
} from '../controllers/iot.controller';

export const iotRouter = Router();

// Endpoint webhook untuk ESP32 (tanpa auth untuk prototyping)
iotRouter.post('/telemetry', ingestTelemetry);
iotRouter.get('/telemetry/latest', getLatestTelemetry);
iotRouter.put('/control/:deviceId', updateControlTarget);
