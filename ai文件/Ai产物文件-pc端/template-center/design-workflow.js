const templateWorkflowSteps = [
  ['模板与数据', '身份、数据源'],
  ['表单设计', '搭建填报内容'],
  ['列表设计', '配置查询展示'],
  ['流程设计', '设置节点流转'],
  ['发布应用', '校验并生效']
];

buildSteps = function(active) {
  return `<nav class="steps workflow-steps" aria-label="自定义模板整理流程">${templateWorkflowSteps.map((step, index) => {
    const number = index + 1;
    const status = active > number ? 'done' : active === number ? 'active' : '';
    return `<button type="button" class="step-link ${status}" data-template-step="${number}" ${active === number ? 'aria-current="step"' : ''}><strong>${active > number ? '✓' : number} ${step[0]}</strong><small>${step[1]}</small></button>`;
  }).join('')}</nav>`;
};

function ensureTemplateEditingContext() {
  if (!state.template) {
    state.template = {
      name: state.creation?.name || '未命名模板',
      code: state.creation?.code || 'TEMP',
      category: state.creation?.category || '危险作业',
      status: '草稿',
      version: 'V1'
    };
  }
  if (!state.creation) {
    state.creation = {
      name: state.template.name,
      code: state.template.code,
      category: state.template.category || '危险作业',
      icon: state.template.icon || '安',
      url: `${location.origin}/#/work-templates/${state.template.code.toLowerCase()}`
    };
  }
}

function goToTemplateStep(step) {
  ensureTemplateEditingContext();
  if (step === 1) renderResourceStep();
  if (step === 2) renderFormBuildStep();
  if (step === 3) renderListBuildStep();
  if (step === 4) {
    state.mode = 'flow';
    renderDesigner();
  }
  if (step === 5) renderPublishStep();
}

app.addEventListener('click', event => {
  const stepButton = event.target.closest('[data-template-step]');
  if (stepButton) goToTemplateStep(Number(stepButton.dataset.templateStep));
});

const renderDesignerBeforeWorkflowUnification = renderDesigner;
renderDesigner = function() {
  ensureTemplateEditingContext();
  renderDesignerBeforeWorkflowUnification();
  document.querySelector('.designer-tabs')?.remove();
  const existingStrip = document.querySelector('.wizard-strip');
  const activeStep = state.mode === 'flow' ? 4 : 2;
  const activeName = templateWorkflowSteps[activeStep - 1][0];
  const strip = `<div class="unified-designer-strip"><div class="build-brand"><span>${state.creation.icon}</span><div><b>${state.template.name}</b><small>　${state.template.code}</small></div></div>${buildSteps(activeStep)}<span class="workflow-status">当前：${activeName}</span></div>`;
  if (existingStrip) existingStrip.outerHTML = strip;
  else document.querySelector('.designer-head')?.insertAdjacentHTML('beforebegin', strip);
  const testButton = document.querySelector('#testTemplate');
  if (testButton) {
    testButton.textContent = '▷ 流程测试';
    testButton.onclick = openFlowTest;
  }
  const versionButton = document.querySelector('#versionRecords');
  if (versionButton) versionButton.onclick = openVersionRecords;
};

function versionNumber(version) {
  return Math.max(1, Number(String(version || 'V1').replace(/[^0-9]/g, '')) || 1);
}

function versionScopeMarkup() {
  return `<div class="version-scope"><article><b>模板与数据</b><span>基础信息、主表、关联表和字段映射</span></article><article><b>界面配置</b><span>表单字段、布局、列表查询与展示列</span></article><article><b>流程配置</b><span>节点、处理人、流转条件和节点字段权限</span></article><article><b>发布信息</b><span>版本状态、生效时间、适用终端和操作人</span></article></div>`;
}

function openVersionRecords() {
  ensureTemplateEditingContext();
  const current = versionNumber(state.template.version);
  const draft = state.draftVersion || `V${current + 1} 草稿`;
  document.querySelector('.modal-card').className = 'modal-card version-dialog';
  document.querySelector('#modalBody').innerHTML = `<h2>${state.template.name} · 版本记录</h2><p class="version-intro">版本记录保存的是整套模板配置快照，不只是页面样式。运行中的作业始终引用发起时的版本。</p>${versionScopeMarkup()}<div class="version-timeline"><article class="current"><div><b>${draft}</b><span>当前编辑版本 · 今天 10:20</span></div><span>可修改表单、列表、流程和权限</span><button class="secondary" id="continueDraft">继续编辑</button></article><article><div><b>V${current} 当前生产版本</b><span>已发布 · 新作业默认使用</span></div><span>不可直接修改，可复制后调整</span><button class="ghost" data-copy-version="V${current}">复制为新版本</button></article><article><div><b>V1 历史版本</b><span>已停用 · 仅供追溯</span></div><span>查看发布时完整配置，只读</span><button class="ghost" data-view-version="V1">查看</button></article></div><div class="dialog-footer"><button class="primary" id="closeVersions">关闭</button></div>`;
  openModalShell();
  document.querySelector('#closeVersions').onclick = closeModalShell;
  document.querySelector('#continueDraft').onclick = () => {
    closeModalShell();
    toast(`正在继续编辑 ${draft}`);
  };
  document.querySelector('[data-copy-version]').onclick = event => {
    state.draftVersion = `V${current + 1} 草稿`;
    closeModalShell();
    renderDesigner();
    toast(`已基于 ${event.currentTarget.dataset.copyVersion} 创建 ${state.draftVersion}`);
  };
  document.querySelector('[data-view-version]').onclick = event => openVersionSnapshot(event.currentTarget.dataset.viewVersion);
}

function openVersionSnapshot(version) {
  document.querySelector('.modal-card').className = 'modal-card version-dialog';
  document.querySelector('#modalBody').innerHTML = `<span class="tag">只读快照</span><h2>${state.template.name} · ${version}</h2><p class="version-intro">以下是该版本发布时冻结的配置，不能在这里修改。</p><div class="snapshot-grid"><article><b>模板与数据</b><span>主表 work_permit_base · 4 个关联表</span></article><article><b>表单设计</b><span>${typeof canvasControls !== 'undefined' ? canvasControls.length : fields.length} 个字段 · PC/移动端</span></article><article><b>列表设计</b><span>3 个查询项 · 5 个展示字段</span></article><article><b>流程设计</b><span>${nodes.length} 个节点 · 含审批与结束节点</span></article><article><b>字段权限</b><span>按申请、审批、执行、归档节点冻结</span></article><article><b>发布记录</b><span>2026-08-20 09:00 · 王安全</span></article></div><div class="dialog-footer"><button class="ghost" id="backToVersions">返回版本记录</button><button class="primary" id="closeSnapshot">关闭</button></div>`;
  document.querySelector('#backToVersions').onclick = openVersionRecords;
  document.querySelector('#closeSnapshot').onclick = closeModalShell;
}

function openFlowTest() {
  ensureTemplateEditingContext();
  document.querySelector('.modal-card').className = 'modal-card flow-test-dialog';
  document.querySelector('#modalBody').innerHTML = `<h2>${state.template.name} · 流程测试</h2><p class="test-intro">填写一份临时申请数据并模拟提交，检查字段校验、条件分支、处理人和完整流转路径。测试数据不会进入正式作业台账。</p><div class="test-data-grid"><label>作业名称<input id="testWorkName" value="罐区设备检修"></label><label>作业等级<select id="testWorkLevel"><option>一级</option><option>二级</option><option>三级</option></select></label><label>申请单位<input value="设备管理部"></label><label>计划开始时间<input type="datetime-local" value="2026-09-06T08:00"></label><label class="wide">风险与措施<textarea>动火隔离、气体检测、专人监护</textarea></label></div><div class="test-notice">模拟测试只验证当前草稿，不创建作业编号、不发送待办、不影响生产版本。</div><div class="test-result pending" id="flowTestResult"><b>等待提交测试数据</b><p>提交后将展示命中的规则和每个流程节点。</p></div><div class="dialog-footer"><button class="ghost" id="cancelFlowTest">取消</button><button class="primary" id="runFlowTest">提交测试数据</button></div>`;
  openModalShell();
  document.querySelector('#cancelFlowTest').onclick = closeModalShell;
  document.querySelector('#runFlowTest').onclick = runFlowTest;
}

function runFlowTest() {
  const name = document.querySelector('#testWorkName').value.trim();
  if (!name) return toast('请填写作业名称后再测试');
  const level = document.querySelector('#testWorkLevel').value;
  const path = nodes.map((node, index) => `${index ? '<i>→</i>' : ''}<span><b>${node.name}</b><small>${node.handler}</small></span>`).join('');
  const result = document.querySelector('#flowTestResult');
  result.className = 'test-result';
  result.innerHTML = `<b>✓ 模拟提交成功</b><p>“${name}”字段校验通过；${level}作业命中分级审批规则。</p><div class="test-summary-grid"><article><b>表单校验</b><span>必填字段与数据格式通过</span></article><article><b>条件判断</b><span>命中${level}作业审批路径</span></article><article><b>节点权限</b><span>填报、只读和隐藏规则已加载</span></article><article><b>正式影响</b><span>无，不生成业务数据和待办</span></article></div><div class="test-path">${path}</div>`;
  document.querySelector('#runFlowTest').textContent = '重新测试';
}
