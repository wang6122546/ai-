import fs from "node:fs/promises";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const outputDir="/Users/wang/Desktop/安全作业管理/outputs/20260831";
const outputPath=`${outputDir}/新作业管理原型功能清单_精简版_V1.0.01.xlsx`;
const rows=[];
const add=(end,l1,l2,name,desc,p="P0",phase="方案原型",status="目标态",note="")=>rows.push([rows.length+1,end,l1,l2,name,desc,p,phase,status,note]);

add("PC","作业管理首页","首页概览","作业综合概览","展示作业、待办、风险、隐患和报警等总体情况。","P1","一期","已体现");
add("PC","作业管理首页","快捷操作","搜索与新建","支持快速搜索作业和进入新建作业流程。","P0","方案原型","已体现");
add("PC","安全作业一张图","综合监管","作业一张图","集中展示作业统计、类型占比、最新作业、GIS位置、视频、隐患和报警。","P1","二期","已体现");

add("PC","作业计划","计划管理","计划编制","创建、编辑、复制和维护作业计划。","P0","方案原型","已体现");
add("PC","作业计划","计划审批","审批与发布","提交计划审批，支持通过、退回、驳回、发布、变更和取消。","P0","方案原型","已体现");
add("PC","作业计划","计划执行","转票与进度","从计划创建作业票，跟踪关联作业票和总体执行进度。","P0","方案原型","已体现");
add("PC","作业计划","风险控制","冲突检查","检查时间、地点、设备和隔离范围冲突，必要时关联交叉作业。","P0","方案原型","已体现");

add("PC","一件一案","方案管理","方案编制","维护专项方案、危险类别、风险等级、作业步骤、安全措施和应急处置。","P0","方案原型","已体现");
add("PC","一件一案","审批管理","方案审批","按方案等级和人员职责完成作业前审批确认。","P0","方案原型","已体现");
add("PC","一件一案","业务关联","计划与作业票关联","支持关联作业计划、从方案创建作业票或独立开票后关联方案。","P0","方案原型","已体现");
add("PC","一件一案","过程管理","监管与收尾","记录作业中监管、人员变更审批和方案收尾情况。","P0","一期","部分体现");

add("PC","作业管理","作业分类","作业类型管理","支持常规作业及18类专项作业，类型差异通过模板配置。","P0","一期","部分体现","有限空间/受限空间名称待确认");
add("PC","作业管理","作业台账","列表查询","按类型、状态、单位、区域、时间、负责人等条件查询作业。","P0","方案原型","已体现");
add("PC","作业管理","作业台账","作业操作","支持申请、查看、复制、撤回、终止、导出和打印。","P0","一期","部分体现");
add("PC","作业管理","作业申请","申请填报","填写作业基本信息、单位人员、地点设备、附件、定位和视频设备。","P0","方案原型","已体现");
add("PC","作业管理","作业申请","关联业务","支持关联作业计划、一件一案及相关专项票。","P0","一期","部分体现");
add("PC","作业管理","作业申请","校验提交","校验必填信息、人员资质、作业冲突和审批流程后提交。","P0","一期","部分体现");
add("PC","作业管理","审批准备","风险与措施","完成风险评估、安全措施确认和必要检测分析。","P0","一期","部分体现");
add("PC","作业管理","安全交底","交底确认","完成安全交底发起、人员实名确认和签名留痕。","P0","一期","部分体现");
add("PC","作业管理","作业审批","流程审批","按类型、等级和单位执行多级审批，支持退回和驳回。","P0","一期","部分体现");
add("PC","作业管理","开工控制","开工校验","审批、交底、资质、措施、检测和视频条件满足后方可开工。","P0","一期","目标态");
add("PC","作业管理","现场实施","实施与监护","记录签到、开工、监护、检测、影像和现场异常。","P0","一期","部分体现");
add("PC","作业管理","现场实施","暂停与恢复","重大隐患、报警、超期或视频断联时暂停，条件恢复后继续作业。","P0","一期","目标态");
add("PC","作业管理","完工验收","验收与完成","完成收尾检查、验收审批并生成已完成作业。","P0","一期","部分体现");
add("PC","作业管理","作业档案","详情与归档","集中查看全过程详情，归档作业票、签名、附件和监护报告。","P0","一期","部分体现");

add("PC","我的待办","任务办理","待办任务","集中办理风险评估、措施确认、审批、交底、实施、验收和事件处置任务。","P0","一期","目标态");
add("PC","隐患排查","隐患闭环","隐患管理","支持隐患上报、派发、整改、复查、关闭和逾期升级。","P0","一期","已体现");
add("PC","智能监测","监测管理","设备与报警","管理监测设备、点位、阈值、趋势、报警确认及作业关联。","P1","二期","已体现");
add("PC","辅助分析","统计分析","作业分析","分析作业趋势、风险、类型、人员、单位和隐患，并支持下钻明细。","P2","二期","已体现");
add("PC","参数配置","业务配置","参数管理","配置作业类型、等级、审批流、风险措施、交底、结束标准和业务开关。","P0","一期","已体现");
add("PC","自定义作业模板","审批流表格","审批表格配置","配置审批节点表格、字段权限、意见、签名和流转规则。","P0","方案原型","已体现");
add("PC","自定义作业模板","自定义表格","表单设计","通过组件、画布和属性规则设计作业票、检查、交底、监护及验收表。","P0","方案原型","已体现");
add("PC","自定义作业模板","版本管理","模板发布","支持模板草稿、预览、校验、发布、复制、启停、导出和历史版本快照。","P0","方案原型","已体现");

add("App","作业申请","申请入口","发起申请","选择作业类型，直接申请或关联计划、一件一案发起申请。","P0","方案原型","已体现");
add("App","作业申请","申请表单","信息填报","分步填写基本信息、单位人员、地点、附件和监控设备。","P0","方案原型","已体现");
add("App","作业申请","草稿提交","保存与校验","支持草稿保存、必填校验、错误定位和提交。","P0","方案原型","已体现");
add("App","作业监控查看","监控列表","作业查询","查看权限范围内的监控作业，并按关键词、类型、状态和单位筛选。","P0","方案原型","部分体现");
add("App","作业监控查看","监控详情","作业信息查看","查看作业基本信息、相关人员、风险措施、设备和当前状态。","P0","方案原型","部分体现");
add("App","作业监控查看","实时监控","视频与监测","查看现场视频、气体检测、设备状态、人员监测和报警处置进度。","P0","方案原型","部分体现");

add("公共","权限与审计","权限控制","组织与角色权限","按组织、角色和作业关系控制数据范围和操作权限。","P0","一期","目标态");
add("公共","权限与审计","审计安全","安全与留痕","对审批、签名、导出和配置等关键操作进行安全控制和审计留痕。","P0","一期","目标态");

const wb=Workbook.create();
const sheet=wb.worksheets.add("精简功能清单"); sheet.showGridLines=false;
sheet.mergeCells("A1:J1"); sheet.getRange("A1").values=[["新作业管理原型功能清单（精简版）· V1.0.01"]];
sheet.mergeCells("A2:J2"); sheet.getRange("A2").values=[["按模块和关键业务能力合并整理；移动端当前仅包括作业申请、作业监控查看。"]];
sheet.getRange("A3:J3").values=[["编号","适用端","一级模块","二级模块","功能点","功能说明","优先级","阶段","原型状态","备注"]];
sheet.getRangeByIndexes(3,0,rows.length,10).values=rows;
const end=rows.length+3;
sheet.getRange(`A1:J${end}`).format.font={name:"Microsoft YaHei",size:10,color:"#1F2937"};
sheet.getRange("A1:J1").format={fill:"#17365D",font:{name:"Microsoft YaHei",size:18,bold:true,color:"#FFFFFF"},horizontalAlignment:"center"};
sheet.getRange("A2:J2").format={fill:"#D9EAF7",font:{name:"Microsoft YaHei",bold:true,color:"#1F4E78"}};
sheet.getRange("A3:J3").format={fill:"#2F75B5",font:{name:"Microsoft YaHei",bold:true,color:"#FFFFFF"},horizontalAlignment:"center",verticalAlignment:"center",wrapText:true};
sheet.getRange(`A4:J${end}`).format={wrapText:true,verticalAlignment:"center",borders:{insideHorizontal:{style:"thin",color:"#D9E2F3"}}};
sheet.getRange(`A4:B${end}`).format.horizontalAlignment="center"; sheet.getRange(`G4:I${end}`).format.horizontalAlignment="center";
[7,10,22,22,25,62,10,12,14,32].forEach((w,i)=>sheet.getRange(`${"ABCDEFGHIJ"[i]}:${"ABCDEFGHIJ"[i]}`).format.columnWidth=w);
sheet.getRange(`A4:J${end}`).format.autofitRows(); sheet.freezePanes.freezeRows(3); sheet.freezePanes.freezeColumns(2);
const t=sheet.tables.add(`A3:J${end}`,true,"CoarseFunctionList"); t.style="TableStyleMedium2"; t.showFilterButton=true;
sheet.getRange(`B4:B${end}`).dataValidation={rule:{type:"list",values:["PC","App","公共"]}};
sheet.getRange(`G4:G${end}`).dataValidation={rule:{type:"list",values:["P0","P1","P2"]}};
sheet.getRange(`H4:H${end}`).dataValidation={rule:{type:"list",values:["方案原型","一期","二期"]}};
sheet.getRange(`I4:I${end}`).dataValidation={rule:{type:"list",values:["已体现","部分体现","目标态"]}};
sheet.getRange(`G4:G${end}`).conditionalFormats.add("containsText",{text:"P0",format:{fill:"#FCE8E6",font:{color:"#C00000",bold:true}}});
sheet.getRange(`G4:G${end}`).conditionalFormats.add("containsText",{text:"P1",format:{fill:"#FFF2CC",font:{color:"#7F6000",bold:true}}});
sheet.getRange(`G4:G${end}`).conditionalFormats.add("containsText",{text:"P2",format:{fill:"#E2F0D9",font:{color:"#375623"}}});

await fs.mkdir(outputDir,{recursive:true});
console.log((await wb.inspect({kind:"table",range:"精简功能清单!A1:J24",include:"values,formulas",tableMaxRows:24,tableMaxCols:10,maxChars:12000})).ndjson);
console.log((await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",options:{useRegex:true,maxResults:100},summary:"formula error scan"})).ndjson);
const img=await wb.render({sheetName:"精简功能清单",range:`A1:J${end}`,scale:1.05,format:"png"});
await fs.writeFile(`${outputDir}/精简功能清单预览.png`,new Uint8Array(await img.arrayBuffer()));
const xlsx=await SpreadsheetFile.exportXlsx(wb); await xlsx.save(outputPath);
console.log(JSON.stringify({outputPath,rowCount:rows.length}));
