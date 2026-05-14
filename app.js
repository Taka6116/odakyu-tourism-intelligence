// ==========================================================
// 小田急 観光インテリジェンス — 業務ダッシュボード
// All data: DEMO (synthetic). No personal data; aggregated only.
// ==========================================================

(function () {
  "use strict";

  // ========================================================
  // DEMO DATA
  // ========================================================

  // ----- Dashboard -----
  const ALERT = {
    title: "箱根湯本エリアで来訪集中が高水準",
    text: "週末ピーク帯（10–12時）の集中度が前週比 +6pt。代替ルート誘導の検討を推奨。",
    action: "対応を確認",
  };

  const KPI_DASHBOARD = [
    {
      key: "concentration",
      label: "来訪集中度",
      value: 72, denom: "/ 100",
      delta: { dir: "up", text: "+4 pt", sub: "前週比" },
      icon: "i-target", iconColor: "t-navy",
      decision: "<strong>判断:</strong> 特定ルート・エリアへの集中状況。混雑対策・代替ルート誘導の検討に使います。",
      spark: [55, 58, 60, 62, 65, 68, 72],
    },
    {
      key: "underflow",
      label: "回遊不足エリア",
      value: 3, denom: "エリア",
      delta: { dir: "flat", text: "横ばい", sub: "前月比" },
      icon: "i-flow", iconColor: "t-gold",
      decision: "<strong>判断:</strong> 来訪はあるが周辺回遊が弱いエリア数。周辺施設・別ルートへの誘導を検討します。",
      spark: [4, 4, 3, 3, 4, 3, 3],
    },
    {
      key: "spend-loss",
      label: "消費機会ロス",
      value: "高",
      delta: { dir: "up", text: "拡大傾向", sub: "前月比" },
      icon: "i-yen", iconColor: "t-red",
      decision: "<strong>判断:</strong> 来訪規模に対し購買・施設利用が弱いエリア。クーポン・荷物預かり・案内導線を検討します。",
      spark: [40, 42, 45, 48, 50, 52, 55],
    },
    {
      key: "impact",
      label: "施策効果",
      value: "改善傾向",
      delta: { dir: "up", text: "+8 pt", sub: "効果指数" },
      icon: "i-chart", iconColor: "t-green",
      decision: "<strong>判断:</strong> 実施中施策の反応状況。継続・改善・停止の判断に使います。",
      spark: [50, 52, 55, 58, 60, 64, 68],
    },
  ];

  const PRIORITY_AREAS = [
    { rank: 1, name: "箱根湯本", judge: "来訪は最大級だが消費転換が弱い。乗換前の摩擦解消を優先。", score: 92, scoreBar: "b-red", priority: "high", priorityLabel: "最優先" },
    { rank: 2, name: "強羅",     judge: "回遊余地はあるが施設利用が弱い。体験・飲食導線の強化が候補。", score: 76, scoreBar: "b-red", priority: "high", priorityLabel: "高" },
    { rank: 3, name: "大涌谷",   judge: "ピーク時間帯の集中が顕著。代替ルートへの案内強化を検討。",   score: 68, scoreBar: "b-gold", priority: "medium", priorityLabel: "中" },
    { rank: 4, name: "小田原",   judge: "乗換待ち時間が常時発生。短時間消費導線の設計余地。",         score: 54, scoreBar: "b-gold", priority: "medium", priorityLabel: "中" },
    { rank: 5, name: "仙石原",   judge: "来訪は少ないが消費効率が高い。誘導強化候補。",               score: 41, scoreBar: "b-green", priority: "low", priorityLabel: "低" },
  ];

  const RECOMMENDED_ACTIONS = [
    {
      title: "箱根湯本: 食べ歩きルート案内と荷物預かりの拡充",
      sub: "来訪過多と消費転換弱の組み合わせ。乗換前の摩擦を取り除き、滞在時間を延ばす。",
      tags: [["t-red", "最優先"], ["t-navy", "対象 / 箱根湯本"]],
    },
    {
      title: "雨天時の屋内回遊ルート案内",
      sub: "天候による回遊変化に対応。美術館・温泉・カフェの半日ルートを天気予報と連動して案内。",
      tags: [["t-gold", "高"], ["t-blue", "対象 / 全エリア"]],
    },
    {
      title: "仙石原への分散誘導案内",
      sub: "王道ルート混雑時の代替先として認知強化。少ない来訪で消費効率が高い。",
      tags: [["t-green", "誘導強化"], ["t-navy", "対象 / 仙石原"]],
    },
    {
      title: "強羅 体験予約クーポンの導入検討",
      sub: "移動はあるが消費が弱い。体験・工芸・飲食への導線強化を比較検証する案。",
      tags: [["t-gold", "高"], ["t-navy", "対象 / 強羅"]],
    },
  ];

  // Trend chart data (week 1–7 indices for top areas)
  const TREND_AREAS = [
    { name: "箱根湯本", color: "#1f4775", data: [78, 80, 82, 85, 87, 90, 92] },
    { name: "大涌谷",   color: "#0a8e6b", data: [62, 64, 65, 68, 72, 70, 68] },
    { name: "強羅",     color: "#b07712", data: [50, 52, 53, 56, 58, 60, 62] },
    { name: "仙石原",   color: "#6d4ee0", data: [32, 34, 33, 36, 38, 40, 42] },
  ];
  const TREND_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];

  const COMPOSITION = [
    { name: "箱根湯本", val: 32, bar: "" },
    { name: "大涌谷",   val: 24, bar: "c-green" },
    { name: "強羅",     val: 18, bar: "c-gold" },
    { name: "小田原",   val: 14, bar: "c-blue" },
    { name: "仙石原",   val: 12, bar: "c-violet" },
  ];

  // ----- Area Analysis -----
  const AREAS = [
    {
      name: "箱根湯本", sub: "ゲートウェイ / 鉄道・バス",
      visit: 92, flow: 58, spend: 34, crowd: "高",
      priority: "high", priorityLabel: "最優先",
      state: "来訪は多いが消費転換が弱い",
      decision: "荷物・待ち時間・乗換前消費の改善を優先",
    },
    {
      name: "大涌谷", sub: "王道観光 / 観光ピーク",
      visit: 88, flow: 81, spend: 61, crowd: "高",
      priority: "medium", priorityLabel: "中",
      state: "ピーク時の集中度が高く、混雑による満足度低下リスク",
      decision: "代替ルートと時間帯シフトの案内強化を検討",
    },
    {
      name: "強羅", sub: "中継・宿泊エリア",
      visit: 58, flow: 65, spend: 30, crowd: "中",
      priority: "high", priorityLabel: "高",
      state: "回遊余地があるが施設利用が弱い",
      decision: "体験・飲食・短時間滞在プランを強化",
    },
    {
      name: "仙石原", sub: "観光・自然散策",
      visit: 36, flow: 48, spend: 68, crowd: "低",
      priority: "low", priorityLabel: "低",
      state: "来訪は少ないが消費効率が高い",
      decision: "王道ルート混雑時の代替誘導先として強化",
    },
    {
      name: "小田原", sub: "乗換 / 沿線玄関口",
      visit: 61, flow: 38, spend: 44, crowd: "中",
      priority: "medium", priorityLabel: "中",
      state: "乗換客の滞留時間がある一方で街区消費が弱い",
      decision: "改札外の短時間消費導線と提携店案内を検討",
    },
  ];

  const SEGMENTS = [
    { seg: "国内 ファミリー",  visit: 78, spend: 52, hint: "週末・10〜14時に集中" },
    { seg: "国内 カップル",    visit: 65, spend: 58, hint: "高単価カフェ・体験利用が強い" },
    { seg: "インバウンド 英語", visit: 42, spend: 64, hint: "Web閲覧→来訪のギャップが要確認" },
    { seg: "インバウンド 繁体字", visit: 38, spend: 55, hint: "免税ピーク時間帯あり" },
    { seg: "シニア層",          visit: 48, spend: 40, hint: "平日午前帯の滞留が多い" },
  ];

  // ----- Flow Analysis -----
  const FLOW_KPIS = [
    { label: "王道ルート集中度", value: 72, denom: "/ 100", decision: "代替誘導の必要性を判断", icon: "i-target", iconColor: "t-navy", delta: { dir: "up", text: "+4 pt" }, spark: [60, 62, 65, 67, 68, 70, 72] },
    { label: "非王道率",         value: 28, denom: "/ 100", decision: "分散誘導の余地を判断",     icon: "i-flow",   iconColor: "t-green", delta: { dir: "down", text: "-2 pt" }, spark: [32, 31, 30, 30, 29, 28, 28] },
    { label: "天候影響度",       value: "中", denom: "",   decision: "天候連動施策の優先度を判断", icon: "i-cloud-rain", iconColor: "t-gold", delta: { dir: "flat", text: "横ばい" }, spark: [3,3,3,3,3,3,3] },
  ];

  const ROUTE_FLOW = {
    primary: ["箱根湯本", "大涌谷", "芦ノ湖"],
    candidates: ["強羅", "仙石原", "小田原 周辺"],
    judgment: "<strong>判断:</strong> 王道ルートの集中度が <strong>72/100</strong> と高水準。混雑時間帯（土日 10〜12時）には <strong>仙石原・強羅方面</strong> への代替案内を強化することを推奨します。",
  };

  // time heatmap: rows = area, cols = time bucket, value = level 1-5
  const TIME_HEATMAP = {
    cols: ["8時", "10時", "12時", "14時", "16時", "18時"],
    rows: [
      { area: "箱根湯本", v: [2, 5, 4, 4, 3, 2] },
      { area: "大涌谷",   v: [1, 4, 5, 4, 2, 1] },
      { area: "強羅",     v: [1, 2, 3, 4, 3, 2] },
      { area: "仙石原",   v: [1, 2, 2, 3, 2, 1] },
      { area: "小田原",   v: [2, 3, 3, 3, 3, 4] },
    ],
  };

  const WEATHER_FLOW = [
    { label: "晴天",   icon: null, primary: 78, secondary: 22, change: "+5 pt", changeDir: "up",   note: "屋外スポット集中" },
    { label: "曇天",   icon: null, primary: 65, secondary: 35, change: "±0",    changeDir: "flat", note: "平準的な分布" },
    { label: "雨天",   icon: "i-cloud-rain", primary: 42, secondary: 58, change: "-12 pt", changeDir: "down", note: "屋内・温泉・カフェへシフト" },
  ];

  const WEEKDAY_FLOW = [
    { label: "月-木",  primary: 48, change: "標準",     changeDir: "flat" },
    { label: "金",     primary: 62, change: "+14 pt",   changeDir: "up" },
    { label: "土",     primary: 91, change: "+43 pt",   changeDir: "up" },
    { label: "日",     primary: 84, change: "+36 pt",   changeDir: "up" },
    { label: "祝日",   primary: 88, change: "+40 pt",   changeDir: "up" },
  ];

  // ----- Spend Matrix data (positions in matrix) -----
  // x: visit (0-100), y: spend (0-100); we map to position
  const SPEND_AREAS = [
    { name: "箱根湯本", v: 92, s: 34, cls: "priority-a", label: "箱湯" },
    { name: "大涌谷",   v: 88, s: 61, cls: "priority-c", label: "大涌" },
    { name: "強羅",     v: 58, s: 30, cls: "priority-a", label: "強羅" },
    { name: "小田原",   v: 61, s: 44, cls: "priority-b", label: "小田" },
    { name: "仙石原",   v: 36, s: 68, cls: "priority-b", label: "仙石" },
    { name: "塔ノ沢",   v: 24, s: 32, cls: "priority-d", label: "塔ノ" },
  ];

  const SPEND_LOSS = [
    { area: "箱根湯本", visit: 92, spend: 34, gap: -58, hint: "乗換前消費の摩擦が要因候補" },
    { area: "強羅",     visit: 58, spend: 30, gap: -28, hint: "体験・飲食導線が弱い" },
    { area: "大涌谷",   visit: 88, spend: 61, gap: -27, hint: "高単価素材の活用余地あり" },
    { area: "小田原",   visit: 61, spend: 44, gap: -17, hint: "乗換客の街歩き転換が課題" },
  ];

  const SPEND_EFF = [
    { area: "仙石原", visit: 36, spend: 68, eff: "+32", hint: "誘導強化候補。混雑時の代替先に有効" },
    { area: "大涌谷", visit: 88, spend: 61, eff: "+6",  hint: "高単価素材の伸び余地" },
    { area: "湯本商店街", visit: 44, spend: 62, eff: "+18", hint: "短時間消費の効率が高い" },
  ];

  // ----- Initiatives -----
  const INIT_FILTERS = [
    { id: "all", label: "すべて" },
    { id: "running", label: "実施中" },
    { id: "consider", label: "検討中" },
    { id: "review", label: "要確認" },
    { id: "done", label: "完了" },
  ];

  const INITIATIVES = [
    {
      id: "i01",
      title: "雨天時の屋内回遊ルート案内",
      status: "running", statusLabel: "実施中",
      priority: "p-high", priorityLabel: "優先度 高",
      area: "箱根湯本・強羅",
      reason: "雨天時に屋外スポットへの流れが弱まり、駅周辺の滞留が増えるため。",
      effect: "滞在時間と施設利用の向上",
      task: "天気予報と連動した案内表示・QR配布・パートナー店舗連携",
      kpis: ["ルート閲覧率", "クーポン利用率", "対象施設利用率"],
      meta: [["t-red", "雨天連動"], ["t-blue", "QR"]],
    },
    {
      id: "i02",
      title: "箱根湯本 食べ歩きパスと荷物預かり拡充",
      status: "running", statusLabel: "実施中",
      priority: "p-high", priorityLabel: "優先度 高",
      area: "箱根湯本",
      reason: "来訪は多いが消費転換が弱く、乗換前の摩擦が要因候補のため。",
      effect: "湯本周辺の消費転換 +6 pt",
      task: "提携店舗の食べ歩きパス、荷物預かり拠点の拡充、案内マップ更新",
      kpis: ["食べ歩きパス利用率", "湯本周辺購買指数"],
      meta: [["t-red", "消費転換"], ["t-navy", "対象 / 箱根湯本"]],
    },
    {
      id: "i03",
      title: "大涌谷集中時の代替ルート案内",
      status: "consider", statusLabel: "検討中",
      priority: "p-high", priorityLabel: "優先度 高",
      area: "箱根全域",
      reason: "週末ピーク帯の集中度が +6 pt 上昇傾向のため。",
      effect: "王道集中度 -5 pt",
      task: "混雑検知時のサイネージ・アプリ通知・代替先紹介ページ",
      kpis: ["集中度推移", "代替先到達率"],
      meta: [["t-gold", "混雑対策"], ["t-blue", "サイネージ"]],
    },
    {
      id: "i04",
      title: "仙石原への分散誘導キャンペーン",
      status: "consider", statusLabel: "検討中",
      priority: "p-med", priorityLabel: "優先度 中",
      area: "仙石原",
      reason: "来訪は少ないが消費効率が高く、誘導余地が大きいため。",
      effect: "仙石原 来訪指数 +12 pt",
      task: "ロマンスカー予約完了画面での訴求、サイネージでの代替先表示",
      kpis: ["仙石原 来訪指数", "客単価指数"],
      meta: [["t-green", "分散誘導"], ["t-navy", "対象 / 仙石原"]],
    },
    {
      id: "i05",
      title: "強羅 体験予約クーポンの比較検証",
      status: "review", statusLabel: "要確認",
      priority: "p-med", priorityLabel: "優先度 中",
      area: "強羅",
      reason: "移動はあるが消費が弱く、体験素材の有効性を確認したいため。",
      effect: "強羅周辺消費 +5 pt",
      task: "体験予約クーポン2案を14日比較。利用率と消費影響を確認。",
      kpis: ["クーポン利用率", "強羅周辺購買指数"],
      meta: [["t-gold", "要確認"], ["t-blue", "比較検証"]],
    },
    {
      id: "i06",
      title: "小田原 改札外の短時間消費導線",
      status: "consider", statusLabel: "検討中",
      priority: "p-med", priorityLabel: "優先度 中",
      area: "小田原",
      reason: "乗換待ち15〜30分の層が常時発生しているため。",
      effect: "提携店利用率 +4 pt",
      task: "改札外サイネージ、提携店クーポン、街区マップ案内",
      kpis: ["乗換客 街区流入率", "提携店利用率"],
      meta: [["t-gold", "短時間消費"], ["t-navy", "対象 / 小田原"]],
    },
    {
      id: "i07",
      title: "多言語モデルコース最適化",
      status: "running", statusLabel: "実施中",
      priority: "p-med", priorityLabel: "優先度 中",
      area: "沿線全域",
      reason: "Web閲覧の言語比と来訪のギャップが大きいため。",
      effect: "外国語来訪転換率 +8 pt",
      task: "英語・繁体字・タイ語のモデルコースを言語別に最適化",
      kpis: ["閲覧→来訪転換率", "外国語クーポン利用率"],
      meta: [["t-blue", "インバウンド"], ["t-green", "多言語"]],
    },
    {
      id: "i08",
      title: "湯本商店街 食事処連携の検討",
      status: "consider", statusLabel: "検討中",
      priority: "p-low", priorityLabel: "優先度 低",
      area: "湯本商店街",
      reason: "短時間消費の効率が高く、連携拡大の余地があるため。",
      effect: "湯本商店街 滞在時間 +12分",
      task: "提携先候補20店との条件擦り合わせ",
      kpis: ["連携店舗数", "提携店利用率"],
      meta: [["t-navy", "連携"]],
    },
    {
      id: "i09",
      title: "免税ピーク時間帯の店舗案内",
      status: "done", statusLabel: "完了",
      priority: "p-low", priorityLabel: "優先度 低",
      area: "箱根全域",
      reason: "免税利用に時間帯偏在があるため。",
      effect: "免税利用件数 +14%",
      task: "アプリ通知・サイネージで近接店舗を表示。",
      kpis: ["免税利用件数", "免税平均単価"],
      meta: [["t-green", "完了"]],
    },
  ];

  // ----- Impact — Gantt + KPI Management -----
  // status: "running" | "review" | "consider" | "done"
  // startCol / endCol: 0-indexed column in the 6-month timeline (0 = Jan)
  const GANTT_MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月"];
  const GANTT_INITIATIVES = [
    {
      id: "g01",
      title: "雨天時の屋内回遊ルート案内",
      area: "箱根湯本・強羅",
      status: "running", statusLabel: "実施中",
      startCol: 1, endCol: 4,
      owner: "観光戦略部",
    },
    {
      id: "g02",
      title: "食べ歩きパス＋荷物預かり拡充",
      area: "箱根湯本",
      status: "running", statusLabel: "実施中",
      startCol: 2, endCol: 5,
      owner: "沿線事業部",
    },
    {
      id: "g03",
      title: "多言語モデルコース最適化",
      area: "沿線全域",
      status: "review", statusLabel: "要確認",
      startCol: 0, endCol: 3,
      owner: "訪日対応TF",
    },
    {
      id: "g04",
      title: "強羅 体験予約クーポン比較検証",
      area: "強羅",
      status: "review", statusLabel: "要確認",
      startCol: 3, endCol: 5,
      owner: "箱根担当",
    },
    {
      id: "g05",
      title: "仙石原 分散誘導 SNS連携",
      area: "仙石原",
      status: "consider", statusLabel: "検討中",
      startCol: 4, endCol: 5,
      owner: "マーケ部",
    },
    {
      id: "g06",
      title: "免税ピーク時間帯 店舗案内",
      area: "箱根全域",
      status: "done", statusLabel: "完了",
      startCol: 0, endCol: 2,
      owner: "インバウンドTF",
    },
  ];

  // ----- Referral Optimization (送客最適化) -----
  // KPI: stateTone は state-pill の色トーン用（high=red系, mid=gold系, ok=green系, neutral=navy系）
  let REFERRAL_KPIS = [
    {
      label: "送客機会スコア",
      value: 78, denom: "/ 100",
      icon: "i-map", iconColor: "t-navy",
      decision: "誘導先として活用できるエリア・施設の余地を示します。",
      delta: { dir: "up", text: "+4" },
      spark: [62, 65, 68, 70, 73, 76, 78],
    },
    {
      label: "消費機会ロス",
      value: "高", denom: "",
      icon: "i-yen", iconColor: "t-red",
      decision: "来訪はあるが購買・施設利用につながっていない状態です。",
      delta: { dir: "flat", text: "横ばい" },
      spark: [70, 72, 71, 73, 72, 73, 72],
    },
    {
      label: "推奨施策",
      value: 6, denom: "件",
      icon: "i-ticket", iconColor: "t-gold",
      decision: "優先的に検討すべき案内・クーポン施策です。",
      delta: { dir: "up", text: "+2" },
      spark: [3, 3, 4, 4, 5, 5, 6],
    },
    {
      label: "実施中施策",
      value: 3, denom: "件",
      icon: "i-target", iconColor: "t-green",
      decision: "現在配信・運用中の施策です。",
      delta: { dir: "up", text: "+1" },
      spark: [1, 1, 2, 2, 2, 3, 3],
    },
  ];

  const REFERRAL_AREAS = [
    {
      area: "箱根湯本",
      state: "来訪多・消費弱", stateCls: "tone-warn",
      decide: "食べ歩きルートと荷物預かり案内",
      priority: "最優先", priorityCls: "high",
      effect: "乗換前消費の改善",
    },
    {
      area: "強羅",
      state: "回遊余地あり", stateCls: "tone-attention",
      decide: "工芸体験・飲食クーポンの比較検証",
      priority: "高", priorityCls: "high",
      effect: "体験予約と飲食利用の増加",
    },
    {
      area: "仙石原",
      state: "消費効率高", stateCls: "tone-good",
      decide: "王道混雑時の代替誘導先として案内",
      priority: "中", priorityCls: "medium",
      effect: "分散誘導と高単価利用の増加",
    },
    {
      area: "小田原",
      state: "乗換滞留あり", stateCls: "tone-neutral",
      decide: "改札外の短時間消費導線を案内",
      priority: "中", priorityCls: "medium",
      effect: "乗換時間中の街区利用増加",
    },
  ];

  // Offers — incl. drawer-only fields (content, observe, next)
  const REFERRAL_OFFERS = [
    {
      id: "of01",
      title: "箱根湯本 食べ歩きクーポン",
      area: "箱根湯本",
      channels: ["Web/App", "QR"],
      reason: "来訪は多いが消費転換が弱く、乗換前の短時間消費に余地があるため。",
      kpis: ["クーポン利用率", "湯本周辺購買指数"],
      priority: "最優先", priorityCls: "high",
      content: "湯本駅出口・商店街サイネージで配布。対象店舗20店、利用条件1,000円以上。",
      observe: ["クーポン取得数", "対象店舗売上指数", "湯本周辺購買指数"],
      next: "2週間配信後、利用率15%未達であれば対象店舗の構成を見直し。",
    },
    {
      id: "of02",
      title: "雨天時 屋内回遊ルート",
      area: "箱根湯本・強羅",
      channels: ["Web/App", "サイネージ"],
      reason: "雨天時は屋外スポットへの流れが弱まり、屋内施設への案内余地があるため。",
      kpis: ["ルート閲覧率", "対象施設利用率"],
      priority: "高", priorityCls: "high",
      content: "天気APIと連動し、雨天予報時にアプリ通知と駅サイネージで屋内ルートを提示。",
      observe: ["ルート閲覧率", "対象施設利用率", "雨天時の回遊指数"],
      next: "雨天回数の少ない月は仙石原方面の屋内施設にも対象を広げ検証。",
    },
    {
      id: "of03",
      title: "仙石原 体験施設誘導",
      area: "仙石原",
      channels: ["Web/App", "サイネージ"],
      reason: "来訪は少ないが消費効率が高く、王道混雑時の代替誘導先として有効なため。",
      kpis: ["仙石原来訪指数", "体験施設利用率"],
      priority: "中", priorityCls: "medium",
      content: "王道ルートが混雑指数70超のときに、仙石原方面の体験施設をアプリ・サイネージで案内。",
      observe: ["仙石原来訪指数", "体験施設利用率", "代替誘導クリック率"],
      next: "1ヶ月後に分散誘導効果を確認し、混雑時定常運用へ移行するか判断。",
    },
    {
      id: "of04",
      title: "強羅 工芸体験予約クーポン",
      area: "強羅",
      channels: ["QR", "Web/App"],
      reason: "回遊はあるが施設利用が弱く、体験予約への導線強化が必要なため。",
      kpis: ["予約クリック率", "クーポン利用率"],
      priority: "高", priorityCls: "high",
      content: "強羅駅周辺と提携施設にQRを設置し、工芸体験予約への遷移と1,000円OFFを提供。",
      observe: ["予約クリック率", "クーポン利用率", "強羅施設利用指数"],
      next: "提携施設別の利用差を比較し、効果の高い施設構成に絞り込み。",
    },
  ];

  // x = 来訪指数 (visit), y = 消費指数 (spend), 0–100
  const REFERRAL_MATRIX = [
    { name: "箱根湯本", visit: 88, spend: 38, tag: "最優先改善",   tagCls: "tone-warn"      },
    { name: "大涌谷",   visit: 72, spend: 55, tag: "維持・単価向上", tagCls: "tone-good"      },
    { name: "強羅",     visit: 64, spend: 42, tag: "改善余地",     tagCls: "tone-attention" },
    { name: "仙石原",   visit: 36, spend: 68, tag: "誘導強化",     tagCls: "tone-info"      },
    { name: "小田原",   visit: 30, spend: 34, tag: "優先度低",     tagCls: "tone-neutral"   },
  ];

  const REFERRAL_FUNNEL = [
    { label: "表示",    value: 100, hint: "案内・クーポンの表示数" },
    { label: "クリック", value: 42,  hint: "詳細閲覧・遷移の発生" },
    { label: "保存",    value: 26,  hint: "クーポン取得・保存" },
    { label: "利用",    value: 14,  hint: "店舗・施設での利用" },
    { label: "回遊変化", value: 9,   hint: "対象エリアへの来訪変化" },
  ];

  // Filter response variants (KPI 値のスケーリングだけ少し動かす)
  const REFERRAL_FILTER_VARIANTS = {
    "hakone":   { score: 78, loss: "高", rec: 6, run: 3 },
    "enoshima": { score: 64, loss: "中", rec: 3, run: 1 },
    "line":     { score: 72, loss: "高", rec: 6, run: 3 },
  };

  // Per-offer runtime state (holds across re-renders within session)
  const offerState = {}; // { [offerId]: { status: "added" | "held" | null } }

  // ----- Reports -----
  const REPORTS = [
    { title: "2026年4月 週次レポート", meta: "PDF · 12ページ · 2026-04-22 作成", icon: "i-doc" },
    { title: "箱根エリア 消費機会ロス分析", meta: "PDF · 18ページ · 2026-04-15 作成", icon: "i-yen" },
    { title: "施策効果 中間レビュー", meta: "PDF · 9ページ · 2026-04-08 作成", icon: "i-chart" },
    { title: "2026年3月 月次レポート", meta: "PDF · 24ページ · 2026-04-01 作成", icon: "i-doc" },
  ];

  const TEMPLATES = [
    { name: "経営向けサマリー", desc: "主要指標と判断ポイントを1ページで", icon: "i-dashboard", tone: "t-navy" },
    { name: "エリア別詳細",     desc: "エリアごとのスコアと判断", icon: "i-pin", tone: "t-blue" },
    { name: "施策進捗レポート", desc: "実施中施策の効果と次アクション", icon: "i-target", tone: "" },
    { name: "週次運用レポート", desc: "週次集計と推奨アクション", icon: "i-calendar", tone: "t-gold" },
  ];

  // ========================================================
  // HELPERS
  // ========================================================
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (v == null || v === false) return;
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k === "style") node.setAttribute("style", v);
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
      });
    }
    if (children != null) {
      const arr = Array.isArray(children) ? children : [children];
      arr.forEach((c) => {
        if (c == null || c === false) return;
        node.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
      });
    }
    return node;
  }

  function mount(id, content) {
    const host = document.getElementById(id);
    if (!host) return;
    host.innerHTML = "";
    const arr = Array.isArray(content) ? content : [content];
    arr.forEach((c) => c && host.appendChild(c));
  }

  function icon(name, cls) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    if (cls) svg.setAttribute("class", cls);
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + name);
    svg.appendChild(use);
    return svg;
  }

  function tag(cls, text) {
    return el("span", { class: "tag " + (cls || "") }, text);
  }

  function deltaBadge(d) {
    const cls = "kpi-delta " + (d.dir === "up" ? "up" : d.dir === "down" ? "down" : "flat");
    const arrow = d.dir === "up" ? icon("i-arrow-up") : d.dir === "down" ? icon("i-arrow-down") : null;
    const span = el("span", { class: cls });
    if (arrow) span.appendChild(arrow);
    span.appendChild(document.createTextNode(d.text));
    return span;
  }

  // Sparkline as inline SVG
  function sparkline(values, color) {
    const w = 100, h = 30, pad = 2;
    const min = Math.min(...values), max = Math.max(...values);
    const range = Math.max(1, max - min);
    const stepX = (w - pad * 2) / (values.length - 1);
    const points = values.map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + (h - pad * 2) * (1 - (v - min) / range);
      return [x, y];
    });
    const path = points.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const areaPath = path + ` L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("class", "kpi-spark");
    const area = document.createElementNS(ns, "path");
    area.setAttribute("d", areaPath);
    area.setAttribute("fill", color);
    area.setAttribute("opacity", "0.10");
    svg.appendChild(area);
    const line = document.createElementNS(ns, "path");
    line.setAttribute("d", path);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "1.6");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    svg.appendChild(line);
    return svg;
  }

  function renderKpiCard(k) {
    const sparkColor = ({
      "t-navy": "#1f4775",
      "t-gold": "#b07712",
      "t-red":  "#c0392b",
      "t-green":"#0a8e6b",
    })[k.iconColor] || "#1f4775";

    const card = el("div", { class: "kpi-card" });
    const head = el("div", { class: "kpi-head" }, [
      el("div", { class: "kpi-label" }, k.label),
      el("div", { class: "kpi-pill-icon " + k.iconColor }, icon(k.icon)),
    ]);
    card.appendChild(head);

    const valRow = el("div", { class: "kpi-value-row" }, [
      el("div", { class: "kpi-value" }, String(k.value)),
      k.denom ? el("div", { class: "kpi-value-unit" }, k.denom) : null,
      k.delta ? deltaBadge(k.delta) : null,
    ]);
    card.appendChild(valRow);
    if (k.spark) card.appendChild(sparkline(k.spark, sparkColor));
    if (k.decision) card.appendChild(el("div", { class: "kpi-decision", html: k.decision }));
    return card;
  }

  // ========================================================
  // DASHBOARD
  // ========================================================
  function renderAlertBar() {
    const wrap = document.getElementById("alert-bar");
    if (!wrap) return;
    wrap.innerHTML = "";
    const bar = el("div", { class: "alert-bar" }, [
      el("div", { class: "alert-icon" }, icon("i-alert")),
      el("div", { class: "alert-body" }, [
        el("div", { class: "alert-title" }, ALERT.title),
        el("div", { class: "alert-text" }, ALERT.text),
      ]),
      el("div", { class: "alert-actions" }, [
        el("button", { class: "btn-ghost btn-sm" }, "後で"),
        el("button", { class: "btn-primary btn-sm" }, ALERT.action),
      ]),
    ]);
    wrap.replaceWith(bar);
    bar.id = "alert-bar";
  }

  function renderKpis() {
    const wrap = el("div", { class: "kpi-grid" });
    KPI_DASHBOARD.forEach((k) => wrap.appendChild(renderKpiCard(k)));
    mount("kpi-grid", Array.from(wrap.children));
  }

  function renderPriorityAreas() {
    const list = el("div", { class: "priority-list" });
    PRIORITY_AREAS.forEach((a) => {
      const row = el("div", { class: "priority-row" });
      row.appendChild(el("div", { class: "pri-rank" }, "#" + a.rank));
      row.appendChild(el("div", { class: "pri-area" }, [
        el("div", { class: "pri-area-name" }, a.name),
        el("div", { class: "pri-area-judge" }, a.judge),
      ]));
      const score = el("div", { class: "pri-score" }, [
        el("div", { class: "pri-score-label" }, "優先度スコア"),
        el("div", { class: "pri-score-bar " + a.scoreBar }, el("span", { style: "width:" + a.score + "%" })),
      ]);
      row.appendChild(score);
      row.appendChild(el("div", { class: "pri-score-val" }, a.score + " / 100"));
      row.appendChild(el("span", { class: "pri-badge " + a.priority }, a.priorityLabel));
      list.appendChild(row);
    });
    mount("priority-areas", list);
  }

  function renderRecommendedActions() {
    const list = el("div", { class: "rec-list" });
    RECOMMENDED_ACTIONS.forEach((a, i) => {
      const item = el("div", { class: "rec-item" });
      item.appendChild(el("div", { class: "rec-num" }, String(i + 1)));
      const body = el("div", { class: "rec-body" });
      body.appendChild(el("div", { class: "rec-title" }, a.title));
      body.appendChild(el("div", { class: "rec-sub" }, a.sub));
      const meta = el("div", { class: "rec-meta" });
      a.tags.forEach(([cls, text]) => meta.appendChild(tag(cls, text)));
      body.appendChild(meta);
      item.appendChild(body);
      list.appendChild(item);
    });
    mount("recommended-actions", list);
  }

  // ---- Trend chart SVG ----
  function renderTrendChart() {
    const w = 720, h = 220;
    const padL = 36, padR = 16, padT = 12, padB = 28;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    const nCols = TREND_LABELS.length;
    const stepX = innerW / (nCols - 1);
    const all = TREND_AREAS.flatMap((a) => a.data);
    const maxY = Math.ceil(Math.max(...all) / 10) * 10;
    const minY = 0;
    const yToPx = (val) => padT + innerH * (1 - (val - minY) / (maxY - minY));
    const xToPx = (i) => padL + i * stepX;

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("class", "trend-chart-svg");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "エリア別 来訪指数の週次推移");

    // Grid
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const val = (maxY / ticks) * i;
      const y = yToPx(val);
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", padL); line.setAttribute("x2", w - padR);
      line.setAttribute("y1", y); line.setAttribute("y2", y);
      line.setAttribute("class", "trend-grid");
      svg.appendChild(line);
      const label = document.createElementNS(ns, "text");
      label.setAttribute("x", padL - 8);
      label.setAttribute("y", y + 3);
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "trend-axis-y");
      label.textContent = Math.round(val);
      svg.appendChild(label);
    }
    // X axis labels
    TREND_LABELS.forEach((lab, i) => {
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", xToPx(i));
      t.setAttribute("y", h - 8);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("class", "trend-axis-x");
      t.textContent = lab;
      svg.appendChild(t);
    });

    // Lines
    TREND_AREAS.forEach((series) => {
      const path = series.data.map((v, i) => (i === 0 ? "M" : "L") + xToPx(i).toFixed(1) + " " + yToPx(v).toFixed(1)).join(" ");
      const line = document.createElementNS(ns, "path");
      line.setAttribute("d", path);
      line.setAttribute("stroke", series.color);
      line.setAttribute("stroke-width", "1.8");
      line.setAttribute("fill", "none");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke-linejoin", "round");
      svg.appendChild(line);
      // dots
      series.data.forEach((v, i) => {
        const c = document.createElementNS(ns, "circle");
        c.setAttribute("cx", xToPx(i));
        c.setAttribute("cy", yToPx(v));
        c.setAttribute("r", i === series.data.length - 1 ? 3.6 : 0);
        c.setAttribute("fill", series.color);
        svg.appendChild(c);
      });
    });

    const wrap = el("div", { class: "trend-chart" });
    wrap.appendChild(svg);
    mount("trend-chart", wrap);

    // Legend
    const legend = el("div", { class: "legend" });
    TREND_AREAS.forEach((s) => {
      const item = el("div", { class: "legend-item" }, [
        el("span", { class: "legend-dot", style: "background:" + s.color }),
        s.name,
      ]);
      legend.appendChild(item);
    });
    mount("trend-legend", Array.from(legend.children));
  }

  function renderComposition() {
    const list = el("div", { class: "comp-list" });
    COMPOSITION.forEach((c) => {
      const row = el("div", { class: "comp-row" }, [
        el("div", { class: "comp-name" }, c.name),
        el("div", { class: "comp-bar " + (c.bar || "") }, el("span", { style: "width:" + c.val + "%" })),
        el("div", { class: "comp-val" }, c.val + "%"),
      ]);
      list.appendChild(row);
    });
    mount("area-composition", list);
  }

  // ========================================================
  // AREA ANALYSIS
  // ========================================================
  function renderAreaTable() {
    const table = el("table", { class: "data-table" });
    table.appendChild(el("thead", null, el("tr", null, [
      el("th", null, "エリア"),
      el("th", null, "来訪指数"),
      el("th", null, "回遊指数"),
      el("th", null, "消費指数"),
      el("th", null, "混雑傾向"),
      el("th", null, "優先度"),
      el("th", null, "推奨判断"),
    ])));
    const tbody = el("tbody");
    AREAS.forEach((a) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("div", { class: "td-area" }, [
          el("span", { class: "td-strong" }, a.name),
          el("span", { class: "td-area-sub" }, a.sub),
        ])),
        el("td", null, scoreCell(a.visit, "b-red")),
        el("td", null, scoreCell(a.flow, "b-gold")),
        el("td", null, scoreCell(a.spend, "b-green")),
        el("td", null, crowdBadge(a.crowd)),
        el("td", null, el("span", { class: "pri-badge " + a.priority }, a.priorityLabel)),
        el("td", null, a.decision),
      ]));
    });
    table.appendChild(tbody);
    mount("area-table", table);
  }
  function scoreCell(v, barCls) {
    const wrap = el("div", { class: "td-score" });
    const bar = el("div", { class: "td-score-bar " + (barCls || "") });
    bar.appendChild(el("span", { style: "width:" + v + "%" }));
    wrap.appendChild(bar);
    wrap.appendChild(el("span", { class: "td-score-val" }, String(v)));
    return wrap;
  }
  function crowdBadge(level) {
    const map = { "高": "high", "中": "medium", "低": "low" };
    return el("span", { class: "pri-badge " + (map[level] || "flat") }, level);
  }

  function renderAreaJudgment() {
    const list = el("div", { class: "judgment-list" });
    AREAS.forEach((a) => {
      const cls = a.priority === "high" ? "j-red" : a.priority === "medium" ? "j-gold" : "j-green";
      const item = el("div", { class: "judgment-item " + cls });
      item.appendChild(el("div", { class: "j-area" }, [
        a.name,
        el("span", { class: "pri-badge " + a.priority }, a.priorityLabel),
      ]));
      item.appendChild(el("div", { class: "j-state" }, "状態: " + a.state));
      item.appendChild(el("div", { class: "j-decide" }, a.decision));
      list.appendChild(item);
    });
    mount("area-judgment", list);
  }

  function renderSegmentTable() {
    const table = el("table", { class: "data-table" });
    table.appendChild(el("thead", null, el("tr", null, [
      el("th", null, "セグメント"),
      el("th", null, "来訪指数"),
      el("th", null, "消費指数"),
      el("th", null, "特徴"),
    ])));
    const tbody = el("tbody");
    SEGMENTS.forEach((s) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, s.seg)),
        el("td", null, scoreCell(s.visit, "")),
        el("td", null, scoreCell(s.spend, "b-green")),
        el("td", null, s.hint),
      ]));
    });
    table.appendChild(tbody);
    mount("segment-table", table);
  }

  // ========================================================
  // FLOW ANALYSIS
  // ========================================================
  function renderFlowKpis() {
    const wrap = el("div", { class: "kpi-grid kpi-grid-3" });
    FLOW_KPIS.forEach((k) => wrap.appendChild(renderKpiCard(k)));
    mount("flow-kpis", Array.from(wrap.children));
  }

  function renderRouteFlow() {
    const wrap = el("div", { class: "route-flow" });
    const row1 = el("div", { class: "flow-row" });
    row1.appendChild(makeFlowNode("現在集中ルート", ROUTE_FLOW.primary, "primary"));
    wrap.appendChild(row1);
    wrap.appendChild(arrowDown());
    const row2 = el("div", { class: "flow-row" });
    row2.appendChild(makeFlowNode("代替誘導候補", ROUTE_FLOW.candidates, "candidate"));
    wrap.appendChild(row2);
    wrap.appendChild(el("div", { class: "flow-judgment", html: ROUTE_FLOW.judgment }));
    mount("route-flow", wrap);
  }
  function makeFlowNode(label, areas, cls) {
    const node = el("div", { class: "flow-node " + (cls || "") });
    node.appendChild(el("div", { class: "flow-node-label" }, label));
    const chips = el("div", { class: "flow-node-areas" });
    areas.forEach((a) => chips.appendChild(el("span", { class: "flow-chip" }, a)));
    node.appendChild(chips);
    return node;
  }
  function arrowDown() {
    const w = el("div", { class: "flow-arrow", style: "width:100%;text-align:center;padding:2px 0" });
    w.appendChild(icon("i-chevron-down"));
    return w;
  }

  function renderTimeHeatmap() {
    const table = el("table", { class: "heatmap" });
    const thead = el("thead", null, el("tr", null, [
      el("th", null, ""),
      ...TIME_HEATMAP.cols.map((c) => el("th", null, c)),
    ]));
    table.appendChild(thead);
    const tbody = el("tbody");
    TIME_HEATMAP.rows.forEach((r) => {
      tbody.appendChild(el("tr", null, [
        el("td", { class: "row-name" }, r.area),
        ...r.v.map((v) => el("td", { class: "hm-cell", "data-level": v }, el("span", { class: "hm-val" }, v))),
      ]));
    });
    table.appendChild(tbody);
    mount("time-heatmap", table);
  }

  function renderWeatherFlow() {
    const wrap = el("div", { class: "bar-chart-h" });
    WEATHER_FLOW.forEach((w) => {
      const row = el("div", { class: "bch-row" });
      const label = el("div", { class: "bch-label" });
      if (w.icon) label.appendChild(icon(w.icon));
      label.appendChild(el("span", null, w.label));
      row.appendChild(label);
      const bars = el("div", { class: "bch-bars" });
      bars.appendChild(el("div", { class: "bch-bar", style: "flex:" + w.primary }));
      bars.appendChild(el("div", { class: "bch-bar b-secondary", style: "flex:" + w.secondary }));
      row.appendChild(bars);
      const valEl = el("div", { class: "bch-val" });
      valEl.appendChild(el("span", null, w.note + " "));
      const chCls = w.changeDir === "up" ? "change-up" : w.changeDir === "down" ? "change-down" : "";
      valEl.appendChild(el("span", { class: chCls }, w.change));
      row.appendChild(valEl);
      wrap.appendChild(row);
    });
    mount("weather-flow", wrap);
  }

  function renderWeekdayFlow() {
    const wrap = el("div", { class: "bar-chart-h" });
    const max = Math.max(...WEEKDAY_FLOW.map((w) => w.primary));
    WEEKDAY_FLOW.forEach((w) => {
      const row = el("div", { class: "bch-row" });
      row.appendChild(el("div", { class: "bch-label" }, w.label));
      const bars = el("div", { class: "bch-bars" });
      bars.appendChild(el("div", { class: "bch-bar", style: "width:" + (w.primary / max * 100) + "%" }));
      row.appendChild(bars);
      const valEl = el("div", { class: "bch-val" });
      valEl.appendChild(el("span", { class: "num" }, w.primary + " "));
      const chCls = w.changeDir === "up" ? "change-up" : w.changeDir === "down" ? "change-down" : "";
      valEl.appendChild(el("span", { class: chCls }, w.change));
      row.appendChild(valEl);
      wrap.appendChild(row);
    });
    mount("weekday-flow", wrap);
  }

  // ========================================================
  // SPEND ANALYSIS — Quadrant Matrix
  // ========================================================
  function renderSpendMatrix() {
    const wrap = el("div", { class: "matrix-wrap" });
    wrap.appendChild(el("div", { class: "axis-y" }, "消費指数（高 →）"));
    const board = el("div", { class: "matrix-board" });
    board.appendChild(el("div", { class: "matrix-axis-line v" }));
    board.appendChild(el("div", { class: "matrix-axis-line h" }));
    board.appendChild(el("div", { class: "quad-label tl" }, [
      "誘導強化", el("small", null, "来訪少 × 消費多"),
    ]));
    board.appendChild(el("div", { class: "quad-label tr" }, [
      "維持・単価向上", el("small", null, "来訪多 × 消費多"),
    ]));
    board.appendChild(el("div", { class: "quad-label bl" }, [
      "優先度 低", el("small", null, "来訪少 × 消費少"),
    ]));
    board.appendChild(el("div", { class: "quad-label br" }, [
      "最優先改善", el("small", null, "来訪多 × 消費少"),
    ]));

    SPEND_AREAS.forEach((a) => {
      const left = (a.v / 100) * 100;
      const bottom = (a.s / 100) * 100;
      const dot = el("div", {
        class: "matrix-dot " + a.cls,
        style: `left:${left}%;bottom:${bottom}%;`,
        title: `${a.name} / 来訪 ${a.v} × 消費 ${a.s}`,
      }, [
        el("div", { class: "dot-bubble" }, a.label),
        el("div", { class: "dot-name" }, a.name),
      ]);
      board.appendChild(dot);
    });
    wrap.appendChild(board);
    wrap.appendChild(el("div", { class: "axis-x" }, "来訪指数（高 →）"));
    mount("spend-matrix", wrap);
  }

  function renderSpendLoss() {
    const table = el("table", { class: "data-table" });
    table.appendChild(el("thead", null, el("tr", null, [
      el("th", null, "エリア"),
      el("th", null, "来訪"),
      el("th", null, "消費"),
      el("th", null, "ギャップ"),
      el("th", null, "推奨判断"),
    ])));
    const tbody = el("tbody");
    SPEND_LOSS.forEach((r) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, r.area)),
        el("td", null, el("span", { class: "td-num" }, r.visit)),
        el("td", null, el("span", { class: "td-num" }, r.spend)),
        el("td", null, el("span", { class: "tag t-red" }, r.gap)),
        el("td", null, r.hint),
      ]));
    });
    table.appendChild(tbody);
    mount("spend-loss-table", table);
  }

  function renderSpendEff() {
    const table = el("table", { class: "data-table" });
    table.appendChild(el("thead", null, el("tr", null, [
      el("th", null, "エリア"),
      el("th", null, "来訪"),
      el("th", null, "消費"),
      el("th", null, "効率"),
      el("th", null, "推奨判断"),
    ])));
    const tbody = el("tbody");
    SPEND_EFF.forEach((r) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, r.area)),
        el("td", null, el("span", { class: "td-num" }, r.visit)),
        el("td", null, el("span", { class: "td-num" }, r.spend)),
        el("td", null, el("span", { class: "tag t-green" }, r.eff)),
        el("td", null, r.hint),
      ]));
    });
    table.appendChild(tbody);
    mount("spend-eff-table", table);
  }

  // ========================================================
  // INITIATIVES
  // ========================================================
  let activeInitFilter = "all";

  function renderInitTabs() {
    const wrap = el("div", { class: "seg-tabs", id: "init-filter-tabs" });
    INIT_FILTERS.forEach((f) => {
      const count = f.id === "all" ? INITIATIVES.length : INITIATIVES.filter((i) => i.status === f.id).length;
      const btn = el("button", {
        class: "seg-tab" + (f.id === activeInitFilter ? " active" : ""),
        onclick: function () {
          activeInitFilter = f.id;
          renderInitTabs();
          renderInitiatives();
        },
      }, f.label + " (" + count + ")");
      wrap.appendChild(btn);
    });
    const old = document.getElementById("init-filter-tabs");
    if (old) old.replaceWith(wrap);
  }

  function renderInitiatives() {
    const grid = el("div", { class: "init-grid", id: "initiative-grid" });
    const list = activeInitFilter === "all"
      ? INITIATIVES
      : INITIATIVES.filter((i) => i.status === activeInitFilter);
    list.forEach((it) => grid.appendChild(renderInitCard(it)));
    if (list.length === 0) {
      grid.appendChild(el("div", { style: "padding:40px;text-align:center;color:var(--ink-4);font-size:13px;" }, "該当する施策はありません"));
    }
    const old = document.getElementById("initiative-grid");
    if (old) old.replaceWith(grid);
  }

  function renderInitCard(it) {
    const card = el("div", { class: "init-card" });

    const head = el("div", { class: "init-head" }, [
      el("div", { class: "init-title" }, it.title),
      el("span", { class: "init-status " + it.status }, it.statusLabel),
    ]);
    card.appendChild(head);

    if (it.meta) {
      const meta = el("div", { class: "init-meta" });
      it.meta.forEach(([cls, t]) => meta.appendChild(tag(cls, t)));
      card.appendChild(meta);
    }

    card.appendChild(el("div", { class: "init-section" }, [
      el("div", { class: "init-section-label" }, "対象エリア"),
      el("div", null, it.area),
    ]));
    card.appendChild(el("div", { class: "init-section" }, [
      el("div", { class: "init-section-label" }, "判断理由"),
      el("div", null, it.reason),
    ]));
    card.appendChild(el("div", { class: "init-section" }, [
      el("div", { class: "init-section-label" }, "期待効果"),
      el("div", null, el("strong", null, it.effect)),
    ]));
    card.appendChild(el("div", { class: "init-section" }, [
      el("div", { class: "init-section-label" }, "必要な実施内容"),
      el("div", null, it.task),
    ]));

    const kpiRow = el("div", { class: "init-kpi-row" });
    it.kpis.slice(0, 2).forEach((k, i) => {
      kpiRow.appendChild(el("div", { class: "init-kpi" }, [
        el("div", { class: "init-kpi-label" }, "成功指標 " + (i + 1)),
        el("div", { class: "init-kpi-val" }, k),
      ]));
    });
    card.appendChild(kpiRow);

    const foot = el("div", { class: "init-foot" });
    foot.appendChild(el("span", { class: "priority-chip " + it.priority }, it.priorityLabel));
    foot.appendChild(el("button", { class: "link-btn" }, [el("span", null, "詳細を見る"), icon("i-arrow-right")]));
    card.appendChild(foot);

    return card;
  }

  // ========================================================
  // ========================================================
  // IMPACT — Gantt + KPI Management
  // ========================================================

  // localStorage key prefix
  const LS_KPI   = "oti_kpi_";   // LS_KPI + initiativeId -> JSON array of KPI records
  const LS_JUDGE = "oti_judge_"; // LS_JUDGE + initiativeId -> "continue"|"improve"|"stop"|null

  function lsGetKpis(id) {
    try { return JSON.parse(localStorage.getItem(LS_KPI + id) || "[]"); } catch { return []; }
  }
  function lsSaveKpis(id, arr) {
    localStorage.setItem(LS_KPI + id, JSON.stringify(arr));
  }
  function lsGetJudge(id) {
    return localStorage.getItem(LS_JUDGE + id) || "";
  }
  function lsSaveJudge(id, val) {
    localStorage.setItem(LS_JUDGE + id, val);
  }

  // ---- state ----
  let selectedGanttId = null;

  function renderImpact() {
    renderGanttChart();
  }

  function renderGanttChart(filter) {
    const rows = filter && filter !== "all"
      ? GANTT_INITIATIVES.filter(r => r.status === filter)
      : GANTT_INITIATIVES;

    const wrap = el("div", { class: "gantt-wrap" });

    // Month labels
    const labelRow = el("div", { class: "gantt-month-labels" });
    GANTT_MONTHS.forEach(m => {
      labelRow.appendChild(el("div", { class: "gantt-month-label" }, m));
    });
    wrap.appendChild(labelRow);

    // Rows
    rows.forEach(r => {
      const total = GANTT_MONTHS.length;
      const barLeft   = (r.startCol / total * 100).toFixed(1) + "%";
      const barWidth  = ((r.endCol - r.startCol + 1) / total * 100).toFixed(1) + "%";

      const row = el("div", {
        class: "gantt-row" + (r.id === selectedGanttId ? " selected" : ""),
        "data-id": r.id,
        role: "button",
        tabindex: "0",
        "aria-label": r.title + " を選択",
      });

      // Label
      const label = el("div", { class: "gantt-label" });
      label.appendChild(el("div", { class: "gantt-label-name", title: r.title }, r.title));
      label.appendChild(el("div", { class: "gantt-label-area" }, r.area));
      row.appendChild(label);

      // Timeline
      const tl = el("div", { class: "gantt-timeline" });

      // BG grid
      const bgGrid = el("div", { class: "gantt-bg-grid" });
      GANTT_MONTHS.forEach(() => bgGrid.appendChild(el("div", { class: "gantt-bg-col" })));
      tl.appendChild(bgGrid);

      // Bar
      const bar = el("div", {
        class: "gantt-bar-wrap s-" + r.status,
        style: "left:" + barLeft + ";width:" + barWidth,
      }, r.statusLabel);
      tl.appendChild(bar);

      row.appendChild(tl);

      // Click / keyboard
      function selectRow() {
        selectedGanttId = r.id;
        renderGanttChart(filter);
        renderKpiPanel(r.id);
      }
      row.addEventListener("click", selectRow);
      row.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectRow(); } });

      wrap.appendChild(row);
    });

    mount("gantt-chart", wrap);

    // Filter tabs
    renderGanttFilterTabs(filter || "all");
  }

  function renderGanttFilterTabs(active) {
    const tabs = [
      { key: "all",      label: "すべて" },
      { key: "running",  label: "実施中" },
      { key: "review",   label: "要確認" },
      { key: "consider", label: "検討中" },
      { key: "done",     label: "完了" },
    ];
    const wrap = el("div", { class: "seg-tabs sm", id: "gantt-filter-tabs" });
    tabs.forEach(t => {
      const btn = el("button", {
        class: "seg-tab" + (t.key === active ? " active" : ""),
      }, t.label);
      btn.addEventListener("click", () => {
        selectedGanttId = null;
        renderGanttChart(t.key);
        clearKpiPanel();
      });
      wrap.appendChild(btn);
    });
    const existing = document.getElementById("gantt-filter-tabs");
    if (existing) existing.replaceWith(wrap);
  }

  function clearKpiPanel() {
    document.getElementById("kpi-panel-title").textContent = "施策を選択してください";
    document.getElementById("kpi-panel-area").textContent  = "";
    document.getElementById("kpi-panel-actions").innerHTML = "";
    const body = document.getElementById("kpi-panel-body");
    body.innerHTML = "";
    body.appendChild(buildEmptyPanelState());
  }

  function buildEmptyPanelState() {
    const d = el("div", { class: "kpi-panel-empty" });
    d.innerHTML = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="color:var(--ink-5)"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg><p>左のガントチャートから施策を選ぶと<br>KPI記録パネルが表示されます</p>`;
    return d;
  }

  function renderKpiPanel(id) {
    const init = GANTT_INITIATIVES.find(r => r.id === id);
    if (!init) return;

    document.getElementById("kpi-panel-title").textContent = init.title;
    document.getElementById("kpi-panel-area").textContent  = init.area + "　担当: " + init.owner;

    // status badge in header
    const statusMap = { running: "t-blue", review: "t-gold", consider: "t-navy", done: "t-green" };
    const actionsEl = document.getElementById("kpi-panel-actions");
    actionsEl.innerHTML = "";
    actionsEl.appendChild(tag(init.statusLabel, statusMap[init.status] || "t-navy"));

    const body = document.getElementById("kpi-panel-body");
    body.innerHTML = "";

    // -- Judgment bar --
    body.appendChild(buildJudgmentBar(id));

    // -- KPI record list --
    body.appendChild(buildKpiRecordList(id));

    // -- Add form --
    body.appendChild(buildKpiAddForm(id));
  }

  function buildJudgmentBar(id) {
    const current = lsGetJudge(id);
    const bar = el("div", { class: "judgment-bar" });
    bar.appendChild(el("span", { class: "judgment-label" }, "担当者判断"));

    const choices = [
      { key: "continue", label: "継続",   cls: "active-continue" },
      { key: "improve",  label: "改善検討", cls: "active-improve" },
      { key: "stop",     label: "停止",   cls: "active-stop" },
    ];
    choices.forEach(c => {
      const btn = el("button", {
        class: "judgment-btn" + (current === c.key ? " " + c.cls : ""),
      }, c.label);
      btn.addEventListener("click", () => {
        const next = current === c.key ? "" : c.key;
        lsSaveJudge(id, next);
        buildJudgmentBar(id); // just re-render
        const newBar = buildJudgmentBar(id);
        bar.replaceWith(newBar);
      });
      bar.appendChild(btn);
    });
    return bar;
  }

  function buildKpiRecordList(id) {
    const records = lsGetKpis(id);

    if (records.length === 0) {
      return el("div", { class: "kpi-list-empty" }, "KPI記録はまだありません。下のフォームから追加してください。");
    }

    const listWrap = el("div", { class: "kpi-record-list" });

    // header
    const head = el("div", { class: "kpi-record-head" });
    ["指標・メモ", "数値", "更新日", ""].forEach(t => head.appendChild(el("div", null, t)));
    listWrap.appendChild(head);

    records.forEach((rec, idx) => {
      const row = el("div", { class: "kpi-record-row" });

      const nameCell = el("div", { class: "kr-name" }, rec.name);
      if (rec.memo) nameCell.appendChild(el("div", { class: "kr-memo" }, rec.memo));
      row.appendChild(nameCell);

      const valCell = el("div", { class: "kr-value-cell" });
      valCell.appendChild(el("span", { class: "kr-value" }, rec.value));
      if (rec.unit) valCell.appendChild(el("span", { class: "kr-unit" }, rec.unit));
      row.appendChild(valCell);

      row.appendChild(el("div", { class: "kr-updated" }, rec.date));

      const delBtn = el("button", { class: "kr-del-btn", "aria-label": "削除", title: "削除" }, "×");
      delBtn.addEventListener("click", () => {
        const arr = lsGetKpis(id);
        arr.splice(idx, 1);
        lsSaveKpis(id, arr);
        renderKpiPanel(id);
      });
      row.appendChild(delBtn);

      listWrap.appendChild(row);
    });

    return listWrap;
  }

  function buildKpiAddForm(id) {
    const form = el("div", { class: "kpi-add-form" });
    form.appendChild(el("div", { class: "kpi-add-title" }, "KPI を記録する"));

    // Row 1: name / value / unit
    const row1 = el("div", { class: "kpi-add-row" });
    const nameInput  = el("input", { class: "kpi-input", placeholder: "指標名（例: クーポン利用率）", "aria-label": "指標名" });
    const valueInput = el("input", { class: "kpi-input", placeholder: "数値",  "aria-label": "数値", type: "text", inputmode: "decimal" });
    const unitInput  = el("input", { class: "kpi-input", placeholder: "単位",  "aria-label": "単位" });
    [nameInput, valueInput, unitInput].forEach(i => row1.appendChild(i));
    form.appendChild(row1);

    // Row 2: memo
    const memo = el("textarea", { class: "kpi-textarea", placeholder: "メモ（任意）: 測定方法・コメント・仮説など", "aria-label": "メモ", rows: "2" });
    form.appendChild(memo);

    // Buttons
    const btns = el("div", { class: "kpi-add-btns" });
    const cancelBtn = el("button", { class: "btn-ghost btn-sm" }, "クリア");
    const addBtn    = el("button", { class: "btn-primary btn-sm" }, "+ 記録を追加");

    cancelBtn.addEventListener("click", () => {
      nameInput.value = ""; valueInput.value = ""; unitInput.value = ""; memo.value = "";
    });

    addBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      const value = valueInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      const records = lsGetKpis(id);
      const today = new Date();
      const dateStr = today.getFullYear() + "/" +
        String(today.getMonth() + 1).padStart(2, "0") + "/" +
        String(today.getDate()).padStart(2, "0");
      records.push({
        name,
        value: value || "—",
        unit:  unitInput.value.trim(),
        memo:  memo.value.trim(),
        date:  dateStr,
      });
      lsSaveKpis(id, records);
      nameInput.value = ""; valueInput.value = ""; unitInput.value = ""; memo.value = "";
      renderKpiPanel(id);
    });

    // Allow Enter in name field to jump to value
    nameInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); valueInput.focus(); } });
    // Allow Enter in value/unit to submit
    [valueInput, unitInput].forEach(inp => {
      inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addBtn.click(); } });
    });

    btns.appendChild(cancelBtn);
    btns.appendChild(addBtn);
    form.appendChild(btns);
    return form;
  }

  // ========================================================
  // REFERRAL OPTIMIZATION (送客最適化)
  // ========================================================
  function renderReferralOptimization() {
    renderReferralKpis();
    renderReferralAreas();
    renderReferralOffers();
    renderReferralMatrix();
    renderReferralFunnel();
  }

  function renderReferralKpis() {
    const wrap = el("div", { class: "kpi-grid kpi-grid-4" });
    REFERRAL_KPIS.forEach((k) => wrap.appendChild(renderKpiCard(k)));
    mount("referral-kpis", Array.from(wrap.children));
  }

  function renderReferralAreas() {
    const table = el("table", { class: "data-table ref-area-table" });
    table.appendChild(el("thead", null, el("tr", null, [
      el("th", null, "エリア"),
      el("th", null, "状態"),
      el("th", null, "推奨判断"),
      el("th", null, "優先度"),
      el("th", null, "期待効果"),
    ])));
    const tbody = el("tbody");
    REFERRAL_AREAS.forEach((a) => {
      const stateCell = el("span", { class: "state-pill " + a.stateCls });
      stateCell.appendChild(el("span", { class: "state-dot" }));
      stateCell.appendChild(el("span", { class: "state-label" }, a.state));

      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, a.area)),
        el("td", null, stateCell),
        el("td", null, el("span", { class: "ref-decide" }, a.decide)),
        el("td", null, el("span", { class: "pri-badge " + a.priorityCls }, a.priority)),
        el("td", null, el("span", { class: "ref-effect" }, a.effect)),
      ]));
    });
    table.appendChild(tbody);
    mount("referral-areas", table);
  }

  function renderReferralOffers() {
    const list = el("div", { class: "offer-list" });
    REFERRAL_OFFERS.forEach((o) => {
      list.appendChild(buildOfferCard(o));
    });
    mount("referral-offers", list);
  }

  function buildOfferCard(o) {
    const state = offerState[o.id] || {};
    const card = el("div", {
      class: "offer-card" + (state.status === "held" ? " is-held" : "") + (state.status === "added" ? " is-added" : ""),
      "data-offer-id": o.id,
      tabindex: "0",
      role: "button",
      "aria-label": o.title + " の詳細を表示",
    });

    const head = el("div", { class: "offer-head" });
    head.appendChild(el("div", { class: "offer-title" }, o.title));
    const headRight = el("div", { class: "offer-head-right" });
    headRight.appendChild(el("span", { class: "pri-badge " + o.priorityCls }, o.priority));
    if (state.status === "added") headRight.appendChild(el("span", { class: "offer-status-tag added" }, "追加済み"));
    if (state.status === "held")  headRight.appendChild(el("span", { class: "offer-status-tag held" }, "保留"));
    const more = el("button", { class: "offer-more", "aria-label": "メニュー", title: "メニュー" }, icon("i-more"));
    more.addEventListener("click", (e) => e.stopPropagation());
    headRight.appendChild(more);
    head.appendChild(headRight);
    card.appendChild(head);

    const meta = el("div", { class: "offer-meta" });
    meta.appendChild(buildMetaItem("対象エリア", el("span", { class: "offer-meta-val" }, o.area)));
    const chips = el("span", { class: "offer-chips" });
    o.channels.forEach((c) => chips.appendChild(el("span", { class: "offer-chip" }, c)));
    meta.appendChild(buildMetaItem("配信チャネル", chips));
    card.appendChild(meta);

    card.appendChild(el("div", { class: "offer-section-label" }, "判断理由"));
    card.appendChild(el("div", { class: "offer-reason" }, o.reason));

    card.appendChild(el("div", { class: "offer-section-label" }, "成功指標"));
    const kpiChips = el("div", { class: "offer-kpis" });
    o.kpis.forEach((k) => kpiChips.appendChild(el("span", { class: "offer-kpi-chip" }, k)));
    card.appendChild(kpiChips);

    const actions = el("div", { class: "offer-actions" });
    const holdBtn = el("button", { class: "btn-ghost btn-sm" }, state.status === "held" ? "保留解除" : "保留");
    const addBtn  = el("button", {
      class: "btn-primary btn-sm" + (state.status === "added" ? " is-added" : ""),
      disabled: state.status === "added" ? "true" : null,
    }, state.status === "added" ? "追加済み" : "施策管理に追加");

    holdBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.status === "held") {
        offerState[o.id] = { status: null };
      } else {
        offerState[o.id] = { status: "held" };
      }
      renderReferralOffers();
    });
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addOfferToInitiatives(o.id);
    });

    actions.appendChild(holdBtn);
    actions.appendChild(addBtn);
    card.appendChild(actions);

    // open drawer on card click/keyboard
    card.addEventListener("click", () => openReferralDrawer(o.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openReferralDrawer(o.id); }
    });

    return card;
  }

  function buildMetaItem(label, valueNode) {
    return el("div", { class: "offer-meta-item" }, [
      el("span", { class: "offer-meta-key" }, label),
      valueNode,
    ]);
  }

  function addOfferToInitiatives(offerId) {
    const prev = offerState[offerId] && offerState[offerId].status;
    if (prev === "added") return;
    offerState[offerId] = { status: "added" };

    // increment "推奨施策" → 実施中, only when not already added before
    const recKpi = REFERRAL_KPIS.find(k => k.label === "推奨施策");
    const runKpi = REFERRAL_KPIS.find(k => k.label === "実施中施策");
    if (recKpi && typeof recKpi.value === "number" && recKpi.value > 0) recKpi.value = recKpi.value - 1;
    if (runKpi && typeof runKpi.value === "number") runKpi.value = runKpi.value + 1;

    renderReferralKpis();
    renderReferralOffers();
    showToast("施策管理に追加しました。効果測定で継続・改善・停止を確認できます。");
  }

  function holdOffer(offerId) {
    offerState[offerId] = { status: "held" };
    renderReferralOffers();
  }

  function renderReferralMatrix() {
    const wrap = el("div", { class: "ref-matrix" });

    // y-axis label outside board
    wrap.appendChild(el("div", { class: "ref-axis-y-label" }, "↑ 消費指数（高）"));

    const board = el("div", { class: "ref-matrix-board" });
    board.appendChild(el("div", { class: "ref-axis-x-label" }, "来訪指数（高） →"));

    // quadrant captions (left-top, right-top, left-bottom, right-bottom)
    const captions = [
      { cls: "q-tl", title: "誘導強化",       note: "来訪少 × 消費多" },
      { cls: "q-tr", title: "維持・単価向上", note: "来訪多 × 消費多" },
      { cls: "q-bl", title: "優先度低",       note: "来訪少 × 消費少" },
      { cls: "q-br", title: "最優先改善",     note: "来訪多 × 消費少" },
    ];
    captions.forEach((c) => {
      const cap = el("div", { class: "ref-quadrant " + c.cls });
      cap.appendChild(el("div", { class: "ref-quadrant-title" }, c.title));
      cap.appendChild(el("div", { class: "ref-quadrant-note" }, c.note));
      board.appendChild(cap);
    });

    board.appendChild(el("div", { class: "ref-divider ref-divider-h" }));
    board.appendChild(el("div", { class: "ref-divider ref-divider-v" }));

    REFERRAL_MATRIX.forEach((p) => {
      const dot = el("div", {
        class: "ref-dot " + p.tagCls,
        style: "left:" + p.visit + "%;bottom:" + p.spend + "%",
        title: p.name + "（" + p.tag + "）",
      });
      // place label to the right if x < 70, otherwise to the left
      const labelSide = p.visit > 70 ? " right" : "";
      dot.appendChild(el("div", { class: "ref-dot-label" + labelSide }, p.name));
      board.appendChild(dot);
    });

    wrap.appendChild(board);

    const legend = el("div", { class: "ref-legend" });
    REFERRAL_MATRIX.forEach((p) => {
      const item = el("div", { class: "ref-legend-item" });
      item.appendChild(el("span", { class: "ref-legend-dot " + p.tagCls }));
      item.appendChild(el("span", { class: "ref-legend-name" }, p.name));
      item.appendChild(el("span", { class: "ref-legend-tag " + p.tagCls }, p.tag));
      legend.appendChild(item);
    });
    wrap.appendChild(legend);

    mount("referral-matrix", wrap);
  }

  function renderReferralFunnel() {
    const wrap = el("div", { class: "ref-funnel" });
    REFERRAL_FUNNEL.forEach((f, idx) => {
      const row = el("div", { class: "ref-funnel-row" });
      row.appendChild(el("div", { class: "ref-funnel-step" }, String(idx + 1).padStart(2, "0")));

      const body = el("div", { class: "ref-funnel-body" });
      const head = el("div", { class: "ref-funnel-head" });
      head.appendChild(el("span", { class: "ref-funnel-label" }, f.label));
      head.appendChild(el("span", { class: "ref-funnel-value" }, f.value + " / 100"));
      body.appendChild(head);
      const barWrap = el("div", { class: "ref-funnel-bar" });
      barWrap.appendChild(el("div", { class: "ref-funnel-bar-fill", style: "width:" + f.value + "%" }));
      body.appendChild(barWrap);
      body.appendChild(el("div", { class: "ref-funnel-hint" }, f.hint));
      row.appendChild(body);
      wrap.appendChild(row);

      if (idx < REFERRAL_FUNNEL.length - 1) {
        wrap.appendChild(el("div", { class: "ref-funnel-arrow" }, icon("i-chevron-down")));
      }
    });
    wrap.appendChild(el("div", { class: "ref-funnel-foot" }, "実施後は効果測定画面で、継続・改善・停止を判断します。"));
    mount("referral-funnel", wrap);
  }

  // ----- Drawer -----
  function openReferralDrawer(offerId) {
    const o = REFERRAL_OFFERS.find(x => x.id === offerId);
    if (!o) return;
    const root = document.getElementById("drawer-root");
    if (!root) return;

    root.innerHTML = "";
    const scrim = el("div", { class: "drawer-scrim" });
    const drawer = el("aside", { class: "drawer", role: "dialog", "aria-label": o.title });

    // Header
    const h = el("header", { class: "drawer-head" });
    const hLeft = el("div", { class: "drawer-head-left" });
    hLeft.appendChild(el("div", { class: "drawer-eyebrow" }, "推奨施策"));
    hLeft.appendChild(el("h3", { class: "drawer-title" }, o.title));
    h.appendChild(hLeft);
    const closeBtn = el("button", { class: "drawer-close", "aria-label": "閉じる", title: "閉じる" }, "×");
    closeBtn.addEventListener("click", closeReferralDrawer);
    h.appendChild(closeBtn);
    drawer.appendChild(h);

    // Body
    const body = el("div", { class: "drawer-body" });

    // meta block
    const metaGrid = el("div", { class: "drawer-meta-grid" });
    metaGrid.appendChild(drawerMeta("対象エリア", o.area));
    metaGrid.appendChild(drawerMeta("優先度", el("span", { class: "pri-badge " + o.priorityCls }, o.priority)));
    metaGrid.appendChild(drawerMeta("配信チャネル", channelChips(o.channels)));
    body.appendChild(metaGrid);

    body.appendChild(drawerSection("判断理由", el("p", { class: "drawer-text" }, o.reason)));
    body.appendChild(drawerSection("実施内容", el("p", { class: "drawer-text" }, o.content)));
    body.appendChild(drawerSection("成功指標", chipList(o.kpis, "kpi")));
    body.appendChild(drawerSection("確認すべきデータ", chipList(o.observe, "obs")));
    body.appendChild(drawerSection("次の判断", el("p", { class: "drawer-text" }, o.next)));

    drawer.appendChild(body);

    // Footer
    const foot = el("footer", { class: "drawer-foot" });
    const cancel = el("button", { class: "btn-ghost btn-sm" }, "閉じる");
    cancel.addEventListener("click", closeReferralDrawer);
    const state = offerState[o.id] || {};
    const addBtn = el("button", {
      class: "btn-primary btn-sm" + (state.status === "added" ? " is-added" : ""),
      disabled: state.status === "added" ? "true" : null,
    }, state.status === "added" ? "追加済み" : "施策管理に追加");
    addBtn.addEventListener("click", () => {
      addOfferToInitiatives(o.id);
      closeReferralDrawer();
    });
    foot.appendChild(cancel);
    foot.appendChild(addBtn);
    drawer.appendChild(foot);

    root.appendChild(scrim);
    root.appendChild(drawer);
    requestAnimationFrame(() => {
      root.classList.add("is-open");
    });
    scrim.addEventListener("click", closeReferralDrawer);
    document.addEventListener("keydown", drawerKeyHandler);
  }

  function drawerKeyHandler(e) {
    if (e.key === "Escape") closeReferralDrawer();
  }

  function closeReferralDrawer() {
    const root = document.getElementById("drawer-root");
    if (!root) return;
    root.classList.remove("is-open");
    document.removeEventListener("keydown", drawerKeyHandler);
    setTimeout(() => { root.innerHTML = ""; }, 220);
  }

  function drawerMeta(label, value) {
    const w = el("div", { class: "drawer-meta-item" });
    w.appendChild(el("div", { class: "drawer-meta-key" }, label));
    const v = el("div", { class: "drawer-meta-val" });
    if (typeof value === "string") v.appendChild(document.createTextNode(value));
    else v.appendChild(value);
    w.appendChild(v);
    return w;
  }
  function drawerSection(title, node) {
    const w = el("section", { class: "drawer-section" });
    w.appendChild(el("h4", { class: "drawer-section-title" }, title));
    w.appendChild(node);
    return w;
  }
  function channelChips(arr) {
    const wrap = el("div", { class: "offer-chips" });
    arr.forEach((c) => wrap.appendChild(el("span", { class: "offer-chip" }, c)));
    return wrap;
  }
  function chipList(arr, kind) {
    const wrap = el("div", { class: kind === "kpi" ? "offer-kpis" : "obs-chips" });
    arr.forEach((c) => wrap.appendChild(el("span", { class: kind === "kpi" ? "offer-kpi-chip" : "obs-chip" }, c)));
    return wrap;
  }

  // ----- Toast -----
  let toastTimer = null;
  function showToast(message) {
    const root = document.getElementById("toast-root");
    if (!root) return;
    root.innerHTML = "";
    const t = el("div", { class: "toast", role: "status", "aria-live": "polite" });
    t.appendChild(el("span", { class: "toast-icon" }, icon("i-check")));
    t.appendChild(el("span", { class: "toast-text" }, message));
    root.appendChild(t);
    requestAnimationFrame(() => t.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove("is-visible");
      setTimeout(() => { if (root.firstChild === t) root.innerHTML = ""; }, 220);
    }, 3200);
  }

  // ----- Filter response (demo) -----
  function applyReferralFilter(area) {
    const v = REFERRAL_FILTER_VARIANTS[area] || REFERRAL_FILTER_VARIANTS["hakone"];

    // update KPIs (without breaking sparkline visuals — just values)
    const map = {
      "送客機会スコア": v.score,
      "消費機会ロス":    v.loss,
      "推奨施策":        v.rec,
      "実施中施策":      v.run,
    };
    REFERRAL_KPIS = REFERRAL_KPIS.map((k) => ({ ...k, value: map[k.label] !== undefined ? map[k.label] : k.value }));

    // soft re-render with skeleton flash
    flashSkeleton("referral-kpis", renderReferralKpis);
    flashSkeleton("referral-areas", renderReferralAreas);
    flashSkeleton("referral-offers", renderReferralOffers);
  }

  function flashSkeleton(id, renderFn) {
    const el_ = document.getElementById(id);
    if (!el_) return;
    el_.classList.add("is-loading");
    setTimeout(() => {
      renderFn();
      const el2 = document.getElementById(id);
      if (el2) el2.classList.remove("is-loading");
    }, 280);
  }

  // ========================================================
  // REPORT
  // ========================================================
  function renderReportList() {
    const list = el("div", { class: "report-list" });
    REPORTS.forEach((r) => {
      const item = el("div", { class: "report-item" });
      item.appendChild(el("div", { class: "report-icon" }, icon(r.icon)));
      item.appendChild(el("div", { class: "report-info" }, [
        el("div", { class: "report-title" }, r.title),
        el("div", { class: "report-meta" }, r.meta),
      ]));
      item.appendChild(el("div", { class: "report-actions" }, [
        el("button", { class: "icon-btn", "aria-label": "ダウンロード" }, icon("i-download")),
        el("button", { class: "icon-btn", "aria-label": "詳細" }, icon("i-more")),
      ]));
      list.appendChild(item);
    });
    mount("report-list", list);
  }

  function renderTemplates() {
    const grid = el("div", { class: "tpl-grid" });
    TEMPLATES.forEach((t) => {
      const card = el("button", { class: "tpl-card" });
      card.appendChild(el("div", { class: "tpl-icon " + (t.tone || "") }, icon(t.icon)));
      card.appendChild(el("div", { class: "tpl-name" }, t.name));
      card.appendChild(el("div", { class: "tpl-desc" }, t.desc));
      grid.appendChild(card);
    });
    mount("report-templates", grid);
  }

  // ========================================================
  // NAVIGATION & FILTERS
  // ========================================================
  const VIEW_TITLES = {
    dashboard: "ダッシュボード",
    area: "エリア分析",
    flow: "回遊分析",
    spend: "消費分析",
    referral: "送客最適化",
    initiatives: "施策管理",
    impact: "効果測定",
    report: "レポート",
  };

  function bindNav() {
    const buttons = document.querySelectorAll(".nav-item");
    const views = document.querySelectorAll(".view");
    const title = document.getElementById("topbar-title");
    buttons.forEach((b) => {
      b.addEventListener("click", function () {
        const targetId = b.dataset.view;
        const current = document.querySelector(".view:not(.hidden)");
        const next = document.getElementById(targetId);

        buttons.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");

        if (title) title.textContent = VIEW_TITLES[targetId] || "";

        if (!next || next === current) return;

        if (current) {
          current.classList.add("is-leaving");
          setTimeout(() => {
            current.classList.add("hidden");
            current.classList.remove("is-leaving");
            showView(next);
          }, 140);
        } else {
          showView(next);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function showView(view) {
    view.classList.remove("hidden");
    view.classList.add("is-entering");
    requestAnimationFrame(() => {
      view.classList.add("is-entered");
    });
    setTimeout(() => {
      view.classList.remove("is-entering");
      view.classList.remove("is-entered");
    }, 280);
  }

  function bindSegTabs() {
    document.querySelectorAll(".seg-tabs").forEach((g) => {
      if (g.id === "init-filter-tabs") return; // controlled
      g.addEventListener("click", function (e) {
        const btn = e.target.closest(".seg-tab");
        if (!btn) return;
        g.querySelectorAll(".seg-tab").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  function bindFilters() {
    document.querySelectorAll("[data-filter]").forEach((sel) => {
      sel.addEventListener("change", function () {
        const key = sel.dataset.filter;
        const val = sel.value;
        document.querySelectorAll(`[data-filter='${key}']`).forEach((s) => (s.value = val));
        if (key === "area") applyReferralFilter(val);
        if (key === "month" || key === "channel") {
          flashSkeleton("referral-kpis", renderReferralKpis);
        }
      });
    });
  }

  // ========================================================
  // INITIAL LOADER
  // ========================================================
  function showInitialLoader() {
    const root = document.getElementById("init-loader");
    if (!root) return;
    const steps = root.querySelectorAll(".loader-step");
    let idx = 0;
    const interval = setInterval(() => {
      if (steps[idx]) steps[idx].classList.add("done");
      idx++;
      if (idx >= steps.length) clearInterval(interval);
    }, 260);
  }
  function hideInitialLoader() {
    const root = document.getElementById("init-loader");
    const app = document.querySelector(".app");
    if (root) {
      root.classList.add("is-leaving");
      setTimeout(() => root.remove(), 280);
    }
    if (app) {
      app.classList.add("is-revealed");
    }
  }

  // ========================================================
  // BOOT
  // ========================================================
  document.addEventListener("DOMContentLoaded", function () {
    showInitialLoader();
    bindNav();
    bindSegTabs();
    bindFilters();

    // Dashboard
    renderAlertBar();
    renderKpis();
    renderPriorityAreas();
    renderRecommendedActions();
    renderTrendChart();
    renderComposition();

    // Area
    renderAreaTable();
    renderAreaJudgment();
    renderSegmentTable();

    // Flow
    renderFlowKpis();
    renderRouteFlow();
    renderTimeHeatmap();
    renderWeatherFlow();
    renderWeekdayFlow();

    // Spend
    renderSpendMatrix();
    renderSpendLoss();
    renderSpendEff();

    // Referral Optimization
    renderReferralOptimization();

    // Initiatives
    renderInitTabs();
    renderInitiatives();

    // Impact
    renderImpact();

    // Report
    renderReportList();
    renderTemplates();

    // hide loader after a short reveal
    setTimeout(hideInitialLoader, 1300);
  });

})();
