import {Application, Router} from "https://deno.land/x/oak/mod.ts";
import {v4} from "https://deno.land/std/uuid/mod.ts";


const db = new Map<string, any>();

const router = new Router();

router.post("/tweet", async ctx => {
    const {value} = await ctx.request.body();
    value.date = (new Date()).toString();
    db.set(v4.generate(), value);
    ctx.response.status = 200;
    ctx.response.body = {tweet: value};
});

router.get("/tweets", async ctx => {
  const tweets = [...db.values()];
  ctx.response.status = 200;
  ctx.response.body = {tweets};
});

const app = new Application();

app.use(async (ctx, next) => {
  try {
    await next();
  }
  catch(err) {
    ctx.response.status = err.status || 500;
    ctx.response.body = {
      errorMessage: err.message,
    };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 8000;
console.log(`Listening on http://localhost:${port}`);
app.listen({port});
