(function () {
  const typeAliases = {
    '单行输入': 'TextInput', '多行输入': 'Textarea', '数字输入': 'NumberInput', '数字': 'NumberInput',
    '开关': 'Switch', '单选框组': 'RadioGroup', '多选框组': 'CheckboxGroup', '下拉选择': 'Select',
    '级联选择': 'Cascader', '日期选择': 'DateTimePicker', '日期时间': 'DateTimePicker', '时间选择': 'TimePicker',
    '文件上传': 'FileUpload', '图片上传': 'ImageUpload', '组织选择': 'OrgPicker', '部门选择': 'OrgPicker',
    '岗位选择': 'PositionPicker', '用户选择': 'UserPicker', '成员选择': 'UserPicker', '人员选择': 'UserPicker',
    '角色选择': 'RolePicker', '设计子表': 'EditableTable', '明细表格': 'EditableTable', '手写签名': 'SignaturePad',
    '定位': 'LocationPicker', '分组标题': 'Section', '折叠面板': 'CollapsePanel', '标签面板': 'TabsPanel',
    '栅格容器': 'GridContainer', '创建人员': 'SystemUser', '修改人员': 'SystemUser',
    '创建时间': 'SystemDateTime', '修改时间': 'SystemDateTime', '所属组织': 'SystemOrg',
    '所属岗位': 'SystemPosition', '当前用户': 'SystemCurrentUser', '流水号': 'SerialNumber',
    '流程状态': 'SystemStatus', '审批意见': 'SystemApproval'
  };

  function normalizeCanvasControl(control) {
    if (!control) return control;
    control.componentType ||= typeAliases[control.type] || control.type || 'TextInput';
    control.label ??= control.name || confinedTypeName(control);
    control.name ??= control.label;
    control.span ??= control.width === '二分之一' || control.width === '半行' ? 6 : control.width === '三分之一' ? 4 : control.width === '四分之一' ? 3 : 12;
    control.fieldKey ??= `field_${activeControl + 1}`;
    ensureConfinedConfig(control);
    return control;
  }

  function syncCanvasControl(control) {
    if (!control) return;
    control.name = control.label || control.title || control.name;
    control.width = control.span === 6 ? '二分之一' : control.span === 4 ? '三分之一' : control.span === 3 ? '四分之一' : '整行';
  }

  const renderConfinedForUnifiedProperties = renderConfinedDesigner;
  renderConfinedDesigner = function () {
    if (document.querySelector('.interactive-workspace') && !['有限空间作业', '受限空间作业'].includes(state.template?.name)) {
      syncCanvasControl(canvasControls[activeControl]);
      return renderFormBuildStep();
    }
    return renderConfinedForUnifiedProperties();
  };

  function unifiedTabs() {
    return `<div class="attribute-tabs confined-property-tabs"><button data-property-tab="component" class="${activePropertyTab === 'component' ? 'active' : ''}">组件属性</button><button data-property-tab="style" class="${activePropertyTab === 'style' ? 'active' : ''}">组件样式</button><button data-property-tab="form" class="${activePropertyTab === 'form' ? 'active' : ''}">表单属性</button></div>`;
  }

  function compatibilityFields(control) {
    const width = control.span === 6 ? '二分之一' : control.span === 4 ? '三分之一' : control.span === 3 ? '四分之一' : '整行';
    return `<div hidden><input id="canvasControlName" value="${escapeControlText(control.label)}"><input id="canvasPlaceholder" value="${escapeControlText(control.placeholder || '')}"><select id="canvasWidth"><option selected>${width}</option></select><input id="canvasRequired" type="checkbox" ${control.required ? 'checked' : ''}></div>`;
  }

  propertyMarkup = function () {
    const control = normalizeCanvasControl(canvasControls[activeControl]);
    if (!control) return `${unifiedTabs()}<div class="properties">请选择画布组件。</div>`;
    const body = activePropertyTab === 'style' ? styleProps(control) : activePropertyTab === 'form' ? formProps() : componentProps(control);
    return `${unifiedTabs()}<div class="properties confined-dynamic-properties">${body}${compatibilityFields(control)}</div>`;
  };

  const bindUnifiedBase = bindInteractiveForm;
  bindInteractiveForm = function () {
    bindUnifiedBase();
    const control = normalizeCanvasControl(canvasControls[activeControl]);
    if (!control) return;
    document.querySelectorAll('[data-property-tab]').forEach(button => button.onclick = () => {
      activePropertyTab = button.dataset.propertyTab;
      renderFormBuildStep();
    });

    const originalSelected = selectedConfined;
    selectedConfined = () => control;
    try { bindConfinedProps(); } finally { selectedConfined = originalSelected; }

    const syncCanvas = () => syncCanvasControl(control);
    document.querySelectorAll('.confined-dynamic-properties input, .confined-dynamic-properties select, .confined-dynamic-properties textarea').forEach(input => {
      if (input.closest('[hidden]')) return;
      input.addEventListener('change', syncCanvas);
      input.addEventListener('input', syncCanvas);
    });
  };
})();
