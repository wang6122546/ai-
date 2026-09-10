// 依据线上 JNPF 独立测试应用复刻：补齐列表字段选择、流程绑定和可用下拉数据。
let replicaQueryFields = ['作业名称', '作业等级', '作业负责人', '计划开始时间'];
let replicaListFields = ['作业名称', '作业等级', '作业负责人', '计划开始时间', '作业地点及部位'];
let replicaTableType = '普通表格';

renderListBuildStep = function(){
  title.textContent=`${state.creation.name} · 列表设计`;
  subtitle.textContent='配置查询字段、列表字段、表格类型、页面操作与权限';
  const available = canvasControls.filter(c=>c.group!=='layout').map(c=>c.name);
  const fieldsAvailable = [...new Set([...available,'作业名称','作业等级','作业负责人','计划开始时间','作业地点及部位'])];
  const tableTypes=['普通表格','左侧树 + 普通表格','编辑表格','分组表格','树形表格','卡片表格'];
  app.innerHTML=`<div class="build-shell"><div class="build-top"><div class="build-brand"><span>${state.creation.icon}</span><b>${state.creation.name}</b></div>${buildSteps(3)}<div class="actions"><button class="ghost" id="listPrev">上一步</button><button class="primary" id="listNext">下一步</button><button class="ghost" id="closeList">关闭</button></div></div>
  <section class="replica-list-builder">
    <aside class="replica-list-tabs"><button class="active" data-list-tab="query">查询字段 <em>${replicaQueryFields.length}</em></button><button data-list-tab="columns">列表字段 <em>${replicaListFields.length}</em></button><button data-list-tab="settings">列表属性</button></aside>
    <div class="replica-list-config" id="replicaListConfig"></div>
    <div class="list-preview"><div class="preview-search"><select id="previewLevel"><option value="">全部作业等级</option><option>特级</option><option>一级</option><option>二级</option></select><input id="previewKeyword" placeholder="请输入作业名称或负责人"><button class="primary" id="previewSearch">查询</button><button class="ghost" id="previewReset">重置</button></div><div class="table-type-note">${replicaTableType} · 支持列宽拖拽、高级查询、分页和溢出省略</div><table class="resource-table"><thead><tr>${replicaListFields.map(x=>`<th>${x}</th>`).join('')}<th>操作</th></tr></thead><tbody id="replicaRows"><tr><td>罐区动火检修</td><td>一级</td><td>张安全</td><td>2026-08-30 08:00</td><td>一号罐区</td><td><button class="secondary" data-row-action="详情">详情</button></td></tr><tr><td>锅炉房管线焊接</td><td>二级</td><td>李审批</td><td>2026-08-31 09:30</td><td>动力中心</td><td><button class="secondary" data-row-action="详情">详情</button></td></tr></tbody></table></div>
  </section></div>`;
  const config=document.querySelector('#replicaListConfig');
  function draw(tab='query'){
    document.querySelectorAll('[data-list-tab]').forEach(b=>b.classList.toggle('active',b.dataset.listTab===tab));
    if(tab==='settings') config.innerHTML=`<h3>表格类型</h3><div class="table-type-grid">${tableTypes.map(x=>`<button class="${x===replicaTableType?'active':''}" data-table-type="${x}">${x}</button>`).join('')}</div><h3>表格配置</h3>${['列宽拖拽','高级查询','溢出省略','分页设置'].map(x=>`<label><input type="checkbox" checked> ${x}</label>`).join('')}<label>分页条数 <select><option>20 条/页</option><option>50 条/页</option><option>80 条/页</option><option>100 条/页</option></select></label><h3>按钮与权限</h3>${['新增','导出','导入','批量删除','审批','编辑','删除','详情','按钮权限','列表权限','表单权限','数据权限'].map((x,i)=>`<label><input type="checkbox" ${i===1||i===2||i===3||i===4||i>7?'':'checked'}> ${x}</label>`).join('')}`;
    else { const selected=tab==='query'?replicaQueryFields:replicaListFields; config.innerHTML=`<div class="select-all-row"><b>${tab==='query'?'查询字段':'列表字段'}</b><button class="ghost" id="selectAllFields">全选</button><button class="ghost" id="clearAllFields">清空</button></div><div class="field-choice-grid">${fieldsAvailable.map(x=>`<label><input type="checkbox" data-field-choice="${x}" ${selected.includes(x)?'checked':''}> ${x}</label>`).join('')}</div>`; document.querySelectorAll('[data-field-choice]').forEach(c=>c.onchange=()=>{const target=tab==='query'?replicaQueryFields:replicaListFields;c.checked?target.push(c.dataset.fieldChoice):target.splice(target.indexOf(c.dataset.fieldChoice),1);renderListBuildStep()}); document.querySelector('#selectAllFields').onclick=()=>{if(tab==='query')replicaQueryFields=[...fieldsAvailable];else replicaListFields=[...fieldsAvailable];renderListBuildStep()}; document.querySelector('#clearAllFields').onclick=()=>{if(tab==='query')replicaQueryFields=[];else replicaListFields=[];renderListBuildStep()}; }
    document.querySelectorAll('[data-table-type]').forEach(b=>b.onclick=()=>{replicaTableType=b.dataset.tableType;renderListBuildStep()});
  }
  draw('query');
  document.querySelectorAll('[data-list-tab]').forEach(b=>b.onclick=()=>draw(b.dataset.listTab));
  document.querySelector('#previewSearch').onclick=()=>{const k=document.querySelector('#previewKeyword').value.trim(),level=document.querySelector('#previewLevel').value;document.querySelectorAll('#replicaRows tr').forEach(r=>r.hidden=!!((k&&!r.textContent.includes(k))||(level&&!r.textContent.includes(level))));toast('查询条件已生效')};
  document.querySelector('#previewReset').onclick=()=>{document.querySelector('#previewKeyword').value='';document.querySelector('#previewLevel').value='';document.querySelectorAll('#replicaRows tr').forEach(r=>r.hidden=false);toast('查询条件已重置')};
  document.querySelectorAll('[data-row-action]').forEach(b=>b.onclick=()=>previewTemplate({name:state.creation.name,code:state.creation.code,version:'V1'}));
  document.querySelector('#listPrev').onclick=renderFormBuildStep;document.querySelector('#closeList').onclick=centerView;document.querySelector('#listNext').onclick=()=>{if(!replicaListFields.length)return toast('请至少选择一个列表字段');state.template={name:state.creation.name,code:state.creation.code,status:'草稿',version:'V1'};state.mode='flow';renderDesigner();toast('已进入流程设计，请绑定表单、配置审批人并检查连线')};
};

const replicaRenderDesigner = renderDesigner;
renderDesigner = function(){
  replicaRenderDesigner();
  if(state.mode!=='flow')return;
  const settings=document.querySelector('.global-flow-settings');
  if(settings){settings.insertAdjacentHTML('afterbegin',`<label>流程表单<select id="boundFlowForm"><option>${state.template.name}申请表（已发布）</option><option>动火作业申请单（完整验证）</option><option>动土作业申请表</option></select></label>`)}
  const handler=document.querySelector('.properties select');
  if(handler){handler.innerHTML=`<option>${nodes[state.selectedNode].handler}</option><option>审批账号/approval</option><option>测试权限1/qx1</option><option>测试权限2/qx2</option><option>发起者本人</option><option>上级责任人</option><option>表单变量</option><option>逐级审批</option>`;handler.onchange=e=>{nodes[state.selectedNode].handler=e.target.value;renderDesigner();toast('审批人已配置')}}
};
