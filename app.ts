import { Application, Router } from "./deps.ts";
import controller from "./controller.ts";

const router = new Router();
router
    .get("/", ctx => {
        ctx.response.status = 200;
    })
    .get("/feedback/:id", controller.getFeedback)
    .get("/feedback", controller.getAllFeedback)
    .post("/feedback", controller.addFeedback)
    .put("/feedback/:id", controller.updateFeedback)
    .delete("/feedback/:id", controller.deleteFeedback);

const app = new Application()
    .use(router.routes())
    .use(router.allowedMethods());

console.log("Server started on http://localhost:8000");
await app.listen({ port: 8000 });