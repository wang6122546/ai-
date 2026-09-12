(function(){
  const baseRender=renderEnhancedSafetyBriefing;
  renderEnhancedSafetyBriefing=function(row){
    baseRender(row);
    const page=content.querySelector('.enhanced-briefing-page');
    if(!page)return;
    const stepRows=page.querySelector('#briefingStepRows');
    const originalSection=page.querySelector('.safety-measures-independent');
    const currentRows=()=>[...stepRows.querySelectorAll('.briefing-step-row')];
    originalSection.innerHTML=`<div class="briefing-edit-title"><span><i>2</i><b>风险点和风险管控措施</b></span><button class="primary small" id="addIndependentMeasure">＋ 新增风险措施</button></div><p class="briefing-measure-tip">风险点及管控措施独立成表展示。</p><div class="briefing-risk-table"><div class="briefing-risk-row header"><b>序号</b><b>风险点</b><b>风险管控措施</b></div><div id="briefingRiskRows"></div></div><div id="independentMeasureList" class="briefing-risk-card-list"></div>`;
    const riskRows=page.querySelector('#briefingRiskRows');
    const independentList=page.querySelector('#independentMeasureList');
    function separate(item){
      if(item.dataset.separated)return;
      item.dataset.separated='true';
      item.dataset.briefingKey=`briefing_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const risk=item.querySelector('[aria-label="主要安全风险"]');
      const measure=item.querySelector('[aria-label="安全防范措施"]');
      const riskValue=risk?.value||'';
      const measureValue=measure?.value||'';
      if(risk)risk.outerHTML=`<input type="hidden" aria-label="主要安全风险" value="${riskValue.replace(/"/g,'&quot;')}">`;
      if(measure)measure.outerHTML=`<input type="hidden" aria-label="安全防范措施" value="${measureValue.replace(/"/g,'&quot;')}">`;
    }
    function refreshRiskTable(){
      currentRows().forEach(separate);
      const rows=currentRows();
      riskRows.innerHTML=rows.map((item,index)=>`<div class="briefing-risk-row" data-risk-key="${item.dataset.briefingKey}"><span>${index+1}</span><textarea aria-label="主要安全风险" placeholder="填写风险点">${item.querySelector('[aria-label="主要安全风险"]')?.value||''}</textarea><textarea aria-label="安全防范措施" placeholder="填写风险管控措施">${item.querySelector('[aria-label="安全防范措施"]')?.value||''}</textarea></div>`).join('');
      riskRows.querySelectorAll('.briefing-risk-row').forEach(riskRow=>{
        const source=stepRows.querySelector(`[data-briefing-key="${riskRow.dataset.riskKey}"]`);
        riskRow.querySelector('[aria-label="主要安全风险"]').oninput=event=>source.querySelector('[aria-label="主要安全风险"]').value=event.target.value;
        riskRow.querySelector('[aria-label="安全防范措施"]').oninput=event=>source.querySelector('[aria-label="安全防范措施"]').value=event.target.value;
      });
    }
    new MutationObserver(refreshRiskTable).observe(stepRows,{childList:true});
    page.querySelector('#addIndependentMeasure').onclick=()=>{independentList.insertAdjacentHTML('beforeend',independentMeasureRow(['作业中','','','']));independentList.lastElementChild.querySelector('textarea').focus()};
    page.querySelector('#submitEnhancedBriefing').addEventListener('click',event=>{
      const incomplete=currentRows().some(item=>!item.querySelector('[aria-label="主要安全风险"]').value.trim()||!item.querySelector('[aria-label="安全防范措施"]').value.trim());
      if(!incomplete)return;
      event.preventDefault();event.stopImmediatePropagation();toast('请完整填写每条作业步骤对应的风险点和风险管控措施');
    },true);
    const stepHeader=page.querySelector('.briefing-step-row.header');
    stepHeader.innerHTML='<b>序号</b><b>作业阶段</b><b>作业步骤</b><b>操作</b>';
    refreshRiskTable();
  };
})();
