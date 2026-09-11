(function () {
  const fallbackHierarchy = [
    { id: 'REGULAR', name: '常规作业', enabled: true, children: [{ id: 'REGULAR_WORK', name: '常规作业', enabled: true, levels: [] }] },
    { id: 'DANGER', name: '危险作业', enabled: true, children: ['有限空间作业', '高处作业', '吊装作业', '临时用电作业', '动火作业', '动土作业', '断路作业', '盲板抽堵作业', '爆破作业（井下）', '爆破作业（露天）'] },
    { id: 'CROSS', name: '交叉作业', enabled: true, children: ['交叉作业模板作业'] },
    { id: 'MAJOR', name: '危大工程', enabled: true, children: ['基坑作业', '脚手架作业', '模板作业', '拆除工程作业', '起重吊装及起重机械安装拆卸作业'] }
  ];
  const knownLevels = { '动火作业': ['全部等级', '特级', '一级', '二级', '三级'], '高处作业': ['全部等级', '一级', '二级'], '吊装作业': ['全部等级', '一级'], '临时用电作业': ['全部等级', '一级'], '断路作业': ['全部等级', '一级'] };
  let createDialogMode = 'normal';
  const enabled = item => item?.enabled !== false && !['停用', '禁用', 'DISABLED'].includes(item?.status);
  const typeId = (type, group, index) => type.id || type.workTypeId || `${group.id || group.name}-${index}-${type.name}`;
  function loadWorkConfiguration() {
    let raw = [];
    try { raw = JSON.parse(localStorage.getItem('safeWorkTypeHierarchy') || '[]'); } catch (_) { raw = []; }
    if (!Array.isArray(raw) || !raw.length) raw = fallbackHierarchy;
    return raw.filter(enabled).map((group, groupIndex) => ({ id: group.id || group.workCategoryId || `CATEGORY-${groupIndex}`, name: group.name, types: (group.children || []).map((entry, index) => typeof entry === 'string' ? { id: `${group.id || group.name}-${index}-${entry}`, name: entry, enabled: true, levels: knownLevels[entry] || [] } : { ...entry, id: typeId(entry, group, index), levels: entry.levels || entry.workLevels || knownLevels[entry.name] || [] }).filter(enabled) })).filter(group => group.name);
  }
  function templateExists(type) {
    return templates.map(normalizeTemplateRecord).some(template => template.templateType === DEFAULT_TEMPLATE_TYPE && (template.workTypeId === type.id || template.workTypeId === type.name || template.name === type.name || template.name === `${type.name}模板`));
  }
  function uniqueCode(type) {
    const stem = String(type.id || makeTemplateCode(type.name)).replace(/[^A-Za-z0-9]/g, '').toUpperCase() || makeTemplateCode(type.name);
    let code = stem, suffix = 1; while (templates.some(t => t.code === code)) code = `${stem}-${++suffix}`; return code;
  }
  function stateBlock(mode) {
    const states = { loading: ['正在加载参数配置', '请稍候…'], unavailable: ['暂无可用配置', '未读取到已启用的作业类别与类型'], duplicate: ['该作业类型已创建作业票模板', '请选择其他作业类型'], error: ['参数配置加载失败', '请稍后重试或联系管理员'], forbidden: ['无权读取作业管理配置', '请联系管理员开通配置读取权限'] };
    const state = states[mode]; return state ? `<div class="create-state ${['error','forbidden','duplicate'].includes(mode)?'error':mode}"><b>${state[0]}</b><span>${state[1]}</span></div>` : '';
  }
  function renderCreateTemplateDialog(mode = createDialogMode) {
    createDialogMode = mode; const groups = mode === 'normal' ? loadWorkConfiguration() : []; const hasGroups = groups.some(g => g.types.length);
    state.creation = { templateType: DEFAULT_TEMPLATE_TYPE, workCategoryId: '', workTypeId: '', workLevelIds: ['ALL'], name: '', code: '', category: '', icon: '♨', applyStandardConfig: true, status: '草稿', version: 'V1' };
    document.querySelector('.modal-card').className = 'modal-card create-template-v2';
    document.querySelector('#modalBody').innerHTML = `<div class="dialog-heading"><div><h2>创建作业模板</h2><p>选择作业类别与类型，创建的模板适用于该作业类型的所有等级。</p></div></div><div class="create-form"><div class="template-type-readonly"><span>模板类型　<b>${TEMPLATE_TYPE_LABELS[DEFAULT_TEMPLATE_TYPE]}</b></span><code>${DEFAULT_TEMPLATE_TYPE}</code></div>${mode !== 'normal' ? stateBlock(mode) : !hasGroups ? stateBlock('unavailable') : `<label><span><i>*</i> 作业类别</span><select id="createCategory"><option value="">请选择作业类别</option>${groups.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select></label><label><span><i>*</i> 作业类型</span><select id="createWorkType" disabled><option value="">请先选择作业类别</option></select><small class="field-help" id="typeAvailability">已创建模板的作业类型仍会展示，但不可重复选择。</small></label><label><span>模板名称</span><input id="createName" type="text" readonly placeholder="选择作业类型后自动生成"></label><label><span>模板编码</span><input id="createCode" type="text" readonly placeholder="创建时由系统自动生成"></label><label class="standard-config-choice"><input id="applyStandardConfig" type="checkbox" checked><span><b>应用当前作业类型的标准配置</b><small>加载已发布的风险、措施、安全交底、结束确认标准和默认流程。</small></span></label>`}</div><div class="dialog-footer"><button class="ghost" id="cancelCreate">取消</button>${mode==='error'?'<button class="secondary" id="retryCreateConfig">重试</button>':''}<button class="primary" id="confirmCreate" ${mode!=='normal'||!hasGroups?'disabled':''}>创建并进入设计</button></div>`;
    openModalShell(); document.querySelector('#cancelCreate').onclick = closeModalShell; document.querySelector('#retryCreateConfig')?.addEventListener('click',()=>renderCreateTemplateDialog('normal'));
    if (mode !== 'normal' || !hasGroups) return;
    const category = document.querySelector('#createCategory'), type = document.querySelector('#createWorkType'), name = document.querySelector('#createName'), code = document.querySelector('#createCode'), note = document.querySelector('#typeAvailability'), confirm = document.querySelector('#confirmCreate');
    category.onchange = () => { state.creation.workCategoryId = category.value; state.creation.workTypeId = ''; state.creation.workLevelIds = ['ALL']; state.creation.name = ''; state.creation.code = ''; name.value = ''; code.value = ''; const group = groups.find(g=>g.id===category.value); if (!group) { type.innerHTML='<option value="">请先选择作业类别</option>'; type.disabled=true; return; } const available=group.types.filter(x=>!templateExists(x)); type.innerHTML=`<option value="">请选择作业类型</option>${group.types.map(x=>`<option value="${x.id}" ${templateExists(x)?'disabled':''}>${x.name}${templateExists(x)?'（已创建模板）':''}</option>`).join('')}`; type.disabled=!group.types.length; note.textContent=available.length?'已创建模板的作业类型已置灰，不可重复选择。':'该类别下暂无可创建模板的作业类型'; note.classList.toggle('warn',!available.length); state.creation.category=group.name; };
    type.onchange = () => { const group=groups.find(g=>g.id===category.value), selected=group?.types.find(x=>x.id===type.value); state.creation.workTypeId=selected?.id||''; state.creation.workLevelIds=['ALL']; state.creation.name=selected?.name||''; state.creation.code=selected?uniqueCode(selected):''; name.value=state.creation.name; code.value=state.creation.code; };
    confirm.onclick = () => { const group=groups.find(g=>g.id===category.value), selected=group?.types.find(x=>x.id===type.value); if(!category.value)return toast('请选择作业类别'); if(!selected)return toast('请选择可创建的作业类型'); if(templateExists(selected)){createDialogMode='duplicate';return renderCreateTemplateDialog('duplicate');} state.creation.applyStandardConfig=document.querySelector('#applyStandardConfig').checked; const draft={...state.creation,id:`template-${Date.now()}`,updated:'2026-09-09'}; try{const created=templateMockService.createUnique(draft,templates);templates.unshift(created);state.template=created;closeModalShell();openDesigner(created.id);toast('草稿创建成功，已进入模板设计');}catch(error){if(error.code==='DUPLICATE_WORK_TYPE_TEMPLATE')return renderCreateTemplateDialog('duplicate');renderCreateTemplateDialog('error');} };
  }
  openCreateTemplate = function () { renderCreateTemplateDialog('normal'); };
  window.renderCreateTemplateState = renderCreateTemplateDialog;
  document.querySelector('#createTemplate') && (document.querySelector('#createTemplate').onclick = openCreateTemplate);
})();
