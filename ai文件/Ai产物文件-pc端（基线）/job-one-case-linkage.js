/* 所有申请作业票：关联一件一案后联动施工项目。 */
(() => {
  const approvedCases=[
    {id:'YA20260817006',name:'井下泵房清淤一件一案',project:'井下排水系统维护'},
    {id:'YA20260815009',name:'二选车间年度检修一件一案',project:'二选车间年度检修'},
    {id:'YA20260812003',name:'尾矿库设备检修一件一案',project:''}
  ];

  function fieldLabel(root,text){return [...root.querySelectorAll('label')].find(label=>{
    const own=[...label.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).map(node=>node.textContent.trim()).join('');
    return own===text||label.textContent.trim().startsWith(text)
  })}
  function setProject(label,project,locked){
    const input=label?.querySelector('input'),button=label?.querySelector('button');if(!input)return;
    input.value=project||'';input.readOnly=!!locked;input.classList.toggle('linked-project-locked',!!locked);
    if(button){button.disabled=!!locked;button.title=locked?'项目由关联的一件一案带入，不允许修改':''}
    let note=label.querySelector('.one-case-project-note');
    if(locked){if(!note){note=document.createElement('small');note.className='one-case-project-note';label.append(note)}note.textContent='已由关联的一件一案带入，不允许修改'}else note?.remove()
  }
  function inject(root){
    if(!root||root.querySelector('[data-one-case-linkage]'))return;
    let projectLabel=fieldLabel(root,'关联施工项目');
    const isWizard=root.classList.contains('wizard-form')&&root.querySelector('#wizardJobName');
    if(!projectLabel&&isWizard){projectLabel=document.createElement('label');projectLabel.dataset.wizardProject='true';projectLabel.innerHTML='关联施工项目<input id="wizardConstructionProject" placeholder="未关联施工项目">';root.prepend(projectLabel)}
    if(!projectLabel)return;
    const oneCase=document.createElement('label');oneCase.dataset.oneCaseLinkage='true';oneCase.className=projectLabel.className;
    oneCase.innerHTML=`关联一件一案<select class="one-case-link-select"><option value="">不关联一件一案（组织内人员直接申请）</option>${approvedCases.map(item=>`<option value="${item.id}">${item.id} · ${item.name}</option>`).join('')}</select><small>相关方选择已批准的一件一案；组织内人员可不关联，直接办理作业票。</small>`;
    projectLabel.before(oneCase);
    const select=oneCase.querySelector('select');
    if(isWizard&&jobWizardState.linkedOneCase){select.value=jobWizardState.linkedOneCase;const saved=approvedCases.find(candidate=>candidate.id===select.value);setProject(projectLabel,jobWizardState.linkedProject||saved?.project||'',!!saved?.project)}
    select.onchange=event=>{
      const item=approvedCases.find(candidate=>candidate.id===event.target.value);
      if(isWizard)jobWizardState.linkedOneCase=item?.id||'';
      if(!item){setProject(projectLabel,'',false);if(isWizard)jobWizardState.linkedProject='';toast('已切换为组织内人员直接申请，可自行关联施工项目');return}
      if(item.project){setProject(projectLabel,item.project,true);if(isWizard)jobWizardState.linkedProject=item.project;toast(`已带入施工项目：${item.project}`)}
      else{setProject(projectLabel,'',false);if(isWizard)jobWizardState.linkedProject='';toast('该一件一案未关联施工项目，可自行选择项目')}
    }
  }
  function scan(){document.querySelectorAll('.limited-job-page .limited-section:first-of-type .limited-form,.regular-work section:first-of-type .regular-grid,.job-wizard #wizardContent .wizard-form').forEach(inject)}
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
})();
