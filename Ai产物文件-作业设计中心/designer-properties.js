let activePropertyTab = 'component';
const designerPropertySettings = {
  labelWidth: '130px',
  labelAlign: '左对齐',
  controlSize: '中',
  formName: '作业申请表',
  formLayout: '左右布局',
  fieldGap: '标准',
  validationMessage: '请完成必填项后提交'
};

const propertyTabs = [
  ['component', '组件属性'],
  ['style', '组件样式'],
  ['form', '表单属性'],
  ['rules', '业务规则']
];

function propertyTabsMarkup() {
  return `<div class="attribute-tabs property-tabs">${propertyTabs.map(tab => `<button type="button" class="${activePropertyTab === tab[0] ? 'active' : ''}" data-property-tab="${tab[0]}">${tab[1]}</button>`).join('')}</div>`;
}

function widthOption(value, label, current) {
  const aliases = value === '二分之一' ? ['二分之一', '半行'] : [value];
  return `<option value="${value}" ${aliases.includes(current) ? 'selected' : ''}>${label}</option>`;
}

function componentPropertyMarkup(control) {
  const extra = control.type === '数字输入' ? '<div class="attribute-section"><b>数字配置</b><label>默认值<input type="number" value="0"></label><label>最小值<input type="number" value="0"></label><label>最大值<input type="number" value="100"></label><label>精度<input type="number" value="0"></label><label>前缀<input placeholder="例如：￥"></label><label>后缀<input placeholder="例如：吨"></label></div>' : control.type === '单选框组' || control.type === '多选框组' || control.type === '下拉选择' ? '<div class="attribute-section"><b>选项配置</b><textarea rows="3">选项一\n选项二\n选项三</textarea><label class="inline-choice"><input type="checkbox" checked> 允许新增选项</label></div>' : control.type === '图片上传' || control.type === '文件上传' ? '<div class="attribute-section"><b>上传配置</b><label>数量上限<input type="number" value="5"></label><label>文件大小上限<select><option>10MB</option><option>20MB</option></select></label></div>' : control.type === '手写签名' || control.type === '电子签章' ? '<div class="attribute-section"><b>签名配置</b><label>签名方式<select><option>手写签名</option><option>印章签署</option></select></label><label class="inline-choice"><input type="checkbox" checked> 记录签名时间</label></div>' : control.type === '气体检测' ? '<div class="attribute-section"><b>检测配置</b><label>检测项目<select><option>氧气含量</option><option>可燃气体</option><option>有毒气体</option></select></label><label>检测频次<select><option>首次检测</option><option>重复检测</option></select></label></div>' : '';
  return `<div class="attribute-body"><div class="attribute-help">配置当前选中字段。控件类型由控件库决定，添加后不可更改；如需换类型，请删除后重新添加。</div><label>控件类型<select class="disabled-select" disabled aria-label="控件类型（不可修改）"><option>${control.type}</option></select></label><label>字段标题<input id="canvasControlName" value="${control.name}"></label><label>提示文字<input id="canvasPlaceholder" value="${control.placeholder}" ${control.readonly ? 'readonly' : ''}></label><label>占用宽度<select id="canvasWidth">${widthOption('整行', '整行（100%）', control.width)}${widthOption('二分之一', '二分之一（50%）', control.width)}${widthOption('三分之一', '三分之一（33.33%）', control.width)}${widthOption('四分之一', '四分之一（25%）', control.width)}</select></label>${extra}<div class="attribute-section"><label class="inline-choice"><input type="checkbox" id="canvasRequired" ${control.required ? 'checked' : ''} ${control.readonly ? 'disabled' : ''}> 必填字段</label><label class="inline-choice"><input type="checkbox" checked> 在审批详情中显示</label><label class="inline-choice"><input type="checkbox" checked> 移动端显示</label><label class="inline-choice"><input type="checkbox" checked> 提交前校验</label></div><div class="property-help">字段编码：field_${activeControl + 1} · 字段权限默认值在“模板与数据”中设置，流程节点可覆盖。</div></div>`;
}

function componentStyleMarkup() {
  return `<div class="attribute-body"><div class="attribute-help">只影响当前组件的展示效果，不改变字段含义和数据库映射。</div><div class="attribute-section"><b>标题样式</b><label>标题宽度<select id="styleLabelWidth"><option ${designerPropertySettings.labelWidth === '100px' ? 'selected' : ''}>100px</option><option ${designerPropertySettings.labelWidth === '130px' ? 'selected' : ''}>130px</option><option ${designerPropertySettings.labelWidth === '160px' ? 'selected' : ''}>160px</option><option>自适应</option></select></label><label>标题对齐<select id="styleLabelAlign"><option>左对齐</option><option>右对齐</option><option>顶部对齐</option></select></label></div><div class="attribute-section"><b>控件外观</b><label>控件尺寸<select id="styleControlSize"><option>小</option><option selected>中</option><option>大</option></select></label><label>边框样式<select><option>默认边框</option><option>弱化边框</option><option>无边框</option></select></label><label>背景颜色<input type="color" value="#ffffff"></label></div><div class="attribute-actions"><button class="primary" id="saveComponentStyle">应用组件样式</button></div></div>`;
}

function formPropertyMarkup() {
  return `<div class="attribute-body"><div class="attribute-help">作用于当前模板整张表单，包括全部分组和字段。</div><label>表单名称<input id="formPropertyName" value="${designerPropertySettings.formName}"></label><label>标题布局<select id="formPropertyLayout"><option>左右布局</option><option>上下布局</option></select></label><label>字段间距<select id="formFieldGap"><option>紧凑</option><option selected>标准</option><option>宽松</option></select></label><div class="attribute-section"><b>终端与提交</b><label class="inline-choice"><input type="checkbox" checked> PC 端启用</label><label class="inline-choice"><input type="checkbox" checked> 移动端启用</label><label class="inline-choice"><input type="checkbox" checked> 自动保存草稿</label><label class="inline-choice"><input type="checkbox"> 允许重复提交</label></div><div class="attribute-actions"><button class="primary" id="saveFormProperties">保存表单属性</button></div></div>`;
}

function businessRulesMarkup(control) {
  return `<div class="attribute-body"><div class="attribute-help">配置当前字段的显示、校验和联动规则；整张表单的提交条件也在这里汇总。</div><div class="attribute-section"><b>当前字段规则</b><label>显示条件<select><option>始终显示</option><option>满足条件时显示</option><option>满足条件时隐藏</option></select></label><label>数据校验<select><option>${control.required ? '必填校验' : '不校验'}</option><option>数字范围</option><option>文本长度</option><option>自定义表达式</option></select></label><label>校验提示<input id="validationMessage" value="${designerPropertySettings.validationMessage}"></label><label>值变化时<select><option>不触发联动</option><option>更新关联字段</option><option>重新计算风险等级</option><option>调用数据源查询</option></select></label></div><div class="attribute-section"><b>表单提交规则</b><div class="rule-row"><b>必填项全部通过</b><span>阻止缺少必要信息的申请进入流程</span></div><div class="rule-row"><b>作业计划有效</b><span>计划已过期时禁止提交</span></div><div class="rule-row"><b>作业区域无冲突</b><span>存在冲突时提示或转入交叉作业审批</span></div><label class="inline-choice"><input type="checkbox"> 提交时自动校验人员资质</label></div><div class="attribute-actions"><button class="primary" id="saveBusinessRules">保存业务规则</button></div></div>`;
}

propertyMarkup = function() {
  const control = canvasControls[activeControl];
  if (!control) return `${propertyTabsMarkup()}<div class="empty-properties">请从左侧添加并选择一个控件</div>`;
  const body = activePropertyTab === 'style' ? componentStyleMarkup() : activePropertyTab === 'form' ? formPropertyMarkup() : activePropertyTab === 'rules' ? businessRulesMarkup(control) : componentPropertyMarkup(control);
  return propertyTabsMarkup() + body;
};

canvasMarkup = function() {
  const widthClasses = {
    '整行': 'width-full',
    '半行': 'width-half',
    '二分之一': 'width-half',
    '三分之一': 'width-third',
    '四分之一': 'width-quarter'
  };
  return canvasControls.map((control, index) => `<div class="stage-block control-item ${index === activeControl ? 'selected' : ''} ${widthClasses[control.width] || 'width-full'}" draggable="true" data-canvas-control="${index}"><div class="control-actions"><button data-move-up="${index}">↑</button><button data-copy-control="${index}">复制</button><button data-delete-control="${index}">删除</button></div>${controlPreview(control)}</div>`).join('');
};

defaultPermissionView = function() {
  const permissionFields = canvasControls.filter(control => control.group !== 'layout').map((control, index) => ({
    name: control.name,
    type: control.type,
    code: `field_${index + 1}`,
    system: control.group === 'system' || control.readonly
  }));
  return `<div class="resource-card settings-card"><div class="settings-heading"><span class="heading-icon">⊙</span><div><h2>模板字段默认权限</h2><p>作用于当前模板全部表单板块中的业务字段，不是单个板块权限；具体流程节点仍可覆盖为隐藏、只读、可填写或必填。</p></div></div><table class="resource-table permission-defaults"><thead><tr><th>字段</th><th>字段编码</th><th>类型</th><th>新建时</th><th>流程中</th><th>归档后</th></tr></thead><tbody>${permissionFields.map((field, index) => `<tr><td><b>${field.name}</b>${field.system ? '<small>系统字段</small>' : ''}</td><td>${field.code}</td><td>${field.type}</td><td>${field.system ? '<select disabled><option>只读</option></select>' : `<select data-default-permission="${index}-create"><option>可填写</option><option>只读</option><option>隐藏</option></select>`}</td><td>${field.system ? '<select disabled><option>只读</option></select>' : `<select data-default-permission="${index}-flow"><option>按节点配置</option><option>只读</option><option>隐藏</option></select>`}</td><td><span class="read-only-state">只读</span></td></tr>`).join('')}</tbody></table><div class="settings-footer"><span>提示：系统字段保持只读；进入流程设计后，可再配置每个节点的业务字段权限。</span><button class="primary" id="savePermissions">保存默认权限</button></div></div>`;
};

const bindInteractiveFormBeforeProperties = bindInteractiveForm;
bindInteractiveForm = function() {
  bindInteractiveFormBeforeProperties();
  document.querySelectorAll('[data-property-tab]').forEach(button => button.onclick = () => {
    activePropertyTab = button.dataset.propertyTab;
    renderFormBuildStep();
  });
  document.querySelector('#saveComponentStyle')?.addEventListener('click', () => {
    designerPropertySettings.labelWidth = document.querySelector('#styleLabelWidth').value;
    designerPropertySettings.labelAlign = document.querySelector('#styleLabelAlign').value;
    designerPropertySettings.controlSize = document.querySelector('#styleControlSize').value;
    toast('组件样式已应用');
  });
  document.querySelector('#saveFormProperties')?.addEventListener('click', () => {
    designerPropertySettings.formName = document.querySelector('#formPropertyName').value.trim() || designerPropertySettings.formName;
    designerPropertySettings.formLayout = document.querySelector('#formPropertyLayout').value;
    designerPropertySettings.fieldGap = document.querySelector('#formFieldGap').value;
    toast('表单属性已保存');
  });
  document.querySelector('#saveBusinessRules')?.addEventListener('click', () => {
    designerPropertySettings.validationMessage = document.querySelector('#validationMessage').value.trim();
    toast('业务规则已保存，将在预览和流程测试中生效');
  });
};
