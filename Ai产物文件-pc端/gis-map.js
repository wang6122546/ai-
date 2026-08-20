const gisPoints=[
  {name:'S1筛分厂',status:'执行中',type:'高处作业',owner:'赵海峰',time:'08:30—16:00'},
  {name:'高压辊磨厂房',status:'待审批',type:'动火作业',owner:'张建国',time:'09:00—17:30'},
  {name:'磨矿仓',status:'已完成',type:'设备保养',owner:'孙晓辉',time:'07:30—10:30'},
  {name:'浮选厂房1',status:'执行中',type:'有限空间作业',owner:'李明远',time:'10:00—12:00'},
  {name:'磨磁厂房1',status:'待审批',type:'吊装作业',owner:'刘志强',time:'13:30—18:00'},
  {name:'废石厂房',status:'执行中',type:'临时用电作业',owner:'王安全',time:'14:00—16:40'}
];

document.querySelector('[data-view="overview"]').addEventListener('click',()=>setTimeout(setupGISMap));

function setupGISMap(){
  const map=document.querySelector('.site-map');
  if(!map)return;
  map.querySelector('.map-filter').innerHTML='<button class="active" data-map-status="全部">全部</button><button data-map-status="执行中">● 执行中</button><button data-map-status="待审批">● 待审批</button><button data-map-status="已完成">● 已完成</button>';
  map.insertAdjacentHTML('beforeend','<div class="gis-map-legend"><i class="run"></i>执行中 <i class="wait"></i>待审批 <i class="done"></i>已完成</div>');
  const pins=[...map.querySelectorAll(':scope > .map-pin')];
  pins.forEach((pin,index)=>{pin.dataset.index=index;pin.dataset.status=gisPoints[index]?.status||'执行中';pin.onclick=()=>showGISPoint(map,index)});
  map.querySelectorAll('[data-map-status]').forEach(button=>button.onclick=()=>{map.querySelector('[data-map-status].active')?.classList.remove('active');button.classList.add('active');pins.forEach(pin=>pin.classList.toggle('hidden',button.dataset.mapStatus!=='全部'&&pin.dataset.status!==button.dataset.mapStatus));map.querySelector('.gis-float-card')?.remove();toast(`地图已筛选：${button.dataset.mapStatus}`)});
}

function showGISPoint(map,index){
  const point=gisPoints[index];
  map.querySelector('.gis-float-card')?.remove();
  map.insertAdjacentHTML('beforeend',`<article class="gis-float-card"><button>×</button><h3>${point.name}</h3><p><b>${point.type}</b> · ${point.status}</p><p>负责人：${point.owner}</p><p>作业时间：2026-08-20 ${point.time}</p><p>现场设备：布控球在线 · 环境监测正常</p><span class="status ${point.status==='执行中'?'running':point.status==='待审批'?'pending':'done'}">${point.status}</span></article>`);
  map.querySelector('.gis-float-card button').onclick=()=>map.querySelector('.gis-float-card').remove();
}
