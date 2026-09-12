(function () {
  const businessObjects = [
    { id: 'workPermit', name: '作业票', code: 'work_permit_base', role: '主对象', fields: ['作业票ID', '作业类型', '作业状态', '申请人'] },
    { id: 'workPersonDetail', name: '作业人员明细', code: 'work_person_detail', role: '关联对象', fields: ['作业票ID', '人员ID', '岗位ID', '部门ID', '单位ID', '作业内容'] },
    { id: 'specialWorkerDetail', name: '特种作业人员明细', code: 'special_worker_detail', role: '关联对象', fields: ['作业票ID', '人员ID', '部门ID', '单位ID', '资格证ID', '证书名称', '证书编号', '有效期', '证件附件'] },
    { id: 'personArchive', name: '在职人员档案', code: 'employee_archive', role: '关联来源', fields: ['人员ID', '姓名', '岗位ID', '部门ID', '单位ID', '在职状态'] },
    { id: 'qualificationArchive', name: '人员资质档案', code: 'qualification_archive', role: '关联来源', fields: ['资格证ID', '人员ID', '作业类型', '证书名称', '证书编号', '有效期', '证件附件', '证书状态'] }
  ];
  window.templateBoundBusinessObjects = businessObjects;
  const esc = value => escapeControlText(value == null ? '' : String(value));
  const objectById = id => businessObjects.find(x => x.id === id);
  const option = (value, current, label = value) => `<option value="${esc(value)}" ${value === current ? 'selected' : ''}>${esc(label)}</option>`;
  const fieldTypes = ['当前对象字段', '关联对象字段', '字典值', '系统字段', '流程上下文', '计算字段', '固定值', '操作列'];
  const controlTypes = ['文本输入', '数字输入', '人员选择器', '组织选择器', '下拉选择器', '关联数据选择器', '日期选择', '只读文本', '系统序号', '操作按钮'];
  const sourceControls = ['人员选择器', '组织选择器', '下拉选择器', '关联数据选择器'];

  function col(key, name, extra = {}) {
    return Object.assign({ key, name, boundField: '', sourceType: '当前对象字段', controlType: '文本输入', displayValue: name, saveValue: '', sourceObject: '', dataRange: '', filter: '', defaultValue: '', linkage: '', editable: true, required: false, nullHandling: '保留空值', save: true, multiple: false, allowInactive: false }, extra);
  }
  function normalizeColumn(raw) { return Array.isArray(raw) ? col(raw[0], raw[1]) : Object.assign(col(raw.key || `column_${Date.now()}`, raw.name || '未命名列'), raw); }
  function normalColumns() { return [
    col('index', '序号', { sourceType: '系统字段', controlType: '系统序号', displayValue: '行顺序', editable: false, save: false }),
    col('name', '姓名', { boundField: '人员ID', controlType: '人员选择器', displayValue: '姓名', saveValue: '人员ID', sourceObject: 'personArchive', dataRange: '在职人员', filter: '在职状态 = 在职', required: true, linkage: '岗位、部门、单位' }),
    col('position', '岗位', { boundField: '岗位ID', sourceType: '关联对象字段', controlType: '只读文本', displayValue: '岗位名称', saveValue: '岗位ID', sourceObject: 'personArchive', editable: false }),
    col('department', '部门', { boundField: '部门ID', sourceType: '关联对象字段', controlType: '只读文本', displayValue: '部门名称', saveValue: '部门ID', sourceObject: 'personArchive', editable: false }),
    col('organization', '单位', { boundField: '单位ID', sourceType: '关联对象字段', controlType: '只读文本', displayValue: '单位名称', saveValue: '单位ID', sourceObject: 'personArchive', editable: false }),
    col('content', '内容', { boundField: '作业内容', displayValue: '作业内容', saveValue: '作业内容' }),
    col('actions', '操作', { sourceType: '操作列', controlType: '操作按钮', displayValue: '编辑、删除', editable: false, save: false })
  ]; }
  function specialColumns() { return [
    col('index', '序号', { sourceType: '系统字段', controlType: '系统序号', displayValue: '行顺序', editable: false, save: false }),
    col('name', '姓名', { boundField: '人员ID', controlType: '人员选择器', displayValue: '姓名', saveValue: '人员ID', sourceObject: 'personArchive', dataRange: '在职人员', filter: '在职状态 = 在职', required: true, linkage: '部门、单位、资格证' }),
    col('department', '部门', { boundField: '部门ID', sourceType: '关联对象字段', controlType: '只读文本', displayValue: '部门名称', saveValue: '部门ID', sourceObject: 'personArchive', editable: false }),
    col('organization', '单位', { boundField: '单位ID', sourceType: '关联对象字段', controlType: '只读文本', displayValue: '单位名称', saveValue: '单位ID', sourceObject: 'personArchive', editable: false }),
    col('certificateName', '资格证', { boundField: '资格证ID', sourceType: '关联对象字段', controlType: '关联数据选择器', displayValue: '证书名称', saveValue: '资格证ID', sourceObject: 'qualificationArchive', dataRange: '所选人员的证书', filter: '作业类型 = 当前作业类型 且 有效期 ≥ 当前日期', required: true, linkage: '证书编号、有效期、证件附件' }),
    col('certificateNo', '证书编号', { boundField: '证书编号', sourceType: '关联对象字段', controlType: '只读文本', displayValue: '证书编号', saveValue: '证书编号', sourceObject: 'qualificationArchive', editable: false }),
    col('certificateExpiry', '有效期', { boundField: '有效期', sourceType: '关联对象字段', controlType: '只读文本', displayValue: '有效期', saveValue: '有效期', sourceObject: 'qualificationArchive', editable: false }),
    col('certificateImage', '证件附件', { boundField: '证件附件', sourceType: '关联对象字段', controlType: '只读文本', displayValue: '附件名称', saveValue: '附件地址', sourceObject: 'qualificationArchive', editable: false }),
    col('actions', '操作', { sourceType: '操作列', controlType: '操作按钮', displayValue: '编辑、删除', editable: false, save: false })
  ]; }
  function ensureDetail(item) {
    if (!item || item.componentType !== 'EditableTable') return item;
    item.rows ||= [];
    item.emptyText ||= '暂无数据';
    const special = item.id === 'specialWorkers' || /特种/.test(item.title || '');
    if (!item.detailBindingVersion) item.columns = special ? specialColumns() : normalColumns();
    else item.columns = (item.columns || []).map(normalizeColumn);
    item.detailBindingVersion = 1;
    item.dataBinding ||= { objectId: special ? 'specialWorkerDetail' : 'workPersonDetail', relationType: '一对多', relationField: '作业票ID → 作业票.作业票ID', loadMode: '读取已有数据', addMode: special ? '人员选择器新增' : '人员选择器新增', saveTarget: special ? 'specialWorkerDetail' : 'workPersonDetail', deleteRule: '标记删除关联明细' };
    item.linkages ||= special ? [
      { source: '姓名', targets: '部门、单位', mode: '自动带出，只读' },
      { source: '资格证', targets: '证书编号、有效期、证件附件', mode: '自动带出，只读' }
    ] : [{ source: '姓名', targets: '岗位、部门、单位', mode: '自动带出，只读' }];
    item.snapshot ||= { enabled: true, description: special ? '人员、部门、单位、证书及证件附件' : '人员、岗位、部门和单位' };
    item.dataState ||= 'normal';
    item.invalidCertificateRule ||= '禁止添加';
    return item;
  }

  const previousEnsure = ensureConfinedConfig;
  ensureConfinedConfig = function (item) { previousEnsure(item); return ensureDetail(item); };

  function group(title, body, hint = '') { return `<section class="prop-group"><header><b>${title}</b>${hint ? `<small>${hint}</small>` : ''}</header><div class="prop-body">${body}</div></section>`; }
  function bindingProps(item) {
    const binding = item.dataBinding, object = objectById(binding.objectId), target = objectById(binding.saveTarget);
    return `<label>数据对象<select id="dbObject">${businessObjects.filter(x => ['关联对象'].includes(x.role)).map(x => option(x.id, binding.objectId, x.name)).join('')}</select><small>仅显示“模板与数据”步骤已绑定的业务对象</small></label>
      <div class="binding-summary"><span>与主对象关系<b>${esc(binding.relationType)}</b></span><span>关联字段<b>${esc(binding.relationField)}</b></span></div>
      <label>数据加载方式<select id="dbLoad">${['新建空数据', '读取已有数据', '按条件自动加载'].map(x => option(x, binding.loadMode)).join('')}</select></label>
      <label>新增方式<select id="dbAdd">${['手工新增', '人员选择器新增', '从关联对象导入'].map(x => option(x, binding.addMode)).join('')}</select></label>
      <label>保存目标<select id="dbTarget">${businessObjects.filter(x => x.role === '关联对象').map(x => option(x.id, binding.saveTarget, x.name)).join('')}</select></label>
      <label>删除规则<select id="dbDelete">${['仅从当前表单移除', '标记删除关联明细'].map(x => option(x, binding.deleteRule)).join('')}</select></label>
      <div class="binding-flow"><b>${esc(object?.name || '未绑定')}</b><span>→</span><b>${esc(item.title)}</b><span>→</span><b>${esc(target?.name || '未设置')}</b></div>`;
  }
  function columnProps(item) {
    return `${item.columns.map((c, i) => `<article class="column-card ${c.save && c.editable && !c.boundField ? 'invalid' : ''}"><div class="column-head"><b>${i + 1}. ${esc(c.name)}</b><em>${esc(c.sourceType)}</em><button class="secondary" data-edit-detail-column="${i}">配置</button></div><div class="column-map"><span>${esc(c.sourceObject ? objectById(c.sourceObject)?.name || c.sourceObject : c.sourceType)}</span><b>→</b><span>${esc(c.displayValue || '未设置显示值')}</span><b>→</b><span>${c.save ? esc(c.saveValue || c.boundField || '未设置保存值') : '不保存'}</span></div></article>`).join('')}<div class="prop-actions"><button class="secondary" id="addDetailColumn">＋ 增加列</button><button class="ghost" id="openAllColumns">展开配置</button></div>`;
  }
  function linkageProps(item) {
    return `<div class="linkage-list">${item.linkages.length ? item.linkages.map(x => `<div class="linkage-row"><b>${esc(x.source)} → ${esc(x.targets)}</b><span>${esc(x.mode)}</span></div>`).join('') : '<div class="detail-state-note">尚未配置字段联动</div>'}</div><button class="secondary" id="editLinkages">配置联动规则</button>${/特种/.test(item.title) ? `<label>无有效资格证时<select id="invalidCertRule">${['禁止添加', '风险提示后允许添加'].map(x => option(x, item.invalidCertificateRule)).join('')}</select></label>` : ''}`;
  }
  function advancedProps(item) {
    const object = objectById(item.dataBinding.objectId);
    return `${toggleSetting('snapshotEnabled', '保存历史快照', item.snapshot.enabled)}<div class="snapshot-note">建议同时保存关联 ID 和提交时的${esc(item.snapshot.description)}业务快照，避免基础档案后续变更影响历史作业票。</div><label>组件状态<select id="detailDataState">${[['normal','正常'],['loading','加载中'],['empty','空数据'],['sourceUnavailable','来源不可用'],['fieldInvalid','字段失效'],['forbidden','无权限'],['configError','配置错误']].map(x=>option(x[0],item.dataState,x[1])).join('')}</select></label><label>高级信息（只读）<div class="advanced-code">对象编码：${esc(object?.code || '--')}<br>字段数：${item.columns.length}<br>配置版本：logical-binding-v1</div></label><button class="primary" id="validateDetail">检查当前配置</button>`;
  }
  function detailProps(item) {
    const issues = validateItem(item);
    return `<div class="detail-props">${group('基础属性', `<label>控件类型<input value="明细表" readonly disabled></label><label>控件标题<input id="cpLabel" value="${esc(item.title)}"></label><label>空数据文案<input id="cpEmptyText" value="${esc(item.emptyText || '暂无数据')}"></label>`)}${group('数据绑定', bindingProps(item), '对象级')}${group('列配置', columnProps(item), `${item.columns.length} 列`)}${group('联动规则', linkageProps(item), `${item.linkages.length} 条`)}${group('高级设置', advancedProps(item), issues.length ? `${issues.length} 项待修正` : '配置完整')}</div>`;
  }
  const propsBefore = componentProps;
  componentProps = function (item) { ensureDetail(item); return item?.componentType === 'EditableTable' ? detailProps(item) : propsBefore(item); };

  function bindChange(selector, item, path, render = true) {
    document.querySelector(selector)?.addEventListener('change', e => { rememberConfined(); const parts = path.split('.'); let target = item; parts.slice(0, -1).forEach(k => target = target[k]); target[parts.at(-1)] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; if (render) renderConfinedDesigner(); });
  }
  const bindPropsBefore = bindConfinedProps;
  bindConfinedProps = function () {
    bindPropsBefore(); const item = ensureDetail(selectedConfined()); if (!item || item.componentType !== 'EditableTable') return;
    bindChange('#dbObject', item, 'dataBinding.objectId'); bindChange('#dbLoad', item, 'dataBinding.loadMode'); bindChange('#dbAdd', item, 'dataBinding.addMode'); bindChange('#dbTarget', item, 'dataBinding.saveTarget'); bindChange('#dbDelete', item, 'dataBinding.deleteRule'); bindChange('#snapshotEnabled', item, 'snapshot.enabled'); bindChange('#detailDataState', item, 'dataState'); bindChange('#invalidCertRule', item, 'invalidCertificateRule');
    document.querySelectorAll('[data-edit-detail-column]').forEach(b => b.onclick = () => openColumnEditor(item, +b.dataset.editDetailColumn));
    document.querySelector('#openAllColumns')?.addEventListener('click', () => openColumnEditor(item, 0));
    document.querySelector('#addDetailColumn')?.addEventListener('click', () => { rememberConfined(); item.columns.splice(Math.max(1, item.columns.length - 1), 0, col(`column_${Date.now()}`, `新增列${item.columns.length}`)); renderConfinedDesigner(); });
    document.querySelector('#editLinkages')?.addEventListener('click', () => openLinkageEditor(item));
    document.querySelector('#validateDetail')?.addEventListener('click', () => openValidation([item]));
  };

  function openColumnEditor(item, index) {
    const c = item.columns[index], operation = c.sourceType === '操作列', hasSource = sourceControls.includes(c.controlType);
    document.querySelector('.modal-card').className = 'modal-card detail-dialog';
    document.querySelector('#modalBody').innerHTML = `<h2>${esc(item.title)} · 列配置</h2><p class="dialog-intro">配置这一列从哪里读取、显示什么、保存什么以及保存到哪里。</p><div class="column-editor-grid"><label>当前列<select id="ceIndex">${item.columns.map((x,i)=>option(String(i),String(index),`${i+1}. ${x.name}`)).join('')}</select></label><label>列名称<input id="ceName" value="${esc(c.name)}"></label><label>字段来源类型<select id="ceSourceType">${fieldTypes.map(x=>option(x,c.sourceType)).join('')}</select></label><label>控件类型<select id="ceControlType">${controlTypes.map(x=>option(x,c.controlType)).join('')}</select></label>${operation ? `<div class="full detail-state-note">操作列只负责当前行的编辑、删除等界面行为，不绑定字段，也不会保存到业务数据。</div>` : `<label>绑定字段<select id="ceBoundField"><option value="">请选择保存字段</option>${(objectById(item.dataBinding.objectId)?.fields||[]).map(x=>option(x,c.boundField)).join('')}</select></label><label>取值来源<input id="ceValueSource" value="${esc(c.sourceObject ? objectById(c.sourceObject)?.name || c.sourceObject : '')}" placeholder="请选择或说明来源"></label><label>显示值<input id="ceDisplay" value="${esc(c.displayValue)}" placeholder="例如：姓名"></label><label>保存值<input id="ceSave" value="${esc(c.saveValue)}" placeholder="例如：人员ID"></label><label class="full">过滤条件<textarea id="ceFilter" placeholder="使用业务条件表达，不填写 SQL">${esc(c.filter)}</textarea></label><label>默认值<input id="ceDefault" value="${esc(c.defaultValue)}"></label><label>空值处理<select id="ceNull">${['保留空值','使用默认值','阻止提交','忽略该字段'].map(x=>option(x,c.nullHandling)).join('')}</select></label><label class="full">联动带出<input id="ceLinkage" value="${esc(c.linkage)}" placeholder="例如：岗位、部门、单位"></label>`}${hasSource && !operation ? sourceEditor(c) : ''}<div class="editor-section editor-switches">${operation ? '' : `<label><input id="ceEditable" type="checkbox" ${c.editable?'checked':''}> 是否可编辑</label><label><input id="ceRequired" type="checkbox" ${c.required?'checked':''}> 是否必填</label><label><input id="ceSaveEnabled" type="checkbox" ${c.save?'checked':''}> 是否保存</label>`}</div></div><div class="dialog-footer"><button class="ghost" id="cancelColumnEdit">取消</button><button class="primary" id="saveColumnEdit">保存列配置</button></div>`;
    openModalShell();
    document.querySelector('#ceIndex').onchange = e => openColumnEditor(item, +e.target.value);
    document.querySelector('#ceSourceType').onchange = e => { c.sourceType=e.target.value; if(c.sourceType==='操作列'){c.controlType='操作按钮';c.save=false;c.editable=false;} openColumnEditor(item,index); };
    document.querySelector('#ceControlType').onchange = e => { c.controlType=e.target.value; openColumnEditor(item,index); };
    document.querySelector('#cancelColumnEdit').onclick=closeModalShell;
    document.querySelector('#saveColumnEdit').onclick=()=>{rememberConfined();c.name=document.querySelector('#ceName').value.trim()||'未命名列';c.sourceType=document.querySelector('#ceSourceType').value;c.controlType=document.querySelector('#ceControlType').value;if(c.sourceType!=='操作列'){c.boundField=document.querySelector('#ceBoundField')?.value||'';c.displayValue=document.querySelector('#ceDisplay')?.value||'';c.saveValue=document.querySelector('#ceSave')?.value||'';c.filter=document.querySelector('#ceFilter')?.value||'';c.defaultValue=document.querySelector('#ceDefault')?.value||'';c.nullHandling=document.querySelector('#ceNull')?.value||'保留空值';c.linkage=document.querySelector('#ceLinkage')?.value||'';c.editable=document.querySelector('#ceEditable').checked;c.required=document.querySelector('#ceRequired').checked;c.save=document.querySelector('#ceSaveEnabled').checked;if(hasSource){c.sourceObject=document.querySelector('#ceSourceObject')?.value||'';c.dataRange=document.querySelector('#ceRange')?.value||'';c.multiple=document.querySelector('#ceMultiple')?.value==='多选';c.allowInactive=document.querySelector('#ceInactive')?.checked||false;}}closeModalShell();renderConfinedDesigner();toast('列配置已保存');};
  }
  function sourceEditor(c){return `<section class="source-config"><h3>数据来源联动配置</h3><label>来源对象<select id="ceSourceObject"><option value="">请选择</option>${businessObjects.filter(x=>['关联来源','关联对象'].includes(x.role)).map(x=>option(x.id,c.sourceObject,x.name)).join('')}</select></label><label>数据范围<input id="ceRange" value="${esc(c.dataRange)}" placeholder="例如：在职人员"></label><label>显示字段<input value="${esc(c.displayValue)}" readonly></label><label>保存字段<input value="${esc(c.saveValue)}" readonly></label><label>选择模式<select id="ceMultiple">${['单选','多选'].map(x=>option(x,c.multiple?'多选':'单选')).join('')}</select></label><label class="editor-switches"><input id="ceInactive" type="checkbox" ${c.allowInactive?'checked':''}> 允许选择失效数据</label></section>`;}

  function openLinkageEditor(item){
    document.querySelector('.modal-card').className='modal-card detail-dialog';
    document.querySelector('#modalBody').innerHTML=`<h2>${esc(item.title)} · 联动规则</h2><p class="dialog-intro">选择来源字段后，将关联档案中的值自动带入目标列。每个目标列可单独设置只读或允许修改。</p><div class="detail-relation-hero"><article><b>人员/证书选择</b><span>读取关联档案</span></article><span>→</span><article><b>自动带出</b><span>按关联 ID 获取业务值</span></article><span>→</span><article><b>明细目标列</b><span>只读或允许修改</span></article></div><div class="column-editor-grid"><label>来源列<select id="leSource">${item.columns.filter(x=>sourceControls.includes(x.controlType)).map(x=>option(x.name,'')).join('')}</select></label><label>触发时机<select><option>选择后立即带出</option><option>保存行时带出</option></select></label><label class="full">目标列（可多选说明）<input id="leTargets" value="${esc(/特种/.test(item.title)?'部门、单位、证书名称、证书编号、有效期、证件附件':'岗位、部门、单位')}"></label><label>目标字段状态<select id="leMode"><option>自动带出，只读</option><option>自动带出，允许修改</option></select></label><label>来源失效时<select><option>阻止选择并提示</option><option>仅提示风险</option><option>清空联动值</option></select></label></div><div class="dialog-footer"><button class="ghost" id="cancelLinkage">取消</button><button class="primary" id="saveLinkage">添加联动</button></div>`;openModalShell();document.querySelector('#cancelLinkage').onclick=closeModalShell;document.querySelector('#saveLinkage').onclick=()=>{item.linkages.push({source:document.querySelector('#leSource').value,targets:document.querySelector('#leTargets').value,mode:document.querySelector('#leMode').value});closeModalShell();renderConfinedDesigner();toast('联动规则已添加');};
  }

  function validateItem(item){
    ensureDetail(item); const errors=[];
    if(!item.dataBinding.objectId) errors.push({column:-1,message:'组件尚未绑定数据对象'});
    item.columns.forEach((c,i)=>{if(c.sourceType==='操作列'||c.key==='index') return;if(c.editable&&c.save&&!c.boundField) errors.push({column:i,message:`“${c.name}”是可编辑业务列，但未绑定保存字段`});if(sourceControls.includes(c.controlType)&&(!c.sourceObject||!c.displayValue||!c.saveValue)) errors.push({column:i,message:`“${c.name}”的取值来源、显示值或保存值不完整`});if(c.linkage){c.linkage.split(/[、,，]/).filter(Boolean).forEach(t=>{if(!item.columns.some(x=>x.name===t.trim()))errors.push({column:i,message:`“${c.name}”联动目标“${t.trim()}”不存在`});});}});
    const used={};item.columns.filter(c=>c.save&&c.boundField).forEach((c,i)=>{if(used[c.boundField]!=null)errors.push({column:i,message:`“${c.name}”与其他列重复绑定“${c.boundField}”`});used[c.boundField]=i;});
    return errors;
  }
  function allTables(){return confinedSchema.sections.filter(x=>x.componentType==='EditableTable').map(ensureDetail);}
  function openValidation(items=allTables()){
    const entries=items.flatMap(item=>validateItem(item).map(error=>({item,error})));document.querySelector('.modal-card').className='modal-card detail-dialog';document.querySelector('#modalBody').innerHTML=`<h2>明细组件配置校验</h2><p class="dialog-intro">检查数据对象、保存字段、来源、联动、重复绑定和失效配置。错误可直接定位到组件和具体列。</p>${entries.length?`<div class="validation-list">${entries.map((x,i)=>`<article class="validation-item"><i>!</i><div><b>${esc(x.item.title)}${x.error.column>=0?` · ${esc(x.item.columns[x.error.column].name)}`:''}</b><span>${esc(x.error.message)}</span></div><button class="secondary" data-fix-detail="${i}">去修正</button></article>`).join('')}</div>`:'<div class="validation-ok">✓ 所有明细组件配置完整，可以进入下一步或发布。</div>'}<div class="dialog-footer"><button class="primary" id="closeDetailValidation">${entries.length?'关闭':'完成'}</button></div>`;openModalShell();document.querySelector('#closeDetailValidation').onclick=closeModalShell;document.querySelectorAll('[data-fix-detail]').forEach(b=>b.onclick=()=>{const x=entries[+b.dataset.fixDetail];closeModalShell();confinedSelection={kind:'section',sectionId:x.item.id};renderConfinedDesigner();if(x.error.column>=0)setTimeout(()=>openColumnEditor(x.item,x.error.column),0);});return entries.length===0;
  }
  window.validateDetailComponents=openValidation;

  function stateMarkup(section){
    const states={loading:['<span class="detail-spinner"></span>','正在读取明细数据，请稍候…'],empty:['暂无数据','可通过新增或关联对象导入数据'],sourceUnavailable:['数据来源暂不可用','请检查关联对象状态或稍后重试'],fieldInvalid:['字段已失效','来源字段已删除或类型发生变化，请修正配置'],forbidden:['无权查看明细数据','请联系管理员配置数据权限'],configError:['组件配置错误','存在未绑定字段或联动冲突，请前往右侧检查配置']};const state=states[section.dataState];if(!state)return '';return `<tr><td colspan="${section.columns.length}"><div class="table-state-panel ${['sourceUnavailable','fieldInvalid','configError'].includes(section.dataState)?'error':section.dataState}"><b>${state[0]}</b><span>${state[1]}</span></div></td></tr>`;
  }
  tableSectionMarkup=function(section,index){ensureDetail(section);const selected=confinedSelection.kind==='section'&&confinedSelection.sectionId===section.id;const object=objectById(section.dataBinding.objectId);return `<section class="editable-table-section ${selected?'selected':''}" data-csection="${section.id}"><div class="editable-table-toolbar"><b>${esc(section.title)}</b><span class="binding-chip">${esc(object?.name||'未绑定对象')} · ${esc(section.dataBinding.relationType)}</span><span class="binding-subtitle">保存到 ${esc(objectById(section.dataBinding.saveTarget)?.name||'未设置')}</span><button class="primary" data-add-table-person="${section.id}">＋ 新增</button>${confinedActions(index)}</div><div class="confined-table"><table><thead><tr>${section.columns.map(c=>`<th>${esc(c.name)}<small>${c.save?esc(c.boundField||'未绑定字段'):'不保存'}</small></th>`).join('')}</tr></thead><tbody>${section.dataState!=='normal'?stateMarkup(section):section.rows.length?section.rows.map((row,ri)=>`<tr>${section.columns.map(c=>`<td>${c.key==='index'?ri+1:c.key==='actions'?`<button data-remove-table-row="${section.id}:${ri}">移除</button>`:esc(row[c.key]||'--')}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${section.columns.length}" class="confined-empty-table">${esc(section.emptyText||'暂无数据')}</td></tr>`}</tbody></table></div></section>`;};

  const bindBeforeValidation=bindConfined;
  bindConfined=function(){bindBeforeValidation();const next=[...document.querySelectorAll('.confined-top button')].find(x=>x.textContent.trim()==='下一步');if(next)next.onclick=()=>{if(openValidation())toast('明细组件校验通过，可以进入下一步');};};

  const renderPublishBefore=window.renderPublishStep;
  if(typeof renderPublishBefore==='function') window.renderPublishStep=function(){renderPublishBefore();const original=document.querySelector('#publishNow')?.onclick;if(document.querySelector('#publishNow'))document.querySelector('#publishNow').onclick=()=>{const errors=allTables().flatMap(validateItem);if(errors.length)return openValidation();original?.();};};
})();
