import { Router } from 'express'
import {
  createStop,
  getAllStops,
  getStopById,
  updateStop,
  deleteStop,
  deleteAllStops
} from "../controllers/Stops.controller.js";

const router = Router()

router.post("/stops", createStop);
router.get("/stops", getAllStops);
router.get("/stops/:routeId/:StopOrder", getStopById);
router.put("/stops/:routeId/:StopOrder", updateStop);
router.delete("/stops/:routeId/:StopOrder", deleteStop);
router.delete("/stops", deleteAllStops);

export default router;