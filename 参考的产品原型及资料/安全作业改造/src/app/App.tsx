import { useState } from "react";
import {
  ChevronDown, ChevronRight, ChevronUp, Plus, Globe, User,
  LayoutGrid, Activity, Search, Layers, Radio,
  Type, Hash, AlignLeft, List, CheckSquare, Calendar,
  ToggleLeft, Upload, Phone, Mail, Star,
  Trash2, Copy, GripVertical, Eye, Send, Check,
  FileText, Settings, X, ArrowLeft, MoreHorizontal,
  ClipboardList, Clock, Users, TrendingUp, Flame,
  Zap, AlertTriangle, Shield, Cpu, HardHat, Wrench,
  GitMerge, Building2, Mountain, Layers2,
  BadgeCheck, CircleAlert, Info, MapPin, Video,
  BarChart3, PieChart as PieIcon, Filter, Download,
  ChevronLeft, ToggleRight,
} from "lucide-react";
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ─── Shell constants ──────────────────────────────────────────────────────────
const SIDEBAR_BG = "#1e2238";
const HEADER_BG  = "#1e2238";
const ACTIVE_BG  = "#3b82f6";

// ─── Work type definitions ────────────────────────────────────────────────────
const HAZARDOUS_TYPES = [
  { id:"confined",   name:"有限空间作业", icon:<Layers2 size={14}/>,      risk:"高" as const },
  { id:"height",     name:"高处作业",     icon:<Mountain size={14}/>,     risk:"高" as const },
  { id:"lifting",    name:"吊装作业",     icon:<HardHat size={14}/>,      risk:"高" as const },
  { id:"temppower",  name:"临时用电作业", icon:<Zap size={14}/>,           risk:"中" as const },
  { id:"earthwork",  name:"动土作业",     icon:<Wrench size={14}/>,        risk:"中" as const },
  { id:"roadcut",    name:"断路作业",     icon:<GitMerge size={14}/>,      risk:"中" as const },
  { id:"hotwork",    name:"动火作业",     icon:<Flame size={14}/>,         risk:"高" as const },
  { id:"blindplate", name:"盲板抽堵作业", icon:<Cpu size={14}/>,           risk:"高" as const },
  { id:"drainage",   name:"探放水作业",   icon:<Activity size={14}/>,      risk:"高" as const },
  { id:"goaf",       name:"空区治理",     icon:<Layers size={14}/>,        risk:"高" as const },
  { id:"roofsupp",   name:"顶板支护",     icon:<Shield size={14}/>,        risk:"中" as const },
  { id:"blast",      name:"爆破作业",     icon:<AlertTriangle size={14}/>, risk:"高" as const },
];
const MAJOR_TYPES = [
  { id:"foundation", name:"基坑工程",           icon:<Building2 size={14}/>, risk:"高" as const },
  { id:"formwork",   name:"模板及支撑体系",     icon:<Layers size={14}/>,    risk:"高" as const },
  { id:"cranework",  name:"起重吊装及机械安拆", icon:<HardHat size={14}/>,   risk:"高" as const },
  { id:"scaffold",   name:"脚手架工程",         icon:<Wrench size={14}/>,    risk:"中" as const },
  { id:"demolition", name:"拆除工程",           icon:<Mountain size={14}/>,  risk:"高" as const },
];

type WorkStatus = "申请中" | "作业中" | "已完成" | "作废";
const STATUS_TABS: WorkStatus[] = ["申请中","作业中","已完成","作废"];
const STATUS_STYLE: Record<WorkStatus,{bg:string;text:string;border:string;dot:string}> = {
  "申请中": { bg:"bg-amber-500/10", text:"text-amber-400", border:"border-amber-500/20", dot:"bg-amber-400" },
  "作业中": { bg:"bg-blue-500/10",  text:"text-blue-400",  border:"border-blue-500/20",  dot:"bg-blue-400"  },
  "已完成": { bg:"bg-green-500/10", text:"text-green-400", border:"border-green-500/20", dot:"bg-green-400" },
  "作废":   { bg:"bg-muted",         text:"text-muted-foreground", border:"border-border", dot:"bg-muted-foreground" },
};
const RISK_COLOR = {
  "高": { bg:"bg-red-500/10",   text:"text-red-400",   border:"border-red-500/20"   },
  "中": { bg:"bg-amber-500/10", text:"text-amber-400", border:"border-amber-500/20" },
  "低": { bg:"bg-green-500/10", text:"text-green-400", border:"border-green-500/20" },
};

// ─── Mock work records ────────────────────────────────────────────────────────
interface WorkRecord {
  id:string; type:string; cat:string; unit:string; area:string;
  applicant:string; responsible:string; startDate:string; endDate:string; applyDate:string;
  status:WorkStatus; risk:"高"|"中"|"低"; ticketNo:string;
}
const MOCK_RECORDS: WorkRecord[] = [
  // 常规作业
  { id:"W001", type:"常规作业", cat:"regular",   unit:"天泽建设", area:"3号楼施工区",    applicant:"张三",   responsible:"张三",   startDate:"2026-06-15", endDate:"2026-06-20", applyDate:"2026-06-14", status:"作业中", risk:"低", ticketNo:"CG-2026-0615-001" },
  { id:"W002", type:"常规作业", cat:"regular",   unit:"鑫达施工", area:"1号楼改造",      applicant:"李四",   responsible:"李四",   startDate:"2026-06-10", endDate:"2026-06-12", applyDate:"2026-06-09", status:"已完成", risk:"低", ticketNo:"CG-2026-0610-002" },
  { id:"W003", type:"常规作业", cat:"regular",   unit:"广达物业", area:"停车场维修",     applicant:"王五",   responsible:"王五",   startDate:"2026-06-18", endDate:"2026-06-19", applyDate:"2026-06-17", status:"申请中", risk:"低", ticketNo:"CG-2026-0618-003" },
  // 动火作业
  { id:"W010", type:"动火作业", cat:"hazardous", unit:"锦鑫焊接", area:"4号楼6层焊接区", applicant:"陈建国", responsible:"陈建国", startDate:"2026-06-18", endDate:"2026-06-18", applyDate:"2026-06-17", status:"申请中", risk:"高", ticketNo:"HW-2026-0618-001" },
  { id:"W011", type:"动火作业", cat:"hazardous", unit:"天泽建设", area:"3号楼管道间",    applicant:"李强",   responsible:"李强",   startDate:"2026-06-16", endDate:"2026-06-17", applyDate:"2026-06-15", status:"已完成", risk:"高", ticketNo:"HW-2026-0616-002" },
  { id:"W012", type:"动火作业", cat:"hazardous", unit:"鑫达施工", area:"变电站外墙",     applicant:"王磊",   responsible:"王磊",   startDate:"2026-06-17", endDate:"2026-06-18", applyDate:"2026-06-16", status:"作业中", risk:"高", ticketNo:"HW-2026-0617-003" },
  { id:"W013", type:"动火作业", cat:"hazardous", unit:"同星焊接", area:"地下室管廊",     applicant:"周涛",   responsible:"周涛",   startDate:"2026-06-10", endDate:"2026-06-10", applyDate:"2026-06-09", status:"作废",   risk:"高", ticketNo:"HW-2026-0610-004" },
  // 有限空间作业
  { id:"W020", type:"有限空间作业", cat:"hazardous", unit:"天泽建设", area:"地下室集水坑", applicant:"赵明",  responsible:"赵明",  startDate:"2026-06-17", endDate:"2026-06-17", applyDate:"2026-06-16", status:"申请中", risk:"高", ticketNo:"CS-2026-0617-001" },
  { id:"W021", type:"有限空间作业", cat:"hazardous", unit:"鑫达施工", area:"污水管道检修", applicant:"林工",  responsible:"林工",  startDate:"2026-06-14", endDate:"2026-06-14", applyDate:"2026-06-13", status:"已完成", risk:"高", ticketNo:"CS-2026-0614-002" },
  { id:"W022", type:"有限空间作业", cat:"hazardous", unit:"广达物业", area:"消防水箱间",   applicant:"吴明",  responsible:"吴明",  startDate:"2026-06-15", endDate:"2026-06-15", applyDate:"2026-06-14", status:"已完成", risk:"高", ticketNo:"CS-2026-0615-003" },
  // 高处作业
  { id:"W030", type:"高处作业", cat:"hazardous", unit:"锦鑫建设", area:"4号楼幕墙 12F",  applicant:"李强",  responsible:"李强",  startDate:"2026-06-17", endDate:"2026-06-19", applyDate:"2026-06-16", status:"作业中", risk:"高", ticketNo:"HA-2026-0617-001" },
  { id:"W031", type:"高处作业", cat:"hazardous", unit:"天泽建设", area:"屋面防水层施工",  applicant:"张三",  responsible:"张三",  startDate:"2026-06-15", endDate:"2026-06-20", applyDate:"2026-06-14", status:"作业中", risk:"高", ticketNo:"HA-2026-0615-002" },
  { id:"W032", type:"高处作业", cat:"hazardous", unit:"鑫达施工", area:"1号楼幕墙 8F",   applicant:"王磊",  responsible:"王磊",  startDate:"2026-06-18", endDate:"2026-06-18", applyDate:"2026-06-17", status:"申请中", risk:"中", ticketNo:"HA-2026-0618-003" },
  // 吊装作业
  { id:"W040", type:"吊装作业", cat:"hazardous", unit:"重机组", area:"施工现场北侧料场",  applicant:"陈钢",  responsible:"陈钢",  startDate:"2026-06-17", endDate:"2026-06-17", applyDate:"2026-06-16", status:"已完成", risk:"高", ticketNo:"LI-2026-0617-001" },
  { id:"W041", type:"吊装作业", cat:"hazardous", unit:"重机组", area:"5号楼钢构安装",    applicant:"赵磊",  responsible:"赵磊",  startDate:"2026-06-18", endDate:"2026-06-20", applyDate:"2026-06-17", status:"申请中", risk:"高", ticketNo:"LI-2026-0618-002" },
  // 临时用电
  { id:"W050", type:"临时用电作业", cat:"hazardous", unit:"电力服务", area:"施工现场配电房", applicant:"林电工", responsible:"林电工", startDate:"2026-06-13", endDate:"2026-07-30", applyDate:"2026-06-12", status:"作业中", risk:"中", ticketNo:"TP-2026-0613-001" },
  { id:"W051", type:"临时用电作业", cat:"hazardous", unit:"天泽建设", area:"3号楼临电箱",   applicant:"王电",   responsible:"王电",   startDate:"2026-06-16", endDate:"2026-06-16", applyDate:"2026-06-15", status:"已完成", risk:"中", ticketNo:"TP-2026-0616-002" },
  // 动土作业
  { id:"W060", type:"动土作业", cat:"hazardous", unit:"土方公司", area:"地下室出入口北侧", applicant:"周土",  responsible:"周土",  startDate:"2026-06-17", endDate:"2026-06-18", applyDate:"2026-06-16", status:"作业中", risk:"中", ticketNo:"EW-2026-0617-001" },
  { id:"W061", type:"动土作业", cat:"hazardous", unit:"基础队",   area:"2号楼基础开挖",   applicant:"李工",  responsible:"李工",  startDate:"2026-06-18", endDate:"2026-06-21", applyDate:"2026-06-17", status:"申请中", risk:"中", ticketNo:"EW-2026-0618-002" },
  // 断路作业
  { id:"W070", type:"断路作业", cat:"hazardous", unit:"市政施工", area:"经纬路K0+120段",  applicant:"路工",  responsible:"路工",  startDate:"2026-06-18", endDate:"2026-06-20", applyDate:"2026-06-17", status:"申请中", risk:"中", ticketNo:"RC-2026-0618-001" },
  { id:"W071", type:"断路作业", cat:"hazardous", unit:"天泽建设", area:"建设大道南段",     applicant:"张明",  responsible:"张明",  startDate:"2026-06-10", endDate:"2026-06-12", applyDate:"2026-06-09", status:"已完成", risk:"中", ticketNo:"RC-2026-0610-002" },
  // 盲板抽堵
  { id:"W080", type:"盲板抽堵作业", cat:"hazardous", unit:"管道维修", area:"DN200天然气管道", applicant:"安全员", responsible:"安全员", startDate:"2026-06-18", endDate:"2026-06-18", applyDate:"2026-06-17", status:"申请中", risk:"高", ticketNo:"BP-2026-0618-001" },
  // 基坑工程
  { id:"W090", type:"基坑工程", cat:"major", unit:"天泽建设", area:"2号地块基坑", applicant:"赵明", responsible:"赵明", startDate:"2026-06-01", endDate:"2026-08-31", applyDate:"2026-05-28", status:"作业中", risk:"高", ticketNo:"FK-2026-0601-001" },
  // 脚手架
  { id:"W100", type:"脚手架工程", cat:"major", unit:"架子队",   area:"1号楼南立面",  applicant:"周涛", responsible:"周涛", startDate:"2026-06-15", endDate:"2026-07-15", applyDate:"2026-06-14", status:"作业中", risk:"中", ticketNo:"SC-2026-0615-001" },
  { id:"W101", type:"脚手架工程", cat:"major", unit:"锦鑫建设", area:"3号楼外立面",  applicant:"林工", responsible:"林工", startDate:"2026-06-05", endDate:"2026-06-14", applyDate:"2026-06-04", status:"已完成", risk:"中", ticketNo:"SC-2026-0605-002" },
  // 交叉作业
  { id:"W110", type:"交叉作业", cat:"cross", unit:"多单位协调", area:"地下室B2施工区", applicant:"林安全", responsible:"林安全", startDate:"2026-06-14", endDate:"2026-06-16", applyDate:"2026-06-13", status:"已完成", risk:"高", ticketNo:"CX-2026-0614-001" },
  { id:"W111", type:"交叉作业", cat:"cross", unit:"多单位协调", area:"4号楼公共区",   applicant:"王协调", responsible:"王协调", startDate:"2026-06-18", endDate:"2026-06-20", applyDate:"2026-06-17", status:"申请中", risk:"高", ticketNo:"CX-2026-0618-002" },
];

// ─── View types ───────────────────────────────────────────────────────────────
type ActiveView =
  | { type:"gismap" }
  | { type:"overview" }
  | { type:"worklist"; workName:string; cat:string }
  | { type:"worklistall"; workType:string }
  | { type:"workdetail"; record:WorkRecord }
  | { type:"workcreate"; workName:string; cat:string }
  | { type:"category"; cat:"hazardous"|"cross"|"major" }
  | { type:"analysis" }
  | { type:"params" }
  | { type:"forms" }
  | { type:"hazard" }
  | { type:"monitor" };

// ─── Shared helpers ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status:WorkStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{status}
    </span>
  );
}
function RiskBadge({ risk }: { risk:"高"|"中"|"低" }) {
  const c = RISK_COLOR[risk];
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>{risk}险</span>;
}
function Breadcrumb({ items }: { items:{label:string;onClick?:()=>void}[] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i>0 && <ChevronRight size={11}/>}
          {item.onClick
            ? <button onClick={item.onClick} className="hover:text-foreground transition-colors">{item.label}</button>
            : <span className="text-foreground">{item.label}</span>}
        </span>
      ))}
    </div>
  );
}

// ─── 安全作业一张图 ────────────────────────────────────────────────────────────
function GisMapView({ onNavigate }: { onNavigate:(v:ActiveView)=>void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMapFilter, setSelectedMapFilter] = useState<WorkStatus | "全部">("全部");

  const statusBreakdown = [
    { name:"申请中", value:MOCK_RECORDS.filter(r=>r.status==="申请中").length, color:"#f59e0b" },
    { name:"作业中", value:MOCK_RECORDS.filter(r=>r.status==="作业中").length, color:"#60a5fa" },
    { name:"已完成", value:MOCK_RECORDS.filter(r=>r.status==="已完成").length, color:"#34d399" },
  ];
  const chartTotal = statusBreakdown.reduce((a,d)=>a+d.value,0);
  const latestWork = MOCK_RECORDS.filter(r=>r.status!=="作废").sort((a,b)=>b.startDate.localeCompare(a.startDate));
  const filteredWork = latestWork.filter(r => {
    if (selectedMapFilter !== "全部" && r.status !== selectedMapFilter) return false;
    if (searchQuery.trim() === "") return true;
    const q = searchQuery.toLowerCase();
    return r.unit.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || r.area.toLowerCase().includes(q) || r.ticketNo.toLowerCase().includes(q);
  });
  const catCounts = [
    { label:"危险作业", val:MOCK_RECORDS.filter(r=>r.cat==="hazardous").length, color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/20" },
    { label:"危大工程", val:MOCK_RECORDS.filter(r=>r.cat==="major").length,     color:"text-amber-400",  bg:"bg-amber-500/10",  border:"border-amber-500/20" },
    { label:"交叉作业", val:MOCK_RECORDS.filter(r=>r.cat==="cross").length,     color:"text-indigo-400", bg:"bg-indigo-500/10", border:"border-indigo-500/20" },
    { label:"常规作业", val:MOCK_RECORDS.filter(r=>r.cat==="regular").length,   color:"text-blue-400",   bg:"bg-blue-500/10",   border:"border-blue-500/20" },
  ];
  const alerts = [
    { level:"高" as const, msg:"4号楼焊接区未检测到监护人员", time:"10:32" },
    { level:"中" as const, msg:"高处作业区域安全带佩戴异常",   time:"09:55" },
    { level:"中" as const, msg:"配电箱未按规范关闭",           time:"09:20" },
    { level:"低" as const, msg:"3号楼施工区围挡存在缺口",      time:"08:45" },
  ];
  const videoLocations = ["4号楼 · 焊接区","3号楼 · 高处作业","2号地块 · 基坑","临时配电区"];
  const mapDots: { x:string; y:string; s:WorkStatus; label:string }[] = [
    { x:"22%", y:"32%", s:"作业中", label:"动火作业 · 4号楼" },
    { x:"48%", y:"50%", s:"作业中", label:"高处作业 · 3号楼" },
    { x:"62%", y:"28%", s:"申请中", label:"吊装作业 · 5号楼" },
    { x:"30%", y:"64%", s:"已完成", label:"断路作业 · 经纬路" },
    { x:"72%", y:"58%", s:"作业中", label:"基坑工程 · 2号地块" },
    { x:"55%", y:"72%", s:"申请中", label:"盲板抽堵 · 天然气管道" },
    { x:"40%", y:"40%", s:"作业中", label:"临时用电 · 配电房" },
    { x:"18%", y:"58%", s:"申请中", label:"动土作业 · 基础开挖" },
  ];
  const dotColor = (s:WorkStatus) => s==="作业中"?"#60a5fa":s==="申请中"?"#f59e0b":"#34d399";

  return (
    <div className="flex flex-1 overflow-hidden bg-background">

      {/* ── LEFT COLUMN ────────────────────────────────────────────── */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-border overflow-hidden">

        {/* Status donut chart */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">作业状态占比</p>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0" style={{width:88,height:88}}>
              <PieChart width={88} height={88}>
                <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={25} outerRadius={40}
                  dataKey="value" paddingAngle={3} startAngle={90} endAngle={-270}>
                  {statusBreakdown.map((d)=><Cell key={`gis-${d.name}`} fill={d.color} strokeWidth={0}/>)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-bold font-mono text-foreground leading-none">{chartTotal}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">总计</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {statusBreakdown.map(d=>(
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.color}}/>
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                  <span className="ml-auto text-xs font-mono font-semibold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest work list header */}
        <div className="flex-shrink-0 px-4 py-2.5 border-b border-border flex items-center justify-between">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">最新安全作业</span>
              <button onClick={()=>nav({type:"overview"})} className="text-[10px] text-primary hover:opacity-80 transition-opacity">查看全部</button>
            </div>

            {/* Quick Filter Search */}
            <div className="flex-shrink-0 px-3 py-2 border-b border-border/60">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input
                  type="text"
                  placeholder="搜索作业单位/类型/区域..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary text-foreground text-xs rounded-lg pl-7 pr-3 py-1.5 border border-border/80 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Latest work list scrollable */}
            <div className="flex-1 overflow-y-auto">
              {filteredWork.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">未找到匹配的作业记录</div>
              ) : filteredWork.map(r=>(
            <button key={r.id} onClick={()=>onNavigate({type:"workdetail",record:r})}
              className="w-full flex flex-col gap-1 px-4 py-2.5 border-b border-border/50 hover:bg-muted/40 transition-colors text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-foreground truncate flex-1">{r.unit}</span>
                <StatusBadge status={r.status}/>
              </div>
              <span className="text-[11px] text-primary font-medium">{r.type}</span>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="font-mono">{r.startDate}</span>
                <span className="truncate">{r.area}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── CENTER COLUMN: Map/3D placeholder ──────────────────────── */}
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0" style={{background:"#070f1c"}}>
          {/* Subtle grid */}
          <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",backgroundSize:"48px 48px"}}/>

          {/* Building footprints SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 560" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.28}}>
            <rect x="70"  y="100" width="85"  height="110" rx="4" fill="#1d2f6a" stroke="#3b5bdb" strokeWidth="1.5"/>
            <rect x="195" y="80"  width="105" height="135" rx="4" fill="#1d2f6a" stroke="#3b5bdb" strokeWidth="1.5"/>
            <rect x="340" y="60"  width="125" height="155" rx="4" fill="#1d2f6a" stroke="#3b5bdb" strokeWidth="1.5"/>
            <rect x="505" y="90"  width="95"  height="115" rx="4" fill="#1d2f6a" stroke="#3b5bdb" strokeWidth="1.5"/>
            <rect x="635" y="105" width="100" height="95"  rx="4" fill="#1d2f6a" stroke="#3b5bdb" strokeWidth="1.5"/>
            <rect x="90"  y="290" width="155" height="105" rx="4" fill="#1d2f6a" stroke="#3b5bdb" strokeWidth="1.5"/>
            <rect x="290" y="310" width="205" height="115" rx="4" fill="#1d2f6a" stroke="#3b5bdb" strokeWidth="1.5"/>
            <rect x="545" y="295" width="175" height="130" rx="4" fill="#1d2f6a" stroke="#3b5bdb" strokeWidth="1.5"/>
            <line x1="0" y1="255" x2="800" y2="255" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
            <line x1="165" y1="0" x2="165" y2="560" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
            <line x1="330" y1="0" x2="330" y2="560" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
            <line x1="510" y1="0" x2="510" y2="560" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
            <line x1="640" y1="0" x2="640" y2="560" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
          </svg>

          {/* Work location dots */}
          {mapDots.map((dot,i)=>(
            <div key={i} className="absolute cursor-pointer group" style={{left:dot.x,top:dot.y,transform:"translate(-50%,-50%)"}}>
              {dot.s==="作业中" && (
                <span className="absolute rounded-full animate-ping" style={{background:dotColor(dot.s),opacity:0.25,width:18,height:18,top:-4,left:-4}}/>
              )}
              <div className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-lg relative z-10" style={{background:dotColor(dot.s)}}/>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden group-hover:block z-20 pointer-events-none">
                <div className="bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-2xl whitespace-nowrap">
                  <p className="text-xs font-medium text-foreground">{dot.label}</p>
                  <p className="text-[10px] mt-0.5" style={{color:dotColor(dot.s)}}>{dot.s}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Status legend overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg px-3 py-1.5 border border-border/60 shadow-xl" style={{background:"rgba(11,22,35,0.85)",backdropFilter:"blur(8px)"}}>
            <button
              onClick={() => setSelectedMapFilter("全部")}
              className={`text-[11px] px-2 py-0.5 rounded transition-colors ${selectedMapFilter==="全部" ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              全部
            </button>
            {(["作业中","申请中","已完成"] as WorkStatus[]).map(s=>(
              <button
                key={s}
                onClick={() => setSelectedMapFilter(s)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${selectedMapFilter===s ? "bg-primary/20 text-primary font-medium" : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"}`}>
                <span className="w-2 h-2 rounded-full" style={{background:dotColor(s)}}/>
                <span className="text-[11px]">{s}</span>
              </button>
            ))}
          </div>

          {/* Watermark */}
          <div className="absolute bottom-3 right-4 flex items-center gap-1 text-[10px]" style={{color:"rgba(255,255,255,0.15)"}}>
            <MapPin size={9}/>安全作业一张图 · 实时位置
          </div>
        </div>
      </main>

      {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-l border-border overflow-hidden">

        {/* Data stat cards: work counts by category */}
        <div className="flex-shrink-0 p-3 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">各类作业数量</p>
          <div className="grid grid-cols-2 gap-2">
            {catCounts.map(({label,val,color,bg,border})=>(
              <div key={label} className={`rounded-xl border ${border} ${bg} px-3 py-2.5`}>
                <span className={`text-xl font-bold font-mono leading-none ${color}`}>{val}</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 video windows 2×2 */}
        <div className="flex-shrink-0 px-3 pt-3 pb-3 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">实时视频监控</p>
          <div className="grid grid-cols-2 gap-1.5">
            {videoLocations.map((loc,i)=>(
              <div key={i} className="aspect-video rounded-lg border border-border/50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/30 transition-colors overflow-hidden" style={{background:"#050c15"}}>
                <Video size={12} className="text-muted-foreground/35"/>
                <span className="text-[9px] text-muted-foreground/40 text-center px-1 leading-snug">{loc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard / monitoring alerts header */}
        <div className="flex-shrink-0 px-4 pt-2.5 pb-2 border-b border-border flex items-center justify-between">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">隐患 / 监测报警</span>
          <span className="text-[10px] text-red-400 font-semibold">{alerts.filter(a=>a.level==="高").length} 条高危</span>
        </div>

        {/* Alerts list */}
        <div className="flex-1 overflow-y-auto">
          {alerts.map((item,i)=>(
            <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/20 transition-colors">
              <RiskBadge risk={item.level}/>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-foreground leading-snug">{item.msg}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">今日 {item.time}</p>
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1.5 py-6 text-muted-foreground/25">
            <Check size={14}/>
            <span className="text-[10px]">暂无更多报警</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── 作业管理列表（快捷入口）─────────────────────────────────────────────────────
const QUICK_NAV_TYPES = [
  { label:"常规",     workType:"常规作业" },
  { label:"动火",     workType:"动火作业" },
  { label:"受限空间", workType:"有限空间作业" },
  { label:"盲板抽堵", workType:"盲板抽堵作业" },
  { label:"高处",     workType:"高处作业" },
  { label:"吊装",     workType:"吊装作业" },
  { label:"临时用电", workType:"临时用电作业" },
  { label:"动土",     workType:"动土作业" },
  { label:"断路",     workType:"断路作业" },
] as const;

function WorkListAllView({ workType, onNavigate }: { workType:string; onNavigate:(v:ActiveView)=>void }) {
  const [statusTab, setStatusTab] = useState<WorkStatus>("申请中");

  const allForType = MOCK_RECORDS.filter(r => r.type === workType);
  const filtered   = allForType.filter(r => r.status === statusTab);

  const catOfType = allForType[0]?.cat ?? "hazardous";

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <Breadcrumb items={[
        { label:"作业管理", onClick:()=>onNavigate({type:"overview"}) },
        { label:workType },
      ]}/>

      {/* Page header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-semibold text-foreground">{workType}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">共 {allForType.length} 条记录</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Filter size={12}/>筛选
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Download size={12}/>导出
          </button>
          <button onClick={()=>onNavigate({type:"workcreate", workName:workType, cat:catOfType})}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
            <Plus size={13}/>申请作业票
          </button>
        </div>
      </div>

      {/* Status tabs — exact same pattern as WorkTypeListView */}
      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {STATUS_TABS.map(tab => {
          const cnt = allForType.filter(r => r.status === tab).length;
          return (
            <button key={tab} onClick={()=>setStatusTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
                statusTab===tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {tab}
              {cnt>0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusTab===tab ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{cnt}</span>}
            </button>
          );
        })}
      </div>

      {/* Advanced data table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {["序号","作业票编号","作业等级","计划时间（起/止）","负责人 / 单位","申请人 / 单位","作业进度","申请时间","操作"].map(h=>(
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">暂无{statusTab}的{workType}记录</td>
              </tr>
            ) : filtered.map((r, idx) => (
              <tr key={r.id}
                className="hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={()=>onNavigate({type:"workdetail", record:r})}>
                <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono">{idx+1}</td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{r.ticketNo}</td>
                <td className="px-4 py-2.5"><RiskBadge risk={r.risk}/></td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                  <span className="block">{r.startDate}</span>
                  <span className="block text-muted-foreground/60">至 {r.endDate}</span>
                </td>
                <td className="px-4 py-2.5">
                  <p className="text-xs font-medium text-foreground">{r.responsible}</p>
                  <p className="text-[11px] text-muted-foreground">{r.unit}</p>
                </td>
                <td className="px-4 py-2.5">
                  <p className="text-xs font-medium text-foreground">{r.applicant}</p>
                  <p className="text-[11px] text-muted-foreground">{r.unit}</p>
                </td>
                <td className="px-4 py-2.5"><StatusBadge status={r.status}/></td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{r.applyDate}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5" onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>onNavigate({type:"workdetail",record:r})}
                      className="px-2.5 py-1 text-[11px] rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors whitespace-nowrap">
                      查看
                    </button>
                    {r.status==="申请中" && (
                      <button className="px-2.5 py-1 text-[11px] rounded border border-primary/30 text-primary hover:bg-primary/10 transition-colors whitespace-nowrap">
                        审批
                      </button>
                    )}
                    {r.status==="作业中" && (
                      <button className="px-2.5 py-1 text-[11px] rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors whitespace-nowrap">
                        监控
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Work type list view ──────────────────────────────────────────────────────
function WorkTypeListView({ workName, cat, onNavigate }: {
  workName:string; cat:string; onNavigate:(v:ActiveView)=>void;
}) {
  const [statusTab, setStatusTab] = useState<WorkStatus>("申请中");
  const records = MOCK_RECORDS.filter(r=>r.type===workName);
  const filtered = records.filter(r=>r.status===statusTab);
  const catName = cat==="regular"?"常规作业":cat==="hazardous"?"危险作业":cat==="cross"?"交叉作业":"危大工程";
  const catView: ActiveView = cat==="regular"?{type:"overview"}:
    cat==="cross"?{type:"category",cat:"cross"}:
    cat==="major"?{type:"category",cat:"major"}:{type:"category",cat:"hazardous"};

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <Breadcrumb items={[
        {label:"作业管理",onClick:()=>onNavigate({type:"overview"})},
        {label:catName,onClick:()=>onNavigate(catView)},
        {label:workName},
      ]}/>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-semibold text-foreground">{workName}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">共 {records.length} 条记录</p>
        </div>
        <button onClick={()=>onNavigate({type:"workcreate",workName,cat})}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
          <Plus size={13}/>申请作业票
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {STATUS_TABS.map(tab=>{
          const cnt = records.filter(r=>r.status===tab).length;
          return (
            <button key={tab} onClick={()=>setStatusTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
                statusTab===tab?"border-primary text-primary":"border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {tab}
              {cnt>0&&<span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusTab===tab?"bg-primary/20 text-primary":"bg-muted text-muted-foreground"}`}>{cnt}</span>}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {["票号","作业类型","作业区域","施工单位","申请人","计划时段","风险等级","状态","操作"].map(h=>(
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length===0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">暂无{statusTab}的作业记录</td></tr>
            ) : filtered.map(r=>(
              <tr key={r.id} className="hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={()=>onNavigate({type:"workdetail",record:r})}>
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{r.ticketNo}</td>
                <td className="px-4 py-2.5 text-xs font-medium text-foreground">{r.type}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.area}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.unit}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.applicant}</td>
                <td className="px-4 py-2.5 text-[11px] text-muted-foreground font-mono whitespace-nowrap">{r.startDate} ~ {r.endDate}</td>
                <td className="px-4 py-2.5"><RiskBadge risk={r.risk}/></td>
                <td className="px-4 py-2.5"><StatusBadge status={r.status}/></td>
                <td className="px-4 py-2.5">
                  <button className="text-xs text-primary hover:underline">详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Work detail view (8 tabs) ────────────────────────────────────────────────
type DetailTab = "基本信息"|"相关人员"|"作业初审"|"安全交底"|"作业审批"|"完工验收"|"监测记录"|"隐患清单";
const DETAIL_TABS: DetailTab[] = ["基本信息","相关人员","作业初审","安全交底","作业审批","完工验收","监测记录","隐患清单"];

function WorkDetailView({ record, onNavigate }: { record:WorkRecord; onNavigate:(v:ActiveView)=>void }) {
  const [tab, setTab] = useState<DetailTab>("基本信息");

  const detailTabs = ["作业基本信息", "风险评估", "安全措施", "安全交底", "作业审批", "过程监测", "过程隐患", "作业验收", "监护记录"];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#dbe5f6] p-4 text-xs text-[#1e293b]">
      {/* 顶部标题与返回按钮 */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-sm font-bold text-[#1e293b]">动火作业详情</h1>
        <button onClick={()=>onNavigate({type:"overview"})} className="px-4 py-1 bg-[#3b82f6] text-white rounded hover:bg-blue-600 transition-colors">
          返回
        </button>
      </div>

      {/* 主卡片 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-[#cbe0f5]">
        
        {/* 蓝色横向 Tab 导航 */}
        <div className="flex items-center gap-1.5 p-3 bg-[#edf3fa] border-b border-[#cbe0f5] overflow-x-auto">
          {detailTabs.map((t, idx) => (
            <button key={t} onClick={() => setTab(t as any)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
                tab === t || (tab==="基本信息" && idx===0)
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "bg-white text-[#475569] border border-[#cbd5e1] hover:bg-slate-50"
              }`}>
              {idx===0 && <span className="text-xs">▶</span>}
              {t}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6 space-y-8 text-xs text-[#334155]">
          
          {/* 区块 1: 作业基本信息 */}
          <div>
            <div className="flex items-center justify-between bg-[#edf3fa] px-4 py-2 rounded-t border-b border-[#cbe0f5]">
              <span className="font-bold text-[#3b82f6]">作业基本信息</span>
              <span className="font-mono text-[#64748b]">作业票编号: DH20260506002</span>
            </div>
            <div className="p-4 bg-slate-50/50 rounded-b border border-t-0 border-[#e2e8f0] grid grid-cols-2 gap-y-3 gap-x-8">
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业等级</span><span className="col-span-2 font-medium">三级</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业内容</span><span className="col-span-2 font-medium">zd作业内容</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业内容附件</span><span className="col-span-2 text-[#94a3b8]">--</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业方案</span><span className="col-span-2 text-[#94a3b8]">--</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">动火方式</span><span className="col-span-2 font-medium">啊啊啊</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">计划起止时间</span><span className="col-span-2 font-mono">2026-05-07 18:56 ~ 2026-05-08 02:56</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">关联施工项目</span><span className="col-span-2 text-[#94a3b8]">-</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">关联作业票</span><span className="col-span-2 text-[#94a3b8]">-</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">选择监控设备</span><span className="col-span-2 text-[#94a3b8]">-</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业申请单位</span><span className="col-span-2 font-medium">鞍钢集团矿业有限公司</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业申请人</span><span className="col-span-2 font-medium">安全生产鞍钢项目</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业申请时间</span><span className="col-span-2 font-mono">2026-05-06 18:59</span></div>
            </div>
          </div>

          {/* 区块 2: 作业相关单位、人员及地点 */}
          <div>
            <div className="bg-[#edf3fa] px-4 py-2 rounded-t border-b border-[#cbe0f5]">
              <span className="font-bold text-[#3b82f6]">作业相关单位、人员及地点</span>
            </div>
            <div className="p-4 bg-slate-50/50 rounded-b border border-t-0 border-[#e2e8f0] grid grid-cols-2 gap-y-3 gap-x-8">
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业单位</span><span className="col-span-2 font-medium">东鞍山烧结厂</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业负责人</span><span className="col-span-2 font-medium">安全生产鞍钢项目</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业所在单位</span><span className="col-span-2 font-medium">东鞍山烧结厂</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业所在单位负责人</span><span className="col-span-2 font-medium">部门测试</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">风险评估人</span><span className="col-span-2 font-medium">安全生产鞍钢项目</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">安全措施确认人</span><span className="col-span-2 font-medium">安全生产鞍钢项目</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">安全交底人</span><span className="col-span-2 font-medium">安全生产鞍钢项目</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">作业单位监护人</span><span className="col-span-2 font-medium">安全生产鞍钢项目</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">属地单位监护人</span><span className="col-span-2 font-medium">王子翔</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">其他相关人员</span><span className="col-span-2 text-[#94a3b8]">暂无</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">动火地点及部位</span><span className="col-span-2 font-medium">大楼</span></div>
              <div className="grid grid-cols-3"><span className="text-[#64748b] text-right pr-4">地图标点</span><span className="col-span-2 text-[#94a3b8]">暂无位点信息</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Work create form ─────────────────────────────────────────────────────────
function WorkCreateForm({ workName, cat, onNavigate }: { workName:string; cat:string; onNavigate:(v:ActiveView)=>void }) {
  const [submitted, setSubmitted] = useState(false);
  const [workers, setWorkers] = useState([
    { id:"p1", name:"陈建国", unit:"锦鑫焊接", cert:"特种作业证（焊工）" },
    { id:"p2", name:"李强",   unit:"天泽建设", cert:"建造师证" },
  ]);
  const catName = cat==="regular"?"常规作业":cat==="hazardous"?"危险作业":cat==="cross"?"交叉作业":"危大工程";

  // ── Shared style tokens (exact match to existing WorkCreateForm spec) ──────
  const inp = "w-full border border-border rounded-lg px-3 py-2 text-sm bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20";

  // Block section header — matches existing pattern exactly
  const blockHeader = (title:string, extra?:React.ReactNode) => (
    <div className="px-5 py-3 border-b border-border flex items-center gap-2">
      <ChevronRight size={13} className="text-primary"/>
      <span className="text-sm font-semibold text-foreground">{title}</span>
      {extra && <span className="ml-auto">{extra}</span>}
    </div>
  );

  // Label + field wrapper — label style matches existing `text-xs text-muted-foreground`
  const fld = (label:string, req:boolean, node:React.ReactNode) => (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground">{label}{req&&<span className="text-red-400 ml-0.5">*</span>}</label>
      {node}
    </div>
  );

  // Chevron-decorated select — uses same `inp` class, no new component
  const sel = (placeholder:string, opts:string[]) => (
    <div className="relative">
      <select className={`${inp} appearance-none pr-8 cursor-pointer`}>
        <option value="">{placeholder}</option>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"/>
    </div>
  );

  const APPROVAL_NODES = [
    { label:"申请提交",   person:"申请人",   done:true  },
    { label:"项目经理审核", person:"陈建国",   done:false },
    { label:"安全总监批准", person:"林安全",   done:false },
    { label:"建设单位确认", person:"甲方代表", done:false },
    { label:"完工验收",   person:"验收组",   done:false },
  ];

  if (submitted) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-green-400"/>
        </div>
        <h2 className="text-base font-bold text-foreground mb-1">作业票已提交</h2>
        <p className="text-sm text-muted-foreground mb-4">已进入审批流程，请等待审批人签字确认。</p>
        <button onClick={()=>onNavigate({type:"worklist",workName,cat})} className="text-sm text-primary hover:underline">返回列表</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <Breadcrumb items={[
        {label:"作业管理",onClick:()=>onNavigate({type:"overview"})},
        {label:catName},
        {label:workName,onClick:()=>onNavigate({type:"worklist",workName,cat})},
        {label:"申请作业票"},
      ]}/>

      <div className="max-w-3xl space-y-4">

        {/* ── 区块 1: 基本信息 ────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {blockHeader("基本信息")}
          <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4">
            {fld("作业类型", false, <input className={inp} defaultValue={workName} readOnly/>)}
            {fld("管控类别", false, <input className={inp} value={catName} readOnly/>)}
            {fld("作业单位", true,  <input className={inp} placeholder="实施单位全称"/>)}
            {fld("负责人",   true,  sel("请选择负责人…",["陈建国","李强","王磊","张三","林安全"]))}
            {fld("所在部位", true,  <input className={inp} placeholder="具体区域 / 楼层 / 位置"/>)}
            {fld("作业人数", true,  <input type="number" className={inp} placeholder="0" min={1}/>)}
            {fld("计划开始时间", true, <input type="datetime-local" className={inp}/>)}
            {fld("计划结束时间", true, <input type="datetime-local" className={inp}/>)}
            <div className="col-span-2">
              {fld("作业内容", true,
                <textarea rows={3} className={`${inp} resize-none`} placeholder="详细描述本次作业内容、范围及操作步骤…"/>
              )}
            </div>
          </div>
        </div>

        {/* ── 区块 2: 人员管理 ────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {blockHeader("人员管理",
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">{workers.length} 人</span>
          )}
          <div className="p-5 space-y-4">
            {/* 作业负责人 + 监护人 selectors */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {fld("作业负责人", true, sel("请选择作业负责人…",["陈建国","李强","王磊","赵明","张三"]))}
              {fld("监护人",     true, sel("请选择监护人…",["张安全","林安全","王监护","李主管"]))}
            </div>

            {/* 作业人员 mini table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">作业人员</p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors">
                    <Plus size={11}/>新增
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    <Plus size={11}/>手动新增
                  </button>
                </div>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      {["序号","姓名","所属单位","证件类型","操作"].map(h=>(
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {workers.length===0 ? (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">暂无作业人员，请点击「新增」或「手动新增」</td></tr>
                    ) : workers.map((w,idx)=>(
                      <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 text-xs text-muted-foreground font-mono">{idx+1}</td>
                        <td className="px-4 py-2.5 text-xs font-medium text-foreground">{w.name}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{w.unit}</td>
                        <td className="px-4 py-2.5">
                          <span className="text-[11px] px-2 py-0.5 rounded border border-border bg-muted text-muted-foreground">{w.cert}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <button onClick={()=>setWorkers(p=>p.filter(x=>x.id!==w.id))}
                            className="text-[11px] text-red-400 hover:text-red-300 transition-colors">移除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── 区块 3: 审批流程 ─────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {blockHeader("审批流程")}
          <div className="px-6 py-5">
            <div className="flex items-start">
              {APPROVAL_NODES.map((node,i)=>(
                <div key={i} className="flex-1 flex flex-col items-center relative">
                  {/* Connector between nodes */}
                  {i < APPROVAL_NODES.length-1 && (
                    <div className="absolute top-3 left-1/2 w-full h-px border-t border-dashed border-border"/>
                  )}
                  {/* Node */}
                  <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    node.done ? "bg-primary border-primary" : "bg-card border-border"
                  }`}>
                    {node.done
                      ? <Check size={10} strokeWidth={3} className="text-primary-foreground"/>
                      : <span className="text-[9px] text-muted-foreground font-mono">{i+1}</span>}
                  </div>
                  {/* Labels */}
                  <div className="mt-2.5 text-center px-1">
                    <p className={`text-[11px] font-medium leading-snug ${node.done ? "text-primary" : "text-muted-foreground"}`}>{node.label}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">{node.person}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 操作栏 ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between py-2">
          <button onClick={()=>onNavigate({type:"worklist",workName,cat})}
            className="px-5 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
            取消
          </button>
          <div className="flex items-center gap-2">
            <button className="px-5 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              保存草稿
            </button>
            <button onClick={()=>setSubmitted(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Send size={13}/>提交审批
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Overview dashboard ───────────────────────────────────────────────────────
function OverviewDashboard({ onNavigate }: { onNavigate:(v:ActiveView)=>void }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
      <div><h1 className="text-base font-semibold text-foreground">作业管理</h1><p className="text-xs text-muted-foreground mt-0.5">三大管控类别 · 特殊作业票证</p></div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:"在办作业",   val:MOCK_RECORDS.filter(r=>r.status==="作业中").length,  bg:"bg-blue-400/10",   color:"text-blue-400" },
          { label:"待审批",     val:MOCK_RECORDS.filter(r=>r.status==="申请中").length,  bg:"bg-amber-400/10",  color:"text-amber-400" },
          { label:"本月完成",   val:MOCK_RECORDS.filter(r=>r.status==="已完成").length,  bg:"bg-green-400/10",  color:"text-green-400" },
          { label:"已作废",     val:MOCK_RECORDS.filter(r=>r.status==="作废").length,    bg:"bg-muted",         color:"text-muted-foreground" },
        ].map(({label,val,bg,color})=>(
          <div key={label} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}><TrendingUp size={15} className={color}/></div>
            <div><p className={`text-xl font-bold font-mono ${color}`}>{val}</p><p className="text-xs text-muted-foreground mt-0.5">{label}</p></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { cat:"hazardous" as const, name:"危险作业", color:"text-red-400", bg:"bg-red-500/10", border:"border-red-500/20", icon:<Flame size={18}/>, types:HAZARDOUS_TYPES.length },
          { cat:"cross"     as const, name:"交叉作业", color:"text-indigo-400", bg:"bg-indigo-500/10", border:"border-indigo-500/20", icon:<GitMerge size={18}/>, types:1 },
          { cat:"major"     as const, name:"危大工程", color:"text-amber-400", bg:"bg-amber-500/10", border:"border-amber-500/20", icon:<Building2 size={18}/>, types:MAJOR_TYPES.length },
        ].map(c=>(
          <button key={c.cat} onClick={()=>onNavigate({type:"category",cat:c.cat})}
            className="text-left bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all group">
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}><span className={c.color}>{c.icon}</span></div>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">{c.types} 种</span>
              </div>
              <h3 className={`text-sm font-bold text-foreground mb-1 group-hover:${c.color} transition-colors`}>{c.name}</h3>
              <p className="text-xs text-muted-foreground">{MOCK_RECORDS.filter(r=>r.cat===c.cat&&r.status==="作业中").length} 张有效 · {MOCK_RECORDS.filter(r=>r.cat===c.cat&&r.status==="申请中").length} 审批中</p>
            </div>
            <div className={`px-5 py-2.5 border-t border-border ${c.bg} flex items-center justify-between`}>
              <span className="text-xs text-muted-foreground">点击进入</span>
              <ChevronRight size={13} className={c.color}/>
            </div>
          </button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">近期作业票</span>
          <button className="text-xs text-primary hover:underline">全部</button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50 border-b border-border">{["票号","作业类型","区域","申请人","状态","日期"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-border">
            {MOCK_RECORDS.slice(0,8).map(r=>(
              <tr key={r.id} onClick={()=>onNavigate({type:"workdetail",record:r})} className="hover:bg-muted/20 cursor-pointer">
                <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{r.ticketNo}</td>
                <td className="px-4 py-2.5 text-xs font-medium text-foreground">{r.type}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.area}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.applicant}</td>
                <td className="px-4 py-2.5"><StatusBadge status={r.status}/></td>
                <td className="px-4 py-2.5 text-[11px] text-muted-foreground font-mono">{r.startDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Category view ────────────────────────────────────────────────────────────
function CategoryView({ cat, onNavigate }: { cat:"hazardous"|"cross"|"major"; onNavigate:(v:ActiveView)=>void }) {
  const cfg = {
    hazardous:{ name:"危险作业", color:"text-red-400", bg:"bg-red-500/10", border:"border-red-500/20", icon:<Flame size={18}/>, types:HAZARDOUS_TYPES },
    cross:    { name:"交叉作业", color:"text-indigo-400", bg:"bg-indigo-500/10", border:"border-indigo-500/20", icon:<GitMerge size={18}/>, types:[] },
    major:    { name:"危大工程", color:"text-amber-400", bg:"bg-amber-500/10", border:"border-amber-500/20", icon:<Building2 size={18}/>, types:MAJOR_TYPES },
  }[cat];
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
      <Breadcrumb items={[{label:"作业管理",onClick:()=>onNavigate({type:"overview"})},{label:cfg.name}]}/>
      <div className={`flex items-center gap-4 bg-card border ${cfg.border} rounded-xl px-5 py-4`}>
        <div className={`w-12 h-12 rounded-xl ${cfg.bg} ${cfg.border} border flex items-center justify-center flex-shrink-0`}><span className={cfg.color}>{cfg.icon}</span></div>
        <div className="flex-1"><h1 className={`text-base font-bold ${cfg.color}`}>{cfg.name}</h1><p className="text-xs text-muted-foreground mt-0.5">{cat==="hazardous"?`涵盖 ${HAZARDOUS_TYPES.length} 类高危作业`:cat==="cross"?"两家及以上单位在同一影响区域同时作业":`涵盖 ${MAJOR_TYPES.length} 类危险性较大分部分项工程`}</p></div>
        <button onClick={()=>onNavigate({type:"workcreate",workName:cfg.name,cat})} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"><Plus size={13}/>申请作业票</button>
      </div>
      {cfg.types.length>0 && (
        <div className="grid grid-cols-4 gap-3">
          {cfg.types.map((wt:any)=>{
            const rc=RISK_COLOR[wt.risk];
            const cnt=MOCK_RECORDS.filter(r=>r.type===wt.name&&r.status==="作业中").length;
            return (
              <button key={wt.id} onClick={()=>onNavigate({type:"worklist",workName:wt.name,cat})}
                className="text-left bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">{wt.icon}</div>
                  <RiskBadge risk={wt.risk}/>
                </div>
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">{wt.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{cnt>0?`${cnt} 张有效`:"暂无在办"}</p>
              </button>
            );
          })}
        </div>
      )}
      {cat==="cross" && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">触发条件</h3>
          {["两家及以上单位在同一作业区域（含影响范围）同时开展任何作业","作业之间存在空间、时间或资源上的交叉，可能造成风险叠加","任一方作业属于危险作业或危大工程时，风险自动升级"].map((t,i)=>(
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-[10px] text-indigo-400 font-bold">{i+1}</span></div>
              <p className="text-xs text-muted-foreground">{t}</p>
            </div>
          ))}
          <button onClick={()=>onNavigate({type:"worklist",workName:"交叉作业",cat:"cross"})} className="w-full py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors">查看交叉作业记录</button>
        </div>
      )}
    </div>
  );
}

// ─── 辅助分析 ─────────────────────────────────────────────────────────────────
const CHART_COLORS = ["#6366f1","#22d3ee","#f59e0b","#10b981","#f43f5e","#8b5cf6"];
function AnalysisView() {
  const [selUnit, setSelUnit] = useState("全部单位");
  const units = ["全部单位","天泽建设","锦鑫焊接","鑫达施工","广达物业","土方公司"];

  const statusData = STATUS_TABS.map(s=>({ name:s, value:MOCK_RECORDS.filter(r=>r.status===s).length }));
  const typeData = [
    {name:"危险作业",value:MOCK_RECORDS.filter(r=>r.cat==="hazardous").length},
    {name:"危大工程",value:MOCK_RECORDS.filter(r=>r.cat==="major").length},
    {name:"交叉作业",value:MOCK_RECORDS.filter(r=>r.cat==="cross").length},
    {name:"常规作业",value:MOCK_RECORDS.filter(r=>r.cat==="regular").length},
  ];
  const trendData = [
    {month:"1月",申请:8,完成:7},{month:"2月",申请:12,完成:10},{month:"3月",申请:15,完成:13},
    {month:"4月",申请:10,完成:9},{month:"5月",申请:18,完成:16},{month:"6月",申请:22,完成:14},
  ];
  const UNIT_COUNTS: Record<string,number> = {"天泽建设":7,"锦鑫焊接":4,"鑫达施工":6,"广达物业":3,"土方公司":5};
  const unitData = units.filter(u=>u!=="全部单位").map(u=>({
    unit:u, count:UNIT_COUNTS[u]??4,
  }));
  const hazardData = [
    {name:"安全防护不到位",value:12},{name:"作业环境问题",value:8},
    {name:"设备设施隐患",value:6},{name:"管理制度缺失",value:4},{name:"其他",value:3},
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left unit selector */}
      <aside className="w-40 flex-shrink-0 border-r border-border bg-card overflow-y-auto">
        <div className="px-3 py-3 border-b border-border"><p className="text-xs font-semibold text-foreground">单位列表</p></div>
        {units.map(u=>(
          <button key={u} onClick={()=>setSelUnit(u)}
            className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${selUnit===u?"bg-primary/10 text-primary font-medium":"text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
            {u}
          </button>
        ))}
      </aside>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-base font-semibold text-foreground">辅助分析</h1><p className="text-xs text-muted-foreground">{selUnit} · 作业数据统计分析</p></div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground"><Download size={12}/>导出报告</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Work status pie */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2"><PieIcon size={13} className="text-primary"/>作业状态分布</p>
            <div className="flex items-center gap-4">
              <PieChart width={160} height={160}>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {statusData.map((d,i)=><Cell key={`status-${d.name}`} fill={CHART_COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"#132032",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
              </PieChart>
              <div className="space-y-2">
                {statusData.map((d,i)=>(
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:CHART_COLORS[i]}}/>
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ml-auto font-mono text-foreground font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work type pie */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2"><PieIcon size={13} className="text-primary"/>作业类别分布</p>
            <div className="flex items-center gap-4">
              <PieChart width={160} height={160}>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {typeData.map((d,i)=><Cell key={`type-${d.name}`} fill={["#ef4444","#f59e0b","#6366f1","#10b981"][i]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"#132032",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
              </PieChart>
              <div className="space-y-2">
                {typeData.map((d,i)=>(
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:["#ef4444","#f59e0b","#6366f1","#10b981"][i]}}/>
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ml-auto font-mono text-foreground font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trend line chart */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2"><BarChart3 size={13} className="text-primary"/>作业趋势（月度）</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart id="analysis-trend" data={trendData}>
              <XAxis key="ax-x" dataKey="month" tick={{fontSize:11,fill:"#7a91a8"}} axisLine={false} tickLine={false}/>
              <YAxis key="ax-y" tick={{fontSize:11,fill:"#7a91a8"}} axisLine={false} tickLine={false}/>
              <Tooltip key="tip" contentStyle={{background:"#132032",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
              <Legend key="leg" wrapperStyle={{fontSize:12}}/>
              <Line key="line-apply" type="monotone" dataKey="申请" stroke="#6366f1" strokeWidth={2} dot={{r:3}} name="申请数"/>
              <Line key="line-done"  type="monotone" dataKey="完成" stroke="#10b981" strokeWidth={2} dot={{r:3}} name="完成数"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Unit bar chart */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2"><BarChart3 size={13} className="text-primary"/>各单位作业统计</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart id="analysis-unit" data={unitData} layout="vertical">
                <XAxis key="ax-x" type="number" tick={{fontSize:11,fill:"#7a91a8"}} axisLine={false} tickLine={false}/>
                <YAxis key="ax-y" dataKey="unit" type="category" tick={{fontSize:11,fill:"#7a91a8"}} axisLine={false} tickLine={false} width={60}/>
                <Tooltip key="tip" contentStyle={{background:"#132032",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
                <Bar key="bar-count" dataKey="count" fill="#6366f1" radius={[0,4,4,0]} name="作业数"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Hazard classification */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2"><AlertTriangle size={13} className="text-amber-400"/>隐患分类统计</p>
            <div className="space-y-2.5">
              {hazardData.map((h,i)=>(
                <div key={h.name} className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">{h.name}</span><span className="text-foreground font-mono">{h.value}</span></div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${h.value/hazardData[0].value*100}%`,background:CHART_COLORS[i]}}/></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Work stats list */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border"><span className="text-xs font-semibold text-foreground">作业统计列表</span></div>
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b border-border">{["作业类型","总计","申请中","作业中","已完成","作废"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {["常规作业","动火作业","有限空间作业","高处作业","吊装作业","临时用电作业","动土作业","断路作业","盲板抽堵作业"].map(type=>{
                const recs=MOCK_RECORDS.filter(r=>r.type===type);
                if(recs.length===0)return null;
                return (
                  <tr key={type} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5 text-xs font-medium text-foreground">{type}</td>
                    <td className="px-4 py-2.5 text-xs font-mono text-foreground">{recs.length}</td>
                    {STATUS_TABS.map(s=><td key={s} className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{recs.filter(r=>r.status===s).length}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 参数配置 ─────────────────────────────────────────────────────────────────
type ParamTab = "综合配置"|"作业类型配置"|"风险内容配置"|"安全交底配置"|"结束标准配置";
const PARAM_TABS: ParamTab[] = ["综合配置","作业类型配置","风险内容配置","安全交底配置","结束标准配置"];

function ParamConfigView() {
  const [tab, setTab] = useState<ParamTab>("综合配置");
  const [toggles, setToggles] = useState<Record<string,boolean>>({
    "管控措施不涉及表备注必填": false,
    "培训考核": true,
    "人脸识别": false,
    "作业初审": false,
  });
  const toggle = (key:string)=>setToggles(p=>({...p,[key]:!p[key]}));

  const paramTabs = ["综合配置", "作业类型配置", "风险内容配置", "安全交底配置", "结束确认标准"];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#dbe5f6] p-4 text-xs text-[#1e293b]">
      {/* 蓝色面包屑 */}
      <div className="mb-3 text-[#475569] font-medium flex items-center gap-1">
        <span>作业配置</span> <span className="text-[#94a3b8]">/</span> <span className="text-[#1e293b]">综合配置</span>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* 左侧树形目录 (完全对照 image-7.png) */}
        <div className="w-64 bg-white rounded-lg shadow-sm border border-[#cbe0f5] flex flex-col overflow-hidden">
          <div className="p-3 bg-[#edf3fa] border-b border-[#cbe0f5] flex items-center gap-1.5 font-bold text-[#3b82f6]">
            <span>▶</span> 所属单位
          </div>
          <div className="p-2 border-b border-[#e2e8f0]">
            <input type="text" placeholder="请输入组织名称" className="w-full border border-[#cbd5e1] rounded px-2 py-1 text-xs outline-none bg-white"/>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1 text-[#334155]">
            <div className="font-semibold text-red-600 bg-red-50 p-1.5 rounded flex items-center gap-1">
              <span>🏢</span> 鞍钢集团矿业有限公司
            </div>
            <div className="pl-4 space-y-1 text-[#475569]">
              <div className="p-1 hover:bg-slate-100 rounded cursor-pointer flex items-center gap-1"><span>🏢</span> 东鞍山烧结厂</div>
              <div className="p-1 hover:bg-slate-100 rounded cursor-pointer flex items-center gap-1"><span>🏢</span> 齐大山选矿厂</div>
              <div className="p-1 hover:bg-slate-100 rounded cursor-pointer flex items-center gap-1"><span>🏢</span> 弓长岭有限公司选矿分公司</div>
              <div className="p-1 hover:bg-slate-100 rounded cursor-pointer flex items-center gap-1"><span>🏢</span> 大孤山球团厂</div>
              <div className="p-1 hover:bg-slate-100 rounded cursor-pointer flex items-center gap-1"><span>🏢</span> 齐大山分公司</div>
              <div className="p-1 hover:bg-slate-100 rounded cursor-pointer flex items-center gap-1"><span>🏢</span> 鞍千矿业有限责任公司</div>
              <div className="p-1 hover:bg-slate-100 rounded cursor-pointer flex items-center gap-1"><span>🏢</span> 关宝山矿业有限公司</div>
            </div>
          </div>
        </div>

        {/* 右侧主配置区 (完全对照 image-7.png) */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-[#cbe0f5] flex flex-col overflow-hidden">
          {/* 横向 Tab 导航 */}
          <div className="flex items-center gap-2 p-3 bg-[#edf3fa] border-b border-[#cbe0f5]">
            {paramTabs.map(t => (
              <button key={t} onClick={() => setTab(t as any)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  tab === t || (tab==="综合配置" && t==="综合配置")
                    ? "bg-[#3b82f6] text-white shadow-sm"
                    : "bg-white text-[#475569] border border-[#cbd5e1] hover:bg-slate-50"
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* 配置开关列表 */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            
            {/* 开关 1 */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#e2e8f0] rounded">
              <div className="space-y-1">
                <span className="font-bold text-[#1e293b]">管控措施不涉及时备注必填</span>
                <p className="text-[#64748b] text-[11px]">开启此功能，在进行安全措施确认界面，点击不涉及秒，必须填写备注</p>
              </div>
              <div className="flex border border-[#3b82f6] rounded overflow-hidden text-xs">
                <button onClick={()=>setToggles(p=>({...p,"管控措施不涉及表备注必填":true}))} className={`px-3 py-1 ${toggles["管控措施不涉及表备注必填"]?"bg-[#3b82f6] text-white":"bg-white text-[#334155]"}`}>开启</button>
                <button onClick={()=>setToggles(p=>({...p,"管控措施不涉及表备注必填":false}))} className={`px-3 py-1 ${!toggles["管控措施不涉及表备注必填"]?"bg-[#3b82f6] text-white":"bg-white text-[#334155]"}`}>关闭</button>
              </div>
            </div>

            {/* 开关 2 */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#e2e8f0] rounded">
              <div className="space-y-1">
                <span className="font-bold text-[#1e293b]">培训考核</span>
                <p className="text-[#64748b] text-[11px]">作业初审后，作业人员必须参加培训完成考核，才可继续交底任务</p>
              </div>
              <div className="flex border border-[#3b82f6] rounded overflow-hidden text-xs">
                <button onClick={()=>setToggles(p=>({...p,"培训考核":true}))} className={`px-3 py-1 ${toggles["培训考核"]?"bg-[#3b82f6] text-white":"bg-white text-[#334155]"}`}>开启</button>
                <button onClick={()=>setToggles(p=>({...p,"培训考核":false}))} className={`px-3 py-1 ${!toggles["培训考核"]?"bg-[#3b82f6] text-white":"bg-white text-[#334155]"}`}>关闭</button>
              </div>
            </div>

            {/* 开关 3 */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#e2e8f0] rounded">
              <div className="space-y-1">
                <span className="font-bold text-[#1e293b]">人脸识别</span>
                <p className="text-[#64748b] text-[11px]">选择作业验票时是否需要人脸识别对比功能</p>
              </div>
              <div className="flex border border-[#3b82f6] rounded overflow-hidden text-xs">
                <button onClick={()=>setToggles(p=>({...p,"人脸识别":true}))} className={`px-3 py-1 ${toggles["人脸识别"]?"bg-[#3b82f6] text-white":"bg-white text-[#334155]"}`}>开启</button>
                <button onClick={()=>setToggles(p=>({...p,"人脸识别":false}))} className={`px-3 py-1 ${!toggles["人脸识别"]?"bg-[#3b82f6] text-white":"bg-white text-[#334155]"}`}>关闭</button>
              </div>
            </div>

            {/* 开关 4 */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-[#e2e8f0] rounded">
              <div className="space-y-1">
                <span className="font-bold text-[#1e293b]">作业初审</span>
                <p className="text-[#64748b] text-[11px]">选择作业票是否需要进行初审，再进入下一环节</p>
              </div>
              <div className="flex border border-[#3b82f6] rounded overflow-hidden text-xs">
                <button onClick={()=>setToggles(p=>({...p,"作业初审":true}))} className={`px-3 py-1 ${toggles["作业初审"]?"bg-[#3b82f6] text-white":"bg-white text-[#334155]"}`}>开启</button>
                <button onClick={()=>setToggles(p=>({...p,"作业初审":false}))} className={`px-3 py-1 ${!toggles["作业初审"]?"bg-[#3b82f6] text-white":"bg-white text-[#334155]"}`}>关闭</button>
              </div>
            </div>

            {/* 检测气体表格 */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#1e293b]">检测气体</span>
                <button className="px-3 py-1 bg-[#3b82f6] text-white rounded text-xs">新增气体</button>
              </div>
              <table className="w-full border-collapse text-left text-xs border border-[#e2e8f0]">
                <thead>
                  <tr className="bg-[#edf3fa] border-b border-[#cbe0f5] text-[#475569]">
                    <th className="p-2.5">序号</th>
                    <th className="p-2.5">气体名称</th>
                    <th className="p-2.5">气体单位</th>
                    <th className="p-2.5">合格标准</th>
                    <th className="p-2.5">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  <tr>
                    <td className="p-2.5 font-mono">1</td>
                    <td className="p-2.5 font-medium">请问</td>
                    <td className="p-2.5">去</td>
                    <td className="p-2.5 text-[#94a3b8]">-</td>
                    <td className="p-2.5 space-x-2 text-[#3b82f6]">
                      <button className="hover:underline">编辑</button>
                      <button className="hover:underline text-red-500">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Minimal form builder (kept) ──────────────────────────────────────────────
type QType = "text"|"textarea"|"select"|"radio"|"checkbox"|"date"|"number"|"file";
interface Question { id:string;type:QType;title:string;required:boolean;options?:string[];placeholder?:string;rows?:number }
interface Survey { id:string;title:string;description:string;questions:Question[];submitLabel:string;status:"draft"|"published";createdAt:string;responses:number }
const Q_DEFS = [
  {type:"text"     as QType,label:"单行文本"},{type:"textarea" as QType,label:"多行文本"},
  {type:"number"   as QType,label:"数字"},    {type:"select"   as QType,label:"下拉选择"},
  {type:"radio"    as QType,label:"单选题"},  {type:"checkbox" as QType,label:"多选题"},
  {type:"date"     as QType,label:"日期"},    {type:"file"     as QType,label:"文件上传"},
];
function fuid(){return Math.random().toString(36).slice(2,8);}
function mkQ(type:QType):Question{const q:Question={id:fuid(),type,title:Q_DEFS.find(d=>d.type===type)?.label??"问题",required:false};if(["select","radio","checkbox"].includes(type))q.options=["选项 A","选项 B","选项 C"];if(type==="textarea")q.rows=3;return q;}
const PRESET_SURVEYS:Survey[]=[
  {id:"s1",title:"安全事故上报表",description:"请如实填写所有信息，及时上报。",submitLabel:"提交上报",status:"published",createdAt:"2026-06-12",responses:47,
    questions:[{id:"q1",type:"text",title:"事故名称",required:true,placeholder:"简要描述事故性质"},{id:"q2",type:"select",title:"事故类型",required:true,options:["物体打击","触电","高处坠落","火灾","其他"]},{id:"q3",type:"date",title:"事故时间",required:true},{id:"q4",type:"textarea",title:"事故经过",required:true,rows:4},{id:"q5",type:"text",title:"上报人",required:true}]},
  {id:"s2",title:"高处作业安全检查表",description:"作业前安全条件确认。",submitLabel:"确认提交",status:"published",createdAt:"2026-05-28",responses:23,
    questions:[{id:"r1",type:"text",title:"作业地点",required:true},{id:"r2",type:"radio",title:"安全帽已佩戴",required:true,options:["是","否"]},{id:"r3",type:"radio",title:"安全带已系好",required:true,options:["是","否"]}]},
  {id:"s3",title:"承包商入场审查表",description:"外来承包商资质审核。",submitLabel:"提交审核",status:"draft",createdAt:"2026-06-15",responses:0,
    questions:[{id:"t1",type:"text",title:"承包商名称",required:true},{id:"t2",type:"date",title:"进场日期",required:true},{id:"t3",type:"checkbox",title:"提交资料",required:true,options:["营业执照","安全生产许可证","特种作业证"]}]},
];
function QPreview({q}:{q:Question}){
  const i="border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#374151] bg-white placeholder-[#9ca3af] w-full focus:outline-none";
  if(q.type==="text")   return <input type="text"   className={i} placeholder={q.placeholder??"填写…"} readOnly/>;
  if(q.type==="number") return <input type="number" className={i} placeholder="0" readOnly/>;
  if(q.type==="date")   return <input type="date"   className={i} readOnly/>;
  if(q.type==="textarea")return <textarea rows={q.rows??3} className={`${i} resize-none`} placeholder={q.placeholder??"填写…"} readOnly/>;
  if(q.type==="file")   return <div className="border-2 border-dashed border-[#d1d5db] rounded-lg py-4 text-center bg-[#f9fafb]"><Upload size={14} className="mx-auto text-[#9ca3af] mb-1"/><p className="text-xs text-[#9ca3af]">上传文件</p></div>;
  if(q.type==="select") return <div className="relative"><select className={`${i} appearance-none pr-8`} disabled><option>请选择…</option>{q.options?.map(o=><option key={o}>{o}</option>)}</select><ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"/></div>;
  if(q.type==="radio")  return <div className="space-y-1.5">{q.options?.map(o=><label key={o} className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border-2 border-[#d1d5db] bg-white"/><span className="text-sm text-[#374151]">{o}</span></label>)}</div>;
  if(q.type==="checkbox")return <div className="space-y-1.5">{q.options?.map(o=><label key={o} className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded border-2 border-[#d1d5db] bg-white"/><span className="text-sm text-[#374151] leading-snug">{o}</span></label>)}</div>;
  return null;
}
function FormBuilder({survey,onBack,onSave}:{survey:Survey;onBack:()=>void;onSave:(s:Survey)=>void}){
  const [s,setS]=useState(survey);const [selId,setSelId]=useState<string|null>(null);const [prev,setPrev]=useState(false);
  const selQ=s.questions.find(q=>q.id===selId)??null;
  const addQ=(type:QType)=>{const q=mkQ(type);setS(p=>({...p,questions:[...p.questions,q]}));setSelId(q.id);};
  const updQ=(id:string,p:Partial<Question>)=>setS(pr=>({...pr,questions:pr.questions.map(q=>q.id===id?{...q,...p}:q)}));
  const delQ=(id:string)=>{setS(p=>({...p,questions:p.questions.filter(q=>q.id!==id)}));setSelId(null);};
  const dupeQ=(id:string)=>{const idx=s.questions.findIndex(q=>q.id===id);const c={...s.questions[idx],id:fuid()};const qs=[...s.questions];qs.splice(idx+1,0,c);setS(p=>({...p,questions:qs}));setSelId(c.id);};
  const moveQ=(id:string,d:-1|1)=>{const idx=s.questions.findIndex(q=>q.id===id);const qs=[...s.questions];const t=idx+d;if(t<0||t>=qs.length)return;[qs[idx],qs[t]]=[qs[t],qs[idx]];setS(p=>({...p,questions:qs}));};
  let qn=0;
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft size={13}/>返回</button>
        <div className="w-px h-4 bg-border"/>
        <input className="text-sm font-semibold bg-transparent text-foreground focus:outline-none border-b border-transparent focus:border-primary/50 px-0.5 max-w-xs" value={s.title} onChange={e=>setS(p=>({...p,title:e.target.value}))}/>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=>setPrev(p=>!p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-foreground/70 hover:text-foreground"><Eye size={12}/>{prev?"编辑":"预览"}</button>
          <button onClick={()=>onSave({...s,status:"published"})} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"><Send size={12}/>发布</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {!prev&&<aside className="w-40 flex-shrink-0 border-r border-border bg-card overflow-y-auto py-2 px-2">
          <p className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">添加字段</p>
          {Q_DEFS.map(d=><button key={d.type} onClick={()=>addQ(d.type)} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-foreground/75 hover:text-foreground hover:bg-muted transition-colors text-left">{d.label}</button>)}
        </aside>}
        <div className="flex-1 overflow-y-auto" style={{background:"#f0f2f5"}}>
          {prev?(
            <div className="max-w-2xl mx-auto py-8 px-4">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#e5e7eb]">
                <div className="px-8 py-6 border-b border-[#e5e7eb]" style={{background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)"}}><h1 className="text-xl font-bold text-white">{s.title}</h1>{s.description&&<p className="text-sm text-white/80 mt-1">{s.description}</p>}</div>
                <div className="px-8 py-6 space-y-5">{s.questions.map(q=>{qn++;return(<div key={q.id} className="space-y-2"><div className="flex items-start gap-1"><span className="text-sm font-medium text-[#111827]"><span className="text-[#6366f1] mr-1">{qn}.</span>{q.title}</span>{q.required&&<span className="text-red-500 text-xs">*</span>}</div><QPreview q={q}/></div>);})}</div>
                <div className="px-8 py-4 border-t border-[#e5e7eb] bg-[#f9fafb] flex justify-center"><button className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white" style={{background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)"}}><Send size={14}/>{s.submitLabel}</button></div>
              </div>
            </div>
          ):(
            <div className="max-w-2xl mx-auto py-6 px-4 space-y-3">
              <div className="bg-white rounded-xl border-2 border-[#e5e7eb] overflow-hidden"><div className="h-2" style={{background:"linear-gradient(90deg,#6366f1,#8b5cf6)"}}/><div className="px-6 py-4 space-y-2"><input className="w-full text-lg font-bold text-[#111827] bg-transparent focus:outline-none border-b-2 border-transparent focus:border-[#6366f1] pb-1" value={s.title} onChange={e=>setS(p=>({...p,title:e.target.value}))} placeholder="表单标题"/><textarea rows={2} className="w-full text-sm text-[#6b7280] bg-transparent focus:outline-none resize-none" value={s.description} onChange={e=>setS(p=>({...p,description:e.target.value}))} placeholder="表单说明（可选）"/></div></div>
              {s.questions.length===0?<div className="bg-white rounded-xl border-2 border-dashed border-[#e5e7eb] px-6 py-12 text-center"><Plus size={24} className="mx-auto text-[#9ca3af] mb-2"/><p className="text-sm text-[#6b7280]">从左侧点击添加问题</p></div>:s.questions.map((q,idx)=>{qn++;return(
                <div key={q.id} onClick={()=>setSelId(q.id===selId?null:q.id)} className={`bg-white rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${selId===q.id?"border-[#6366f1] shadow-lg":"border-[#e5e7eb] hover:border-[#c7d2fe]"}`}>
                  {selId===q.id&&<div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6366f1]"/>}
                  <div className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${selId===q.id?"bg-[#6366f1] text-white":"bg-[#f3f4f6] text-[#6b7280]"}`}>{qn}</div>
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2"><input className="flex-1 text-sm font-medium bg-transparent text-[#111827] focus:outline-none placeholder-[#9ca3af]" value={q.title} onChange={e=>updQ(q.id,{title:e.target.value})} onClick={e=>e.stopPropagation()} placeholder="输入问题…"/>{q.required&&<span className="text-[10px] text-red-500 flex-shrink-0 mt-0.5">必填</span>}</div>
                        <QPreview q={q}/>
                      </div>
                    </div>
                  </div>
                  {selId===q.id&&<div className="flex items-center justify-between px-5 py-2 border-t border-[#e5e7eb] bg-[#f9fafb]">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-[#6b7280] cursor-pointer"><input type="checkbox" checked={q.required} onChange={()=>updQ(q.id,{required:!q.required})} className="accent-[#6366f1]"/>必填</label>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button onClick={e=>{e.stopPropagation();moveQ(q.id,-1);}} disabled={idx===0} className="p-1.5 rounded hover:bg-[#e5e7eb] disabled:opacity-30"><ChevronUp size={12} className="text-[#6b7280]"/></button>
                      <button onClick={e=>{e.stopPropagation();moveQ(q.id,1);}} disabled={idx===s.questions.length-1} className="p-1.5 rounded hover:bg-[#e5e7eb] disabled:opacity-30"><ChevronDown size={12} className="text-[#6b7280]"/></button>
                      <button onClick={e=>{e.stopPropagation();dupeQ(q.id);}} className="p-1.5 rounded hover:bg-[#e5e7eb]"><Copy size={12} className="text-[#6b7280]"/></button>
                      <button onClick={e=>{e.stopPropagation();delQ(q.id);}} className="p-1.5 rounded hover:bg-red-50"><Trash2 size={12} className="text-red-400"/></button>
                    </div>
                  </div>}
                </div>
              );})}
              <button onClick={()=>addQ("text")} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#d1d5db] text-sm text-[#6b7280] hover:border-[#6366f1] hover:text-[#6366f1] bg-white transition-all"><Plus size={14}/>添加问题</button>
              {s.questions.length>0&&<div className="flex justify-center py-2"><button className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white opacity-75 cursor-default" style={{background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)"}}><Send size={14}/>{s.submitLabel}</button></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function FormListView({surveys,onEdit,onCreate}:{surveys:Survey[];onEdit:(s:Survey)=>void;onCreate:()=>void}){
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
      <div className="flex items-center justify-between"><div><h1 className="text-base font-semibold text-foreground">自定义表单</h1><p className="text-xs text-muted-foreground">构建和管理作业调查表单</p></div><button onClick={onCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"><Plus size={13}/>新建表单</button></div>
      <div className="grid grid-cols-4 gap-3">
        {[{label:"表单总数",val:surveys.length},{label:"已发布",val:surveys.filter(s=>s.status==="published").length},{label:"总回收",val:surveys.reduce((a,s)=>a+s.responses,0)},{label:"草稿",val:surveys.filter(s=>s.status==="draft").length}].map(({label,val})=>(
          <div key={label} className="bg-card border border-border rounded-xl px-4 py-3"><p className="text-xl font-bold font-mono text-foreground">{val}</p><p className="text-xs text-muted-foreground mt-0.5">{label}</p></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button onClick={onCreate} className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-10 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"><div className="w-10 h-10 rounded-xl border-2 border-current flex items-center justify-center"><Plus size={18}/></div><p className="text-xs font-medium">新建空白表单</p></button>
        {surveys.map(s=>(
          <div key={s.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/40 hover:shadow-lg transition-all">
            <div className="h-1.5" style={{background:s.status==="published"?"linear-gradient(90deg,#6366f1,#8b5cf6)":"linear-gradient(90deg,#9ca3af,#d1d5db)"}}/>
            <div className="p-4"><h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{s.title}</h3><p className="text-xs text-muted-foreground line-clamp-2 mb-3">{s.description}</p><div className="flex items-center gap-2"><span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${s.status==="published"?"bg-green-500/10 text-green-400 border-green-500/20":"bg-muted text-muted-foreground border-border"}`}>{s.status==="published"?"已发布":"草稿"}</span><span className="text-[11px] text-muted-foreground">{s.questions.length} 题</span>{s.responses>0&&<span className="text-[11px] text-muted-foreground">{s.responses} 份</span>}</div></div>
            <div className="px-4 pb-3"><div className="flex gap-2 pt-2 border-t border-border"><button onClick={()=>onEdit(s)} className="flex-1 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20">编辑</button><button className="flex-1 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs">填写</button></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 隐患排查 ──────────────────────────────────────────────────────────────────
// ─── 我的待办列表页面 (完全对照 image-6.png) ─────────────────────────────────
function TodoListView({ onNavigate }: { onNavigate:(v:ActiveView)=>void }) {
  const [todoTab, setTodoTab] = useState("风险评估");

  const todoTabs = [
    { label:"作业审批", count:0 },
    { label:"风险评估", count:8 },
    { label:"安全措施", count:5 },
    { label:"现场实施", count:3 },
    { label:"验收审批", count:0 },
  ];

  const todoList = [
    { no:"DH20260506002", content:"zd作业内容", type:"三级动火作业", time:"2026-05-07 18:56 ~ 2026-05-08 02:56", resp:"安全生产鞍钢项目 / 东鞍山烧结厂", applicant:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司", applyTime:"2026-05-06 18:59" },
    { no:"DH20260506001", content:"啊啊啊 作业内", type:"特级动火作业", time:"2026-05-06 12:20 ~ 2026-05-06 20:20", resp:"安全生产鞍钢项目 / 东鞍山烧结厂", applicant:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司", applyTime:"2026-05-06 11:20" },
    { no:"DH20260429001", content:"ssss", type:"二级动火作业", time:"2026-04-29 16:50 ~ 2026-04-30 00:18", resp:"安全生产鞍钢项目 / 东鞍山烧结厂", applicant:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司", applyTime:"2026-04-29 16:31" },
    { no:"DH20251215004", content:"Test_测试动火job", type:"一级动火作业", time:"2025-12-16 18:29 ~ 2025-12-17 02:29", resp:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司大孤山球团厂", applicant:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司", applyTime:"2025-12-15 18:31" },
    { no:"DH20251215002", content:"Test_测试动火作业3", type:"一级动火作业", time:"2025-12-16 09:49 ~ 2025-12-16 17:49", resp:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司大孤山球团厂", applicant:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司", applyTime:"2025-12-15 09:50" },
    { no:"DH20251203003", content:"测试动火作业3", type:"一级动火作业", time:"2025-12-04 15:00 ~ 2025-12-04 23:00", resp:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司大孤山球团厂", applicant:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司", applyTime:"2025-12-03 15:01" },
    { no:"DH20251203002", content:"测试2次动火作业", type:"二级动火作业", time:"2025-12-04 14:30 ~ 2025-12-04 22:30", resp:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司大孤山球团厂", applicant:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司", applyTime:"2025-12-03 14:28" },
    { no:"DH20251203001", content:"测试一个动火作业测试", type:"二级动火作业", time:"2025-12-04 14:21 ~ 2025-12-04 22:21", resp:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司大孤山球团厂", applicant:"安全生产鞍钢项目 / 鞍钢集团矿业有限公司", applyTime:"2025-12-03 14:22" },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#dbe5f6] p-4 text-xs text-[#1e293b]">
      {/* 蓝色面包屑 */}
      <div className="mb-3 text-[#475569] font-medium flex items-center gap-1">
        <span>我的待办</span> <span className="text-[#94a3b8]">/</span> <span className="text-[#1e293b]">风险评估</span>
      </div>

      {/* 顶部白色卡片包覆内容 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-[#cbe0f5]">
        
        {/* 顶部 Tab 状态 */}
        <div className="flex items-center gap-2 p-3 bg-[#edf3fa] border-b border-[#cbe0f5]">
          {todoTabs.map(t => (
            <button key={t.label} onClick={()=>setTodoTab(t.label)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                todoTab===t.label
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "bg-white text-[#475569] border border-[#cbd5e1] hover:bg-slate-50"
              }`}>
              {t.label}{t.count > 0 && `(${t.count})`}
            </button>
          ))}
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center gap-3 p-3 bg-white border-b border-[#e2e8f0]">
          <span className="text-[#64748b]">作业类型</span>
          <select className="border border-[#cbd5e1] rounded px-2 py-1 text-xs text-[#334155] bg-white outline-none w-40">
            <option>请选择作业类型</option>
            <option>动火作业</option>
            <option>高处作业</option>
          </select>
          <div className="relative flex-1 max-w-sm">
            <input type="text" placeholder="搜索作业内容、作业单位、负责人等" className="w-full border border-[#cbd5e1] rounded pl-3 pr-8 py-1 text-xs text-[#334155] bg-white outline-none focus:border-blue-500"/>
            <Search size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"/>
          </div>
        </div>

        {/* 表格数据 */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#edf3fa] text-[#475569] font-medium border-b border-[#cbe0f5]">
                <th className="p-3 whitespace-nowrap">作业票编号</th>
                <th className="p-3 whitespace-nowrap">作业内容</th>
                <th className="p-3 whitespace-nowrap">作业类型/等级</th>
                <th className="p-3 whitespace-nowrap">计划时间</th>
                <th className="p-3 whitespace-nowrap">负责人/作业单位</th>
                <th className="p-3 whitespace-nowrap">申请人/申请单位</th>
                <th className="p-3 whitespace-nowrap">作业进度</th>
                <th className="p-3 whitespace-nowrap">申请时间</th>
                <th className="p-3 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-[#334155]">
              {todoList.map((item, i) => (
                <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3 font-mono text-[#1e293b] font-medium">{item.no}</td>
                  <td className="p-3">{item.content}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3 whitespace-nowrap font-mono text-[11px]">
                    <div className="flex items-center gap-1 text-[#059669]">
                      <span className="w-3 h-3 rounded-full bg-[#10b981] text-white flex items-center justify-center text-[8px] font-bold">起</span>
                      {item.time.split(" ~ ")[0]}
                    </div>
                    <div className="flex items-center gap-1 text-[#dc2626] mt-0.5">
                      <span className="w-3 h-3 rounded-full bg-[#ef4444] text-white flex items-center justify-center text-[8px] font-bold">末</span>
                      {item.time.split(" ~ ")[1]}
                    </div>
                  </td>
                  <td className="p-3 leading-snug">{item.resp}</td>
                  <td className="p-3 leading-snug">{item.applicant}</td>
                  <td className="p-3">
                    <span className="bg-[#06b6d4] text-white px-2 py-0.5 rounded text-[11px]">风险评估</span>
                  </td>
                  <td className="p-3 font-mono text-[#64748b] whitespace-nowrap">{item.applyTime}</td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>onNavigate({type:"workdetail", record: MOCK_RECORDS[0]})} className="px-2 py-1 border border-[#3b82f6] text-[#3b82f6] rounded hover:bg-blue-50">作业详情</button>
                      <button className="px-2 py-1 border border-[#3b82f6] text-[#3b82f6] rounded hover:bg-blue-50">风险评估</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 底部分页 */}
        <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-end gap-3 text-[#64748b] font-mono text-xs">
          <span>共 {todoList.length} 条</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-0.5 border border-[#cbd5e1] rounded bg-white">&lt;</button>
            <button className="px-2.5 py-0.5 border border-[#3b82f6] bg-[#3b82f6] text-white rounded font-bold">1</button>
            <button className="px-2 py-0.5 border border-[#cbd5e1] rounded bg-white">&gt;</button>
          </div>
          <select className="border border-[#cbd5e1] rounded px-1 py-0.5 bg-white text-xs">
            <option>10条/页</option>
          </select>
          <span>跳至 <input type="text" defaultValue="1" className="w-8 border border-[#cbd5e1] rounded px-1 py-0.5 text-center bg-white"/></span>
        </div>
      </div>
    </div>
  );
}

// ─── 隐患排查 ──────────────────────────────────────────────────────────────────
const HAZARD_TYPES = ["火灾隐患","用电安全","高处作业","机械伤害","化学品泄漏","防护缺失","违规操作","其他"] as const;
type HazardStatus = "待整改"|"整改中"|"已整改"|"已关闭";
interface HazardRecord {
  id:string; no:string; htype:string; location:string; desc:string;
  risk:"高"|"中"|"低"; finder:string; foundDate:string; deadline:string; status:HazardStatus;
}
const HAZARD_STATUS_STYLE: Record<HazardStatus,{bg:string;text:string;border:string;dot:string}> = {
  "待整改": { bg:"bg-red-500/10",    text:"text-red-400",    border:"border-red-500/20",    dot:"bg-red-400"    },
  "整改中": { bg:"bg-amber-500/10",  text:"text-amber-400",  border:"border-amber-500/20",  dot:"bg-amber-400"  },
  "已整改": { bg:"bg-green-500/10",  text:"text-green-400",  border:"border-green-500/20",  dot:"bg-green-400"  },
  "已关闭": { bg:"bg-muted",          text:"text-muted-foreground", border:"border-border", dot:"bg-muted-foreground" },
};
const MOCK_HAZARDS: HazardRecord[] = [
  { id:"H001", no:"HZ-2026-0618-001", htype:"火灾隐患",  location:"4号楼B1层配电室",   desc:"配电室进线侧电缆沟盖板缺失，存在人员坠落及火灾风险",       risk:"高", finder:"王安全", foundDate:"2026-06-18", deadline:"2026-06-20", status:"待整改" },
  { id:"H002", no:"HZ-2026-0618-002", htype:"防护缺失",  location:"3号楼14层外架",     desc:"14层外立面脚手架防护网破损约2平米，高处作业存在物体打击风险", risk:"高", finder:"李检查", foundDate:"2026-06-18", deadline:"2026-06-19", status:"整改中" },
  { id:"H003", no:"HZ-2026-0617-001", htype:"用电安全",  location:"施工临电配电箱A3",  desc:"配电箱门未关闭，箱内接线未整齐，存在触电风险",               risk:"中", finder:"王安全", foundDate:"2026-06-17", deadline:"2026-06-18", status:"已整改" },
  { id:"H004", no:"HZ-2026-0617-002", htype:"违规操作",  location:"2号楼8层施工区",    desc:"发现工人未佩戴安全帽在施工区域行走",                         risk:"中", finder:"张巡查", foundDate:"2026-06-17", deadline:"2026-06-17", status:"已关闭" },
  { id:"H005", no:"HZ-2026-0616-001", htype:"机械伤害",  location:"北侧料场起重区",    desc:"起重机配重区无警戒线，操作人员与信号工配合不当",             risk:"高", finder:"李检查", foundDate:"2026-06-16", deadline:"2026-06-17", status:"已整改" },
  { id:"H006", no:"HZ-2026-0616-002", htype:"高处作业",  location:"1号楼屋面防水区",   desc:"屋面临边无临时防护栏杆，作业人员未系安全带",                 risk:"高", finder:"王安全", foundDate:"2026-06-16", deadline:"2026-06-17", status:"整改中" },
  { id:"H007", no:"HZ-2026-0615-001", htype:"化学品泄漏",location:"地下室集水坑旁",    desc:"防腐涂料桶未密封存放，挥发性气体浓度超标",                   risk:"中", finder:"张巡查", foundDate:"2026-06-15", deadline:"2026-06-16", status:"已整改" },
  { id:"H008", no:"HZ-2026-0615-002", htype:"防护缺失",  location:"5号楼钢构安装区",   desc:"钢梁安装区域下方无防护棚，存在高空坠物风险",                 risk:"高", finder:"李检查", foundDate:"2026-06-15", deadline:"2026-06-16", status:"已关闭" },
  { id:"H009", no:"HZ-2026-0614-001", htype:"用电安全",  location:"3号楼临电配电箱B1", desc:"配电箱内断路器标注不清，接线混乱",                           risk:"低", finder:"王安全", foundDate:"2026-06-14", deadline:"2026-06-15", status:"已整改" },
  { id:"H010", no:"HZ-2026-0614-002", htype:"其他",      location:"施工现场南大门",    desc:"施工现场出入口未设置清洗设施，车辆带泥上路",                 risk:"低", finder:"张巡查", foundDate:"2026-06-14", deadline:"2026-06-15", status:"已关闭" },
  { id:"H011", no:"HZ-2026-0618-003", htype:"违规操作",  location:"地下室B2出入口",    desc:"动火作业人员未持有效特种作业证书上岗",                       risk:"高", finder:"李检查", foundDate:"2026-06-18", deadline:"2026-06-18", status:"待整改" },
  { id:"H012", no:"HZ-2026-0618-004", htype:"机械伤害",  location:"西侧塔吊作业区",    desc:"塔吊吊钩未配防脱装置，起吊时货物晃动明显",                   risk:"高", finder:"王安全", foundDate:"2026-06-18", deadline:"2026-06-19", status:"待整改" },
];

function HazardStatusBadge({ status }: { status:HazardStatus }) {
  const s = HAZARD_STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{status}
    </span>
  );
}

function HazardView({ onNavigate }: { onNavigate:(v:ActiveView)=>void }) {
  const [activeTab, setActiveTab] = useState<HazardStatus|"全部">("全部");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("全部");

  const HAZARD_TABS: (HazardStatus|"全部")[] = ["全部","待整改","整改中","已整改","已关闭"];

  const filtered = MOCK_HAZARDS.filter(h => {
    if (activeTab !== "全部" && h.status !== activeTab) return false;
    if (riskFilter !== "全部" && h.risk !== riskFilter) return false;
    if (search && !h.no.includes(search) && !h.location.includes(search) && !h.desc.includes(search)) return false;
    return true;
  });

  const counts: Record<HazardStatus|"全部", number> = {
    "全部":  MOCK_HAZARDS.length,
    "待整改": MOCK_HAZARDS.filter(h=>h.status==="待整改").length,
    "整改中": MOCK_HAZARDS.filter(h=>h.status==="整改中").length,
    "已整改": MOCK_HAZARDS.filter(h=>h.status==="已整改").length,
    "已关闭": MOCK_HAZARDS.filter(h=>h.status==="已关闭").length,
  };

  const statCards = [
    { label:"隐患总数", val:MOCK_HAZARDS.length,                                      color:"text-blue-400",   bg:"bg-blue-500/10",   border:"border-blue-500/20",   icon:<AlertTriangle size={16} className="text-blue-400"/> },
    { label:"待整改",   val:MOCK_HAZARDS.filter(h=>h.status==="待整改").length,       color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/20",    icon:<CircleAlert size={16} className="text-red-400"/> },
    { label:"整改中",   val:MOCK_HAZARDS.filter(h=>h.status==="整改中").length,       color:"text-amber-400",  bg:"bg-amber-500/10",  border:"border-amber-500/20",  icon:<Clock size={16} className="text-amber-400"/> },
    { label:"已整改",   val:MOCK_HAZARDS.filter(h=>h.status==="已整改").length,       color:"text-green-400",  bg:"bg-green-500/10",  border:"border-green-500/20",  icon:<CheckSquare size={16} className="text-green-400"/> },
    { label:"高风险",   val:MOCK_HAZARDS.filter(h=>h.risk==="高").length,              color:"text-red-400",    bg:"bg-red-500/10",    border:"border-red-500/20",    icon:<Shield size={16} className="text-red-400"/> },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-5">
        <Breadcrumb items={[{label:"隐患排查"}]}/>
        {/* Stat cards */}
        <div className="grid grid-cols-5 gap-3 mb-5">
          {statCards.map(c => (
            <div key={c.label} className={`rounded-lg border p-3.5 flex items-center gap-3 ${c.bg} ${c.border}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg} border ${c.border}`}>{c.icon}</div>
              <div>
                <p className="text-muted-foreground text-xs">{c.label}</p>
                <p className={`text-2xl font-bold ${c.color}`}>{c.val}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Table card */}
        <div className="bg-card rounded-lg border border-border">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索编号/位置/描述…"
                  className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 w-52"/>
              </div>
              <select value={riskFilter} onChange={e=>setRiskFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-md border border-border bg-secondary text-foreground focus:outline-none cursor-pointer">
                <option value="全部">风险等级：全部</option>
                <option value="高">高风险</option>
                <option value="中">中风险</option>
                <option value="低">低风险</option>
              </select>
              <select className="px-3 py-1.5 text-xs rounded-md border border-border bg-secondary text-foreground focus:outline-none cursor-pointer">
                <option>隐患类型：全部</option>
                {HAZARD_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                <Download size={12}/>导出
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                <Plus size={12}/>新增隐患
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-0 px-4 border-b border-border">
            {HAZARD_TABS.map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors ${activeTab===tab?"border-primary text-primary":"border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab}{tab!=="全部"&&<span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab===tab?"bg-primary/20 text-primary":"bg-muted text-muted-foreground"}`}>{counts[tab]}</span>}
              </button>
            ))}
          </div>
          {/* Table */}
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["序号","隐患编号","隐患类型","隐患位置","隐患描述","风险等级","发现人","发现时间","整改期限","状态","操作"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((h, i) => (
                  <tr key={h.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${i%2===0?"":"bg-muted/10"}`}>
                    <td className="px-4 py-2.5 text-muted-foreground">{i+1}</td>
                    <td className="px-4 py-2.5 font-mono text-blue-400">{h.no}</td>
                    <td className="px-4 py-2.5 text-foreground">{h.htype}</td>
                    <td className="px-4 py-2.5 text-foreground">{h.location}</td>
                    <td className="px-4 py-2.5 text-foreground max-w-[220px]"><span className="line-clamp-1">{h.desc}</span></td>
                    <td className="px-4 py-2.5"><RiskBadge risk={h.risk}/></td>
                    <td className="px-4 py-2.5 text-foreground">{h.finder}</td>
                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{h.foundDate}</td>
                    <td className={`px-4 py-2.5 whitespace-nowrap font-medium ${h.status==="待整改"&&new Date(h.deadline)<new Date("2026-06-19")?"text-red-400":"text-muted-foreground"}`}>{h.deadline}</td>
                    <td className="px-4 py-2.5"><HazardStatusBadge status={h.status}/></td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">查看</button>
                        {h.status==="待整改"&&<button className="text-primary hover:text-primary/80 transition-colors">整改</button>}
                        {h.status==="整改中"&&<button className="text-green-400 hover:text-green-300 transition-colors">验收</button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length===0&&(
                  <tr><td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">暂无数据</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">共 {filtered.length} 条记录</span>
            <div className="flex items-center gap-1">
              {[1,2,3].map(p=>(
                <button key={p} className={`w-7 h-7 text-xs rounded ${p===1?"bg-primary text-primary-foreground":"text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 智能监测 ──────────────────────────────────────────────────────────────────
interface MonitorPoint {
  id:string; name:string; location:string; type:string;
  value:number; unit:string; threshold:number; status:"正常"|"预警"|"报警";
  lastUpdate:string; trend:"up"|"down"|"stable";
}
const MONITOR_POINTS: MonitorPoint[] = [
  { id:"M001", name:"扬尘监测仪 A1",   location:"施工现场北侧",   type:"扬尘",    value:68,   unit:"μg/m³",  threshold:150, status:"正常", lastUpdate:"2026-06-18 10:32", trend:"down" },
  { id:"M002", name:"噪音传感器 B2",   location:"4号楼施工区",    type:"噪声",    value:82,   unit:"dB",     threshold:85,  status:"预警", lastUpdate:"2026-06-18 10:31", trend:"up" },
  { id:"M003", name:"有害气体检测 C1", location:"地下室集水坑",   type:"气体",    value:18,   unit:"ppm",    threshold:50,  status:"正常", lastUpdate:"2026-06-18 10:30", trend:"stable" },
  { id:"M004", name:"基坑沉降仪 D1",   location:"2号地块基坑北侧",type:"沉降",    value:12,   unit:"mm",     threshold:20,  status:"正常", lastUpdate:"2026-06-18 10:28", trend:"up" },
  { id:"M005", name:"扬尘监测仪 A2",   location:"施工现场南侧",   type:"扬尘",    value:198,  unit:"μg/m³",  threshold:150, status:"报警", lastUpdate:"2026-06-18 10:25", trend:"up" },
  { id:"M006", name:"噪音传感器 B3",   location:"3号楼外架区",    type:"噪声",    value:73,   unit:"dB",     threshold:85,  status:"正常", lastUpdate:"2026-06-18 10:24", trend:"stable" },
  { id:"M007", name:"水位传感器 E1",   location:"基坑集水坑",     type:"水位",    value:0.45, unit:"m",      threshold:1.5, status:"正常", lastUpdate:"2026-06-18 10:20", trend:"stable" },
  { id:"M008", name:"倾斜仪 F1",       location:"基坑支撑体系",   type:"倾斜",    value:2.1,  unit:"°",      threshold:3.0, status:"预警", lastUpdate:"2026-06-18 10:18", trend:"up" },
  { id:"M009", name:"温湿度传感器 G1", location:"焊接作业区",     type:"温湿度",  value:38,   unit:"°C",     threshold:45,  status:"正常", lastUpdate:"2026-06-18 10:15", trend:"up" },
  { id:"M010", name:"风速仪 H1",       location:"4号楼顶部",      type:"风速",    value:12.6, unit:"m/s",    threshold:15,  status:"预警", lastUpdate:"2026-06-18 10:10", trend:"up" },
  { id:"M011", name:"有害气体检测 C2", location:"管廊电缆间",     type:"气体",    value:8,    unit:"ppm",    threshold:50,  status:"正常", lastUpdate:"2026-06-18 10:08", trend:"stable" },
  { id:"M012", name:"基坑沉降仪 D2",   location:"2号地块基坑南侧",type:"沉降",    value:6,    unit:"mm",     threshold:20,  status:"正常", lastUpdate:"2026-06-18 10:05", trend:"stable" },
];
const MONITOR_ALERTS = [
  { id:"A1", level:"报警" as const, point:"扬尘监测仪 A2", msg:"PM2.5浓度198μg/m³，超过阈值150μg/m³", time:"10:25", location:"施工现场南侧" },
  { id:"A2", level:"预警" as const, point:"噪音传感器 B2",  msg:"噪音82dB，接近限值85dB",              time:"10:31", location:"4号楼施工区" },
  { id:"A3", level:"预警" as const, point:"倾斜仪 F1",      msg:"支撑体系倾斜2.1°，接近限值3.0°",     time:"10:18", location:"基坑支撑体系" },
  { id:"A4", level:"预警" as const, point:"风速仪 H1",      msg:"风速12.6m/s，高处作业风险上升",       time:"10:10", location:"4号楼顶部" },
];
const MONITOR_TREND_DATA = [
  { time:"09:00", a2:142, b2:78, f1:1.8 },
  { time:"09:15", a2:155, b2:79, f1:1.9 },
  { time:"09:30", a2:161, b2:80, f1:1.9 },
  { time:"09:45", a2:174, b2:81, f1:2.0 },
  { time:"10:00", a2:182, b2:82, f1:2.0 },
  { time:"10:15", a2:191, b2:82, f1:2.1 },
  { time:"10:30", a2:198, b2:82, f1:2.1 },
];

function MonitorView() {
  const [typeFilter, setTypeFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const types = ["全部",...Array.from(new Set(MONITOR_POINTS.map(m=>m.type)))];

  const filtered = MONITOR_POINTS.filter(m => {
    if (typeFilter!=="全部" && m.type!==typeFilter) return false;
    if (statusFilter!=="全部" && m.status!==statusFilter) return false;
    return true;
  });

  const statusColor: Record<string,{bg:string;text:string;border:string;dot:string;card:string}> = {
    "正常": { bg:"bg-green-500/10",  text:"text-green-400",  border:"border-green-500/20",  dot:"bg-green-400",  card:"border-green-500/20" },
    "预警": { bg:"bg-amber-500/10",  text:"text-amber-400",  border:"border-amber-500/20",  dot:"bg-amber-400",  card:"border-amber-500/30" },
    "报警": { bg:"bg-red-500/10",    text:"text-red-400",    border:"border-red-500/20",    dot:"bg-red-400",    card:"border-red-500/40" },
  };
  const alertLevelColor: Record<string,string> = { "报警":"text-red-400", "预警":"text-amber-400" };

  const statCards = [
    { label:"监测点总数", val:MONITOR_POINTS.length, color:"text-blue-400",  bg:"bg-blue-500/10",  border:"border-blue-500/20",  icon:<Radio size={15} className="text-blue-400"/>   },
    { label:"正常",       val:MONITOR_POINTS.filter(m=>m.status==="正常").length, color:"text-green-400", bg:"bg-green-500/10", border:"border-green-500/20", icon:<CheckSquare size={15} className="text-green-400"/> },
    { label:"预警",       val:MONITOR_POINTS.filter(m=>m.status==="预警").length, color:"text-amber-400", bg:"bg-amber-500/10", border:"border-amber-500/20", icon:<AlertTriangle size={15} className="text-amber-400"/> },
    { label:"报警",       val:MONITOR_POINTS.filter(m=>m.status==="报警").length, color:"text-red-400",   bg:"bg-red-500/10",   border:"border-red-500/20",   icon:<CircleAlert size={15} className="text-red-400"/> },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-5">
        <Breadcrumb items={[{label:"智能监测"}]}/>
        {/* Stat bar */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {statCards.map(c => (
            <div key={c.label} className={`rounded-lg border p-3.5 flex items-center gap-3 ${c.bg} ${c.border}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg} border ${c.border}`}>{c.icon}</div>
              <div>
                <p className="text-muted-foreground text-xs">{c.label}</p>
                <p className={`text-2xl font-bold ${c.color}`}>{c.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Left: monitoring grid */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Filters */}
            <div className="bg-card rounded-lg border border-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-md border border-border bg-secondary text-foreground focus:outline-none cursor-pointer">
                    {types.map(t=><option key={t} value={t}>类型：{t}</option>)}
                  </select>
                  <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-md border border-border bg-secondary text-foreground focus:outline-none cursor-pointer">
                    {["全部","正常","预警","报警"].map(s=><option key={s} value={s}>状态：{s}</option>)}
                  </select>
                </div>
                <span className="text-xs text-muted-foreground">最后同步：10:32</span>
              </div>
              {/* Monitor point cards grid */}
              <div className="grid grid-cols-3 gap-3 p-4">
                {filtered.map(m => {
                  const sc = statusColor[m.status];
                  const pct = Math.min(100, Math.round((m.value / m.threshold) * 100));
                  return (
                    <div key={m.id} className={`rounded-lg border p-3 bg-muted/30 ${sc.card} hover:bg-muted/50 transition-colors cursor-pointer`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs font-medium text-foreground leading-tight">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-0.5">
                            <MapPin size={9}/>{m.location}
                          </p>
                        </div>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border flex items-center gap-0.5 ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1 h-1 rounded-full ${sc.dot} ${m.status==="报警"?"animate-pulse":""}`}/>
                          {m.status}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className={`text-xl font-bold ${m.status==="正常"?"text-foreground":sc.text}`}>
                          {m.value}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{m.unit}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">/{m.threshold}{m.unit}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${m.status==="正常"?"bg-green-400":m.status==="预警"?"bg-amber-400":"bg-red-400"}`}
                          style={{width:`${pct}%`}}/>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px] text-muted-foreground">{m.type}</span>
                        <span className="text-[9px] text-muted-foreground">{m.lastUpdate.split(" ")[1]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Trend chart */}
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-xs font-medium text-foreground mb-3">异常监测点趋势</p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart id="monitor-trend" data={MONITOR_TREND_DATA} margin={{top:4,right:4,bottom:0,left:-20}}>
                  <XAxis key="ax-x" dataKey="time" tick={{fontSize:10,fill:"#7a91a8"}} axisLine={false} tickLine={false}/>
                  <YAxis key="ax-y" tick={{fontSize:10,fill:"#7a91a8"}} axisLine={false} tickLine={false}/>
                  <Tooltip key="tip" contentStyle={{background:"#132032",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,fontSize:11}}
                    labelStyle={{color:"#e8edf2"}} itemStyle={{color:"#e8edf2"}}/>
                  <Line key="line-a2" type="monotone" dataKey="a2" name="扬尘A2(μg/m³)" stroke="#f87171" strokeWidth={1.5} dot={false}/>
                  <Line key="line-b2" type="monotone" dataKey="b2" name="噪音B2(dB)"    stroke="#fbbf24" strokeWidth={1.5} dot={false}/>
                  <Legend key="leg" iconType="line" iconSize={10} wrapperStyle={{fontSize:10,color:"#7a91a8"}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: alerts list */}
          <div className="flex flex-col gap-4">
            <div className="bg-card rounded-lg border border-border flex-1">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"/>实时告警
                </p>
                <span className="text-[10px] text-muted-foreground">{MONITOR_ALERTS.length} 条</span>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {MONITOR_ALERTS.map(a => (
                  <div key={a.id} className={`rounded-lg border p-3 ${a.level==="报警"?"bg-red-500/8 border-red-500/20":"bg-amber-500/8 border-amber-500/20"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${a.level==="报警"?"bg-red-500/20 text-red-400":"bg-amber-500/20 text-amber-400"}`}>{a.level}</span>
                      <span className="text-[10px] text-muted-foreground">{a.time}</span>
                    </div>
                    <p className="text-xs font-medium text-foreground">{a.point}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{a.msg}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><MapPin size={9}/>{a.location}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="text-[10px] text-blue-400 hover:text-blue-300">查看详情</button>
                      <button className="text-[10px] text-primary hover:text-primary/80">处理告警</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick stats by type */}
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-xs font-medium text-foreground mb-3">监测类型分布</p>
              <div className="flex flex-col gap-2">
                {Array.from(new Set(MONITOR_POINTS.map(m=>m.type))).map(t => {
                  const pts = MONITOR_POINTS.filter(m=>m.type===t);
                  const hasAlarm = pts.some(p=>p.status==="报警");
                  const hasWarn  = pts.some(p=>p.status==="预警");
                  return (
                    <div key={t} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground font-medium">{pts.length}个</span>
                        {hasAlarm&&<span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>}
                        {!hasAlarm&&hasWarn&&<span className="w-1.5 h-1.5 rounded-full bg-amber-400"/>}
                        {!hasAlarm&&!hasWarn&&<span className="w-1.5 h-1.5 rounded-full bg-green-400"/>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────
function NavItem({label,active,onClick,deep,icon}:{label:string;active:boolean;onClick:()=>void;deep?:boolean;icon?:React.ReactNode}){
  return (
    <button onClick={onClick} className="flex items-center w-full text-left text-xs transition-all rounded-sm"
      style={{padding:deep?"5px 12px 5px 20px":"6px 12px",background:active?ACTIVE_BG:"transparent",color:active?"white":"rgba(255,255,255,0.55)",fontWeight:active?500:400}}
      onMouseEnter={e=>{if(!active)(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.05)";}}
      onMouseLeave={e=>{if(!active)(e.currentTarget as HTMLElement).style.background="transparent";}}>
      {icon&&<span className="mr-1.5">{icon}</span>}
      {!icon&&<span className="mr-1.5 opacity-40">{deep?"·":"›"}</span>}
      {label}
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]     = useState<ActiveView>({ type:"gismap" });
  const [workOpen, setWorkOpen] = useState(true);
  const [hazOpen,  setHazOpen]  = useState(false);
  const [majOpen,  setMajOpen]  = useState(false);
  const [surveys,  setSurveys]  = useState<Survey[]>(PRESET_SURVEYS);
  const [editSurvey, setEditSurvey] = useState<Survey|null>(null);
  const [formView, setFormView]     = useState<"list"|"editor">("list");

  function nav(v:ActiveView){ setView(v); if(v.type!=="forms"){setFormView("list");setEditSurvey(null);} }
  function createSurvey(){const s:Survey={id:fuid(),title:"新建表单",description:"",questions:[],submitLabel:"提交",status:"draft",createdAt:new Date().toISOString().slice(0,10),responses:0};setSurveys(p=>[s,...p]);setEditSurvey(s);setFormView("editor");}
  function saveSurvey(u:Survey){setSurveys(p=>p.map(s=>s.id===u.id?u:s));setFormView("list");setEditSurvey(null);}

  const breadLabel = view.type==="gismap"?"安全作业一张图":view.type==="overview"?"作业概览":view.type==="category"?{hazardous:"危险作业",cross:"交叉作业",major:"危大工程"}[view.cat]:view.type==="worklist"||view.type==="workcreate"?view.workName:view.type==="worklistall"?view.workType:view.type==="workdetail"?view.record.type:view.type==="analysis"?"辅助分析":view.type==="params"?"参数配置":view.type==="hazard"?"隐患排查":view.type==="monitor"?"智能监测":"自定义表单";

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{fontFamily:"'Inter','Noto Sans SC',sans-serif"}}>
      {/* Sidebar */}
      <aside className="w-[185px] flex-shrink-0 flex flex-col overflow-y-auto" style={{background:SIDEBAR_BG}}>
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b flex-shrink-0" style={{borderColor:"rgba(255,255,255,0.08)"}}>
          <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-500">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6l-8-4z"/></svg>
          </div>
          <span className="text-white text-xs font-semibold leading-tight">安全生产统一<br/>智管平台</span>
        </div>
        <nav className="flex-1 py-2 text-xs overflow-y-auto">
          {/* 我的待办 */}
          <button onClick={()=>nav({type:"todo" as any})}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 transition-colors"
            style={{background:(view as any).type==="todo"?ACTIVE_BG:"transparent",color:(view as any).type==="todo"?"white":"rgba(255,255,255,0.7)"}}
            onMouseEnter={e=>{if((view as any).type!=="todo")(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";}}
            onMouseLeave={e=>{if((view as any).type!=="todo")(e.currentTarget as HTMLElement).style.background="transparent";}}>
            <ClipboardList size={14}/>我的待办
          </button>
          {/* 隐患排查 */}
          <button onClick={()=>nav({type:"hazard"})} className="flex items-center gap-2.5 w-full px-4 py-2.5 transition-colors"
            style={{background:view.type==="hazard"?ACTIVE_BG:"transparent",color:view.type==="hazard"?"white":"rgba(255,255,255,0.7)"}}
            onMouseEnter={e=>{if(view.type!=="hazard")(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";}}
            onMouseLeave={e=>{if(view.type!=="hazard")(e.currentTarget as HTMLElement).style.background="transparent";}}>
            <AlertTriangle size={14}/>隐患排查
          </button>
          {/* 作业管理 */}
          <button onClick={()=>setWorkOpen(o=>!o)} className="flex items-center justify-between w-full px-4 py-2.5" style={{color:"white",background:"rgba(255,255,255,0.06)"}}>
            <div className="flex items-center gap-2.5"><FileText size={14}/>作业管理</div>
            <ChevronDown size={11} style={{color:"rgba(255,255,255,0.4)",transform:workOpen?"rotate(0deg)":"rotate(-90deg)",transition:"transform 0.2s"}}/>
          </button>
          {workOpen && (
            <div className="ml-5 border-l" style={{borderColor:"rgba(255,255,255,0.08)"}}>
              <NavItem label="作业概览" active={view.type==="overview"} onClick={()=>nav({type:"overview"})}/>
              <NavItem label="常规作业" active={view.type==="worklistall"&&view.workType==="常规作业"} onClick={()=>nav({type:"worklistall",workType:"常规作业"})}/>
              <button onClick={()=>setHazOpen(o=>!o)} className="flex items-center justify-between w-full px-3 py-2" style={{color:"rgba(255,255,255,0.7)"}}>
                <div className="flex items-center gap-1.5"><span>危险作业</span></div>
                <ChevronDown size={10} style={{color:"rgba(255,255,255,0.3)",transform:hazOpen?"rotate(0deg)":"rotate(-90deg)",transition:"transform 0.2s"}}/>
              </button>
              {hazOpen&&HAZARDOUS_TYPES.map(wt=>(
                <NavItem key={wt.id} label={wt.name} active={view.type==="worklistall"&&view.workType===wt.name} onClick={()=>nav({type:"worklistall",workType:wt.name})} deep/>
              ))}
              <NavItem label="交叉作业" active={(view.type==="category"&&view.cat==="cross")||(view.type==="worklist"&&view.workName==="交叉作业")} onClick={()=>nav({type:"category",cat:"cross"})}/>
              <button onClick={()=>setMajOpen(o=>!o)} className="flex items-center justify-between w-full px-3 py-2" style={{color:"rgba(255,255,255,0.7)"}}>
                <div className="flex items-center gap-1.5"><span>危大工程</span></div>
                <ChevronDown size={10} style={{color:"rgba(255,255,255,0.3)",transform:majOpen?"rotate(0deg)":"rotate(-90deg)",transition:"transform 0.2s"}}/>
              </button>
              {majOpen&&MAJOR_TYPES.map(wt=>(
                <NavItem key={wt.id} label={wt.name} active={view.type==="worklistall"&&view.workType===wt.name} onClick={()=>nav({type:"worklistall",workType:wt.name})} deep/>
              ))}
            </div>
          )}
          {/* 作业监控 */}
          <button onClick={()=>nav({type:"gismap"})}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 transition-colors"
            style={{background:view.type==="gismap"?ACTIVE_BG:"transparent",color:view.type==="gismap"?"white":"rgba(255,255,255,0.7)"}}
            onMouseEnter={e=>{if(view.type!=="gismap")(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";}}
            onMouseLeave={e=>{if(view.type!=="gismap")(e.currentTarget as HTMLElement).style.background="transparent";}}>
            <Activity size={14}/>作业监控
          </button>
          {/* 智能监测 */}
          <button onClick={()=>nav({type:"monitor"})} className="flex items-center gap-2.5 w-full px-4 py-2.5 transition-colors"
            style={{background:view.type==="monitor"?ACTIVE_BG:"transparent",color:view.type==="monitor"?"white":"rgba(255,255,255,0.7)"}}
            onMouseEnter={e=>{if(view.type!=="monitor")(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";}}
            onMouseLeave={e=>{if(view.type!=="monitor")(e.currentTarget as HTMLElement).style.background="transparent";}}>
            <Radio size={14}/>智能监测
          </button>
          {/* 辅助分析 */}
          <button onClick={()=>nav({type:"analysis"})} className="flex items-center gap-2.5 w-full px-4 py-2.5 transition-colors"
            style={{background:view.type==="analysis"?ACTIVE_BG:"transparent",color:view.type==="analysis"?"white":"rgba(255,255,255,0.7)"}}
            onMouseEnter={e=>{if(view.type!=="analysis")(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";}}
            onMouseLeave={e=>{if(view.type!=="analysis")(e.currentTarget as HTMLElement).style.background="transparent";}}>
            <BarChart3 size={14}/>辅助分析
          </button>
          {/* 参数配置 */}
          <button onClick={()=>nav({type:"params"})} className="flex items-center gap-2.5 w-full px-4 py-2.5 transition-colors"
            style={{background:view.type==="params"?ACTIVE_BG:"transparent",color:view.type==="params"?"white":"rgba(255,255,255,0.7)"}}
            onMouseEnter={e=>{if(view.type!=="params")(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.07)";}}
            onMouseLeave={e=>{if(view.type!=="params")(e.currentTarget as HTMLElement).style.background="transparent";}}>
            <Settings size={14}/>参数配置
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#dbe5f6]">
        <header className="flex-shrink-0 flex items-center justify-between px-5 h-11 border-b" style={{background:HEADER_BG,borderColor:"rgba(255,255,255,0.08)"}}>
          <div className="flex items-center gap-2 text-xs font-bold text-white tracking-wide">
            <span className="text-red-500 font-black">★</span> 安全生产鞍钢项目
          </div>
          <div className="flex items-center gap-3">
            <button className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 text-white/80 hover:bg-white/20">
              <Globe size={13}/>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-600/80 text-white text-xs">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center"><User size={10} className="text-white"/></div>
              <span>项目 安全生产鞍钢...</span>
            </div>
            <span className="text-white/80 text-xs font-medium ml-1">林安全</span>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
          {(view.type as any)==="todo"  && <TodoListView onNavigate={nav}/>}
          {view.type==="gismap"      && <GisMapView onNavigate={nav}/>}
          {view.type==="overview"    && <OverviewDashboard onNavigate={nav}/>}
          {view.type==="category"    && <CategoryView cat={view.cat} onNavigate={nav}/>}
          {view.type==="worklistall" && <WorkListAllView workType={view.workType} onNavigate={nav}/>}
          {view.type==="worklist"    && <WorkTypeListView workName={view.workName} cat={view.cat} onNavigate={nav}/>}
          {view.type==="workdetail" && <WorkDetailView record={view.record} onNavigate={nav}/>}
          {view.type==="workcreate" && <WorkCreateForm workName={view.workName} cat={view.cat} onNavigate={nav}/>}
          {view.type==="analysis" && <AnalysisView/>}
          {view.type==="params"   && <ParamConfigView/>}
          {view.type==="hazard"   && <HazardView onNavigate={nav}/>}
          {view.type==="monitor"  && <MonitorView/>}
          {view.type==="forms" && (
            formView==="editor"&&editSurvey
              ? <FormBuilder survey={editSurvey} onBack={()=>{setFormView("list");setEditSurvey(null);}} onSave={saveSurvey}/>
              : <FormListView surveys={surveys} onEdit={s=>{setEditSurvey(s);setFormView("editor");}} onCreate={createSurvey}/>
          )}
        </div>
      </div>
    </div>
  );
}
