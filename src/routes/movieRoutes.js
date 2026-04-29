import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { MovieSchema } from "../validators/movieValidator.js";

const router = express.Router();
import { addMovie, deleteMovie, getMovie, getMovies } from "../controller/movieController.js";


router.use(authMiddleware);
router.get("/", getMovies);


router.delete("/:id", deleteMovie);

router.post("/",validateRequest(MovieSchema
  
) , addMovie);

router.get("/:id", getMovie);



export default router;