(function(){
  const routes={work:'work-management',oneCase:'one-case',workPlan:'work-plan'};
  const routeMeta={
    'work-management':{label:'作业管理配置'},
    'one-case':{label:'一件一案配置',description:'用于配置一件一案准入条件、综合风险等级、专项措施、过程监管、人员变更及收尾规则。相关能力将在后续版本开放。'},
    'work-plan':{label:'作业计划配置',description:'用于配置计划编制规则、计划审批、转作业票规则及字段映射。相关能力将在后续版本开放。'}
  };
  const originalWorkTypeSettingRows=workTypeSettingRows;
  const originalGeneralConfigView=generalConfigView;
  const originalBindSidebarLinks=bindSidebarLinks;

  function parseRoute(){
    const match=location.hash.match(/^#\/system-config\/([^?]+)(?:\?(.*))?$/);
    const section=match&&routeMeta[match[1]]?match[1]:routes.work;
    const state=new URLSearchParams(match?.[2]||'').get('state')||'normal';
    return {section,state};
  }
  function routeHash(section,state='normal'){return `#/system-config/${section}${state==='normal'?'':`?state=${state}`}`}
  function stateView(state,section){
    const stateCopy={loading:['加载中','正在加载配置内容，请稍候。','⋯'],empty:['暂无配置数据','当前范围内暂无作业管理配置数据。','□'],error:['加载失败','配置内容暂时无法加载，请稍后重试。','!'],forbidden:['无访问权限','当前账号无权访问此业务配置。','○']}[state];
    if(!stateCopy)return '';
    const [heading,copy,mark]=stateCopy;
    return `<section class="system-config-state ${state}" aria-live="polite" ${state==='loading'?'aria-busy="true"':''}><div class="state-body"><div class="state-mark">${mark}</div><h2>${heading}</h2><p>${copy}</p>${state==='error'?`<button class="primary retry-system-config" data-section="${section}">重新加载</button>`:''}</div></section>`;
  }
  function placeholderView(section){const item=routeMeta[section];return `<section class="system-config-placeholder"><div class="system-config-empty"><div class="planning-mark">◇</div><h2>${item.label}</h2><p>${item.description}</p><span class="planning-tag">功能规划中</span></div></section>`}
  function workManagementView(){return `<div class="config-layout">${orgTree()}<section class="panel config-main"><div class="config-tabs">${configTabs.map((x,i)=>`<button class="${i===0?'active':''}" data-config="${i}">${x}</button>`).join('')}</div><div id="configBody">${configBody(0)}</div></section></div>`}

  workTypeSettingRows=function(){return originalWorkTypeSettingRows().replaceAll('二级节点','作业类型').replaceAll('一级节点','作业类别').replaceAll('添加子级','新增作业类型')};
  generalConfigView=function(){return originalGeneralConfigView()
    .replace('▶ 作业类型设置','▶ 作业类别与类型')
    .replace('维护一级作业类型和二级作业类型','维护一级作业类别和二级作业类型。')
    .replace('＋ 新增一级节点','＋ 新增作业类别')
    .replace('<th>作业类型名称</th>','<th>作业类别 / 作业类型</th>')
    .replace('▶ 全局业务规则','▶ 作业票通用规则')
    .replace('适用于所有作业计划、一件一案和作业类型','适用于作业票申请、审批、实施和验收流程；具体作业类型规则可覆盖通用规则。')};
  configView=function(){
    const {section,state}=parseRoute();
    let body=stateView(state,section);
    if(!body)body=section===routes.work?workManagementView():placeholderView(section);
    return `<div class="system-config-shell"><div id="systemConfigContent">${body}</div></div>`;
  };
  breadcrumbMap.config=['系统参数配置'];
  views.config=['系统参数配置','按业务对象集中管理系统参数',configView];

  function navigate(section,options={}){
    const hash=routeHash(section,options.state||'normal');
    if(location.hash===hash){render();return}
    history[options.replace?'replaceState':'pushState']({view:'config',section},'',hash);
    render();
  }
  function render(){
    const {section}=parseRoute();
    const nav=document.querySelector(`.sidebar a[data-system-route="${section}"]`)||document.querySelector('.sidebar a[data-system-route="work-management"]');
    const group=nav?.closest('.system-config-nav-group');
    group?.classList.remove('collapsed');
    const arrow=group?.querySelector(':scope > button b');
    if(arrow)arrow.textContent='⌄';
    openView('config',nav);
    bindSystemConfigPage();
  }
  function bindSystemConfigPage(){
    document.querySelector('.retry-system-config')?.addEventListener('click',event=>navigate(event.currentTarget.dataset.section,{replace:true}));
    const {section,state}=parseRoute();
    if(section!==routes.work||state!=='normal')return;
    document.querySelectorAll('[data-config]').forEach(button=>button.onclick=()=>{
      document.querySelector('[data-config].active')?.classList.remove('active');
      button.classList.add('active');
      document.querySelector('#configBody').innerHTML=configBody(+button.dataset.config);
      setupConfigActions();
    });
    setupConfigActions();
  }
  setupConfig=bindSystemConfigPage;
  bindSidebarLinks=function(){
    originalBindSidebarLinks();
    document.querySelectorAll('.sidebar a[data-system-route]').forEach(link=>link.onclick=event=>{event.preventDefault();navigate(link.dataset.systemRoute)});
  };
  bindSidebarLinks();
  window.addEventListener('popstate',()=>{if(location.hash.startsWith('#/system-config/'))render()});
  window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#/system-config/'))render()});
  if(location.hash.startsWith('#/system-config/'))render();
})();
