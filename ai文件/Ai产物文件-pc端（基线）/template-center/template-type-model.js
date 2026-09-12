(function (root) {
  const TEMPLATE_TYPES = Object.freeze({ WORK_PERMIT: 'WORK_PERMIT', ONE_CASE: 'ONE_CASE', WORK_PLAN: 'WORK_PLAN', ADMIN_LICENSE: 'ADMIN_LICENSE' });
  const TEMPLATE_TYPE_LABELS = Object.freeze({ WORK_PERMIT: '作业票模板', ONE_CASE: '一件一案模板', WORK_PLAN: '作业计划模板', ADMIN_LICENSE: '行政许可模板' });
  const TEMPLATE_TYPE_OPTIONS = Object.freeze(Object.values(TEMPLATE_TYPES).map(value => Object.freeze({ value, label: TEMPLATE_TYPE_LABELS[value] })));
  const DEFAULT_TEMPLATE_TYPE = TEMPLATE_TYPES.WORK_PERMIT;
  const workTypeAliases = Object.freeze({ earth: 'EARTH_WORK', hot: 'HOT_WORK', height: 'HEIGHT_WORK', space: 'CONFINED_SPACE_WORK', lift: 'LIFTING_WORK', power: 'TEMPORARY_POWER_WORK', road: 'ROAD_BREAKING_WORK', blind: 'BLIND_PLATE_WORK', blast: 'BLASTING_WORK', support: 'SUPPORT_WORK', water: 'WATER_EXPLORATION_WORK', cross: 'CROSS_WORK', 'plan-hot': 'HOT_WORK', 'case-hot': 'HOT_WORK' });

  function normalizeTemplateType(value) { return Object.values(TEMPLATE_TYPES).includes(value) ? value : DEFAULT_TEMPLATE_TYPE; }
  function normalizeTemplateRecord(record) {
    const source = record || {};
    return { ...source, templateType: normalizeTemplateType(source.templateType), workCategoryId: source.workCategoryId || source.categoryId || source.category || '', workTypeId: source.workTypeId || source.typeId || workTypeAliases[source.id] || source.name || '', workLevelIds: Array.isArray(source.workLevelIds) ? source.workLevelIds : (source.level && source.level !== '未限定' ? [source.level] : []) };
  }
  function validateTemplateRecord(record) {
    const value = normalizeTemplateRecord(record), errors = [];
    if (value.templateType === TEMPLATE_TYPES.WORK_PERMIT && !value.workTypeId) errors.push({ field: 'workTypeId', message: '作业票模板必须关联一个具体作业类型' });
    return { valid: errors.length === 0, errors, value };
  }
  const templateApiContract = Object.freeze({
    query: Object.freeze({ method: 'GET', path: '/work-templates', optionalParams: ['templateType', 'workCategoryId', 'workTypeId', 'workLevelIds', 'keyword', 'status'], response: '{ items: Template[], total: number, templateType: TemplateType }' }),
    create: Object.freeze({ method: 'POST', path: '/work-templates', body: 'TemplateCreateInput（templateType 缺省为 WORK_PERMIT）' }),
    update: Object.freeze({ method: 'PUT', path: '/work-templates/:id', body: 'TemplateUpdateInput' }),
    copy: Object.freeze({ method: 'POST', path: '/work-templates/:id/copy', body: '{ templateType?: TemplateType }' }),
    import: Object.freeze({ method: 'POST', path: '/work-templates/import', body: '导入内容；缺失 templateType 时补 WORK_PERMIT' }),
    publish: Object.freeze({ method: 'POST', path: '/work-templates/:id/publish', body: '{ version, templateType?: TemplateType }' })
  });
  const templateMockService = {
    query(params = {}, records = []) { const templateType = normalizeTemplateType(params.templateType); const items = records.map(normalizeTemplateRecord).filter(x => x.templateType === templateType).filter(x => !params.category || params.category === '全部模板' || x.category === params.category).filter(x => !params.keyword || x.name.includes(params.keyword)).filter(x => !params.status || params.status === '全部状态' || x.status === params.status); return { items, total: items.length, templateType }; },
    create(input = {}) { const result = validateTemplateRecord({ ...input, templateType: normalizeTemplateType(input.templateType) }); if (!result.valid) throw new Error(result.errors[0].message); return result.value; },
    update(current, patch = {}) { return this.create({ ...current, ...patch, templateType: normalizeTemplateType(patch.templateType || current?.templateType) }); },
    copy(source, patch = {}) { return this.create({ ...source, ...patch, templateType: normalizeTemplateType(patch.templateType || source?.templateType), status: '草稿' }); },
    import(input = {}) { return this.create({ ...input, templateType: normalizeTemplateType(input.templateType) }); },
    createUnique(input = {}, records = []) {
      const candidate = this.create(input);
      const duplicate = records.map(normalizeTemplateRecord).some(item => item.templateType === candidate.templateType && (item.workTypeId === candidate.workTypeId || (!item.workTypeId && item.name === candidate.name)));
      if (duplicate) { const error = new Error('该作业类型已创建作业票模板'); error.code = 'DUPLICATE_WORK_TYPE_TEMPLATE'; throw error; }
      return candidate;
    },
    publish(template) { const result = validateTemplateRecord(template); if (!result.valid) throw new Error(result.errors[0].message); return { ...result.value, status: '已发布' }; }
  };
  const api = { TEMPLATE_TYPES, TEMPLATE_TYPE_LABELS, TEMPLATE_TYPE_OPTIONS, DEFAULT_TEMPLATE_TYPE, normalizeTemplateType, normalizeTemplateRecord, validateTemplateRecord, templateApiContract, templateMockService };
  Object.assign(root, api); if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
