(()=>{const hero=document.querySelector('#hero');if(!hero||hero.dataset.showcase)return;hero.dataset.showcase='1';
const products=[
{name:'Statement Necklaces',category:'Jewelry & Accessories',tag:'TWR STREAM · Jewelry',desc:'Explore necklace collections for wholesale selection and private-label inquiries.',img:'assets/shainewi-necklace-model.webp',href:'jewelry-accessories.html'},
{name:'Earrings Collection',category:'Jewelry & Accessories',tag:'TWR STREAM · Jewelry',desc:'Discover earring styles and ask about samples, packaging and branding options.',img:'assets/shainewi-earrings-model.webp',href:'jewelry-accessories.html'},
{name:'Bracelets & Details',category:'Jewelry & Accessories',tag:'TWR STREAM · Jewelry',desc:'Browse bracelet designs and discuss product requirements for your market.',img:'/assets/products/hosted/shainewi-bohemian-woven-charm-bracelet-hand-display.webp',href:'shainewi-collection.html'}];

const css=document.createElement('style');css.textContent=`
#hero.twr-showcase{display:block;min-height:auto;padding:112px 0 34px;background:#f7f6f2;color:#171717}#hero.twr-showcase>.shell{margin-bottom:38px}#hero.twr-showcase .hero-inner{max-width:920px}#hero.twr-showcase h1{font-size:clamp(2.35rem,4.8vw,4.2rem);line-height:1.08;margin:8px 0 18px}#hero.twr-showcase .lead{color:#5f5d58;max-width:800px}#hero.twr-showcase .btn-light{color:#171717}#hero.twr-showcase .hero-actions .btn:first-child{background:#171717;color:#fff}#hero.twr-showcase .twr-stage{height:clamp(390px,48vh,510px)}
.twr-wrap{width:min(1240px,calc(100% - 44px));margin:0 auto;position:relative}
.twr-stage{height:clamp(430px,58vh,590px);position:relative}
.twr-card{position:relative;width:100%;height:100%;display:grid;grid-template-columns:40% 60%;overflow:hidden;border-radius:18px;background:linear-gradient(110deg,#eee6dc,#f5f1eb);box-shadow:0 12px 34px rgba(23,23,23,.08)}
.twr-card img{width:100%;height:100%;object-fit:contain;object-position:center;background:transparent;padding:18px 28px}
.twr-copy{position:relative;z-index:4;display:flex;flex-direction:column;justify-content:center;padding:52px 28px 52px 58px}
.twr-product{font:500 clamp(2rem,3.3vw,4rem) var(--serif);line-height:1.04;margin:10px 0 16px}
.twr-category{font-size:.68rem;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:#777;margin-top:3px}
.twr-brand{font-size:.76rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#9a744e}
.twr-desc{max-width:340px;color:#5f5d58;font-size:1rem;line-height:1.65}
.twr-cta{display:inline-flex;align-items:center;width:max-content;margin-top:26px;padding:13px 22px;background:#171717;color:#fff;font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;border-radius:999px}
.twr-link{display:none}
.twr-nav{position:absolute;z-index:9;left:0;right:0;top:50%;transform:translateY(-50%);display:flex;justify-content:space-between;pointer-events:none}
.twr-arrow{pointer-events:auto;width:44px;height:44px;border:0;border-radius:50%;background:rgba(23,23,23,.72);color:#fff;font-size:25px;line-height:1;box-shadow:0 4px 14px rgba(0,0,0,.12)}
.twr-nav .prev{margin-left:14px}.twr-nav .next{margin-right:14px}
.twr-dots{display:flex;justify-content:center;gap:8px;padding:15px 0 0}
.twr-dot{width:7px;height:7px;padding:0;border:0;border-radius:50%;background:#bbb}
.twr-dot.active{background:#171717;transform:scale(1.2)}
@media(max-width:760px){
#hero.twr-showcase{padding:102px 0 24px}#hero.twr-showcase .twr-stage{height:590px}
.twr-wrap{width:calc(100% - 28px)}
.twr-stage{height:590px}
.twr-card{grid-template-columns:1fr;grid-template-rows:43% 57%;border-radius:14px}
.twr-card img{grid-row:1;padding:14px 22px}
.twr-copy{grid-row:2;padding:22px 28px 28px}
.twr-product{font-size:2.15rem;margin:7px 0 10px}
.twr-desc{font-size:.9rem}
.twr-cta{margin-top:17px}
.twr-nav{top:43%}.twr-nav .prev{margin-left:8px}.twr-nav .next{margin-right:8px}
}`;document.head.appendChild(css);hero.classList.add('twr-showcase');

const introduction=hero.querySelector('.shell').outerHTML;hero.innerHTML=introduction+'<div class="twr-wrap"><div class="twr-stage"></div><div class="twr-nav"><button class="twr-arrow prev" aria-label="Previous product">‹</button><button class="twr-arrow next" aria-label="Next product">›</button></div><div class="twr-dots"></div></div>';
const stage=hero.querySelector('.twr-stage'),dots=hero.querySelector('.twr-dots');let start=0,timer;const cache=new Set([products[0].img]);function warm(i){const u=products[(i+products.length)%products.length].img;if(cache.has(u))return;const im=new Image();im.decoding='async';im.src=u;cache.add(u)}
function render(){const p=products[start];stage.innerHTML=`<article class="twr-card"><div class="twr-copy"><div class="twr-brand">${p.tag}</div><div class="twr-product">${p.name}</div><div class="twr-category">${p.category}</div><p class="twr-desc">${p.desc}</p><a class="twr-cta" href="${p.href}">View Collection</a></div><img src="${p.img}" alt="${p.name}" loading="eager"></article>`;dots.innerHTML=products.map((_,i)=>`<button class="twr-dot ${i===start?'active':''}" aria-label="Show product ${i+1}" data-i="${i}"></button>`).join('')}
function show(n){start=(n+products.length)%products.length;render();warm(start+1)}
function play(){clearInterval(timer);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>show(start+1),5200)}
hero.querySelector('.prev').onclick=()=>{show(start-1);play()};hero.querySelector('.next').onclick=()=>{show(start+1);play()};
dots.addEventListener('click',e=>{const b=e.target.closest('.twr-dot');if(b){show(+b.dataset.i);play()}});
let x=0;stage.addEventListener('touchstart',e=>x=e.touches[0].clientX,{passive:true});stage.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x;if(Math.abs(d)>45){show(start+(d<0?1:-1));play()}},{passive:true});
render();warm(1);if('requestIdleCallback' in window)requestIdleCallback(()=>products.slice(1).forEach((_,i)=>warm(i+2)),{timeout:2500});else setTimeout(()=>products.slice(1).forEach((_,i)=>warm(i+2)),2500);play()})();