/* 我的待办：作业审批页面样式增强。 */
(function(){
  const previousTodoAction=handleTodoAction;
  const stepNames=['作业指挥意见','所在单位意见'];

  function renderTodoApproval(row){
    const job=todoJob(row),key=row[0],done=approvalProgress[key]||0,current=stepNames[Math.min(done,stepNames.length-1)];
    title.textContent='作业审批';
    subtitle.textContent='按配置流程逐节点完成审批';
    content.innerHTML=`<div class="todo-approval-page"><section class="todo-approval-card"><header class="todo-approval-head"><b>审批流程</b><span>作业编号：${job.id}</span></header><div class="todo-approval-form"><div class="todo-approval-row required"><span>${current}</span><div class="todo-approval-options"><label><input type="radio" name="todoApprovalResult" value="agree"> 同意</label><label><input type="radio" name="todoApprovalResult" value="reject" checked> 不同意</label></div></div><div class="todo-approval-row"><span>现场照片</span><button type="button" class="todo-approval-upload" id="todoApprovalUpload" aria-label="上传现场照片">＋</button></div><label class="todo-approval-row required"><span>备注</span><textarea id="todoApprovalRemark" placeholder="请填写备注"></textarea></label><div class="todo-approval-row required"><span>签字</span><button type="button" class="todo-approval-signature" id="todoApprovalSignature">✎ 点击签字</button></div></div><footer class="todo-approval-actions"><button type="button" class="ghost" id="cancelTodoApproval">取消</button><button type="button" class="primary" id="submitTodoApproval">提交</button></footer></section></div>`;
    const upload=content.querySelector('#todoApprovalUpload'),signature=content.querySelector('#todoApprovalSignature');
    upload.onclick=()=>{upload.classList.add('is-uploaded');upload.textContent='图片已添加';toast('现场照片已添加')};
    signature.onclick=()=>{signature.classList.add('signed');signature.dataset.signed='true';signature.textContent='✓ 已完成签字'};
    content.querySelector('#cancelTodoApproval').onclick=()=>openView('todo',document.querySelector('[data-view="todo"]'));
    content.querySelector('#submitTodoApproval').onclick=()=>{
      const remark=content.querySelector('#todoApprovalRemark').value.trim();
      if(!remark)return toast('请填写备注');
      if(!signature.dataset.signed)return toast('请完成签字');
      approvalProgress[key]=done+1;
      if(approvalProgress[key]<stepNames.length){toast('当前审批意见已提交');renderTodoApproval(row);return}
      updateTodoFlowStage(row,'site');todoState='site';openView('todo',document.querySelector('[data-view="todo"]'));toast('审批完成，进入现场实施');
    };
  }

  handleTodoAction=function(action,row){if(action==='作业审批')return renderTodoApproval(row);return previousTodoAction(action,row)};
})();
