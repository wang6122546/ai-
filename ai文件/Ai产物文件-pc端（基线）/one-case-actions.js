(() => {
  const approvalRoles = [
    ['业主单位审批人员确认', '王安全'],
    ['施工单位作业负责人确认', '张建国'],
    ['施工单位安全监护人确认', '李明远'],
    ['业主单位作业活动发起人确认', '赵海峰'],
    ['业主单位安全监管责任人确认', '孙晓辉']
  ];

  function approvalProgress(item) {
    if (item.status === '已批准') return 5;
    if (item.status === '审批中') return 3;
    return 0;
  }

  function copyOneCase(item) {
    showNewOneCase();
    const set = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) element.value = value || '';
    };
    set('#caseName', `${item.name}-复制`);
    set('#caseProject', item.project);
    set('#caseContent', item.name);
    set('#caseArea', item.area);
    document.querySelectorAll('.case-checkboxes input').forEach(input => {
      input.checked = item.types.includes(input.value);
    });
    const risk = document.querySelector(`[name="caseRisk"][value="${item.level}"]`);
    if (risk) risk.checked = true;
    toast('已复制一件一案信息，请核对计划时间后提交');
  }

  function approvalSheet(item) {
    const signedCount = approvalProgress(item);
    title.textContent = '一件一案审批表';
    subtitle.textContent = '线下审批表预览与打印';
    content.innerHTML = `<div class="one-case-paper-page">
      <div class="paper-toolbar"><button class="ghost" id="backOneCaseList">← 返回列表</button><button class="primary" id="printOneCaseSheet">打印</button></div>
      <article class="one-case-paper" id="oneCaseApprovalPaper">
        <h1>鞍钢矿业作业“一件一案”审批表</h1>
        <div class="paper-number">编号：${item.id}</div>
        <table><tbody>
          <tr><th>一件一案名称</th><td colspan="3">${item.name}</td></tr>
          <tr><th>作业所属项目</th><td>${item.project}</td><th>编制日期</th><td>2026年09月10日</td></tr>
          <tr><th>业主单位</th><td>齐大山铁矿</td><th>施工单位</th><td>${item.unit}</td></tr>
          <tr><th>作业地点</th><td>${item.area}</td><th>负责人</th><td>${item.owner}</td></tr>
          <tr><th>计划作业时间</th><td colspan="3">${item.time}</td></tr>
          <tr><th>危险作业类别</th><td colspan="3">${item.types.join('、')}</td></tr>
          <tr><th>综合风险等级</th><td>${item.level}</td><th>审批状态</th><td>${item.status}</td></tr>
          <tr><th>作业内容</th><td colspan="3">${item.name.replace('一件一案', '')}，按审批范围组织实施并落实全过程安全管控。</td></tr>
          <tr><th>安全监控</th><td colspan="3">2台，设置于${item.area}入口及主要作业区域，支持全过程查看与回放。</td></tr>
        </tbody></table>
        <h2>作业前审批确认</h2>
        <table class="paper-approval-table">
          <thead><tr><th>序号</th><th>审批账户/节点</th><th>审批意见</th><th>签字</th><th>审批时间</th></tr></thead>
          <tbody>${approvalRoles.map((role, index) => {
            const signed = index < signedCount;
            return `<tr><td>${index + 1}</td><td><b>${role[0]}</b><small>账户：${role[1]}</small></td><td>${signed ? '同意' : '待审批'}</td><td>${signed ? `<span class="paper-signature">${role[1]}</span>` : '—'}</td><td>${signed ? `2026-09-${String(10 + index).padStart(2, '0')} ${String(9 + index).padStart(2, '0')}:20` : '—'}</td></tr>`;
          }).join('')}</tbody>
        </table>
        <div class="paper-notes">
          <b>注：</b>
          <ol>
            <li>作业时间根据作业活动实际情况确定。</li>
            <li>涵盖此项作业的所有施工单位，不包括仅提供劳务人员输出、设备租赁的单位。</li>
            <li>作业步骤需写清作业每一步的具体要求，安全防范措施应与主要安全风险一一对应，落实责任人根据实际情况确定。如需要可在背面画示意图。</li>
            <li>业主单位安全监管责任人和审批人员根据“一件一案”级别确定，施工单位作业负责人原则上应为班长、队长等；安全监护人应为具有作业实践经验的人员；作业人员应具备相应资质。</li>
            <li><b>综合风险等级：</b>
              <p>（1）A级：存在同一项目3种及以上危险作业且同一区域人员达到10人及以上；3家及以上单位交叉作业且人员超10人；涉及超过一定规模的危大工程情形之一的。</p>
              <p><strong>审批要求：</strong>厂矿主要负责人或业务分管副职，岗位级别不低于D级。</p>
              <p><strong>监管要求：</strong>分管部门、作业区C级及以上人员全过程监管，厂矿领导现场动态督导。</p>
              <p>（2）B级：存在同一项目3种及以上危险作业且同一区域人员未超过10人或者涉及2种危险作业；涉及需要厂矿领导审批的危险作业；2家单位交叉作业；涉及爆破、支护、空区治理、探放水作业；涉及危险性较大的危大工程情形之一的。</p>
              <p><strong>审批要求：</strong>厂矿业务部门负责人或业务部门分管副职及以上，岗位级别不低于C级。</p>
              <p><strong>监管要求：</strong>分管部门、作业区B级及以上人员动态监管，厂矿业务部门项目负责人现场动态督导。</p>
              <p>（3）C级：仅涉及1种不需要厂矿领导审批的危险作业。</p>
              <p><strong>审批要求：</strong>作业区或业务部门分管副职及以上，岗位级别不低于B级。</p>
              <p><strong>监管要求：</strong>作业区指定人员动态监管。</p>
            </li>
          </ol>
          <p class="paper-sync-note">本表内容由一件一案线上记录自动带入；已完成节点的审批账户、意见和电子签字同步展示。</p>
        </div>
      </article>
    </div>`;
    document.querySelector('#backOneCaseList').onclick = () => openView('onecase', document.querySelector('[data-view="onecase"]'));
    document.querySelector('#printOneCaseSheet').onclick = () => window.print();
  }

  window.setupOneCases = function setupOneCasesWithActions() {
    const rows = document.querySelector('#oneCaseRows');
    const search = document.querySelector('#oneCaseSearch');
    const risk = document.querySelector('#oneCaseRisk');
    const status = document.querySelector('#oneCaseStatus');
    const closeMenus = () => document.querySelectorAll('.one-case-more-menu.open').forEach(menu => menu.classList.remove('open'));
    const render = () => {
      const keyword = search.value.trim();
      const visible = oneCases.filter(item => (!keyword || `${item.id}${item.name}${item.project}`.includes(keyword)) && (!risk.value || item.level === risk.value) && (!status.value || item.status === status.value));
      rows.innerHTML = visible.map(item => {
        const index = oneCases.indexOf(item);
        return `<tr><td><b>${item.name}</b><small>${item.id}</small></td><td>${item.project}</td><td><div class="case-tags">${item.types.map(type => `<span>${type}</span>`).join('')}</div></td><td><span class="risk ${item.level === 'A级风险' ? 'high' : item.level === 'B级风险' ? 'mid' : 'low'}">${item.level}</span></td><td>${item.area}</td><td>${item.owner}</td><td><span class="status ${item.status === '编制中' ? 'pending' : item.status === '已批准' ? 'done' : 'running'}">${item.status}</span></td><td><div class="one-case-row-actions"><button class="detail one-case-detail" data-index="${index}">查看详情</button><div class="one-case-more"><button class="one-case-more-trigger" data-index="${index}" aria-label="更多操作">•••</button><div class="one-case-more-menu"><button data-case-action="copy" data-index="${index}">复制新增</button><button class="danger" data-case-action="delete" data-index="${index}">删除</button><button data-case-action="sheet" data-index="${index}">审批表</button></div></div></div></td></tr>`;
      }).join('') || '<tr><td colspan="8" class="empty">没有符合条件的一件一案</td></tr>';
    };
    rows.onclick = event => {
      const detail = event.target.closest('.one-case-detail');
      if (detail) return showOneCaseDetail(oneCases[+detail.dataset.index]);
      const trigger = event.target.closest('.one-case-more-trigger');
      if (trigger) {
        const menu = trigger.nextElementSibling;
        const willOpen = !menu.classList.contains('open');
        closeMenus();
        if (willOpen) menu.classList.add('open');
        return;
      }
      const action = event.target.closest('[data-case-action]');
      if (!action) return;
      const item = oneCases[+action.dataset.index];
      closeMenus();
      if (action.dataset.caseAction === 'copy') return copyOneCase(item);
      if (action.dataset.caseAction === 'sheet') return approvalSheet(item);
      if (action.dataset.caseAction === 'delete') {
        oneCases.splice(oneCases.indexOf(item), 1);
        render();
        toast('一件一案已删除');
      }
    };
    search.oninput = render;
    risk.onchange = render;
    status.onchange = render;
    document.querySelector('#oneCaseReset').onclick = () => {
      search.value = '';
      risk.value = '';
      status.value = '';
      render();
    };
    document.querySelector('#newOneCase').onclick = showNewOneCase;
    render();
  };
})();
