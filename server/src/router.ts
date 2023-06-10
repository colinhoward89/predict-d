import { Router } from "express";
import * as userCont from "./controllers/user.controller";
import * as compCont from "./controllers/comp.controller";
import * as fixtCont from "./controllers/fixture.controller";
import * as leagueCont from "./controllers/league.controller";
import * as predCont from "./controllers/prediction.controller";

const router = Router();

router.post("/register", userCont.createUser);
router.post("/login", userCont.login);
router.post("/logout", userCont.logout);
router.get("/get-all-users", userCont.getAllUsers);
router.get("/getuser/:email", userCont.getUser);
router.delete("/users/:id", userCont.deleteUser);
router.put("/user/:id", userCont.editUser);

router.get("/competitions", compCont.getAllComps);

router.get("/:compid/fixtures", fixtCont.getAllFixtures);

router.post("/createleague", leagueCont.createLeague);
router.get("/myleagues/:id", leagueCont.getMyLeagues);
router.get("/joinleagues/:id", leagueCont.getLeaguesToJoin);
router.put("/joinleague", leagueCont.joinLeague);

router.post("/predict", predCont.predictOne);
router.get("/predictions", predCont.getPredictions);

export default router;