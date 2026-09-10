Object.assign(confinedCatalog, {
  CollapsePanel: ['折叠面板', '⌄', 'layout'],
  TabsPanel: ['标签面板', '▥', 'layout'],
  GridContainer: ['栅格容器', '▦', 'layout']
});

let confinedRulePreview = false;
const layoutTypes = ['CollapsePanel', 'TabsPanel', 'GridContainer'];

const ensureBeforeRules = ensureConfinedConfig;
ensureConfinedConfig = function (item) {
  ensureBeforeRules(item);
  if (!item) return item;
  item.visibilityRule ??= 'always';
  item.validationRule ??= item.required ? 'required' : 'none';
  if (item.componentType === 'CollapsePanel') item.expanded ??= true;
  if (item.componentType === 'TabsPanel') { item.tabs ??= ['标签1', '标签2']; item.activeTab ??= 0; }
  if (item.componentType === 'GridContainer') { item.columns ??= 2; item.gap ??= 12; }
  return item;
};

confinedTabs = function () {
  return `<div class="attribute-tabs confined-property-tabs"><button data-cprop-tab="component" class="${confinedPropertyTab === 'component' ? 'active' : ''}">组件属性</button><button data-cprop-tab="style" class="${confinedPropertyTab === 'style' ? 'active' : ''}">组件样式</button><button data-cprop-tab="form" class="${confinedPropertyTab === 'form' ? 'active' : ''}">表单属性</button></div>`;
};

function componentBusinessRules(item) {
  return `<div class="component-rule-block"><b>业务规则</b><p>以下规则只作用于当前组件。</p><label>显示条件<select id="cpVisibilityRule"><option value="always" ${item.visibilityRule === 'always' ? 'selected' : ''}>始终显示</option><option value="hasValue" ${item.visibilityRule === 'hasValue' ? 'selected' : ''}>有值时显示</option><option value="empty" ${item.visibilityRule === 'empty' ? 'selected' : ''}>无值时显示</option><option value="hidden" ${item.visibilityRule === 'hidden' ? 'selected' : ''}>始终隐藏</option></select><small>控制运行表单是否展示当前组件；设计画布始终保留，并显示规则标记。</small></label><label>校验规则<select id="cpValidationRule"><option value="none" ${item.validationRule === 'none' ? 'selected' : ''}>不校验</option><option value="required" ${item.validationRule === 'required' ? 'selected' : ''}>必填校验</option><option value="length" ${item.validationRule === 'length' ? 'selected' : ''}>长度校验</option></select><small>点击提交按钮时执行；不通过会阻止提交，并提示对应组件。</small></label></div>`;
}

function layoutComponentProps(item) {
  const head = `<label>控件类型<input value="${confinedCatalog[item.componentType][0]}" readonly disabled></label><label>控件标题<input id="cpLabel" value="${escapeControlText(item.title)}"></label>`;
  if (item.componentType === 'CollapsePanel') return `${head}${toggleSetting('cpExpanded', '默认展开', item.expanded)}`;
  if (item.componentType === 'TabsPanel') return `${head}<label>标签名称<textarea id="cpTabs" rows="4">${escapeControlText(item.tabs.join('\n'))}</textarea><small>每行一个标签，至少保留一个。</small></label>`;
  return `${head}<label>每行列数<select id="cpGridColumns">${[2, 3, 4].map(value => `<option value="${value}" ${item.columns === value ? 'selected' : ''}>${value} 列</option>`).join('')}</select></label><label>栅格间距<div class="input-suffix"><input id="cpGridGap" type="number" min="0" max="40" value="${item.gap}"><span>px</span></div></label>`;
}

const componentPropsBeforeRules = componentProps;
componentProps = function (item) {
  ensureConfinedConfig(item);
  const body = layoutTypes.includes(item.componentType) ? layoutComponentProps(item) : componentPropsBeforeRules(item);
  return body + componentBusinessRules(item);
};

const bindPropsBeforeRules = bindConfinedProps;
bindConfinedProps = function () {
  bindPropsBeforeRules();
  const item = ensureConfinedConfig(selectedConfined());
  if (!item) return;
  const update = (key, value) => { rememberConfined(); item[key] = value; renderConfinedDesigner(); };
  document.querySelector('#cpVisibilityRule')?.addEventListener('change', event => update('visibilityRule', event.target.value));
  document.querySelector('#cpValidationRule')?.addEventListener('change', event => update('validationRule', event.target.value));
  document.querySelector('#cpExpanded')?.addEventListener('change', event => update('expanded', event.target.checked));
  document.querySelector('#cpTabs')?.addEventListener('change', event => update('tabs', event.target.value.split('\n').map(value => value.trim()).filter(Boolean).slice(0, 8).length ? event.target.value.split('\n').map(value => value.trim()).filter(Boolean).slice(0, 8) : ['标签1']));
  document.querySelector('#cpGridColumns')?.addEventListener('change', event => update('columns', +event.target.value));
  document.querySelector('#cpGridGap')?.addEventListener('change', event => update('gap', Math.max(0, Math.min(40, +event.target.value || 0))));
};

function layoutSectionMarkup(section, index) {
  ensureConfinedConfig(section);
  const selected = confinedSelection.kind === 'section' && confinedSelection.sectionId === section.id;
  const actions = confinedActions(index);
  const children = section.children.map(field => confinedField(field, section)).join('') || '<div class="layout-empty">拖入组件到当前容器</div>';
  if (section.componentType === 'CollapsePanel') return `<section class="confined-section layout-collapse ${selected ? 'selected' : ''}" data-csection="${section.id}"><header><b>${escapeControlText(section.title)}</b><button class="layout-collapse-toggle" data-collapse-section="${section.id}">${section.expanded ? '⌄' : '›'}</button>${actions}</header><div class="confined-grid ${section.expanded ? '' : 'layout-hidden'}">${children}</div></section>`;
  if (section.componentType === 'TabsPanel') return `<section class="confined-section layout-tabs ${selected ? 'selected' : ''}" data-csection="${section.id}"><header><div class="layout-tab-list">${section.tabs.map((tab, tabIndex) => `<button class="${section.activeTab === tabIndex ? 'active' : ''}" data-layout-tab="${section.id}:${tabIndex}">${escapeControlText(tab)}</button>`).join('')}</div>${actions}</header><div class="confined-grid">${children}</div></section>`;
  return `<section class="confined-section layout-grid ${selected ? 'selected' : ''}" data-csection="${section.id}"><header><b>${escapeControlText(section.title)}</b><span>${section.columns}列栅格 · ${section.gap}px间距</span>${actions}</header><div class="confined-grid" style="grid-template-columns:repeat(${section.columns},minmax(0,1fr));gap:${section.gap}px">${children}</div></section>`;
}

const sectionBeforeLayouts = confinedSection;
confinedSection = function (section, index) {
  return layoutTypes.includes(section.componentType) ? layoutSectionMarkup(section, index) : sectionBeforeLayouts(section, index);
};

const addBeforeLayouts = addConfined;
addConfined = function (type) {
  if (!layoutTypes.includes(type)) return addBeforeLayouts(type);
  rememberConfined();
  confinedState = 'normal';
  const id = `layout_${Date.now()}`;
  const names = { CollapsePanel: '折叠面板', TabsPanel: '标签面板', GridContainer: '栅格容器' };
  const section = { id, title: names[type], componentType: type, children: [] };
  ensureConfinedConfig(section);
  confinedSchema.sections.push(section);
  confinedSelection = { kind: 'section', sectionId: id };
  renderConfinedDesigner();
  toast(`${names[type]}已添加到画布`);
};

const bindBeforeLayouts = bindConfined;
bindConfined = function () {
  bindBeforeLayouts();
  document.querySelectorAll('[data-collapse-section]').forEach(button => button.onclick = event => {
    event.stopPropagation();
    const section = confinedSchema.sections.find(item => item.id === button.dataset.collapseSection);
    section.expanded = !section.expanded;
    renderConfinedDesigner();
  });
  document.querySelectorAll('[data-layout-tab]').forEach(button => button.onclick = event => {
    event.stopPropagation();
    const [sectionId, tabIndex] = button.dataset.layoutTab.split(':');
    const section = confinedSchema.sections.find(item => item.id === sectionId);
    section.activeTab = +tabIndex;
    renderConfinedDesigner();
  });
};

function ruleAllowsDisplay(field) {
  const hasValue = Array.isArray(field.demoValue) ? field.demoValue.length > 0 : Boolean(field.demoValue);
  return field.visibilityRule === 'hidden' ? false : field.visibilityRule === 'hasValue' ? hasValue : field.visibilityRule === 'empty' ? !hasValue : true;
}

const fieldBeforeRuleEffects = confinedField;
confinedField = function (field, section) {
  ensureConfinedConfig(field);
  if (confinedRulePreview && !ruleAllowsDisplay(field)) return '';
  let html = fieldBeforeRuleEffects(field, section);
  if (!confinedRulePreview && field.visibilityRule !== 'always') html = html.replace('</article>', `<span class="rule-badge-inline">${field.visibilityRule === 'hidden' ? '运行时隐藏' : field.visibilityRule === 'hasValue' ? '有值显示' : '无值显示'}</span></article>`);
  return html;
};

const previewBeforeRules = openConfinedPreview;
openConfinedPreview = function () {
  confinedRulePreview = true;
  previewBeforeRules();
  confinedRulePreview = false;
  document.querySelector('[data-preview-action="confirm"]')?.addEventListener('click', event => {
    const invalid = confinedSchema.sections.flatMap(section => section.children || []).find(field => ruleAllowsDisplay(field) && field.validationRule === 'required' && !(Array.isArray(field.demoValue) ? field.demoValue.length : field.demoValue));
    if (invalid) { event.preventDefault(); event.stopImmediatePropagation(); toast(`${invalid.label}未填写，无法提交`); }
  }, true);
};
