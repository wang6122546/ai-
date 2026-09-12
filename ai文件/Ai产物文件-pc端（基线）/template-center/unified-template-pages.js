(function () {
  const clone = value => JSON.parse(JSON.stringify(value));
  const templateKey = () => state.template?.id || state.template?.code || state.template?.name || 'draft';
  const isMature = () => state.template?.id === 'space' || state.template?.code === 'YXKJ';
  const formByTemplate = new Map([['space', clone(confinedSchema)]]);
  let activeFormTemplate = 'space';

  function emptyFormSchema() {
    return { id: `${templateKey()}-application`, name: `${state.template?.name || '新建模板'}申请表`, version: 2, sections: [] };
  }

  function switchFormSchema() {
    const key = templateKey();
    if (key === activeFormTemplate) return;
    formByTemplate.set(activeFormTemplate, clone(confinedSchema));
    let saved = formByTemplate.get(key);
    if (!saved) {
      try { saved = JSON.parse(localStorage.getItem(`templateFormSchema:${key}`) || 'null'); } catch (error) {}
    }
    confinedSchema = normalizeConfined(clone(saved || emptyFormSchema()));
    confinedSelection = confinedSchema.sections.length ? { kind: 'section', sectionId: confinedSchema.sections[0].id } : { kind: 'canvas', sectionId: '', fieldKey: '' };
    confinedState = confinedSchema.sections.length ? 'normal' : 'empty';
    activeFormTemplate = key;
  }

  saveConfined = function () {
    const key = templateKey();
    formByTemplate.set(key, clone(confinedSchema));
    localStorage.setItem(`templateFormSchema:${key}`, JSON.stringify(confinedSchema));
    toast(`${state.template?.name || '模板'}表单已保存为草稿`);
  };

  renderFormBuildStep = function () {
    switchFormSchema();
    renderConfinedDesigner();
    const name = state.template?.name || '新建模板', code = state.template?.code || '';
    title.textContent = `${name} · 表单设计`;
    subtitle.textContent = isMature() ? '成熟案例 · 仅设计新建作业票页面' : '空白模板 · 使用统一组件库设计作业申请表单';
    document.querySelectorAll('.confined-template b').forEach(element => element.textContent = name);
    if (!isMature()) {
      const templateName = document.querySelector('.confined-template b');
      if (templateName) templateName.outerHTML = `<strong>${name}</strong>`;
    }
    const brand = document.querySelector('.confined-template');
    if (brand && code && !brand.querySelector('small')) brand.insertAdjacentHTML('beforeend', `<small>　${code}</small>`);
    document.querySelectorAll('.confined-steps span').forEach(element => {
      if (element.textContent.includes('节点表单') || element.textContent.includes('作业申请表单设计')) element.textContent = '2 表单设计';
    });
    if (!isMature()) {
      const next = [...document.querySelectorAll('.confined-top .actions button')].find(button => button.textContent.trim() === '下一步');
      if (next) next.onclick = event => { event.preventDefault(); event.stopImmediatePropagation(); formByTemplate.set(templateKey(), clone(confinedSchema)); state.mode = 'flow'; renderDesigner(); };
    }
  };

  const maturePublish = renderPublishStep;
  renderPublishStep = function () {
    if (isMature()) return maturePublish();
    const name = state.template?.name || '新建模板', code = state.template?.code || '—';
    const checks = [
      ['数据对象及主外键关系', false, '尚未配置数据对象关系'],
      ['字段和控件绑定', confinedSchema.sections.length > 0, confinedSchema.sections.length ? '已检测到表单组件' : '表单画布暂无组件'],
      ['数据来源可用性', false, '尚未配置数据来源'],
      ['必填字段权限', true, '当前无权限冲突'],
      ['流程节点和作业空间绑定', false, '流程画布尚未完成'],
      ['办理人来源', false, '尚未配置办理角色'],
      ['条件分支', true, '当前未配置条件分支'],
      ['驳回路线', true, '当前未配置驳回路线'],
      ['签字及附件字段', true, '当前未配置签字及附件字段'],
      ['归档只读规则', true, '使用模板统一默认规则']
    ];
    const errors = checks.filter(item => !item[1]).length, passed = checks.length - errors;
    title.textContent = `${name} · 测试与发布`;
    subtitle.textContent = '统一发布检查 · 根据当前空白配置展示真实结果';
    app.innerHTML = `<div class="build-shell mature-publish"><div class="build-top"><div class="build-brand"><span>◈</span><div><b>${name}</b><small>　${code}</small></div></div>${buildSteps(4)}<div class="actions"><button id="publishClose">关闭</button></div></div><main class="publish-check-page"><section class="publish-hero pending"><div><span>发布检查结果</span><h2>${errors ? '当前配置尚未满足发布条件' : '全部关键检查已通过'}</h2><p>${passed} 项检查通过，${errors} 个错误；请完成空白模板配置后发布。</p></div><strong>${Math.round(passed / checks.length * 100)}%</strong></section><div class="check-levels"><span class="error">错误 ${errors}</span><span class="warning">警告 0</span><span class="suggestion">建议 1</span></div><section class="check-grid">${checks.map(item => `<article class="${item[1] ? '' : 'has-error'}"><i>${item[1] ? '✓' : '!'}</i><div><b>${item[0]}</b><span>${item[2]}</span></div><em>${item[1] ? '通过' : '待配置'}</em></article>`).join('')}</section><section class="suggestion-box"><h3>配置建议</h3><p>建议先完成模板与数据、申请表单和流程节点配置，再执行发布检查。</p></section><div class="dialog-footer"><button id="publishBack">上一步</button><button class="primary" id="publishNow" ${errors ? 'disabled' : ''}>发布模板</button></div></main></div>`;
    document.querySelector('#publishClose').onclick = centerView;
    document.querySelector('#publishBack').onclick = () => { state.mode = 'flow'; renderDesigner(); };
    document.querySelector('#publishNow').onclick = () => toast('模板已通过检查并发布');
  };
  window.openTemplatePublishCheck = renderPublishStep;

  function normalizeUnifiedPage() {
    const form = document.querySelector('.confined-designer');
    if (form) {
      const name = state.template?.name || '新建模板';
      const formTitle = `${name} · 表单设计`, formSubtitle = isMature() ? '成熟案例 · 仅设计新建作业票页面' : '空白模板 · 使用统一组件库设计作业申请表单';
      if (title.textContent !== formTitle) title.textContent = formTitle;
      if (subtitle.textContent !== formSubtitle) subtitle.textContent = formSubtitle;
    }
    const workflow = document.querySelector('.yf-workflow');
    if (workflow) {
      const name = state.template?.name || '新建模板';
      const flowTitle = `${name} · 流程编排`, flowSubtitle = isMature() ? '成熟案例 · 配置流程节点、办理人和流转规则' : '空白模板 · 从统一节点库拖入节点并配置流转规则';
      if (title.textContent !== flowTitle) title.textContent = flowTitle;
      if (subtitle.textContent !== flowSubtitle) subtitle.textContent = flowSubtitle;
      const minimap = document.querySelector('.yf-minimap');
      const mapText = `${name}流程 · ${document.querySelectorAll('.yf-node').length} 个节点`;
      if (minimap && minimap.textContent !== mapText) minimap.textContent = mapText;
    }
  }
  new MutationObserver(normalizeUnifiedPage).observe(app, { childList: true, subtree: true });
})();
