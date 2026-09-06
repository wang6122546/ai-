import { useState } from 'react'

// ── Design tokens (locked) ────────────────────────────────────────────────────
// Primary: #1565C0 | Warning: #E65100 | Success: #2E7D32 | Danger: #C62828
// Text-primary: #1A2332 | Text-secondary: #3D4F63 | Text-muted: #9EAAB8
// Surface: #F5F7FA | Card-bg: #fff | Border: #E0E6ED
// Card: borderRadius 14, shadow 0 2px 12px rgba(0,0,0,0.08), marginInline 12, padding 16
// Spacing base: 4px

// ── Shared primitives ─────────────────────────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{ width: 3, height: 16, background: '#1565C0', borderRadius: 2 }} />
      <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332' }}>{title}</span>
    </div>
  )
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color, background: bg, borderRadius: 6, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{label}</span>
  )
}

function PhoneBtn() {
  return (
    <div style={{ width: 28, height: 28, borderRadius: 14, background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 2h3l1 3-1.5 1A7 7 0 007.5 9.5l1-1.5 3 1v3A10 10 0 012.5 2z" fill="#1565C0"/>
      </svg>
    </div>
  )
}

function StatusBar({ dark = true }: { dark?: boolean }) {
  const c = dark ? '#fff' : '#1A2332'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 4px', fontSize: 12, fontWeight: 600, color: c }}>
      <span>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <rect x="0" y="6" width="3" height="6" rx="0.5" fill={c}/>
          <rect x="4.5" y="4" width="3" height="8" rx="0.5" fill={c}/>
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill={c}/>
          <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill={c}/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path d="M8 2.5C5.3 2.5 2.9 3.7 1.3 5.6L0 4.3C2 2 4.8.5 8 .5s6 1.5 8 3.8L14.7 5.6C13.1 3.7 10.7 2.5 8 2.5z" fill={c}/>
          <path d="M8 6C6.3 6 4.8 6.8 3.8 8L2.5 6.7C3.8 5.1 5.8 4 8 4s4.2 1.1 5.5 2.7L12.2 8C11.2 6.8 9.7 6 8 6z" fill={c}/>
          <circle cx="8" cy="10" r="1.5" fill={c}/>
        </svg>
        <div style={{ width: 22, height: 11, border: `1.5px solid ${c}`, borderRadius: 2.5, padding: '1px 1.5px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '85%', height: '100%', background: c, borderRadius: 1 }}/>
        </div>
      </div>
    </div>
  )
}

// ── Todo icon components (circle style, matching original) ────────────────────

function TodoIconCircle({ children, count }: { children: React.ReactNode; count: number }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: '#F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
      {count > 0 && (
        <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 16, height: 16, background: '#FF3B30', borderRadius: 8, fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  )
}

// SVG icon helpers
const I = {
  riskAssess: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="2" y="3" width="16" height="20" rx="2" fill="#E3F2FD" stroke="#1565C0" strokeWidth="1.4"/>
      <path d="M5 9h10M5 13h10M5 17h6" stroke="#1565C0" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="20" cy="20" r="4.5" fill="#E65100"/>
      <path d="M20 17.5v3M20 22h.01" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  safeMeasure: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 2.5L3.5 6.5v7.5c0 5 3.8 9.5 9.5 10.5 5.7-1 9.5-5.5 9.5-10.5V6.5L13 2.5z" fill="#E3F2FD" stroke="#1565C0" strokeWidth="1.4"/>
      <path d="M9 13l3 3 5.5-5.5" stroke="#1565C0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  training: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="2" y="4" width="22" height="15" rx="2" fill="#E3F2FD" stroke="#1565C0" strokeWidth="1.4"/>
      <path d="M9 23h8M13 19v4" stroke="#1565C0" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M7.5 11l3.5 2.5L7.5 16V11zM16 9h4M16 13h4" stroke="#1565C0" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  workApproval: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="3" y="2" width="15" height="19" rx="2" fill="#E3F2FD" stroke="#1565C0" strokeWidth="1.4"/>
      <path d="M7 8h8M7 12h8M7 16h5" stroke="#1565C0" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="21" cy="21" r="4" fill="#2E7D32"/>
      <path d="M18.8 21l1.6 1.6 2.8-2.8" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  hazard: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M13 2.5L1.5 23h23L13 2.5z" fill="#FFF3E0" stroke="#E65100" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M13 11v5" stroke="#E65100" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="13" cy="19" r="1" fill="#E65100"/>
    </svg>
  ),
  siteImpl: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="1.5" y="13" width="23" height="11" rx="1.5" fill="#E3F2FD" stroke="#1565C0" strokeWidth="1.4"/>
      <path d="M7.5 13V7.5a5.5 5.5 0 0111 0V13" stroke="#1565C0" strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="10" y="17" width="6" height="5" rx="1" fill="#1565C0"/>
    </svg>
  ),
  acceptApproval: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="10.5" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="1.4"/>
      <path d="M8 13l3.5 3.5L18 9" stroke="#2E7D32" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  incident: (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="10.5" fill="#FFEBEE" stroke="#C62828" strokeWidth="1.4"/>
      <path d="M13 7.5v6" stroke="#C62828" strokeWidth="1.7" strokeLinecap="round"/>
      <circle cx="13" cy="17.5" r="1.2" fill="#C62828"/>
    </svg>
  ),
}

// Work type icons (monochrome, matching original system)
function WorkTypeIcon({ type, color }: { type: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    '常规作业': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="4" y="5" width="18" height="21" rx="2.5" fill={`${color}22`} stroke={color} strokeWidth="1.5"/>
        <path d="M8 11h10M8 16h10M8 21h7" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    '动火作业': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M15 3c0 4-6 7-6 13a6 6 0 0012 0c0-3-1.5-5-3-7-1 2.5-3 3.5-3 5a3 3 0 006 0c0-2-3-4-2.5-7.5" fill={`${color}22`} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    '受限空间': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <ellipse cx="15" cy="11" rx="9" ry="4.5" fill={`${color}22`} stroke={color} strokeWidth="1.5"/>
        <path d="M6 11v9a9 4.5 0 0018 0v-9" stroke={color} strokeWidth="1.5"/>
        <path d="M11 17l2.5 2.5 5.5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    '临时用电': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M17 3l-8 13h8l-6 11 14-17h-8L17 3z" fill={`${color}22`} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    '高处作业': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="4" y="22" width="22" height="5" rx="1.5" fill={`${color}22`} stroke={color} strokeWidth="1.5"/>
        <path d="M15 22V8M10 13l5-5 5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    '起重吊装': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M7 6h16M15 6v7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 13h12l-1.5 8H10.5L9 13z" fill={`${color}22`} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    '破土作业': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M3 23h24" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 23v-5l4-8h8l4 8v5" fill={`${color}22`} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 23v-6h6v6" stroke={color} strokeWidth="1.4"/>
      </svg>
    ),
    '射线作业': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="4" fill={`${color}22`} stroke={color} strokeWidth="1.5"/>
        <path d="M15 4v4M15 22v4M4 15h4M22 15h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8.5 8.5l2.8 2.8M18.7 18.7l2.8 2.8M8.5 21.5l2.8-2.8M18.7 11.3l2.8-2.8" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    '危化品作业': (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <path d="M11 3h8v8l5 12H6L11 11V3z" fill={`${color}22`} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="13" cy="19" r="1.5" fill={color}/>
        <circle cx="17" cy="22" r="1" fill={color}/>
      </svg>
    ),
  }
  return <>{icons[type] ?? icons['常规作业']}</>
}

// ── Data ──────────────────────────────────────────────────────────────────────

const todoItems = [
  { id: 1, label: '风险评估', icon: I.riskAssess, count: 3 },
  { id: 2, label: '安全措施', icon: I.safeMeasure, count: 2 },
  { id: 3, label: '培训考核', icon: I.training, count: 7 },
  { id: 4, label: '作业审批', icon: I.workApproval, count: 12 },
  { id: 5, label: '隐患排查', icon: I.hazard, count: 2 },
  { id: 6, label: '现场实施', icon: I.siteImpl, count: 0 },
  { id: 7, label: '验收审批', icon: I.acceptApproval, count: 5 },
  { id: 8, label: '事件处置', icon: I.incident, count: 1 },
]

const workTypes = [
  { id: 1, label: '常规作业', color: '#1565C0' },
  { id: 2, label: '动火作业', color: '#E65100' },
  { id: 3, label: '受限空间', color: '#6A1B9A' },
  { id: 4, label: '临时用电', color: '#F9A825' },
  { id: 5, label: '高处作业', color: '#00838F' },
  { id: 6, label: '起重吊装', color: '#2E7D32' },
  { id: 7, label: '破土作业', color: '#558B2F' },
  { id: 8, label: '射线作业', color: '#AD1457' },
  { id: 9, label: '危化品作业', color: '#4527A0' },
]

type WorkOrder = {
  id: string
  title: string
  type: string
  typeColor: string
  typeBg: string
  level: string
  levelColor: string
  levelBg: string
  startTime: string
  endTime: string
  location: string
  leader: string
  guardian: string
  guardianExtra?: number
  progressLabel: string   // text label matching original
  status: '待审批' | '进行中' | '已完成' | '已关闭'
  progress: number
  actionLabel: string
}

const workOrders: WorkOrder[] = [
  {
    id: 'GC20260818001', title: '常压塔顶冷凝器动火焊接作业',
    type: '动火作业', typeColor: '#E65100', typeBg: '#FFF3E0',
    level: '一级', levelColor: '#C62828', levelBg: '#FFEBEE',
    startTime: '2026-08-18 08:00', endTime: '2026-08-18 18:00',
    location: '炼油一车间 / 常压塔顶',
    leader: '张建国', guardian: '李明辉', guardianExtra: 1,
    progressLabel: '风险评估', status: '待审批', progress: 10, actionLabel: '风险评估',
  },
  {
    id: 'GC20260818002', title: '脱乙烷塔底泵坑受限空间清淤',
    type: '受限空间', typeColor: '#6A1B9A', typeBg: '#F3E5F5',
    level: '二级', levelColor: '#E65100', levelBg: '#FFF3E0',
    startTime: '2026-08-18 09:00', endTime: '2026-08-19 17:00',
    location: '炼油二车间 / 脱乙烷装置',
    leader: '王栋梁', guardian: '赵文涛',
    progressLabel: '接收交底', status: '进行中', progress: 45, actionLabel: '气体检测',
  },
  {
    id: 'GC20260817015', title: '催化裂化装置高空管道更换',
    type: '高处作业', typeColor: '#00838F', typeBg: '#E0F7FA',
    level: '二级', levelColor: '#E65100', levelBg: '#FFF3E0',
    startTime: '2026-08-17 07:30', endTime: '2026-08-17 16:30',
    location: '炼油三车间 / 催化裂化装置',
    leader: '刘志远', guardian: '陈大明',
    progressLabel: '完工验收', status: '已完成', progress: 100, actionLabel: '查看详情',
  },
  {
    id: 'GC20260818003', title: '加氢反应器临时配电箱安装',
    type: '临时用电', typeColor: '#F9A825', typeBg: '#FFFDE7',
    level: '三级', levelColor: '#2E7D32', levelBg: '#E8F5E9',
    startTime: '2026-08-18 13:00', endTime: '2026-08-18 17:00',
    location: '炼油四车间 / 加氢装置',
    leader: '孙海波', guardian: '周建平',
    progressLabel: '安全措施', status: '待审批', progress: 0, actionLabel: '安全措施',
  },
  {
    id: 'GC20260817022', title: '污水处理场管道破土开挖',
    type: '破土作业', typeColor: '#558B2F', typeBg: '#F1F8E9',
    level: '三级', levelColor: '#2E7D32', levelBg: '#E8F5E9',
    startTime: '2026-08-17 08:00', endTime: '2026-08-18 12:00',
    location: '公用工程 / 污水处理场',
    leader: '吴国强', guardian: '郑凯', guardianExtra: 2,
    progressLabel: '现场实施', status: '进行中', progress: 68, actionLabel: '现场签到',
  },
]

const statusConfig: Record<WorkOrder['status'], { color: string; bg: string }> = {
  '待审批': { color: '#E65100', bg: '#FFF3E0' },
  '进行中': { color: '#1565C0', bg: '#E3F2FD' },
  '已完成': { color: '#2E7D32', bg: '#E8F5E9' },
  '已关闭': { color: '#9EAAB8', bg: '#F5F7FA' },
}

// ── Home screen ───────────────────────────────────────────────────────────────

function HomeBanner({ onSearch }: { onSearch: () => void }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1E88E5 100%)', paddingBottom: 20 }}>
      <StatusBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><path d="M10 2L3 7v11h5v-6h4v6h5V7L10 2z"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.2 }}>当前位置</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>中石化炼化事业部</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
              <path d="M9 1.5A5.5 5.5 0 003.5 7c0 2-.8 3.8-2 5h15c-1.2-1.2-2-3-2-5A5.5 5.5 0 009 1.5z"/>
              <path d="M7 14a2 2 0 004 0" fill="white"/>
            </svg>
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#FF3B30', borderRadius: 4, border: '1.5px solid #1565C0' }}/>
          </button>
          <button style={{ width: 36, height: 36, borderRadius: 18, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #90CAF9, #1565C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>张</div>
          </button>
        </div>
      </div>
      {/* Search */}
      <div style={{ padding: '8px 16px 0' }}>
        <button onClick={onSearch} style={{ width: '100%', background: 'rgba(255,255,255,0.18)', borderRadius: 10, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer' }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4"/>
            <path d="M9.5 9.5l3.5 3.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>搜索作业、风险、人员...</span>
        </button>
      </div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '16px 16px 0' }}>
        {[{ label: '今日作业', value: '24', unit: '项' }, { label: '待审批', value: '12', unit: '项' }, { label: '隐患待处理', value: '5', unit: '个' }].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 10, padding: '10px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{s.value}<span style={{ fontSize: 12, fontWeight: 400 }}>{s.unit}</span></div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TodoModule({ onTodoClick }: { onTodoClick: (title: string) => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, marginTop: -14, marginInline: 12, padding: '16px 0 12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 16, background: '#1565C0', borderRadius: 2 }}/>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332' }}>我的待办</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: '#1565C0', borderRadius: 10, padding: '1px 6px' }}>30</span>
        </div>
        <span style={{ fontSize: 12, color: '#1565C0' }}>查看全部 ›</span>
      </div>
      <div className="scrollbar-hide" style={{ display: 'flex', gap: 4, padding: '0 12px 4px', overflowX: 'auto' }}>
        {todoItems.map(item => (
          <button key={item.id} onClick={() => onTodoClick(item.label)} style={{ flexShrink: 0, width: 68, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}>
            <TodoIconCircle count={item.count}>{item.icon}</TodoIconCircle>
            <span style={{ fontSize: 11, color: '#3D4F63', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function WorkManagementModule({ onNavigate, onWorkTypeClick }: { onNavigate: () => void; onWorkTypeClick: (type: string) => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, marginTop: 12, marginInline: 12, padding: '16px 16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionLabel title="作业管理" />
        <span style={{ fontSize: 12, color: '#1565C0', cursor: 'pointer' }} onClick={onNavigate}>更多 ›</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 4px' }}>
        {workTypes.map(wt => (
          <button key={wt.id} onClick={() => onWorkTypeClick(wt.label)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, padding: '8px 2px', borderRadius: 12 }}
            onMouseEnter={e => (e.currentTarget.style.background = `${wt.color}0D`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: `${wt.color}14`, border: `1.5px solid ${wt.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WorkTypeIcon type={wt.label} color={wt.color} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#1A2332', textAlign: 'center', lineHeight: 1.3 }}>{wt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RecentActivity({ onViewDetail }: { onViewDetail: (id: string) => void }) {
  const items = [
    { title: '动火作业申请单', no: 'GC20260818001', status: '待审批' as const, time: '10分钟前' },
    { title: '受限空间进入许可', no: 'GC20260818002', status: '进行中' as const, time: '1小时前' },
    { title: '高处作业许可证', no: 'GC20260817015', status: '已完成' as const, time: '昨天' },
  ]
  return (
    <div style={{ background: '#fff', borderRadius: 14, marginTop: 12, marginInline: 12, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionLabel title="最近作业" />
        <span style={{ fontSize: 12, color: '#1565C0' }}>全部 ›</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(item => (
          <button key={item.no} onClick={() => onViewDetail(item.no)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#9EAAB8', marginTop: 2 }}>{item.no} · {item.time}</div>
            </div>
            <Badge label={item.status} color={statusConfig[item.status].color} bg={statusConfig[item.status].bg} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Work List screen ──────────────────────────────────────────────────────────

const LIST_TABS = ['全部', '待审批', '进行中', '已完成']

// Card matching original: row-based label:value layout
function WorkOrderCard({ order, onPress }: { order: WorkOrder; onPress: () => void }) {
  const sc = statusConfig[order.status]
  const isActive = order.status === '待审批' || order.status === '进行中'
  return (
    <div style={{ background: '#fff', borderRadius: 14, marginInline: 12, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      {/* Card header */}
      <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332', lineHeight: 1.4, flex: 1 }}>{order.title}</span>
        <Badge label={order.type} color={order.typeColor} bg={order.typeBg} />
      </div>
      {/* Divider */}
      <div style={{ height: 1, background: '#F0F2F5', marginInline: 16 }}/>
      {/* Info rows — matching original layout */}
      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ fontSize: 13, color: '#3D4F63', marginBottom: 10 }}>
          {order.startTime}~{order.endTime}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#9EAAB8' }}>作业负责人</span>
          <span style={{ fontSize: 13, color: '#1A2332', fontWeight: 500 }}>{order.leader}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#9EAAB8' }}>作业监护人</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 13, color: '#1A2332', fontWeight: 500 }}>{order.guardian}</span>
            {order.guardianExtra && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 12, color: '#1565C0', fontWeight: 600 }}>+{order.guardianExtra}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5l3 3 3-3" stroke="#1565C0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: '#9EAAB8' }}>作业进度</span>
          <span style={{ fontSize: 13, color: '#1A2332', fontWeight: 500 }}>{order.progressLabel}</span>
        </div>
        {order.status === '进行中' && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ height: 4, background: '#E3F2FD', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${order.progress}%`, background: '#1565C0', borderRadius: 2 }}/>
            </div>
          </div>
        )}
      </div>
      {/* Action row — divs styled as buttons to avoid nested <button> */}
      <div style={{ padding: '4px 16px 14px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {isActive ? (
          <>
            <div role="button" tabIndex={0} onClick={onPress} onKeyDown={e => e.key === 'Enter' && onPress()} style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #1565C0', background: 'none', fontSize: 13, fontWeight: 500, color: '#1565C0', cursor: 'pointer' }}>
              查看详情
            </div>
            <div role="button" tabIndex={0} style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #1565C0', background: '#EBF3FF', fontSize: 13, fontWeight: 600, color: '#1565C0', cursor: 'pointer' }}>
              {order.actionLabel}
            </div>
          </>
        ) : (
          <div role="button" tabIndex={0} onClick={onPress} onKeyDown={e => e.key === 'Enter' && onPress()} style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #E0E6ED', background: 'none', fontSize: 13, fontWeight: 500, color: '#6B7A8D', cursor: 'pointer' }}>
            查看详情
          </div>
        )}
      </div>
    </div>
  )
}

// ── TodoListScreen ────────────────────────────────────────────────────────────

function TodoListScreen({ title, onBack }: { title: string; onBack: () => void }) {
  const [state, setState] = useState<'pending' | 'empty' | 'error'>('pending')
  const tasks = [
    { id: 'GC20260818001', name: '常压塔顶冷凝器动火焊接作业', meta: '一级动火 · 炼油一车间', time: '今日 10:30 前', owner: '张建国' },
    { id: 'SX20260818003', name: '脱乙烷塔底泵坑清淤作业', meta: '受限空间 · 设备检修部', time: '今日 14:00 前', owner: '王海峰' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F0F2F5' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1E88E5 100%)', paddingBottom: 16 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 16px 0', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{title}</span>
        </div>
      </div>

      <div style={{ background: '#fff', display: 'flex', borderBottom: '1px solid #E0E6ED' }}>
        {([['pending','待处理'],['empty','已处理'],['error','异常状态']] as const).map(([key,label]) => <button key={key} onClick={() => setState(key)} style={{ flex: 1, padding: '11px 0', border: 0, background: 'none', color: state === key ? '#1565C0' : '#6B7A8D', fontWeight: state === key ? 700 : 400 }}>{label}{state === key && <div style={{ height: 2, background: '#1565C0', margin: '8px 28px -11px' }}/>}</button>)}
      </div>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', paddingTop: 12 }}>
        {state === 'pending' && tasks.map(t => <div key={t.id} style={{ margin: '0 12px 10px', padding: 16, borderRadius: 14, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><b style={{ fontSize: 15, color: '#1A2332' }}>{t.name}</b><Badge label={title} color="#E65100" bg="#FFF3E0" /></div>
          <div style={{ fontSize: 12, color: '#6B7A8D', marginTop: 10 }}>{t.meta}</div><div style={{ fontSize: 12, color: '#6B7A8D', marginTop: 7 }}>负责人：{t.owner}　截止：<span style={{ color: '#C62828' }}>{t.time}</span></div>
          <button style={{ marginTop: 12, width: '100%', padding: 9, border: 0, borderRadius: 8, color: '#fff', background: '#1565C0', fontWeight: 700 }}>立即处理</button>
        </div>)}
        {state !== 'pending' && <div style={{ textAlign: 'center', padding: '64px 24px 16px' }}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ opacity: 0.25 }}>
            <rect x="10" y="8" width="52" height="56" rx="6" fill="#9EAAB8"/>
            <rect x="20" y="24" width="32" height="3" rx="1.5" fill="#fff"/>
            <rect x="20" y="33" width="32" height="3" rx="1.5" fill="#fff"/>
            <rect x="20" y="42" width="20" height="3" rx="1.5" fill="#fff"/>
          </svg>
          <div style={{ fontSize: 14, color: state === 'error' ? '#C62828' : '#9EAAB8', marginTop: 12 }}>{state === 'error' ? '数据加载失败，请检查网络后重试' : '暂无内容'}</div>
          {state === 'error' && <button onClick={() => setState('pending')} style={{ marginTop: 16, padding: '8px 24px', border: '1px solid #1565C0', borderRadius: 18, background: '#fff', color: '#1565C0' }}>重新加载</button>}
        </div>}
        <div style={{ textAlign: 'center', padding: '16px 0 24px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <div style={{ flex: 1, height: 1, background: '#E0E6ED', maxWidth: 60 }}/>
          <span style={{ fontSize: 12, color: '#9EAAB8' }}>已加载完毕</span>
          <div style={{ flex: 1, height: 1, background: '#E0E6ED', maxWidth: 60 }}/>
        </div>
      </div>
    </div>
  )
}

// ── WorkTypeListScreen ────────────────────────────────────────────────────────

const ROLE_TABS = ['我申请的作业', '我参与的作业', '全部作业']
const ROLE_TAB_BADGES = [1, 2, 18]
const STATUS_TABS = ['申请中', '作业中', '已完成', '作废']

type WorkTypeOrder = {
  id: string; title: string; type: string; typeColor: string; typeBg: string;
  level: string; startTime: string; endTime: string;
  workUnit: string; workLocation: string; leader: string;
  guardian: string; guardianExtra: number;
  progress: string; pendingPerson: string;
}

const workTypeOrders: WorkTypeOrder[] = [
  {
    id: 'DH20251215001', title: '测试用001gu', type: '动火作业', typeColor: '#E65100', typeBg: '#FFF3E0',
    level: '一级', startTime: '2025-12-24 10:24', endTime: '2025-12-24 18:24',
    workUnit: '齐大山选矿厂（体验演示）', workLocation: '齐大山选矿厂（体验演示）',
    leader: '演示账号', guardian: '基石管理员', guardianExtra: 1,
    progress: '风险评估', pendingPerson: '演示账号',
  },
]

function WorkTypeOrderCard({ order, onPress }: { order: WorkTypeOrder; onPress: () => void }) {
  const FieldRow = ({ label, value, valueColor = '#1A2332' }: { label: string; value: string; valueColor?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: '#9EAAB8', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: valueColor, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  )
  return (
    <div style={{ margin: '10px 12px 0', background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      <div role="button" tabIndex={0} onClick={onPress} onKeyDown={e => e.key === 'Enter' && onPress()} style={{ padding: '14px 14px 10px', cursor: 'pointer' }}>
        {/* Title + type badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332', flex: 1, marginRight: 8 }}>{order.title}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: order.typeColor, background: order.typeBg, borderRadius: 6, padding: '3px 8px', flexShrink: 0 }}>{order.type}</span>
        </div>
        {/* Level */}
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>{order.level}</div>
        {/* Date range */}
        <div style={{ fontSize: 13, color: '#3D4F63', marginBottom: 12 }}>{order.startTime}~{order.endTime}</div>
        <FieldRow label="作业票编号" value={order.id} valueColor="#1565C0" />
        <FieldRow label="作业所在单位" value={order.workLocation} />
        <FieldRow label="作业单位" value={order.workUnit} />
        <FieldRow label="作业负责人" value={order.leader} />
        {/* 作业监护人 with expand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#9EAAB8' }}>作业监护人</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#1A2332', fontWeight: 500 }}>{order.guardian}</span>
            {order.guardianExtra > 0 && (
              <span style={{ fontSize: 12, color: '#1565C0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                +{order.guardianExtra}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3.5l3 3 3-3" stroke="#1565C0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </div>
        </div>
        <FieldRow label="作业进度" value={order.progress} />
        <FieldRow label="待处理人" value={order.pendingPerson} />
      </div>
      {/* Action buttons */}
      <div style={{ display: 'flex', borderTop: '1px solid #F0F2F5', padding: '10px 14px', gap: 10 }}>
        <button style={{ flex: 1, padding: '7px 0', border: '1px solid #1565C0', borderRadius: 6, background: 'none', fontSize: 13, color: '#1565C0', cursor: 'pointer', fontWeight: 500 }}>复制新增</button>
        <button style={{ flex: 1, padding: '7px 0', border: '1px solid #C62828', borderRadius: 6, background: 'none', fontSize: 13, color: '#C62828', cursor: 'pointer', fontWeight: 500 }}>删除</button>
        <button style={{ flex: 1, padding: '7px 0', border: '1px solid #E65100', borderRadius: 6, background: 'none', fontSize: 13, color: '#E65100', cursor: 'pointer', fontWeight: 500 }}>终止作业</button>
      </div>
    </div>
  )
}

function WorkTypeListScreen({ workType, onBack, onApplyTicket, onViewDetail }: {
  workType: string; onBack: () => void;
  onApplyTicket: () => void; onViewDetail: () => void;
}) {
  const [roleTab, setRoleTab] = useState(0)
  const [statusTab, setStatusTab] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [filterOpen, setFilterOpen] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F0F2F5' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1E88E5 100%)', paddingBottom: 16 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 0' }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', flex: 1, textAlign: 'center' }}>{workType}</span>
          <button onClick={onApplyTicket} style={{ padding: '5px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
            + 申请作业票
          </button>
        </div>
        <div style={{ margin: '12px 16px 0', background: '#fff', borderRadius: 20, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#9EAAB8" strokeWidth="1.4"/>
            <path d="M9.5 9.5l3.5 3.5" stroke="#9EAAB8" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="搜索作业内容" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#1A2332', width: '100%' }}/>
        </div>
      </div>

      {/* Role tabs */}
      <div style={{ background: '#fff', display: 'flex', borderBottom: '1px solid #E0E6ED' }}>
        {ROLE_TABS.map((tab, i) => (
          <button key={tab} onClick={() => setRoleTab(i)} style={{ flex: 1, padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <span style={{ fontSize: 12, fontWeight: roleTab === i ? 700 : 400, color: roleTab === i ? '#1565C0' : '#6B7A8D', whiteSpace: 'nowrap' }}>{tab}</span>
            <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: '#FF3B30', fontSize: 10, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{ROLE_TAB_BADGES[i]}</span>
            {roleTab === i && <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 2, background: '#1565C0', borderRadius: 1 }}/>}
          </button>
        ))}
      </div>

      {/* Status tabs */}
      <div style={{ background: '#fff', display: 'flex', borderBottom: '1px solid #E0E6ED' }}>
        {STATUS_TABS.map((tab, i) => (
          <button key={tab} onClick={() => setStatusTab(i)} style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <span style={{ fontSize: 13, fontWeight: statusTab === i ? 700 : 400, color: statusTab === i ? '#1565C0' : '#6B7A8D' }}>{tab}</span>
            {i === 0 && <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: '#FF3B30', fontSize: 10, fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>1</span>}
            {statusTab === i && <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, background: '#1565C0', borderRadius: 1 }}/>}
          </button>
        ))}
      </div>

      {/* Sort filter row */}
      <div style={{ background: '#fff', display: 'flex', borderBottom: '1px solid #E0E6ED', padding: '0 8px' }}>
        {['作业起止时间', '作业单位', '作业所在单位'].map(f => (
          <button key={f} onClick={() => setFilterOpen(filterOpen === f ? null : f)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '10px 4px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 12, color: '#6B7A8D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 72 }}>{f}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 4l3 3 3-3" stroke="#9EAAB8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
      {filterOpen && <div style={{ position: 'absolute', zIndex: 70, top: 220, left: 12, right: 12, background: '#fff', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,.18)', padding: 14 }}><b style={{ fontSize: 14 }}>{filterOpen}</b>{['全部','今日','本周','鞍钢集团矿业有限公司','齐大山选矿厂'].map((x,i)=><div key={x} onClick={() => setFilterOpen(null)} style={{ padding: '12px 4px', borderBottom: i===4 ? 0 : '1px solid #F0F2F5', color: i===0 ? '#1565C0' : '#3D4F63', fontSize: 13 }}>{x}</div>)}</div>}

      {/* List */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {workTypeOrders.map(o => <WorkTypeOrderCard key={o.id} order={o} onPress={onViewDetail} />)}
        <div style={{ textAlign: 'center', padding: '16px 0 24px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <div style={{ flex: 1, height: 1, background: '#E0E6ED', maxWidth: 60 }}/>
          <span style={{ fontSize: 12, color: '#9EAAB8' }}>已加载完毕</span>
          <div style={{ flex: 1, height: 1, background: '#E0E6ED', maxWidth: 60 }}/>
        </div>
      </div>
    </div>
  )
}

// ── ApplyTicketScreen ──────────────────────────────────────────────────────────

const constructionProjects = [
  { unit: '鞍钢集团矿业有限公司东鞍山烧结厂', name: '高压电气设施定检试验' },
  { unit: '鞍钢集团矿业有限公司东鞍山烧结厂', name: '鞍钢集团矿业公司穿爆保产作业合同' },
  { unit: '鞍钢集团矿业有限公司齐大山分公司', name: '2026年东矿采场生产公路维护用碎石破碎及...' },
]

const linkedOrderItems = [
  { date: '2026-08-12 14:29~2026-08-31 14:29', no: 'DT20260811001', unit: '测试部门1', location: '鞍钢集团矿业有限公司齐大山选矿厂', guardian: '测评四', title: '', type: '' },
  { date: '2026-07-31 16:05~2026-08-01 00:05', no: 'SX20260731001', unit: '', location: '', guardian: '', title: '测试', type: '受限空间作业' },
]

const monitorDevices = ['布控球1','布控球2','布控球3','布控球4','布控球5','布控球10','布控球9']

function ApplyTicketScreen({ workType, onBack }: { workType: string; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'basic' | 'people'>('basic')
  const [showProjectPicker, setShowProjectPicker] = useState(false)
  const [showOrderPicker, setShowOrderPicker] = useState(false)
  const [showDevicePicker, setShowDevicePicker] = useState(false)
  const [projectSearch, setProjectSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [workContent, setWorkContent] = useState('')
  const [validation, setValidation] = useState(false)

  const APPLY_TABS = ['基本信息', '作业相关单位、人员及地点']

  const toggleDevice = (d: string) =>
    setSelectedDevices(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', position: 'relative' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1E88E5 100%)', paddingBottom: 0, flexShrink: 0 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 16px 0', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>申请{workType}票</span>
        </div>
        {/* Tab bar */}
        <div style={{ display: 'flex', marginTop: 10 }}>
          {APPLY_TABS.map((tab, i) => {
            const active = (i === 0 && activeTab === 'basic') || (i === 1 && activeTab === 'people')
            return (
              <button key={tab} onClick={() => setActiveTab(i === 0 ? 'basic' : 'people')} style={{ flex: 1, padding: '11px 8px 10px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{tab}</span>
                {active && <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 2, background: '#fff', borderRadius: 1 }}/>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'basic' && (
          <div style={{ padding: '0 0 80px' }}>

            {/* 关联施工项目 */}
            <div style={{ padding: '16px 16px 14px', borderBottom: '1px solid #F0F2F5' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 10 }}>关联施工项目</div>
              {selectedProject && (
                <div style={{ fontSize: 13, color: '#1565C0', marginBottom: 8 }}>{selectedProject}</div>
              )}
              <button onClick={() => setShowProjectPicker(true)} style={{ padding: '7px 18px', borderRadius: 6, background: '#1565C0', border: 'none', fontSize: 13, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                关联施工项目
              </button>
            </div>

            {/* 作业类型 */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F2F5' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 10 }}>
                <span style={{ color: '#C62828', marginRight: 2 }}>*</span>作业类型
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, border: '2px solid #1565C0', background: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 4, background: '#fff' }}/>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>维修作业</div>
                  <div style={{ fontSize: 12, color: '#6B7A8D', lineHeight: 1.6 }}>化工企业检维修包括：全厂停车大检修；某一套或几套生产储存装置停车大修；系统、车间或生产储存装置的检维修；化工装置的维护保养；生产储存装置及相关设备在不停产状况下的抢修。</div>
                </div>
              </div>
            </div>

            {/* 作业内容 */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F2F5' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 10 }}>
                <span style={{ color: '#C62828', marginRight: 2 }}>*</span>作业内容
              </div>
              <textarea value={workContent} onChange={e => {setWorkContent(e.target.value);setValidation(false)}} placeholder="填写作业内容" style={{ width: '100%', height: 96, border: `1px solid ${validation && !workContent ? '#C62828' : '#E0E6ED'}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#1A2332', resize: 'none', outline: 'none', fontFamily: 'inherit' }}/>
              {validation && !workContent && <div style={{ color: '#C62828', fontSize: 12, marginTop: 6 }}>请填写作业内容</div>}
            </div>

            {/* 作业内容附件 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #F0F2F5' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>作业内容附件</span>
              <button style={{ padding: '6px 14px', border: '1px solid #1565C0', borderRadius: 6, background: 'none', fontSize: 13, color: '#1565C0', cursor: 'pointer' }}>上传文件</button>
            </div>

            {/* 作业方案 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #F0F2F5' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>作业方案</span>
              <button style={{ padding: '6px 14px', border: '1px solid #1565C0', borderRadius: 6, background: 'none', fontSize: 13, color: '#1565C0', cursor: 'pointer' }}>上传文件</button>
            </div>

            {/* 计划开始时间 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #F0F2F5' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>
                <span style={{ color: '#C62828', marginRight: 2 }}>*</span>计划开始时间
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, color: '#9EAAB8' }}>选择计划开始时间</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="#9EAAB8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* 计划结束时间 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #F0F2F5' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>
                <span style={{ color: '#C62828', marginRight: 2 }}>*</span>计划结束时间
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, color: '#9EAAB8' }}>选择计划结束时间</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="#9EAAB8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* 关联作业票 */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F2F5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 3, height: 14, background: '#1565C0', borderRadius: 2 }}/>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>关联作业票</span>
              </div>
              <button onClick={() => setShowOrderPicker(true)} style={{ padding: '7px 18px', borderRadius: 6, background: '#1565C0', border: 'none', fontSize: 13, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                关联作业票
              </button>
            </div>

            {/* 选择监控设备 */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 3, height: 14, background: '#1565C0', borderRadius: 2 }}/>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>选择监控设备</span>
              </div>
              <div style={{ background: '#FFF8F0', border: '1px solid #FFE0B2', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 12, color: '#E65100', lineHeight: 1.6 }}>
                选择监控设备后，请属地单位监护人员携带该监控设备前往现场，作业期间请实时开启，确保作业期间保留作业视频数据。
              </div>
              <button onClick={() => setShowDevicePicker(true)} style={{ padding: '7px 18px', borderRadius: 6, background: '#1565C0', border: 'none', fontSize: 13, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                选择监控设备
              </button>
              {selectedDevices.length > 0 && (
                <div style={{ marginTop: 10, fontSize: 13, color: '#1565C0' }}>已选: {selectedDevices.join('、')}</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div style={{ padding: '20px 16px 80px' }}>
            <div style={{ fontSize: 14, color: '#9EAAB8', textAlign: 'center', marginTop: 40 }}>作业相关单位、人员及地点信息将在提交后填写</div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{ display: 'flex', background: '#fff', borderTop: '1px solid #E0E6ED', flexShrink: 0 }}>
        <button onClick={onBack} style={{ flex: 1, padding: '14px 0', border: 'none', background: 'none', fontSize: 14, fontWeight: 500, color: '#9EAAB8', cursor: 'pointer' }}>取消</button>
        <button onClick={() => setValidation(true)} style={{ flex: 2, padding: '14px 0', border: 'none', background: '#1565C0', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>提交</button>
      </div>

      {/* ── Bottom sheet: 关联施工项目 ── */}
      {showProjectPicker && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowProjectPicker(false)} />
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', maxHeight: '75%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A2332' }}>请关联施工项目</span>
              <button onClick={() => setShowProjectPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="#9EAAB8" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div style={{ margin: '0 16px 12px', background: '#F5F7FA', borderRadius: 20, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="#9EAAB8" strokeWidth="1.3"/>
                <path d="M8.5 8.5l3.5 3.5" stroke="#9EAAB8" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input value={projectSearch} onChange={e => setProjectSearch(e.target.value)} placeholder="请输入项目名称进行模糊搜索" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#1A2332', width: '100%' }}/>
            </div>
            <div className="scrollbar-hide" style={{ overflowY: 'auto', flex: 1 }}>
              {constructionProjects.filter(p => !projectSearch || p.name.includes(projectSearch)).map((p, i) => (
                <div key={i} style={{ borderBottom: '1px solid #F0F2F5', padding: '14px 16px', cursor: 'pointer', background: selectedProject === p.name ? '#EBF3FF' : 'none' }}
                  onClick={() => { setSelectedProject(p.name); setShowProjectPicker(false) }}>
                  <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 6 }}>项目所属单位 {p.unit}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2332' }}>{p.name}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #E0E6ED' }}>
              <button style={{ width: '100%', padding: '14px 0', background: '#1565C0', border: 'none', borderRadius: 24, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom sheet: 关联作业票 ── */}
      {showOrderPicker && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowOrderPicker(false)} />
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', maxHeight: '75%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 12px' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A2332' }}>请关联作业票</span>
              <button onClick={() => setShowOrderPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 4l10 10M14 4L4 14" stroke="#9EAAB8" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div style={{ margin: '0 16px 12px', background: '#F5F7FA', borderRadius: 20, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="#9EAAB8" strokeWidth="1.3"/>
                <path d="M8.5 8.5l3.5 3.5" stroke="#9EAAB8" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="作业内容/作业票编号/作业单位/作业所在单位关键词搜索" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: '#1A2332', width: '100%' }}/>
            </div>
            <div className="scrollbar-hide" style={{ overflowY: 'auto', flex: 1 }}>
              {linkedOrderItems.map((item, i) => (
                <div key={i} style={{ borderBottom: '1px solid #F0F2F5', padding: '14px 16px', cursor: 'pointer' }}>
                  {item.title && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332' }}>{item.title}</span>
                      {item.type && <span style={{ fontSize: 11, fontWeight: 600, color: '#E65100', background: '#FFF3E0', borderRadius: 6, padding: '3px 8px' }}>{item.type}</span>}
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: '#1A2332', marginBottom: 6 }}>{item.date}</div>
                  {item.no && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 12, color: '#9EAAB8' }}>作业票编号</span><span style={{ fontSize: 13, color: '#1565C0', fontWeight: 500 }}>{item.no}</span></div>}
                  {item.unit && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 12, color: '#9EAAB8' }}>作业单位</span><span style={{ fontSize: 13, color: '#1A2332' }}>{item.unit}</span></div>}
                  {item.location && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 12, color: '#9EAAB8' }}>作业所在单位</span><span style={{ fontSize: 13, color: '#1A2332', textAlign: 'right', maxWidth: '55%' }}>{item.location}</span></div>}
                  {item.guardian && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: '#9EAAB8' }}>作业单位监护人</span><span style={{ fontSize: 13, color: '#1A2332' }}>{item.guardian}</span></div>}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid #E0E6ED' }}>
              <button style={{ width: '100%', padding: '14px 0', background: '#1565C0', border: 'none', borderRadius: 24, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom sheet: 选择监控设备 ── */}
      {showDevicePicker && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowDevicePicker(false)} />
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', maxHeight: '80%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 12px', borderBottom: '1px solid #F0F2F5' }}>
              <button onClick={() => setShowDevicePicker(false)} style={{ background: 'none', border: 'none', fontSize: 14, color: '#1565C0', cursor: 'pointer' }}>取消</button>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A2332' }}>选择监控设备</span>
              <button onClick={() => setShowDevicePicker(false)} style={{ background: 'none', border: 'none', fontSize: 14, color: '#1565C0', cursor: 'pointer', fontWeight: 600 }}>确定</button>
            </div>
            <div style={{ background: '#FFF8F0', margin: '12px 16px', padding: '10px 12px', borderRadius: 8, fontSize: 12, color: '#E65100' }}>
              当前有{monitorDevices.length + 8}个空闲布控球可选择(可多选)
            </div>
            <div className="scrollbar-hide" style={{ overflowY: 'auto', flex: 1 }}>
              {monitorDevices.map(d => (
                <div key={d} onClick={() => toggleDevice(d)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: '1px solid #F5F7FA', cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${selectedDevices.includes(d) ? '#1565C0' : '#C8D4E0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedDevices.includes(d) && <div style={{ width: 10, height: 10, borderRadius: 5, background: '#1565C0' }}/>}
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EBF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <rect x="4" y="4" width="20" height="20" rx="5" fill="#1565C0" opacity="0.15"/>
                      <circle cx="14" cy="14" r="6" fill="#1565C0" opacity="0.4"/>
                      <circle cx="14" cy="14" r="3" fill="#1565C0"/>
                      <circle cx="14" cy="8" r="1.5" fill="#1565C0" opacity="0.6"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 15, color: '#1A2332', fontWeight: 500 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── WorkTypeDetailScreen (常规作业详情) ────────────────────────────────────────

function WorkTypeDetailScreen({ workType, onBack, onMonitorReport }: { workType: string; onBack: () => void; onMonitorReport: () => void }) {
  const [activeTab, setActiveTab] = useState<'basic' | 'people'>('basic')

  const FieldBlock = ({ label, value, valueColor = '#1A2332' }: { label: string; value: string; valueColor?: string }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: valueColor, fontWeight: valueColor === '#1A2332' && value !== '-' && value !== '--' ? 600 : 400 }}>{value}</div>
    </div>
  )

  const PersonField = ({ label, name, phone = true }: { label: string; name: string; phone?: boolean }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: '#1A2332', fontWeight: 500 }}>{name}</span>
        {phone && <PhoneBtn />}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1E88E5 100%)', paddingBottom: 0, flexShrink: 0 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 16px 0', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{workType}详情</span>
        </div>
        {/* 2-tab bar */}
        <div style={{ display: 'flex', marginTop: 10 }}>
          {(['基本信息', '相关人员'] as const).map((tab, i) => {
            const key = i === 0 ? 'basic' : 'people'
            const active = activeTab === key
            return (
              <button key={tab} onClick={() => setActiveTab(key)} style={{ flex: 1, padding: '11px 8px 10px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                <span style={{ fontSize: 14, fontWeight: active ? 700 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.6)' }}>{tab}</span>
                {active && <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, background: '#fff', borderRadius: 1 }}/>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px' }}>
        {activeTab === 'basic' && (
          <>
            <FieldBlock label="作业票编号" value="--" />
            <FieldBlock label="作业方案" value="--" />
            <FieldBlock label="其他相关人员" value="-" />
            <FieldBlock label="作业地点及部位" value="测试" />
            <FieldBlock label="地图标点" value="暂无点位信息" />
            <FieldBlock label="计划起止时间" value="2026-07-21 09:42~2026-07-21 17:42" />
            <FieldBlock label="关联施工项目" value="-" />
            <FieldBlock label="关联作业票" value="-" />
            <FieldBlock label="选择监控设备" value="-" />
            <FieldBlock label="作业申请单位" value="测试机构" />
            <FieldBlock label="作业申请人" value="测评二" />
            <FieldBlock label="作业申请时间" value="2026-07-21 09:42" />
          </>
        )}
        {activeTab === 'people' && (
          <>
            <FieldBlock label="作业单位" value="测试机构" />
            <PersonField label="作业单位负责人" name="测评二" />
            <FieldBlock label="作业所在单位" value="鞍钢集团矿业有限公司齐大山选矿厂" />
            <PersonField label="作业所在单位负责人" name="测评二" />
            <PersonField label="安全交底人" name="测评二" />
            <PersonField label="作业单位监护人" name="测评二" />
            <PersonField label="属地单位监护人" name="测评一" />

            {/* 作业人员 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 8 }}>作业人员</div>
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px 12px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#1565C0', fontWeight: 600 }}>测评二</span>
                  <PhoneBtn />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 5, background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>普</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: '#F9A825', borderRadius: 6, padding: '3px 10px' }}>鞍钢集团矿业有限公司</span>
                </div>
              </div>
            </div>

            {/* 作业审批节点 */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, background: '#1565C0', borderRadius: 2 }}/>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332' }}>作业审批节点</span>
              </div>
              <PersonField label="作业负责人意见" name="测评二" />
              <PersonField label="所在单位意见" name="测评二" />
            </div>

            {/* 验收审批节点 */}
            <div style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, background: '#1565C0', borderRadius: 2 }}/>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332' }}>验收审批节点</span>
              </div>
              <PersonField label="完工验收意见" name="测评一" />
            </div>
          </>
        )}
      </div>

      {/* Bottom: generate report button */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0E6ED', padding: '12px 16px', flexShrink: 0 }}>
        <button onClick={onMonitorReport} style={{ width: '100%', padding: '13px 0', background: '#1565C0', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>生成监护报告</button>
      </div>
    </div>
  )
}

// ── MonitoringReportScreen ────────────────────────────────────────────────────

function MonitoringReportScreen({ onBack }: { onBack: () => void }) {
  const Cell = ({ children, header = false, span = 1 }: { children: React.ReactNode; header?: boolean; span?: number }) => (
    <td colSpan={span} style={{ border: '1px solid #C8D4E0', padding: '10px 12px', fontSize: 13, color: header ? '#9EAAB8' : '#1A2332', fontWeight: header ? 400 : 500, verticalAlign: 'top', lineHeight: 1.5, background: header ? '#F8FAFC' : '#fff' }}>
      {children}
    </td>
  )

  const approvalNodes = [
    { index: 1, opinion: '完工验收意见', signTime: '2024-10-15 15:57', hasPhoto: false },
    { index: 2, opinion: '1', signTime: '2024-10-15 15:58', hasPhoto: false },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1E88E5 100%)', flexShrink: 0 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 16px 12px', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>生成监护报告</span>
        </div>
      </div>

      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px' }}>
        {/* Report title */}
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 14, lineHeight: 1.6 }}>
          【鞍钢矿业集团】【临时用电作业】的现场监护记录表
        </div>

        {/* Summary table */}
        <div style={{ marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <tbody>
              <tr>
                <Cell header>作业单位名称</Cell>
                <Cell>鞍钢矿业集团</Cell>
                <Cell header>作业地点</Cell>
                <Cell>气体检测分析记录测试111</Cell>
              </tr>
              <tr>
                <Cell header>作业内容</Cell>
                <Cell span={3}>气体检测分析记录测试111</Cell>
              </tr>
              <tr>
                <Cell header>作业时间</Cell>
                <Cell>2024-10-01 15:18 ~ 2024-10-17 15:18</Cell>
                <Cell header>作业人员</Cell>
                <Cell>-</Cell>
              </tr>
              <tr>
                <Cell header>现场监护人员</Cell>
                <Cell>-</Cell>
                <Cell header>作业单位负责人</Cell>
                <Cell>齐矿管理员</Cell>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 现场监护记录 */}
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1A2332', marginBottom: 12 }}>【现场监护记录】</div>
        {/* Empty gray block matching original */}
        <div style={{ background: '#F5F7FA', borderRadius: 8, height: 48, marginBottom: 24 }} />

        {/* 完工验收记录 */}
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1A2332', marginBottom: 16 }}>【完工验收记录】</div>

        {/* 作业验收 SectionLabel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <div style={{ width: 3, height: 16, background: '#1565C0', borderRadius: 2 }}/>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332' }}>作业验收</span>
        </div>

        {/* 作业验收 gray card */}
        <div style={{ background: '#F5F7FA', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
          {/* 作业实施时间 row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#9EAAB8', flexShrink: 0 }}>作业实施时间</span>
            <span style={{ fontSize: 13, color: '#1A2332', fontWeight: 500 }}>2024-10-01 15:18 - 2024-10-17 15:18</span>
          </div>
          {/* 完工照片 row + large photo placeholder */}
          <div>
            <span style={{ fontSize: 13, color: '#9EAAB8', display: 'block', marginBottom: 8 }}>完工照片</span>
            <div style={{ background: '#E8EDF2', borderRadius: 8, height: 160 }} />
          </div>
        </div>

        {/* 完工验收 SectionLabel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <div style={{ width: 3, height: 16, background: '#1565C0', borderRadius: 2 }}/>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332' }}>完工验收</span>
        </div>

        {/* Approval node cards */}
        {approvalNodes.map(node => (
          <div key={node.index} style={{ background: '#F5F7FA', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
            {/* Node label + opinion */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#1565C0', fontWeight: 600, flexShrink: 0 }}>审批节点{node.index}</span>
              <span style={{ fontSize: 13, color: '#1A2332', fontWeight: 500 }}>{node.opinion}</span>
            </div>
            {/* 签字时间 */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#9EAAB8', flexShrink: 0 }}>签字时间</span>
              <span style={{ fontSize: 13, color: '#1A2332' }}>{node.signTime}</span>
            </div>
            {/* 现场照片 */}
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#9EAAB8', display: 'block', marginBottom: 6 }}>现场照片</span>
              {node.index === 1
                ? <span style={{ fontSize: 13, color: '#9EAAB8' }}>-</span>
                : <div style={{ background: '#E8EDF2', borderRadius: 8, height: 120 }} />
              }
            </div>
            {/* 签字照片 */}
            <div>
              <span style={{ fontSize: 13, color: '#9EAAB8', display: 'block', marginBottom: 6 }}>签字照片</span>
              <div style={{ background: '#E8EDF2', borderRadius: 8, height: 120 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkListScreen({ onBack, onViewDetail }: { onBack: () => void; onViewDetail: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [showTypeFilter, setShowTypeFilter] = useState(false)
  const [selectedType, setSelectedType] = useState('全部作业类型')

  const filtered = workOrders.filter(o => {
    const matchTab = activeTab === 0 || o.status === LIST_TABS[activeTab]
    const matchSearch = !searchText || o.title.includes(searchText) || o.id.includes(searchText)
    const matchType = selectedType === '全部作业类型' || o.type === selectedType
    return matchTab && matchSearch && matchType
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F0F2F5', position: 'relative' }}>
      {/* Blue gradient header matching original */}
      <div style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1E88E5 100%)', paddingBottom: 16 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 16px 0', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>安全作业管理</span>
        </div>
        {/* White search bar — matching original style */}
        <div style={{ margin: '12px 16px 0', background: '#fff', borderRadius: 20, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#9EAAB8" strokeWidth="1.4"/>
            <path d="M9.5 9.5l3.5 3.5" stroke="#9EAAB8" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="搜索作业内容" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#1A2332', width: '100%' }}/>
        </div>
      </div>

      {/* Type filter row */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0E6ED' }}>
        <button onClick={() => setShowTypeFilter(!showTypeFilter)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px' }}>
          <span style={{ fontSize: 13, color: showTypeFilter ? '#1565C0' : '#1A2332', fontWeight: 500 }}>{selectedType}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: showTypeFilter ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            <path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke={showTypeFilter ? '#1565C0' : '#1A2332'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Full-panel type filter list */}
      {showTypeFilter && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}>
          {/* Spacer to position panel below header+filter-row — calculated roughly */}
          <div style={{ height: 170, flexShrink: 0 }} onClick={() => setShowTypeFilter(false)} />
          <div style={{ background: '#fff', flex: 1, overflowY: 'auto' }} className="scrollbar-hide">
            {['全部作业类型', ...workTypes.map(w => w.label)].map(t => {
              const sel = selectedType === t
              return (
                <button key={t} onClick={() => { setSelectedType(t); setShowTypeFilter(false) }} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid #F0F2F5', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, color: sel ? '#1565C0' : '#1A2332', fontWeight: sel ? 600 : 400 }}>{t}</span>
                  {sel && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="#1565C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
          {/* Dark overlay at bottom */}
          <div style={{ height: 60, background: 'rgba(0,0,0,0.3)', flexShrink: 0 }} onClick={() => setShowTypeFilter(false)} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: '#fff', display: 'flex', borderBottom: '1px solid #E0E6ED', marginTop: 8 }}>
        {LIST_TABS.map((tab, i) => {
          const cnt = i === 0 ? workOrders.length : workOrders.filter(o => o.status === tab).length
          return (
            <button key={tab} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <span style={{ fontSize: 13, fontWeight: activeTab === i ? 700 : 400, color: activeTab === i ? '#1565C0' : '#6B7A8D' }}>{tab}</span>
              <span style={{ fontSize: 10, color: activeTab === i ? '#1565C0' : '#9EAAB8', marginLeft: 3 }}>({cnt})</span>
              {activeTab === i && <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, background: '#1565C0', borderRadius: 1 }}/>}
            </button>
          )
        })}
      </div>

      {/* List */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', paddingTop: 12, position: 'relative' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14, color: '#9EAAB8' }}>暂无相关作业记录</div>
          </div>
        ) : (
          filtered.map(order => <WorkOrderCard key={order.id} order={order} onPress={() => onViewDetail(order.id)} />)
        )}
        {filtered.length > 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0 24px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <div style={{ flex: 1, height: 1, background: '#E0E6ED', maxWidth: 60 }}/>
            <span style={{ fontSize: 12, color: '#9EAAB8' }}>已加载完毕</span>
            <div style={{ flex: 1, height: 1, background: '#E0E6ED', maxWidth: 60 }}/>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Work Detail screen ────────────────────────────────────────────────────────

// Stacked label-value field — gray label on top, black value below
function DetailField({ label, value }: { label: string; value: string }) {
  const isEmpty = value === '--' || value === '-'
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 4, lineHeight: 1 }}>{label}</div>
      <div style={{ fontSize: 14, color: isEmpty ? '#9EAAB8' : '#1A2332', lineHeight: 1.55, fontWeight: isEmpty ? 400 : 500 }}>{value}</div>
    </div>
  )
}

// File attachment row — matches original PDF/file link style
function FileLink({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      {/* File icon */}
      <div style={{ width: 32, height: 32, borderRadius: 6, background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="1" width="11" height="15" rx="1.5" fill="#BBDEFB" stroke="#1565C0" strokeWidth="1.2"/>
          <path d="M9 1v4h5" stroke="#1565C0" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M5 9h8M5 12h5" stroke="#1565C0" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      </div>
      <span style={{ fontSize: 14, color: '#1565C0', flex: 1 }}>{name}</span>
    </div>
  )
}

// Linked ticket list — blue text links, one per line
function LinkedTickets({ tickets }: { tickets: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {tickets.map((t, i) => (
        <span key={i} style={{ fontSize: 13, color: '#1565C0', lineHeight: 1.5 }}>{t}</span>
      ))}
    </div>
  )
}

// Person row with level badge and phone icon
function PersonRow({ name, level, levelColor = '#2E7D32', isLink = false }: { name: string; level?: string; levelColor?: string; isLink?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, marginBottom: 8 }}>
      {level && (
        <div style={{ width: 24, height: 24, borderRadius: 5, background: levelColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{level}</span>
        </div>
      )}
      <span style={{ flex: 1, fontSize: 14, color: isLink ? '#1565C0' : '#1A2332', fontWeight: 500 }}>{name}</span>
      <PhoneBtn />
    </div>
  )
}

// Approval node row for 相关人员 tab — label + person name + phone
function ApprovalRow({ role, person }: { role: string; person: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 6 }}>{role}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: '#1A2332', fontWeight: 500 }}>{person}</span>
        <PhoneBtn />
      </div>
    </div>
  )
}

// Risk tag chip — gray rounded pill
function RiskChip({ label }: { label: string }) {
  return (
    <span style={{ padding: '7px 18px', borderRadius: 8, background: '#F0F2F5', fontSize: 13, color: '#3D4F63', fontWeight: 500 }}>{label}</span>
  )
}

// Safety measure status badge
function MeasureBadge({ status }: { status: '已落实' | '不涉及' | '待确认' }) {
  const map = {
    '已落实': { bg: '#2E7D32', color: '#fff' },
    '不涉及': { bg: '#F9A825', color: '#fff' },
    '待确认': { bg: '#9EAAB8', color: '#fff' },
  }
  const s = map[status]
  return (
    <span style={{ padding: '5px 14px', borderRadius: 20, background: s.bg, color: s.color, fontSize: 13, fontWeight: 600, display: 'inline-block' }}>{status}</span>
  )
}

// Signature box — gray rectangle area matching original
function SignatureBox({ time, label = '确认人签字' }: { time?: string; label?: string }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 8 }}>{label}</div>
      <div style={{ height: 100, background: '#F0F2F5', borderRadius: 8 }}/>
      {time && (
        <div style={{ fontSize: 11, color: '#9EAAB8', textAlign: 'right', marginTop: 6 }}>签字时间 {time}</div>
      )}
    </div>
  )
}

type DetailTabKey = 'basic' | 'people' | 'risk' | 'safety' | 'handover'

const DETAIL_TABS: { key: DetailTabKey; label: string }[] = [
  { key: 'basic', label: '基本信息' },
  { key: 'people', label: '相关人员' },
  { key: 'risk', label: '风险评估' },
  { key: 'safety', label: '安全措施' },
  { key: 'handover', label: '安全交底' },
]

const linkedTickets = [
  '常规作业ZY20240929001', '断路作业DL20241009002', '动火作业DH20240928023',
  '临时用电作业YD20241014004', '动土作业DT20240928001', '常规作业ZY20241014001',
  '临时用电作业YD20240928001', '动土作业DT20240929001', '动火作业DH20240930001',
  '动火作业DH20241012002', '动火作业DH20241017001', '动火作业DH20240928033',
]

const safetyMeasures = [
  {
    text: '1．办理了动土作业许可，并对作业过程中的风险进行识别和采取管控措施。',
    status: '已落实' as const, note: '', time: '2026-08-18 15:48',
  },
  {
    text: '2．现场动土作业过程中，设置有监护人员，并全程进行了监护。',
    status: '不涉及' as const, note: '监护人员已到位，全程陪同', time: '2026-08-18 15:48',
  },
  {
    text: '3．作业前，对现场的地下管线等，进行了交底。',
    status: '不涉及' as const, note: '已完成管线交底', time: '2026-08-18 15:49',
  },
  {
    text: '4．挖掘土方时，自上而下逐层挖掘，不应采用挖底脚的办法挖掘。',
    status: '不涉及' as const, note: '1', time: '2026-08-18 15:49',
  },
  {
    text: '5．使用的材料、挖出的泥土，距坑、槽、井、沟边沿至少1m及以上，堆土高度不应大于1.5m。',
    status: '不涉及' as const, note: '1', time: '2026-08-18 15:49',
  },
]

function WorkDetailScreen({ orderId, onBack }: { orderId: string; onBack: () => void }) {
  const order = workOrders.find(o => o.id === orderId) ?? workOrders[0]
  const [activeTab, setActiveTab] = useState<DetailTabKey>('basic')
  const [showTabDropdown, setShowTabDropdown] = useState(false)
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [approved, setApproved] = useState(false)

  const typeLabel = `${order.type}详情`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>

      {/* Blue gradient header */}
      <div style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1E88E5 100%)', flexShrink: 0 }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 16px 0', position: 'relative' }}>
          <button onClick={onBack} style={{ position: 'absolute', left: 16, width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{typeLabel}</span>
        </div>

        {/* Horizontal scrollable tab bar — matching original multi-tab layout */}
        <div style={{ position: 'relative' }}>
          <div className="scrollbar-hide" style={{ display: 'flex', overflowX: 'auto', marginTop: 10 }}>
            {DETAIL_TABS.map(tab => {
              const active = activeTab === tab.key
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flexShrink: 0, padding: '11px 16px 10px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', minWidth: 72 }}>
                  <span style={{ fontSize: 14, fontWeight: active ? 700 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{tab.label}</span>
                  {active && <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 2, background: '#fff', borderRadius: 1 }}/>}
                </button>
              )
            })}
            {/* ▼ Dropdown trigger */}
            <button onClick={() => setShowTabDropdown(v => !v)} style={{ flexShrink: 0, padding: '11px 12px 10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 6l3 3 3-3" stroke={showTabDropdown ? '#fff' : 'rgba(255,255,255,0.6)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Tab dropdown panel — pill chips */}
          {showTabDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', zIndex: 60, padding: '12px 14px 14px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#1A2332', fontWeight: 600 }}>全部</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M5 10l3-3 3 3" stroke="#1A2332" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DETAIL_TABS.map(tab => {
                  const sel = activeTab === tab.key
                  return (
                    <button key={tab.key} onClick={() => { setActiveTab(tab.key); setShowTabDropdown(false) }} style={{ padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: sel ? 600 : 400, background: sel ? '#EBF3FF' : '#F0F2F5', color: sel ? '#1565C0' : '#3D4F63', border: sel ? '1.5px solid #1565C0' : '1.5px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>

        {/* ── 基本信息 tab ── */}
        {activeTab === 'basic' && (
          <div style={{ padding: '20px 16px 32px' }}>
            <DetailField label="作业票编号" value={order.id} />
            <DetailField label="作业等级" value={order.level} />
            <DetailField label="作业内容" value={order.title} />

            {/* 作业内容附件 — file link style */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 8 }}>作业内容附件</div>
              <FileLink name="作业方案说明.pdf" />
            </div>

            {/* 作业方案 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 8 }}>作业方案</div>
              <FileLink name={`${order.type}安全作业方案.pdf`} />
            </div>

            <DetailField label="作业范围、内容、方式（包涵深度、面积并附简图）" value="-" />
            <DetailField label="其他相关人员" value="-" />
            <DetailField label="作业地点及部位" value={order.location} />
            <DetailField label="地图标点" value="暂无点位信息" />
            <DetailField label="计划起止时间" value={`${order.startTime}~${order.endTime}`} />
            <DetailField label="关联施工项目" value="中石化炼化一区检修施工项目" />

            {/* 关联作业票 — blue links list */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 8 }}>关联作业票</div>
              <LinkedTickets tickets={linkedTickets} />
            </div>

            <DetailField label="选择监控设备" value="-" />
            <DetailField label="作业申请单位" value="炼油一车间检修组" />
            <DetailField label="作业申请人" value={order.leader} />
            <DetailField label="作业申请时间" value={order.startTime.slice(0, 16)} />
          </div>
        )}

        {/* ── 相关人员 tab ── */}
        {activeTab === 'people' && (
          <div style={{ padding: '16px 16px 32px' }}>
            {/* 属地单位监护人 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 8 }}>属地单位监护人</div>
              <div style={{ fontSize: 13, color: '#9EAAB8' }}>（暂无）</div>
            </div>

            {/* 作业人员 */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 8 }}>作业人员</div>
              <PersonRow name={order.leader} level="普" levelColor="#2E7D32" isLink />
              <PersonRow name={order.guardian} level="监" levelColor="#1565C0" isLink />
            </div>

            <div style={{ height: 1, background: '#F0F2F5', margin: '12px 0 20px' }}/>

            {/* 作业审批节点 */}
            <SectionLabel title="作业审批节点" />
            <ApprovalRow role="作业负责人意见" person={order.leader} />
            <ApprovalRow role="所在单位意见" person="炼油一车间" />
            <ApprovalRow role="安全管理部门意见" person="安全环保部" />
            <ApprovalRow role="作业前验票情况" person={order.guardian} />

            <div style={{ height: 1, background: '#F0F2F5', margin: '4px 0 20px' }}/>

            {/* 验收审批节点 */}
            <SectionLabel title="验收审批节点" />
            <ApprovalRow role="完工验收意见" person={order.leader} />
          </div>
        )}

        {/* ── 风险评估 tab ── */}
        {activeTab === 'risk' && (
          <div style={{ padding: '20px 16px 32px' }}>
            {/* 风险辨识 */}
            <SectionLabel title="风险辨识" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
              {['坍塌', '其他伤害', '火灾爆炸', '中毒窒息'].map(tag => (
                <RiskChip key={tag} label={tag} />
              ))}
            </div>

            {/* 风险备注信息 */}
            <SectionLabel title="风险备注信息" />
            <div style={{ fontSize: 14, color: '#1A2332', lineHeight: 1.6, marginBottom: 28 }}>
              作业区域存在坍塌风险，需设置警戒线。作业前需对地下管线进行探测，避免损坏。
            </div>

            {/* 附件 */}
            <SectionLabel title="附件" />
            <FileLink name="风险评估报告.jpg" />
            <FileLink name="现场勘查照片.jpg" />
          </div>
        )}

        {/* ── 安全措施 tab ── */}
        {activeTab === 'safety' && (
          <div style={{ padding: '20px 16px 32px' }}>
            <SectionLabel title="安全措施确认记录" />
            {safetyMeasures.map((m, i) => (
              <div key={i}>
                <div style={{ fontSize: 14, color: '#1A2332', lineHeight: 1.65, marginBottom: 10 }}>{m.text}</div>
                <div style={{ marginBottom: 14 }}>
                  <MeasureBadge status={m.status} />
                </div>
                {m.note && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 4 }}>备注</div>
                    <div style={{ fontSize: 14, color: '#1A2332' }}>{m.note}</div>
                  </div>
                )}
                <SignatureBox time={m.time} />
                {i < safetyMeasures.length - 1 && (
                  <div style={{ height: 1, background: '#E0E6ED', margin: '16px 0' }}/>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── 安全交底 tab ── */}
        {activeTab === 'handover' && (
          <div style={{ padding: '20px 16px 32px' }}>
            <SectionLabel title="安全措施交底记录" />

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 6 }}>交底内容</div>
              <div style={{ fontSize: 14, color: '#1A2332', lineHeight: 1.65 }}>
                1. 作业前须确认作业区域已设置安全警戒，无关人员不得进入作业范围。{'\n'}
                2. 作业人员须佩戴符合要求的劳动防护用品，包括安全帽、工作服、安全鞋等。{'\n'}
                3. 明确作业区域地下管线位置，严禁盲目开挖，避免损坏地下设施。{'\n'}
                4. 作业过程中监护人须全程到位，不得擅离职守。{'\n'}
                5. 作业完毕后，及时恢复现场，确认无隐患后方可撤离。
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9EAAB8', marginBottom: 8 }}>附件</div>
              <FileLink name="安全交底记录表.pdf" />
            </div>

            <SignatureBox time="2026-08-18 15:52" label="交底人签字" />
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      {order.status === '待审批' && (
        <div style={{ background: '#fff', borderTop: '1px solid #E0E6ED', display: 'flex', flexShrink: 0 }}>
          <button style={{ flex: 1, padding: '14px 0', border: 'none', background: '#F5F7FA', fontSize: 14, fontWeight: 500, color: '#9EAAB8', cursor: 'pointer' }}>取消</button>
          <button onClick={() => setApprovalOpen(true)} style={{ flex: 2, padding: '14px 0', border: 'none', background: approved ? '#2E7D32' : '#1565C0', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>{approved ? '审批已通过' : '审批通过'}</button>
        </div>
      )}
      {approvalOpen && <div style={{ position: 'absolute', inset: 0, zIndex: 90, background: 'rgba(0,0,0,.42)', display: 'flex', alignItems: 'flex-end' }}><div style={{ width: '100%', background: '#fff', borderRadius: '18px 18px 0 0', padding: 20 }}><h3 style={{ margin: 0, fontSize: 17 }}>审批确认</h3><p style={{ color: '#6B7A8D', fontSize: 13 }}>确认风险评估和安全措施均已审核，同意该作业进入下一环节。</p><textarea placeholder="审批意见（选填）" style={{ width: '100%', height: 72, border: '1px solid #E0E6ED', borderRadius: 8, padding: 10, fontFamily: 'inherit' }}/><div style={{ border: '1px dashed #9BBCE2', borderRadius: 10, height: 82, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0', fontSize: 13 }}>点击手写签名</div><div style={{ display: 'flex', gap: 10, marginTop: 16 }}><button onClick={()=>setApprovalOpen(false)} style={{ flex: 1, padding: 12, border: '1px solid #E0E6ED', borderRadius: 8, background: '#fff' }}>取消</button><button onClick={()=>{setApprovalOpen(false);setApproved(true)}} style={{ flex: 2, padding: 12, border: 0, borderRadius: 8, background: '#1565C0', color: '#fff', fontWeight: 700 }}>签名并确认</button></div></div></div>}
      {order.status === '进行中' && (
        <div style={{ background: '#fff', borderTop: '1px solid #E0E6ED', display: 'flex', flexShrink: 0 }}>
          <button style={{ flex: 1, padding: '14px 0', border: 'none', background: '#F5F7FA', fontSize: 14, fontWeight: 500, color: '#9EAAB8', cursor: 'pointer' }}>取消</button>
          <button style={{ flex: 2, padding: '14px 0', border: 'none', background: '#1565C0', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>提交</button>
        </div>
      )}
    </div>
  )
}

// ── Bottom Nav ─────────────────────────────────────────────────────────────────

function BottomNav({ activeScreen, onNavigate }: { activeScreen: string; onNavigate: (s: string) => void }) {
  const tabs = [
    { key: 'home', label: '首页', icon: (on: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2L2 9v11h6v-6h6v6h6V9L11 2z" fill={on ? '#1565C0' : 'none'} stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    )},
    { key: 'list', label: '作业', icon: (on: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="2" fill={on ? '#1565C0' : 'none'} stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5"/>
        <path d="M7 8h8M7 12h8M7 16h4" stroke={on ? '#fff' : '#9EAAB8'} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    )},
    { key: 'scan', label: '扫码', icon: (on: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="8" height="8" rx="1.5" fill={on ? '#1565C0' : 'none'} stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5"/>
        <rect x="12" y="2" width="8" height="8" rx="1.5" fill={on ? '#1565C0' : 'none'} stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5"/>
        <rect x="2" y="12" width="8" height="8" rx="1.5" fill={on ? '#1565C0' : 'none'} stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5"/>
        <path d="M14 12h6M14 16h2M18 16v4" stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )},
    { key: 'msg', label: '消息', icon: (on: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M19 3H3a1 1 0 00-1 1v12a1 1 0 001 1h4v3l4-3h8a1 1 0 001-1V4a1 1 0 00-1-1z" fill={on ? '#1565C0' : 'none'} stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    )},
    { key: 'profile', label: '我的', icon: (on: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="4" fill={on ? '#1565C0' : 'none'} stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5"/>
        <path d="M3 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={on ? '#1565C0' : '#9EAAB8'} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )},
  ]
  const activeTab = ['home', 'list', 'scan', 'msg', 'profile'].includes(activeScreen) ? activeScreen : 'home'
  return (
    <div style={{ background: '#fff', borderTop: '1px solid #E0E6ED', display: 'flex', paddingBottom: 8 }}>
      {tabs.map(tab => {
        const on = activeTab === tab.key
        return (
          <button key={tab.key} onClick={() => onNavigate(tab.key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0 4px', background: 'none', border: 'none', cursor: 'pointer' }}>
            {tab.icon(on)}
            <span style={{ fontSize: 10, fontWeight: on ? 600 : 400, color: on ? '#1565C0' : '#9EAAB8' }}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SimpleHeader({ title }: { title: string }) {
  return <div style={{ background: 'linear-gradient(135deg,#0D47A1,#1E88E5)', color: '#fff', paddingBottom: 16 }}><StatusBar/><div style={{ textAlign: 'center', fontSize: 17, fontWeight: 700, paddingTop: 5 }}>{title}</div></div>
}

function ScanScreen() {
  return <div style={{ height: '100%', background: '#101722', color: '#fff' }}><SimpleHeader title="扫码识别"/><div style={{ padding: '48px 28px', textAlign: 'center' }}><div style={{ width: 260, height: 260, margin: '0 auto', border: '2px solid rgba(255,255,255,.45)', borderRadius: 18, position: 'relative', background: 'radial-gradient(circle,#26364a,#151e2a)' }}><div style={{ position: 'absolute', left: 16, right: 16, top: '50%', height: 2, background: '#27D17F', boxShadow: '0 0 12px #27D17F' }}/><div style={{ position: 'absolute', inset: 18, border: '1px dashed rgba(255,255,255,.3)' }}/></div><p style={{ fontSize: 14, color: '#CCD6E2', marginTop: 24 }}>将作业票二维码放入框内，即可查看票证状态</p><button style={{ marginTop: 24, padding: '10px 28px', borderRadius: 22, border: '1px solid rgba(255,255,255,.5)', background: 'rgba(255,255,255,.1)', color: '#fff' }}>从相册识别</button></div></div>
}

function MessageScreen() {
  const [tab,setTab]=useState(0)
  const data=[['审批提醒','您有一张一级动火作业票待审批','10分钟前','#E65100'],['监护预警','DH20260818001 监控设备离线','32分钟前','#C62828'],['系统消息','作业管理制度已更新，请及时查阅','昨天','#1565C0']]
  return <div style={{ height:'100%',background:'#F0F2F5' }}><SimpleHeader title="消息中心"/><div style={{display:'flex',background:'#fff'}}>{['全部','待办','预警'].map((x,i)=><button onClick={()=>setTab(i)} key={x} style={{flex:1,padding:12,border:0,background:'none',color:tab===i?'#1565C0':'#6B7A8D',fontWeight:tab===i?700:400}}>{x}{i>0&&<span style={{marginLeft:4,color:'#C62828'}}>·</span>}</button>)}</div>{data.slice(tab===0?0:tab,tab===0?3:tab+1).map(x=><div key={x[0]} style={{margin:'10px 12px 0',padding:16,background:'#fff',borderRadius:12,display:'flex',gap:12}}><div style={{width:10,height:10,borderRadius:5,background:x[3],marginTop:5}}/><div style={{flex:1}}><b style={{fontSize:14}}>{x[0]}</b><div style={{fontSize:13,color:'#3D4F63',marginTop:7}}>{x[1]}</div></div><span style={{fontSize:11,color:'#9EAAB8'}}>{x[2]}</span></div>)}</div>
}

function ProfileScreen() {
  return <div style={{height:'100%',background:'#F0F2F5'}}><div style={{background:'linear-gradient(135deg,#0D47A1,#1E88E5)',padding:'10px 20px 30px',color:'#fff'}}><StatusBar/><div style={{display:'flex',gap:14,alignItems:'center',marginTop:18}}><div style={{width:58,height:58,borderRadius:29,background:'rgba(255,255,255,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>王</div><div><b style={{fontSize:18}}>王海峰</b><div style={{fontSize:12,opacity:.8,marginTop:5}}>安全管理部 · 作业审批人</div></div></div></div><div style={{margin:'-14px 12px 12px',background:'#fff',borderRadius:14,padding:16,display:'flex',justifyContent:'space-around'}}>{[['12','本月审批'],['3','待处理'],['98%','按时率']].map(x=><div key={x[1]} style={{textAlign:'center'}}><b style={{fontSize:20,color:'#1565C0'}}>{x[0]}</b><div style={{fontSize:11,color:'#9EAAB8',marginTop:4}}>{x[1]}</div></div>)}</div>{['我的作业票','我的监护任务','审批授权','消息设置','帮助与反馈'].map(x=><div key={x} style={{background:'#fff',padding:'15px 18px',borderBottom:'1px solid #F0F2F5',fontSize:14}}>{x}<span style={{float:'right',color:'#9EAAB8'}}>›</span></div>)}</div>
}

// ── Page labels ───────────────────────────────────────────────────────────────

const PAGE_LABELS = ['App-作业管理首页', 'App-作业列表', 'App-作业详情']

// ── Root ──────────────────────────────────────────────────────────────────────

type Screen = 'home' | 'list' | 'detail' | 'todo-list' | 'worktype-list' | 'apply-ticket' | 'worktype-detail' | 'monitor-report' | 'scan' | 'msg' | 'profile'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [todoListTitle, setTodoListTitle] = useState<string>('')
  const [selectedWorkType, setSelectedWorkType] = useState<string>('')

  const handleViewDetail = (id: string) => { setSelectedOrderId(id); setScreen('detail') }
  const handleNavTab = (key: string) => {
    if (['home','list','scan','msg','profile'].includes(key)) setScreen(key as Screen)
  }
  const handleTodoClick = (title: string) => { setTodoListTitle(title); setScreen('todo-list') }
  const handleWorkTypeClick = (type: string) => { setSelectedWorkType(type); setScreen('worktype-list') }

  const showBottomNav = ['home','list','scan','msg','profile'].includes(screen)
  const currentPageIndex = screen === 'home' ? 0 : screen === 'list' ? 1 : 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#E8EEF4', padding: '32px 0 32px' }}>
      {/* App container — 390×844, no outer phone chrome */}
      <div style={{ width: 390, height: 844, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', borderRadius: 12, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {screen === 'home' && (
            <div className="scrollbar-hide" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <HomeBanner onSearch={() => setScreen('list')} />
              <TodoModule onTodoClick={handleTodoClick} />
              <WorkManagementModule onNavigate={() => setScreen('list')} onWorkTypeClick={handleWorkTypeClick} />
              <RecentActivity onViewDetail={handleViewDetail} />
            </div>
          )}
          {screen === 'list' && (
            <WorkListScreen onBack={() => setScreen('home')} onViewDetail={handleViewDetail} />
          )}
          {screen === 'detail' && (
            <WorkDetailScreen orderId={selectedOrderId} onBack={() => setScreen('list')} />
          )}
          {screen === 'todo-list' && (
            <TodoListScreen title={todoListTitle} onBack={() => setScreen('home')} />
          )}
          {screen === 'worktype-list' && (
            <WorkTypeListScreen
              workType={selectedWorkType}
              onBack={() => setScreen('home')}
              onApplyTicket={() => setScreen('apply-ticket')}
              onViewDetail={() => setScreen('worktype-detail')}
            />
          )}
          {screen === 'apply-ticket' && (
            <ApplyTicketScreen workType={selectedWorkType} onBack={() => setScreen('worktype-list')} />
          )}
          {screen === 'worktype-detail' && (
            <WorkTypeDetailScreen workType={selectedWorkType} onBack={() => setScreen('worktype-list')} onMonitorReport={() => setScreen('monitor-report')} />
          )}
          {screen === 'monitor-report' && (
            <MonitoringReportScreen onBack={() => setScreen('worktype-detail')} />
          )}
          {screen === 'scan' && <ScanScreen />}
          {screen === 'msg' && <MessageScreen />}
          {screen === 'profile' && <ProfileScreen />}
        </div>

        {showBottomNav && <BottomNav activeScreen={screen} onNavigate={handleNavTab} />}
      </div>

      {/* Page switcher — below the phone frame */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 390, padding: '0 12px' }}>
        {PAGE_LABELS.map((label, i) => (
          <button key={label} onClick={() => {
            if (i === 0) setScreen('home')
            else if (i === 1) setScreen('list')
            else { setSelectedOrderId(workOrders[0].id); setScreen('detail') }
          }} style={{ padding: '7px 16px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: currentPageIndex === i ? '#1565C0' : 'rgba(255,255,255,0.7)', color: currentPageIndex === i ? '#fff' : '#3D4F63', transition: 'all 0.15s', boxShadow: currentPageIndex === i ? '0 2px 8px rgba(21,101,192,0.4)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
