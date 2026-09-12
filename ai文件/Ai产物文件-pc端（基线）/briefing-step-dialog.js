(function(){
  const baseRender=renderEnhancedSafetyBriefing;
  renderEnhancedSafetyBriefing=function(row){
    baseRender(row);
    const page=content.querySelector('.enhanced-briefing-page');
    if(!page)return;
    const stepRows=page.querySelector('#briefingStepRows');
    const stageActions=page.querySelector('.briefing-stage-actions');
    stageActions.innerHTML='<small>新增步骤时选择作业阶段，保存后追加至列表末尾</small><button class="primary" id="addBriefingStepOnTodo">＋ 新增作业步骤</button>';
    page.querySelector('#addIndependentMeasure')?.remove();
    const independentList=page.querySelector('#independentMeasureList');
    if(independentList)independentList.hidden=true;

    page.querySelector('#addBriefingStepOnTodo').onclick=()=>{
      document.querySelector('.briefing-step-dialog-layer')?.remove();
      document.body.insertAdjacentHTML('beforeend',`<div class="briefing-step-dialog-layer"><button class="briefing-step-dialog-mask" aria-label="关闭新增作业步骤弹窗"></button><aside class="briefing-step-dialog"><header><b>▶ 新增作业步骤</b><button class="briefing-step-dialog-close" aria-label="关闭">×</button></header><div class="briefing-step-dialog-body"><label><span><i>*</i> 作业阶段</span><select id="todoBriefingStage"><option>作业前</option><option>作业中</option><option>作业后</option></select></label><label><span><i>*</i> 作业步骤内容</span><textarea id="todoBriefingContent" placeholder="请输入作业步骤内容"></textarea></label></div><footer><button class="ghost briefing-step-dialog-cancel">取消</button><button class="primary" id="saveTodoBriefingStep">确定</button></footer></aside></div>`);
      const layer=document.querySelector('.briefing-step-dialog-layer'),close=()=>layer.remove();
      layer.querySelector('.briefing-step-dialog-mask').onclick=layer.querySelector('.briefing-step-dialog-close').onclick=layer.querySelector('.briefing-step-dialog-cancel').onclick=close;
      layer.querySelector('#saveTodoBriefingStep').onclick=()=>{const stage=layer.querySelector('#todoBriefingStage').value,step=layer.querySelector('#todoBriefingContent').value.trim();if(!step)return toast('请输入作业步骤内容');stepRows.insertAdjacentHTML('beforeend',briefingStepRow([stage,step,'',''],stepRows.children.length));close();stepRows.lastElementChild.querySelector('[aria-label="作业步骤"]')?.focus();toast('作业步骤已追加至列表末尾')};
    };
  };
})();
