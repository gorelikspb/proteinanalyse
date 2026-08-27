/**
 * Optional standalone Worker for 301 from the old Pages hostname.
 *
 * Route this Worker ONLY to: proteinanalysis.pages.dev/*
 * Do not attach it to seqanalysis.org or proteinanalyse.pages.dev.
 *
 * Keep this file out of functions/. Pages compiles every functions/*.js
 * file; a pass-through fetch(request) on the same host loops and 500s.
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname === "proteinanalysis.pages.dev") {
      return Response.redirect(
        `https://seqanalysis.org${url.pathname}${url.search}`,
        301
      );
    }

    return new Response("Not found", { status: 404 });
  },
};
