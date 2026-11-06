const $=s=>document.querySelector(s),money=n=>"Rs "+Number(n).toLocaleString("en-US"),ST=["Pending","Confirmed","Shipped","Delivered","Cancelled"];
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
document.addEventListener("click",e=>{if(e.target.id=="th"){const n=document.documentElement.dataset.theme=="dark"?"light":"dark";document.documentElement.dataset.theme=n;localStorage.setItem("hb_theme",n)}});
if(!window.FIREBASE_CONFIG){$("#login").innerHTML="<h1>Setup needed</h1><p>Add your Firebase config in js/firebase-config.js. Steps are in README.txt.</p>"}
else{firebase.initializeApp(FIREBASE_CONFIG);const auth=firebase.auth(),db=firebase.firestore(),open=new Set();let orders=[],unsub;
$("#lf").onsubmit=async e=>{e.preventDefault();$("#le").textContent="";try{await auth.signInWithEmailAndPassword($("#em").value,$("#pw").value)}catch(x){$("#le").textContent="Sign-in failed. Check the email and password."}};
$("#out").onclick=()=>auth.signOut();
auth.onAuthStateChanged(u=>{$("#login").hidden=!!u;$("#dash").hidden=!u;$("#out").hidden=!u;if(unsub)unsub();
if(u)unsub=db.collection("orders").orderBy("createdAt","desc").onSnapshot(s=>{$("#msg").textContent="";orders=s.docs.map(d=>({...d.data(),id:d.id}));draw()},e=>$("#msg").textContent="Cannot load orders: "+e.message)});
function draw(){const fs=$("#fs").value,q=$("#fq").value.toLowerCase(),c=s=>orders.filter(o=>o.status==s).length;
$("#st").innerHTML=`<div><b>${orders.length}</b>Total orders</div>`+ST.slice(0,4).map(s=>`<div><b>${c(s)}</b>${s}</div>`).join("");
const l=orders.filter(o=>(!fs||o.status==fs)&&(o.id+o.customer?.name+o.customer?.mobile+o.customer?.city).toLowerCase().includes(q));
$("#list").innerHTML=l.length?l.map(o=>{const u=o.customer||{},t=o.createdAt?.toDate?o.createdAt.toDate().toLocaleString():"";
return `<details class="ord" data-id="${o.id}"${open.has(o.id)?" open":""}><summary><b>${o.id}</b><span>${esc(u.name)}<br><small>${t}</small></span><span>${money(o.total)}<br><small>${esc(o.payment)}</small></span><span class="tag">${esc(o.status)}</span></summary><div><p><b>Mobile:</b> ${esc(u.mobile)} · <b>Email:</b> ${esc(u.email)}<br><b>Address:</b> ${esc(u.address)}, ${esc(u.city)} ${esc(u.postal)}<br>${u.notes?`<b>Notes:</b> ${esc(u.notes)}<br>`:""}${o.trx?`<b>Transaction ID:</b> ${esc(o.trx)}<br>`:""}</p><table><tr><th>Item</th><th>Qty</th><th>Price</th></tr>${(o.items||[]).map(i=>`<tr><td>${esc(i.name)}</td><td>${i.qty}</td><td>${money(i.price*i.qty)}</td></tr>`).join("")}</table><p>Subtotal ${money(o.subtotal)}${o.fee?` + COD fee ${money(o.fee)}`:""} = <b>${money(o.total)}</b></p><label>Status <select data-id="${o.id}">${ST.map(s=>`<option${s==o.status?" selected":""}>${s}</option>`).join("")}</select></label></div></details>`}).join(""):"<p>No orders yet.</p>"}
addEventListener("toggle",e=>{const d=e.target;if(d.tagName=="DETAILS"&&d.dataset.id)d.open?open.add(d.dataset.id):open.delete(d.dataset.id)},true);
$("#fs").onchange=$("#fq").oninput=draw;
document.addEventListener("change",e=>{if(e.target.tagName=="SELECT"&&e.target.dataset.id)db.collection("orders").doc(e.target.dataset.id).update({status:e.target.value}).catch(x=>$("#msg").textContent="Could not update: "+x.message)})}
