import { Request, Response } from 'express';
import { prisma } from '../config/database';
import {
  error as errorResponse,
  success as successResponse,
} from '../helpers/response.helper';

export const ingestTelemetry = async (req: Request, res: Response) => {
  try {
    const {
      deviceMac,
      deviceId, // fallback
      fruitType,
      tempC,
      temperatureC, // fallback
      humPct,
      humidityPct, // fallback
      gasPpm,
      gasValue, // fallback
      weightGram,
      coolingFanOn,
      exhaustFanOn,
      fanMode,
    } = req.body;

    const deviceIdToUse = deviceMac || deviceId;
    if (!deviceIdToUse)
      return errorResponse(res, 'Device ID or MAC is required', 400);

    // Pastikan device terdaftar di DB (upsert jika tidak ada)
    const device = await prisma.iotDevice.upsert({
      where: { id: deviceIdToUse },
      update: { lastSeen: new Date() },
      create: {
        id: deviceIdToUse,
        name: `Device ${deviceIdToUse}`,
        fruitType: fruitType || 'unknown',
      },
    });

    // 1. Dapatkan kontrol yang disetel admin dari Database (IotDevice)
    const deviceControl = await prisma.iotDevice.findUnique({
      where: { id: deviceIdToUse },
    });

    // 2. Simpan history data sensor, namun TIMPA nilai status Exhaust/Cooling
    // sesuai dengan yang ada di Master Control (bila mode-nya MANUAL)
    const isManual = deviceControl?.fanMode === 'manual';
    const finalCoolingFan = isManual
      ? deviceControl.coolingFanOn
      : Boolean(coolingFanOn);
    const finalExhaustFan = isManual
      ? deviceControl.exhaustFanOn
      : Boolean(exhaustFanOn);

    const reading = await prisma.sensorReading.create({
      data: {
        deviceId: deviceIdToUse,
        fruitType: fruitType || 'apel',
        temperatureC: Number(tempC ?? temperatureC) || 0,
        humidityPct: Number(humPct ?? humidityPct) || 0,
        gasValue: Number(gasPpm ?? gasValue) || 0,
        weightGram: Number(weightGram) || 0,
        coolingFanOn: finalCoolingFan,
        exhaustFanOn: finalExhaustFan,
        fanMode: deviceControl?.fanMode || fanMode || 'auto',
      },
    });

    // Kirim response status relay target ke perangkat hardware
    return successResponse(
      res,
      {
        reading,
        control: {
          fanMode: deviceControl?.fanMode || 'auto',
          coolingFanOn: finalCoolingFan,
          exhaustFanOn: finalExhaustFan,
        },
      },
      'Telemetry saved successfully',
      201,
    );
  } catch (error) {
    console.error('Telemetry Error:', error);
    return errorResponse(res, 'Failed to save telemetry data', 500);
  }
};

export const getLatestTelemetry = async (req: Request, res: Response) => {
  try {
    // Ambil data terbaru untuk apel
    const latestApel = await prisma.sensorReading.findFirst({
      where: { fruitType: 'apel' },
      orderBy: { timestamp: 'desc' },
    });
    const deviceApel = await prisma.iotDevice.findUnique({
      where: { id: 'ESP32-APEL-01' },
    });

    // Ambil data terbaru untuk pisang
    const latestPisang = await prisma.sensorReading.findFirst({
      where: { fruitType: 'pisang' },
      orderBy: { timestamp: 'desc' },
    });
    const devicePisang = await prisma.iotDevice.findUnique({
      where: { id: 'ESP32-PISANG-01' },
    });

    return successResponse(
      res,
      {
        apel: latestApel
          ? {
              ...latestApel,
              fanMode: deviceApel?.fanMode ?? latestApel.fanMode,
              coolingFanOn: deviceApel?.coolingFanOn ?? latestApel.coolingFanOn,
              exhaustFanOn: deviceApel?.exhaustFanOn ?? latestApel.exhaustFanOn,
            }
          : null,
        pisang: latestPisang
          ? {
              ...latestPisang,
              fanMode: devicePisang?.fanMode ?? latestPisang.fanMode,
              coolingFanOn:
                devicePisang?.coolingFanOn ?? latestPisang.coolingFanOn,
              exhaustFanOn:
                devicePisang?.exhaustFanOn ?? latestPisang.exhaustFanOn,
            }
          : null,
      },
      'Latest telemetry fetched successfully',
    );
  } catch (error) {
    console.error('Fetch Telemetry Error:', error);
    return errorResponse(res, 'Failed to fetch telemetry data', 500);
  }
};

export const updateControlTarget = async (req: Request, res: Response) => {
  try {
    const deviceId = req.params.deviceId as string;
    const { fanMode, coolingFanOn, exhaustFanOn } = req.body;

    const updatedDevice = await prisma.iotDevice.update({
      where: { id: deviceId },
      data: {
        fanMode: fanMode !== undefined ? fanMode : undefined,
        coolingFanOn:
          coolingFanOn !== undefined ? Boolean(coolingFanOn) : undefined,
        exhaustFanOn:
          exhaustFanOn !== undefined ? Boolean(exhaustFanOn) : undefined,
      },
    });

    return successResponse(res, updatedDevice, 'Device control updated');
  } catch (error) {
    console.error('Update Control Error:', error);
    return errorResponse(res, 'Failed to update device control', 500);
  }
};
