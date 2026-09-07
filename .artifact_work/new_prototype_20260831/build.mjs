import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir="/Users/wang/Desktop/安全作业管理/outputs/20260831";
const outputPath=`${outputDir}/新作业管理原型功能清单_V1.0.01.xlsx`;
const rows=[];
const add=(end,l1,l2,name,desc,priority="P0",phase="方案原型",status="目标态",source="PRD V1.0.01",note="")=>rows.push([rows.length+1,end,l1,l2,name,desc,priority,phase,status,source,note]);

// PC 首页与全局导航
add("PC","作业管理首页","首页概览","关键指标","展示今日作业、待审批、高风险作业、隐患和报警等概览指标。","P1","一期","已体现","PC原型/PRD 04");
add("PC","作业管理首页","快捷入口","新建作业","从首页进入作业申请流程。","P0","方案原型","已体现","PC原型");
add("PC","作业管理首页","全局检索","作业搜索","按作业名称、编号或负责人检索作业，并保留其他筛选条件。","P0","方案原型","已体现","PC原型/PRD 04");
add("PC","作业管理首页","状态反馈","页面状态","覆盖正常、加载、空、错误和无权限状态。","P0","方案原型","部分体现","项目验收规则");

// 一张图
for (const [n,d] of [["状态统计","统计各业务状态作业数量并支持组织联动。"],["类型占比","展示各作业类型数量和占比。"],["最新作业","展示最新作业及实时状态，点击进入同一作业详情。"],["GIS定位","在地图中展示作业点位并支持定位。"],["实时视频","查看关联作业的实时视频。"],["隐患与报警","展示作业隐患和设备报警。"]]) add("PC","安全作业一张图","综合监管",n,d,"P1","二期","已体现","PRD 04/PC原型");

// 作业计划
for (const [s,n,d] of [
  ["计划列表","组合查询","按计划编号、作业类型、单位、区域、负责人、计划时间和状态查询。"],
  ["计划列表","进度展示","展示关联作业票数量、未开票/申请中/作业中/已完成/已取消数量及完成率。"],
  ["计划维护","新建计划","填写计划名称、类型、单位、地点或设备、起止时间、负责人、人数、内容和风险概述。"],
  ["计划维护","编辑与删除","草稿计划可编辑、删除和复制。"],
  ["计划审批","提交审批","提交计划并进入计划审批流程。"],
  ["计划审批","审批与发布","支持通过、退回、驳回；审批通过后发布。"],
  ["计划控制","取消与变更","允许取消计划；重大变更须重新审批。"],
  ["计划转票","创建作业票","从已发布计划创建作业票并带入受控字段，保留计划值和票证值差异。"],
  ["冲突检查","作业冲突检测","检查时间、地点、设备、隔离范围及相关单位冲突，必要时关联交叉作业审批。"]
]) add("PC","作业计划",s,n,d,"P0","方案原型","已体现","PRD 4A/PC原型");

// 一件一案
for (const [s,n,d] of [
  ["方案列表","查询筛选","按方案编号、项目、危险类别、风险等级、单位、负责人和状态查询。"],
  ["方案维护","新建方案","填写方案名称、项目、地点、单位、人数、危险类别和综合风险等级。"],
  ["方案维护","实施步骤","维护具体作业步骤、主要风险、安全措施和应急处置。"],
  ["人员职责","责任人员","配置负责人、安全监护人及各审批责任人。"],
  ["审批确认","作业前审批","按一件一案等级和职责进入作业前审批确认。"],
  ["计划关联","关联作业计划","可关联作业计划并引用计划信息。"],
  ["作业票关联","方案转票","可从一件一案创建作业票并带入方案信息。"],
  ["作业票关联","独立开票后关联","独立申请作业票后可关联一件一案作为专项方案及审批附件。"],
  ["过程监管","作业中监管","关联作业实施记录、人员变更审批和异常处置。"],
  ["收尾管理","作业收尾","关联完工验收并保留专项方案收尾记录。"]
]) add("PC","一件一案",s,n,d,"P0","方案原型","已体现","PRD 03/PC原型");

// 类型体系
const types=["常规作业","有限空间作业","高处作业","吊装作业","临时用电作业","动土作业","断路作业","动火作业","盲板抽堵作业","探放水作业","空区治理作业","顶板支护作业","爆破作业","基坑作业","模板及支撑作业","起重机械安拆作业","脚手架作业","拆除工程作业","交叉作业"];
for(const t of types)add("PC","作业管理","作业类型",t,`通过${t}模板承载专项字段、风险、措施、审批节点和验收要求。`,"P0","一期","目标态","PRD 04");

// 作业管理列表和全流程
for (const [s,n,d] of [
  ["作业列表","分类与状态查询","按作业分类、类型、状态、单位、区域、时间、负责人和关键词查询。"],
  ["作业列表","状态页签","按草稿、申请中、待开工、作业中、已完成、作废展示统一业务状态。"],
  ["作业列表","列表操作","支持查看、复制新增、撤回、终止、导出和打印，按钮受状态与权限控制。"],
  ["作业申请","直接申请","无作业计划时可直接创建作业票。"],
  ["作业申请","关联计划","选择有效计划并带入作业类型、地点、时间、风险点和措施。"],
  ["作业申请","关联一件一案","关联既有方案或从方案创建作业票。"],
  ["作业申请","基础信息","填写类型、等级、单位、地点、设备、项目、作业内容和计划时间。"],
  ["作业申请","相关单位与人员","配置作业单位、申请人、负责人、监护人、作业人员和验收人员。"],
  ["作业申请","资质校验","校验在岗状态、证书有效期、角色互斥和同时间段作业冲突。"],
  ["作业申请","附件与定位","上传图片和附件，选择地址、地图点位及关联设备。"],
  ["作业申请","视频绑定","申请时选择视频方案或监控设备。"],
  ["作业申请","草稿与提交","支持暂存、删除、复制；提交时一次反馈全部阻断项。"],
  ["风险评估","风险辨识","按模板加载风险项，记录等级、备注和证据附件。"],
  ["安全措施","措施确认","按模板加载措施并逐项确认，内容变更后原确认失效。"],
  ["检测分析","气体检测","记录检测时间、点位、检测值、结论和责任人；不合格时阻断开工。"],
  ["安全交底","交底发起","按模板生成交底内容，由交底人签字。"],
  ["安全交底","接收确认","参与人员逐人实名确认，未全员完成时阻断开工。"],
  ["作业审批","流程审批","按类型、等级、单位等条件进入多级审批，支持会签或或签。"],
  ["作业审批","退回与驳回","退回到指定节点补正；驳回结束流程并记录原因。"],
  ["开工控制","开工条件校验","校验审批、交底、资质、措施、检测和视频在线覆盖。"],
  ["现场实施","开工记录","记录实际开工时间、签到人员和现场状态。"],
  ["现场实施","监护记录","记录监护内容、检测数据、影像和异常情况。"],
  ["现场实施","暂停与恢复","重大隐患、报警、票证到期或视频断联触发暂停；复查通过后恢复。"],
  ["现场实施","人员变更","涉及一件一案时，人员变更进入变更审批。"],
  ["完工验收","提交验收","确认人员撤离、工器具清点、隔离解除、场地恢复等结束标准。"],
  ["完工验收","验收审批","验收人签署结论，通过后转为已完成。"],
  ["归档","票证归档","归档作业票、签名、附件、检测、监护、隐患和验收记录，归档后只读。"],
  ["归档","监护报告","生成带时间和版本号的监护报告，重新生成不覆盖旧版。"]
]) add("PC","作业管理",s,n,d,"P0","一期","部分体现","PRD 03/04/06及PC原型");

// 详情
for(const n of ["基本信息","相关人员","作业初审","风险评估","安全措施","安全交底","作业审批","完工验收","监测记录","隐患清单","操作日志","关联票证","附件","监护报告"])
  add("PC","作业详情","详情页签",n,`在同一作业主数据下查看${n}；仅按已发生业务阶段开放，归档后只读。`,"P0","一期","部分体现","PRD 04/PC原型");

// 待办
for(const n of ["风险评估","措施确认","作业审批","安全交底","现场实施","验收审批","事件处置"])
  add("PC","我的待办","待办分类",`${n}待办`,`展示本人待处理的${n}任务，处理成功后即时移出并保留处理意见。`,"P0","一期","目标态","PRD 04");

// 隐患
for(const [n,d] of [["隐患上报","登记隐患位置、来源、分类、等级、描述和现场照片。"],["整改派发","指定整改责任人、期限和要求。"],["整改反馈","提交整改结果、说明和证据。"],["整改复查","复查整改结果并决定关闭或退回。"],["隐患关闭","完成闭环并保留全过程记录。"],["风险与逾期筛选","按风险等级、状态、单位、作业和逾期情况筛选。"],["重大隐患联动","重大隐患触发作业暂停和升级提醒。"]]) add("PC","隐患排查","隐患闭环",n,d,"P0","一期","已体现","PRD 04/06及PC原型");

// 智能监测与分析
for(const [n,d] of [["设备点位","展示监测设备、所属区域和在线状态。"],["阈值配置","维护不同监测指标的报警阈值。"],["实时趋势","查看气体、设备和人员监测趋势。"],["报警记录","展示报警时间、值、级别和关联作业。"],["报警确认","记录报警确认、处置和解除过程。"],["断联区分","区分设备断联与监测值越限。"]]) add("PC","智能监测","监测管理",n,d,"P1","二期","已体现","PRD 04/PC原型");
for(const [n,d] of [["状态分析","统计作业状态数量和占比。"],["趋势分析","按时间展示作业变化趋势。"],["风险分析","展示风险等级和区域分布。"],["类型分析","统计各作业类型数量和占比。"],["人员与单位分析","统计人员、单位和相关方作业情况。"],["隐患分析","统计隐患分类、等级、整改率和逾期情况。"],["下钻明细","从图表下钻到使用同一口径的作业或隐患明细。"]]) add("PC","辅助分析","统计分析",n,d,"P2","二期","已体现","PRD 04/PC原型");

// 参数与模板
for(const [n,d] of [["综合配置","配置系统业务开关。"],["作业类型与等级","配置类型、等级、排序和启停。"],["审批流程","配置审批节点、条件、会签或签和退回目标。"],["风险与措施","配置各类型风险项和管控措施。"],["安全交底","配置交底模板和确认要求。"],["结束标准","配置验收及结束标准。"],["配置版本","保存草稿、发布版本；历史作业继续引用发起时快照。"]]) add("PC","参数配置","业务配置",n,d,"P0","一期","已体现","PRD 04/06及PC原型");
for(const [s,n,d] of [
  ["审批流表格","节点表格绑定","为审批节点绑定需要查看、填写和签署的表格。"],
  ["审批流表格","字段权限","配置字段读写、必填条件、审批意见和签名要求。"],
  ["审批流表格","流程规则","配置会签、或签、退回目标及已发布流程版本。"],
  ["自定义表格","组件库","提供文本、数字、日期、选项、人员、部门、图片、附件、地址、定位、子表单、签名等组件。"],
  ["自定义表格","设计画布","支持组件拖放、分组、排序、布局、复制和删除。"],
  ["自定义表格","属性与规则","配置字段编码、默认值、必填、只读、隐藏、数据源、角色权限、条件、校验和联动。"],
  ["自定义表格","模板预览","模拟PC/App展示、条件联动和校验，不写入正式数据。"],
  ["版本管理","保存与发布","保存生成草稿；发布前完成校验，发布后形成不可变版本。"],
  ["版本管理","复制与启停","复制生成新草稿；已发布模板只能停用，历史业务不受影响。"],
  ["版本管理","模板导出","导出模板定义、版本和规则，不导出敏感数据源凭据。"]
]) add("PC","自定义作业模板",s,n,d,"P0","方案原型","已体现","PRD 4A/模板中心原型");

// 权限审计
for(const [n,d] of [["组织数据权限","集团查看全级次，单位查看本单位及下属单位，相关人员查看本人参与记录。"],["功能与角色权限","按角色控制申请、审批、监管、配置、导出和跨单位操作。"],["敏感数据保护","敏感字段脱敏，传输和存储加密，附件执行安全检查。"],["操作审计","新增、修改、审批、签名、导出和配置记录操作者、时间、前后值及来源端。"],["幂等与重试","任务提交防重复，失败时保留数据并允许重试。"]]) add("公共","权限与审计","平台控制",n,d,"P0","一期","目标态","PRD 02/08");

// App only current scope
for(const [s,n,d] of [
  ["申请入口","类型选择","选择启用且本人有权申请的作业类型。"],
  ["申请入口","直接申请","无计划时直接发起作业票申请。"],
  ["关联信息","关联作业计划","选择有效计划并带入作业类型、地点、时间等信息。"],
  ["关联信息","关联一件一案","选择既有一件一案并带入方案关联信息。"],
  ["分步表单","基本信息","填写作业内容、项目、单位、地点、时间和专项字段。"],
  ["分步表单","相关单位与人员","填写相关单位、负责人、监护人、作业人员等申请信息。"],
  ["分步表单","附件上传","上传作业内容附件、图片和必要证明材料。"],
  ["分步表单","监控设备选择","选择作业期间使用的监控设备。"],
  ["草稿与校验","草稿保存","自动保存或手动保存申请草稿。"],
  ["草稿与校验","提交校验","集中校验必填项并定位首个错误，失败后保留已填内容。"]
]) add("App","作业申请",s,n,d,"P0","方案原型","已体现","移动端范围决策/App原型");
for(const [s,n,d] of [
  ["监控列表","作业查询","查看本人权限范围内的监控作业列表，支持关键词、类型、状态和单位筛选。"],
  ["监控列表","状态展示","展示申请中、待开工、作业中、已完成和作废等统一状态。"],
  ["监控详情","基本信息","只读查看作业基本信息、时间、地点、单位和负责人。"],
  ["监控详情","相关人员","只读查看作业人员、监护人员及资质状态。"],
  ["监控详情","风险措施","只读查看风险评估和安全措施落实情况。"],
  ["监控详情","监控设备","查看绑定设备、在线状态和有效覆盖状态。"],
  ["实时监控","视频查看","查看作业现场实时视频或视频索引。"],
  ["实时监控","监测数据","查看气体检测、设备和人员监测数据。"],
  ["报警查看","报警信息","查看报警级别、发生时间、位置、检测值及关联人员。"],
  ["报警查看","处置状态","只读查看报警确认、处置和解除进度。"]
]) add("App","作业监控查看",s,n,d,"P0","方案原型","部分体现","移动端范围决策/App原型");

const wb=Workbook.create();
const main=wb.worksheets.add("功能清单");
const scope=wb.worksheets.add("范围说明");
const pending=wb.worksheets.add("待确认事项");
for(const s of [main,scope,pending])s.showGridLines=false;

main.mergeCells("A1:K1"); main.getRange("A1").values=[["新作业管理原型功能清单 · V1.0.01"]];
main.mergeCells("A2:K2"); main.getRange("A2").values=[["基于现行PRD、已接受决策和当前原型整理；移动端当前仅包括作业申请、作业监控查看。"]];
main.getRange("A3:K3").values=[["编号","适用端","一级模块","二级模块","功能点","功能说明","优先级","阶段","原型状态","事实源","备注"]];
main.getRangeByIndexes(3,0,rows.length,11).values=rows;
const end=rows.length+3;
main.getRange(`A1:K${end}`).format.font={name:"Microsoft YaHei",size:10,color:"#1F2937"};
main.getRange("A1:K1").format={fill:"#17365D",font:{name:"Microsoft YaHei",size:18,bold:true,color:"#FFFFFF"},horizontalAlignment:"center",verticalAlignment:"center"};
main.getRange("A2:K2").format={fill:"#D9EAF7",font:{name:"Microsoft YaHei",size:10,bold:true,color:"#1F4E78"},horizontalAlignment:"left",verticalAlignment:"center"};
main.getRange("A3:K3").format={fill:"#2F75B5",font:{name:"Microsoft YaHei",size:10,bold:true,color:"#FFFFFF"},horizontalAlignment:"center",verticalAlignment:"center",wrapText:true};
main.getRange(`A4:K${end}`).format={wrapText:true,verticalAlignment:"center",borders:{insideHorizontal:{style:"thin",color:"#D9E2F3"}}};
main.getRange(`A4:A${end}`).format.horizontalAlignment="center"; main.getRange(`B4:B${end}`).format.horizontalAlignment="center"; main.getRange(`G4:J${end}`).format.horizontalAlignment="center";
[7,10,22,22,25,58,10,12,14,25,24].forEach((w,i)=>main.getRange(`${"ABCDEFGHIJK"[i]}:${"ABCDEFGHIJK"[i]}`).format.columnWidth=w);
main.getRange(`A4:K${end}`).format.autofitRows(); main.freezePanes.freezeRows(3); main.freezePanes.freezeColumns(2);
const tbl=main.tables.add(`A3:K${end}`,true,"NewPrototypeFunctions"); tbl.style="TableStyleMedium2"; tbl.showFilterButton=true;
main.getRange(`B4:B${end}`).dataValidation={rule:{type:"list",values:["PC","App","公共"]}};
main.getRange(`G4:G${end}`).dataValidation={rule:{type:"list",values:["P0","P1","P2"]}};
main.getRange(`H4:H${end}`).dataValidation={rule:{type:"list",values:["方案原型","一期","二期"]}};
main.getRange(`I4:I${end}`).dataValidation={rule:{type:"list",values:["已体现","部分体现","目标态","待确认"]}};
main.getRange(`G4:G${end}`).conditionalFormats.add("containsText",{text:"P0",format:{fill:"#FCE8E6",font:{color:"#C00000",bold:true}}});
main.getRange(`G4:G${end}`).conditionalFormats.add("containsText",{text:"P1",format:{fill:"#FFF2CC",font:{color:"#7F6000",bold:true}}});
main.getRange(`G4:G${end}`).conditionalFormats.add("containsText",{text:"P2",format:{fill:"#E2F0D9",font:{color:"#375623"}}});

scope.mergeCells("A1:D1"); scope.getRange("A1").values=[["功能清单范围说明"]];
scope.getRange("A3:D3").values=[["主题","当前口径","依据","说明"]];
const scopeRows=[
  ["产品基线","V1.0.01，方案原型，计划2026-09-15完成。","PRD 文档概览/AGENTS.md","本清单服务于当前原型评审。"],
  ["PC范围","管理、监管、配置、综合分析及完整作业闭环。","PRD 02/04","包括计划、一件一案、作业管理、待办、隐患、监测、分析、参数和模板。"],
  ["App范围","仅作业申请、作业监控查看。","docs/decisions/20260820-mobile-scope.md","不将移动审批、处置、验收等列入当前范围。"],
  ["共用规则","PC/App共享字段、状态和业务语义。","移动端范围决策","两端页面和功能不要求完全一致。"],
  ["作业类型","常规作业加18类模板。","PRD 04","“有限空间/受限空间”名称仍待确认。"],
  ["原型状态","已体现、部分体现、目标态、待确认。","现有原型与PRD比对","原型存在不等于业务规则已确认。"],
  ["范围外","承包商招采、工程计量、事故调查全流程、独立小程序、离线原生客户端。","PRD 02","视频AI和IoT实时设备依赖接口能力。"]
];
scope.getRange("A4:D10").values=scopeRows;

pending.mergeCells("A1:D1"); pending.getRange("A1").values=[["待确认事项"]];
pending.getRange("A3:D3").values=[["编号","待确认问题","建议动作","影响范围"]];
const pendingRows=[
  ["Q1","常规作业是独立票种还是未命中危险类型的兜底分类？","由产品负责人明确准入定义与模板。","类型体系"],
  ["Q2","有限空间/受限空间采用哪个正式名称？","统一业务名称并保留历史别名。","模板与统计"],
  ["Q3","不同类型和等级的审批层级、会签/或签规则是什么？","输出审批矩阵。","流程引擎"],
  ["Q4","代签适用范围及法律效力如何界定？","默认关闭，确认授权及留痕规则。","签名审计"],
  ["Q5","延期、暂停、恢复和人员变更触发哪些重新审批？","确认变更项与重审范围。","状态机"],
  ["Q6","视频、IoT、GIS和人员定位的厂商及接口能力？","完成接口摸底和降级方案。","智能监测"],
  ["Q7","组织数据范围和正式组织文案？","以主数据系统和项目业主确认结果为准。","权限与文案"],
  ["Q8","保存年限、并发量、SLA和指标目标？","业务与技术联合定标。","架构与验收"]
];
pending.getRange("A4:D11").values=pendingRows;

for(const [s,last,widths] of [[scope,10,[18,52,40,52]],[pending,11,[10,62,50,28]]]){
  s.getRange(`A1:D${last}`).format.font={name:"Microsoft YaHei",size:10,color:"#1F2937"};
  s.getRange("A1:D1").format={fill:"#17365D",font:{name:"Microsoft YaHei",size:18,bold:true,color:"#FFFFFF"},horizontalAlignment:"center"};
  s.getRange("A3:D3").format={fill:"#2F75B5",font:{name:"Microsoft YaHei",bold:true,color:"#FFFFFF"},horizontalAlignment:"center"};
  s.getRange(`A4:D${last}`).format={wrapText:true,verticalAlignment:"center",borders:{insideHorizontal:{style:"thin",color:"#D9E2F3"}}};
  widths.forEach((w,i)=>s.getRange(`${"ABCD"[i]}:${"ABCD"[i]}`).format.columnWidth=w);
  s.getRange(`A4:D${last}`).format.autofitRows(); s.freezePanes.freezeRows(3);
}
scope.tables.add("A3:D10",true,"ScopeNotes").style="TableStyleMedium2";
pending.tables.add("A3:D11",true,"PendingQuestions").style="TableStyleMedium2";

await fs.mkdir(outputDir,{recursive:true});
console.log((await wb.inspect({kind:"table",range:"功能清单!A1:K22",include:"values,formulas",tableMaxRows:22,tableMaxCols:11,maxChars:12000})).ndjson);
console.log((await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",options:{useRegex:true,maxResults:100},summary:"formula error scan"})).ndjson);
for(const [sheetName,range,file] of [["功能清单","A1:K30","功能清单预览.png"],["范围说明","A1:D10","范围说明预览.png"],["待确认事项","A1:D11","待确认事项预览.png"]]){
  const img=await wb.render({sheetName,range,scale:1.15,format:"png"}); await fs.writeFile(`${outputDir}/${file}`,new Uint8Array(await img.arrayBuffer()));
}
const xlsx=await SpreadsheetFile.exportXlsx(wb); await xlsx.save(outputPath);
console.log(JSON.stringify({outputPath,rowCount:rows.length}));
