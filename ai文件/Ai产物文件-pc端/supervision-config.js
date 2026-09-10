/* 作业管理配置：监管确认事项。 */
(function(){
  configTabs.splice(4,0,'监管确认配置');
  const supervisionItems=[
    {type:'有限空间',levels:['全部'],content:'核查作业人员持证上岗、证件有效性及人员信息匹配情况。'},
    {type:'有限空间',levels:['全部'],content:'确认作业人员健康状况良好，已完成安全交底。'},
    {type:'有限空间',levels:['全部'],content:'作业现场已按要求配置安全防护、劳动防护用品和应急救援设备。'}
  ];
  let supervisionType='';
  let supervisionLevel='全部';
  const previousConfigBody=configBody;

  function types(){return configuredWorkTypes()}
  function levels(type){return ['全部',...levelsForWorkType(type)]}
  function supervisionConfigView(){
    const available=types();if(!available.includes(supervisionType))supervisionType=available[0]||'';
    const availableLevels=levels(supervisionType);if(!availableLevels.includes(supervisionLevel))supervisionLevel='全部';
    const rows=supervisionItems.map((item,index)=>({item,index})).filter(({item})=>item.type===supervisionType&&(supervisionLevel==='全部'||item.levels.includes('全部')||item.levels.includes(supervisionLevel)));
    return `<div class="risk-type-tabs config-type-scroll">${available.map(type=>`<button class="${type===supervisionType?'active':''}" data-supervision-type="${type}">${type}</button>`).join('')}</div><div class="briefing-head"><div><b>监管确认事项</b><span>按作业类型和适用等级维护，用于作业审批后的双方现场监管确认</span></div><button class="primary" id="addSupervisionItem">＋ 新增</button></div><div class="risk-measure-toolbar"><div>${availableLevels.map(level=>`<button class="${level===supervisionLevel?'active':''}" data-supervision-level="${level}">${level}</button>`).join('')}</div></div><div class="table-wrap"><table><thead><tr><th>序号</th><th>作业类型</th><th>适用等级</th><th>确认事项内容</th><th>操作</th></tr></thead><tbody id="supervisionConfigRows">${rows.map(({item,index},rowIndex)=>`<tr data-index="${index}"><td>${rowIndex+1}</td><td>${item.type}</td><td>${item.levels.join('、')}</td><td>${item.content}</td><td><button class="detail supervision-edit">编辑</button><button class="danger-text supervision-delete">删除</button></td></tr>`).join('')||'<tr><td colspan="5" class="empty">当前范围暂无监管确认事项</td></tr>'}</tbody></table></div>`;
  }

  configBody=function(index){if(index===4)return supervisionConfigView();return previousConfigBody(index<4?index:index-1)};

  function openSupervisionDrawer(index=null){
    document.querySelector('.config-drawer-layer')?.remove();const item=index===null?{type:supervisionType,levels:[],content:''}:supervisionItems[index],available=types(),itemLevels=levels(item.type).filter(level=>level!=='全部');
    document.body.insertAdjacentHTML('beforeend',`<div class="config-drawer-layer"><button class="config-drawer-mask" aria-label="关闭"></button><aside class="config-drawer"><header><b>▶ ${index===null?'新增':'编辑'}监管确认事项</b><button class="config-drawer-close">×</button></header><div class="config-drawer-body"><label><span><i>*</i> 作业类型</span><select id="supervisionItemType">${available.map(type=>`<option ${type===item.type?'selected':''}>${type}</option>`).join('')}</select></label><label><span><i>*</i> 适用等级</span><div class="bound-level-checks"><label><input type="checkbox" name="supervisionItemLevel" value="全部" ${item.levels.includes('全部')?'checked':''}> 全部等级</label>${itemLevels.map(level=>`<label><input type="checkbox" name="supervisionItemLevel" value="${level}" ${item.levels.includes(level)?'checked':''}> ${level}</label>`).join('')}</div></label><label><span><i>*</i> 确认事项内容</span><div class="drawer-textarea"><textarea id="supervisionItemContent" maxlength="300" placeholder="请输入确认事项内容">${item.content}</textarea><small><b id="supervisionItemCount">${item.content.length}</b> / 300</small></div></label></div><footer><button class="ghost config-drawer-cancel">取消</button><button class="primary" id="saveSupervisionItem">确定</button></footer></aside></div>`);
    const layer=document.querySelector('.config-drawer-layer'),close=()=>layer.remove(),typeSelect=layer.querySelector('#supervisionItemType');
    layer.querySelector('.config-drawer-mask').onclick=layer.querySelector('.config-drawer-close').onclick=layer.querySelector('.config-drawer-cancel').onclick=close;
    layer.querySelector('#supervisionItemContent').oninput=event=>layer.querySelector('#supervisionItemCount').textContent=event.target.value.length;
    typeSelect.onchange=()=>{supervisionType=typeSelect.value;close();openSupervisionDrawer(index)};
    layer.querySelector('#saveSupervisionItem').onclick=()=>{const selectedLevels=[...layer.querySelectorAll('[name="supervisionItemLevel"]:checked')].map(input=>input.value),content=layer.querySelector('#supervisionItemContent').value.trim();if(!selectedLevels.length)return toast('请至少选择一个适用等级');if(!content)return toast('请输入确认事项内容');const data={type:typeSelect.value,levels:selectedLevels.includes('全部')?['全部']:selectedLevels,content};index===null?supervisionItems.push(data):supervisionItems[index]=data;supervisionType=data.type;close();document.querySelector('#configBody').innerHTML=supervisionConfigView();setupConfigActions();toast(`监管确认事项已${index===null?'新增':'更新'}`)};
  }

  const previousSetupAdvancedConfig=setupAdvancedConfig;
  setupAdvancedConfig=function(){previousSetupAdvancedConfig();document.querySelectorAll('[data-supervision-type]').forEach(button=>button.onclick=()=>{supervisionType=button.dataset.supervisionType;supervisionLevel='全部';document.querySelector('#configBody').innerHTML=supervisionConfigView();setupConfigActions()});document.querySelectorAll('[data-supervision-level]').forEach(button=>button.onclick=()=>{supervisionLevel=button.dataset.supervisionLevel;document.querySelector('#configBody').innerHTML=supervisionConfigView();setupConfigActions()});document.querySelector('#addSupervisionItem')?.addEventListener('click',()=>openSupervisionDrawer());document.querySelector('#supervisionConfigRows')?.addEventListener('click',event=>{const row=event.target.closest('tr');if(!row||row.dataset.index===undefined)return;const index=Number(row.dataset.index);if(event.target.closest('.supervision-edit'))openSupervisionDrawer(index);if(event.target.closest('.supervision-delete')){supervisionItems.splice(index,1);document.querySelector('#configBody').innerHTML=supervisionConfigView();setupConfigActions();toast('监管确认事项已删除')}})};
  const activeHost=document.querySelector('#systemConfigContent');
  if(activeHost&&location.hash.startsWith('#/system-config/work-management')){activeHost.innerHTML=`<div class="config-layout">${orgTree()}<section class="panel config-main"><div class="config-tabs">${configTabs.map((name_mc,index)=>`<button class="${index===0?'active':''}" data-config="${index}">${name_mc}</button>`).join('')}</div><div id="configBody">${configBody(0)}</div></section></div>`;setupConfig()}
})();
