import { RouterContext, State, Status } from "./deps.ts";
import { IFeedback } from "./model.ts";
import repo from "./repo.ts";

const getFeedback = async (ctx: RouterContext<"/feedback/:id", { id: string; }>) => {
    const { id } = ctx.params;
    ctx.response.body = await repo.getFeedback(id);
};

const getAllFeedback = async (ctx: RouterContext<"/feedback", State>) => {
    ctx.response.body = await repo.getAllFeedback();
};

const addFeedback = async (ctx: RouterContext<"/feedback", State>) => {
    const body = await ctx.request.body();
    const value = await body.value as IFeedback;
    if (!value?.id) {
        value.id = crypto.randomUUID();
    }
    const written = await repo.addFeedback(value);
    ctx.response.body = written;
};

const updateFeedback = async (ctx: RouterContext<"/feedback/:id", { id: string; }>) => {
    const { id } = ctx.params;
    const body = await ctx.request.body();
    const value = await body.value as IFeedback;
    if (value?.id && value?.id !== id) {
        ctx.response.status = Status.BadRequest;
        return;
    }
    const written = await repo.updateFeedback(id, value);
    ctx.response.body = written;
};

const deleteFeedback = async (ctx: RouterContext<"/feedback/:id", { id: string; }>) => {
    const { id } = ctx.params;
    ctx.response.body = await repo.removeFeedback(id);
};

export default { getFeedback, getAllFeedback, addFeedback, updateFeedback, deleteFeedback };
