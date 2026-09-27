/* 仅规范必填标识的展示结构，不改变表单字段、值、校验和事件。 */
(function(){
  function normalizeRequiredLabels(root=document){
    root.querySelectorAll('label').forEach(label=>{
      if(label.dataset.uiLabelNormalized)return;
      const mark=[...label.children].find(child=>child.tagName==='I'&&child.textContent.trim()==='*');
      if(!mark)return;
      const textNodes=[...label.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim());
      if(!textNodes.length)return;
      const caption=document.createElement('span');caption.className='ui-field-label';
      caption.append(mark,...textNodes.map(node=>{const copy=document.createTextNode(node.textContent.trim());node.remove();return copy}));
      label.insertBefore(caption,label.firstChild);label.dataset.uiLabelNormalized='true';
    });
  }
  normalizeRequiredLabels();
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)normalizeRequiredLabels(node)}))).observe(document.body,{childList:true,subtree:true});
})();
