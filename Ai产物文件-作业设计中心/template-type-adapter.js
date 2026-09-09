(function () {
  templates = templates.map(normalizeTemplateRecord);
  state.templateType = DEFAULT_TEMPLATE_TYPE;

  const centerBeforeTypeAdapter = centerView;
  centerView = function () {
    state.templateType = DEFAULT_TEMPLATE_TYPE;
    templates = templates.map(normalizeTemplateRecord);
    centerBeforeTypeAdapter();
    const context = document.querySelector('.business-context');
    if (context) context.innerHTML = `<b>模板上下文</b><span>模板类型：${TEMPLATE_TYPE_LABELS[DEFAULT_TEMPLATE_TYPE]}</span><span>参数配置统一维护风险、交底与验收标准</span><span>模板仅负责模块拆解、节点编排和填报设计</span>`;
  };

  const createBeforeTypeAdapter = openCreateTemplate;
  openCreateTemplate = function () {
    createBeforeTypeAdapter();
    state.creation = normalizeTemplateRecord({ ...state.creation, templateType: DEFAULT_TEMPLATE_TYPE, workTypeId: state.creation?.workTypeId || state.creation?.name || '' });
    document.querySelector('#createBusinessMode')?.closest('label')?.remove();
    const form = document.querySelector('.create-form');
    if (form && !form.querySelector('[data-current-template-type]')) form.insertAdjacentHTML('afterbegin', `<div class="create-business-hint" data-current-template-type><b>模板类型：</b>${TEMPLATE_TYPE_LABELS[DEFAULT_TEMPLATE_TYPE]}</div>`);
    const name = document.querySelector('#createName'), category = document.querySelector('#createCategory'), level = document.querySelector('#createLevel');
    const syncBinding = () => { state.creation.templateType = DEFAULT_TEMPLATE_TYPE; state.creation.workCategoryId = category?.value || state.creation.category || ''; state.creation.workTypeId = name?.value || state.creation.name || ''; state.creation.workLevelIds = level?.value && level.value !== '未限定' ? [level.value] : []; };
    name?.addEventListener('change', syncBinding); category?.addEventListener('change', syncBinding); level?.addEventListener('change', syncBinding); syncBinding();
    const confirm = document.querySelector('#confirmCreate');
    if (confirm) { const original = confirm.onclick; confirm.onclick = event => { syncBinding(); const checked = validateTemplateRecord(state.creation); if (!checked.valid) return toast(checked.errors[0].message); state.creation = checked.value; original?.call(confirm, event); }; }
  };

  const actionsBeforeTypeAdapter = openTemplateActions;
  openTemplateActions = function (id) {
    actionsBeforeTypeAdapter(id);
    const copyButton = document.querySelector('[data-template-copy]'); if (!copyButton) return;
    copyButton.onclick = () => { const source = normalizeTemplateRecord(templates.find(t => t.id === id)); const copy = templateMockService.copy(source, { id: `${id}-copy-${Date.now()}`, name: `${source.name}副本`, code: `${source.code}-COPY`, updated: '2026-09-09' }); templates.unshift(copy); document.querySelector('.template-actions-popover')?.remove(); centerView(); toast('已复制为草稿模板'); };
  };

  const resourceBeforeTypeAdapter = renderResourceStep;
  renderResourceStep = function (...args) { if (state.creation) state.creation = normalizeTemplateRecord({ ...state.creation, templateType: DEFAULT_TEMPLATE_TYPE, workTypeId: state.creation.workTypeId || state.creation.name }); return resourceBeforeTypeAdapter(...args); };

  const listBeforeTypeAdapter = renderListBuildStep;
  renderListBuildStep = function (...args) {
    listBeforeTypeAdapter(...args); const next = document.querySelector('#listNext'); if (!next) return; const original = next.onclick;
    next.onclick = event => { original?.call(next, event); if (state.template) state.template = normalizeTemplateRecord({ ...state.template, templateType: DEFAULT_TEMPLATE_TYPE, workCategoryId: state.creation?.workCategoryId, workTypeId: state.creation?.workTypeId || state.template.name, workLevelIds: state.creation?.workLevelIds || [] }); };
  };

  document.addEventListener('click', event => { if (event.target.closest('#importTemplate')) templateMockService.import({ name: '待导入作业模板', workTypeId: 'IMPORTED_WORK_TYPE' }); });
  document.addEventListener('click', event => { if (event.target.closest('#publishNow') && state.template) state.template = templateMockService.publish(normalizeTemplateRecord(state.template)); });
  centerView();
})();
