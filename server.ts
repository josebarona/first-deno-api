import {Application, Router} from 'https://deno.land/x/oak/mod.ts';

const router = new Router();

router.get('/', ctx => {
  ctx.response.body = {
	  message: "Hello from a api running on deno 🦕" 
  };
});

router.get('/nums', ctx => {
	try {
		throw new Error("trying out error handling");
	}
	catch (err) {
		throw err;
	}
});

router.post('/echo', async ctx => {
  try {
    const {value} = await ctx.request.body();
    ctx.response.body = {body: value};
  }
  catch (error) {
    // error.status = 500;
    throw error;
  }
});

router.get('/echo/:name/:lastname', ctx => {
	const {name, lastname} = ctx.params;
	ctx.response.body = {name, lastname};
});

const app = new Application();

app.use(async (ctx, next) => {
  try {
	  await next();
  }
  catch (err) {
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