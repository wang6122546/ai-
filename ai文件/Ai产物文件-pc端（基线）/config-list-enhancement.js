/* 安全交底配置：步骤统一维护阶段，并与待办安全交底共用 briefingSteps。 */
(function(){
  const stages=['作业前','作业中','作业后'];
  const redraw=()=>{persistBriefingSteps();document.querySelector('#configBody').innerHTML=briefingConfigView();setupConfigActions()};
  const itemType=item=>item.workType||'有限空间作业';
  const itemLevels=item=>Array.isArray(item.levels)&&item.levels.length?item.levels:['一级'];

  briefingConfigView=function(){
    const rows=briefingSteps.map((item,index)=>`<tr data-index="${index}"><td>${index+1}</td><td>${itemType(item)}</td><td>${itemLevels(item).join('、')}</td><td><span class="briefing-stage-chip">${item.stage}</span></td><td>${item.content}</td><td><button class="detail briefing-edit">编辑</button><button class="detail briefing-copy">复制</button><button class="detail briefing-sort" data-direction="up" ${index===0?'disabled':''}>上移</button><button class="detail briefing-sort" data-direction="down" ${index===briefingSteps.length-1?'disabled':''}>下移</button><button class="danger-text briefing-delete">删除</button></td></tr>`).join('')||'<tr><td colspan="6" class="empty">暂无作业步骤，请点击“添加作业步骤”维护</td></tr>';
    return `<div class="risk-type-tabs">${riskConfigTypes.map((x,i)=>`<button class="${i===0?'active':''}">${x}</button>`).join('')}</div><div class="risk-measure-toolbar"><div>${riskLevels.map((x,i)=>`<button class="${i===0?'active':''}">${x}</button>`).join('')}</div></div><div class="config-scope-bar"><label>业务模式<select><option>普通作业</option><option>作业计划</option><option>一件一案</option></select></label></div><div class="briefing-head"><div><b>安全交底预设配置</b><span>每条步骤必须选择作业阶段，保存后同步至“我的待办—安全交底”</span></div><button class="primary" id="addBriefingStep">＋ 添加作业步骤</button></div><div class="table-wrap"><table><thead><tr><th>序号</th><th>作业类型</th><th>适用等级</th><th>作业阶段</th><th>作业步骤内容</th><th>操作</th></tr></thead><tbody id="briefingRows">${rows}</tbody></table></div>`;
  };

  function openStep(index=null){
    const item=index===null?{workType:riskConfigTypes[0]||'动火作业',levels:[],stage:'作业前',content:''}:briefingSteps[index];
    document.querySelector('.config-drawer-layer')?.remove();
    document.body.insertAdjacentHTML('beforeend',`<div class="config-drawer-layer"><button class="config-drawer-mask"></button><aside class="config-drawer"><header><b>▶ ${index===null?'添加':'编辑'}作业步骤</b><button class="config-drawer-close">×</button></header><div class="config-drawer-body"><label><span><i>*</i> 作业类型</span><select id="briefingWorkType">${riskConfigTypes.map(type=>`<option ${type===itemType(item)?'selected':''}>${type}</option>`).join('')}</select></label><label><span><i>*</i> 适用等级</span><div class="bound-level-checks">${['特级','一级','二级','三级'].map(level=>`<label><input type="checkbox" name="briefingLevel" value="${level}" ${itemLevels(item).includes(level)?'checked':''}> ${level}</label>`).join('')}</div></label><label><span><i>*</i> 作业阶段</span><select id="briefingStage">${stages.map(stage=>`<option ${stage===item.stage?'selected':''}>${stage}</option>`).join('')}</select></label><label><span><i>*</i> 作业步骤内容</span><textarea id="briefingContent" placeholder="请输入作业步骤内容">${item.content||''}</textarea></label></div><footer><button class="ghost config-drawer-cancel">取消</button><button class="primary" id="saveBriefingStep">确定</button></footer></aside></div>`);
    const layer=document.querySelector('.config-drawer-layer'),close=()=>layer.remove();
    layer.querySelector('.config-drawer-mask').onclick=layer.querySelector('.config-drawer-close').onclick=layer.querySelector('.config-drawer-cancel').onclick=close;
    layer.querySelector('#saveBriefingStep').onclick=()=>{const content=layer.querySelector('#briefingContent').value.trim(),levels=[...layer.querySelectorAll('[name="briefingLevel"]:checked')].map(input=>input.value);if(!content)return toast('请输入作业步骤内容');if(!levels.length)return toast('请选择适用等级');const data={workType:layer.querySelector('#briefingWorkType').value,levels,stage:layer.querySelector('#briefingStage').value,content};index===null?briefingSteps.push(data):briefingSteps[index]=data;close();redraw();toast('作业步骤已保存并同步至安全交底')};
  }

  document.addEventListener('click',event=>{
    const action=event.target.closest('#addBriefingStep,.briefing-edit,.briefing-copy,.briefing-sort,.briefing-delete');
    if(!action)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(action.id==='addBriefingStep')return openStep();
    const row=action.closest('tr'),index=+row.dataset.index;
    if(action.classList.contains('briefing-edit'))return openStep(index);
    if(action.classList.contains('briefing-copy')){briefingSteps.splice(index+1,0,{...briefingSteps[index],levels:[...itemLevels(briefingSteps[index])],content:`${briefingSteps[index].content}（复制）`});redraw();return toast('作业步骤已复制并同步')}
    if(action.classList.contains('briefing-sort')){const to=index+(action.dataset.direction==='up'?-1:1);if(to<0||to>=briefingSteps.length)return;const item=briefingSteps.splice(index,1)[0];briefingSteps.splice(to,0,item);redraw();return toast('作业步骤顺序已更新并同步')}
    briefingSteps.splice(index,1);redraw();toast('作业步骤已删除并同步');
  },true);
})();
