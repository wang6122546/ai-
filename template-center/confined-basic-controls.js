Object.assign(confinedCatalog, {
  RadioGroup: ['单选框组', '◉', 'basic'],
  CheckboxGroup: ['多选框组', '☑', 'basic'],
  Cascader: ['级联选择', '☷', 'basic'],
  TimePicker: ['时间选择', '◷', 'basic'],
  ImageUpload: ['图片上传', '▧', 'basic']
});

const baseEnsureBasicControls = ensureConfinedConfig;
ensureConfinedConfig = function (item) {
  baseEnsureBasicControls(item);
  if (!item) return item;
  item.defaultValue ??= item.componentType === 'CheckboxGroup' ? [] : '';
  item.direction ??= '水平排列';
  item.timeFormat ??= 'HH:mm:ss';
  item.buttonText ??= item.componentType === 'ImageUpload' ? '上传图片' : '点击上传';
  item.uploadHint ??= '';
  item.fileTypes ??= item.componentType === 'ImageUpload' ? ['JPG', 'PNG'] : ['PDF', 'DOC', 'DOCX'];
  item.fileSize ??= 10;
  item.maxFiles ??= 1;
  item.cascadeNodes ??= [{ id: 'root-1', label: '选项1', children: [{ id: 'child-1', label: '选项1-1', children: [] }] }];
  return item;
};

function optionSourcePanel(item, tree = false) {
  const tabs = [['static', '静态数据'], ['dictionary', '数据字典'], ['api', '数据接口']];
  let content;
  if (item.optionSource === 'dictionary') content = `<label>数据字典<input id="cpDictionary" value="${escapeControlText(item.dictionary)}" placeholder="请选择数据字典"></label>`;
  else if (item.optionSource === 'api') content = `<label>接口地址<input id="cpApiUrl" value="${escapeControlText(item.apiUrl)}" placeholder="请输入数据接口"></label>`;
  else if (tree) content = `<div class="cascade-tree">${renderCascadeNodes(item.cascadeNodes)}</div><button class="secondary cascade-add-root" type="button">＋ 添加父级</button>`;
  else content = `<label>静态选项<textarea id="cpStaticOptions" rows="4">${escapeControlText(item.staticOptions)}</textarea></label>`;
  return `<div class="option-source"><b>数据选项</b><div>${tabs.map(([key, label]) => `<button data-option-source="${key}" class="${item.optionSource === key ? 'active' : ''}">${label}</button>`).join('')}</div>${content}</div>`;
}

function choiceProps(item, multiple) {
  const values = item.staticOptions.split('\n').filter(Boolean);
  const defaultControl = multiple
    ? `<div class="choice-defaults">${values.map(value => `<label><input type="checkbox" data-choice-default="${escapeControlText(value)}" ${item.defaultValue.includes(value) ? 'checked' : ''}>${escapeControlText(value)}</label>`).join('')}</div>`
    : `<select id="cpDefaultValue"><option value="">请选择</option>${values.map(value => `<option ${item.defaultValue === value ? 'selected' : ''}>${escapeControlText(value)}</option>`).join('')}</select>`;
  return `<label>控件类型<input value="${multiple ? '多选框组' : '单选框组'}" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.label || '')}"></label><label>默认值${defaultControl}</label><label>排列方式<div class="segmented">${['水平排列', '垂直排列'].map(value => `<button data-choice-direction="${value}" class="${item.direction === value ? 'active' : ''}">${value}</button>`).join('')}</div></label>${optionSourcePanel(item)}${toggleSetting('cpDisabled', '是否禁用', item.disabled)}${toggleSetting('cpRequired', '是否必填', item.required)}`;
}

function renderCascadeNodes(nodes, depth = 0) {
  return nodes.map(node => `<div class="cascade-node" style="--depth:${depth}" data-node-id="${node.id}"><span>${escapeControlText(node.label)}</span><button data-cascade-add="${node.id}" title="添加子级">＋</button><button data-cascade-edit="${node.id}" title="编辑">✎</button><button data-cascade-delete="${node.id}" title="删除">×</button></div>${renderCascadeNodes(node.children || [], depth + 1)}`).join('');
}

function cascaderProps(item) {
  return `${basicHead(item)}<label>占位提示<input id="cpPlaceholder" value="${escapeControlText(item.placeholder || '')}"></label>${optionSourcePanel(item, true)}${toggleSetting('cpClearable', '能否清空', item.clearable)}${toggleSetting('cpSearchable', '能否搜索', item.searchable)}${toggleSetting('cpMultiple', '能否多选', item.multiple)}${toggleSetting('cpDisabled', '是否禁用', item.disabled)}${toggleSetting('cpRequired', '是否必填', item.required)}`;
}

function timeProps(item) {
  return `${basicHead(item)}<label>占位提示<input id="cpPlaceholder" value="${escapeControlText(item.placeholder || '')}"></label><label>格式<select id="cpTimeFormat">${['HH:mm:ss', 'HH:mm'].map(value => `<option ${item.timeFormat === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label><div class="date-format-demo">展示：${item.timeFormat === 'HH:mm' ? '14:30' : '14:30:45'}</div>${toggleSetting('cpCurrentTime', '默认为当前系统时间', item.currentTime)}${commonTail(item)}`;
}

function uploadProps(item, image) {
  const types = image ? ['JPG', 'PNG', 'GIF', 'WEBP'] : ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'ZIP'];
  return `<label>控件类型<input value="${image ? '图片上传' : '文件上传'}" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.label || '')}"></label><label>按钮文字<input id="cpButtonText" value="${escapeControlText(item.buttonText)}"></label><label>上传提示<input id="cpUploadHint" value="${escapeControlText(item.uploadHint)}" placeholder="请输入上传说明"></label><label>文件类型<div class="file-type-grid">${types.map(type => `<label><input type="checkbox" data-file-type="${type}" ${item.fileTypes.includes(type) ? 'checked' : ''}>${type}</label>`).join('')}</div></label><label>文件大小<div class="input-suffix"><input id="cpFileSize" type="number" min="1" value="${item.fileSize}"><span>MB</span></div></label><label>最大上传数<input id="cpMaxFiles" type="number" min="1" max="5" value="${item.maxFiles}"></label>${toggleSetting('cpDisabled', '是否禁用', item.disabled)}${toggleSetting('cpRequired', '是否必填', item.required)}`;
}

const baseComponentPropsForBasic = componentProps;
componentProps = function (item) {
  ensureConfinedConfig(item);
  if (item.componentType === 'RadioGroup') return choiceProps(item, false);
  if (item.componentType === 'CheckboxGroup') return choiceProps(item, true);
  if (item.componentType === 'Cascader') return cascaderProps(item);
  if (item.componentType === 'TimePicker') return timeProps(item);
  if (item.componentType === 'FileUpload') return uploadProps(item, false);
  if (item.componentType === 'ImageUpload') return uploadProps(item, true);
  return baseComponentPropsForBasic(item);
};

function walkCascade(nodes, id, action) {
  for (const node of nodes) {
    if (node.id === id) return action(node, nodes);
    if (walkCascade(node.children || [], id, action)) return true;
  }
  return false;
}

const baseBindPropsForBasic = bindConfinedProps;
bindConfinedProps = function () {
  baseBindPropsForBasic();
  const item = ensureConfinedConfig(selectedConfined());
  if (!item) return;
  const update = (key, value) => { rememberConfined(); item[key] = value; renderConfinedDesigner(); };
  document.querySelector('#cpDefaultValue')?.addEventListener('change', event => update('defaultValue', event.target.value));
  document.querySelectorAll('[data-choice-default]').forEach(input => input.onchange = () => update('defaultValue', [...document.querySelectorAll('[data-choice-default]:checked')].map(node => node.dataset.choiceDefault)));
  document.querySelectorAll('[data-choice-direction]').forEach(button => button.onclick = () => update('direction', button.dataset.choiceDirection));
  document.querySelector('#cpTimeFormat')?.addEventListener('change', event => update('timeFormat', event.target.value));
  document.querySelector('#cpButtonText')?.addEventListener('change', event => update('buttonText', event.target.value));
  document.querySelector('#cpUploadHint')?.addEventListener('change', event => update('uploadHint', event.target.value));
  document.querySelector('#cpFileSize')?.addEventListener('change', event => update('fileSize', Math.max(1, +event.target.value || 1)));
  document.querySelector('#cpMaxFiles')?.addEventListener('change', event => update('maxFiles', Math.max(1, Math.min(5, +event.target.value || 1))));
  document.querySelectorAll('[data-file-type]').forEach(input => input.onchange = () => update('fileTypes', [...document.querySelectorAll('[data-file-type]:checked')].map(node => node.dataset.fileType)));
  document.querySelector('.cascade-add-root')?.addEventListener('click', () => { item.cascadeNodes.push({ id: `node-${Date.now()}`, label: `父级${item.cascadeNodes.length + 1}`, children: [] }); update('cascadeNodes', item.cascadeNodes); });
  document.querySelectorAll('[data-cascade-add]').forEach(button => button.onclick = () => { walkCascade(item.cascadeNodes, button.dataset.cascadeAdd, node => { node.children.push({ id: `node-${Date.now()}`, label: '新子级', children: [] }); return true; }); update('cascadeNodes', item.cascadeNodes); });
  document.querySelectorAll('[data-cascade-edit]').forEach(button => button.onclick = () => { const label = prompt('请输入节点名称'); if (!label) return; walkCascade(item.cascadeNodes, button.dataset.cascadeEdit, node => { node.label = label; return true; }); update('cascadeNodes', item.cascadeNodes); });
  document.querySelectorAll('[data-cascade-delete]').forEach(button => button.onclick = () => { walkCascade(item.cascadeNodes, button.dataset.cascadeDelete, (node, list) => { list.splice(list.indexOf(node), 1); return true; }); update('cascadeNodes', item.cascadeNodes); });
};

const baseConfinedFieldForBasic = confinedField;
confinedField = function (field, section) {
  ensureConfinedConfig(field);
  let html = baseConfinedFieldForBasic(field, section);
  if (field.componentType === 'RadioGroup' || field.componentType === 'CheckboxGroup') {
    const inputType = field.componentType === 'RadioGroup' ? 'radio' : 'checkbox';
    const options = field.staticOptions.split('\n').filter(Boolean).map(value => `<label><input type="${inputType}" disabled>${escapeControlText(value)}</label>`).join('');
    html = html.replace(/<div class="confined-input">[\s\S]*?<\/div>/, `<div class="choice-preview ${field.direction === '垂直排列' ? 'vertical' : ''}">${options}</div>`);
  }
  if (field.componentType === 'Cascader') html = html.replace(field.placeholder, `${field.placeholder}　⌄`);
  if (field.componentType === 'TimePicker') html = html.replace(field.placeholder, field.currentTime ? (field.timeFormat === 'HH:mm' ? '14:30' : '14:30:45') : field.placeholder);
  if (field.componentType === 'FileUpload' || field.componentType === 'ImageUpload') html = html.replace(/<div class="confined-(?:upload|input)">[\s\S]*?<\/div>/, `<div class="confined-upload"><button>${escapeControlText(field.buttonText)}</button><span>${escapeControlText(field.uploadHint || `最多上传${field.maxFiles}个，单个不超过${field.fileSize}MB`)}</span></div>`);
  return html;
};
