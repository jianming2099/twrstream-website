export default async (_request: Request, context: any) => {
  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;
  let html = await response.text();
  const attr = (value: string) => value.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const first = (re: RegExp) => (html.match(re)?.[1] || "").trim();
  const title = first(/<title[^>]*>([\s\S]*?)<\/title>/i).replace(/<[^>]+>/g,"");
  const description = first(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) || first(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
  const canonical = first(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i) || first(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["'][^>]*>/i);
  const url = new URL(_request.url); const isHome=url.pathname==="/"||url.pathname==="/index.html";
  const existingOgImage=first(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["'][^>]*>/i)||first(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["'][^>]*>/i);
  const firstImage=first(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);let shareImage=existingOgImage;if(!shareImage&&firstImage){try{shareImage=new URL(firstImage,url.origin).href}catch{shareImage=""}}
  const meta:string[]=[];
  if(!/property=["']og:site_name["']/i.test(html))meta.push('<meta property="og:site_name" content="TWR STREAM">');
  if(!/property=["']og:type["']/i.test(html))meta.push('<meta property="og:type" content="website">');
  if(title&&!/property=["']og:title["']/i.test(html))meta.push(`<meta property="og:title" content="${attr(title)}">`);
  if(description&&!/property=["']og:description["']/i.test(html))meta.push(`<meta property="og:description" content="${attr(description)}">`);
  if(canonical&&!/property=["']og:url["']/i.test(html))meta.push(`<meta property="og:url" content="${attr(canonical)}">`);
  if(shareImage&&!existingOgImage)meta.push(`<meta property="og:image" content="${attr(shareImage)}">`);
  if(!/name=["']twitter:card["']/i.test(html))meta.push(`<meta name="twitter:card" content="${shareImage?"summary_large_image":"summary"}">`);
  if(title&&!/name=["']twitter:title["']/i.test(html))meta.push(`<meta name="twitter:title" content="${attr(title)}">`);
  if(description&&!/name=["']twitter:description["']/i.test(html))meta.push(`<meta name="twitter:description" content="${attr(description)}">`);
  if(shareImage&&!/name=["']twitter:image["']/i.test(html))meta.push(`<meta name="twitter:image" content="${attr(shareImage)}">`);
  if(isHome&&!html.includes('"@id":"https://www.twrstream.com/#organization"')){const structured={"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://www.twrstream.com/#organization","name":"TWR STREAM","url":"https://www.twrstream.com/","sameAs":["https://www.tiktok.com/@shainewidirect","https://www.instagram.com/shainewistylestudio","https://www.facebook.com/ShaiNewiStyleStudio","https://www.youtube.com/@ShaiNewiXJURKORA101","https://www.linkedin.com/in/jaymen-henry-558a87239","https://www.pinterest.com/ShaiNewiStyleStudio"]},{"@type":"WebSite","@id":"https://www.twrstream.com/#website","url":"https://www.twrstream.com/","name":"TWR STREAM","publisher":{"@id":"https://www.twrstream.com/#organization"}}]};meta.push(`<script type="application/ld+json">${JSON.stringify(structured).replace(/</g,"\\u003c")}</script>`)}
  if(meta.length&&/<\/head>/i.test(html))html=html.replace(/<\/head>/i,`${meta.join("")}\n</head>`);
  const scripts:string[]=[];
  if(!html.includes("assets/customer-service.js"))scripts.push('<script src="/assets/customer-service.js" defer></script>');
  if(!html.includes("assets/site-footer-social.js"))scripts.push('<script src="/assets/site-footer-social.js" defer></script>');
  if(isHome&&!html.includes("assets/home-hero-carousel.js"))scripts.push('<script src="/assets/home-hero-carousel.js" defer></script>');
  if(scripts.length&&/<\/body>/i.test(html))html=html.replace(/<\/body>/i,`${scripts.join("")}\n</body>`);
  const headers=new Headers(response.headers);headers.delete("content-length");return new Response(html,{status:response.status,statusText:response.statusText,headers});
};