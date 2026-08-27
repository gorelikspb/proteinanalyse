/**
 * Pages Function middleware.
 *
 * Only the old Pages hostname is redirected. The current project hostname
 * (proteinanalyse.pages.dev) and seqanalysis.org must keep serving the site.
 *
 * Static HTML is excluded from Functions via public/_routes.json, so this
 * mainly applies to /api/*. Failures must never 500 the site.
 */

const OLD_HOSTS = new Set(["proteinanalysis.pages.dev"]);
const CANONICAL_ORIGIN = "https://seqanalysis.org";

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    if (OLD_HOSTS.has(url.hostname)) {
      return Response.redirect(`${CANONICAL_ORIGIN}${url.pathname}${url.search}`, 301);
    }
  } catch (err) {
    console.error("middleware error", err);
  }
  return context.next();
}
