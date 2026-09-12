(function(){
  function configuredCategories(){
    try{
      const groups=JSON.parse(localStorage.getItem('safeWorkTypeHierarchy')||'[]');
      if(Array.isArray(groups)&&groups.length)return groups.map(group=>group.name).filter(Boolean);
    }catch(error){}
    return [];
  }
  const previousCenterView=centerView;
  centerView=function(){
    const linked=configuredCategories();
    if(linked.length){
      categories.splice(0,categories.length,'全部模板',...linked);
      if(state.category!=='全部模板'&&!categories.includes(state.category))state.category='全部模板';
    }
    previousCenterView();
  };

  let steps=[
    {stage:'作业前',text:'检查作业人员资质、安全防护设备、个体防护用品、应急救援装备及作业工器具，确定双方监护人员。'},
    {stage:'作业前',text:'封闭作业区域，在进出口周边设置安全警示标志，对设备、物料和能源介质采取可靠隔离并上锁挂牌。'},
    {stage:'作业前',text:'对有限空间进行清洗、物料清空、气体置换和通风，作业人员在外部上风侧进行气体检测。'},
    {stage:'作业中',text:'作业人员在入口处完成进入登记后进入，合理安排作业时间并采取人员轮换。'},
    {stage:'作业中',text:'作业过程中保持持续通风和气体检测，作业单位、属地单位监护人员全程在岗。'},
    {stage:'作业后',text:'将全部设备和工具带离有限空间，清点人员和设备，确认无遗留后关闭进出口。'},
    {stage:'作业后',text:'恢复现场环境，经验收后解除隔离和封闭措施，安全撤离作业现场。'}
  ];
  const riskGroups=[
    {risk:'中毒、窒息',items:['作业前完成清洗、置换、通风及气体检测。','作业中持续通风，检测异常立即停止作业并撤离。']},
    {risk:'无关人员进入',items:['出入口设置硬隔离和醒目标识。','监护人员在岗，禁止无关人员进入警戒区域。']},
    {risk:'触电',items:['使用安全电压的防爆照明设备。','电气线路设置剩余电流动作保护器并可靠接地。']},
    {risk:'物体打击、高处坠落',items:['工具采取防坠措施，作业区域设置警戒。','上下传递物品使用工具袋，禁止抛掷。']}
  ];
  const safe=value=>typeof escapeControlText==='function'?escapeControlText(value):String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function stepRows(){return steps.map((step,index)=>`<article class="step-row" data-step-index="${index}"><span>${index+1}</span><b class="stage-badge">${step.stage}</b><span class="step-content">${safe(step.text)}</span><div class="step-copy-actions"><button data-step-copy="${index}">复制</button><button data-step-up="${index}" ${index===0?'disabled':''}>上移</button><button data-step-down="${index}" ${index===steps.length-1?'disabled':''}>下移</button><button class="danger" data-step-delete="${index}">删除</button></div></article>`).join('')}
  function briefingPage(){return `<section class="business-runtime step-planning" data-business-page="briefing"><div class="business-runtime-head"><button id="businessRuntimeBack">← 返回作业控件库</button><div><h2>安全交底 · 业务页面</h2><p>有限空间作业 · 作业票 YXKJ20260912001</p></div><select id="businessPageState"><option>正常状态</option><option>空数据</option><option>加载状态</option><option>错误状态</option><option>只读状态</option></select></div><div class="step-summary">${['作业前|准备、隔离、检测与交底','作业中|过程监护、持续检测与异常处置','作业后|清点、恢复、验收与撤离'].map(x=>{const p=x.split('|');return `<article><b>${p[0]}</b><span>${p[1]}</span></article>`}).join('')}</div><div class="biz-card"><div class="biz-title"><div><b>1　作业步骤</b><span class="fixed-stage-note">作业阶段由系统维护，既有步骤不可调整阶段</span></div><button class="primary" id="addWorkStep">＋ 新增步骤</button></div><div class="step-table"><div class="step-table-head"><span>序号</span><span>作业阶段</span><span>作业步骤</span><span>操作</span></div><div id="stepRows">${stepRows()}</div></div><div class="step-add-panel" id="stepAddPanel"><select id="newStepStage"><option>作业前</option><option>作业中</option><option>作业后</option></select><textarea id="newStepText" placeholder="填写该阶段的详细作业步骤"></textarea><div><button id="cancelAddStep">取消</button> <button class="primary" id="confirmAddStep">确认新增</button></div></div></div><div class="biz-card"><div class="biz-title"><div><b>2　安全防范措施</b><span>按照风险点分组展示，标准措施随模板形成快照</span></div><button class="primary" id="addRiskMeasure">＋ 新增风险措施</button></div><div class="risk-measure-grid">${riskGroups.map((group,index)=>`<article class="risk-measure-card standard"><header><b>${index+1}. ${group.risk}</b><span>标准风险点</span></header><ol>${group.items.map(item=>`<li>${item}<small>标准防范措施</small></li>`).join('')}</ol></article>`).join('')}</div></div><div class="biz-card"><div class="biz-title"><div><b>3　周边危险禁入区域告知</b><span>接收交底时逐项阅读确认</span></div></div><div class="readonly-block"><p>有限空间进出口及周边5米警戒区域，非作业人员禁止进入。</p></div></div><div class="biz-card inline"><label><input type="checkbox"> 我已核对交底内容并确认发布</label><button>＋ 上传附件</button><div class="business-sign"><b>安全交底人签字</b><button data-sign>✍ 点击签字</button></div></div><footer class="business-runtime-footer"><span>当前为用户视图示例，操作不会保存正式业务数据</span><div><button id="cancelBusinessPage">取消</button><button class="primary" id="saveBusinessPage">保存安全交底</button></div></footer></section>`}
  function renderSteps(){document.querySelector('#stepRows').innerHTML=stepRows();bindStepActions()}
  function bindStepActions(){
    document.querySelectorAll('[data-step-copy]').forEach(button=>button.onclick=()=>{const index=+button.dataset.stepCopy;steps.splice(index+1,0,{...steps[index],text:`${steps[index].text}（复制）`});renderSteps();toast('步骤已复制，可继续编辑内容')});
    document.querySelectorAll('[data-step-up]').forEach(button=>button.onclick=()=>{const index=+button.dataset.stepUp;if(index<1)return;[steps[index-1],steps[index]]=[steps[index],steps[index-1]];renderSteps();toast('步骤顺序已调整')});
    document.querySelectorAll('[data-step-down]').forEach(button=>button.onclick=()=>{const index=+button.dataset.stepDown;if(index>=steps.length-1)return;[steps[index],steps[index+1]]=[steps[index+1],steps[index]];renderSteps();toast('步骤顺序已调整')});
    document.querySelectorAll('[data-step-delete]').forEach(button=>button.onclick=()=>{steps.splice(+button.dataset.stepDelete,1);renderSteps();toast('步骤已删除')});
  }
  function bindBriefing(){
    const back=()=>{if(typeof renderConfiguredControlLibrary==='function')renderConfiguredControlLibrary()};
    document.querySelector('#businessRuntimeBack').onclick=back;document.querySelector('#cancelBusinessPage').onclick=back;
    document.querySelector('#addWorkStep').onclick=()=>document.querySelector('#stepAddPanel').classList.add('open');
    document.querySelector('#cancelAddStep').onclick=()=>document.querySelector('#stepAddPanel').classList.remove('open');
    document.querySelector('#confirmAddStep').onclick=()=>{const text=document.querySelector('#newStepText').value.trim();if(!text)return toast('请填写详细作业步骤');steps.push({stage:document.querySelector('#newStepStage').value,text});renderSteps();document.querySelector('#newStepText').value='';document.querySelector('#stepAddPanel').classList.remove('open');toast('作业步骤已新增')};
    document.querySelector('#addRiskMeasure').onclick=()=>toast('可从风险库选择风险点及对应防范措施');
    document.querySelectorAll('[data-sign]').forEach(button=>button.onclick=()=>{button.textContent='✓ 王安全 · 已签字';button.classList.add('signed')});
    document.querySelector('#saveBusinessPage').onclick=()=>toast('安全交底已保存，步骤阶段与顺序已形成快照');
    document.querySelector('#businessPageState').onchange=event=>{if(event.target.value==='只读状态')document.querySelectorAll('.step-planning input,.step-planning textarea,.step-planning button:not(#businessRuntimeBack):not(#cancelBusinessPage),.step-planning select:not(#businessPageState)').forEach(el=>el.disabled=true);else if(event.target.value!=='正常状态')toast(`${event.target.value}用于原型状态检查`)};
    bindStepActions();
  }
  const previousPreview=openConfiguredControlPreview;
  openConfiguredControlPreview=function(id){
    if(id!=='briefing')return previousPreview(id);
    title.textContent='安全交底 · 页面预览';subtitle.textContent='固定作业阶段与可维护步骤演示';app.innerHTML=briefingPage();bindBriefing();
  };
  window.addEventListener('storage',event=>{if(event.key==='safeWorkTypeHierarchy'&&document.querySelector('#createTemplate'))centerView()});
})();
