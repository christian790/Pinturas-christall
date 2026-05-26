const WA_NUMBER = '18098474208';
let modalProducto='', modalPrecioBase=0, modalEsAccesorio=false;
let modalCantidad=1, modalCurrentSizes=null, modalSelectedIdx=0;

const PRODUCT_SIZES = {
  acrilica: [
    {icon:'🪣', name:'Galón', vol:'1 galón', price:750, gallons:1, qtyLabel:'galón(es)'},
    {icon:'🛢️', name:'Tarro', vol:'5 galones', price:3750, gallons:5, qtyLabel:'tarro(s)'},
  ],
  acrilicaSuperior: [
    {icon:'🥛', name:'¼ Galón', vol:'¼ galón', price:350, gallons:0.25, qtyLabel:'presentación(es)'},
    {icon:'🫙', name:'½ Galón', vol:'½ galón', price:500, gallons:0.5, qtyLabel:'presentación(es)'},
    {icon:'🪣', name:'Galón', vol:'1 galón', price:950, gallons:1, qtyLabel:'galón(es)'},
    {icon:'🛢️', name:'Tarro', vol:'5 galones', price:4750, gallons:5, qtyLabel:'tarro(s)'},
  ],
  semigloss: [
    {icon:'🥛', name:'¼ Galón', vol:'¼ galón', price:400, gallons:0.25, qtyLabel:'presentación(es)'},
    {icon:'🫙', name:'½ Galón', vol:'½ galón', price:650, gallons:0.5, qtyLabel:'presentación(es)'},
    {icon:'🪣', name:'Galón', vol:'1 galón', price:1100, gallons:1, qtyLabel:'galón(es)'},
    {icon:'🛢️', name:'Tarro', vol:'5 galones', price:5500, gallons:5, qtyLabel:'tarro(s)'},
  ]
};

function abrirModal(nombre, precioGalon, esAccesorio=false, customSizes=null) {
  modalProducto=nombre; modalPrecioBase=precioGalon; modalEsAccesorio=esAccesorio;
  modalCantidad=1; modalSelectedIdx=0;
  document.getElementById('modalNombre').textContent=nombre;
  document.getElementById('qtyNum').textContent=1;
  const so=document.getElementById('sizeOptions'), sl=document.getElementById('sizeLabel');
  if(esAccesorio){
    so.style.display='none'; sl.style.display='none';
    modalCurrentSizes=null;
    document.getElementById('qtyLabel').textContent='unidad(es)';
  } else {
    so.style.display='flex'; sl.style.display='block';
    modalCurrentSizes = customSizes || [
      {icon:'🪣', name:'Galón', vol:'1 galón', price:precioGalon, gallons:1, qtyLabel:'galón(es)'},
      {icon:'🛢️', name:'Tarro', vol:'5 galones', price:precioGalon*5, gallons:5, qtyLabel:'tarro(s)'}
    ];
    so.innerHTML = modalCurrentSizes.map((s,i) =>
      `<div class="size-btn${i===0?' selected':''}" onclick="seleccionarSize(this,${i})">
        <span class="size-icon">${s.icon}</span><span class="size-name">${s.name}</span>
        <span class="size-vol">${s.vol}</span><span class="size-price">RD$${s.price.toLocaleString()}</span>
      </div>`
    ).join('');
    document.getElementById('qtyLabel').textContent=modalCurrentSizes[0].qtyLabel;
  }
  actualizarTotal();
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function seleccionarSize(btn, idx) {
  document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  modalSelectedIdx=idx;
  document.getElementById('qtyLabel').textContent=modalCurrentSizes[idx].qtyLabel;
  actualizarTotal();
}

function cerrarModal(){document.getElementById('modalOverlay').classList.remove('open');document.body.style.overflow='';}
function cerrarModalSiOverlay(e){if(e.target===document.getElementById('modalOverlay'))cerrarModal();}

function cambiarCantidad(delta){
  modalCantidad=Math.max(1,modalCantidad+delta);
  document.getElementById('qtyNum').textContent=modalCantidad;
  actualizarTotal();
}

function actualizarTotal(){
  let precio;
  if(modalEsAccesorio) precio=modalPrecioBase;
  else if(modalCurrentSizes) precio=modalCurrentSizes[modalSelectedIdx].price;
  else precio=modalPrecioBase;
  document.getElementById('modalTotal').textContent='RD$'+(precio*modalCantidad).toLocaleString();
}

function enviarCotizacion(){
  let precio, presentacion, galonesLine='';
  if(modalEsAccesorio){
    precio=modalPrecioBase;
    presentacion=`${modalCantidad} unidad(es)`;
  } else if(modalCurrentSizes){
    const s=modalCurrentSizes[modalSelectedIdx];
    precio=s.price;
    presentacion=`${modalCantidad} × ${s.name}`;
    if(s.gallons>=1) galonesLine=`💧 *Total galones:* ${s.gallons*modalCantidad} galones\n`;
  } else {
    precio=modalPrecioBase;
    presentacion=`${modalCantidad} galón(es)`;
  }
  const total=precio*modalCantidad;
  const msg=`¡Saludos! Quisiera cotizar el siguiente producto de Pinturas Christ-All:\n\n🎨 *Producto:* ${modalProducto}\n📦 *Presentación:* ${presentacion}\n${galonesLine}💰 *Total estimado:* RD$${total.toLocaleString()}\n\n¿Me pueden confirmar disponibilidad y colores? ¡Gracias!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
  cerrarModal();
}

function cotizarServicio(nombre){
  const msg=`¡Saludos! Estoy interesado en el ${nombre} de Pinturas Christ-All.\n\n¿Me pueden dar más información y una cotización? ¡Gracias!`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}

function filtrarCategoria(cat,btn){
  document.querySelectorAll('.cat-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card=>{
    if(card.dataset.cat===cat){card.classList.remove('hidden','visible');setTimeout(()=>card.classList.add('visible'),50);}
    else card.classList.add('hidden');
  });
}

const hamburger=document.getElementById('hamburger'), navDrawer=document.getElementById('navDrawer');
hamburger.addEventListener('click',()=>{
  const open=navDrawer.classList.toggle('open');
  hamburger.classList.toggle('open',open);
  hamburger.setAttribute('aria-expanded',open);
  document.body.style.overflow=open?'hidden':'';
});
function cerrarMenu(){navDrawer.classList.remove('open');hamburger.classList.remove('open');hamburger.setAttribute('aria-expanded',false);document.body.style.overflow='';}
document.addEventListener('click',e=>{if(navDrawer.classList.contains('open')&&!navDrawer.contains(e.target)&&!hamburger.contains(e.target))cerrarMenu();});
window.addEventListener('scroll',()=>{document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>20);},{passive:true});
const observer=new IntersectionObserver((entries)=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*80);observer.unobserve(e.target);}});},{threshold:0.08});
document.querySelectorAll('.product-card:not(.hidden),.service-card').forEach(el=>observer.observe(el));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){cerrarModal();cerrarMenu();}});
