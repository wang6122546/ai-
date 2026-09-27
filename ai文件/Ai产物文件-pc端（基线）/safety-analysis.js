(() => {
  const statuses = ['申请中', '作业中', '已完成', '已作废', '已暂停'];
  const types = ['动火作业', '高处作业', '有限空间作业', '吊装作业', '临时用电作业', '动土作业', '断路作业', '交叉作业', '危大工程', '常规作业'];
  const riskNames = ['红色风险', '橙色风险', '黄色风险', '蓝色风险', '绿色风险', '灰色状态'];
  const riskLabels = {'红色风险':'红色风险','橙色风险':'橙色风险','黄色风险':'黄色风险','蓝色风险':'蓝色风险','绿色风险':'绿色风险','灰色状态':'灰色状态'};
  const colors = {'申请中':'#4487ef','作业中':'#17adc2','已完成':'#25ad72','已作废':'#9aa8b8','已暂停':'#e35b58','红色风险':'#d94b54','橙色风险':'#ec8d3c','黄色风险':'#e7bf39','蓝色风险':'#4487ef','绿色风险':'#25ad72','灰色状态':'#9aa8b8'};
  const anomalyDefs = [
    ['未关闭隐患', x => x.hazards > 0, x => x.hazards, '#ec8d3c'],
    ['已整改待复查', x => x.hazardPendingReview > 0, x => x.hazardPendingReview, '#e7bf39'],
    ['已闭环隐患', x => x.hazardClosed > 0, x => x.hazardClosed, '#25ad72'],
    ['气体检测异常', x => x.gas === '超限', () => 1, '#d94b54'],
    ['视频设备离线', x => x.video === '离线', () => 1, '#ec8d3c'],
    ['交底未全员完成', x => x.briefing === '未全员完成', () => 1, '#e7bf39'],
    ['监管确认发现问题', x => x.supervisionIssue, () => 1, '#ec8d3c'],
    ['超时或暂停作业', x => x.timeout || x.status === '已暂停', () => 1, '#d94b54']
  ];
  const today = '2026-09-24';
  const iso = date => date.toISOString().slice(0, 10);
  const shift = (value, days) => { const d = new Date(`${value}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return iso(d); };
  const pct = (a, b) => b ? `${Math.round(a / b * 100)}%` : '—';
  const text = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const state = {period:90, start:shift(today,-89), end:today, unit:'', type:'', level:'', status:'', risk:'', trend:'appliedAt', unitMode:'status', anomalyMode:'category', facets:{}, hidden:new Set(), list:null, detail:null};
  let root;
  const data = () => window.SafetyWorkRecords;
  const selected = () => data().filter(x => x.appliedAt >= state.start && x.appliedAt <= state.end && (!state.unit || x.site === state.unit) && (!state.type || x.type === state.type) && (!state.level || x.level === state.level) && (!state.status || x.status === state.status) && (!state.risk || x.risk === state.risk) && Object.entries(state.facets).every(([key,value]) => key === 'anomaly' ? anomalyDefs.find(a => a[0] === value)?.[1](x) : key === 'metric' ? metricPredicates[value]?.(x) : x[key] === value));
  const metricPredicates = {all:() => true,申请中:x => x.status === '申请中',作业中:x => x.status === '作业中',已完成:x => x.status === '已完成',高风险作业:x => ['红色风险','橙色风险'].includes(x.risk),发生异常作业:x => x.abnormal > 0,隐患闭环率:x => x.hazardClosed + x.hazardPendingReview + x.hazards > 0,按期完成率:x => x.status === '已完成'};
  const empty = message => `<div class="analysis-empty"><b>${message}</b><span>请调整筛选条件或统计周期</span></div>`;
  const options = (items, first) => `<option value="">${first}</option>${items.map(x => `<option value="${text(x)}">${text(x)}</option>`).join('')}`;
  const chart = (title, body, extra='', note='口径：当前筛选周期内申请的作业票') => `<section class="analysis-card"><header><div><h3>${title}</h3><small>${note}</small></div>${extra}</header>${body}</section>`;
  const comparison = (predicate, rows) => {
    const days = Math.round((new Date(state.end) - new Date(state.start)) / 86400000) + 1;
    const before = data().filter(x => x.appliedAt >= shift(state.start,-days) && x.appliedAt < state.start && predicate(x)).length;
    const current = rows.filter(predicate).length;
    return before ? `较上周期 ${current >= before ? '+' : ''}${Math.round((current-before)/before*100)}%` : '上周期暂无同口径数据';
  };
  const tooltip = (label, count, total, rows, predicate) => `${label}：${count}项，占比${pct(count,total)}；${comparison(predicate,rows)}`;

  function filterMarkup() {
    return `<section class="analysis-filter analysis-card"><div class="analysis-filter-head"><div><h2>作业分析</h2><p>从申请、开工、风险、异常到验收，按同一作业票口径汇总</p></div><span class="analysis-demo">原型演示数据 · 与安全作业一张图共用</span></div><div class="analysis-filter-grid">
      <label>组织 / 生产单位<select id="analysisUnit">${options([...new Set(data().map(x=>x.site))],'全部单位')}</select></label>
      <label>作业类型<select id="analysisType">${options(types,'全部类型')}</select></label>
      <label>作业等级<select id="analysisLevel">${options([...new Set(data().map(x=>x.level))],'全部等级')}</select></label>
      <label>作业状态<select id="analysisStatus">${options(statuses,'全部状态')}</select></label>
      <label>风险等级<select id="analysisRisk">${options(riskNames,'全部风险')}</select></label>
      <div class="analysis-period"><span>统计周期</span><div>${[7,30,90].map(n=>`<button type="button" data-period="${n}" class="${state.period===n?'active':''}">近${n}天</button>`).join('')}</div></div>
      <label>开始日期<input type="date" id="analysisStart" value="${state.start}"></label><label>结束日期<input type="date" id="analysisEnd" value="${state.end}"></label>
      <div class="analysis-filter-actions"><button id="analysisQuery" class="analysis-primary">查询</button><button id="analysisReset">重置</button></div>
    </div><div class="analysis-period-note">当前统计周期：<b>${state.start} 至 ${state.end}</b><span>按作业申请日期纳入；趋势系列按对应事件日期统计</span></div></section>`;
  }

  function kpis(rows) {
    const total = rows.length, completed = rows.filter(x=>x.status==='已完成');
    const hazards = rows.reduce((n,x)=>n+x.hazards+x.hazardPendingReview+x.hazardClosed,0), closed = rows.reduce((n,x)=>n+x.hazardClosed,0);
    const metrics = [
      ['作业总数',total,'all','blue'],['申请中',rows.filter(metricPredicates.申请中).length,'申请中','blue'],['作业中',rows.filter(metricPredicates.作业中).length,'作业中','cyan'],['已完成',completed.length,'已完成','green'],
      ['高风险作业',rows.filter(metricPredicates.高风险作业).length,'高风险作业','orange'],['发生异常作业',rows.filter(metricPredicates.发生异常作业).length,'发生异常作业','red'],
      ['隐患闭环率',pct(closed,hazards),'隐患闭环率','green'],['按期完成率',pct(completed.filter(x=>x.onTime).length,completed.length),'按期完成率','green']
    ];
    return `<section class="analysis-kpis">${metrics.map(([label,value,key,tone])=>`<button class="analysis-kpi ${tone}" data-metric="${key}" title="点击筛选对应作业"><span>${label}</span><b>${value}</b><small>${key==='隐患闭环率'?`${closed}/${hazards} 条隐患`:key==='按期完成率'?`${completed.filter(x=>x.onTime).length}/${completed.length} 项已完成`:'点击查看相关作业'}</small></button>`).join('')}</section>`;
  }

  function statusChart(rows) {
    if (!rows.length) return chart('作业状态分布',empty('当前条件下暂无作业'));
    const total = rows.length, order = statuses, counts = order.map(name=>rows.filter(x=>x.status===name).length);
    const visibleTotal=order.reduce((n,name,i)=>n+(state.hidden.has(`status:${name}`)?0:counts[i]),0);
    let cursor=0;const segments=order.filter(name=>!state.hidden.has(`status:${name}`)).map(name=>{const width=visibleTotal?counts[order.indexOf(name)]/visibleTotal*100:0;const result=`${colors[name]} ${cursor}% ${cursor+width}%`;cursor+=width;return result});
    const donut=`<div class="analysis-donut" style="background:${segments.length?`conic-gradient(${segments.join(',')})`:'#edf2f8'}"><div><b>${total}</b><span>作业总数</span></div></div>`;
    const legend=order.map((name,i)=>`<button class="analysis-legend ${state.hidden.has(`status:${name}`)?'muted':''}" data-legend="status:${name}" title="点击隐藏或显示系列"><i style="background:${colors[name]}"></i>${name}<b>${counts[i]}</b><small>${pct(counts[i],total)}</small></button>`).join('');
    const list=order.filter((_,i)=>counts[i]&&!state.hidden.has(`status:${order[i]}`)).map(name=>`<button class="analysis-slice" data-facet="status" data-value="${name}" title="${tooltip(name,counts[order.indexOf(name)],total,rows,x=>x.status===name)}"><i style="background:${colors[name]}"></i>${name}<b>${counts[order.indexOf(name)]} 项</b></button>`).join('');
    return chart('作业状态分布',`<div class="analysis-donut-layout">${donut}<div>${list}${legend}</div></div>`);
  }

  function bars(rows, values, facet, title, colorFn, note) {
    if (!rows.length) return chart(title,empty('当前条件下暂无作业'),'',note);
    const max=Math.max(1,...values.map(v=>v[1]));
    const legend=facet==='risk'?`<div class="analysis-key">${values.map(([name])=>`<button data-legend="risk:${name}" class="${state.hidden.has(`risk:${name}`)?'muted':''}" title="点击隐藏或显示${name}"><i style="background:${colorFn(name,0)}"></i>${name}</button>`).join('')}</div>`:'';
    return chart(title,`<div class="analysis-horizontal">${values.map(([name,n],i)=>`<button class="analysis-bar-row" data-facet="${facet}" data-value="${text(name)}" title="${tooltip(name,n,rows.length,rows,x=>facet==='risk'?x.risk===name:facet==='type'?x.type===name:true)}"><span>${text(facet==='risk'?riskLabels[name]||name:name)}</span><i><em style="width:${state.hidden.has(`${facet}:${name}`)?0:n/max*100}%;background:${colorFn(name,i)}"></em></i><b>${n}</b><small>${pct(n,rows.length)}</small></button>`).join('')}</div>${legend}`,'',note);
  }

  function trendChart(rows) {
    const modes=[['appliedAt','新增申请'],['startedAt','实际开工'],['completedAt','完成验收']];
    const switcher=`<div class="analysis-switch">${modes.map(([key,label])=>`<button data-trend="${key}" class="${state.trend===key?'active':''}">${label}</button>`).join('')}</div>`;
    if (!rows.length) return chart('作业趋势',empty('当前条件下暂无作业'),switcher,'单位：项；横轴为实际日历日期');
    const dates=[];for(let day=state.start;day<=state.end;day=shift(day,1)) dates.push(day);
    const counts=dates.map(day=>rows.filter(x=>x[state.trend]===day).length),max=Math.max(1,...counts);
    const left=42,top=18,width=710,height=190,bottom=top+height;
    const coords=counts.map((n,i)=>[left+(dates.length===1?0:i/(dates.length-1))*width,bottom-n/max*height]);
    const poly=coords.map(p=>p.join(',')).join(' '),ticks=[0,1,2,3].map(i=>`<g><line x1="${left}" x2="${left+width}" y1="${bottom-i*height/3}" y2="${bottom-i*height/3}"/><text x="${left-8}" y="${bottom-i*height/3+4}" text-anchor="end">${Math.round(max*i/3)}</text></g>`).join('');
    const stride=Math.max(1,Math.ceil(dates.length/7));const labels=dates.map((d,i)=>i%stride===0||i===dates.length-1?`<text x="${coords[i][0]}" y="${bottom+24}" text-anchor="middle">${d.slice(5)}</text>`:'').join('');
    const dots=coords.map(([x,y],i)=>counts[i]?`<circle data-date="${dates[i]}" cx="${x}" cy="${y}" r="5"><title>${dates[i]}：${counts[i]}项，占比${pct(counts[i],rows.length)}；${i&&counts[i-1]?`较前一日 ${counts[i]>=counts[i-1]?'+':''}${Math.round((counts[i]-counts[i-1])/counts[i-1]*100)}%`:'前一日无同口径记录'}</title></circle>`:'').join('');
    return chart('作业趋势',`<div class="analysis-trend"><svg viewBox="0 0 780 250" role="img" aria-label="${modes.find(x=>x[0]===state.trend)[1]}日期趋势">${ticks}<polyline points="${poly}"/>${dots}${labels}<text x="10" y="16">项</text></svg></div>`,switcher,'单位：项；横轴为实际日历日期，点击节点查看作业');
  }

  function unitsChart(rows) {
    const units=[...new Set(data().map(x=>x.site))];const modes=[['status','状态构成'],['high','高风险作业数'],['abnormal','异常作业数'],['ontime','按期完成率']];
    const switcher=`<div class="analysis-switch">${modes.map(([key,label])=>`<button data-unit-mode="${key}" class="${state.unitMode===key?'active':''}">${label}</button>`).join('')}</div>`;
    if (!rows.length) return chart('各单位作业统计',empty('当前条件下暂无作业'),switcher);
    const max=Math.max(1,...units.map(unit=>rows.filter(x=>x.site===unit).length));
    const body=units.map(unit=>{const subset=rows.filter(x=>x.site===unit),n=subset.length,done=subset.filter(x=>x.status==='已完成');
      let bar='',value='';
      if(state.unitMode==='status'){bar=['申请中','作业中','已完成','已暂停','已作废'].filter(key=>!state.hidden.has(`unit:${key}`)).map(key=>`<em style="width:${subset.filter(x=>x.status===key).length/max*100}%;background:${colors[key]}" title="${key} ${subset.filter(x=>x.status===key).length}项"></em>`).join('');value=`${n}项`}
      else {const amount=state.unitMode==='high'?subset.filter(metricPredicates.高风险作业).length:state.unitMode==='abnormal'?subset.filter(metricPredicates.发生异常作业).length:done.filter(x=>x.onTime).length;const denom=state.unitMode==='ontime'?done.length:max;bar=`<em style="width:${denom?amount/denom*100:0}%;background:${state.unitMode==='high'?'#ec8d3c':state.unitMode==='abnormal'?'#d94b54':'#25ad72'}"></em>`;value=state.unitMode==='ontime'?pct(amount,denom):`${amount}项`}
      return `<button class="analysis-unit-row" data-facet="site" data-value="${unit}" title="${unit}：${n}项，占比${pct(n,rows.length)}；${comparison(x=>x.site===unit,rows)}"><span>${unit}</span><i>${bar}</i><b>${value}</b></button>`}).join('');
    return chart('各单位作业统计',`<div class="analysis-unit-bars">${body}</div><div class="analysis-key">${['申请中','作业中','已完成','已暂停','已作废'].map(x=>`<button data-legend="unit:${x}" class="${state.hidden.has(`unit:${x}`)?'muted':''}"><i style="background:${colors[x]}"></i>${x}</button>`).join('')}</div>`,switcher,'单位：项；同一作业票只归属一个生产单位');
  }

  function anomaliesChart(rows) {
    const switcher=`<div class="analysis-switch"><button data-anomaly-mode="category" class="${state.anomalyMode==='category'?'active':''}">异常类型</button><button data-anomaly-mode="trend" class="${state.anomalyMode==='trend'?'active':''}">异常趋势</button></div>`;
    if(!rows.length)return chart('隐患及异常分析',empty('当前条件下暂无作业'),switcher);
    if(state.anomalyMode==='trend'){
      const dates=[];for(let day=state.start;day<=state.end;day=shift(day,1))dates.push(day);
      const counts=dates.map(day=>rows.filter(x=>x.appliedAt===day&&x.abnormal>0).length),max=Math.max(1,...counts),left=42,top=18,width=710,height=190,bottom=top+height;
      const coords=counts.map((n,i)=>[left+(dates.length===1?0:i/(dates.length-1))*width,bottom-n/max*height]);
      const ticks=[0,1,2,3].map(i=>`<g><line x1="${left}" x2="${left+width}" y1="${bottom-i*height/3}" y2="${bottom-i*height/3}"/><text x="${left-8}" y="${bottom-i*height/3+4}" text-anchor="end">${Math.round(max*i/3)}</text></g>`).join('');
      const stride=Math.max(1,Math.ceil(dates.length/7)),labels=dates.map((day,i)=>i%stride===0||i===dates.length-1?`<text x="${coords[i][0]}" y="${bottom+24}" text-anchor="middle">${day.slice(5)}</text>`:'').join('');
      const dots=coords.map(([x,y],i)=>counts[i]?`<circle data-anomaly-date="${dates[i]}" cx="${x}" cy="${y}" r="5"><title>${dates[i]}：${counts[i]}项异常作业；点击查看关联记录</title></circle>`:'').join('');
      return chart('隐患及异常分析',`<div class="analysis-trend anomaly-trend"><svg viewBox="0 0 780 250" role="img" aria-label="异常作业日期趋势">${ticks}<polyline points="${coords.map(p=>p.join(',')).join(' ')}"/>${dots}${labels}<text x="10" y="16">项</text></svg></div>`,switcher,'单位：项；按异常作业的申请日期统计');
    }
    const vals=anomalyDefs.map(([name,predicate,amount,color])=>[name,rows.filter(predicate).reduce((n,x)=>n+amount(x),0),color]);const max=Math.max(1,...vals.map(x=>x[1]));
    return chart('隐患及异常分析',`<div class="analysis-horizontal">${vals.map(([name,n,color])=>`<button class="analysis-bar-row" data-facet="anomaly" data-value="${name}" title="${name}：${n}条/项；点击查看关联作业"><span>${name}</span><i><em style="width:${n/max*100}%;background:${color}"></em></i><b>${n}</b><small>${n?'查看':'—'}</small></button>`).join('')}</div>`,switcher,'隐患按条计，气体/视频/交底/监管/超时按关联作业计');
  }

  function unitTable(rows) {
    if(!rows.length)return chart('单位分析明细',empty('当前条件下暂无单位明细'));
    const units=[...new Set(rows.map(x=>x.site))];
    const body=units.map(unit=>{const items=rows.filter(x=>x.site===unit),done=items.filter(x=>x.status==='已完成'),hazards=items.reduce((n,x)=>n+x.hazards+x.hazardPendingReview+x.hazardClosed,0),closed=items.reduce((n,x)=>n+x.hazardClosed,0),latest=[...items].sort((a,b)=>b.recentAt.localeCompare(a.recentAt))[0]?.recentAt||'—';
      return `<tr><td><b>${unit}</b></td><td>${items.length}</td><td>${items.filter(x=>x.status==='作业中').length}</td><td class="risk-count">${items.filter(metricPredicates.高风险作业).length}</td><td class="risk-count">${items.filter(metricPredicates.发生异常作业).length}</td><td>${items.reduce((n,x)=>n+x.hazards,0)}</td><td>${pct(closed,hazards)}</td><td>${pct(done.filter(x=>x.onTime).length,done.length)}</td><td>${(items.reduce((n,x)=>n+x.approvalHours,0)/items.length).toFixed(1)} 小时</td><td>${latest}</td><td><button data-unit-detail="${unit}">查看详情</button></td></tr>`}).join('');
    return `<section class="analysis-card analysis-table-card"><header><div><h3>单位分析明细</h3><small>口径：当前筛选后，每张作业票仅计入所属生产单位一次</small></div><span>共 ${units.length} 个单位</span></header><div class="analysis-table-scroll"><table><thead><tr>${['生产单位','作业总数','作业中','高风险作业','异常作业','未关闭隐患','隐患闭环率','按期完成率','平均审批时长','最近作业时间','操作'].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div></section>`;
  }

  function overlay(rows) {
    if(!state.list&&!state.detail)return '';
    if(state.detail){const x=state.detail;return `<div class="analysis-overlay"><button class="analysis-overlay-mask" data-close-overlay aria-label="关闭详情"></button><aside class="analysis-drawer"><header><div><small>作业全过程</small><h2>${text(x.name)}</h2></div><button data-close-overlay aria-label="关闭">×</button></header><div class="analysis-drawer-body"><p class="analysis-ticket">${x.id} · ${x.status} · ${riskLabels[x.risk]||x.risk}</p>${[['作业信息',`${x.type} / ${x.level} · ${x.site} / ${x.place} · 负责人 ${x.owner} / 监护人 ${x.watcher}`],['申请与计划',`申请 ${x.appliedAt} · 计划 ${x.planTime}`],['风险与措施',`${riskLabels[x.risk]||x.risk} · 开工条件完成 ${x.conditions}%`],['气体与视频',`气体${x.gas} · 视频${x.video}`],['交底与审批',`交底${x.briefing} · 当前节点${x.progress} · 审批耗时${x.approvalHours}小时`],['隐患与监管',`未关闭${x.hazards}条 · 待复查${x.hazardPendingReview}条 · 已闭环${x.hazardClosed}条 · ${x.supervisionIssue?'监管发现问题':'未记录监管问题'}`],['收尾与验收',x.completedAt?`完成验收 ${x.completedAt} · ${x.onTime?'按期完成':'超期完成'}`:'尚未完成验收']].map(([h,v])=>`<section><h3>${h}</h3><p>${text(v)}</p></section>`).join('')}</div></aside></div>`;}
    const listing=state.list, matching=rows.filter(listing.predicate);
    const summary=listing.unit&&matching.length?`<div class="analysis-unit-summary"><div><b>${matching.length}</b><span>作业总数</span></div><div><b>${matching.filter(metricPredicates.高风险作业).length}</b><span>高风险</span></div><div><b>${matching.filter(metricPredicates.发生异常作业).length}</b><span>异常作业</span></div></div><section class="analysis-unit-context"><h3>类型、区域、风险和趋势</h3><p>主要类型：${types.map(type=>[type,matching.filter(x=>x.type===type).length]).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]).slice(0,3).map(x=>`${x[0]} ${x[1]}项`).join('、')}</p><p>重点区域：${[...new Set(matching.map(x=>x.place))].map(place=>[place,matching.filter(x=>x.place===place&&metricPredicates.高风险作业(x)).length]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>`${x[0]}高风险${x[1]}项`).join('、')}</p><p>风险：红色 ${matching.filter(x=>x.risk==='红色风险').length} 项，橙色 ${matching.filter(x=>x.risk==='橙色风险').length} 项</p><p>异常：气体 ${matching.filter(x=>x.gas==='超限').length} 项，视频离线 ${matching.filter(x=>x.video==='离线').length} 项，未关闭隐患 ${matching.reduce((n,x)=>n+x.hazards,0)} 条</p><p>最近作业申请：${[...matching].sort((a,b)=>b.appliedAt.localeCompare(a.appliedAt)).slice(0,3).map(x=>x.appliedAt).join('、')}</p></section>`:'';
    const trend=listing.unit&&matching.length?(() => {const buckets=Array.from({length:6},(_,i)=>{const end=shift(state.end,-(5-i)*7),start=shift(end,-6);return {label:start.slice(5),count:matching.filter(x=>x.appliedAt>=start&&x.appliedAt<=end).length}}),max=Math.max(1,...buckets.map(x=>x.count));return `<section class="analysis-unit-trend"><h3>近六周新增申请趋势</h3><div>${buckets.map(x=>`<span title="${x.label} 起七天：${x.count}项"><i style="height:${x.count/max*100}%"></i><b>${x.count}</b><small>${x.label}</small></span>`).join('')}</div></section>`})():'';
    return `<div class="analysis-overlay"><button class="analysis-overlay-mask" data-close-overlay aria-label="关闭清单"></button><aside class="analysis-drawer"><header><div><small>${listing.unit?'生产单位分析':'关联作业清单'}</small><h2>${text(listing.title)}</h2></div><button data-close-overlay aria-label="关闭">×</button></header><div class="analysis-drawer-body"><p class="analysis-ticket">当前条件下 ${matching.length} 项作业</p>${summary}${trend}${matching.length?matching.map(x=>`<button class="analysis-list-row" data-job-id="${x.id}"><b>${text(x.name)}</b><small>${x.id} · ${x.site} / ${x.place} · ${x.status} · ${riskLabels[x.risk]||x.risk}</small><span>查看作业详情 ›</span></button>`).join(''):empty('没有关联作业记录')}</div></aside></div>`;
  }

  function render() {
    if(!root)return;
    if(window.SafetyAnalysisPermission===false){root.innerHTML='<div class="analysis-state"><h2>无权查看辅助分析</h2><p>请联系管理员开通相应生产单位的数据权限。</p></div>';return;}
    if(!Array.isArray(data())){root.innerHTML='<div class="analysis-state"><h2>作业数据加载失败</h2><p>共享作业数据不可用，请刷新页面重试。</p><button id="analysisRetry">重新加载</button></div>';root.querySelector('#analysisRetry').onclick=()=>location.reload();return;}
    const rows=selected(),typesCount=types.map(name=>[name,rows.filter(x=>x.type===name).length]).sort((a,b)=>b[1]-a[1]);
    const riskCount=riskNames.map(name=>[name,rows.filter(x=>x.risk===name).length]);
    const facets=Object.entries(state.facets).map(([key,value])=>`<button data-clear-facet="${key}">${text(value)} ×</button>`).join('');
    root.innerHTML=filterMarkup()+`<div class="analysis-filter-state"><span>当前统计 ${rows.length} 项作业</span>${facets}<button id="analysisClearChart" ${facets?'':'hidden'}>清除图表筛选</button></div>`+kpis(rows)+`<div class="analysis-chart-grid">${statusChart(rows)}${bars(rows,typesCount,'type','作业类型分布',(_,i)=>['#4487ef','#17adc2','#ec8d3c','#25ad72','#8a79d8'][i%5],'单位：项；按作业类型降序，零值保留供核对配置')}${trendChart(rows)}${bars(rows,riskCount,'risk','风险等级分布',name=>colors[name],'单位：项；风险标签与安全作业一张图一致')}${unitsChart(rows)}${anomaliesChart(rows)}</div>`+unitTable(rows)+overlay(rows);
    ['Unit','Type','Level','Status','Risk'].forEach(key=>{const el=root.querySelector(`#analysis${key}`);if(el)el.value=state[key.toLowerCase()]});
    bind(rows);
  }

  function openList(title,predicate,unit=''){state.detail=null;state.list={title,predicate,unit};render();}
  function bind(rows) {
    root.querySelectorAll('[data-period]').forEach(b=>b.onclick=()=>{state.period=+b.dataset.period;state.start=shift(today,1-state.period);state.end=today;state.facets={};state.list=null;render()});
    root.querySelector('#analysisQuery').onclick=()=>{const start=root.querySelector('#analysisStart').value,end=root.querySelector('#analysisEnd').value;const input=root.querySelector('#analysisStart');input.setCustomValidity(!start||!end||start>end?'请选择有效的日期范围':'');if(!input.checkValidity()){input.reportValidity();return}state.start=start;state.end=end;state.period=0;['Unit','Type','Level','Status','Risk'].forEach(key=>state[key.toLowerCase()]=root.querySelector(`#analysis${key}`).value);state.facets={};state.list=null;render()};
    root.querySelector('#analysisReset').onclick=()=>{Object.assign(state,{period:90,start:shift(today,-89),end:today,unit:'',type:'',level:'',status:'',risk:'',facets:{},list:null,detail:null});render()};
    root.querySelector('#analysisClearChart').onclick=()=>{state.facets={};state.list=null;render()};
    root.querySelectorAll('[data-clear-facet]').forEach(b=>b.onclick=()=>{delete state.facets[b.dataset.clearFacet];state.list=null;render()});
    root.querySelectorAll('[data-metric]').forEach(b=>b.onclick=()=>{const key=b.dataset.metric;state.facets.metric=key;openList(key,metricPredicates[key])});
    root.querySelectorAll('[data-facet]').forEach(b=>b.onclick=()=>{const facet=b.dataset.facet,value=b.dataset.value;state.facets[facet]=value;const predicate=facet==='anomaly'?anomalyDefs.find(x=>x[0]===value)[1]:x=>x[facet]===value;openList(value,predicate)});
    root.querySelectorAll('[data-legend]').forEach(b=>b.onclick=()=>{state.hidden.has(b.dataset.legend)?state.hidden.delete(b.dataset.legend):state.hidden.add(b.dataset.legend);render()});
    root.querySelectorAll('[data-trend]').forEach(b=>b.onclick=()=>{state.trend=b.dataset.trend;render()});
    root.querySelectorAll('[data-unit-mode]').forEach(b=>b.onclick=()=>{state.unitMode=b.dataset.unitMode;render()});
    root.querySelectorAll('[data-anomaly-mode]').forEach(b=>b.onclick=()=>{state.anomalyMode=b.dataset.anomalyMode;render()});
    root.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{const date=b.dataset.date;openList(`${date} ${state.trend==='appliedAt'?'新增申请':state.trend==='startedAt'?'实际开工':'完成验收'}`,x=>x[state.trend]===date)});
    root.querySelectorAll('[data-anomaly-date]').forEach(b=>b.onclick=()=>{const date=b.dataset.anomalyDate;openList(`${date} 异常作业`,x=>x.appliedAt===date&&x.abnormal>0)});
    root.querySelectorAll('[data-unit-detail]').forEach(b=>b.onclick=()=>{state.facets.site=b.dataset.unitDetail;openList(`${b.dataset.unitDetail}作业分析`,x=>x.site===b.dataset.unitDetail,b.dataset.unitDetail)});
    root.querySelectorAll('[data-job-id]').forEach(b=>b.onclick=()=>{state.detail=data().find(x=>x.id===b.dataset.jobId);state.list=null;render()});
    root.querySelectorAll('[data-close-overlay]').forEach(b=>b.onclick=()=>{state.detail=null;state.list=null;render()});
  }

  window.setupSafetyAnalysis=()=>{root=document.querySelector('#safetyAnalysis');if(root)render()};
})();
