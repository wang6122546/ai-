const baseWizardStepBody=wizardStepBody;
const baseRiskItems=getRiskItems;
const baseMeasures=getMeasures;

wizardStepBody=function(step){
  if(jobWizardState.origin!=='cross'||step!==0)return baseWizardStepBody(step);
  return `<div class="wizard-section-title"><b>交叉作业基本信息</b><span>明确参与单位、关联作业及统一协调责任</span></div><div class="cross-alert"><b>交叉作业管控提示</b><p>同一区域、同一时间存在两项及以上作业时，应明确牵头单位和统一协调人，完成风险叠加分析后方可提交。</p></div><div class="wizard-form cross-wizard-form"><label>交叉作业名称<i>*</i><input id="wizardJobName" placeholder="请输入交叉作业名称"></label><label>作业类型<i>*</i><select id="wizardJobType">${jobWizardState.types.map(x=>`<option ${x===jobWizardState.type?'selected':''}>${x}</option>`).join('')}</select><small>选项与当前交叉作业模板保持一致</small></label><label>牵头单位<i>*</i><select><option>请选择牵头单位</option><option>齐大山铁矿</option><option>东鞍山铁矿</option><option>大孤山铁矿</option></select></label><label>统一协调人<i>*</i><button class="select-input" id="selectOwner"><span id="ownerText">${jobWizardState.owner}</span><span>⌄</span></button></label><label>参与单位<i>*</i><div class="multi-select"><span>齐大山铁矿 ×</span><button type="button" id="addCrossUnit">＋ 添加参与单位</button></div></label><label>交叉作业区域<i>*</i><button class="select-input" id="selectArea">请选择交叉作业区域 <span>⌄</span></button></label><label>主作业票<i>*</i><select><option>请选择主作业票</option><option>ZY20260818001 · 二选车间动火检修</option><option>ZY20260818004 · 尾矿库管道吊装</option></select></label><label>关联作业票<i>*</i><select multiple class="cross-ticket-select"><option>ZY20260817018 · 临时用电接入</option><option>CG20260819001 · 浓密机年度检修</option><option>WD20260818001 · 尾矿库吊装工程</option></select><small>可选择多张在时间或空间上存在交叉的作业票</small></label><label>交叉开始时间<i>*</i><input type="datetime-local"></label><label>交叉结束时间<i>*</i><input type="datetime-local"></label><label class="wide textarea-count">交叉作业说明<i>*</i><textarea id="wizardJobContent" maxlength="500" placeholder="请说明各作业的交叉关系、影响范围及协调要求"></textarea><em id="jobContentCount">0/500</em></label><label class="wide">统一协调方案<textarea placeholder="请输入作业顺序、隔离方式、现场指挥和应急联络安排"></textarea></label></div>`;
};

getRiskItems=function(type){
  if(jobWizardState.origin!=='cross')return baseRiskItems(type);
  return [['不同单位指挥体系不一致','设置统一协调人，所有作业服从现场统一指挥'],['作业空间交叉导致物体打击或坠落','划分上下层作业隔离区，禁止无防护垂直交叉作业'],['作业时间重叠引发能量或设备冲突','编制时序计划，明确暂停、切换和恢复条件'],['动火、用电、吊装等风险相互叠加','开展联合风险辨识并提高管控等级'],['应急信息传递不及时','建立各单位负责人和监护人的应急联络清单']];
};

getMeasures=function(type){
  if(jobWizardState.origin!=='cross')return baseMeasures(type);
  return ['组织所有参与单位开展联合安全交底并签字确认','明确牵头单位、统一协调人及各作业现场监护人','编制作业时序计划，禁止相互影响的工序同时进行','设置交叉区域硬隔离、警戒线及统一进出通道','核对主作业票和关联作业票的能源隔离及许可条件','建立联合应急响应和停工指令传递机制'];
};

const baseBindBasicStep=bindBasicStep;
bindBasicStep=function(){
  baseBindBasicStep();
  const addUnit=document.querySelector('#addCrossUnit');
  if(addUnit)addUnit.onclick=()=>{addUnit.insertAdjacentHTML('beforebegin','<span>东鞍山铁矿 ×</span>');toast('已添加交叉作业参与单位')};
};
