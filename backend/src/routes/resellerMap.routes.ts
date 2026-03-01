import { Router } from 'express';
import * as resellerMapController from '../controllers/resellerMap.controller';

const router = Router();

router.get('/', resellerMapController.getResellerMaps);

export default router;
