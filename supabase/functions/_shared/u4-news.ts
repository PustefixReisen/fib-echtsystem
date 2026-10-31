// Shared by the Edge handler and deterministic integration tests. No DB writes.
export const NEWS_ROOT='https://www.feldkirchen.de/aktuelles/aktuelle-news/aktuelle-meldungen';
export const NEWS_ARCHIVE=NEWS_ROOT+'/nachrichten-archiv';
function plain(value:string):string {
 return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'')
  .replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"')
  .replace(/&#(\d+);/g,(_,n)=>{const c=Number(n);return c<=0x10ffff?String.fromCodePoint(c):'�';}).replace(/\s+/g,' ').trim();
}
function safeUrl(value:string,base:string):URL|null {
 try{const u=new URL(value.replace(/&amp;/g,'&'),base);
  if(u.origin!==new URL(NEWS_ROOT).origin||u.username||u.password)return null;
  u.hash='';for(const key of [...u.searchParams.keys()])if(/^utm_|^(fbclid|gclid)$/.test(key))u.searchParams.delete(key);
  u.searchParams.sort();u.pathname=u.pathname.replace(/\/$/,'');return u;
 }catch{return null;}
}
function listing(u:URL):boolean{return [NEWS_ROOT,NEWS_ARCHIVE].includes(u.origin+u.pathname);}
export function newsLinks(html:string,page:string){
 const articles=new Set<string>(),pages=new Set<string>();
 for(const m of html.matchAll(/<a\b([^>]*?)href\s*=\s*["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi)){
  const u=safeUrl(m[2],page);if(!u)continue;
  if(listing(u)){
   // Only known listing paths. Unknown query mechanisms fail closed instead of disappearing.
   if([...u.searchParams.keys()].some(k=>!['page','seite'].includes(k)))throw Error('unsupported_news_pagination');
   for(const v of u.searchParams.values())if(!/^\d+$/.test(v))throw Error('invalid_news_page');
   pages.add(u.href);
  }else if(u.href.startsWith(NEWS_ROOT+'/')&&!u.search)articles.add(u.href);
  else if(/\brel\s*=\s*["']next["']/i.test(m[1]+m[3]))throw Error('unsupported_news_next_link');
 }
 return {articles:[...articles],pages:[...pages]};
}
export function newsDetail(html:string,url:string){
 const requested=safeUrl(url,NEWS_ROOT);
 if(!requested||listing(requested)||!requested.href.startsWith(NEWS_ROOT+'/'))throw Error('invalid_news_url');
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
 if(!main)throw Error('missing_news_main');
 const headings=[...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>plain(m[1])).filter(Boolean);
 if(headings.length!==1)throw Error('ambiguous_news_title');
 const links=[...html.matchAll(/<link\b[^>]*>/gi)].filter(m=>/rel\s*=\s*["']canonical["']/i.test(m[0]));
 if(links.length>1)throw Error('ambiguous_news_canonical');
 const canonical=links.length?safeUrl(links[0][0].match(/href\s*=\s*["']([^"']+)/i)?.[1]??'',url):requested;
 if(!canonical||listing(canonical)||canonical.search||!canonical.href.startsWith(NEWS_ROOT+'/'))throw Error('invalid_news_canonical');
 // Navigation is outside the article content and must not cause article revisions.
 const content=main.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi,'');
 const body=plain(content);
 if(body.length<headings[0].length+10)throw Error('empty_news_body');
 const date=content.match(/(?:Veröffentlicht|Ver&ouml;ffentlicht|Datum)[^<]*<\/span>\s*<span[^>]*>(\d{2})\.(\d{2})\.(\d{4})/i);
 const iso=date?`${date[3]}-${date[2]}-${date[1]}`:null;
 const publishedDate=iso&&Number.isFinite(Date.parse(iso))&&new Date(iso).toISOString().startsWith(iso)?iso:null;
 return {url:canonical.href,externalId:'gemeinde:'+canonical.href,title:headings[0],publishedDate,body,observedUrl:requested.href};
}
export async function scanNews(fetchHtml:(url:string)=>Promise<string>,maxPages=20,maxArticles=200){
 if(!Number.isInteger(maxPages)||maxPages<2||!Number.isInteger(maxArticles)||maxArticles<1)throw Error('invalid_news_limits');
 const queue=[NEWS_ROOT,NEWS_ARCHIVE],visited=new Set<string>(),urls=new Set<string>();
 while(queue.length){
  const url=queue.shift()!;if(visited.has(url))continue;
  if(visited.size>=maxPages)throw Error('news_page_limit_incomplete');
  const html=await fetchHtml(url);const found=newsLinks(html,url);
  if(!found.articles.length)throw Error('empty_news_listing_incomplete');
  visited.add(url);for(const article of found.articles)urls.add(article);
  if(urls.size>maxArticles)throw Error('news_article_limit_incomplete');
  for(const next of found.pages)if(!visited.has(next)&&!queue.includes(next))queue.push(next);
 }
 const articles=new Map<string,ReturnType<typeof newsDetail>>();
 for(const url of urls){
  const article=newsDetail(await fetchHtml(url),url),prior=articles.get(article.externalId);
  if(prior&&prior.body!==article.body)throw Error('conflicting_news_duplicates');
  articles.set(article.externalId,article);
 }
 return {pages:[...visited],articles:[...articles.values()],coverage:'linked_listings_only' as const};
}
