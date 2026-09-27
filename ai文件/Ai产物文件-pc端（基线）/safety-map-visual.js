(() => {
  const svg = document.querySelector('#cityMap');
  const stage = document.querySelector('.map-stage');
  const pointLayer = document.querySelector('#pointLayer');
  const districtLayer = document.querySelector('#districtLayer');
  const areaLayer = document.querySelector('#areaLayer');
  if (!svg || !stage || !pointLayer) return;
  const ns = 'http://www.w3.org/2000/svg';
  const labelLayer = document.createElementNS(ns, 'g');
  labelLayer.id = 'gisLabelLayer';
  const areaLabels = document.createElementNS(ns, 'g');
  areaLabels.id = 'gisAreaLabels';
  const districtLabels = document.createElementNS(ns, 'g');
  districtLabels.id = 'gisDistrictLabels';
  labelLayer.append(areaLabels, districtLabels);
  svg.append(labelLayer);
  const clamp = (min, max, value) => Math.max(min, Math.min(max, value));
  let pending = false;
  let lastDistrictMarkup = '', lastAreaMarkup = '';

  function syncLabels() {
    const districtSource = [...districtLayer.querySelectorAll('.district-shape')];
    const districtMarkup = districtSource.map(group => `${group.dataset.code}:${group.classList.contains('is-hidden')}`).join('|');
    if (districtMarkup !== lastDistrictMarkup) {
      districtLabels.replaceChildren(...districtSource.filter(group => !group.classList.contains('is-hidden')).map(group => group.querySelector('text').cloneNode(true)));
      lastDistrictMarkup = districtMarkup;
    }
    const source = [...areaLayer.querySelectorAll('text.area-label,text.facility-caption')];
    const areaMarkup = source.map(el => `${el.className.baseVal}:${el.getAttribute('x')}:${el.getAttribute('y')}:${el.textContent}`).join('|');
    if (areaMarkup !== lastAreaMarkup) {
      areaLabels.replaceChildren(...source.map(el => el.cloneNode(true)));
      lastAreaMarkup = areaMarkup;
    }
  }

  function update() {
    pending = false;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const pxPerUnit = Math.hypot(matrix.a, matrix.b);
    if (!pxPerUnit) return;
    const box = svg.viewBox.baseVal;
    const zoom = 1000 / box.width;
    const level = stage.classList.contains('factory-view') ? (box.width <= 120 ? 'area' : 'factory') : box.width <= 500 ? 'district' : 'city';
    stage.dataset.gisLevel = level;
    syncLabels();
    districtLabels.style.display = stage.classList.contains('factory-view') ? 'none' : '';
    districtLabels.querySelectorAll('text').forEach(el => {
      el.style.fontSize = `${(level === 'city' ? 11.5 : 12.5) / pxPerUnit}px`;
      el.style.strokeWidth = `${1.4 / pxPerUnit}px`;
    });
    areaLabels.querySelectorAll('text').forEach(el => {
      el.style.fontSize = `${(el.classList.contains('area-label') ? 10.5 : 9.5) / pxPerUnit}px`;
      el.style.strokeWidth = `${1.2 / pxPerUnit}px`;
    });

    pointLayer.querySelectorAll('.gis-point,.gis-cluster').forEach(group => {
      const cluster = group.classList.contains('gis-cluster');
      const site = group.classList.contains('site');
      const selected = group.classList.contains('is-focused');
      const diameter = cluster ? clamp(12, 18, 16 - Math.log2(zoom)) : selected ? clamp(12, 18, 16 - Math.log2(zoom)) : site ? clamp(9, 14, 12 - Math.log2(zoom)) : clamp(6, 14, 11 - 1.5 * Math.log2(zoom));
      const core = [...group.children].find(el => el.tagName === 'circle' && !el.classList.contains('point-halo') && !el.classList.contains('gis-hit'));
      if (core) {
        core.classList.add('gis-core');
        core.setAttribute('r', diameter / 2 / pxPerUnit);
        core.style.strokeWidth = `${(selected ? 2.2 : 1.2) / pxPerUnit}px`;
      }
      const halo = group.querySelector('.point-halo');
      if (halo) {
        const alert = group.classList.contains('risk-red') || group.classList.contains('risk-orange');
        const ratio = alert ? (zoom >= 3 ? 1.42 : 1.58) : (zoom >= 3 ? 1.16 : 1.3);
        halo.setAttribute('r', diameter * ratio / 2 / pxPerUnit);
      }
      let hit = group.querySelector('.gis-hit');
      if (!hit) { hit = document.createElementNS(ns, 'circle'); hit.classList.add('gis-hit'); group.append(hit); }
      hit.setAttribute('r', 11 / pxPerUnit);
      group.querySelectorAll('text').forEach(el => {
        const isClusterLabel = el.classList.contains('cluster-label');
        if (site) el.textContent = level === 'city' ? `${group.dataset.jobCount || 0}项` : `${group.getAttribute('aria-label').split('，')[0]} · ${group.dataset.jobCount || 0}项`;
        el.style.fontSize = `${(isClusterLabel ? 9 : cluster ? 9.5 : site ? 10.5 : 9.5) / pxPerUnit}px`;
        el.style.strokeWidth = `${1.4 / pxPerUnit}px`;
        if (cluster) { if (isClusterLabel) { el.setAttribute('x', 0); el.setAttribute('y', 17 / pxPerUnit); } }
        else { el.setAttribute('x', (diameter / 2 + 5) / pxPerUnit); el.setAttribute('y', 3 / pxPerUnit); }
      });
    });
  }

  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  new MutationObserver(schedule).observe(pointLayer, { childList: true });
  new MutationObserver(schedule).observe(districtLayer, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  new MutationObserver(schedule).observe(areaLayer, { childList: true });
  new MutationObserver(schedule).observe(svg, { attributes: true, attributeFilter: ['viewBox'] });
  new ResizeObserver(schedule).observe(svg);
  svg.addEventListener('gis:viewchange', schedule);
  schedule();
})();
