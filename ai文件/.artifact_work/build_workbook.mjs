import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir = "/Users/wang/Desktop/安全作业管理/outputs/20260819";
const outputPath = `${outputDir}/作业管理功能清单.xlsx`;

const rows = [];
const add = (l1, l2, name, desc, end="Web、App", source="附件整理", priority="P0", note="") =>
  rows.push([rows.length + 1, l1, l2, name, desc, end, source, priority, note]);

const types = ["常规作业","动火作业","受限空间作业","盲板抽堵作业","高处作业","吊装作业","临时用电作业","动土作业","断路作业"];
for (const type of types) add("作业类型管理", "作业分类", type, `支持${type}申请、审批、实施、验收、完成及作废全过程管理。`, "Web、App", "附件整理", "P0");

add("全生命周期管理","作业申请","新建作业申请","选择作业类型并新建作业申请。","Web、App");
add("全生命周期管理","作业申请","暂存与编辑","申请信息可暂存，并在提交前继续编辑。","Web、App","建议补充","P0");
add("全生命周期管理","作业申请","复制申请","基于历史作业复制基础信息，减少重复录入。","Web、App","建议补充","P2");
add("全生命周期管理","作业申请","提交、撤回与退回修改","支持提交审批、审批前撤回及退回后修改重提。","Web、App","建议补充","P0");
add("全生命周期管理","基本信息","作业基本信息维护","填写作业名称、类型、等级、单位、地点、时间及作业内容。","Web、App","附件归纳","P0");
add("全生命周期管理","作业单位","内部单位选择","从组织架构中选择作业单位。","Web、App","附件归纳","P0");
add("全生命周期管理","作业单位","临时新增作业单位","按参数开关允许申请时新增作业单位。","Web、App","附件整理","P1");
add("全生命周期管理","相关人员","人员配置","配置作业负责人、监护人、普通人员、特种作业人员及验收人员。","Web、App","附件整理","P0");
add("全生命周期管理","相关人员","临时新增作业人员","按参数开关允许申请时新增各类作业人员。","Web、App","附件整理","P1");
add("全生命周期管理","人员资质","资质与证书校验","校验特种作业资格、培训记录和证件有效期。","Web、App","建议补充","P1");
add("全生命周期管理","风险评估","风险辨识","按作业类型加载风险内容，支持勾选及补充风险。","Web、App","附件归纳","P0");
add("全生命周期管理","风险评估","风险等级评定","根据风险因素确定作业风险等级。","Web、App","附件归纳","P0");
add("全生命周期管理","风险评估","提交风险评估","办理人填写并提交风险评估信息。","Web、App","附件整理","P0");
add("全生命周期管理","安全措施","措施自动生成","按作业类型和等级生成预设管控措施。","Web、App","附件归纳","P0");
add("全生命周期管理","安全措施","逐项确认与举证","逐项确认现场措施，支持说明、拍照和附件。","Web、App","附件归纳","P0");
add("全生命周期管理","作业初审","申请资料初审","审查基本信息、人员资质、风险及安全措施。","Web、App","附件归纳","P0");
add("全生命周期管理","安全交底","交底内容生成","按作业类型加载安全交底预设内容。","Web、App","附件整理","P0");
add("全生命周期管理","安全交底","交底签名确认","相关人员阅读交底内容后签名确认。","Web、App","附件整理","P0");
add("全生命周期管理","安全交底","代操作确认","特殊情况下由授权人员提供设备代登录，签名仍由接受交底人员本人完成。","Web、App","附件整理","P1","需重点审计代操作行为");
add("全生命周期管理","作业审批","多级审批","按作业类型、等级和单位执行配置化审批流程。","Web、App","附件整理","P0");
add("全生命周期管理","作业审批","审批处理","支持同意、退回、驳回、填写审批意见。","Web、App","附件归纳","P0");
add("全生命周期管理","作业票","电子作业票生成","审批通过后自动生成电子作业票。","Web、App","附件整理","P0");
add("全生命周期管理","作业票","预览下载打印","支持预览、下载和打印作业票。","Web","附件归纳","P1");
add("全生命周期管理","开工确认","开工条件确认","核对人员、环境、设备、安全措施及检测结果后确认开工。","Web、App","建议补充","P0");
add("全生命周期管理","现场实施","开工与过程记录","记录实际开工时间、现场状态、实施情况及影像资料。","Web、App","附件归纳","P0");
add("全生命周期管理","过程监测","检测与监测记录","记录气体检测、环境参数、设备报警及视频监控信息。","Web、App","附件整理","P1");
add("全生命周期管理","隐患排查","隐患上报","作业前或作业中发现隐患时上报隐患。","Web、App","附件整理","P0");
add("全生命周期管理","隐患排查","整改闭环","记录整改、复查及关闭过程。","Web、App","建议补充","P0");
add("全生命周期管理","事件处置","事件上报与处置","对作业中的异常、违章、险情或事故进行上报和处置。","Web、App","附件整理","P0");
add("全生命周期管理","作业控制","暂停作业","记录暂停原因、时间和现场状态。","Web、App","建议补充","P1");
add("全生命周期管理","作业控制","恢复作业","重新确认风险和措施后恢复作业。","Web、App","建议补充","P1");
add("全生命周期管理","作业控制","作业延期","提交延期申请并重新确认有效性。","Web、App","建议补充","P1");
add("全生命周期管理","作业控制","作业变更","对时间、地点、人员或内容变更进行申请并按规则重审。","Web、App","建议补充","P1");
add("全生命周期管理","完工验收","验收申请","作业完成后发起验收。","Web、App","附件整理","P0");
add("全生命周期管理","完工验收","验收执行与签名","按结束标准逐项验收，记录结果并签名。","Web、App","附件整理","P0");
add("全生命周期管理","作业关闭","关闭作业","验收通过后关闭作业并形成完整档案。","Web、App","附件归纳","P0");
add("全生命周期管理","作业作废","作废处理","填写作废原因并保留作废前数据和操作轨迹。","Web、App","附件整理","P0");

const states = ["草稿","申请中","待审批","待开工","作业中","已暂停","待验收","已完成","已作废","已过期"];
for (const state of states) add("作业台账与状态管理", "状态分类", state, `支持查看和筛选${state}状态的作业。`, "Web、App", state.match(/申请中|作业中|已完成|已作废/) ? "附件整理" : "建议补充", state === "已过期" ? "P1" : "P0");
add("作业台账与状态管理","查询筛选","组合查询","按单位、类型、等级、状态、地点、申请人和时间组合查询。","Web、App","附件归纳","P0");
add("作业台账与状态管理","数据范围","分级数据查看","集团查看集团及下属单位；单位查看本单位及下属单位。","Web、App","附件整理","P0");
add("作业台账与状态管理","流程跟踪","进度查看","展示当前节点、办理人员、办理状态及全过程进度。","Web、App","附件整理","P0");
add("作业台账与状态管理","列表操作","导出与打印","支持作业列表导出及作业票下载、打印。","Web","建议补充","P1");
add("作业台账与状态管理","地图联动","作业定位","从最新作业快速跳转并定位作业位置。","Web","附件整理","P1");
add("作业台账与状态管理","时效提醒","临期与超期标识","对审批超时、临近开工和即将到期作业进行醒目标识。","Web、App","建议补充","P1");

const details = ["基本信息","相关人员","作业初审","安全交底","作业审批","完工验收","监测记录","隐患清单"];
for (const x of details) add("作业详情", "详情页签", x, `在作业详情中查看${x}。`, "Web、App", "附件整理", "P0");
for (const x of ["人员资质","风险评估","安全措施","作业票","开工确认","现场实施记录","事件处置记录","附件资料","操作日志"]) add("作业详情", "详情页签", x, `在作业详情中查看${x}。`, "Web、App", "建议补充", x === "操作日志" ? "P0" : "P1");

const tasks = ["风险评估待办","安全措施待办","作业审批待办","隐患排查待办","现场实施待办","验收审批待办","事件处置待办"];
for (const x of tasks) add("待办任务", "我的待办", x, `集中展示并办理${x}。`, "Web、App", "附件整理", "P0");
for (const x of ["作业初审待办","安全交底待办","开工确认待办","暂停/恢复/延期待办","抄送我的","已办任务","我发起的任务","任务催办","消息提醒"]) add("待办任务", "任务管理", x, `支持${x}的查看或处理。`, "Web、App", "建议补充", x === "任务催办" ? "P2" : "P1");

const stats = [
  ["状态统计","统计各状态作业数量。"],["类型统计","统计各类型作业数量及占比。"],["单位统计","统计各单位作业数量及排名。"],["风险分布","展示高风险作业分布。"],["趋势分析","展示作业数量时间趋势。"],["人员统计","统计作业人员数量及分布。"],["隐患分类统计","统计隐患分类、数量和整改情况。"],["作业统计列表","展示可查询、可导出的作业统计明细。"]
];
for (const [x,d] of stats) add("统计分析","作业分析",x,d,"Web","附件整理","P1");
for (const [x,d] of [["地图分布","展示作业区域空间分布。"],["审批效率","统计审批耗时和超时情况。"],["违章事件统计","统计作业违章和事件情况。"],["实时视频","查看实时作业监控视频。"],["智能报警","查看设备监测报警记录。"]]) add("统计分析","扩展分析",x,d,"Web","建议补充","P2");

for (const [x,d,s] of [
  ["综合配置","配置系统细节功能开关。","附件整理"],["作业类型配置","配置作业等级、审批节点及等级排序。","附件整理"],["风险内容配置","配置各作业类型风险及管控措施。","附件整理"],["安全交底配置","配置各作业类型交底预设。","附件整理"],["结束标准配置","配置各作业类型结束和验收标准。","附件整理"],["作业票模板","配置作业票版式和编号规则。","建议补充"],["有效期规则","配置有效期、延期次数和提醒时间。","建议补充"],["代操作开关","配置交底和验收代操作能力。","附件整理"],["新增单位人员开关","控制申请时是否允许新增作业单位和人员。","附件整理"],["消息规则","配置提醒渠道、触发条件和超时规则。","建议补充"]
]) add("参数配置","业务参数",x,d,"Web",s,"P1");

for (const [x,d] of [
  ["组织数据权限","按集团、单位及下属单位控制数据范围。"],["角色功能权限","按角色控制菜单和功能操作权限。"],["作业类型权限","限制用户可查看或办理的作业类型。"],["流程节点权限","限制各审批节点的办理角色。"],["附件访问权限","控制敏感附件的查看和下载。"],["导出打印权限","控制数据导出、下载和打印。"],["关键操作留痕","完整记录审批、签名、代操作及配置变更。"]
]) add("权限与审计","权限控制",x,d,"Web、App",x === "组织数据权限" ? "附件整理" : "建议补充","P0");

for (const [x,d,p] of [
  ["移动发起申请","移动端新建、暂存和提交作业申请。","P1"],["拍照录像上传","现场采集照片、视频和附件。","P0"],["扫码查票","扫描二维码查看电子作业票。","P1"],["手写签名","支持交底、审批和验收手写签名。","P0"],["移动审批","通过移动端办理审批、退回和驳回。","P0"],["现场隐患上报","拍照定位并上报现场隐患。","P0"],["检测数据填报","现场录入检测和监测数据。","P1"],["现场事件上报","快速上报异常、违章和险情。","P0"],["移动验收","现场办理完工验收和关闭确认。","P0"]
]) add("移动端能力","现场作业",x,d,"App",x === "移动审批" || x === "现场隐患上报" ? "附件归纳" : "建议补充",p);

for (const [x,d,p] of [
  ["交叉作业冲突检测","识别同一区域、同一时间的交叉作业风险。","P1"],["证件到期预警","提前提醒人员和承包商证件到期。","P1"],["电子签名校验","记录签名人、时间、设备和位置。","P1"],["离线作业","弱网环境暂存，恢复网络后同步。","P2"],["智能设备联动","接入检测仪、视频、门禁和定位设备。","P2"],["自动预警","对监测超限、人员越界和超时作业自动报警。","P1"],["一票一码","通过二维码核验作业票状态和人员信息。","P1"],["电子档案归档","作业完成后自动生成全过程电子档案。","P1"]
]) add("建议增强","数字化增强",x,d,"Web、App","建议增强",p);

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("功能清单");
const guide = workbook.worksheets.add("分类说明");
sheet.showGridLines = false;
guide.showGridLines = false;

sheet.mergeCells("A1:I1");
sheet.getRange("A1").values = [["作业管理功能清单"]];
sheet.getRange("A2:I2").values = [["编号","一级模块","二级模块","功能点","功能说明","适用端","来源属性","建议优先级","备注"]];
sheet.getRangeByIndexes(2,0,rows.length,9).values = rows;
sheet.getRange(`A1:I${rows.length+2}`).format.font = { name: "Microsoft YaHei", size: 10, color: "#1F2937" };
sheet.getRange("A1:I1").format = { fill: "#17365D", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
sheet.getRange("A1:I1").format.rowHeight = 34;
sheet.getRange("A2:I2").format = { fill: "#2F75B5", font: { name: "Microsoft YaHei", size: 10, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "outside", style: "thin", color: "#1F4E78" } };
sheet.getRange("A2:I2").format.rowHeight = 30;
sheet.getRange(`A3:I${rows.length+2}`).format = { verticalAlignment: "center", wrapText: true, borders: { insideHorizontal: { style: "thin", color: "#D9E2F3" } } };
sheet.getRange(`A3:A${rows.length+2}`).format.horizontalAlignment = "center";
sheet.getRange(`F3:H${rows.length+2}`).format.horizontalAlignment = "center";
sheet.getRange("A:A").format.columnWidth = 7;
sheet.getRange("B:B").format.columnWidth = 18;
sheet.getRange("C:C").format.columnWidth = 18;
sheet.getRange("D:D").format.columnWidth = 23;
sheet.getRange("E:E").format.columnWidth = 52;
sheet.getRange("F:F").format.columnWidth = 12;
sheet.getRange("G:G").format.columnWidth = 14;
sheet.getRange("H:H").format.columnWidth = 12;
sheet.getRange("I:I").format.columnWidth = 22;
sheet.getRange(`A3:I${rows.length+2}`).format.autofitRows();
sheet.freezePanes.freezeRows(2);
sheet.freezePanes.freezeColumns(1);
const table = sheet.tables.add(`A2:I${rows.length+2}`, true, "FunctionListTable");
table.style = "TableStyleMedium2";
table.showFilterButton = true;
sheet.getRange(`H3:H${rows.length+2}`).dataValidation = { rule: { type: "list", values: ["P0","P1","P2"] } };
sheet.getRange(`F3:F${rows.length+2}`).dataValidation = { rule: { type: "list", values: ["Web","App","Web、App"] } };
sheet.getRange(`H3:H${rows.length+2}`).conditionalFormats.add("containsText", { text: "P0", format: { fill: "#FCE8E6", font: { color: "#C00000", bold: true } } });
sheet.getRange(`H3:H${rows.length+2}`).conditionalFormats.add("containsText", { text: "P1", format: { fill: "#FFF2CC", font: { color: "#7F6000", bold: true } } });
sheet.getRange(`H3:H${rows.length+2}`).conditionalFormats.add("containsText", { text: "P2", format: { fill: "#E2F0D9", font: { color: "#375623" } } });

guide.mergeCells("A1:D1");
guide.getRange("A1").values = [["功能清单分类说明"]];
guide.getRange("A3:D3").values = [["字段","取值","定义","使用建议"]];
const guideRows = [
  ["来源属性","附件整理","附件中明确出现的功能点","作为现状或基础范围"],
  ["来源属性","附件归纳","根据附件流程和详情内容归纳出的功能","纳入需求澄清"],
  ["来源属性","建议补充","为形成完整业务闭环补充的能力","评审后确定是否纳入"],
  ["来源属性","建议增强","面向智能化和现场数字化的增强能力","可作为二期规划"],
  ["建议优先级","P0","核心业务闭环必需功能","一期必须实现"],
  ["建议优先级","P1","重要支撑或效率提升功能","结合一期范围实施"],
  ["建议优先级","P2","优化体验或前瞻增强功能","后续迭代实施"],
  ["适用端","Web","主要面向管理、配置、统计和监管","PC浏览器"],
  ["适用端","App","主要面向现场办理和移动采集","移动端"],
  ["适用端","Web、App","两端均需支持","能力与数据保持一致"]
];
guide.getRange("A4:D13").values = guideRows;
guide.getRange("A1:D13").format.font = { name: "Microsoft YaHei", size: 10, color: "#1F2937" };
guide.getRange("A1:D1").format = { fill: "#17365D", font: { name: "Microsoft YaHei", size: 18, bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
guide.getRange("A1:D1").format.rowHeight = 34;
guide.getRange("A3:D3").format = { fill: "#2F75B5", font: { name: "Microsoft YaHei", bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
guide.getRange("A4:D13").format = { wrapText: true, verticalAlignment: "center", borders: { insideHorizontal: { style: "thin", color: "#D9E2F3" } } };
guide.getRange("A:A").format.columnWidth = 18;
guide.getRange("B:B").format.columnWidth = 18;
guide.getRange("C:C").format.columnWidth = 46;
guide.getRange("D:D").format.columnWidth = 34;
guide.getRange("A3:D13").format.autofitRows();
guide.freezePanes.freezeRows(3);
const guideTable = guide.tables.add("A3:D13", true, "GuideTable");
guideTable.style = "TableStyleMedium2";

await fs.mkdir(outputDir, { recursive: true });
const inspect = await workbook.inspect({ kind: "table", range: `功能清单!A1:I12`, include: "values,formulas", tableMaxRows: 12, tableMaxCols: 9, maxChars: 7000 });
console.log(inspect.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(errors.ndjson);
const preview1 = await workbook.render({ sheetName: "功能清单", range: "A1:I28", scale: 1.2, format: "png" });
await fs.writeFile(`${outputDir}/功能清单预览.png`, new Uint8Array(await preview1.arrayBuffer()));
const preview2 = await workbook.render({ sheetName: "分类说明", range: "A1:D13", scale: 1.4, format: "png" });
await fs.writeFile(`${outputDir}/分类说明预览.png`, new Uint8Array(await preview2.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(JSON.stringify({ outputPath, rowCount: rows.length }));
