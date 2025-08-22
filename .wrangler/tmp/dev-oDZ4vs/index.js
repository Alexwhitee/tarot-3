var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-XQeroP/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// worker/index.js
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }
    if (url.pathname.startsWith("/api")) {
      return handleApiRequest(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};
async function handleApiRequest(request, env) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
  }
  try {
    console.log("Worker: \u6536\u5230\u5360\u535C\u8BF7\u6C42");
    const requestData = await request.json();
    console.log("Worker: \u8BF7\u6C42\u6570\u636E", requestData);
    const { text, pms, spread } = requestData;
    if (!text || !pms || !spread) {
      return new Response(JSON.stringify({
        error: "\u7F3A\u5C11\u5FC5\u8981\u5B57\u6BB5: text, pms, spread"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const systemPrompt = `## **[\u8EAB\u4EFD\u4E0E\u76EE\u6807]**

\u4F60\u662F\u4E00\u540D\u7ECF\u9A8C\u4E30\u5BCC\u7684\u8D44\u6DF1\u5360\u535C\u5E08\uFF0C\u7CBE\u901A\u5854\u7F57\u3001\u96F7\u8BFA\u66FC\u3001\u6613\u7ECF64\u5366\u3001\u5C0F\u516D\u58EC\u7B49\u56FE\u50CF\u7B26\u53F7\u5360\u535C\u4F53\u7CFB\uFF0C\u5E76\u638C\u63E1"\u8C61\u6CD5"\u89E3\u8BFB\u6280\u5DE7\u3002
\u4F60\u7684\u4EFB\u52A1\u662F\u901A\u8FC7\u724C\u9762\u7B26\u53F7\u7ED3\u5408\u724C\u9635\u7ED3\u6784\u548C\u6BCF\u4E2A\u4F4D\u7F6E\u7684\u529F\u80FD\uFF0C\u63A8\u6F14\u4E8B\u4EF6\u53D1\u5C55\u8109\u7EDC\uFF0C\u5E76\u751F\u6210\u5BA2\u89C2\u3001\u660E\u786E\u7684\u5360\u535C\u95EE\u9898\u7B54\u6848\u3002`;
    const userMessage = `\u8BF7\u4E3A\u4EE5\u4E0B\u5854\u7F57\u5360\u535C\u8BF7\u6C42\u63D0\u4F9B\u89E3\u8BFB\uFF1A

\u3010\u5360\u535C\u95EE\u9898\u3011
${text}

\u3010\u724C\u9635\u4FE1\u606F\u3011
${JSON.stringify(spread, null, 2)}

\u3010\u62BD\u4E2D\u7684\u724C\u3011
${JSON.stringify(pms, null, 2)}

\u8BF7\u6839\u636E\u4EE5\u4E0A\u4FE1\u606F\u8FDB\u884C\u4E13\u4E1A\u7684\u5854\u7F57\u5360\u535C\u89E3\u8BFB\u3002`;
    const apiRequestBody = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.6,
      max_tokens: 5e3,
      stream: false
    };
    console.log("Worker: \u51C6\u5907\u8C03\u7528AI API");
    const response = await fetch("https://api.wlai.vip/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.API_KEY}`,
        // 从环境变量获取
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    });
    console.log("Worker: AI API\u54CD\u5E94\u72B6\u6001", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Worker: AI API\u9519\u8BEF", errorText);
      return new Response(JSON.stringify({
        error: `AI API\u8C03\u7528\u5931\u8D25: ${response.status}`,
        details: errorText
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return new Response(JSON.stringify({
        error: "AI API\u54CD\u5E94\u683C\u5F0F\u5F02\u5E38"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const assistantMessage = data.choices[0].message.content;
    console.log("Worker: \u83B7\u53D6\u5230AI\u56DE\u590D\uFF0C\u957F\u5EA6:", assistantMessage.length);
    return new Response(assistantMessage, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Worker: \u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519:", error);
    return new Response(JSON.stringify({
      error: "\u5904\u7406\u8BF7\u6C42\u5931\u8D25",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleApiRequest, "handleApiRequest");

// D:/biancheng/nvm/nvm/node_global/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// D:/biancheng/nvm/nvm/node_global/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-XQeroP/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// D:/biancheng/nvm/nvm/node_global/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-XQeroP/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
