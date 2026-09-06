from __future__ import annotations

import json
import re


def clean_heading(text: str):
    m = re.match(r"^\s*(\d+(?:\.\d+)*\.?)\s*(.*)$", text)
    return (m.group(1).rstrip("."), m.group(2).strip()) if m else ("", text.strip())


data = json.load(open("manual_extract.json", encoding="utf-8"))
paras = data["paragraphs"]
heading_positions = [i for i, p in enumerate(paras) if p["style"].startswith("Heading ")]
rows = []
stack = {}

action_words = [
    "新增", "创建", "编辑", "修改", "删除", "查看", "详情", "查询", "搜索", "筛选", "过滤",
    "导入", "导出", "下载", "上传", "配置", "下钻", "统计", "分析", "审核", "复核", "确认",
    "上报", "提交", "保存", "处置", "派发", "转派", "关闭", "启用", "停用", "封停", "解除",
    "定位", "导航", "切换", "分享", "打印", "预览", "播放", "监测", "评估", "辨识", "巡查",
    "检查", "维保", "签到", "签退", "打卡", "消息", "刷新", "排序", "批量操作"
]

for pos_idx, i in enumerate(heading_positions):
    p = paras[i]
    level = int(p["style"].split()[-1])
    no, title = clean_heading(p["text"])
    stack[level] = title
    for k in list(stack):
        if k > level:
            del stack[k]
    if level < 3 or not no.startswith("4."):
        continue

    next_i = heading_positions[pos_idx + 1] if pos_idx + 1 < len(heading_positions) else len(paras)
    body = [x["text"] for x in paras[i + 1:next_i] if x["style"] in ("Normal", "Normal (Web)")]
    body = [x for x in body if x and not re.fullmatch(r"图\s*\d+.*", x)]
    if not body:
        continue

    role_key = no.split(".")[:2]
    role_code = ".".join(role_key)
    role_map = {
        "4.1": ("PC端", "监管端"),
        "4.2": ("PC端", "管家端（消防安全责任人、消防安全管理人）"),
        "4.3": ("PC端", "管家端（消控室值班人员）"),
        "4.4": ("移动端", "消控室值班人员"),
        "4.5": ("移动端", "消防安全责任人、消防安全管理人"),
    }
    platform, role = role_map.get(role_code, ("", ""))
    direct_text = "；".join(body)
    placeholder = "待填写" in direct_text or "待补充" in direct_text

    desc_candidates = []
    for text in body:
        if "待填写" in text or "待补充" in text:
            continue
        if re.search(r"点击【.*】菜单，?进入", text) and len(body) > 1:
            continue
        desc_candidates.append(text)
    description = "；".join(desc_candidates or body)
    if len(description) > 220:
        description = description[:217] + "..."

    actions = []
    for word in action_words:
        if word in direct_text and word not in actions:
            actions.append(word)
    # Capture named buttons as auditable detail.
    buttons = []
    for text in body:
        for m in re.finditer(r"点击(?:右上角的)?([^，。；]{1,18}?)(?:按钮|图标|菜单|tab)", text, re.I):
            label = re.sub(r"^[【\[]|[】\]]$", "", m.group(1)).strip()
            if label and label not in buttons and "进入" not in label:
                buttons.append(label)

    ancestors = [stack.get(k, "") for k in range(3, level)]
    rows.append({
        "编号": no,
        "终端": platform,
        "适用角色": role,
        "一级模块": ancestors[0] if len(ancestors) > 0 else title,
        "二级模块": ancestors[1] if len(ancestors) > 1 else "",
        "三级模块": ancestors[2] if len(ancestors) > 2 else "",
        "功能名称": title,
        "功能说明": description,
        "主要操作": "、".join(actions),
        "按钮/入口": "、".join(buttons[:12]),
        "完整度": "手册待补充" if placeholder else "已描述",
        "来源定位": f"手册章节 {no}（段落索引 {p['idx']}）",
    })

with open("feature_rows.json", "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)

print(json.dumps({"feature_rows": len(rows), "pending": sum(r["完整度"] != "已描述" for r in rows)}, ensure_ascii=False))
