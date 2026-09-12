(function(){
  const tab=['onecase','一件一案',3];
  if(!todoTabs.some(x=>x[0]===tab[0]))todoTabs.unshift(tab);
  const records=[
    {id:'YA20260910001',name:'二选车间浓密机检修一件一案',project:'二选车间年度检修',time:'2026-09-12 08:00 — 2026-09-14 18:00',area:'二选车间浓密机区域',ownerUnit:'齐大山铁矿',unit:'鞍钢检修公司',ownerPeople:4,partnerPeople:8,types:['动火作业','高处作业'],typeLevels:['动火作业：地表二级','高处作业：三级作业'],risk:'B级风险',applicant:'张建国',applyTime:'2026-09-10 09:18',node:'业主单位审批人员确认',status:'待审批',special:'王建（焊工证 AG-HJ-021）、李强（高处证 AG-GC-015）',monitor:'2台 · 东侧入口、检修平台'},
    {id:'YA20260909006',name:'井下泵房清淤一件一案',project:'井下排水系统维护',time:'2026-09-15 08:30 — 2026-09-16 16:00',area:'-320m泵房',ownerUnit:'东鞍山铁矿',unit:'矿建工程公司',ownerPeople:3,partnerPeople:7,types:['有限空间作业','临时用电作业'],typeLevels:['有限空间作业：不分级','临时用电作业：不分级'],risk:'B级风险',applicant:'李明远',applyTime:'2026-09-09 15:42',node:'业主单位安全监管责任人确认',status:'审批中',special:'赵海（电工证 AG-DG-108）',monitor:'1台 · 泵房入口'},
    {id:'YA20260908003',name:'尾矿库回水管道更换一件一案',project:'尾矿库回水系统维护',time:'2026-09-18 09:00 — 2026-09-18 17:30',area:'尾矿库回水管廊',ownerUnit:'齐大山铁矿',unit:'鞍钢建设集团',ownerPeople:5,partnerPeople:12,types:['吊装作业','交叉作业','高处作业'],typeLevels:['吊装作业：二级作业','高处作业：三级作业'],risk:'A级风险',applicant:'刘志强',applyTime:'2026-09-08 11:26',node:'施工单位作业负责人确认',status:'待审批',special:'孙工（起重证 AG-QZ-052）',monitor:'3台 · 起吊区、管廊两端'}
  ];
  const originalTodoView=views.todo[2],originalSetupTodoBoard=setupTodoBoard;
  views.todo[2]=()=>todoState==='onecase'?oneCaseTodoView():originalTodoView();

  function tabs(){return `<div class="todo-type-tabs">${todoTabs.map(x=>`<button class="${x[0]===todoState?'active':''}" data-todo="${x[0]}">${x[1]}(${x[0]==='onecase'?records.length:x[2]})</button>`).join('')}</div>`}
  function oneCaseTodoView(){return `<div class="todo-legacy one-case-todo"><div class="todo-breadcrumb">我的待办　/　<b>一件一案</b></div><section class="todo-board">${tabs()}<div class="todo-filter-row one-case-todo-filter"><label>风险等级<select id="caseTodoRisk"><option value="">全部风险等级</option><option>A级风险</option><option>B级风险</option><option>C级风险</option></select></label><label>审批状态<select id="caseTodoStatus"><option value="">全部状态</option><option>待审批</option><option>审批中</option></select></label><input id="caseTodoSearch" placeholder="搜索一件一案名称、编号、项目或申请人"><button class="reset" id="caseTodoReset">重置</button></div><div class="todo-table-wrap"><table class="todo-table one-case-todo-table"><thead><tr><th>一件一案编号 / 名称</th><th>所属项目</th><th>危险作业类别</th><th>综合风险等级</th><th>计划时间</th><th>申请人 / 单位</th><th>当前审批节点</th><th>申请时间</th><th>操作</th></tr></thead><tbody id="oneCaseTodoRows"></tbody></table></div><footer class="todo-page"><span id="oneCaseTodoTotal"></span><button disabled>‹</button><button class="current">1</button><button disabled>›</button><select><option>10 / 页</option></select></footer></section></div>`}

  setupTodoBoard=function(){
    if(todoState!=='onecase'){
      originalSetupTodoBoard();
      const button=document.querySelector('[data-todo="onecase"]');
      if(button)button.onclick=()=>{todoState='onecase';openView('todo',document.querySelector('[data-view="todo"]'))};
      return;
    }
    setupOneCaseTodoBoard();
  };

  function setupOneCaseTodoBoard(){
    const q=s=>document.querySelector(s),body=q('#oneCaseTodoRows'),search=q('#caseTodoSearch'),risk=q('#caseTodoRisk'),status=q('#caseTodoStatus'),total=q('#oneCaseTodoTotal');
    const render=()=>{const keyword=search.value.trim(),data=records.filter(x=>(!risk.value||x.risk===risk.value)&&(!status.value||x.status===status.value)&&(!keyword||`${x.id}${x.name}${x.project}${x.applicant}`.includes(keyword)));body.innerHTML=data.map(x=>`<tr><td><b>${x.name}</b><small>${x.id}</small></td><td>${x.project}</td><td><div class="case-tags">${x.types.map(t=>`<span>${t}</span>`).join('')}</div></td><td><span class="case-risk-badge ${x.risk.startsWith('A')?'high':x.risk.startsWith('B')?'medium':'low'}">${x.risk}</span></td><td><span class="time-mark start">起</span>${x.time.split(' — ')[0]}<br><span class="time-mark end">末</span>${x.time.split(' — ')[1]}</td><td><b>${x.applicant}</b><small>${x.ownerUnit}</small></td><td><span class="todo-progress warn">${x.node}</span></td><td>${x.applyTime}</td><td><div class="todo-actions"><button class="todo-action case-todo-detail" data-id="${x.id}">查看详情</button><button class="todo-action primary-case-action" data-id="${x.id}">审批一件一案</button></div></td></tr>`).join('')||'<tr><td colspan="9" class="empty">暂无一件一案审批待办</td></tr>';total.textContent=`共 ${data.length} 条`};
    document.querySelectorAll('[data-todo]').forEach(b=>b.onclick=()=>{todoState=b.dataset.todo;openView('todo',document.querySelector('[data-view="todo"]'))});search.oninput=render;risk.onchange=render;status.onchange=render;q('#caseTodoReset').onclick=()=>{search.value='';risk.value='';status.value='';render()};body.onclick=e=>{const button=e.target.closest('[data-id]');if(!button)return;const item=records.find(x=>x.id===button.dataset.id);renderOneCaseTodoDetail(item,button.classList.contains('primary-case-action'))};render();
  }

  function approvalSteps(item){const names=['业主单位审批人员确认','施工单位作业负责人确认','施工单位安全监护人确认','业主单位作业活动发起人确认','业主单位安全监管责任人确认'],current=Math.max(0,names.indexOf(item.node));return names.map((name,i)=>`<div class="case-approval-step ${i<current?'done':i===current?'current':''}"><i>${i<current?'✓':i+1}</i><b>${name}</b><span>${i<current?'已签字确认':i===current?'当前待办':'待处理'}</span></div>`).join('')}
  function confirmationText(node){return ({
    '业主单位审批人员确认':'上述安全管控措施可确保作业安全，同意实施。',
    '施工单位作业负责人确认':'本人知晓安全责任、作业内容、安全风险、安全措施、相关制度要求。',
    '施工单位安全监护人确认':'本人知晓安全责任、作业内容、安全风险、安全措施、相关制度要求。',
    '业主单位作业活动发起人确认':'已对施工单位人员资质进行审核并进行培训交底。',
    '业主单位安全监管责任人确认':'已对施工单位人员资质、培训交底情况、现场安全措施等进行审核，同意作业。'
  })[node]||'本人已核对当前审批节点的作业信息及安全管控要求。'}
  function infoGrid(items){return `<div class="case-approval-info">${items.map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div>`}
  function renderOneCaseTodoDetail(item,editable){
    title.textContent=editable?'审批一件一案':'一件一案详情';subtitle.textContent='核对作业范围、危险类别、人员监控及审批信息';
    content.innerHTML=`<div class="page-breadcrumb">我的待办　/　一件一案　/　<span>${editable?'审批':'查看详情'}</span></div><article class="one-case-approval-page"><header class="case-approval-head"><div><button class="ghost" id="backCaseTodo">← 返回待办</button><h2>${item.name}</h2><p>一件一案编号：${item.id}</p></div><div><span class="case-risk-badge ${item.risk.startsWith('A')?'high':'medium'}">${item.risk}</span><span class="status pending">${item.status}</span></div></header>
      <section><header><b><i>1</i>基本信息</b></header>${infoGrid([['作业内容',item.name],['作业所属项目',item.project],['作业时间',item.time],['作业地点',item.area],['业主单位',item.ownerUnit],['施工单位',item.unit],['业主单位参与人数',`${item.ownerPeople}人`],['相关方人数',`${item.partnerPeople}人`]])}</section>
      <section><header><b><i>2</i>危险类别与风险等级</b></header><div class="case-approval-risk"><div><span>涉及危险类别</span><p>${item.types.map(x=>`<em>${x}</em>`).join('')}</p></div><div><span>危险作业级别</span><p>${item.typeLevels.map(x=>`<em>${x}</em>`).join('')}</p></div><div><span>综合风险等级</span><b>${item.risk}</b><small>${item.risk.startsWith('A')?'涉及3种危险作业且同一区域作业人数达到10人以上。':'涉及2种危险作业，按B级风险管理。'}</small></div></div></section>
      <section><header><b><i>3</i>人员与安全监控</b></header>${infoGrid([['特种作业人员及证号',item.special],['安全监控数量及安装位置',item.monitor],['作业负责人',item.applicant],['施工单位安全监护人','王安全']])}</section>
      <section><header><b><i>4</i>作业前审批确认</b></header><div class="case-approval-flow">${approvalSteps(item)}</div></section>
      ${editable?`<section class="case-current-approval"><header><b><i>5</i>当前审批办理</b><span>${item.node}</span></header><div class="case-approval-form"><label><span><i>*</i> 审批意见</span><label><input type="radio" name="caseDecision" value="agree" checked> 同意</label><label><input type="radio" name="caseDecision" value="reject"> 驳回</label></label><label><span><i id="caseCommentRequired" style="display:none">*</i> 意见说明</span><textarea id="caseApprovalComment" placeholder="同意时可选填，驳回时请填写意见说明"></textarea></label><label class="case-node-confirm"><span><i>*</i> 节点确认</span><label><input type="checkbox" id="caseNodeConfirmation"> <b>${confirmationText(item.node)}</b></label></label><label><span><i>*</i> 审批人签字</span><button type="button" class="signature-box" id="caseApprovalSign">点击签字</button></label></div></section>`:''}
      <footer><button class="ghost" id="cancelCaseApproval">返回</button>${editable?'<button class="primary" id="submitCaseApproval">提交审批</button>':''}</footer></article>`;
    const back=()=>{todoState='onecase';openView('todo',document.querySelector('[data-view="todo"]'))};document.querySelector('#backCaseTodo').onclick=back;document.querySelector('#cancelCaseApproval').onclick=back;if(!editable)return;const sign=document.querySelector('#caseApprovalSign'),commentRequired=document.querySelector('#caseCommentRequired'),confirmation=document.querySelector('#caseNodeConfirmation');document.querySelectorAll('[name="caseDecision"]').forEach(radio=>radio.onchange=()=>{commentRequired.style.display=radio.checked&&radio.value==='reject'?'inline':'none'});sign.onclick=()=>{sign.dataset.signed='1';sign.textContent='王安全 · 已签字';sign.classList.add('signed')};document.querySelector('#submitCaseApproval').onclick=()=>{const comment=document.querySelector('#caseApprovalComment').value.trim(),decision=document.querySelector('[name="caseDecision"]:checked').value;if(decision==='reject'&&!comment)return toast('驳回时请填写意见说明');if(!confirmation.checked)return toast('请确认当前审批节点的责任声明');if(!sign.dataset.signed)return toast('请审批人签字');item.confirmations=item.confirmations||[];item.confirmations.push({node:item.node,text:confirmationText(item.node),decision,comment,signer:'王安全',signedAt:new Date().toLocaleString('zh-CN',{hour12:false})});if(decision==='reject'){item.status='已驳回';records.splice(records.indexOf(item),1);toast('一件一案已驳回')}else{const steps=['业主单位审批人员确认','施工单位作业负责人确认','施工单位安全监护人确认','业主单位作业活动发起人确认','业主单位安全监管责任人确认'],next=steps.indexOf(item.node)+1;if(next>=steps.length){item.status='已批准';records.splice(records.indexOf(item),1);toast('一件一案审批已全部完成')}else{item.node=steps[next];item.status='审批中';toast(`审批已提交，进入${item.node}`)}}setTimeout(back,500)};
  }
})();
