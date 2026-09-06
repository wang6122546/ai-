const previewParams=new URLSearchParams(location.search);
const previewName=previewParams.get('name')||'作业模板';
const previewCode=previewParams.get('code')||'ZYMB';
const previewVersion=previewParams.get('version')||'V1';
document.title=`${previewName}申请表 · 模板预览`;
document.querySelector('#ticketName').textContent=`${previewName}申请表`;
document.querySelector('#templateMeta').textContent=`模板编码 ${previewCode} · ${previewVersion}`;
function previewToast(message){const el=document.querySelector('#previewToast');el.textContent=message;el.classList.add('show');clearTimeout(previewToast.timer);previewToast.timer=setTimeout(()=>el.classList.remove('show'),1800)}
document.querySelector('#backPreview').onclick=()=>{const from=previewParams.get('from');if(from&&from.startsWith(location.origin))location.href=from;else history.back()};
document.querySelector('#toggleDevice').onclick=e=>{document.querySelector('#previewShell').classList.toggle('mobile');e.currentTarget.textContent=document.querySelector('#previewShell').classList.contains('mobile')?'PC端预览':'移动端预览'};
document.querySelector('#printPreview').onclick=()=>window.print();
document.querySelector('#mockSubmit').onclick=()=>previewToast('预览模式：表单校验通过，未产生真实业务数据');
