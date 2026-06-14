import { getRecommendations } from "@/lib/dotcms";

/**
 * Backend-for-frontend for the recommendation widgets.
 *
 * The home page's "Recommended Products" / "Recommended Events" are VtlInclude
 * (Velocity) widgets with no headless JSON payload. The client-side
 * <VtlInclude> component calls this route to fetch the equivalent content via
 * the Content API. Doing it here (server-side) keeps the dotCMS auth token off
 * the browser and sidesteps cross-origin requests to the dotCMS host.
 *
 * GET /api/recommendations?type=Product&limit=3
 */
const ALLOWED_TYPES = new Set(["Product", "calendarEvent", "Activity"]);
const MAX_LIMIT = 12;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "";

  if (!ALLOWED_TYPES.has(type)) {
    return Response.json(
      { error: `Unsupported content type "${type}".` },
      { status: 400 },
    );
  }

  const requested = Number(searchParams.get("limit"));
  const limit = Math.min(
    Number.isFinite(requested) && requested > 0 ? requested : 3,
    MAX_LIMIT,
  );

  const contentlets = await getRecommendations(type, limit);
  return Response.json({ contentlets });
}
