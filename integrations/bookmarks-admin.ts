/**
 * 功能：注册 `/bookmarks/nav/`、`/bookmarks/admin/` 页面路由；dev 时挂载 `/admin/api/*`。
 * 关联：src/bookmarks/nav/entry.astro、admin/entry.astro、admin/lib/admin-api.server.ts
 */
import type { ServerResponse } from "node:http";
import type { Connect } from "vite";
import type { AstroIntegration } from "astro";
import {
  handleFetchMetadata,
  handleGetVersion,
  handleListVersions,
  handleRestore,
  handleSave,
  requireAdminAuth,
} from "../src/bookmarks/admin/lib/admin-api.server.ts";

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}

function requestPath(req: Connect.IncomingMessage) {
  const raw = req.url ?? "/";
  const pathname = raw.split("?")[0] ?? "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function toWebRequest(req: Connect.IncomingMessage): Request {
  const host = req.headers.host ?? "localhost";
  const url = new URL(req.url ?? "/", `http://${host}`);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  return new Request(url, { method: req.method, headers });
}

async function toNodeResponse(source: Response, res: ServerResponse) {
  res.statusCode = source.status;
  source.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.end(Buffer.from(await source.arrayBuffer()));
}

function bookmarksAdminApiPlugin() {
  return {
    name: "bookmarks-admin-api",
    enforce: "pre" as const,
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use(
        async (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
          const pathname = requestPath(req);
          if (!pathname.startsWith("/admin/api")) return next();

          const webRequest = toWebRequest(req);
          const denied = requireAdminAuth(webRequest);
          if (denied) {
            await toNodeResponse(denied, res);
            return;
          }

          try {
            if (pathname === "/admin/api/fetch-metadata" && req.method === "GET") {
              await toNodeResponse(await handleFetchMetadata(webRequest), res);
              return;
            }

            if (pathname === "/admin/api/versions" && req.method === "GET") {
              const id = new URL(webRequest.url).searchParams.get("id");
              await toNodeResponse(id ? handleGetVersion(id) : handleListVersions(), res);
              return;
            }

            if (pathname === "/admin/api/save" && req.method === "POST") {
              const body = await readBody(req);
              await toNodeResponse(
                await handleSave(
                  new Request(webRequest.url, {
                    method: "POST",
                    headers: webRequest.headers,
                    body,
                  }),
                ),
                res,
              );
              return;
            }

            if (pathname === "/admin/api/restore" && req.method === "POST") {
              const body = await readBody(req);
              await toNodeResponse(
                await handleRestore(
                  new Request(webRequest.url, {
                    method: "POST",
                    headers: webRequest.headers,
                    body,
                  }),
                ),
                res,
              );
              return;
            }

            await toNodeResponse(
              new Response(JSON.stringify({ error: "Not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
              }),
              res,
            );
          } catch (error) {
            await toNodeResponse(
              new Response(
                JSON.stringify({
                  error: error instanceof Error ? error.message : String(error),
                }),
                {
                  status: 500,
                  headers: { "Content-Type": "application/json" },
                },
              ),
              res,
            );
          }
        },
      );
    },
  };
}

export function bookmarksAdmin(): AstroIntegration {
  return {
    name: "bookmarks-admin",
    hooks: {
      "astro:config:setup": ({ updateConfig, injectRoute }) => {
        injectRoute({
          pattern: "/bookmarks/nav",
          entrypoint: new URL("../src/bookmarks/nav/entry.astro", import.meta.url),
          prerender: true,
        });
        injectRoute({
          pattern: "/bookmarks/admin",
          entrypoint: new URL("../src/bookmarks/admin/entry.astro", import.meta.url),
          prerender: true,
        });
        updateConfig({
          vite: {
            plugins: [bookmarksAdminApiPlugin()],
          },
        });
      },
    },
  };
}
