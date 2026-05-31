const CONFIG={
  MOYASAR_PUBLISHABLE_KEY:'pk_test_YOUR_MOYASAR_PUBLISHABLE_KEY',
  SITE_URL:'https://www.hemaa.com',
  FORMSPREE_URL:'https://formspree.io/f/meedkpej',
  EMAILJS_SERVICE_ID:'service_kg2slg9',
  EMAILJS_TEMPLATE_ID:'template_7pfoeef',
  EMAILJS_PUBLIC_KEY:'QGCrS2QUGGPgCiNbz',
};

window.addEventListener('load',()=>{emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY)});

const _submitLog=[];
function _checkRateLimit(){const now=Date.now();while(_submitLog.length&&now-_submitLog[0]>60000)_submitLog.shift();if(_submitLog.length>=5)return false;_submitLog.push(now);return true}

const COUNTRY_DIGITS={'+966':/^5\d{8}$/,'+971':/^5\d{8}$/,'+965':/^\d{8}$/,'+974':/^\d{8}$/,'+20':/^1\d{9}$/,'+44':/^7\d{9}$/,'+1':/^\d{10}$/};
function _validatePhone(r){const code=document.getElementById('countryCode').value;const p=r.replace(/[\s\-]/g,'');const rule=COUNTRY_DIGITS[code];return rule?rule.test(p):p.length>=7}
function _validateEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim())}
function _validateName(n){return n.trim().length>=3}

function updatePhonePlaceholder(){const sel=document.getElementById('countryCode');const opt=sel.options[sel.selectedIndex];document.getElementById('phone').placeholder=opt.dataset.placeholder||'XXXXXXXX';document.getElementById('phone').value='';clearFieldError('phone','phoneWrapper')}

function showFieldError(iid,eid,wid){const err=document.getElementById(eid);if(wid){const w=document.getElementById(wid);if(w){w.classList.add('error');w.classList.remove('success')}}else{const inp=document.getElementById(iid);if(inp){inp.classList.add('error');inp.classList.remove('success')}}if(err)err.classList.add('show')}
function showFieldSuccess(iid,wid){const eMap={fullName:'err-name',email:'err-email',phone:'err-phone'};const err=document.getElementById(eMap[iid]||'err-'+iid);if(wid){const w=document.getElementById(wid);if(w){w.classList.remove('error');w.classList.add('success')}}else{const inp=document.getElementById(iid);if(inp){inp.classList.remove('error');inp.classList.add('success')}}if(err)err.classList.remove('show')}
function clearFieldError(iid,wid){const eMap={fullName:'err-name',email:'err-email',phone:'err-phone'};const err=document.getElementById(eMap[iid]||'err-'+iid);if(wid){const w=document.getElementById(wid);if(w){w.classList.remove('error','success')}}else{const inp=document.getElementById(iid);if(inp){inp.classList.remove('error','success')}}if(err)err.classList.remove('show')}
function validateNameInline(){const v=document.getElementById('fullName').value;if(!v){clearFieldError('fullName');return}_validateName(v)?showFieldSuccess('fullName'):showFieldError('fullName','err-name')}
function validatePhoneInline(){const v=document.getElementById('phone').value;if(!v){clearFieldError('phone','phoneWrapper');return}_validatePhone(v)?showFieldSuccess('phone','phoneWrapper'):showFieldError('phone','err-phone','phoneWrapper')}
document.addEventListener('DOMContentLoaded',()=>{const ei=document.getElementById('email');if(ei)ei.addEventListener('input',()=>{const v=ei.value;if(!v){clearFieldError('email');return}_validateEmail(v)?showFieldSuccess('email'):showFieldError('email','err-email')})});

let cart={};let currentOrderData=null;

function addToCart(id,name,price,icon,btn){
  if(cart[id]){showToast('الخدمة دي موجودة في السلة بالفعل ✓');return}
  cart[id]={name,price,icon};updateCart();
  showToast('تمت إضافة "'+name+'" للسلة ✅');
  if(btn){btn.textContent='✓ تمت الإضافة';btn.classList.add('added');btn.disabled=true;btn.dataset.cartId=id}
}

function removeFromCart(id){
  delete cart[id];updateCart();
  document.querySelectorAll('[data-cart-id="'+id+'"]').forEach(btn=>{
    btn.textContent='+ أضف للسلة';btn.classList.remove('added');btn.disabled=false;delete btn.dataset.cartId
  })
}

function updateCart(){
  const count=Object.keys(cart).length;
  document.getElementById('cartCount').textContent=count;
  const body=document.getElementById('drawerBody');
  const total=Object.values(cart).reduce((s,i)=>s+i.price,0);
  document.getElementById('totalAmount').textContent=total.toLocaleString('ar-SA');
  document.getElementById('checkoutBtn').disabled=count===0;
  if(count===0){body.innerHTML='<div class="cart-empty"><div class="empty-icon">🛍️</div><p>سلتك فاضية دلوقتي<br>اختار خدمة وأضفها!</p></div>';return}
  body.innerHTML=Object.entries(cart).map(([id,item])=>`<div class="cart-item"><div class="cart-item-icon">${item.icon}</div><div class="cart-item-info"><div class="cart-item-name">${item.name}</div><div class="cart-item-price">${item.price.toLocaleString('ar-SA')} ر.س</div></div><button class="remove-btn" onclick="removeFromCart('${id}')">🗑</button></div>`).join('')
}

function openCart(){document.getElementById('cartDrawer').classList.add('open');document.getElementById('overlay').classList.add('open')}
function closeCart(){document.getElementById('cartDrawer').classList.remove('open');document.getElementById('overlay').classList.remove('open')}

function showToast(msg){const t=document.getElementById('toast');document.getElementById('toastMsg').textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)}

function filterCards(cat,tab){
  document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
  document.querySelectorAll('.card,.bundle-card').forEach(card=>{const c=card.dataset.cat;card.style.display=(cat==='all'||c===cat||c==='all')?'':'none'});
  document.querySelectorAll('.section-heading').forEach(h=>{if(cat==='all'){h.style.display='';return}const next=h.nextElementSibling;const vis=next&&[...next.querySelectorAll('.card')].some(c=>c.style.display!=='none');h.style.display=vis?'':''})
}

document.getElementById('checkoutBtn').addEventListener('click',()=>{if(Object.keys(cart).length===0)return;openCustomerModal()});

function openCustomerModal(){document.getElementById('customerModal').classList.add('open')}
function closeCustomerModal(){document.getElementById('customerModal').classList.remove('open')}
function openRefundModal(){document.getElementById('refundModal').classList.add('open')}
function closeThankyouModal(){document.getElementById('thankYouModal').classList.remove('open');closeCart();cart={};updateCart()}

let isProcessing=false;
async function proceedToPayment(){
  if(isProcessing)return;
  if(!_checkRateLimit()){showToast('⚠️ محاولات كثيرة — انتظر دقيقة');return}
  const fullName=document.getElementById('fullName').value.trim();
  const email=document.getElementById('email').value.trim();
  const phone=document.getElementById('phone').value.trim();
  let hasError=false;
  if(!_validateName(fullName)){showFieldError('fullName','err-name');hasError=true}else showFieldSuccess('fullName');
  if(!_validateEmail(email)){showFieldError('email','err-email');hasError=true}else showFieldSuccess('email');
  if(!_validatePhone(phone)){showFieldError('phone','err-phone','phoneWrapper');hasError=true}else showFieldSuccess('phone','phoneWrapper');
  if(!fullName||!email||!phone)hasError=true;
  if(hasError)return;
  isProcessing=true;
  const payBtn=document.querySelector('#customerModal .proceed-btn');
  if(payBtn){payBtn.disabled=true;payBtn.textContent='⏳ جاري المعالجة...'}
  const itemsList=Object.values(cart).map(i=>i.icon+' '+i.name+' — '+i.price+' ر.س').join('\n');
  const total=Object.values(cart).reduce((s,i)=>s+i.price,0);
  const orderId='ORD-'+Date.now();
  const cartSnapshot={...cart};
  const fullPhone=document.getElementById('countryCode').value+phone;
  currentOrderData={orderId,fullName,email,phone:fullPhone,city:document.getElementById('city').value,specialization:document.getElementById('specialization').value,notes:document.getElementById('notes').value,items:Object.entries(cart).map(([id,item])=>({id,...item})),cartSnapshot,total,timestamp:new Date().toISOString()};
  try{await fetch(CONFIG.FORMSPREE_URL,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({'رقم الطلب':orderId,'الاسم':fullName,'البريد':email,'الهاتف':fullPhone,'المدينة':document.getElementById('city').value,'التخصص':document.getElementById('specialization').value,'الخدمات':itemsList,'الإجمالي':total+' ر.س','التاريخ':new Date().toLocaleString('ar-SA')})})}catch(err){console.warn('Formspree:',err)}
  const emailServices=Object.values(cart).map(i=>i.icon+' '+i.name+' - '+i.price.toLocaleString('ar-SA')+' ريال').join(' | ');
  emailjs.send(CONFIG.EMAILJS_SERVICE_ID,CONFIG.EMAILJS_TEMPLATE_ID,{to_email:email,customer_name:fullName,order_id:orderId,services:emailServices,total:total.toLocaleString('ar-SA')+' ريال سعودي'},CONFIG.EMAILJS_PUBLIC_KEY).catch(e=>console.warn('EmailJS:',e));
  if(payBtn){payBtn.disabled=false;payBtn.textContent='متابعة للدفع ←'}
  isProcessing=false;
  closeCustomerModal();
  openMoyasarPayment(currentOrderData);
}

function openMoyasarPayment(orderData){
  const old=document.getElementById('moyasarContainer');if(old)old.remove();
  const wrap=document.createElement('div');
  wrap.id='moyasarContainer';
  wrap.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px)';
  const box=document.createElement('div');
  box.style.cssText='background:#13131a;border:1px solid rgba(201,168,76,.25);border-radius:20px;padding:32px;width:90%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.6);position:relative';
  const closeB=document.createElement('button');
  closeB.innerHTML='✕ إغلاق';closeB.style.cssText='position:absolute;top:16px;left:16px;background:none;border:none;cursor:pointer;color:#8a8a9a;font-size:14px;font-family:Cairo,sans-serif';
  closeB.onclick=()=>wrap.remove();
  const title=document.createElement('h3');
  title.style.cssText='font-family:Tajawal,sans-serif;font-size:20px;font-weight:800;margin-bottom:8px;text-align:center;color:white';
  title.textContent='💳 إتمام الدفع';
  const sub=document.createElement('p');
  sub.style.cssText='text-align:center;color:#8a8a9a;font-size:14px;margin-bottom:24px';
  sub.textContent='الإجمالي: '+orderData.total.toLocaleString('ar-SA')+' ر.س';
  const formDiv=document.createElement('div');formDiv.id='moyasar-form';formDiv.className='mysr-form';
  box.appendChild(closeB);box.appendChild(title);box.appendChild(sub);box.appendChild(formDiv);wrap.appendChild(box);document.body.appendChild(wrap);
  Moyasar.init({element:'.mysr-form',amount:orderData.total*100,currency:'SAR',description:'طلب همة - '+orderData.orderId,publishable_api_key:CONFIG.MOYASAR_PUBLISHABLE_KEY,callback_url:CONFIG.SITE_URL+'/?payment=success&order='+orderData.orderId,methods:['creditcard','applepay','stcpay'],apple_pay:{country:'SA',label:'همة — خدمات التوظيف',validate_merchant_url:'https://api.moyasar.com/v1/applepay/initiate'},metadata:{order_id:orderData.orderId,customer:orderData.fullName,email:orderData.email,phone:orderData.phone},on_completed:function(){wrap.remove();showThankYouPage(orderData)},on_failed:function(){showToast('❌ فشل الدفع — حاول مرة تانية')}})
}

function showThankYouPage(orderData){
  const src=orderData.cartSnapshot||cart;
  const items=Object.entries(src).map(([id,item])=>`<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>${item.icon} ${item.name}</span><span style="color:var(--gold)">${item.price.toLocaleString('ar-SA')} ر.س</span></div>`).join('');
  const total=Object.values(src).reduce((s,i)=>s+i.price,0);
  document.getElementById('orderSummary').innerHTML=items+`<div style="border-top:1px solid var(--border);padding-top:10px;margin-top:10px;display:flex;justify-content:space-between;font-weight:700;"><span>الإجمالي</span><span style="color:var(--gold)">${total.toLocaleString('ar-SA')} ر.س</span></div>`;
  document.getElementById('thankYouEmail').textContent='تم إرسال تأكيد الطلب إلى: '+orderData.email;
  document.getElementById('thankYouModal').classList.add('open');
}

document.addEventListener('click',e=>{
  if(e.target.id==='customerModal')closeCustomerModal();
  if(e.target.id==='refundModal')document.getElementById('refundModal').classList.remove('open');
  if(e.target.id==='thankYouModal')closeThankyouModal();
});

const FAQS=[
  {q:'متى أستلم الـ CV؟',a:'تصميم CV الجديد خلال 24 ساعة من تأكيد الطلب. تعديل CV الموجود خلال 48 ساعة.'},
  {q:'كيف تعرفون تخصصي وخبراتي؟',a:'بعد الدفع نتواصل معك على الواتساب أو الإيميل ونطلب منك المعلومات اللازمة.'},
  {q:'هل يتوافق الـ CV مع الشركات السعودية والخليجية؟',a:'نعم، نصمم CV يناسب سوق العمل السعودي والخليجي بالكامل مع مراعاة متطلبات ATS.'},
  {q:'هل يمكنني طلب تعديل بعد الاستلام؟',a:'نعم، كل خدمة تشمل مراجعة مجانية واحدة بعد التسليم.'},
  {q:'ما الفرق بين تصميم CV وتعديل CV؟',a:'تصميم CV = نبني سيرتك من الصفر. تعديل CV = عندك سيرة موجودة نحسّنها ونطورها.'},
];
(function(){
  const c=document.getElementById('faqList');if(!c)return;
  FAQS.forEach((f,i)=>{
    const div=document.createElement('div');div.className='faq-item';
    div.innerHTML=`<button class="faq-btn" onclick="toggleFaq(${i})"><span>${f.q}</span><span class="faq-icon" id="faq-icon-${i}">+</span></button><div class="faq-body" id="faq-body-${i}">${f.a}</div>`;
    c.appendChild(div)
  })
})();

function toggleFaq(i){const b=document.getElementById('faq-body-'+i);const ic=document.getElementById('faq-icon-'+i);const open=b.style.display!=='none'&&b.style.display!=='';b.style.display=open?'none':'block';ic.textContent=open?'+':'−'}

window.addEventListener('load',()=>{
  const p=new URLSearchParams(window.location.search);
  if(p.get('payment')==='success'){showToast('✅ تم الدفع بنجاح! رقم طلبك: '+(p.get('order')||''));window.history.replaceState({},document.title,window.location.pathname)}
});
