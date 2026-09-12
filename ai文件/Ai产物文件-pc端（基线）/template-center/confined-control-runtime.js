function runtimeField(section, field, control) {
  const selected = confinedSelection.kind === 'field' && confinedSelection.fieldKey === field.fieldKey;
  const labelAlign = confinedFormConfig.labelAlign === '右对齐' ? 'right' : 'left';
  const topClass = confinedFormConfig.labelAlign === '顶部对齐' ? ' label-top' : '';
  return `<article class="confined-field span-${field.span || 12}${topClass} ${selected ? 'selected' : ''} ${field.readonly ? 'is-readonly' : ''} ${field.disabled ? 'is-disabled' : ''}" style="grid-template-columns:${field.labelWidth}% ${field.controlWidth}%" data-cfield="${section.id}:${field.fieldKey}">${confinedActions(confinedSchema.sections.indexOf(section), section.children.indexOf(field))}<label style="text-align:${labelAlign}">${field.required ? '<i>*</i>' : ''}${escapeControlText(field.label)}${escapeControlText(confinedFormConfig.titleSuffix)}</label>${control}</article>`;
}

const confinedFieldBeforeRuntime = confinedField;
confinedField = function (field, section) {
  ensureConfinedConfig(field);
  const value = escapeControlText(field.demoValue || '');
  const disabled = field.disabled ? 'disabled' : '';
  const readonly = field.readonly ? 'readonly' : '';
  if (field.componentType === 'TextInput') {
    const prefix = field.prefix ? `<em>${escapeControlText(field.prefix)}</em>` : '';
    const suffix = field.suffix ? `<em>${escapeControlText(field.suffix)}</em>` : '';
    return runtimeField(section, field, `<div class="confined-input runtime-text-input ${value ? 'has-value' : ''}">${prefix}<input data-runtime-input="${field.fieldKey}" value="${value}" placeholder="${escapeControlText(field.placeholder || '')}" maxlength="${field.maxLength}" ${readonly} ${disabled}>${field.clearable ? '<button class="runtime-clear" type="button" aria-label="清空">×</button>' : ''}${suffix}</div>`);
  }
  if (field.componentType === 'Textarea') {
    return runtimeField(section, field, `<div class="runtime-textarea-wrap ${value ? 'has-value' : ''}"><textarea data-runtime-input="${field.fieldKey}" rows="${field.rows}" maxlength="${field.maxLength}" placeholder="${escapeControlText(field.placeholder || '')}" ${readonly} ${disabled}>${value}</textarea>${field.clearable ? '<button class="runtime-clear" type="button" aria-label="清空">×</button>' : ''}${field.showCount ? `<small data-runtime-count>${(field.demoValue || '').length}/${field.maxLength}</small>` : ''}</div>`);
  }
  if (field.componentType === 'RadioGroup' || field.componentType === 'CheckboxGroup') {
    const inputType = field.componentType === 'RadioGroup' ? 'radio' : 'checkbox';
    const values = Array.isArray(field.demoValue) ? field.demoValue : [field.demoValue];
    const options = (field.staticOptions || '选项一\n选项二').split('\n').filter(Boolean).map(option => `<label><input type="${inputType}" name="choice-${field.fieldKey}" value="${escapeControlText(option)}" data-runtime-choice="${field.fieldKey}" ${values.includes(option) ? 'checked' : ''} ${disabled}>${escapeControlText(option)}</label>`).join('');
    return runtimeField(section, field, `<div class="choice-preview ${field.direction === '垂直排列' ? 'vertical' : ''}">${options}</div>`);
  }
  if (field.componentType === 'Select' || field.componentType === 'Cascader') {
    const options = (field.staticOptions || '选项一\n选项二').split('\n').filter(Boolean);
    return runtimeField(section, field, `<select data-runtime-input="${field.fieldKey}" ${field.multiple ? 'multiple' : ''} ${disabled}><option value="">${escapeControlText(field.placeholder || '请选择')}</option>${options.map(option => `<option ${field.demoValue === option ? 'selected' : ''}>${escapeControlText(option)}</option>`).join('')}</select>`);
  }
  if (field.componentType === 'DateTimePicker' || field.componentType === 'TimePicker') {
    const type = field.componentType === 'TimePicker' ? 'time' : 'datetime-local';
    const step = (field.timeFormat === 'HH:mm:ss' || field.dateFormat?.includes('ss')) ? '1' : '60';
    return runtimeField(section, field, `<input class="runtime-native-input" data-runtime-input="${field.fieldKey}" type="${type}" step="${step}" value="${value}" ${readonly} ${disabled}>`);
  }
  if (field.componentType === 'FileUpload' || field.componentType === 'ImageUpload') {
    const accept = field.componentType === 'ImageUpload' ? 'image/*' : '';
    return runtimeField(section, field, `<div class="confined-upload runtime-upload"><button type="button" data-runtime-upload="${field.fieldKey}" ${disabled}>${escapeControlText(field.buttonText || '点击上传')}</button><input type="file" data-runtime-file="${field.fieldKey}" accept="${accept}" ${field.maxFiles > 1 ? 'multiple' : ''} hidden><span data-runtime-file-name>${escapeControlText(field.demoValue || field.uploadHint || '未选择文件')}</span></div>`);
  }
  return confinedFieldBeforeRuntime(field, section);
};

function findRuntimeField(fieldKey) {
  for (const section of confinedSchema.sections) {
    const field = section.children?.find(item => item.fieldKey === fieldKey);
    if (field) return field;
  }
}

const bindConfinedBeforeRuntime = bindConfined;
bindConfined = function () {
  bindConfinedBeforeRuntime();
  document.querySelectorAll('[data-runtime-input]').forEach(control => {
    control.onclick = event => event.stopPropagation();
    control.oninput = event => {
      const field = findRuntimeField(control.dataset.runtimeInput);
      if (!field) return;
      field.demoValue = control.value;
      const wrap = control.closest('.runtime-text-input, .runtime-textarea-wrap');
      wrap?.classList.toggle('has-value', Boolean(control.value));
      const count = wrap?.querySelector('[data-runtime-count]');
      if (count) count.textContent = `${control.value.length}/${field.maxLength}`;
    };
  });
  document.querySelectorAll('[data-runtime-choice]').forEach(control => {
    control.onclick = event => event.stopPropagation();
    control.onchange = () => {
      const field = findRuntimeField(control.dataset.runtimeChoice);
      if (!field) return;
      field.demoValue = field.componentType === 'CheckboxGroup'
        ? [...document.querySelectorAll(`[data-runtime-choice="${field.fieldKey}"]:checked`)].map(input => input.value)
        : control.value;
    };
  });
  document.querySelectorAll('.runtime-clear').forEach(button => button.onclick = event => {
    event.stopPropagation();
    const wrap = button.closest('.runtime-text-input, .runtime-textarea-wrap');
    const control = wrap.querySelector('[data-runtime-input]');
    control.value = '';
    control.dispatchEvent(new Event('input', { bubbles: false }));
    control.focus();
  });
  document.querySelectorAll('[data-runtime-upload]').forEach(button => button.onclick = event => {
    event.stopPropagation();
    document.querySelector(`[data-runtime-file="${button.dataset.runtimeUpload}"]`)?.click();
  });
  document.querySelectorAll('[data-runtime-file]').forEach(input => input.onchange = () => {
    const field = findRuntimeField(input.dataset.runtimeFile);
    if (!field) return;
    const files = [...input.files].slice(0, Math.min(5, field.maxFiles || 1));
    field.demoValue = files.map(file => file.name).join('、');
    input.closest('.runtime-upload').querySelector('[data-runtime-file-name]').textContent = field.demoValue || '未选择文件';
  });
};
