pickerControlTypes['组织选择'] = { title: '选择组织', button: '选择组织', mode: 'org' };
pickerControlTypes.OrgPicker = { title: '选择组织', button: '选择组织', mode: 'org' };

function pickerIsMultiple() {
  if (activePickerContext?.schemaField) return !!activePickerContext.schemaField.multiple;
  const control = canvasControls?.[activePickerContext?.canvasIndex];
  return !!control?.multiple;
}

function simplePickerTabs(mode) {
  if (mode === 'user') return ['用户', '组织架构', '岗位', '角色', '当前用户'];
  if (mode === 'org') return ['组织架构', '当前组织'];
  if (mode === 'position') return ['岗位', '组织架构'];
  return ['角色', '组织架构'];
}

function simplePickerRows(mode) {
  if (mode === 'user') return pickerOptions.user.quick.map(row => [row[0], row[2]]);
  if (mode === 'org') return pickerOptions.org.tree.map(name => [name.trim(), name.startsWith('　') ? '下级组织' : '组织']);
  return pickerOptions[mode].quick.map(row => [row[0], row[1] || '']);
}

function renderPickerDialog() {
  const mode = activePickerContext.mode;
  const config = Object.values(pickerControlTypes).find(item => item.mode === mode);
  const multiple = pickerIsMultiple();
  const selected = Array.isArray(activePickerValue) ? activePickerValue : activePickerValue ? [activePickerValue] : [];
  const tabs = simplePickerTabs(mode);
  const rows = simplePickerRows(mode);
  document.querySelector('.modal-card').className = 'modal-card picker-dialog simple-picker-dialog';
  document.querySelector('#modalBody').innerHTML = `<div class="picker-heading"><h2>${config.title}</h2><button class="modal-inline-close" id="pickerClose">×</button></div><div class="simple-picker-selected">${selected.length ? selected.map(value => `<span>${escapeControlText(value)} <button data-remove-picked="${escapeControlText(value)}">×</button></span>`).join('') : '<small>暂未选择</small>'}</div><div class="simple-picker-main"><div class="picker-tabs">${tabs.map((tab,index)=>`<button class="${index===activePickerTab?'active':''}" data-picker-tab="${index}">${tab}</button>`).join('')}<input class="picker-search" id="pickerSearch" placeholder="请输入关键词"></div><div class="simple-picker-content"><aside>${mode==='user'?'♧ 全部用户':'⌘ 全部组织'}</aside><div class="simple-picker-list">${rows.map((row,index)=>`<label data-picker-row="${escapeControlText(row[0])}" class="${selected.includes(row[0])?'selected':''}"><span>${mode==='user'?'👤':'⌘'} ${escapeControlText(row[0])}<small>${escapeControlText(row[1])}</small></span><input type="${multiple?'checkbox':'radio'}" name="pickerChoice" ${selected.includes(row[0])?'checked':''}></label>`).join('')}</div></div></div><div class="picker-footer"><button class="ghost" id="pickerCancel">取消</button><button class="primary" id="pickerConfirm">确定</button></div>`;
  openModalShell();
  bindPickerDialog();
}

function bindPickerDialog() {
  const multiple = pickerIsMultiple();
  document.querySelector('#pickerClose').onclick = closeModalShell;
  document.querySelector('#pickerCancel').onclick = closeModalShell;
  document.querySelectorAll('[data-picker-tab]').forEach(button => button.onclick = () => { activePickerTab = +button.dataset.pickerTab; renderPickerDialog(); });
  document.querySelectorAll('[data-picker-row]').forEach(row => row.onclick = event => {
    event.preventDefault();
    const value = row.dataset.pickerRow;
    if (multiple) {
      const values = Array.isArray(activePickerValue) ? [...activePickerValue] : activePickerValue ? [activePickerValue] : [];
      const index = values.indexOf(value);
      if (index >= 0) values.splice(index, 1); else values.push(value);
      activePickerValue = values;
    } else activePickerValue = value;
    renderPickerDialog();
  });
  document.querySelectorAll('[data-remove-picked]').forEach(button => button.onclick = event => {
    event.stopPropagation();
    activePickerValue = (Array.isArray(activePickerValue) ? activePickerValue : []).filter(value => value !== button.dataset.removePicked);
    renderPickerDialog();
  });
  document.querySelector('#pickerSearch').oninput = event => document.querySelectorAll('[data-picker-row]').forEach(row => row.style.display = row.textContent.includes(event.target.value) ? '' : 'none');
  document.querySelector('#pickerConfirm').onclick = () => {
    const values = Array.isArray(activePickerValue) ? activePickerValue : activePickerValue ? [activePickerValue] : [];
    if (!values.length) return toast('请至少选择一项内容');
    const value = multiple ? values.join('、') : values[0];
    applyPickerValue(value);
    closeModalShell();
    toast(`已选择：${value}`);
  };
}

openPickerFromButton = function (button) {
  const mode = button.dataset.openPicker;
  const canvasIndex = Number(button.dataset.pickerIndex);
  let schemaField = null;
  if (button.closest('[data-cfield]')) {
    const [sectionId, fieldKey] = button.closest('[data-cfield]').dataset.cfield.split(':');
    schemaField = confinedSchema.sections.find(section => section.id === sectionId)?.children?.find(field => field.fieldKey === fieldKey);
  }
  activePickerContext = { mode, canvasIndex: Number.isFinite(canvasIndex) ? canvasIndex : -1, schemaField };
  activePickerTab = 0;
  const current = schemaField?.defaultValue || canvasControls?.[canvasIndex]?.defaultValue || '';
  activePickerValue = pickerIsMultiple() ? String(current).split('、').filter(Boolean) : current;
  renderPickerDialog();
};
