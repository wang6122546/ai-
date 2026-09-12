(() => {
  const templates = [
    ['有限空间', '有限空间作业步骤、安全防范措施及审批', ['受限空间名称', '原有介质名称', '气体检测结果'], ['中毒、窒息、火灾爆炸', '隔离置换并检测合格；保持通风，监护人员全程在岗。']],
    ['高处', '高处作业步骤、安全防范措施及审批', ['作业高度', '作业平台', '坠落防护方式'], ['高处坠落、物体打击', '安全带高挂低用；临边洞口设置防护，工具采取防坠措施。']],
    ['吊装', '吊装作业步骤、安全防范措施及审批', ['吊物重量', '起重设备', '吊装半径'], ['起重伤害、物体打击', '核验吊具与设备能力；划定警戒区并由专人统一指挥。']],
    ['临时用电', '临时用电作业步骤、安全防范措施及审批', ['用电设备', '电压等级', '负荷容量'], ['触电、电气火灾', '执行三级配电、两级保护；电工持证，停送电落实挂牌确认。']],
    ['动土', '动土作业步骤、安全防范措施及审批', ['开挖深度', '地下设施', '支护方式'], ['坍塌、地下管线损坏', '查明地下设施并标识；按深度放坡或支护，设置临边防护。']],
    ['断路', '断路作业步骤、安全防范措施及审批', ['断路范围', '绕行路线', '交通疏导人'], ['车辆伤害、设施损坏', '设置硬质围挡、警示灯和绕行标识，专人进行交通疏导。']],
    ['爆破作业（井下）', '爆破作业步骤、安全防范措施及审批（井下）', ['爆破设计编号', '爆破孔数/孔径', '炸药量/类型', '警戒距离'], ['拒爆、早爆、冒顶片帮', '核验涉爆资质与设计；爆材双人双锁，严格警戒、起爆和验炮程序。']],
    ['爆破作业（露天）', '爆破作业步骤、安全防范措施及审批（露天）', ['爆破设计编号', '爆破孔数/孔径', '炸药量/类型', '警戒范围'], ['爆破飞石、拒爆、早爆', '恶劣天气禁止爆破；清退无关人员，按设计布置岗哨和警戒范围。']],
    ['盲板抽堵', '盲板抽堵作业步骤、安全防范措施及审批', ['盲板编号', '介质名称', '管线压力'], ['火灾爆炸、冻伤、窒息', '系统隔离、泄压排料并检测；使用防爆工具，设置警戒并专人监护。']],
    ['支护', '支护作业步骤、安全防范措施及审批', ['支护类型', '设计编号', '作业断面'], ['冒顶片帮、机械伤害', '确认帮顶板稳定；按设计施工锚杆、网片及喷浆并进行质量验收。']],
    ['探放水', '探放水作业步骤、安全防范措施及审批', ['钻孔位置', '孔深/孔数', '预计水压'], ['涌水、机械伤害、触电', '按审批方案施工；监测水量水压，排水能力满足要求并保持撤离通道畅通。']],
    ['空区', '空区探测、治理、爆破、采掘作业步骤、安全防范措施及审批', ['空区位置', '治理方式', '探测设计编号'], ['顶板冒落、突发塌陷', '由安全区向未知区探测；发现开裂沉降立即停止作业并撤离。']],
    ['基坑', '（危大工程）基坑作业步骤、安全防范措施及审批', ['基坑深度', '支护方案', '监测预警值'], ['坍塌、高处坠落、机械伤害', '按专项方案分层开挖、随挖随支；连续监测边坡、沉降与位移。']],
    ['脚手架', '（危大工程）脚手架作业步骤、安全防范措施及审批', ['架体高度', '搭设类型', '验收编号'], ['坍塌、高处坠落、物体打击', '材料与基础验收合格；按方案搭设连墙件、防护栏和安全网。']],
    ['模板', '（危大工程）模板作业步骤、安全防范措施及审批', ['模板高度', '支撑体系', '方案编号'], ['坍塌、高处坠落', '按专项方案安装支撑体系；浇筑前验收，拆模执行审批和顺序控制。']],
    ['拆除', '（危大工程）拆除工程作业步骤、安全防范措施及审批', ['拆除对象', '拆除方式', '警戒范围'], ['坍塌、物体打击、粉尘', '按方案自上而下分段拆除；设置封闭警戒区，严禁交叉作业。']],
    ['起重吊装及起重机械', '（危大工程）起重吊装及起重机械安装拆卸作业步骤、安全防范措施及审批', ['设备型号', '最大起重量', '安装拆卸方案'], ['起重伤害、设备倾覆', '基础和设备验收合格；按专项方案安拆、试吊并设专人指挥监护。']],
    ['交叉', '交叉作业模板作业步骤、安全防范措施及审批', ['交叉单位', '交叉时段', '统一协调人'], ['空间冲突、物体打击、误操作', '明确统一协调人和作业边界；错时错位施工，互相交底并保持通信。']]
  ];

  function normalize(type) {
    return String(type || '').replace('受限空间', '有限空间');
  }

  function templateFor(type) {
    const value = normalize(type);
    return templates.find(item => value.includes(item[0])) || null;
  }

  function signedCount(job) {
    const status = jobListStatus(job);
    if (status === '已完成') return 5;
    if (status === '作业中') return 4;
    if (status === '申请中') return 2;
    return 1;
  }

  const originalJobActions = jobActions;
  jobActions = function jobActionsWithTicket(job) {
    const actions = originalJobActions(job).filter(action => action[1] !== 'ticket');
    const deleteIndex = actions.findIndex(action => action[1] === 'delete');
    actions.splice(deleteIndex < 0 ? actions.length : deleteIndex, 0, ['作业票', 'ticket']);
    return actions;
  };

  showJobTicket = function showTemplateJobTicket(job) {
    const matchedTemplate = templateFor(job.type);
    const template = matchedTemplate || [
      normalize(job.type),
      `${String(job.type || '危险作业').replace(/作业$/, '')}作业票（正式模板待配置）`,
      ['作业专用参数'],
      ['待按正式模板维护', '附件2提供的18份模板中未发现该作业类型，当前不套用其他类型模板。']
    ];
    const count = signedCount(job);
    const start = job.start || String(job.time || '').split(' — ')[0];
    const end = job.end || String(job.time || '').split(' — ')[1] || '';
    const steps = Array.isArray(job.steps) && job.steps.length ? job.steps : [
      '作业前：核对审批、人员资质、设备工具和现场条件。',
      '作业中：按本类型模板和批准范围组织实施，全程监护。',
      '作业后：清点人员、工器具，恢复现场并完成验收。'
    ];
    const riskMeasures = Array.isArray(job.riskMeasures) && job.riskMeasures.length
      ? job.riskMeasures
      : [{ risk: template[3][0], measure: template[3][1] }];
    const signers = [
      ['作业负责人', job.owner || '张建国'],
      ['作业单位现场监护人', '王安全'],
      ['作业单位审批人', '李明远'],
      ['业主单位会审人员', '赵海峰'],
      ['业主单位作业审批人', '孙晓辉']
    ];
    title.textContent = '作业票打印';
    subtitle.textContent = `${template[1]} · ${job.id}`;
    content.innerHTML = `<div class="job-ticket-page">
      <div class="job-ticket-toolbar"><button class="ghost" id="backJobTicket">← 返回作业列表</button><span>${matchedTemplate ? `当前匹配：附件2.${templates.indexOf(matchedTemplate) + 1}模板` : '当前作业类型未匹配附件2正式模板'}</span><button class="primary" id="printJobTicket">打印作业票</button></div>
      <article class="formal-job-ticket">
        <h1>${template[1]}</h1><p class="ticket-code">作业票编号：${job.id}</p>
        ${matchedTemplate ? '' : '<div class="ticket-template-warning">附件2的18份正式作业模板中未发现当前作业类型。页面保留申请信息与签字记录，待补充正式模板后再按对应表式打印。</div>'}
        <table class="ticket-meta"><tbody>
          <tr><th>作业申请单位</th><td>${job.workUnit || '鞍钢集团矿业有限公司'}</td><th>申请时间</th><td>${job.applyTime || '2026-08-31 16:16'}</td></tr>
          <tr><th>作业名称</th><td>${job.name}</td><th>作业类型/等级</th><td>${job.type} / ${job.level || job.risk || '未分级'}</td></tr>
          <tr><th>作业内容</th><td colspan="3">${job.content || job.name}</td></tr>
          <tr><th>作业单位</th><td>${job.workUnit || '鞍钢集团矿业有限公司'}</td><th>作业负责人</th><td>${job.owner}</td></tr>
          <tr><th>作业地点及部位</th><td colspan="3">${job.area}</td></tr>
          <tr><th>批准作业时限</th><td colspan="3">自 ${start} 至 ${end} 止</td></tr>
        </tbody></table>
        <table class="ticket-special"><thead><tr>${template[2].map(label => `<th>${label}</th>`).join('')}</tr></thead><tbody><tr>${template[2].map((label, index) => `<td>${job.templateFields?.[label] || (index === 0 ? '按新增申请信息自动带入' : '—')}</td>`).join('')}</tr></tbody></table>
        <h2>作业步骤</h2>
        <table class="ticket-steps"><thead><tr><th>序号</th><th>作业步骤</th></tr></thead><tbody>${steps.map((step, index) => `<tr><td>${index + 1}</td><td>${typeof step === 'string' ? step : (step.content || step.name || '—')}</td></tr>`).join('')}</tbody></table>
        <h2>主要安全风险及安全防范措施</h2>
        <table class="ticket-measures"><thead><tr><th>序号</th><th>主要安全风险</th><th>安全防范措施</th></tr></thead><tbody>${riskMeasures.map((item, index) => `<tr><td>${index + 1}</td><td>${item.risk || item.name || '—'}</td><td>${item.measure || item.control || '—'}</td></tr>`).join('')}</tbody></table>
        <table class="ticket-zone"><tbody><tr><th>周边危险禁入区域告知</th><td>作业区域设置警戒线，非作业人员禁止进入；具体范围按现场交底确认。</td></tr></tbody></table>
        <h2>审批与签字</h2>
        <table class="ticket-signatures"><thead><tr><th>岗位/账户</th><th>意见</th><th>签字</th><th>时间</th></tr></thead><tbody>${signers.map((signer, index) => {
          const signed = index < count;
          return `<tr><td>${signer[0]}<small>账户：${signer[1]}</small></td><td>${signed ? '同意' : '待审批'}</td><td>${signed ? `<span>${signer[1]}</span>` : '—'}</td><td>${signed ? `2026-09-${String(index + 1).padStart(2, '0')} ${String(9 + index).padStart(2, '0')}:30` : '—'}</td></tr>`;
        }).join('')}</tbody></table>
        <section class="ticket-briefing"><b>涉及此项作业及辅助作业人员交底确认：</b><p>本人知晓作业内容、安全风险、安全措施、相关制度要求以及作业区域禁入范围。</p><div>作业人员签字：<span>郁坤朋</span>　<span>李作业</span>　<span>张安全</span></div></section>
        <footer>${matchedTemplate ? '模板来源：附件2鞍钢矿业危险作业审批模板（结合实际选取模板） · 系统按作业类型自动匹配' : '正式模板待确认：未擅自套用附件2中的其他作业类型模板'}</footer>
      </article>
    </div>`;
    document.querySelector('#backJobTicket').onclick = () => openView('jobs', document.querySelector('[data-work-group="危险作业"]') || document.querySelector('[data-view="jobs"]'));
    document.querySelector('#printJobTicket').onclick = () => window.print();
  };
})();
