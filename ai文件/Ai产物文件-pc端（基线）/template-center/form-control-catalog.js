(function () {
  const definitions = [
    ['基础控件', 'basic', [
      ['单行输入', 'TextInput', '▣'], ['多行输入', 'Textarea', '▤'], ['数字输入', 'NumberInput', '123'],
      ['开关', 'Switch', '◉'], ['单选框组', 'RadioGroup', '◉'], ['多选框组', 'CheckboxGroup', '☑'],
      ['下拉选择', 'Select', '⌄'], ['级联选择', 'Cascader', '☷'], ['日期选择', 'DateTimePicker', '▣'],
      ['时间选择', 'TimePicker', '◷'], ['文件上传', 'FileUpload', '⇧'], ['图片上传', 'ImageUpload', '▧']
    ]],
    ['高级控件', 'advanced', [
      ['组织选择', 'OrgPicker', '▦'], ['岗位选择', 'PositionPicker', '♟'], ['用户选择', 'UserPicker', '♙'],
      ['角色选择', 'RolePicker', '♧'], ['设计子表', 'EditableTable', '▤'], ['手写签名', 'SignaturePad', '✍'],
      ['定位', 'LocationPicker', '⌖']
    ]],
    ['系统控件', 'system', [
      ['创建人员', 'SystemUser', '♙'], ['创建时间', 'SystemDateTime', '◷'], ['修改人员', 'SystemUser', '♙'],
      ['修改时间', 'SystemDateTime', '◷'], ['所属组织', 'SystemOrg', '▦'], ['所属岗位', 'SystemPosition', '♟'],
      ['当前用户', 'SystemCurrentUser', '♙'], ['流水号', 'SerialNumber', '№'], ['流程状态', 'SystemStatus', '⌄'], ['审批意见', 'SystemApproval', '▤']
    ]],
    ['布局控件', 'layout', [
      ['分组标题', 'Section', '▤'], ['折叠面板', 'CollapsePanel', '⌄'], ['标签面板', 'TabsPanel', '▥'], ['栅格容器', 'GridContainer', '▦']
    ]]
  ];

  window.formControlCatalog = definitions.map(([label, key, controls]) => ({
    label,
    key,
    controls: controls.map(([name, componentType, icon]) => ({ name, componentType, icon }))
  }));
})();
