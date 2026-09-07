import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const sourcePath = "/Users/wang/.codex/attachments/faa493ab-aa3d-4562-adc5-0dbff790393b/pasted-text.txt";
const outputDir = "/Users/wang/Desktop/安全作业管理/outputs/20260824";
const outputPath = `${outputDir}/作业管理功能清单_文档核对优化版.xlsx`;
const raw = await fs.readFile(sourcePath, "utf8");
const parsed = raw.split(/\r?\n/).map(x => x.split("\t")).filter(x => /^\d+$/.test((x[0] || "").trim())).map(x => ({
  oldNo: Number(x[0]), l1: x[1] || "", l2: x[2] || "", name: x[3] || "", desc: x[4] || "", end: x[5] || "", note: x[6] || "", changed: false, changeType: "保留", basis: "现有清单"
}));

const removed = [];
const removeReasons = new Map([
  [10,"PRD 类型体系未包含“拆卸作业”；与“拆除工程”含义也不等同，移出正式清单并待业务确认。"],
  [11,"PRD 类型体系未包含“搬运作业”，移出正式清单并待业务确认。"],
  [12,"PRD 类型体系未包含“安装作业”；已有“起重机械安拆”，不应直接混用。"],
  [55,"“待审批”属于流程任务状态，合并到统一业务状态“申请中”，不作为作业主状态。"],
  [58,"“已暂停”按 PRD 作为“作业中”的控制状态/标识，不独立列为主状态。"],
  [59,"“待验收”属于作业中阶段，合并到“作业中”。"],
  [62,"超期按规则自动暂停或作废，“已过期”不作为统一主状态。"],
  [134,"扫码查票超出已确认移动端当前范围，后续扩围需先更新决策和 PRD。"],
  [135,"交底、审批、验收手写签名超出已确认移动端当前范围。"],
  [136,"移动审批超出已确认移动端当前范围。"],
  [137,"移动端现场隐患上报超出已确认移动端当前范围。"],
  [138,"移动端检测数据填报超出已确认移动端当前范围。"],
  [139,"移动端现场事件上报超出已确认移动端当前范围。"],
  [140,"移动端验收超出已确认移动端当前范围。"]
]);

let items = [];
for (const row of parsed) {
  if (removeReasons.has(row.oldNo)) {
    removed.push([row.oldNo,row.l1,row.l2,row.name,row.desc,row.end,"删除/合并",removeReasons.get(row.oldNo)]);
    continue;
  }
  if (row.oldNo === 3) {
    row.l2 = "有限空间（受限空间）作业";
    row.name = "有限空间（受限空间）作业";
    row.desc = "支持有限空间（历史资料亦称受限空间）作业全过程管理；正式名称待产品负责人确认后统一。";
    row.changed = true; row.changeType = "术语调整"; row.basis = "PRD Q2：术语待确认";
  }
  if (row.oldNo === 54) {
    row.desc = "已提交且流程未完成；允许审批、退回、驳回、撤回，审批完成后进入待开工，驳回/撤销后进入作废。";
    row.changed = true; row.changeType = "规则细化"; row.basis = "PRD 统一状态机";
  }
  if (row.oldNo === 61) {
    row.name = "作废"; row.desc = "支持查看驳回、撤销、超期或终止形成的作废作业及原因；作废为终态，可复制重提。";
    row.changed = true; row.changeType = "状态统一"; row.basis = "PRD 统一状态机";
  }
  const mobileAllowed = (row.oldNo >= 16 && row.oldNo <= 25) || row.oldNo === 132 || row.oldNo === 133;
  if (row.end.includes("App") && !mobileAllowed) {
    row.end = "Web";
    row.changed = true; row.changeType = row.changeType === "保留" ? "范围调整" : `${row.changeType}、范围调整`;
    row.basis = row.basis === "现有清单" ? "已确认移动端范围：仅作业申请、作业监控查看" : `${row.basis}；移动端范围决策`;
  }
  if (row.oldNo >= 141 && row.oldNo <= 148 && row.end !== "Web") {
    row.end = "Web"; row.changed = true; row.changeType = "范围调整"; row.basis = "移动端范围决策；增强能力未纳入当前 App";
  }
  items.push(row);
}

const add = (l1,l2,name,desc,end,basis,changeType="新增") => items.push({oldNo:"—",l1,l2,name,desc,end,note:"",changed:true,changeType,basis});

for (const type of ["探放水","空区治理","顶板支护","基坑","模板及支撑","起重机械安拆","脚手架","拆除工程","交叉作业"]) {
  add("作业管理",`${type}作业`,`${type}作业`,`支持${type}作业申请、审批、实施、验收、归档和作废全过程管理。`,"Web","PRD 04 作业类型体系");
}

add("作业计划","计划管理","计划列表","按计划编号、作业类型、单位、区域、负责人、计划时间和状态查询，并展示关联作业票数量及执行进度。","Web","PRD 4A 作业计划","补充P0模块");
add("作业计划","计划管理","新建与编辑","维护计划名称、类型、单位、地点/设备、起止时间、负责人、人数、作业内容及风险概述。","Web","PRD 4A 作业计划","补充P0模块");
add("作业计划","计划管理","计划审批与发布","支持提交、通过、退回、驳回、发布、取消和重大变更重审。","Web","PRD 4A 作业计划","补充P0模块");
add("作业计划","计划转票","计划转作业票","从已发布计划创建作业票，带入单位、地点、类型、时间、人员建议、风险点和措施，并保留差异。","Web、App","PRD 4A；App 作业申请范围","补充P0模块");
add("作业计划","计划跟踪","执行进度跟踪","统计未开票、申请中、作业中、已完成和已取消数量；所有有效票完成或取消后计划方可完成。","Web","PRD 4A 作业计划","补充P0模块");
add("作业计划","冲突检查","计划冲突检查","检查同一时间、地点、设备、隔离范围及相关单位的冲突，并按规则提示或强制关联交叉作业审批。","Web","PRD 4A、BR-01","补充P0模块");

add("全生命周期管理","票证关联","主票与专项票关联","同一作业涉及多种危险作业时，主票关联多张专项票；所有专项票满足条件后方可开工。","Web","PRD BR-02","补充规则");
add("全生命周期管理","现场实施","人员签到","记录作业人员签到、退场和实际在场状态。","Web","PRD 核心流程/过程控制","补充功能");
add("全生命周期管理","现场监护","监护记录","记录现场监护时间、内容、异常、证据附件及关联人员。","Web","PRD 现场实施/数据域","补充功能");
add("全生命周期管理","现场监护","监护报告","汇总签到、监护、异常、验收和视频索引，生成带版本号的监护报告。","Web","PRD 受限空间场景/归档","补充功能");
add("全生命周期管理","归档","归档锁定","作业完成后归档作业票、签名、附件和过程记录；归档后只读。","Web","PRD 归档规则","补充规则");
add("全生命周期管理","异常控制","超期自动处理","作业票超过批准时间后自动暂停或失效，不得补录执行记录，延期须重新审批。","Web","PRD BR-04","补充规则");
add("全生命周期管理","异常控制","重大隐患联动暂停","现场重大隐患或报警触发暂停和消息升级，整改复查通过后方可恢复。","Web","PRD BR-06","补充规则");

add("自定义作业模板","审批流表格","节点表格配置","配置节点表格、字段读写权限、必填条件、审批意见、签名、会签/或签及退回目标。","Web","PRD 4A 自定义作业模板","补充P0模块");
add("自定义作业模板","自定义表格","组件库与设计画布","支持字段组件拖拽、分组、排序、栅格布局、复制删除及模板版本切换。","Web","PRD 4A 自定义表格设计器","补充P0模块");
add("自定义作业模板","自定义表格","字段属性与联动规则","配置字段编码、默认值、必填、只读/隐藏、数据源、角色权限、显示条件、校验和联动。","Web","PRD 4A 自定义表格设计器","补充P0模块");
add("自定义作业模板","版本管理","草稿与发布","保存生成草稿；发布前校验，发布后生成不可变版本。","Web","PRD 4A 模板版本规则","补充P0模块");
add("自定义作业模板","版本管理","复制与启停","复制模板结构生成新草稿；已发布模板只能停用，停用不影响历史和运行中业务。","Web","PRD 4A 模板操作规则","补充P0模块");
add("自定义作业模板","版本管理","历史版本快照","新申请使用最新已发布版本，历史作业保留发起时的模板和流程快照。","Web","PRD BR-07","补充规则");
add("自定义作业模板","预览导出","模板预览","模拟 PC/App 展示、条件联动与校验，预览数据不进入业务台账。","Web","PRD 4A 模板操作规则","补充P0模块");
add("自定义作业模板","预览导出","模板定义导出","导出模板定义、版本和规则配置，不导出敏感数据源凭据。","Web","PRD 4A 模板操作规则","补充功能");

add("移动端能力","作业申请","分步申请与自动保存","按作业类型分步填写申请表，支持草稿自动保存、集中校验和错误定位。","App","已确认移动端范围；PRD 表单规则","范围内补充");
add("移动端能力","作业申请","关联计划申请","从有效作业计划发起申请并带入受控字段。","App","已确认移动端范围；PRD 4A","范围内补充");
add("移动端能力","作业监控查看","监控作业列表","查看本人权限范围内正在实施或需要关注的作业，支持基础筛选和搜索。","App","已确认移动端范围","范围内补充");
add("移动端能力","作业监控查看","监控详情","只读查看作业基本信息、人员、当前状态、风险措施、监测、隐患和异常摘要。","App","已确认移动端范围","范围内补充");
add("移动端能力","作业监控查看","实时监测查看","查看已接入的视频、气体检测、设备在线状态和监护信息；不包含移动端现场处置。","App","已确认移动端范围","范围内补充");
add("移动端能力","作业监控查看","报警信息查看","查看与作业关联的异常报警、级别、时间、位置和当前处置状态。","App","已确认移动端范围","范围内补充");

items.sort((a,b) => {
  const order = ["作业计划","作业管理","全生命周期管理","作业台账与状态管理","作业详情","待办任务","统计分析","参数配置","自定义作业模板","权限与审计","移动端能力","建议增强"];
  const d = order.indexOf(a.l1) - order.indexOf(b.l1);
  if (d) return d;
  const an = typeof a.oldNo === "number" ? a.oldNo : 9999;
  const bn = typeof b.oldNo === "number" ? b.oldNo : 9999;
  return an - bn;
});

const matrix = items.map((x,i) => [i+1,x.l1,x.l2,x.name,x.desc,x.end,x.note,x.changeType,x.basis]);
const changedRows = items.map((x,i) => x.changed ? i+4 : null).filter(Boolean);

const wb = Workbook.create();
const main = wb.worksheets.add("优化后功能清单");
const deletions = wb.worksheets.add("删减合并记录");
const notes = wb.worksheets.add("优化说明");
for (const s of [main,deletions,notes]) s.showGridLines = false;

main.mergeCells("A1:I1");
main.getRange("A1").values = [["作业管理功能清单（文档核对优化版）"]];
main.mergeCells("A2:I2");
main.getRange("A2").values = [["红色字体表示相较原清单新增、改写或范围调整的内容；黑色字体为保留内容。"]];
main.getRange("A3:I3").values = [["编号","一级模块","二级模块","功能点","功能说明","适用端","备注","调整类型","调整依据"]];
main.getRangeByIndexes(3,0,matrix.length,9).values = matrix;
const endRow = matrix.length + 3;
main.getRange(`A1:I${endRow}`).format.font = { name:"Microsoft YaHei", size:10, color:"#1F2937" };
main.getRange("A1:I1").format = { fill:"#17365D", font:{name:"Microsoft YaHei",size:18,bold:true,color:"#FFFFFF"}, horizontalAlignment:"center", verticalAlignment:"center" };
main.getRange("A2:I2").format = { fill:"#FFF2CC", font:{name:"Microsoft YaHei",size:10,bold:true,color:"#9C0006"}, horizontalAlignment:"left", verticalAlignment:"center" };
main.getRange("A3:I3").format = { fill:"#2F75B5", font:{name:"Microsoft YaHei",size:10,bold:true,color:"#FFFFFF"}, horizontalAlignment:"center", verticalAlignment:"center", wrapText:true };
main.getRange(`A4:I${endRow}`).format = { verticalAlignment:"center", wrapText:true, borders:{insideHorizontal:{style:"thin",color:"#D9E2F3"}} };
for (const r of changedRows) main.getRange(`A${r}:I${r}`).format.font = { name:"Microsoft YaHei", size:10, color:"#C00000" };
main.getRange(`A4:A${endRow}`).format.horizontalAlignment = "center";
main.getRange(`F4:H${endRow}`).format.horizontalAlignment = "center";
const widths = [7,20,21,24,58,12,24,16,30];
"ABCDEFGHI".split("").forEach((c,i)=>main.getRange(`${c}:${c}`).format.columnWidth=widths[i]);
main.getRange(`A4:I${endRow}`).format.autofitRows();
main.freezePanes.freezeRows(3); main.freezePanes.freezeColumns(1);
const t = main.tables.add(`A3:I${endRow}`,true,"OptimizedFunctionList"); t.style="TableStyleMedium2"; t.showFilterButton=true;

deletions.mergeCells("A1:H1"); deletions.getRange("A1").values=[["删减与合并记录"]];
deletions.mergeCells("A2:H2"); deletions.getRange("A2").values=[["以下项目未直接出现在优化后主表中，均以红色字体保留追溯。"]];
deletions.getRange("A3:H3").values=[["原编号","一级模块","二级模块","功能点","原功能说明","原适用端","处理方式","原因"]];
deletions.getRangeByIndexes(3,0,removed.length,8).values=removed;
const delEnd=removed.length+3;
deletions.getRange(`A1:H${delEnd}`).format.font={name:"Microsoft YaHei",size:10,color:"#C00000"};
deletions.getRange("A1:H1").format={fill:"#17365D",font:{name:"Microsoft YaHei",size:18,bold:true,color:"#FFFFFF"},horizontalAlignment:"center"};
deletions.getRange("A2:H2").format={fill:"#FFF2CC",font:{name:"Microsoft YaHei",bold:true,color:"#9C0006"}};
deletions.getRange("A3:H3").format={fill:"#2F75B5",font:{name:"Microsoft YaHei",bold:true,color:"#FFFFFF"},horizontalAlignment:"center",wrapText:true};
deletions.getRange(`A4:H${delEnd}`).format={wrapText:true,verticalAlignment:"center",borders:{insideHorizontal:{style:"thin",color:"#D9E2F3"}},font:{name:"Microsoft YaHei",size:10,color:"#C00000"}};
[8,18,20,22,50,12,14,54].forEach((w,i)=>deletions.getRange(`${"ABCDEFGH"[i]}:${"ABCDEFGH"[i]}`).format.columnWidth=w);
deletions.getRange(`A4:H${delEnd}`).format.autofitRows(); deletions.freezePanes.freezeRows(3);
const td=deletions.tables.add(`A3:H${delEnd}`,true,"RemovedItems"); td.style="TableStyleMedium2";

notes.mergeCells("A1:D1"); notes.getRange("A1").values=[["优化结论与事实源"]];
notes.getRange("A3:D3").values=[["类别","结论","事实源","处理原则"]];
const noteRows=[
  ["移动端范围","当前仅包含作业申请、作业监控查看。","AGENTS.md；docs/decisions/20260820-mobile-scope.md","其他 App 功能移入删减记录，未擅自扩围。"],
  ["作业类型","按 PRD 的常规作业 + 18 类作业整理。","安全作业管理_PRD.html 04","未确认类型移出主表；新增缺失类型。"],
  ["术语","有限空间/受限空间尚未定论。","安全作业管理_PRD.html Q2","主表并列显示并标注待确认。"],
  ["统一状态","主状态为草稿、申请中、待开工、作业中、已完成、作废。","安全作业管理_PRD.html 03","任务态和阶段态不再混入作业主状态。"],
  ["作业计划","属于 Web P0 独立业务模块。","安全作业管理_PRD.html 04/4A","补充计划编制、审批发布、转票、跟踪和冲突检查。"],
  ["自定义模板","属于 Web P0 配置模块。","安全作业管理_PRD.html 04/4A","补充审批流表格、自定义表格、版本和发布规则。"],
  ["详细设计参考","明确待办、隐患上报、常规及八类特殊危险作业的申请审批、实施记录、预警和关闭。","详细设计说明书 2.13","用于核实基础能力，不覆盖现行 PRD。"],
  ["待确认事项","常规作业定义、术语、审批矩阵、代签、变更重审、集成能力等仍需业务确认。","安全作业管理_PRD.html 10","清单只标记，不自行裁决业务规则。"]
];
notes.getRange("A4:D11").values=noteRows;
notes.getRange("A1:D11").format.font={name:"Microsoft YaHei",size:10,color:"#1F2937"};
notes.getRange("A1:D1").format={fill:"#17365D",font:{name:"Microsoft YaHei",size:18,bold:true,color:"#FFFFFF"},horizontalAlignment:"center"};
notes.getRange("A3:D3").format={fill:"#2F75B5",font:{name:"Microsoft YaHei",bold:true,color:"#FFFFFF"},horizontalAlignment:"center"};
notes.getRange("A4:D11").format={wrapText:true,verticalAlignment:"center",borders:{insideHorizontal:{style:"thin",color:"#D9E2F3"}}};
[20,52,52,48].forEach((w,i)=>notes.getRange(`${"ABCD"[i]}:${"ABCD"[i]}`).format.columnWidth=w);
notes.getRange("A4:D11").format.autofitRows(); notes.freezePanes.freezeRows(3);
const tn=notes.tables.add("A3:D11",true,"OptimizationNotes"); tn.style="TableStyleMedium2";

await fs.mkdir(outputDir,{recursive:true});
console.log((await wb.inspect({kind:"table",range:"优化后功能清单!A1:I18",include:"values,formulas",tableMaxRows:18,tableMaxCols:9,maxChars:10000})).ndjson);
console.log((await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",options:{useRegex:true,maxResults:100},summary:"formula error scan"})).ndjson);
for (const [sheetName,range,file] of [["优化后功能清单","A1:I28","优化后功能清单预览.png"],["删减合并记录",`A1:H${delEnd}`,"删减合并记录预览.png"],["优化说明","A1:D11","优化说明预览.png"]]) {
  const img=await wb.render({sheetName,range,scale:1.15,format:"png"});
  await fs.writeFile(`${outputDir}/${file}`,new Uint8Array(await img.arrayBuffer()));
}
const xlsx=await SpreadsheetFile.exportXlsx(wb); await xlsx.save(outputPath);
console.log(JSON.stringify({outputPath,total:matrix.length,changed:changedRows.length,removed:removed.length}));
