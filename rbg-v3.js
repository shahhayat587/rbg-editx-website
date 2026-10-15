/* RBG EDITX 3.0 enhancements — no personal form data sent to analytics */
(() => {
  const $ = id => document.getElementById(id);
  const service=$('estimate-service'), duration=$('estimate-duration'), advanced=$('estimate-advanced');
  if (!service || !duration || !advanced) return;
  const plans={basic:{price:500,name:'BASIC EDIT',length:'UP TO 20 SEC',delivery:'6 hours',revisions:'1',value:'Basic Edit - Rs. 500'},pro:{price:1000,name:'PRO EDIT',length:'UP TO 45 SEC',delivery:'12 hours',revisions:'2',value:'Pro Edit - Rs. 1000'},premium:{price:1500,name:'PREMIUM EDIT',length:'UP TO 60 SEC',delivery:'Within 1 day',revisions:'3',value:'Premium Edit - Rs. 1500'}};
  // Custom event reporting requires a qualifying Vercel plan; Hobby receives pageview analytics only.
  const ENABLE_CUSTOM_EVENTS=false;
  const metric=(name,data={})=>{if(ENABLE_CUSTOM_EVENTS && typeof window.va==='function')window.va('event',{name,data});};
  const render=()=>{
    const custom=advanced.checked||duration.value==='custom'||service.value==='Graphic Design';
    const p=plans[duration.value]||plans.pro;
    $('estimate-price').textContent=custom?'Custom Quote':'Rs. '+p.price.toLocaleString('en-PK');
    $('estimate-plan').textContent=custom?'CUSTOM REQUIREMENTS':p.name+' · '+p.length;
    $('estimate-delivery').textContent=custom?'To discuss':p.delivery;
    $('estimate-revisions').textContent=custom?'To discuss':p.revisions;
    $('estimate-note').textContent=custom?'We will confirm the exact price, delivery and revisions after reviewing your project.':'Starting package price; final scope and timing confirmed before work begins.';
    $('estimate-apply').textContent=custom?'Request a custom quote →':'Continue with '+p.name.toLowerCase()+' →';
  };
  [service,duration,advanced].forEach(el=>el.addEventListener('change',render)); render();
  $('estimate-apply').addEventListener('click',()=>{
    const custom=advanced.checked||duration.value==='custom'||service.value==='Graphic Design';
    const p=plans[duration.value]||plans.pro;
    const orderService=$('service-type'),orderPackage=$('package-type'),orderDelivery=$('project-deadline');
    orderService.value=service.value;
    orderPackage.value=custom?'Custom quote / discuss':p.value;
    orderDelivery.value=custom?'Flexible':(p.delivery==='6 hours'?'Within 6 hours':p.delivery==='12 hours'?'Within 12 hours':'Within 1 day');
    // Do not overwrite text typed by the client.
    const box=$('project-details'); if(box&&!box.value.trim())box.placeholder='I want a '+service.options[service.selectedIndex].text+' edit. '+(custom?'Custom scope and effects.':p.name+' package.');
    orderPackage.dispatchEvent(new Event('change',{bubbles:true}));
    $('order').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    metric('estimate_selected',{tier:custom?'custom':duration.value});
  });
  $('v3-fullscreen')?.addEventListener('click',()=>{
    const video=$('portfolio-video'); if(!video)return;
    if(video.webkitEnterFullscreen){video.webkitEnterFullscreen();return;}
    if(document.fullscreenElement){document.exitFullscreen?.();return;}
    video.requestFullscreen?.().catch(()=>{});
  });
  document.querySelectorAll('.portfolio-open').forEach(button=>button.addEventListener('click',()=>metric('portfolio_play',{category:button.dataset.serviceName?.includes('Gaming')?'gaming':button.dataset.serviceName?.includes('Typography')?'typography':button.dataset.serviceName?.includes('Promotional')?'promotional':'reels'})));
  document.querySelectorAll('[data-package]').forEach(button=>button.addEventListener('click',()=>metric('package_click',{package:button.dataset.package?.split(' ')[0]||'unknown'})));
  document.querySelectorAll('a[href="#order"]').forEach(a=>a.addEventListener('click',()=>metric('order_cta_click',{location:a.closest('section')?.id||'navigation'})));
  $('order-form')?.addEventListener('submit',()=>{if($('order-form').checkValidity())metric('order_form_submit_click');});
})();
