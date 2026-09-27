(() => {
  const svgNS = 'http://www.w3.org/2000/svg';
  let activeUnit = '', activeArea = '', metricFilter = null, focusedJobId = '';
  const originalVisible = visible, originalOpenDetail = openDetail;
  const jobs = () => workRecords;
  const count = predicate => jobs().filter(predicate).length;
  const setText = (selector, value) => { const el = document.querySelector(selector); if (el) el.textContent = value; };
  const riskClass = risk => risk.includes('红') ? 'risk-red' : risk.includes('橙') || risk.includes('高') ? 'risk-orange' : risk.includes('黄') ? 'risk-yellow' : risk.includes('蓝') ? 'risk-blue' : risk.includes('绿') ? 'risk-green' : 'risk-gray';

  workRecords.forEach((item, i) => item.timeout = item.status === '申请中' && [2, 8].includes(i));

  function syncDashboardCounts() {
    const all = jobs().length;
    const typeNames = ['动火作业', '高处作业', '有限空间作业', '吊装作业', '临时用电作业'];
    const statusNames = ['申请中', '作业中', '已暂停', '已完成'];
    const metricCounts = [all, count(x => x.status === '作业中'), count(x => /红|橙/.test(x.risk)), count(x => x.conditions < 100)];
    document.querySelectorAll('.today-stats b').forEach((el, i) => el.textContent = metricCounts[i]);
    setText('.left-column .data-panel:first-child header em', `${all} 项`);
    const todoCounts = ['待审批', '待监管确认', '待验收'].map(name => count(x => x.flow === name));
    document.querySelectorAll('.flow-todos b').forEach((el, i) => el.textContent = todoCounts[i]);
    setText('.left-column .data-panel:nth-child(2) header em', `${todoCounts.reduce((a, b) => a + b, 0)} 项`);
    document.querySelectorAll('.bars button').forEach((el, i) => el.textContent = count(x => x.type === typeNames[i]));
    setText('.chart-panel header em', `${all}项`);
    setText('.status-ring .ring b', all);
    document.querySelectorAll('.status-ring li button').forEach((el, i) => el.textContent = count(x => x.status === statusNames[i]));
    const riskCounts = [count(x => x.gas === '超限'), count(x => x.video === '离线'), count(x => x.hazards > 0), count(x => x.briefing.includes('未')), count(x => x.timeout), count(x => x.status === '已暂停')];
    document.querySelectorAll('.risk-metric-grid b').forEach((el, i) => el.textContent = riskCounts[i]);
    setText('.right-column .data-panel:first-child header em', `${new Set(jobs().filter(x => x.abnormal || x.status === '已暂停').map(x => x.id)).size} 项待处理`);
    setText('.unit-rank header em', `${count(x => x.lng !== null)} 项已定位`);
    setText('#unlocatedJobs b', count(x => x.lng === null));
  }

  visible = function (point) {
    if (!originalVisible(point)) return false;
    const risk = document.querySelector('#riskFilter').value, unit = document.querySelector('#unitFilter').value, q = document.querySelector('#mapSearch').value.trim();
    if (risk !== 'all' && point.risk !== risk) return false;
    if (unit !== 'all' && point.site !== unit && point.name !== unit) return false;
    if (q && !`${point.name}${point.id}${point.site || ''}${point.place || ''}${point.area || ''}${point.owner || ''}`.includes(q)) return false;
    if (activeUnit && point.kind === 'job' && point.site !== activeUnit) return false;
    if (activeArea && point.kind === 'job' && point.place !== activeArea) return false;
    if (metricFilter && point.kind === 'job' && !metricFilter(point)) return false;
    return true;
  };

  function marker(point) {
    const [x, y] = project([point.lng, point.lat]), g = document.createElementNS(svgNS, 'g'), halo = document.createElementNS(svgNS, 'circle'), circle = document.createElementNS(svgNS, 'circle'), label = document.createElementNS(svgNS, 'text');
    const unitJobs = point.kind === 'site' ? jobs().filter(job => job.site === point.name) : [];
    g.classList.add('gis-point', point.kind, riskClass(point.risk || '')); if (point.id === focusedJobId) g.classList.add('is-focused');
    g.dataset.pointId = point.id; if (point.kind === 'site') g.dataset.jobCount = unitJobs.length; g.setAttribute('transform', `translate(${x} ${y})`); g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', point.kind === 'site' ? `${point.name}，${unitJobs.length}项作业` : `查看${point.name}`);
    halo.setAttribute('r', /红/.test(point.risk || '') ? 22 : 16); halo.classList.add('point-halo'); circle.setAttribute('r', point.kind === 'site' ? 10 : 6);
    label.setAttribute('x', 13); label.setAttribute('y', 4); label.textContent = point.kind === 'site' ? `${point.name} · ${unitJobs.length}项` : point.name;
    g.append(halo, circle, label); g.addEventListener('click', event => { event.stopPropagation(); if (point.kind === 'site') return drillUnit(point); if (point.kind === 'job' && activeUnit) { activeArea = point.place; breadcrumb(['鞍山市', point.district, point.site, point.place]); } showEnhancedPointCard(point, event); });
    g.addEventListener('keydown', event => { if (event.key === 'Enter') point.kind === 'site' ? drillUnit(point) : showPointCard(point, event); }); return g;
  }

  function openCluster(group) {
    currentList = group; setText('#workListTitle', `${group[0].site} / ${group[0].place}作业列表`); listSearch.value = ''; renderWorkList();
    listDrawer.classList.add('open'); listDrawer.setAttribute('aria-hidden', 'false'); pointCard.hidden = true;
  }

  renderPoints = function () {
    if (!projection) return;
    pointCard.hidden = true; pointLayer.innerHTML = '';
    const filtersActive = document.querySelector('#mapSearch').value.trim() || ['typeFilter', 'statusFilter', 'riskFilter', 'unitFilter'].some(id => document.querySelector(`#${id}`).value !== 'all');
    const cityOverview = !activeDistrict && !activeUnit && !metricFilter && !focusedJobId && !filtersActive;
    let points = mapPoints.filter(point => point.lng !== null && visible(point));
    if (cityOverview) points = points.filter(point => point.kind === 'site');
    const visibleJobs = points.filter(point => point.kind === 'job');
    points.filter(point => point.kind !== 'job').forEach(point => pointLayer.append(marker(point)));
    // 按当前地图屏幕距离聚合相邻作业；同坐标始终保留列表入口。
    const matrix = mapSvg.getScreenCTM();
    const pxPerUnit = matrix ? Math.hypot(matrix.a, matrix.b) : mapSvg.getBoundingClientRect().width / viewBox.w;
    const groups = [];
    visibleJobs.forEach(point => {
      const [x, y] = project([point.lng, point.lat]);
      const near = groups.find(group => group[0].site === point.site && group[0].place === point.place && Math.hypot((x - group.x) * pxPerUnit, (y - group.y) * pxPerUnit) < 22);
      if (near) near.push(point); else { const group = [point]; group.x = x; group.y = y; groups.push(group); }
    });
    groups.forEach(group => {
      if (group.length === 1) return pointLayer.append(marker(group[0]));
      const [x, y] = project([group[0].lng, group[0].lat]), g = document.createElementNS(svgNS, 'g'), c = document.createElementNS(svgNS, 'circle'), n = document.createElementNS(svgNS, 'text'), label = document.createElementNS(svgNS, 'text');
      g.classList.add('gis-cluster'); g.setAttribute('transform', `translate(${x} ${y})`); g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0');
      c.setAttribute('r', 15); n.textContent = group.length; label.textContent = `${group.length}项作业`; label.classList.add('cluster-label'); g.append(c, n, label); g.onclick = event => { event.stopPropagation(); openCluster(group); }; pointLayer.append(g);
    });
    renderSpatialRisk(visibleJobs); updateEmpty(points, cityOverview);
  };

  let zoomRenderQueued = false;
  mapSvg.addEventListener('gis:viewchange', event => {
    if (!event.detail.zoomChanged || zoomRenderQueued) return;
    zoomRenderQueued = true;
    requestAnimationFrame(() => { zoomRenderQueued = false; renderPoints(); });
  });

  function renderSpatialRisk(visibleJobs) {
    const layer = document.querySelector('#spatialRiskLayer'); layer.innerHTML = '';
    const conflict = visibleJobs.filter(x => x.site === '齐大山选矿厂' && x.place === '选矿车间');
    if (conflict.length > 1) { const [x, y] = project([conflict[0].lng, conflict[0].lat]), circle = document.createElementNS(svgNS, 'circle'); circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', 42); circle.classList.add('spatial-risk-circle'); layer.append(circle); }
  }

  function updateEmpty(points, cityOverview) {
    let empty = document.querySelector('#mapEmptyState'); if (points.length || cityOverview) return empty?.remove();
    if (!empty) { empty = document.createElement('div'); empty.id = 'mapEmptyState'; empty.className = 'map-empty-state'; empty.innerHTML = '<b>当前区域暂无作业</b><span>请返回上级或调整筛选条件</span>'; mapStage.append(empty); }
  }

  function breadcrumb(parts) {
    const level = document.querySelector('#mapLevel');
    level.innerHTML = parts.map((part, i) => i === 0 ? `<button data-crumb="0">${part}</button>` : `<span><button data-crumb="${i}">${part}</button></span>`).join('');
    level.querySelectorAll('button').forEach(button => button.onclick = () => {
      const i = +button.dataset.crumb;
      if (i === 0) { activeUnit = ''; activeArea = ''; focusedJobId = ''; metricFilter = null; mapStage.classList.remove('factory-view'); document.querySelector('#areaLayer').innerHTML = ''; cityView(); breadcrumb(['鞍山市']); }
      else if (i === 1) { activeUnit = ''; activeArea = ''; document.querySelector('#areaLayer').innerHTML = ''; const feature = geoData.features.find(x => x.properties.name === parts[1]); if (feature) drill(feature); breadcrumb(['鞍山市', parts[1]]); }
      else if (i === 2 && activeUnit) { activeArea = ''; drillUnit(mapPoints.find(x => x.kind === 'site' && x.name === activeUnit)); }
    });
  }

  function drillUnit(site) {
    if (!site) return; activeUnit = site.name; activeArea = ''; focusedJobId = ''; metricFilter = null; mapStage.classList.add('factory-view');
    activeDistrict = null;
    const [x, y] = project([site.lng, site.lat]); setView({ x: x - 105, y: y - 75, w: 210, h: 150 }); document.querySelector('#mapBack').hidden = false;
    breadcrumb(['鞍山市', site.place, site.name]); renderFactory(site); renderPoints();
  }

  function renderFactory(site) {
    const layer = document.querySelector('#areaLayer'), [x, y] = project([site.lng, site.lat]);
    const names = [...new Set(jobs().filter(job => job.site === site.name).map(job => job.place))].slice(0, 4);
    layer.innerHTML = `<path class="road-line" d="M${x - 92} ${y + 18} L${x + 92} ${y - 25}"/><rect class="restricted-zone" x="${x + 28}" y="${y + 8}" width="44" height="32"/><text class="facility-caption restricted-caption" x="${x + 50}" y="${y + 26}">禁入区</text><rect class="device-area" x="${x - 78}" y="${y + 22}" width="40" height="25"/><text class="facility-caption" x="${x - 58}" y="${y + 38}">设备区</text><circle class="camera-node" cx="${x + 7}" cy="${y - 13}" r="5"/><text class="facility-caption" x="${x + 15}" y="${y - 10}">视频</text>`;
    names.forEach((name, i) => { const rect = document.createElementNS(svgNS, 'rect'), text = document.createElementNS(svgNS, 'text'), px = x - 75 + (i % 2) * 82, py = y - 58 + Math.floor(i / 2) * 65; rect.setAttribute('x', px); rect.setAttribute('y', py); rect.setAttribute('width', 68); rect.setAttribute('height', 40); rect.classList.add('area-zone'); text.setAttribute('x', px + 34); text.setAttribute('y', py + 23); text.textContent = `${name} · ${count(job => job.site === site.name && job.place === name)}项`; text.classList.add('area-label'); rect.onclick = () => drillArea(site, name, px + 34, py + 20); layer.append(rect, text); });
  }

  function drillArea(site, name, x, y) { activeArea = name; focusedJobId = ''; setView({ x: x - 48, y: y - 35, w: 96, h: 70 }); breadcrumb(['鞍山市', site.place, site.name, name]); renderPoints(); }

  const metricMap = { all: () => true, working: x => x.status === '作业中', high: x => /红|橙/.test(x.risk), unready: x => x.conditions < 100, gas: x => x.gas === '超限', video: x => x.video === '离线', hazard: x => x.hazards > 0, briefing: x => x.briefing.includes('未'), timeout: x => x.timeout, paused: x => x.status === '已暂停' };
  function applyMetric(key) { metricFilter = metricMap[key] || null; focusedJobId = ''; activeUnit = ''; activeArea = ''; currentList = jobs().filter(metricFilter || (() => true)); setText('#workListTitle', '指标关联作业'); listSearch.value = ''; renderWorkList(); listDrawer.classList.add('open'); listDrawer.setAttribute('aria-hidden', 'false'); renderPoints(); }

  function panorama(point) {
    return `<div class="detail-panorama"><section><h3>申请及作业基本信息</h3><p>${point.id} · ${point.type}${point.level} · ${point.district}/${point.site}/${point.place}</p><p>负责人 ${point.owner} · 监护人 ${point.watcher} · ${point.planTime}</p></section><section><h3>风险评估与安全措施</h3><p class="${/红|橙/.test(point.risk) ? 'warn' : 'ok'}">${point.risk} · 已识别风险点6项 · 措施完成 ${point.conditions}%</p></section><section><h3>气体检测及有效期</h3><p class="${point.gas === '超限' ? 'warn' : 'ok'}">O₂ 20.8% · CO 0ppm · ${point.gas} · 有效至 17:30</p></section><section><h3>人员与安全交底</h3><p>6人在场 · 特种作业证书已核验 · ${point.briefing}</p></section><section><h3>审批及监管确认</h3><p>申请 → 审批通过 → ${point.progress} → 待验收</p></section><section><h3>监控、隐患与处置</h3><p>视频${point.video} · ${point.hazards}项未关闭隐患 · ${point.abnormal}条异常</p></section><section><h3>收尾确认和验收结果</h3><p>${point.status === '已完成' ? '已完成清场、断电和验收确认' : '作业未结束，待执行收尾确认'}</p></section></div>`;
  }

  openDetail = function (point) {
    originalOpenDetail(point); if (point.kind !== 'job') return;
    drawer.querySelector('nav').innerHTML = '<button class="active" data-view="panorama">作业全景</button><button data-view="monitor">实时监控</button><button data-view="records">处置记录</button>';
    const renderTab = view => { content.innerHTML = view === 'monitor' ? monitor(point) : view === 'records' ? hazards(point) : panorama(point); };
    drawer.querySelectorAll('nav button').forEach(button => button.onclick = () => { drawer.querySelectorAll('nav button').forEach(x => x.classList.remove('active')); button.classList.add('active'); renderTab(button.dataset.view); }); renderTab('panorama');
  };

  const oldRenderList = renderWorkList;
  renderWorkList = function () {
    oldRenderList(); listContent.querySelectorAll('.work-list-row').forEach(row => row.onclick = event => {
      if (event.target.closest('button')) return; const item = jobs().find(x => x.id === row.dataset.id); if (!item || item.lng === null) return;
      listDrawer.classList.remove('open'); listDrawer.setAttribute('aria-hidden', 'true'); focusedJobId = item.id; metricFilter = x => x.id === item.id; activeUnit = item.site; activeArea = item.place;
      renderPoints(); const [x, y] = project([item.lng, item.lat]); setView({ x: x - 55, y: y - 38.5, w: 110, h: 77 }); breadcrumb(['鞍山市', item.district, item.site, item.place]);
    });
  };

  document.querySelector('#mapBack').addEventListener('click', () => { activeUnit = ''; activeArea = ''; focusedJobId = ''; metricFilter = null; mapStage.classList.remove('factory-view'); document.querySelector('#areaLayer').innerHTML = ''; breadcrumb(['鞍山市']); });
  document.querySelector('#riskFilter').onchange = document.querySelector('#unitFilter').onchange = () => { metricFilter = null; focusedJobId = ''; renderPoints(); };
  document.querySelector('#layerToggle').onclick = () => document.querySelector('#layerPanel').classList.toggle('collapsed');
  document.querySelectorAll('[data-layer]').forEach(input => input.onchange = () => { const cls = input.dataset.layer; mapStage.classList.toggle(`hide-${cls}`, !input.checked); if (cls === 'heat') mapStage.classList.toggle('show-heat', input.checked); });
  document.querySelector('#locateConflict').onclick = () => { const point = jobs().find(x => x.site === '齐大山选矿厂' && x.place === '选矿车间' && x.lng !== null); if (!point) return; activeUnit = point.site; activeArea = point.place; metricFilter = null; renderPoints(); const [x, y] = project([point.lng, point.lat]); setView({ x: x - 70, y: y - 49, w: 140, h: 98 }); breadcrumb(['鞍山市', point.district, point.site, point.place]); };
  document.querySelector('#unlocatedJobs').onclick = () => { currentList = jobs().filter(x => x.lng === null); setText('#workListTitle', '未定位作业'); listSearch.value = ''; renderWorkList(); listDrawer.classList.add('open'); listDrawer.setAttribute('aria-hidden', 'false'); };
  document.querySelectorAll('[data-gis-metric]').forEach(button => button.onclick = () => applyMetric(button.dataset.gisMetric));
  document.querySelectorAll('[data-risk-metric]').forEach(button => button.onclick = () => applyMetric(button.dataset.riskMetric));
  document.querySelectorAll('#mapSearch,#typeFilter,#statusFilter').forEach(el => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { metricFilter = null; focusedJobId = ''; renderPoints(); }));
  const counts = areas.map(name => [name, count(x => x.site === name), count(x => x.site === name && /红|橙/.test(x.risk))]);
  document.querySelector('#unitRank').innerHTML = counts.map(x => `<button data-unit="${x[0]}"><span>${x[0]}</span><b>${x[1]}</b><em>${x[2]}项高风险</em></button>`).join('');
  document.querySelectorAll('#unitRank button').forEach(button => button.onclick = () => drillUnit(mapPoints.find(x => x.kind === 'site' && x.name === button.dataset.unit)));
  syncDashboardCounts(); breadcrumb(['鞍山市']);
})();
