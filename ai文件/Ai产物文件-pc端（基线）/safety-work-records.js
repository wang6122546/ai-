/* PC 原型共用作业票数据；一张图与辅助分析从同一数组读取。 */
(() => {
  const types = [...Array(8).fill('动火作业'), ...Array(6).fill('高处作业'), ...Array(5).fill('有限空间作业'), ...Array(4).fill('吊装作业'), ...Array(3).fill('临时用电作业')];
  const statuses = [...Array(9).fill('申请中'), ...Array(7).fill('作业中'), '已暂停', ...Array(9).fill('已完成')];
  const units = ['齐大山选矿厂', '东鞍山铁矿', '眼前山铁矿', '海城市作业区'];
  const owners = ['张建国', '李明远', '刘志强', '孙晓辉', '赵海峰', '王安全'];
  const centers = {齐大山选矿厂:[123.075,41.208],东鞍山铁矿:[123.105,41.038],眼前山铁矿:[123.145,40.980],海城市作业区:[122.720,40.880]};
  const date = offset => { const value = new Date(Date.UTC(2026, 8, 24 - offset)); return value.toISOString().slice(0, 10); };
  window.SafetyWorkRecords = types.map((type, i) => {
    const site = units[i % units.length], center = centers[site], cluster = i < 5, missing = i >= 24;
    const status = statuses[i], appliedAt = date((i * 3) % 88), startedAt = status === '申请中' ? null : date(Math.max(0, (i * 3) % 88 - 1));
    const completedAt = status === '已完成' ? date(Math.max(0, (i * 3) % 88 - 2)) : null;
    const gas = status !== '已完成' && i % 7 === 0 ? '超限' : '正常', video = status !== '已完成' && i % 8 === 0 ? '离线' : '在线';
    const hazardCount = status !== '已完成' && i % 4 === 0 ? 1 : 0, hazardPendingReview = hazardCount && i % 8 === 0 ? 1 : 0;
    const flow = i < 7 ? '待审批' : i < 10 ? '待监管确认' : i < 12 ? '待验收' : '';
    const briefing = status !== '已完成' && i % 9 === 0 ? '未全员完成' : '已完成', supervisionIssue = status !== '已完成' && i % 10 === 0;
    const timeout = status === '申请中' && [2, 8].includes(i);
    const hazards = hazardCount - hazardPendingReview;
    const abnormal = Number(gas === '超限') + Number(video === '离线') + hazards + hazardPendingReview + Number(briefing === '未全员完成') + Number(supervisionIssue) + Number(timeout || status === '已暂停');
    return {
      id: `ZY20260924${String(i + 1).padStart(3, '0')}`, kind: 'job', name: `${site}${type.replace('作业', '')}作业${i + 1}`,
      type, category: i < 19 ? '危险作业' : i < 22 ? '危大工程' : i < 24 ? '交叉作业' : '常规作业',
      site, district: site === '齐大山选矿厂' ? '立山区' : site === '海城市作业区' ? '海城市' : '千山区',
      place: ['选矿车间', '井下泵房', '尾矿库', '粗破站'][i % 4], owner: owners[i % owners.length], watcher: owners[(i + 2) % owners.length],
      status, level: ['特级', '一级', '二级'][i % 3], flow, plan: i < 12 ? '本周计划' : '', ticket: i < 9 ? '已关联作业票' : i < 12 ? '待发起作业' : '',
      risk: status === '已完成' ? '绿色风险' : gas === '超限' || status === '已暂停' ? '红色风险' : status === '申请中' ? '黄色风险' : i % 3 === 0 ? '橙色风险' : '蓝色风险',
      abnormal, conditions: i % 6 === 0 ? 75 : 100,
      gas, video, briefing, hazards,
      hazardPendingReview, hazardClosed: i % 5 === 0 ? 1 : 0, supervisionIssue,
      timeout, onTime: completedAt ? i % 4 !== 0 : null,
      approvalHours: 2 + i % 9, appliedAt, startedAt, completedAt, recentAt: completedAt || startedAt || appliedAt,
      planTime: `${appliedAt} 08:30—17:30`, progress: flow || status,
      lng: missing ? null : center[0] + (cluster ? 0 : ((i % 5) - 2) * .006),
      lat: missing ? null : center[1] + (cluster ? 0 : ((i % 4) - 1.5) * .006)
    };
  });
})();
