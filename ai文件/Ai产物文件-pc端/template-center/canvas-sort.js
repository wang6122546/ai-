function bindCanvasInteractions() {
  const canvas = document.querySelector('#stageCanvas');
  let draggedIndex = null;

  const clearDropMarks = () => {
    canvas.classList.remove('canvas-drag-end');
    canvas.querySelectorAll('.drag-before, .drag-after, .dragging').forEach(item => {
      item.classList.remove('drag-before', 'drag-after', 'dragging');
    });
  };

  const createControl = (type, group) => ({
    type,
    name: type,
    group,
    required: group !== 'layout' && group !== 'system',
    placeholder: group === 'system' ? '系统自动生成' : `请配置${type}`,
    width: '整行',
    readonly: group === 'system'
  });

  const insertNewControl = (raw, insertIndex) => {
    const item = JSON.parse(raw);
    const index = Math.max(0, Math.min(insertIndex, canvasControls.length));
    canvasControls.splice(index, 0, createControl(item.type, item.group));
    activeControl = index;
    renderFormBuildStep();
    toast(`${item.type}已添加到第 ${index + 1} 项`);
  };

  const moveControl = (sourceIndex, insertIndex) => {
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex >= canvasControls.length) return;
    let destination = Math.max(0, Math.min(insertIndex, canvasControls.length));
    const [item] = canvasControls.splice(sourceIndex, 1);
    if (sourceIndex < destination) destination -= 1;
    canvasControls.splice(destination, 0, item);
    activeControl = destination;
    renderFormBuildStep();
    toast(`已将“${item.name}”移动到第 ${destination + 1} 项`);
  };

  const dropPosition = (event, element) => {
    const rect = element.getBoundingClientRect();
    const sameRow = element.classList.contains('half') && Math.abs(event.clientY - (rect.top + rect.height / 2)) < rect.height / 2;
    return sameRow ? event.clientX > rect.left + rect.width / 2 : event.clientY > rect.top + rect.height / 2;
  };

  canvas.ondragover = event => {
    event.preventDefault();
    if (!event.target.closest('[data-canvas-control]')) {
      canvas.querySelectorAll('.drag-before, .drag-after').forEach(item => item.classList.remove('drag-before', 'drag-after'));
      canvas.classList.add('canvas-drag-end');
    }
  };

  canvas.ondrop = event => {
    event.preventDefault();
    if (event.target.closest('[data-canvas-control]')) return;
    const newControl = event.dataTransfer.getData('new-control');
    const moveIndex = Number(event.dataTransfer.getData('move-control'));
    clearDropMarks();
    if (newControl) insertNewControl(newControl, canvasControls.length);
    else if (Number.isInteger(moveIndex)) moveControl(moveIndex, canvasControls.length);
  };

  document.querySelectorAll('[data-canvas-control]').forEach(element => {
    element.onclick = event => {
      if (event.target.closest('button')) return;
      activeControl = Number(element.dataset.canvasControl);
      renderFormBuildStep();
    };
    element.ondragstart = event => {
      draggedIndex = Number(element.dataset.canvasControl);
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('move-control', String(draggedIndex));
      requestAnimationFrame(() => element.classList.add('dragging'));
    };
    element.ondragend = () => {
      draggedIndex = null;
      clearDropMarks();
    };
    element.ondragover = event => {
      event.preventDefault();
      event.stopPropagation();
      canvas.classList.remove('canvas-drag-end');
      canvas.querySelectorAll('.drag-before, .drag-after').forEach(item => item.classList.remove('drag-before', 'drag-after'));
      element.classList.add(dropPosition(event, element) ? 'drag-after' : 'drag-before');
    };
    element.ondrop = event => {
      event.preventDefault();
      event.stopPropagation();
      const targetIndex = Number(element.dataset.canvasControl);
      const after = dropPosition(event, element);
      const newControl = event.dataTransfer.getData('new-control');
      const moveIndex = draggedIndex ?? Number(event.dataTransfer.getData('move-control'));
      clearDropMarks();
      if (newControl) insertNewControl(newControl, targetIndex + (after ? 1 : 0));
      else moveControl(moveIndex, targetIndex + (after ? 1 : 0));
    };
  });

  document.querySelectorAll('[data-delete-control]').forEach(button => button.onclick = () => {
    canvasControls.splice(Number(button.dataset.deleteControl), 1);
    activeControl = Math.max(0, Math.min(activeControl, canvasControls.length - 1));
    renderFormBuildStep();
    toast('控件已删除');
  });
  document.querySelectorAll('[data-copy-control]').forEach(button => button.onclick = () => {
    const index = Number(button.dataset.copyControl);
    canvasControls.splice(index + 1, 0, {...canvasControls[index], name: `${canvasControls[index].name}副本`});
    activeControl = index + 1;
    renderFormBuildStep();
    toast('控件已复制');
  });
  document.querySelectorAll('[data-move-up]').forEach(button => button.onclick = () => {
    const index = Number(button.dataset.moveUp);
    if (!index) return;
    [canvasControls[index - 1], canvasControls[index]] = [canvasControls[index], canvasControls[index - 1]];
    activeControl = index - 1;
    renderFormBuildStep();
  });

  if (!canvasControls.length) return;
  const controlName = document.querySelector('#canvasControlName');
  if (controlName) controlName.oninput = event => {
    canvasControls[activeControl].name = event.target.value;
    document.querySelector(`[data-canvas-control="${activeControl}"] .canvas-field-label span, [data-canvas-control="${activeControl}"] .layout-control b`)?.replaceChildren(event.target.value);
  };
  const placeholder = document.querySelector('#canvasPlaceholder');
  if (placeholder) placeholder.onchange = event => {
    canvasControls[activeControl].placeholder = event.target.value;
    renderFormBuildStep();
  };
  const controlWidth = document.querySelector('#canvasWidth');
  if (controlWidth) controlWidth.onchange = event => {
    canvasControls[activeControl].width = event.target.value;
    renderFormBuildStep();
  };
  const required = document.querySelector('#canvasRequired');
  if (required) required.onchange = event => {
    canvasControls[activeControl].required = event.target.checked;
    renderFormBuildStep();
  };
}
