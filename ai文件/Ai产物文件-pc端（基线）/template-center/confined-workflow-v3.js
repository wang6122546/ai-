(function () {
  const previousFlow = flowDesigner, previousBind = bindDesigner;
  const isConfined = () => !!state.template;
  const controlLibrary = [['start', '开始'], ['approval', '审批'], ['condition', '条件判断'], ['end', '结束']];
  const workControlLibrary = [['risk', '风险评估'], ['measure', '安全措施确认'], ['gas', '气体检测'], ['briefing', '安全交底'], ['receipt', '接收交底'], ['supervision', '监管确认'], ['submit', '提交验收'], ['accept', '验收审批']];
  const names = Object.fromEntries([...controlLibrary, ...workControlLibrary]);
  const fixedKinds = new Set(['start', 'apply', 'work', 'end']), workKinds = new Set(workControlLibrary.map(x => x[0]));
  const roles = { start: '作业申请人', apply: '作业申请人', risk: '风险评估人', gas: '气体检测人', measure: '安全措施确认人', briefing: '安全交底人', receipt: '全部作业人员', approval: '作业审批角色', work: '系统', submit: '作业负责人', accept: '验收审批人', end: '系统' };
  const typeOf = n => n.system ? '系统阶段' : n.kind === 'condition' ? '条件判断' : workKinds.has(n.kind) ? '作业控件节点' : n.kind === 'approval' || n.kind === 'accept' ? '审批节点' : '流程控制节点';
  let nodes = [
    ['start_01', 'start', '开始', 20, 80], ['risk_01', 'risk', '风险评估', 210, 80],
    ['need_gas_01', 'condition', '是否需要作业前气体检测', 400, 80], ['gas_01', 'gas', '气体检测', 590, 80], ['gas_ok_01', 'condition', '检测是否合格', 780, 80],
    ['measure_01', 'measure', '安全措施确认', 400, 280], ['briefing_01', 'briefing', '安全交底', 590, 280], ['receipt_01', 'receipt', '接收交底', 780, 280],
    ['approval_01', 'approval', '作业审批', 970, 280], ['work_01', 'work', '现场实施 / 作业中', 970, 480, true], ['submit_01', 'submit', '提交验收', 1160, 480],
    ['accept_01', 'accept', '验收审批', 1350, 480], ['end_01', 'end', '结束', 1540, 480]
  ].map(x => ({ id: x[0], kind: x[1], name: x[2], x: x[3], y: x[4], system: !!x[5], handler: roles[x[1]] || '待配置', mode: x[1] === 'receipt' ? '全部人员完成' : '单人办理', published: true }));
  let edges = [
    ['start_01', 'risk_01'], ['risk_01', 'need_gas_01'], ['need_gas_01', 'gas_01', '是'], ['need_gas_01', 'measure_01', '否'],
    ['gas_01', 'gas_ok_01'], ['gas_ok_01', 'measure_01', '是'], ['gas_ok_01', 'end_01', '否 · 作废', 'reject'], ['measure_01', 'briefing_01'],
    ['briefing_01', 'receipt_01'], ['receipt_01', 'approval_01'], ['approval_01', 'work_01', '通过'], ['approval_01', 'end_01', '驳回 · 作废', 'reject'],
    ['work_01', 'submit_01', '提交验收'], ['submit_01', 'accept_01'], ['accept_01', 'end_01', '通过 · 归档'], ['accept_01', 'submit_01', '驳回', 'reject']
  ].map(x => ({ from: x[0], to: x[1], label: x[2] || '', route: x[3] || '' }));
  const copyFlow = value => JSON.parse(JSON.stringify(value));
  const flowByTemplate = new Map([['space', { nodes: copyFlow(nodes), edges: copyFlow(edges) }]]);
  let activeFlowTemplate = 'space';
  function prepareTemplateFlow() {
    const template = state.template || {}, key = template.id || template.code || template.name;
    if (!key || key === activeFlowTemplate) return;
    flowByTemplate.set(activeFlowTemplate, { nodes: copyFlow(nodes), edges: copyFlow(edges) });
    const saved = flowByTemplate.get(key);
    nodes = copyFlow(saved?.nodes || []); edges = copyFlow(saved?.edges || []);
    selected = nodes[0]?.id || ''; selectedEdge = ''; selectedBend = -1;
    activeFlowTemplate = key;
  }
  let selected = 'start_01', selectedEdge = '', selectedBend = -1, scale = .8, connecting = '', history = [], future = [], guides = [], edgeClickTimer = 0;
  const esc = v => escapeControlText(v == null ? '' : String(v)), nodeBy = id => nodes.find(n => n.id === id), hasKind = kind => nodes.some(n => n.kind === kind);
  function remember() { history.push(JSON.stringify({ nodes, edges })); if (history.length > 30) history.shift(); future = []; }

  function library() {
    const controls = controlLibrary.map(x => { const disabled = ['start', 'end'].includes(x[0]) && hasKind(x[0]); return `<button draggable="${!disabled}" data-flow-add="${x[0]}" ${disabled ? 'disabled' : ''}><i>+</i><span><b>${x[1]}</b><small>${disabled ? '画布中已存在，只能有一个' : '流程控制节点'}</small></span></button>`; }).join('');
    const work = workControlLibrary.map(x => `<button draggable="true" data-flow-add="${x[0]}" class="control"><i>◈</i><span><b>${x[1]}</b><small>绑定作业控件库已发布版本</small></span></button>`).join('');
    return `<aside class="yf-library"><header><h3>节点库</h3><input id="yfSearch" placeholder="搜索节点"></header><section><h4>流程控制节点</h4>${controls}</section><section><h4>作业控件节点</h4>${work}</section><p><b>开始 / 作业申请</b>已合并为固定起始节点，并绑定第二步申请表单。<br><b>现场实施 / 作业中</b>由作业审批通过后自动进入，均不能手动添加。</p></aside>`;
  }
  const nodeHeight = n => n.kind === 'start' ? 108 : 76;
  const port = (n, side) => side === 'L' ? [n.x, n.y + nodeHeight(n) / 2] : side === 'R' ? [n.x + 150, n.y + nodeHeight(n) / 2] : side === 'T' ? [n.x + 75, n.y] : [n.x + 75, n.y + nodeHeight(n)];
  function route(e) {
    const a = nodeBy(e.from), b = nodeBy(e.to); if (!a || !b) return [];
    if (e.points?.length) { const start = port(a, e.fromSide || 'R'), end = port(b, e.toSide || 'L'); return [start, ...e.points, end]; }
    if (e.from === 'gas_ok_01' && e.to === 'end_01') return [port(a, 'T'), [a.x + 75, 30], [b.x + 75, 30], port(b, 'T')];
    if (e.from === 'approval_01' && e.to === 'end_01') return [port(a, 'B'), [a.x + 75, 650], [b.x + 75, 650], port(b, 'B')];
    if (e.from === 'accept_01' && e.to === 'submit_01') return [port(a, 'B'), [a.x + 75, 610], [b.x + 75, 610], port(b, 'B')];
    if (e.from === 'gas_ok_01' && e.to === 'measure_01') return [port(a, 'B'), [a.x + 75, 220], [b.x + 170, 220], [b.x + 170, b.y + 38], port(b, 'R')];
    if (e.from === 'need_gas_01' && e.to === 'measure_01') return [port(a, 'B'), port(b, 'T')];
    if (b.y > a.y + 100 && Math.abs(b.x - a.x) < 170) return [port(a, 'B'), [a.x + 75, (a.y + b.y + 76) / 2], [b.x + 75, (a.y + b.y + 76) / 2], port(b, 'T')];
    const start = port(a, 'R'), end = port(b, 'L'), mid = Math.round(((start[0] + end[0]) / 2) / 10) * 10;
    return [start, [mid, start[1]], [mid, end[1]], end];
  }
  const pathData = points => points.length ? `M${points[0][0]} ${points[0][1]}` + points.slice(1).map((p, i) => { const prev = points[i]; return p[1] === prev[1] ? ` H${p[0]}` : p[0] === prev[0] ? ` V${p[1]}` : ` H${p[0]} V${p[1]}`; }).join('') : '';
  function line(e) {
    const points = route(e), key = `${e.from}:${e.to}`, cls = e.route === 'reject' ? 'reject' : ['是', '否'].includes(e.label) ? 'condition' : '', d = pathData(points);
    if (!d) return '';
    const first = points[0], second = points[1] || points[0], labelX = (first[0] + second[0]) / 2, labelY = (first[1] + second[1]) / 2 - 7;
    const bends = selectedEdge === key ? (e.points || []).map((p, i) => `<circle class="yf-bend ${selectedBend === i ? 'active' : ''}" cx="${p[0]}" cy="${p[1]}" r="5" data-bend="${i}" data-edge-key="${key}"/>`).join('') : '';
    return `<path class="edge ${cls} ${selectedEdge === key ? 'selected' : ''}" d="${d}"/><path class="hit" data-edge="${key}" d="${d}"/>${e.label ? `<text class="edge-label ${cls}" x="${labelX}" y="${labelY}">${esc(e.label)}</text>` : ''}${bends}`;
  }
  function canvas() {
    const cards = nodes.map(n => { const fixed = fixedKinds.has(n.kind), css = n.system ? 'system' : n.kind === 'condition' ? 'condition' : 'manual', merged = n.kind === 'start' ? '<div class="yf-merged-apply"><b>作业申请</b><span>绑定申请表单</span></div>' : ''; return `<article class="yf-node ${css} ${n.kind === 'start' ? 'merged-start' : ''} ${selected === n.id ? 'selected' : ''} ${['start', 'end'].includes(n.kind) ? 'terminal' : ''}" data-yf-node="${n.id}" draggable="true" style="left:${n.x}px;top:${n.y}px">${['T','R','B','L'].map(side => `<button class="port side-${side.toLowerCase()} ${connecting.startsWith(n.id) ? 'active' : ''}" data-port="${n.id}:${side}" title="${side}连接点"></button>`).join('')}<header><i>${n.system ? '⚙' : n.kind === 'condition' ? '◇' : workKinds.has(n.kind) ? '◈' : '○'}</i><span><b>${esc(n.name)}</b><small>${esc(typeOf(n))}</small></span><em>${n.published ? '✓' : '!'}</em></header>${merged}<footer><span>${esc(n.handler)}</span><div>${fixed ? '<small>固定节点</small>' : `<button data-copy-node="${n.id}">复制</button><button data-delete-node="${n.id}">删除</button>`}</div></footer></article>`; }).join('');
    const guideMarkup = guides.map(g => `<div class="yf-guide ${g.axis}" style="${g.axis === 'v' ? `left:${g.value}px` : `top:${g.value}px`}"></div>`).join('');
    return `<main class="yf-canvas-shell"><div class="yf-canvas-toolbar"><span>20px 网格吸附 · 双击连线增加折点 · 选中折点后按 Delete 删除</span><div><button id="yfZoomOut">−</button><b>${Math.round(scale * 100)}%</b><button id="yfZoomIn">＋</button><button id="yfCenter">居中</button></div></div><div class="yf-canvas" id="yfCanvas" tabindex="0"><div class="yf-plane" style="transform:scale(${scale})"><svg>${edges.map(line).join('')}<defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z"/></marker><marker id="arrow-condition" markerWidth="7" markerHeight="7" refX="6.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z"/></marker><marker id="arrow-reject" markerWidth="7" markerHeight="7" refX="6.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z"/></marker></defs></svg>${guideMarkup}${cards}</div><div class="yf-minimap">有限空间主流程 · ${nodes.length} 个节点</div></div></main>`;
  }
  const options = current => nodes.map(n => `<option value="${n.id}" ${n.id === current ? 'selected' : ''}>${esc(n.name)}</option>`).join('');
  function properties() {
    const n = nodeBy(selected) || nodes[0];
    if (!n) return `<aside class="yf-properties empty"><header><div><h3>节点属性</h3><span>尚未选择节点</span></div></header><div class="yf-empty-properties"><b>请选择流程节点</b><p>从左侧节点库拖入节点后，可在这里配置节点信息、处理设置和流转设置。</p></div></aside>`;
    const outgoing = edges.filter(e => e.from === n.id);
    const bound = workKinds.has(n.kind) ? `${n.name} · 已发布版本 v1.0` : ['apply', 'start'].includes(n.kind) ? '第二步作业申请表单 · 当前草稿' : '不绑定作业控件';
    const systemNote = n.system ? '<div class="yf-boundary"><b>系统自动阶段</b><p>审批通过后更新为“作业中”，开放气体检测、监管确认、人员进出、视频监控和提交验收；过程记录不推动主流程。</p></div>' : '';
    return `<aside class="yf-properties"><header><div><h3>${esc(n.name)}</h3><span>${esc(typeOf(n))}</span></div><em>配置完整</em></header><details open><summary>节点信息</summary><div class="yf-property-body"><label>节点名称<input id="yfName" value="${esc(n.name)}" ${fixedKinds.has(n.kind) ? 'readonly' : ''}></label><label>节点编码<input value="${esc(n.kind)}" readonly></label><label>节点实例ID<input value="YXKJ_${n.id.toUpperCase()}" readonly></label><label>绑定表单 / 作业控件<input value="${esc(bound)}" readonly></label>${systemNote}</div></details><details open><summary>处理设置</summary><div class="yf-property-body"><label>处理人来源<select ${n.system || ['start', 'end'].includes(n.kind) ? 'disabled' : ''}><option>指定角色</option><option>指定用户</option><option>指定岗位</option><option>发起人选择</option><option>从申请表人员字段获取</option><option>根据组织或业务规则计算</option></select></label><label>处理人 / 角色<input id="yfHandler" value="${esc(n.handler)}" ${n.system ? 'readonly' : ''}></label><label>办理方式<select id="yfMode" ${n.system ? 'disabled' : ''}>${['单人办理', '任一人办理', '依次办理', '并行会签', '会签比例', '全部人员完成'].map(x => `<option ${x === n.mode ? 'selected' : ''}>${x}</option>`).join('')}</select></label></div></details><details open><summary>流转设置</summary><div class="yf-property-body"><label>进入条件<textarea>${n.kind === 'gas' ? '需要执行作业前气体检测' : n.system ? '作业审批通过，系统自动进入' : '前置节点完成且校验通过'}</textarea></label>${outgoing.map(e => `<label>${e.label || '默认'}路线<select>${options(e.to)}</select></label>`).join('')}<label class="check"><input type="checkbox" ${n.kind === 'approval' ? '' : 'checked'} ${fixedKinds.has(n.kind) ? 'disabled' : ''}> 允许退回</label><label>超时处理<select><option>提醒并升级</option><option>自动转交</option><option>自动结束</option></select></label><button class="yf-permission-entry" id="yfPermission">配置字段权限</button><p class="yf-note">节点仅覆盖字段权限，不修改控件数据结构和内部校验。</p></div></details></aside>`;
  }
  const top = () => `<div class="yf-top"><button id="yfPrev">← 上一步</button><span></span><button id="yfUndo">↶ 撤销</button><button id="yfRedo">↷ 重做</button><button id="yfAuto">自动布局</button><button id="yfValidate">流程校验</button><button class="primary" id="yfSave">保存草稿</button><button class="primary" id="yfNext">下一步</button></div>`;
  flowDesigner = function () { if (!isConfined()) return previousFlow(); prepareTemplateFlow(); return `<div class="yf-workflow">${top()}<div class="yf-layout">${library()}${canvas()}${properties()}</div></div>`; };

  function nearestEdge(x, y, excludedId) {
    let best = null, bestDistance = 72;
    edges.forEach(edge => {
      if (edge.from === excludedId || edge.to === excludedId) return;
      const points = route(edge);
      points.slice(1).forEach((point, index) => {
        const start = points[index], dx = point[0] - start[0], dy = point[1] - start[1];
        const length = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - start[0]) * dx + (y - start[1]) * dy) / length));
        const distance = Math.hypot(x - (start[0] + t * dx), y - (start[1] + t * dy));
        if (distance < bestDistance) { bestDistance = distance; best = edge; }
      });
    });
    return best;
  }
  function snappedPosition(x, y, moving) {
    let nx = Math.max(20, Math.round((x - 75) / 20) * 20), ny = Math.max(20, Math.round((y - 38) / 20) * 20), nextGuides = [];
    nodes.filter(n => n.id !== moving).forEach(n => {
      if (Math.abs(n.x - nx) <= 12) { nx = n.x; nextGuides = nextGuides.filter(g => g.axis !== 'v'); nextGuides.push({ axis: 'v', value: n.x + 75 }); }
      if (Math.abs(n.y - ny) <= 12) { ny = n.y; nextGuides = nextGuides.filter(g => g.axis !== 'h'); nextGuides.push({ axis: 'h', value: n.y + 38 }); }
    });
    return { x: nx, y: ny, guides: nextGuides };
  }
  function insertAtEdge(nodeId, edge) {
    if (!edge) return false;
    edges = edges.filter(item => item !== edge);
    edges.push({ from: edge.from, to: nodeId, label: edge.label, route: edge.route });
    edges.push({ from: nodeId, to: edge.to, label: '', route: '' });
    return true;
  }
  function add(kind, x = 240, y = 120, edge) {
    if (['start', 'end'].includes(kind) && hasKind(kind)) return toast(`${names[kind]}节点只能存在一个`);
    remember(); const count = nodes.filter(n => n.kind === kind).length + 1, id = `${kind}_${String(count).padStart(2, '0')}`;
    nodes.push({ id, kind, name: names[kind], x, y, handler: kind === 'condition' ? '系统判断' : '待配置', mode: '单人办理', published: true });
    const inserted = insertAtEdge(id, edge); selected = id; renderDesigner();
    if (inserted) toast(`已将“${names[kind]}”插入原流程连线`);
  }
  function remove(id) { const n = nodeBy(id); if (!n || fixedKinds.has(n.kind)) return toast('固定节点不允许删除'); remember(); nodes = nodes.filter(x => x.id !== id); edges = edges.filter(e => e.from !== id && e.to !== id); selected = 'start_01'; renderDesigner(); }
  function autoLayout() { remember(); const layout = {start_01:[20,80],risk_01:[210,80],need_gas_01:[400,80],gas_01:[590,80],gas_ok_01:[780,80],measure_01:[400,280],briefing_01:[590,280],receipt_01:[780,280],approval_01:[970,280],work_01:[970,480],submit_01:[1160,480],accept_01:[1350,480],end_01:[1540,480]}; nodes.forEach((n,i)=>{const p=layout[n.id]||[20+(i%8)*190,80+Math.floor(i/8)*200];n.x=p[0];n.y=p[1]}); edges.forEach(e => delete e.points); renderDesigner(); toast('已合并开始与作业申请，并按三层主流程重新排版'); }
  const hasEdge = (from, to, label) => edges.some(e => e.from === from && e.to === to && (!label || e.label.includes(label)));
  function validation(nextStep) {
    const starts = nodes.filter(n => n.kind === 'start'), ends = nodes.filter(n => n.kind === 'end'), linked = new Set(edges.flatMap(e => [e.from, e.to]));
    const unlinked = nodes.filter(n => !linked.has(n.id)), unpublished = nodes.filter(n => workKinds.has(n.kind) && !n.published), unassigned = nodes.filter(n => !fixedKinds.has(n.kind) && n.kind !== 'condition' && (!n.handler || n.handler === '待配置'));
    const incompleteCondition = nodes.filter(n => n.kind === 'condition').find(n => { const routes = edges.filter(e => e.from === n.id); return !routes.some(e => e.label === '是') || !routes.some(e => e.label.startsWith('否')); });
    const approval = nodeBy('approval_01'), accept = nodes.find(n => n.kind === 'accept'), submit = nodes.find(n => n.kind === 'submit'), end = nodes.find(n => n.kind === 'end'), work = nodes.find(n => n.system && n.kind === 'work');
    const checks = [
      ['固定节点唯一性', starts.length === 1 && ends.length === 1, '开始（内含作业申请）和结束各有且仅有一个', starts[0]?.id || ends[0]?.id, 'info'],
      ['节点连通性', !unlinked.length, unlinked.length ? `${unlinked.length} 个节点未连通` : '所有节点均已接入流程', unlinked[0]?.id, 'route'],
      ['作业控件发布状态', !unpublished.length, '全部作业控件均绑定已发布版本', unpublished[0]?.id, 'info'],
      ['办理角色配置', !unassigned.length, unassigned.length ? `${unassigned.length} 个办理节点待配置角色` : '办理人或角色配置完整', unassigned[0]?.id, 'handler'],
      ['条件出口完整性', !incompleteCondition, incompleteCondition ? '条件判断必须同时配置“是”和“否”出口' : '两个条件判断出口完整', incompleteCondition?.id, 'route'],
      ['作业审批驳回作废', !!approval && !!end && hasEdge(approval.id, end.id, '作废'), '驳回后结束并更新为“已作废”', approval?.id, 'route'],
      ['验收驳回路线', !!accept && !!submit && hasEdge(accept.id, submit.id, '驳回'), '驳回返回提交验收并保留历史', accept?.id, 'route'],
      ['作业中过程业务', !!work && workKinds.has('gas') && workKinds.has('supervision'), '开放气体检测、监管确认、人员进出和视频监控', work?.id, 'info']
    ], errors = checks.filter(x => !x[1]);
    document.querySelector('.modal-card').className = 'modal-card yf-validation';
    document.querySelector('#modalBody').innerHTML = `<h2>流程校验</h2><p>检查节点唯一性、分支路线、控件发布和作业中过程业务。</p><div class="yf-validation-summary"><b>${errors.length}</b><span>错误</span><strong>${checks.length - errors.length}</strong><span>通过</span></div><div class="yf-validation-list">${checks.map((x, i) => `<article class="${x[1] ? 'ok' : 'error'}"><i>${x[1] ? '✓' : '!'}</i><div><b>${x[0]}</b><span>${x[2]}</span></div>${x[1] ? '<em>通过</em>' : `<button data-validation-fix="${i}">定位修正</button>`}</article>`).join('')}</div><div class="dialog-footer"><button id="yfValidationClose">返回修改</button><button class="primary" id="yfValidationNext" ${errors.length ? 'disabled' : ''}>${nextStep ? '校验通过，进入下一步' : '完成'}</button></div>`;
    openModalShell(); document.querySelector('#yfValidationClose').onclick = closeModalShell; document.querySelector('#yfValidationNext').onclick = () => { closeModalShell(); if (nextStep) openTemplatePublishCheck(); };
    document.querySelectorAll('[data-validation-fix]').forEach(b => b.onclick = () => { const check = checks[+b.dataset.validationFix]; closeModalShell(); selected = check[3] || 'start_01'; renderDesigner(); toast(`已定位：${nodeBy(selected)?.name || check[0]}`); });
  }
  function bind() {
    const oldActions = document.querySelector('.designer-actions'); if (oldActions) oldActions.style.display = 'none';
    document.querySelectorAll('[data-flow-add]').forEach(b => { if (!b.disabled) { b.onclick = () => add(b.dataset.flowAdd); b.ondragstart = e => e.dataTransfer.setData('yf-kind', b.dataset.flowAdd); } });
    document.querySelector('#yfSearch').oninput = e => document.querySelectorAll('[data-flow-add]').forEach(b => b.hidden = !b.textContent.includes(e.target.value));
    const canvasEl = document.querySelector('#yfCanvas'); canvasEl.ondragover = e => { e.preventDefault(); canvasEl.classList.add('dragging'); const rect = canvasEl.getBoundingClientRect(), moving = e.dataTransfer.getData('yf-node'), point = snappedPosition((e.clientX - rect.left) / scale, (e.clientY - rect.top) / scale, moving); guides = point.guides; document.querySelectorAll('.yf-guide').forEach(x => x.remove()); const plane = document.querySelector('.yf-plane'); guides.forEach(g => plane.insertAdjacentHTML('beforeend', `<div class="yf-guide ${g.axis}" style="${g.axis === 'v' ? `left:${g.value}px` : `top:${g.value}px`}"></div>`)); }; canvasEl.ondragleave = () => { canvasEl.classList.remove('dragging'); guides = []; document.querySelectorAll('.yf-guide').forEach(x => x.remove()); }; canvasEl.ondrop = e => { e.preventDefault(); canvasEl.classList.remove('dragging'); const kind = e.dataTransfer.getData('yf-kind'), moving = e.dataTransfer.getData('yf-node'), rect = canvasEl.getBoundingClientRect(), x = (e.clientX - rect.left) / scale, y = (e.clientY - rect.top) / scale, point = snappedPosition(x, y, moving), targetEdge = nearestEdge(x, y, moving); guides = []; if (kind) return add(kind, point.x, point.y, targetEdge); if (moving) { remember(); const n = nodeBy(moving); n.x = point.x; n.y = point.y; const hasConnections = edges.some(edge => edge.from === moving || edge.to === moving); if (!hasConnections && insertAtEdge(moving, targetEdge)) toast(`已将“${n.name}”插入原流程连线`); renderDesigner(); } };
    document.querySelectorAll('[data-yf-node]').forEach(el => { el.onclick = e => { if (!e.target.closest('button')) { selected = el.dataset.yfNode; renderDesigner(); } }; el.ondragstart = e => e.dataTransfer.setData('yf-node', el.dataset.yfNode); });
    document.querySelectorAll('[data-port]').forEach(b => b.onclick = e => { e.stopPropagation(); const [id, side] = b.dataset.port.split(':'); if (!connecting) { connecting = `${id}:${side}`; renderDesigner(); return toast('请选择目标节点的固定连接点'); } const [from, fromSide] = connecting.split(':'); if (from === id) { connecting = ''; return renderDesigner(); } remember(); edges.push({ from, to: id, fromSide, toSide: side, label: '', route: '', points: [] }); connecting = ''; selectedEdge = `${from}:${id}`; selectedBend = -1; renderDesigner(); });
    document.querySelectorAll('[data-copy-node]').forEach(b => b.onclick = e => { e.stopPropagation(); const n = nodeBy(b.dataset.copyNode); add(n.kind, n.x + 35, n.y + 95); });
    document.querySelectorAll('[data-delete-node]').forEach(b => b.onclick = e => { e.stopPropagation(); remove(b.dataset.deleteNode); });
    document.querySelectorAll('[data-edge]').forEach(p => { p.onclick = e => { e.stopPropagation(); clearTimeout(edgeClickTimer); edgeClickTimer = setTimeout(() => { const edge = edges.find(item => `${item.from}:${item.to}` === p.dataset.edge); if (edge && !edge.points) edge.points = route(edge).slice(1, -1); selectedEdge = p.dataset.edge; selectedBend = -1; renderDesigner(); }, 220); }; p.ondblclick = e => { e.stopPropagation(); clearTimeout(edgeClickTimer); const edge = edges.find(item => `${item.from}:${item.to}` === p.dataset.edge), rect = document.querySelector('.yf-plane').getBoundingClientRect(); if (!edge) return; remember(); const x = Math.round(((e.clientX - rect.left) / scale) / 20) * 20, y = Math.round(((e.clientY - rect.top) / scale) / 20) * 20; edge.points = [...(edge.points || route(edge).slice(1, -1)), [x, y]]; selectedEdge = p.dataset.edge; selectedBend = edge.points.length - 1; renderDesigner(); }; });
    document.querySelectorAll('[data-bend]').forEach(circle => circle.onmousedown = e => { e.preventDefault(); e.stopPropagation(); const edge = edges.find(item => `${item.from}:${item.to}` === circle.dataset.edgeKey), index = +circle.dataset.bend; if (!edge?.points?.[index]) return; selectedEdge = circle.dataset.edgeKey; selectedBend = index; const plane = document.querySelector('.yf-plane'), rect = plane.getBoundingClientRect(); document.onmousemove = move => { edge.points[index] = [Math.round(((move.clientX - rect.left) / scale) / 20) * 20, Math.round(((move.clientY - rect.top) / scale) / 20) * 20]; circle.setAttribute('cx', edge.points[index][0]); circle.setAttribute('cy', edge.points[index][1]); }; document.onmouseup = () => { document.onmousemove = null; document.onmouseup = null; renderDesigner(); }; });
    document.querySelector('#yfName')?.addEventListener('change', e => { nodeBy(selected).name = e.target.value; renderDesigner(); }); document.querySelector('#yfHandler')?.addEventListener('change', e => { nodeBy(selected).handler = e.target.value; renderDesigner(); }); document.querySelector('#yfMode')?.addEventListener('change', e => { nodeBy(selected).mode = e.target.value; renderDesigner(); });
    document.querySelector('#yfPermission')?.addEventListener('click', () => toast(`正在配置“${nodeBy(selected).name}”节点字段权限`)); document.querySelector('#yfZoomIn').onclick = () => { scale = Math.min(1.4, scale + .1); renderDesigner(); }; document.querySelector('#yfZoomOut').onclick = () => { scale = Math.max(.6, scale - .1); renderDesigner(); }; document.querySelector('#yfCenter').onclick = () => canvasEl.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    document.querySelector('#yfAuto').onclick = autoLayout; document.querySelector('#yfUndo').onclick = () => { if (!history.length) return toast('暂无可撤销操作'); future.push(JSON.stringify({ nodes, edges })); const s = JSON.parse(history.pop()); nodes = s.nodes; edges = s.edges; renderDesigner(); }; document.querySelector('#yfRedo').onclick = () => { if (!future.length) return toast('暂无可重做操作'); history.push(JSON.stringify({ nodes, edges })); const s = JSON.parse(future.pop()); nodes = s.nodes; edges = s.edges; renderDesigner(); };
    document.querySelector('#yfValidate').onclick = () => validation(false); document.querySelector('#yfSave').onclick = () => toast('有限空间流程草稿已保存'); document.querySelector('#yfPrev').onclick = renderFormBuildStep; document.querySelector('#yfNext').onclick = () => validation(true);
    document.onkeydown = e => { if (state.mode !== 'flow' || !isConfined() || !['Delete', 'Backspace'].includes(e.key) || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) return; e.preventDefault(); if (selectedEdge && selectedBend >= 0) { const edge = edges.find(item => `${item.from}:${item.to}` === selectedEdge); if (edge?.points?.[selectedBend]) { remember(); edge.points.splice(selectedBend, 1); selectedBend = -1; renderDesigner(); toast('已删除人工折点'); } return; } remove(selected); };
  }
  bindDesigner = function () { if (state.mode === 'flow' && isConfined()) return bind(); document.onkeydown = null; return previousBind(); };
})();
