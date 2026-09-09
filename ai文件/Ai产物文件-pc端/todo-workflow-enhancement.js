/* 安全措施四阶段待办顺序与进度联动。 */
(function(){
  const base=handleTodoAction;
  function nextButton(row,action){
    // 安全措施确认页已有完整的逐项校验、签字和提交后返回待办逻辑，
    // 不再覆盖其提交事件，避免提交后直接跳入安全交底页面。
    if(action==='安全措施确认')return;
    const submit=document.querySelector('#submitGasDetection,#submitSafetyConfirm,#submitBriefingBottom,#submitReceive');
    if(!submit)return;
    submit.onclick=()=>{if(action==='气体检测'){row[6]='安全措施确认';todoState='measure';openView('todo')}else if(action==='安全交底'){row[6]='接收交底';renderReceiveBriefingPage(row)}else{const i=(todoRows.measure||[]).findIndex(x=>x[0]===row[0]);if(i>=0)todoRows.measure.splice(i,1);row[6]='作业审批';(todoRows.approval||[]).unshift(row);todoState='approval';openView('todo');toast('已进入作业审批')} };
  }
  function ensureRiskMeasureButton(){
    const page=document.querySelector('.risk-assessment-page');
    if(!page)return;
    const header=page.querySelectorAll('.risk-page-section')[1]?.querySelector('header');
    if(!header)return;
    let button=header.querySelector('#addPageMeasure');
    if(!button){button=document.createElement('button');button.id='addPageMeasure';button.className='primary small'}
    button.textContent='＋ 新增措施';
    header.appendChild(button);
    button.onclick=()=>openRiskMeasureDrawer(page);
  }
  handleTodoAction=function(action,row){if(!row)return;if(action==='风险评估'){base(action,row);ensureRiskMeasureButton();return}if(action==='气体检测'||action==='安全措施确认'||action==='安全交底'||action==='接收交底'){base(action,row);setTimeout(()=>nextButton(row,action),0);return}base(action,row)};
})();
