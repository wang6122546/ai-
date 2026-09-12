const baseRenderDesigner = renderDesigner;
renderDesigner = function(){
  baseRenderDesigner();
  const actions=document.querySelector('.designer-actions');
  if(!actions)return;
  const version=document.createElement('button');version.className='ghost';version.id='versionRecords';version.textContent='版本记录';actions.insertBefore(version,document.querySelector('#testTemplate'));
  version.onclick=openVersionRecords;
  if(state.mode==='flow')enhanceFlowSettings();
};

function enhanceFlowSettings(){
  const library=document.querySelector('.flow-library');
  if(!library)return;
  library.insertAdjacentHTML('beforeend',`<div class="global-flow-settings"><b>流程设置</b><label><input type="checkbox" checked> 允许撤回</label><label><input type="checkbox" checked> 允许催办</label><label><input type="checkbox"> 允许重新申请</label><label><input type="checkbox" checked> 记录流程日志</label><label><input type="checkbox" checked> 允许待办转交</label><label><input type="checkbox"> 允许加签</label></div><div class="automation-nodes"><b>自动化节点</b><button data-auto-node="风险等级计算">＋ 风险等级计算</button><button data-auto-node="作业冲突检测">＋ 作业冲突检测</button><button data-auto-node="消息通知">＋ 消息通知</button><button data-auto-node="Webhook">＋ Webhook</button></div>`);
  document.querySelectorAll('[data-auto-node]').forEach(b=>b.onclick=()=>{nodes.splice(nodes.length-1,0,{name:b.dataset.autoNode,handler:'系统自动执行',type:'自动'});state.selectedNode=nodes.length-2;renderDesigner();toast(`${b.dataset.autoNode}节点已添加`)});
  const test=document.querySelector('#testTemplate');test.textContent='▷ 流程测试';test.onclick=openFlowTest;
}

function openVersionRecords(){
  document.querySelector('.modal-card').className='modal-card version-dialog';
  document.querySelector('#modalBody').innerHTML=`<h2>${state.template.name} · 版本记录</h2><div class="version-timeline"><article class="current"><b>${state.template.version} 当前编辑版本</b><span>草稿 · 2026-08-29 15:30</span><button class="secondary">继续编辑</button></article><article><b>V${Math.max(1,Number(state.template.version.replace('V',''))-1)} 已启用</b><span>生产版本 · 2026-08-28 10:20</span><button class="ghost">复制为新版本</button></article><article><b>V1 初始版本</b><span>已停用 · 2026-08-20 09:00</span><button class="ghost">查看</button></article></div><div class="dialog-footer"><button class="primary" id="closeVersions">关闭</button></div>`;openModalShell();document.querySelector('#closeVersions').onclick=closeModalShell;
}

function openFlowTest(){
  document.querySelector('.modal-card').className='modal-card flow-test-dialog';
  document.querySelector('#modalBody').innerHTML=`<h2>流程测试</h2><p>模拟提交一次${state.template.name}申请，检查实际流转路径。</p><div class="test-path">${nodes.map((n,i)=>`${i?'<i>→</i>':''}<span><b>${n.name}</b><small>${n.handler}</small></span>`).join('')}</div><div class="test-result"><b>✓ 测试通过</b><p>表单已绑定、审批人已配置、开始—审批—结束连线完整。</p></div><div class="dialog-footer"><button class="primary" id="closeFlowTest">完成测试</button></div>`;openModalShell();document.querySelector('#closeFlowTest').onclick=closeModalShell;
}
