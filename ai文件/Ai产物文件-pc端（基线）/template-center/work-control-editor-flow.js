(function(){
const ids=['risk','measure','gas','briefing','receive','supervision','submit','acceptance'];
let current='',results=[];
const layout=new Set(['RootCanvas','Section','CollapsePanel','TabsPanel','GridContainer']);
const flatten=items=>(items||[]).flatMap(item=>[item,...flatten(item.children)]);
const fields=()=>flatten(confinedSchema.sections).filter(item=>!layout.has(item.componentType));
function decorate(id){
 if(!ids.includes(id))return;current=id;
 const preview=document.querySelector('#previewConfined');if(preview)preview.textContent='画布预览';
 if(preview&&!document.querySelector('#businessUserView'))preview.insertAdjacentHTML('afterend','<button class="ghost" id="businessUserView">用户视图</button>');
 document.querySelector('#businessUserView')?.addEventListener('click',()=>{window.businessUserViewReturnId=id;openConfiguredControlPreview(id)});
 const next=[...document.querySelectorAll('.confined-top .actions button')].find(x=>x.textContent.trim()==='下一步');if(next)next.onclick=()=>validate(id);
 const relation=document.querySelector('.work-business-binding dd:last-of-type code');if(id==='risk'&&relation)relation.textContent='safe_work_risk_measure.risk_record_id → safe_work_risk.f_id；safe_work_risk.permit_id → safe_work_permit.f_id';
 const leave=()=>window.activeBusinessControlEditor='';
 for(const key of ['#backConfined','#closeConfined']){const button=document.querySelector(key);if(button){const action=button.onclick;button.onclick=e=>{leave();action?.call(button,e)}}}
}
function buildChecks(id){
 const item=configuredControls.find(x=>x.id===id),all=fields();
 const unbound=all.filter(x=>String(x.fieldKey||'').startsWith('field_')&&!x.binding);
 const hidden=all.filter(x=>x.required&&(x.hidden||x.showCondition==='始终隐藏'));
 const selects=all.filter(x=>['Select','Cascader','RadioGroup','CheckboxGroup','UserPicker','OrgPicker'].includes(x.componentType)&&String(x.fieldKey||'').startsWith('field_')&&!x.dataSource&&!x.optionSource&&!x.binding?.source);
 const disabled=all.filter(x=>x.disabled),hasAttachment=/附件|图片/.test(item?.fields||''),hasSign=/签字|签名/.test(item?.fields||'');
 return [
  ['页面必要板块是否完整',all.length>=2?'pass':'error',all.length>=2?`已配置 ${all.length} 个页面组件`:'页面缺少必要业务板块',all[0]],
  ['组件是否绑定业务字段',unbound.length?'error':'pass',unbound.length?`${unbound.length} 个新组件尚未绑定业务字段`:'预置及新增组件均已绑定',unbound[0]],
  ['数据库表和字段是否存在','pass','右侧数据绑定中的对象、表和字段均有效'],
  ['主键、permit_id及风险措施关联是否正确','pass',id==='risk'?'safe_work_risk_measure.risk_record_id → safe_work_risk.f_id；风险记录通过 permit_id 关联作业票':'业务记录通过 permit_id 关联作业票'],
  ['必填字段是否可见',hidden.length?'error':'pass',hidden.length?`${hidden.length} 个必填字段被隐藏`:'必填字段均可见',hidden[0]],
  ['选择控件是否配置数据源',selects.length?'error':'pass',selects.length?`${selects.length} 个新增选择控件缺少数据源`:'选择控件数据源配置完整',selects[0]],
  ['新增按钮是否绑定新增对象','pass','新增内容写入当前业务对象，不修改标准配置'],
  ['签字和附件是否绑定保存对象',hasAttachment&&hasSign?'pass':'warning',hasAttachment&&hasSign?'附件与签字保存对象完整':'当前页面未同时使用附件和签字组件'],
  ['用户视图是否能够正常渲染','pass','与控件库卡片预览复用同一业务页面'],
  ['是否存在未使用或失效组件',disabled.length?'warning':'pass',disabled.length?`${disabled.length} 个禁用组件发布时不会显示`:'未发现失效组件',disabled[0]]
 ].map(x=>({name:x[0],level:x[1],detail:x[2],field:x[3]}));
}
function validate(id){
 results=buildChecks(id);const count={error:0,warning:0,pass:0};results.forEach(x=>count[x.level]++);const error=count.error>0,warning=count.warning>0;
 document.querySelector('.modal-card').className='modal-card page-integrity-dialog';
 document.querySelector('#modalBody').innerHTML=`<h2>页面完整性校验</h2><p>检查完成后才能进入默认规则配置</p><div class="integrity-summary"><span class="error"><b>${count.error}</b>错误</span><span class="warning"><b>${count.warning}</b>警告</span><span class="pass"><b>${count.pass}</b>通过</span></div><div class="integrity-list">${results.map((x,i)=>`<article class="${x.level}"><i>${x.level==='pass'?'✓':'!'}</i><div><b>${x.name}</b><span>${x.detail}</span></div>${x.level==='error'?`<button data-integrity-fix="${i}">定位修正</button>`:''}</article>`).join('')}</div><div class="dialog-footer"><button id="returnPageEdit">返回修改</button><button class="primary" id="continueDefaultRules" ${error?'disabled':''}>${error?'确认并继续':warning?'忽略警告并继续':'校验通过，进入下一步'}</button></div>`;openModalShell();
 document.querySelector('#returnPageEdit').onclick=closeModalShell;document.querySelector('#continueDefaultRules').onclick=()=>{closeModalShell();rules(id)};
 document.querySelectorAll('[data-integrity-fix]').forEach(button=>button.onclick=()=>{const issue=results[+button.dataset.integrityFix];closeModalShell();if(issue.field){const section=(confinedSchema.sections||[]).find(x=>(x.children||[]).includes(issue.field))||confinedSchema.sections[0];confinedSelection={kind:'field',sectionId:section?.id||'',fieldKey:issue.field.fieldKey};renderConfinedDesigner();toast(`已定位：${issue.field.label||issue.name}`)}else toast('请检查右侧数据绑定配置')});
}
function rules(id){const item=configuredControls.find(x=>x.id===id);title.textContent=`${item.name} · 默认规则`;subtitle.textContent='配置页面被办理节点引用时采用的默认规则';app.innerHTML=`<div class="control-rule-page"><header><button id="backRuleEditor">← 返回页面编辑</button><div><h2>默认规则</h2><p>作业控件不负责流程顺序，节点覆盖规则由流程编排维护。</p></div><div><button id="cancelRules">取消</button><button class="primary" id="saveRules">保存默认规则</button></div></header><main><section><h3>默认办理角色</h3><label>办理角色<select><option>${id==='risk'?'风险评估人':'业务环节负责人'}</option><option>指定成员</option></select></label></section><section><h3>提交校验</h3><label><input type="checkbox" checked> 校验必填字段</label><label><input type="checkbox" checked> 校验签字及附件</label></section><section><h3>输入输出</h3><label>输入参数<textarea>permit_id、当前作业票、前序业务结果</textarea></label><label>输出参数<textarea>${id}_record_id、办理结果、附件、签字、办理时间</textarea></label></section><section><h3>只读规则</h3><label><input type="checkbox" checked> 标准快照内容只读</label><label><input type="checkbox" checked> 历史记录只读</label><label><input type="checkbox" checked> 非当前办理人只读</label></section></main></div>`;const back=()=>openConfiguredControlEditor(id);document.querySelector('#backRuleEditor').onclick=back;document.querySelector('#cancelRules').onclick=back;document.querySelector('#saveRules').onclick=()=>toast(`${item.name}默认规则已保存`)}
const originalEditor=openConfiguredControlEditor,originalRender=renderConfinedDesigner;
renderConfinedDesigner=function(){originalRender();if(window.activeBusinessControlEditor)decorate(window.activeBusinessControlEditor)};
openConfiguredControlEditor=function(id){window.activeBusinessControlEditor=ids.includes(id)?id:'';originalEditor(id);decorate(id)};
const originalTemplateDesigner=openDesigner;
openDesigner=function(id){window.activeBusinessControlEditor='';window.businessUserViewReturnId='';originalTemplateDesigner(id)};
})();
