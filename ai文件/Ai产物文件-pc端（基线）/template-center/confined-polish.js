Object.assign(confinedCatalog, {
  NumberInput: ['数字输入', '123', 'basic'], Switch: ['开关', '◉', 'basic'],
  PositionPicker: ['岗位选择', '♟', 'advanced'], RolePicker: ['角色选择', '♧', 'advanced'],
  SignaturePad: ['手写签名', '✍', 'advanced'], RootCanvas: ['画布内容', '▦', 'layout'],
  SystemUser: ['创建/修改人员', '♙', 'system'], SystemDateTime: ['创建/修改时间', '◷', 'system'],
  SystemOrg: ['所属组织', '▦', 'system'], SystemPosition: ['所属岗位', '♟', 'system'],
  SystemCurrentUser: ['当前用户', '♙', 'system'], SerialNumber: ['流水号', '№', 'system'],
  SystemStatus: ['流程状态', '⌄', 'system'], SystemApproval: ['审批意见', '▤', 'system']
});
pickerControlTypes.PositionPicker = { title: '选择岗位', button: '选择岗位', mode: 'position' };
pickerControlTypes.RolePicker = { title: '选择角色', button: '选择角色', mode: 'role' };

const systemTypes = ['SystemUser', 'SystemDateTime', 'SystemOrg', 'SystemPosition', 'SystemCurrentUser', 'SerialNumber', 'SystemStatus', 'SystemApproval'];

const ensureBeforePolish = ensureConfinedConfig;
ensureConfinedConfig = function (item) {
  ensureBeforePolish(item);
  if (!item) return item;
  if (item.componentType === 'NumberInput') { item.min ??= 0; item.max ??= 999999; item.step ??= 1; }
  if (item.componentType === 'Switch') { item.onText ??= '是'; item.offText ??= '否'; item.demoValue ??= false; }
  if (item.componentType === 'SignaturePad') item.buttonText ??= '点击签名';
  if (systemTypes.includes(item.componentType)) { item.readonly = true; item.required = false; }
  if (item.componentType === 'EditableTable') { item.rows ??= []; item.columns ??= [['index', '序号'], ['name', '姓名'], ['position', '岗位'], ['department', '部门'], ['organization', '单位'], ['actions', '操作']]; }
  return item;
};

function systemComponentProps(item) {
  return `<label>控件类型<input value="${confinedTypeName(item)}" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.label || '')}"></label><label>系统取值<input value="运行时由系统上下文自动回填" readonly></label>${toggleSetting('cpDisabled', '是否禁用', item.disabled)}<div class="property-note"><b>系统控件定义</b><br>系统控件用于展示或保存系统自动生成的数据，填报人不能手工修改。例如创建人、创建时间、当前用户、流水号和流程状态。</div>${componentBusinessRules(item)}`;
}

function tableComponentProps(item) {
  return `<label>控件类型<input value="明细表" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.title || '')}"></label><label>空状态文案<input id="cpEmptyText" value="${escapeControlText(item.emptyText || '暂无数据')}"></label><div class="table-column-settings"><b>列内容</b>${item.columns.map((column, index) => `<div><input value="${escapeControlText(column[1])}" data-table-column="${index}"><button data-remove-column="${index}" ${item.columns.length <= 2 ? 'disabled' : ''}>删除</button></div>`).join('')}<button class="secondary" id="addTableColumn">＋ 增加列</button></div>${componentBusinessRules(item)}`;
}

const componentPropsBeforePolish = componentProps;
componentProps = function (item) {
  ensureConfinedConfig(item);
  if (item.componentType === 'EditableTable') return tableComponentProps(item);
  if (systemTypes.includes(item.componentType)) return systemComponentProps(item);
  if (item.componentType === 'NumberInput') return `<label>控件类型<input value="数字输入" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.label || '')}"></label><div class="property-two"><label>最小值<input id="cpNumberMin" type="number" value="${item.min}"></label><label>最大值<input id="cpNumberMax" type="number" value="${item.max}"></label></div><label>步长<input id="cpNumberStep" type="number" min="0.01" value="${item.step}"></label>${toggleSetting('cpClearable', '是否清空', item.clearable)}${toggleSetting('cpDisabled', '是否禁用', item.disabled)}${toggleSetting('cpRequired', '是否必填', item.required)}${componentBusinessRules(item)}`;
  if (item.componentType === 'Switch') return `<label>控件类型<input value="开关" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.label || '')}"></label><div class="property-two"><label>开启文字<input id="cpOnText" value="${escapeControlText(item.onText)}"></label><label>关闭文字<input id="cpOffText" value="${escapeControlText(item.offText)}"></label></div>${toggleSetting('cpDisabled', '是否禁用', item.disabled)}${toggleSetting('cpRequired', '是否必填', item.required)}${componentBusinessRules(item)}`;
  if (item.componentType === 'PositionPicker' || item.componentType === 'RolePicker') return `<label>控件类型<input value="${confinedTypeName(item)}" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.label || '')}"></label><label>占位提示<input id="cpPlaceholder" value="${escapeControlText(item.placeholder || '')}"></label>${toggleSetting('cpClearable', '是否清空', item.clearable)}${toggleSetting('cpDisabled', '是否禁用', item.disabled)}${toggleSetting('cpRequired', '是否必填', item.required)}${componentBusinessRules(item)}`;
  if (item.componentType === 'SignaturePad') return `<label>控件类型<input value="手写签名" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.label || '')}"></label><label>按钮文字<input id="cpButtonText" value="${escapeControlText(item.buttonText)}"></label>${toggleSetting('cpDisabled', '是否禁用', item.disabled)}${toggleSetting('cpRequired', '是否必填', item.required)}${componentBusinessRules(item)}`;
  return componentPropsBeforePolish(item);
};

const bindPropsBeforePolish = bindConfinedProps;
bindConfinedProps = function () {
  bindPropsBeforePolish();
  const item = ensureConfinedConfig(selectedConfined());
  if (!item) return;
  const update = (key, value) => { rememberConfined(); item[key] = value; renderConfinedDesigner(); };
  [['#cpNumberMin', 'min'], ['#cpNumberMax', 'max'], ['#cpNumberStep', 'step']].forEach(([selector, key]) => document.querySelector(selector)?.addEventListener('change', event => update(key, +event.target.value)));
  document.querySelector('#cpOnText')?.addEventListener('change', event => update('onText', event.target.value));
  document.querySelector('#cpOffText')?.addEventListener('change', event => update('offText', event.target.value));
  document.querySelectorAll('[data-table-column]').forEach(input => input.onchange = () => { item.columns[+input.dataset.tableColumn][1] = input.value.trim() || '未命名列'; update('columns', item.columns); });
  document.querySelectorAll('[data-remove-column]').forEach(button => button.onclick = () => { item.columns.splice(+button.dataset.removeColumn, 1); update('columns', item.columns); });
  document.querySelector('#addTableColumn')?.addEventListener('click', () => { const index = item.columns.length + 1; item.columns.splice(Math.max(1, item.columns.length - 1), 0, [`column${index}`, `新增列${index}`]); update('columns', item.columns); });
};

const fieldBeforePolish = confinedField;
confinedField = function (field, section) {
  ensureConfinedConfig(field);
  if (field.componentType === 'NumberInput') return runtimeField(section, field, `<div class="number-runtime"><button type="button" data-number-step="-1">−</button><input data-runtime-input="${field.fieldKey}" type="number" min="${field.min}" max="${field.max}" step="${field.step}" value="${escapeControlText(field.demoValue || '')}" placeholder="请输入数字" ${field.disabled ? 'disabled' : ''}><button type="button" data-number-step="1">＋</button></div>`);
  if (field.componentType === 'Switch') return runtimeField(section, field, `<button type="button" class="switch-runtime ${field.demoValue ? 'on' : ''}" data-switch-field="${field.fieldKey}" ${field.disabled ? 'disabled' : ''}><i></i><span>${escapeControlText(field.demoValue ? field.onText : field.offText)}</span></button>`);
  if (field.componentType === 'PositionPicker' || field.componentType === 'RolePicker') return runtimeField(section, field, pickerButtonMarkup(field.componentType, field.defaultValue, field.placeholder));
  if (field.componentType === 'SignaturePad') return runtimeField(section, field, `<button type="button" class="signature-runtime" data-signature-field="${field.fieldKey}" ${field.disabled ? 'disabled' : ''}>✍ ${escapeControlText(field.demoValue || field.buttonText)}</button>`);
  if (systemTypes.includes(field.componentType)) {
    const values = { SystemUser: '系统用户', SystemDateTime: '2026-09-09 09:30:00', SystemOrg: '当前所属组织', SystemPosition: '当前所属岗位', SystemCurrentUser: '当前登录用户', SerialNumber: '系统自动生成', SystemStatus: '草稿', SystemApproval: '由审批节点回填' };
    return runtimeField(section, field, `<div class="system-runtime"><span>${values[field.componentType]}</span><small>系统回填</small></div>`);
  }
  if (field.componentType === 'ImageUpload') return runtimeField(section, field, `<label class="image-upload-runtime"><input type="file" accept="image/*" data-runtime-file="${field.fieldKey}" hidden><i>＋</i><span>${escapeControlText(field.demoValue || field.buttonText || '点击上传')}</span></label>`);
  return fieldBeforePolish(field, section);
};

function tableSectionMarkup(section, index) {
  ensureConfinedConfig(section);
  const selected = confinedSelection.kind === 'section' && confinedSelection.sectionId === section.id;
  return `<section class="editable-table-section ${selected ? 'selected' : ''}" data-csection="${section.id}"><div class="editable-table-toolbar"><b>${escapeControlText(section.title)}</b><button class="primary" data-add-table-person="${section.id}">＋ 新增</button>${confinedActions(index)}</div><div class="confined-table"><table><thead><tr>${section.columns.map(column => `<th>${escapeControlText(column[1])}</th>`).join('')}</tr></thead><tbody>${section.rows.length ? section.rows.map((row, rowIndex) => `<tr>${section.columns.map(column => `<td>${column[0] === 'index' ? rowIndex + 1 : column[0] === 'actions' ? `<button data-remove-table-row="${section.id}:${rowIndex}">移除</button>` : escapeControlText(row[column[0]] || '--')}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${section.columns.length}" class="confined-empty-table">${escapeControlText(section.emptyText || '暂无数据')}</td></tr>`}</tbody></table></div></section>`;
}

const sectionBeforePolish = confinedSection;
confinedSection = function (section, index) {
  if (section.componentType === 'EditableTable') return tableSectionMarkup(section, index);
  if (section.componentType === 'RootCanvas') return `<section class="root-canvas-section" data-csection="${section.id}"><div class="confined-grid">${section.children.map(field => confinedField(field, section)).join('')}</div></section>`;
  return sectionBeforePolish(section, index);
};

function makeConfinedField(type) {
  const name = confinedCatalog[type]?.[0] || '控件';
  const field = { fieldKey: `field_${Date.now()}`, label: `新增${name}`, componentType: type, required: false, placeholder: `请配置${name}`, span: 12 };
  if (type === 'Textarea') field.maxLength = 500;
  if (type === 'UserPicker') field.dataSource = 'users';
  if (type === 'OrgPicker') field.dataSource = 'organizations';
  if (type === 'FileUpload' || type === 'ImageUpload') field.multiple = true;
  ensureConfinedConfig(field);
  return field;
}

const addBeforePolish = addConfined;
addConfined = function (type) {
  if (['Section', 'CollapsePanel', 'TabsPanel', 'GridContainer', 'EditableTable'].includes(type)) return addBeforePolish(type);
  rememberConfined(); confinedState = 'normal';
  let section = confinedSchema.sections.find(item => item.id === confinedSelection.sectionId && layoutTypes.includes(item.componentType));
  if (!section) {
    section = confinedSchema.sections.find(item => item.componentType === 'RootCanvas');
    if (!section) { section = { id: `root_${Date.now()}`, title: '', componentType: 'RootCanvas', children: [] }; confinedSchema.sections.push(section); }
  }
  const field = makeConfinedField(type); section.children.push(field);
  confinedSelection = { kind: 'field', sectionId: section.id, fieldKey: field.fieldKey };
  renderConfinedDesigner(); toast(`${confinedCatalog[type][0]}已添加到画布`);
};

const applyPickerBeforePolish = applyPickerValue;
applyPickerValue = function (value) {
  if (activePickerContext?.tableSection) {
    activePickerContext.tableSection.rows.push({ name: value, position: '--', department: '--', organization: '--' });
    renderConfinedDesigner(); return;
  }
  applyPickerBeforePolish(value);
};

const bindBeforePolish = bindConfined;
bindConfined = function () {
  bindBeforePolish();
  const canvas = document.querySelector('#confinedCanvas');
  canvas?.addEventListener('click', event => { if (event.target === canvas) { confinedSelection = { kind: '', sectionId: '' }; renderConfinedDesigner(); } });
  document.querySelectorAll('.root-canvas-section').forEach(root => root.onclick = event => { if (!event.target.closest('[data-cfield]')) { event.stopPropagation(); confinedSelection = { kind: '', sectionId: '' }; renderConfinedDesigner(); } });
  document.querySelectorAll('[data-csection]').forEach(container => {
    const section = confinedSchema.sections.find(item => item.id === container.dataset.csection);
    if (!section || !layoutTypes.includes(section.componentType)) return;
    container.ondragover = event => { event.preventDefault(); event.stopPropagation(); };
    container.ondrop = event => { event.preventDefault(); event.stopPropagation(); const type = event.dataTransfer.getData('confined'); if (!type || layoutTypes.includes(type)) return toast('布局控件之间不支持嵌套'); confinedSelection = { kind: 'section', sectionId: section.id }; addConfined(type); };
  });
  document.querySelectorAll('[data-number-step]').forEach(button => button.onclick = event => { event.stopPropagation(); const input = button.parentElement.querySelector('input'); input.stepUp(+button.dataset.numberStep); input.dispatchEvent(new Event('input')); });
  document.querySelectorAll('[data-switch-field]').forEach(button => button.onclick = event => { event.stopPropagation(); const field = findRuntimeField(button.dataset.switchField); field.demoValue = !field.demoValue; button.classList.toggle('on', field.demoValue); button.querySelector('span').textContent = field.demoValue ? field.onText : field.offText; });
  document.querySelectorAll('[data-signature-field]').forEach(button => button.onclick = event => { event.stopPropagation(); const name = prompt('请输入签字人'); if (!name) return; const field = findRuntimeField(button.dataset.signatureField); field.demoValue = `${name} 已签字`; button.textContent = `✓ ${field.demoValue}`; });
  document.querySelectorAll('[data-add-table-person]').forEach(button => button.onclick = event => { event.stopPropagation(); const section = confinedSchema.sections.find(item => item.id === button.dataset.addTablePerson); activePickerContext = { mode: 'user', canvasIndex: -1, schemaField: null, tableSection: section }; activePickerView = 'quick'; activePickerTab = 0; activePickerValue = ''; renderPickerDialog(); });
  document.querySelectorAll('[data-remove-table-row]').forEach(button => button.onclick = event => { event.stopPropagation(); const [sectionId, rowIndex] = button.dataset.removeTableRow.split(':'); confinedSchema.sections.find(item => item.id === sectionId).rows.splice(+rowIndex, 1); renderConfinedDesigner(); });
};

const renderBeforeScrollPreserve = renderConfinedDesigner;
renderConfinedDesigner = function () {
  const libraryTop = document.querySelector('.confined-library')?.scrollTop || 0;
  const stageTop = document.querySelector('.confined-stage')?.scrollTop || 0;
  renderBeforeScrollPreserve();
  requestAnimationFrame(() => {
    const library = document.querySelector('.confined-library'); if (library) library.scrollTop = libraryTop;
    const stage = document.querySelector('.confined-stage'); if (stage) stage.scrollTop = stageTop;
  });
};
