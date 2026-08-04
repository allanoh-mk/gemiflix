module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/src/app/health/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$checks$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/health-checks.ts [app-route] (ecmascript)");
;
;
async function GET() {
    const checks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$checks$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runHealthChecks"])();
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$health$2d$checks$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeOverallStatus"])(checks);
    const httpStatus = status === 'error' ? 503 : 200;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status,
        timestamp: new Date().toISOString(),
        checks
    }, {
        status: httpStatus,
        headers: {
            'Cache-Control': 'no-store'
        }
    });
}
}),
"[project]/src/lib/health-checks.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeOverallStatus",
    ()=>computeOverallStatus,
    "runHealthChecks",
    ()=>runHealthChecks
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const PROBE_TIMEOUT_MS = 3000;
async function checkDatabase() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        return {
            status: 'mock',
            message: 'DATABASE_URL not set; using mock db'
        };
    }
    const start = Date.now();
    const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
    try {
        await prisma.$queryRaw`SELECT 1`;
        return {
            status: 'ok',
            latencyMs: Date.now() - start
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Database connection failed';
        return {
            status: 'error',
            message,
            latencyMs: Date.now() - start
        };
    } finally{
        await prisma.$disconnect();
    }
}
async function probeUrl(url) {
    return fetch(url, {
        signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
        cache: 'no-store'
    });
}
async function checkMoviebox() {
    const baseUrl = process.env.MOVIEBOX_API_URL ?? 'http://127.0.0.1:8000';
    const start = Date.now();
    try {
        const healthUrl = new URL('/health', baseUrl).toString();
        const healthResponse = await probeUrl(healthUrl);
        if (healthResponse.ok) {
            return {
                status: 'ok',
                latencyMs: Date.now() - start
            };
        }
        if (healthResponse.status !== 404) {
            return {
                status: healthResponse.status < 500 ? 'ok' : 'error',
                message: healthResponse.status >= 500 ? `Moviebox returned ${healthResponse.status}` : undefined,
                latencyMs: Date.now() - start
            };
        }
        const rootResponse = await probeUrl(new URL('/', baseUrl).toString());
        const reachable = rootResponse.status < 500;
        return {
            status: reachable ? 'ok' : 'error',
            message: reachable ? undefined : `Moviebox returned ${rootResponse.status}`,
            latencyMs: Date.now() - start
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Moviebox unreachable';
        return {
            status: 'error',
            message,
            latencyMs: Date.now() - start
        };
    }
}
function checkAi() {
    const providers = [];
    if (process.env.OPENROUTER_API_KEY) {
        providers.push('openrouter');
    }
    if (process.env.NVAPI_API_KEY) {
        providers.push('nvapi');
    }
    if (providers.length === 0) {
        return {
            status: 'skipped',
            message: 'No AI keys configured'
        };
    }
    return {
        status: 'ok',
        message: `Configured: ${providers.join(', ')}`
    };
}
function computeOverallStatus(checks) {
    const blockingChecks = [
        checks.database,
        checks.moviebox
    ];
    if (blockingChecks.some((check)=>check.status === 'error')) {
        return 'error';
    }
    if (checks.database.status === 'mock' || checks.ai.status === 'skipped') {
        return 'ok';
    }
    return 'ok';
}
async function runHealthChecks() {
    const [database, moviebox] = await Promise.all([
        checkDatabase(),
        checkMoviebox()
    ]);
    return {
        app: {
            status: 'ok'
        },
        database,
        moviebox,
        ai: checkAi()
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-gj5k9._.js.map