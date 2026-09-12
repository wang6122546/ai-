let activeWorkControlId = '';
let activeWorkControlIndex = 0;
let workControlSchemas = loadWorkControlSchemas();

function loadWorkControlSchemas() {
  try { return JSON.parse(localStorage.getItem('workControlSchemas') || '{}'); } catch (error) { return {}; }
}

function saveWorkControlSchemas() {
  localStorage.setItem('workControlSchemas', JSON.stringify(workControlSchemas));
}

function inferWorkComponent(name) {
  if (/签字|签名/.test(name)) return 'ImageUpload';
  if (/附件|资料|证据|图片/.test(name)) return 'FileUpload';
  if (/时间|日期/.test(name)) return 'DateTimePicker';
  if (/人员|负责人|监护人|检测人/.test(name)) return 'UserPicker';
  if (/单位|组织/.test(name)) return 'OrgPicker';
  if (/说明|意见|措施|内容|标准/.test(name)) return 'Textarea';
  if (/结果|状态|频次|项目/.test(name)) return 'Select';
  return 'TextInput';
}

function ensureWorkControlSchema(item) {
  if (!workControlSchemas[item.id]) {
    workControlSchemas[item.id] = item.fields.split(/[、,]/).map((name, index) => ({
      id: `${item.id}-${index + 1}`,
      type: inferWorkComponent(name.trim()),
      label: name.trim(),
      placeholder: `请填写${name.trim()}`,
      required: item.required,
      disabled: false
    }));
  }
  return workControlSchemas[item.id];
}

function workControlPalette() {
  return window.formControlCatalog.map(group => `<div class="work-control-palette-group"><b>${group.label}</b>${group.controls.map(control => `<button draggable="true" data-work-add="${control.componentType}" data-work-name="${control.name}"><i>${control.icon}</i><span>${control.name}</span></button>`).join('')}</div>`).join('');
}

function workControlPreview(component) {
  const placeholder = escapeControlText(component.placeholder || `请配置${component.label}`);
  if (component.type === 'Textarea') return `<textarea rows="3" placeholder="${placeholder}" disabled></textarea>`;
  if (component.type === 'FileUpload' || component.type === 'ImageUpload') return `<div class="work-upload-preview"><button disabled>${component.type === 'ImageUpload' ? '上传图片' : '上传文件'}</button><span>未选择文件</span></div>`;
  if (component.type === 'Select' || component.type === 'Cascader') return `<select disabled><option>${placeholder}</option></select>`;
  if (component.type === 'DateTimePicker' || component.type === 'TimePicker') return `<input type="${component.type === 'TimePicker' ? 'time' : 'datetime-local'}" disabled>`;
  if (component.type === 'UserPicker' || component.type === 'OrgPicker') return `<div class="work-picker-preview"><span>${placeholder}</span><button disabled>${component.type === 'UserPicker' ? '选择人员' : '选择单位'}</button></div>`;
  if (component.type === 'RadioGroup' || component.type === 'CheckboxGroup') return `<div class="work-choice-preview"><label><input type="${component.type === 'RadioGroup' ? 'radio' : 'checkbox'}" disabled>选项一</label><label><input type="${component.type === 'RadioGroup' ? 'radio' : 'checkbox'}" disabled>选项二</label></div>`;
  return `<input placeholder="${placeholder}" disabled>`;
}

function workControlCanvas(schema) {
  if (!schema.length) return '<div class="control-canvas-empty">请从左侧控件库点击或拖入组件</div>';
  return schema.map((component, index) => `<article class="work-control-block ${index === activeWorkControlIndex ? 'selected' : ''}" draggable="true" data-work-index="${index}"><header><div><b>${escapeControlText(component.label)}</b><span>${confinedCatalog[component.type]?.[0] || component.type}</span></div><div><button data-work-up="${index}">↑</button><button data-work-copy="${index}">复制</button><button data-work-delete="${index}">删除</button></div></header><div class="work-control-display"><label>${component.required ? '<i>*</i>' : ''}${escapeControlText(component.label)}</label>${workControlPreview(component)}</div></article>`).join('');
}

function workControlProperties(component) {
  if (!component) return '<h3>控件属性</h3><p class="property-source-note">请先从左侧添加组件。</p>';
  return `<h3>控件属性</h3><label>控件类型<input value="${confinedCatalog[component.type]?.[0] || component.type}" readonly></label><label>控件标题<input id="workPropertyLabel" value="${escapeControlText(component.label)}"></label><label>占位提示<input id="workPropertyPlaceholder" value="${escapeControlText(component.placeholder || '')}"></label><label><input id="workPropertyRequired" type="checkbox" ${component.required ? 'checked' : ''}> 是否必填</label><label><input id="workPropertyDisabled" type="checkbox" ${component.disabled ? 'checked' : ''}> 是否禁用</label><div class="property-source-note"><b>通用组件</b><p>该组件来自表单设计器公共控件库，可在画布中选择、排序、复制和删除。</p></div>`;
}

openConfiguredControlEditor = function (id) {
  const item = configuredControls.find(control => control.id === id);
  if (!item) return;
  activeWorkControlId = id;
  const schema = ensureWorkControlSchema(item);
  activeWorkControlIndex = Math.max(0, Math.min(activeWorkControlIndex, schema.length - 1));
  title.textContent = `${item.name} · 控件设计`;
  subtitle.textContent = '使用通用组件组合可复用的作业控件';
  app.innerHTML = `<div class="control-designer-head"><button class="ghost" id="backControlLibrary">← 返回作业控件库</button><div><span class="status-dot"></span> ${escapeControlText(item.name)} · 编辑中</div><button class="ghost" id="previewWorkControl">▷ 运行预览</button><button class="primary" id="saveWorkControl">保存控件</button></div><div class="control-designer-workspace work-control-workspace"><aside class="control-designer-palette"><h3>控件库</h3><p>与模板表单设计器通用 · 点击或拖入画布</p><input class="work-palette-search" id="workPaletteSearch" placeholder="搜索组件">${workControlPalette()}</aside><section class="control-designer-stage"><div class="control-canvas-title"><b>${escapeControlText(item.name)}展示内容</b><span>画布中的组件共同组成该作业控件</span></div><div class="risk-control-canvas" id="workControlCanvas">${workControlCanvas(schema)}</div></section><aside class="control-property-panel">${workControlProperties(schema[activeWorkControlIndex])}</aside></div>`;
  bindWorkControlDesigner(item, schema);
};

function bindWorkControlDesigner(item, schema) {
  document.querySelector('#backControlLibrary').onclick = renderConfiguredControlLibrary;
  document.querySelector('#workPaletteSearch').oninput = event => document.querySelectorAll('[data-work-add]').forEach(button => button.style.display = button.textContent.includes(event.target.value) ? '' : 'none');
  document.querySelectorAll('[data-work-add]').forEach(button => {
    const add = () => { schema.push({ id: `${item.id}-${Date.now()}`, type: button.dataset.workAdd, label: button.dataset.workName, placeholder: `请配置${button.dataset.workName}`, required: false, disabled: false }); activeWorkControlIndex = schema.length - 1; openConfiguredControlEditor(item.id); };
    button.onclick = add;
    button.ondragstart = event => event.dataTransfer.setData('work-component', JSON.stringify({ type: button.dataset.workAdd, name: button.dataset.workName }));
  });
  const canvas = document.querySelector('#workControlCanvas');
  canvas.ondragover = event => event.preventDefault();
  canvas.ondrop = event => { event.preventDefault(); const raw = event.dataTransfer.getData('work-component'); if (!raw) return; const component = JSON.parse(raw); schema.push({ id: `${item.id}-${Date.now()}`, type: component.type, label: component.name, placeholder: `请配置${component.name}`, required: false, disabled: false }); activeWorkControlIndex = schema.length - 1; openConfiguredControlEditor(item.id); };
  document.querySelectorAll('[data-work-index]').forEach(block => block.onclick = event => { if (event.target.closest('button')) return; activeWorkControlIndex = +block.dataset.workIndex; openConfiguredControlEditor(item.id); });
  document.querySelectorAll('[data-work-up]').forEach(button => button.onclick = () => { const index = +button.dataset.workUp; if (!index) return; [schema[index - 1], schema[index]] = [schema[index], schema[index - 1]]; activeWorkControlIndex = index - 1; openConfiguredControlEditor(item.id); });
  document.querySelectorAll('[data-work-copy]').forEach(button => button.onclick = () => { const index = +button.dataset.workCopy; schema.splice(index + 1, 0, { ...schema[index], id: `${item.id}-${Date.now()}`, label: `${schema[index].label}副本` }); activeWorkControlIndex = index + 1; openConfiguredControlEditor(item.id); });
  document.querySelectorAll('[data-work-delete]').forEach(button => button.onclick = () => { schema.splice(+button.dataset.workDelete, 1); activeWorkControlIndex = Math.max(0, activeWorkControlIndex - 1); openConfiguredControlEditor(item.id); });
  const component = schema[activeWorkControlIndex];
  const update = () => { if (!component) return; component.label = document.querySelector('#workPropertyLabel').value; component.placeholder = document.querySelector('#workPropertyPlaceholder').value; component.required = document.querySelector('#workPropertyRequired').checked; component.disabled = document.querySelector('#workPropertyDisabled').checked; openConfiguredControlEditor(item.id); };
  document.querySelector('#workPropertyLabel')?.addEventListener('change', update);
  document.querySelector('#workPropertyPlaceholder')?.addEventListener('change', update);
  document.querySelector('#workPropertyRequired')?.addEventListener('change', update);
  document.querySelector('#workPropertyDisabled')?.addEventListener('change', update);
  document.querySelector('#saveWorkControl').onclick = () => { item.fields = schema.map(component => component.label).join('、'); item.updated = new Date().toISOString().slice(0, 10); saveWorkControlSchemas(); saveConfiguredControls(); toast('作业控件已保存'); };
  document.querySelector('#previewWorkControl').onclick = () => openConfiguredControlPreview(item.id);
}
