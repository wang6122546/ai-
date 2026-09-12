/* 爆破作业（井下/露天）：列表样例、单页申请表和正式作业票适配。 */
(() => {
  const samples={
    DH20251215002:{name:'-420m 中段采场爆破作业',type:'爆破作业（井下）',risk:'高风险',level:'一级',area:'齐大山铁矿 · -420m中段',owner:'马鹏云',content:'-420m中段采场掘进爆破，完成装药、警戒、起爆及验炮',templateFields:{'爆破设计编号':'BP-SJ-2026-091','爆破孔数/孔径':'48个 / 42mm','炸药量/类型':'126kg / 乳化炸药','警戒距离':'300m'}},
    DH20251203003:{name:'东帮台阶露天爆破作业',type:'爆破作业（露天）',risk:'高风险',level:'一级',area:'大孤山铁矿 · 东帮台阶',owner:'任国库',content:'东帮台阶深孔爆破，完成清场、警戒、起爆及爆后检查',templateFields:{'爆破设计编号':'BP-SJ-2026-092','爆破孔数/孔径':'36个 / 90mm','炸药量/类型':'380kg / 铵油炸药','警戒范围':'爆区周边500m'}}
  };
  const mapJob=job=>samples[job?.id]?{...job,...samples[job.id]}:job;
  const previousJobRow=jobRow;jobRow=(job,index)=>previousJobRow(mapJob(job),index);
  const previousMore=showJobMoreActions;showJobMoreActions=(job,render,anchor)=>previousMore(mapJob(job),render,anchor);
  const previousTicket=showJobTicket;showJobTicket=job=>previousTicket(mapJob(job));
  const previousAction=handleJobAction;handleJobAction=(action,job,render)=>previousAction(action,mapJob(job),render);
  const previousNewJob=showNewJob;
  showNewJob=()=>isBlast(selectedJobType)?renderBlastApplication(selectedJobType):previousNewJob();

  function isBlast(type){return String(type||'').includes('爆破作业（井下）')||String(type||'').includes('爆破作业（露天）')}
  function field(label,placeholder=label,type='text'){return `<label>${label}${requiredMark()}<input type="${type}" placeholder="请输入${placeholder}"></label>`}
  function renderBlastApplication(type){
    const underground=String(type).includes('井下');
    title.textContent='申请作业票';subtitle.textContent=`${type}申请、人员单位和审批信息`;
    content.innerHTML=`<div class="limited-job-page blast-job-page"><div class="limited-breadcrumb">作业管理　/　${type}　/　<b>申请作业票</b></div>
      <section class="limited-section"><h3>作业基本信息</h3><div class="limited-form three-col">
        <label>关联施工项目${pickerControl('blastProject','未关联施工项目','关联施工项目','project')}</label>
        ${field('爆破作业名称','爆破作业名称')}${field('爆破设计编号','爆破设计编号')}
        <label>爆破作业类别${requiredMark()}<select><option>${underground?'井下爆破':'露天爆破'}</option></select></label>
        ${field('设计人','设计人')}${field('设计审核人','设计审核人')}${field('爆破孔数（个）','爆破孔数','number')}${field('孔径（m）','孔径','number')}${field('填塞高度（m）','填塞高度','number')}${field('孔深（m）','孔深','number')}${field('孔距（m）','孔距','number')}${field('排距（m）','排距','number')}${field('炸药量（kg）','炸药量','number')}${field('炸药类型','炸药类型')}${field('爆破量（t）','爆破量','number')}${field('警戒距离（m）','警戒距离','number')}
        <label class="span-3">警戒范围${requiredMark()}<textarea placeholder="请输入警戒范围及周边危险禁入区域"></textarea></label>
        <label class="span-3 textarea-count">作业内容${requiredMark()}<textarea id="blastJobContent" maxlength="500" placeholder="填写作业准备、爆破施工、爆破后检查等内容"></textarea><em id="blastJobContentCount">0/500</em></label>
        <label>作业内容附件${filePick('blastContentFile')}</label><label>爆破设计/作业方案${filePick('blastPlanFile')}</label>${field('计划开始时间','计划开始时间','datetime-local')}${field('计划结束时间','计划结束时间','datetime-local')}
      </div></section>
      <section class="limited-section"><h3>作业相关单位、人员及地点</h3><div class="limited-form three-col"><label>作业单位${requiredMark()}${pickerControl('blastWorkUnit','选择单位','选择单位','unit')}</label><label>作业负责人${requiredMark()}${pickerControl('blastOwner','安全生产鞍钢项目','选择人员','person')}</label><label>作业所在单位${requiredMark()}${pickerControl('blastBelongUnit','选择单位','选择单位','unit')}</label><label>作业单位现场监护人${requiredMark()}${pickerControl('blastGuardian','选择成员','选择人员','person')}</label><label>业主单位作业审批人${requiredMark()}${pickerControl('blastApprover','选择成员','选择人员','person')}</label><label>作业地点及部位${requiredMark()}<input placeholder="填写作业地点及部位"></label></div></section>
      <section class="limited-section table-section"><h3>普通作业人员 <button class="primary small" id="addBlastNormal">＋新增</button></h3>${limitedPeopleTable('blastNormalWorkers',false)}</section>
      <section class="limited-section table-section"><h3>涉爆及特种作业人员 <button class="primary small" id="addBlastSpecial">＋新增</button></h3>${limitedPeopleTable('blastSpecialWorkers',true)}</section>
      <section class="limited-section approval-section"><h3>审批流程</h3><div class="approval-grid"><b>作业审批节点</b><b>审批人</b><label><span>○ 作业负责人意见</span>${pickerControl('blastApproveOwner','选择成员','选择人员','person')}</label><label><span>○ 作业单位审批人</span>${pickerControl('blastApproveUnit','选择成员','选择人员','person')}</label><label><span>○ 业主单位作业审批人</span>${pickerControl('blastApproveOwnerUnit','选择成员','选择人员','person')}</label></div></section>
      <footer class="limited-footer"><button class="ghost" id="cancelBlastJob">取消</button><button class="primary" id="submitBlastJob">提交</button></footer></div>`;
    document.querySelector('#cancelBlastJob').onclick=exitJobWizard;document.querySelector('#submitBlastJob').onclick=()=>toast(`${type}作业票已提交`);document.querySelector('#blastJobContent').oninput=e=>document.querySelector('#blastJobContentCount').textContent=`${e.target.value.length}/500`;document.querySelectorAll('[data-file-trigger]').forEach(button=>button.onclick=()=>document.querySelector('#'+button.dataset.fileTrigger).click());document.querySelectorAll('[data-project-target]').forEach(button=>button.onclick=()=>showProjectPicker(button.dataset.projectTarget));document.querySelectorAll('[data-person-target]').forEach(button=>button.onclick=()=>showPersonPicker(button.dataset.personTarget));document.querySelectorAll('[data-unit-target]').forEach(button=>button.onclick=()=>showUnitPicker(button.dataset.unitTarget));document.querySelector('#addBlastNormal').onclick=()=>showPersonPicker(null,'blastNormalWorkers');document.querySelector('#addBlastSpecial').onclick=()=>showPersonPicker(null,'blastSpecialWorkers');
  }
  setupJobs();
})();
