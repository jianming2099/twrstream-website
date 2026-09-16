export default async (_request: Request, context: any) => {
  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;
  const html = await response.text();
  if (html.includes("assets/customer-service.js")) return new Response(html, response);
  const injected = html.replace("</body>", '<script src="/assets/customer-service.js" defer></script></body>');
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(injected, { status: response.status, statusText: response.statusText, headers });
};
