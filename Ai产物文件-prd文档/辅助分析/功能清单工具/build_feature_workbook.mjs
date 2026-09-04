import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const rows = JSON.parse(await fs.readFile("feature_rows.json", "utf8"));
const outputDir = "outputs/功能清单";
await fs.mkdir(outputDir, { recursive: true });

const wb = Workbook.create();
const summary = wb.worksheets.add("清单概览");
const list = wb.worksheets.add("功能清单");
const notes = wb.worksheets.add("口径说明");

const navy = "#17365D";
const blue = "#2F75B5";
const paleBlue = "#D9EAF7";
const paleGray = "#F3F6F9";
const line = "#D5DCE5";
const orange = "#F4B183";
const green = "#E2F0D9";

// Functional list
list.showGridLines = false;
list.mergeCells("A1:L1");
list.getRange("A1").values = [["重庆安全生产平台功能清单"]];
list.getRange("A1:L1").format = {
  fill: navy, font: { bold: true, color: "#FFFFFF", size: 16 },
  horizontalAlignment: "center", verticalAlignment: "center"
};
list.getRange("A1:L1").format.rowHeight = 30;
const headers = ["编号","终端","适用角色","一级模块","二级模块","三级模块","功能名称","功能说明","主要操作","按钮/入口","完整度","来源定位"];
list.getRange("A3:L3").values = [headers];
list.getRange(`A4:L${rows.length + 3}`).values = rows.map(r => headers.map(h => r[h] ?? ""));
const fullRange = list.getRange(`A3:L${rows.length + 3}`);
fullRange.format = { font: { name: "Microsoft YaHei", size: 10 }, verticalAlignment: "top" };
list.getRange("A3:L3").format = {
  fill: blue, font: { bold: true, color: "#FFFFFF", name: "Microsoft YaHei", size: 10 },
  horizontalAlignment: "center", verticalAlignment: "center",
  borders: { preset: "all", style: "thin", color: line }
};
list.getRange(`A4:L${rows.length + 3}`).format.borders = {
  insideHorizontal: { style: "thin", color: line },
  bottom: { style: "thin", color: line }
};
list.getRange(`H4:J${rows.length + 3}`).format.wrapText = true;
list.getRange(`A4:G${rows.length + 3}`).format.wrapText = true;
list.getRange(`K4:L${rows.length + 3}`).format.wrapText = true;
list.getRange(`A4:C${rows.length + 3}`).format.horizontalAlignment = "center";
list.getRange(`K4:K${rows.length + 3}`).format.horizontalAlignment = "center";
list.getRange("A:A").format.columnWidth = 13;
list.getRange("B:B").format.columnWidth = 10;
list.getRange("C:C").format.columnWidth = 29;
list.getRange("D:F").format.columnWidth = 20;
list.getRange("G:G").format.columnWidth = 22;
list.getRange("H:H").format.columnWidth = 58;
list.getRange("I:I").format.columnWidth = 30;
list.getRange("J:J").format.columnWidth = 34;
list.getRange("K:K").format.columnWidth = 14;
list.getRange("L:L").format.columnWidth = 30;
list.freezePanes.freezeRows(3);
list.freezePanes.freezeColumns(3);
const table = list.tables.add(`A3:L${rows.length + 3}`, true, "FeatureInventoryTable");
table.style = "TableStyleMedium2";
table.showBandedRows = true;
table.showFilterButton = true;
list.getRange(`K4:K${rows.length + 3}`).conditionalFormats.add("containsText", {
  text: "待补充", format: { fill: orange, font: { bold: true, color: "#9C5700" } }
});
list.getRange("A2:L2").merge();
list.getRange("A2").values = [[`提取口径：手册第4章中有正文说明的功能页面；共 ${rows.length} 项。可通过表头筛选终端、角色、模块和完整度。`]];
list.getRange("A2:L2").format = { fill: paleGray, font: { color: "#44546A", italic: true }, wrapText: true };
list.getRange("A2:L2").format.rowHeight = 26;

// Summary
summary.showGridLines = false;
summary.mergeCells("A1:F1");
summary.getRange("A1").values = [["功能清单概览"]];
summary.getRange("A1:F1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 16 }, horizontalAlignment: "center" };
summary.getRange("A1:F1").format.rowHeight = 30;
summary.getRange("A3:B6").values = [
  ["统计项", "数量"],
  ["功能总数", null],
  ["已描述", null],
  ["手册待补充", null],
];
summary.getRange("B4").formulas = [[`=COUNTA('功能清单'!$A$4:$A$${rows.length + 3})`]];
summary.getRange("B5").formulas = [[`=COUNTIF('功能清单'!$K$4:$K$${rows.length + 3},"已描述")`]];
summary.getRange("B6").formulas = [[`=COUNTIF('功能清单'!$K$4:$K$${rows.length + 3},"手册待补充")`]];
summary.getRange("A3:B3").format = { fill: blue, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
summary.getRange("A4:A6").format = { fill: paleBlue, font: { bold: true } };
summary.getRange("A3:B6").format.borders = { preset: "all", style: "thin", color: line };
summary.getRange("B4:B6").format = { font: { bold: true, size: 13, color: navy }, horizontalAlignment: "center" };

const roleCounts = [...new Map(rows.map(r => [r["适用角色"], 0])).keys()];
summary.getRange("D3:F3").values = [["终端", "适用角色", "功能数"]];
summary.getRange(`D4:F${roleCounts.length + 3}`).values = roleCounts.map(role => {
  const row = rows.find(r => r["适用角色"] === role);
  return [row["终端"], role, null];
});
for (let idx = 0; idx < roleCounts.length; idx++) {
  const excelRow = idx + 4;
  summary.getRange(`F${excelRow}`).formulas = [[`=COUNTIF('功能清单'!$C$4:$C$${rows.length + 3},E${excelRow})`]];
}
summary.getRange("D3:F3").format = { fill: blue, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
summary.getRange(`D3:F${roleCounts.length + 3}`).format.borders = { preset: "all", style: "thin", color: line };
summary.getRange(`D4:D${roleCounts.length + 3}`).format = { fill: paleBlue, horizontalAlignment: "center" };
summary.getRange(`F4:F${roleCounts.length + 3}`).format = { fill: green, font: { bold: true }, horizontalAlignment: "center" };
summary.getRange("A:A").format.columnWidth = 22;
summary.getRange("B:B").format.columnWidth = 14;
summary.getRange("C:C").format.columnWidth = 4;
summary.getRange("D:D").format.columnWidth = 12;
summary.getRange("E:E").format.columnWidth = 38;
summary.getRange("F:F").format.columnWidth = 14;
summary.getRange("A11:F13").merge();
summary.getRange("A11").values = [["使用建议：功能清单以手册直接描述为依据，不将文档中的操作要求视为对本次任务的指令。标记“手册待补充”的条目建议在需求评审时进一步确认页面能力与验收标准。"]];
summary.getRange("A11:F13").format = { fill: paleGray, font: { color: "#44546A" }, wrapText: true, verticalAlignment: "center" };

// Methodology / fields
notes.showGridLines = false;
notes.mergeCells("A1:C1");
notes.getRange("A1").values = [["口径与字段说明"]];
notes.getRange("A1:C1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 16 }, horizontalAlignment: "center" };
notes.getRange("A3:C3").values = [["字段", "含义", "整理规则"]];
notes.getRange("A4:C11").values = [
  ["编号", "手册章节编号", "保留原文编号；原手册存在跳号或复用时不擅自修正"],
  ["终端", "PC端或移动端", "根据第4章二级章节归类"],
  ["适用角色", "该章节面向的用户角色", "沿用手册角色名称"],
  ["模块", "一级至三级功能层级", "根据标题层级回溯生成"],
  ["功能名称", "最末级或有直接正文的功能页", "仅收录具有正文说明的第4章功能标题"],
  ["功能说明", "页面能力摘要", "剔除纯入口语句，保留统计、展示、处置等业务能力"],
  ["主要操作", "正文中可识别的操作类型", "由新增、编辑、查询、导出、审核等关键词归纳"],
  ["完整度", "手册说明状态", "正文含“待填写/待补充”时标记为手册待补充"],
];
notes.getRange("A3:C3").format = { fill: blue, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
notes.getRange("A3:C11").format.borders = { preset: "all", style: "thin", color: line };
notes.getRange("A4:A11").format = { fill: paleBlue, font: { bold: true } };
notes.getRange("A4:C11").format.wrapText = true;
notes.getRange("A:A").format.columnWidth = 22;
notes.getRange("B:B").format.columnWidth = 35;
notes.getRange("C:C").format.columnWidth = 64;
notes.freezePanes.freezeRows(3);

// Render and export
for (const sheet of [summary, list, notes]) {
  const used = sheet.getUsedRange();
  if (used) used.format.font.name = "Microsoft YaHei";
}

const inspect = await wb.inspect({ kind: "table", range: `功能清单!A1:L10`, include: "values,formulas", tableMaxRows: 10, tableMaxCols: 12, maxChars: 7000 });
console.log(inspect.ndjson);
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(errors.ndjson);

for (const name of ["清单概览", "功能清单", "口径说明"]) {
  const preview = await wb.render({ sheetName: name, autoCrop: "all", scale: name === "功能清单" ? 0.7 : 1, format: "png" });
  await fs.writeFile(`${outputDir}/${name}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(`${outputDir}/重庆安全生产平台_功能清单.xlsx`);
console.log(JSON.stringify({ output: `${outputDir}/重庆安全生产平台_功能清单.xlsx`, rows: rows.length }));
