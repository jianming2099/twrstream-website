export default async (_request: Request, context: any) => {
  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  let html = await response.text();
  const attr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const first = (re: RegExp) => (html.match(re)?.[1] || "").trim();
  const title = first(/<title[^>]*>([\s\S]*?)<\/title>/i).replace(/<[^>]+>/g, "");
  const description = first(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) || first(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
  const canonical = first(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i) || first(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["'][^>]*>/i);

  const meta: string[] = [];
  if (!/property=["']og:site_name["']/i.test(html)) meta.push('<meta property="og:site_name" content="TWR STREAM">');
  if (!/property=["']og:type["']/i.test(html)) meta.push('<meta property="og:type" content="website">');
  if (title && !/property=["']og:title["']/i.test(html)) meta.push(`<meta property="og:title" content="${attr(title)}">`);
  if (description && !/property=["']og:description["']/i.test(html)) meta.push(`<meta property="og:description" content="${attr(description)}">`);
  if (canonical && !/property=["']og:url["']/i.test(html)) meta.push(`<meta property="og:url" content="${attr(canonical)}">`);
  if (!/name=["']twitter:card["']/i.test(html)) meta.push('<meta name="twitter:card" content="summary">');
  if (title && !/name=["']twitter:title["']/i.test(html)) meta.push(`<meta name="twitter:title" content="${attr(title)}">`);
  if (description && !/name=["']twitter:description["']/i.test(html)) meta.push(`<meta name="twitter:description" content="${attr(description)}">`);
  if (meta.length && /<\/head>/i.test(html)) html = html.replace(/<\/head>/i, `${meta.join("")}\n</head>`);

  const scripts: string[] = [];
  if (!html.includes("assets/customer-service.js")) scripts.push('<script src="/assets/customer-service.js" defer></script>');
  if (!html.includes("assets/site-footer-social.js")) scripts.push('<script src="/assets/site-footer-social.js" defer></script>');
  if (scripts.length && /<\/body>/i.test(html)) html = html.replace(/<\/body>/i, `${scripts.join("")}\n</body>`);

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
};
