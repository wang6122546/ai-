(() => {
  const card = document.querySelector('#mapPointCard'), stage = document.querySelector('.map-stage');
  let point = null;
  window.showEnhancedPointCard = function (item, event) {
    point = item;
    const rect = stage.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
    card.style.left = `${x}px`; card.style.top = `${Math.max(170, Math.min(rect.height - 170, y))}px`; card.classList.toggle('flip', x > rect.width - 350);
    document.querySelector('#pointCardKind').textContent = item.kind === 'job' ? '作业点位' : item.kind === 'site' ? '生产单位' : item.kind === 'monitor' ? '监控设备' : '隐患点位';
    document.querySelector('#pointCardTitle').textContent = item.name;
    document.querySelector('#pointCardMeta').textContent = item.kind === 'job' ? `${item.id} · ${item.type}${item.level ? ` / ${item.level}` : ''}` : `${item.type} · ${item.site || item.place}`;
    document.querySelector('#pointCardFacts').innerHTML = item.kind === 'job' ? `<div><dt>单位 / 地点</dt><dd>${item.site} / ${item.place}</dd></div><div><dt>流程节点</dt><dd>${item.progress}</dd></div><div><dt>计划时间</dt><dd>${item.planTime}</dd></div><div><dt>负责人 / 监护人</dt><dd>${item.owner} / ${item.watcher}</dd></div><div><dt>风险 / 异常</dt><dd>${item.risk} / ${item.abnormal}项</dd></div><div><dt>开工条件</dt><dd>${item.conditions}%</dd></div>` : `<div><dt>负责人 / 单位</dt><dd>${item.owner}</dd></div><div><dt>当前风险</dt><dd>${item.risk}</dd></div>`;
    document.querySelector('#pointCardStatus').textContent = item.status; document.querySelector('#pointCardMonitor').hidden = item.kind !== 'job'; card.hidden = false;
  };
  document.querySelector('#pointCardClose').onclick = event => { event.stopPropagation(); card.hidden = true; };
  document.querySelector('#pointCardDetail').onclick = event => { event.stopPropagation(); card.hidden = true; if (point) openDetail(point); };
  document.querySelector('#pointCardMonitor').onclick = event => { event.stopPropagation(); card.hidden = true; if (point) { openDetail(point); window.setTimeout(() => document.querySelector('#detailDrawer nav button:nth-child(2)')?.click(), 0); } };
})();
