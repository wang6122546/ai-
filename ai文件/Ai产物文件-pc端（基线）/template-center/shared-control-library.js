(function () {
  const storageKey = 'workControlSharedSchemasV1';
  let workContext = null;
  let previousConfined = null;

  function readSchemas() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (error) { return {}; }
  }

  function writeSchemas(schemas) {
    localStorage.setItem(storageKey, JSON.stringify(schemas));
  }

  function makeSharedSchema(item) {
    const saved = readSchemas()[item.id];
    if (saved?.sections) return normalizeConfined(cloneConfined(saved));
    const legacy = ensureWorkControlSchema(item);
    return normalizeConfined({
      id: `work-control-${item.id}`,
      name: item.name,
      version: 2,
      sections: [{
        id: `root-${item.id}`,
        title: '',
        componentType: 'RootCanvas',
        children: legacy.map((component, index) => ({
          fieldKey: component.id || `${item.id}-${index + 1}`,
          label: component.label,
          componentType: component.type,
          placeholder: component.placeholder || `请配置${component.label}`,
          required: Boolean(component.required),
          disabled: Boolean(component.disabled),
          span: 12
        }))
      }]
    });
  }

  function allFieldLabels(schema) {
    return schema.sections.flatMap(section => section.children || []).map(field => field.label).filter(Boolean);
  }

  function restoreConfinedDesigner() {
    if (previousConfined) {
      confinedSchema = previousConfined.schema;
      confinedSelection = previousConfined.selection;
      confinedHistory = previousConfined.history;
      confinedState = previousConfined.state;
    }
    workContext = null;
    previousConfined = null;
  }

  function saveSharedControl() {
    if (!workContext) return;
    const schemas = readSchemas();
    confinedSchema.name = workContext.item.name;
    schemas[workContext.item.id] = cloneConfined(confinedSchema);
    writeSchemas(schemas);
    workContext.item.fields = allFieldLabels(confinedSchema).join('、') || '待配置';
    workContext.item.updated = new Date().toISOString().slice(0, 10);
    saveConfiguredControls();
    toast('作业控件已保存，控件配置与受限空间控件库保持一致');
  }

  function decorateSharedEditor() {
    if (!workContext) return;
    title.textContent = `${workContext.item.name} · 控件设计`;
    subtitle.textContent = '左侧选择通用组件，中间查看展示内容，右侧配置当前组件属性';
    document.querySelector('.confined-template b').textContent = workContext.item.name;
    const steps = document.querySelector('.confined-steps');
    if (steps) steps.remove();
    document.querySelector('.confined-top')?.classList.add('work-control-top');
    const topActions = document.querySelector('.confined-top > .actions');
    if (topActions) topActions.style.gridColumn = '3';
    const back = document.querySelector('#backConfined');
    const close = document.querySelector('#closeConfined');
    const save = document.querySelector('#saveConfined');
    if (back) {
      back.textContent = '← 返回作业控件库';
      back.onclick = () => { restoreConfinedDesigner(); renderConfiguredControlLibrary(); };
    }
    if (close) close.onclick = () => { restoreConfinedDesigner(); renderConfiguredControlLibrary(); };
    if (save) save.onclick = saveSharedControl;
  }

  const renderSharedBase = renderConfinedDesigner;
  renderConfinedDesigner = function () {
    renderSharedBase();
    decorateSharedEditor();
  };

  openConfiguredControlEditor = function (id) {
    const item = configuredControls.find(control => control.id === id);
    if (!item) return;
    if (!workContext) {
      previousConfined = {
        schema: confinedSchema,
        selection: confinedSelection,
        history: confinedHistory,
        state: confinedState
      };
    }
    workContext = { item };
    confinedSchema = makeSharedSchema(item);
    const firstSection = confinedSchema.sections[0];
    const firstField = firstSection?.children?.[0];
    confinedSelection = firstField
      ? { kind: 'field', sectionId: firstSection.id, fieldKey: firstField.fieldKey }
      : { kind: firstSection ? 'section' : '', sectionId: firstSection?.id || '' };
    confinedHistory = [];
    confinedState = confinedSchema.sections.length ? 'normal' : 'empty';
    renderConfinedDesigner();
  };
})();
