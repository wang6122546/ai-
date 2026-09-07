import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "/Users/wang/.codex/attachments/faa493ab-aa3d-4562-adc5-0dbff790393b/pasted-text.txt";
const outputDir = "/Users/wang/Desktop/安全作业管理/outputs/20260824";
const outputPath = `${outputDir}/作业管理功能清单_仅依据详细设计说明书核对.xlsx`;
const raw = await fs.readFile(sourcePath, "utf8");
const sourceRows = raw.split(/\r?\n/).map(x=>x.split("\t")).filter(x=>/^\d+$/.test((x[0]||"").trim()));

const explicitTypes = new Map([
  [1,"2.13.3 常规工作管理"],[2,"2.13.4 动火作业"],[3,"2.13.5 受限空间作业"],
  [6,"2.13.6 吊装作业"],[8,"2.13.7 动土作业"],[5,"2.13.8 高处作业"],
  [9,"2.13.9 断路作业"],[7,"2.13.10 临时用电作业"],[13,"2.13.11 爆破作业"]
]);
const unsupportedTypeNos = new Set([4,10,11,12]);

const rows=[];
for (const x of sourceRows) {
  const no=Number(x[0]);
  let [l1,l2,name,desc,end,note]=[x[1]||"",x[2]||"",x[3]||"",x[4]||"",x[5]||"",x[6]||""];
  let conclusion="原清单保留";
  let basis="原始功能清单";
  let changed=false;
  if (explicitTypes.has(no)) { conclusion="文档明确支持"; basis=explicitTypes.get(no); }
  if (unsupportedTypeNos.has(no)) { conclusion="文档未明确，待确认"; basis="详细设计说明书 2.13 未检索到该作业类型的专项说明"; changed=true; }
  if (no===4) { conclusion="文档未明确，待确认"; basis="详细设计说明书 2.13 未单列盲板抽堵作业"; changed=true; }
  if (no===14 || no===15) { conclusion="编号缺失"; basis="原清单编号从13跳至16；不修改业务内容，仅重新连续编号"; changed=true; }

  if (no===23) { desc="配置作业人员、监护人员、审批人员等角色及职责；不同作业类型按文档规定设置对应人员分类。"; conclusion="功能说明优化"; basis="2.13.4—2.13.11 作业人员分类及职责"; changed=true; }
  if (no===35) { desc="按作业票业务节点执行风险评估、安全措施确认、气体分析、安全交底、审批、检查、验收等流程。"; conclusion="功能说明优化"; basis="2.13.1 待办任务"; changed=true; }
  if (no===40) { desc="记录作业区域、实施内容、实施时间及现场记录设备采集的作业实施情况。"; conclusion="功能说明优化"; basis="2.13.3—2.13.11 明确作业内容、实时记录、作业实施记录"; changed=true; }
  if (no===44) { desc="对作业过程中记录到的异常情况进行报警通知，并支持后续处置记录。"; conclusion="功能说明优化"; basis="2.13.3 异常报警；2.13.4—2.13.11 异常预警"; changed=true; }
  if (no===63) { desc="支持按关键词、分类、日期、人员等条件筛选和查询作业记录。"; conclusion="功能说明优化"; basis="2.13.3 作业记录"; changed=true; }
  if (no===86) { conclusion="文档明确支持"; basis="2.13.1 待办任务：风险评估"; }
  if (no===87) { conclusion="文档明确支持"; basis="2.13.1 待办任务：安全措施确认"; }
  if (no===88) { conclusion="文档明确支持"; basis="2.13.1 待办任务：审批"; }
  if (no===89) { conclusion="文档明确支持"; basis="2.13.1 待办任务：检查；2.13.2 隐患上报"; }
  if (no===90) { conclusion="文档明确支持"; basis="2.13.3—2.13.11 实时记录/实施记录"; }
  if (no===91) { conclusion="文档明确支持"; basis="2.13.1 待办任务：验收"; }
  if (no===132) { conclusion="文档明确支持"; basis="2.13.12 移动端：各类作业线上申请"; }
  if (no>=133 && no<=140) { conclusion="详细设计表述较笼统，待确认"; basis="2.13.12 仅概述线上申请、处置、进度和信息查看，未逐项定义该能力"; changed=true; }
  if (no>=141) { conclusion="文档未明确，待确认"; basis="详细设计说明书未明确描述该增强能力或具体规则"; changed=true; }

  rows.push({oldNo:no,l1,l2,name,desc,end,note,conclusion,basis,changed});
}

const add=(l1,l2,name,desc,end,basis)=>rows.push({oldNo:"—",l1,l2,name,desc,end,note:"",conclusion:"根据文档补充",basis,changed:true});
add("全生命周期管理","气体分析","气体分析办理","根据作业票业务节点提交或查看气体分析结果。","Web","2.13.1 待办任务明确包含气体分析");
add("全生命周期管理","作业检查","检查任务办理","根据作业票业务节点执行作业检查并记录检查结果。","Web","2.13.1 待办任务明确包含检查");
add("全生命周期管理","实时记录","现场实时记录","通过现场记录设备对作业现场情况进行实时记录。","Web","2.13.3—2.13.11 实时记录/作业实施记录");
add("全生命周期管理","异常报警","异常报警通知","对作业过程中记录到的异常情况进行报警或预警提醒。","Web","2.13.3—2.13.11 异常报警/异常预警");
add("作业台账与状态管理","作业记录","全过程记录查看","查看每项作业的全过程记录，并按关键词、分类、日期、人员筛选。","Web","2.13.3 作业记录；2.13.4—2.13.11 全过程作业记录");

const matrix=rows.map((r,i)=>[i+1,r.l1,r.l2,r.name,r.desc,r.end,r.note,r.conclusion,r.basis]);
const changedRows=rows.map((r,i)=>r.changed?i+4:null).filter(Boolean);

const wb=Workbook.create();
const main=wb.worksheets.add("文档核对功能清单");
const guide=wb.worksheets.add("核对说明");
main.showGridLines=false; guide.showGridLines=false;

main.mergeCells("A1:I1"); main.getRange("A1").values=[["作业管理功能清单（仅依据详细设计说明书核对）"]];
main.mergeCells("A2:I2"); main.getRange("A2").values=[["红色字体：依据详细设计说明书新增、改写或标记待确认；未在文档中明确的内容不擅自删除，也不视为已确认。"]];
main.getRange("A3:I3").values=[["编号","一级模块","二级模块","功能点","功能说明","适用端","备注","文档核对结论","文档依据"]];
main.getRangeByIndexes(3,0,matrix.length,9).values=matrix;
const end=matrix.length+3;
main.getRange(`A1:I${end}`).format.font={name:"Microsoft YaHei",size:10,color:"#1F2937"};
main.getRange("A1:I1").format={fill:"#17365D",font:{name:"Microsoft YaHei",size:18,bold:true,color:"#FFFFFF"},horizontalAlignment:"center",verticalAlignment:"center"};
main.getRange("A2:I2").format={fill:"#FFF2CC",font:{name:"Microsoft YaHei",size:10,bold:true,color:"#9C0006"},horizontalAlignment:"left",verticalAlignment:"center"};
main.getRange("A3:I3").format={fill:"#2F75B5",font:{name:"Microsoft YaHei",size:10,bold:true,color:"#FFFFFF"},horizontalAlignment:"center",verticalAlignment:"center",wrapText:true};
main.getRange(`A4:I${end}`).format={wrapText:true,verticalAlignment:"center",borders:{insideHorizontal:{style:"thin",color:"#D9E2F3"}}};
for (const r of changedRows) main.getRange(`A${r}:I${r}`).format.font={name:"Microsoft YaHei",size:10,color:"#C00000"};
main.getRange(`A4:A${end}`).format.horizontalAlignment="center"; main.getRange(`F4:H${end}`).format.horizontalAlignment="center";
[7,20,21,24,56,12,22,20,42].forEach((w,i)=>main.getRange(`${"ABCDEFGHI"[i]}:${"ABCDEFGHI"[i]}`).format.columnWidth=w);
main.getRange(`A4:I${end}`).format.autofitRows(); main.freezePanes.freezeRows(3); main.freezePanes.freezeColumns(1);
const t=main.tables.add(`A3:I${end}`,true,"DocOnlyFunctionList"); t.style="TableStyleMedium2"; t.showFilterButton=true;

guide.mergeCells("A1:D1"); guide.getRange("A1").values=[["本次核对边界"]];
guide.getRange("A3:D3").values=[["项目","本次处理","依据","说明"]];
const notes=[
  ["事实内容来源","仅使用用户原始功能清单和《安全智慧管控平台业务系统详细设计说明书(8.11)》","用户本次明确要求","未使用 PRD 扩写功能。"],
  ["文档明确功能","标记“文档明确支持”或据文档优化说明","详细设计说明书 2.13","保持文档原意，不扩展业务规则。"],
  ["文档未明确功能","保留原条目并标记“待确认”","详细设计说明书未检索到明确描述","不擅自删除，也不认定为已确认需求。"],
  ["新增功能","仅补充气体分析、检查、现场实时记录、异常报警、全过程记录查看","详细设计说明书 2.13.1—2.13.11","均可在文档中找到直接表述。"],
  ["移动端","文档仅概述线上申请、处置、进度和信息查看","详细设计说明书 2.13.12","未将笼统表述自行拆成大量移动端功能。"],
  ["项目范围冲突","移动端当前确认范围仅作业申请、作业监控查看","项目 AGENTS.md","该约束只用于提示冲突，不用于从详细设计扩写功能。"]
];
guide.getRange("A4:D9").values=notes;
guide.getRange("A1:D9").format.font={name:"Microsoft YaHei",size:10,color:"#1F2937"};
guide.getRange("A1:D1").format={fill:"#17365D",font:{name:"Microsoft YaHei",size:18,bold:true,color:"#FFFFFF"},horizontalAlignment:"center"};
guide.getRange("A3:D3").format={fill:"#2F75B5",font:{name:"Microsoft YaHei",bold:true,color:"#FFFFFF"},horizontalAlignment:"center"};
guide.getRange("A4:D9").format={wrapText:true,verticalAlignment:"center",borders:{insideHorizontal:{style:"thin",color:"#D9E2F3"}}};
[22,50,48,52].forEach((w,i)=>guide.getRange(`${"ABCD"[i]}:${"ABCD"[i]}`).format.columnWidth=w);
guide.getRange("A4:D9").format.autofitRows(); guide.freezePanes.freezeRows(3);
const tg=guide.tables.add("A3:D9",true,"ReviewBoundary"); tg.style="TableStyleMedium2";

await fs.mkdir(outputDir,{recursive:true});
console.log((await wb.inspect({kind:"table",range:"文档核对功能清单!A1:I20",include:"values,formulas",tableMaxRows:20,tableMaxCols:9,maxChars:10000})).ndjson);
console.log((await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",options:{useRegex:true,maxResults:100},summary:"formula error scan"})).ndjson);
for (const [sheetName,range,file] of [["文档核对功能清单","A1:I28","文档核对功能清单预览.png"],["核对说明","A1:D9","文档核对说明预览.png"]]) {
  const img=await wb.render({sheetName,range,scale:1.15,format:"png"}); await fs.writeFile(`${outputDir}/${file}`,new Uint8Array(await img.arrayBuffer()));
}
const xlsx=await SpreadsheetFile.exportXlsx(wb); await xlsx.save(outputPath);
console.log(JSON.stringify({outputPath,total:matrix.length,changed:changedRows.length}));
