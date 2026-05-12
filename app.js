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

  // ----- Impact (effectiveness) -----
  const IMPACT_KPIS = [
    { label: "実施中の施策", value: 4, denom: "件", decision: "進捗確認の対象数", icon: "i-target", iconColor: "t-navy", delta: { dir: "flat", text: "横ばい" }, spark: [4,4,4,4,4,4,4] },
    { label: "改善傾向の施策", value: 3, denom: "件", decision: "効果を確認できている件数", icon: "i-arrow-up", iconColor: "t-green", delta: { dir: "up", text: "+1" }, spark: [1,2,2,2,3,3,3] },
    { label: "要確認の施策", value: 1, denom: "件", decision: "追加検証が必要な件数", icon: "i-alert", iconColor: "t-gold", delta: { dir: "flat", text: "横ばい" }, spark: [1,1,1,1,1,1,1] },
  ];

  const IMPACT_ROWS = [
    {
      title: "雨天時の屋内回遊ルート案内",
      area: "箱根湯本・強羅",
      metric: "ルート閲覧率",
      before: 12, after: 24,
      delta: "+12 pt",
      direction: "up",
      status: "改善傾向",
      statusCls: "init-status running",
    },
    {
      title: "食べ歩きパスと荷物預かり拡充",
      area: "箱根湯本",
      metric: "湯本周辺購買指数",
      before: 34, after: 41,
      delta: "+7 pt",
      direction: "up",
      status: "改善傾向",
      statusCls: "init-status running",
    },
    {
      title: "多言語モデルコース最適化",
      area: "沿線全域",
      metric: "外国語クーポン利用率",
      before: 18, after: 26,
      delta: "+8 pt",
      direction: "up",
      status: "改善傾向",
      statusCls: "init-status running",
    },
    {
      title: "強羅 体験予約クーポン比較検証",
      area: "強羅",
      metric: "クーポン利用率",
      before: 14, after: 14,
      delta: "±0",
      direction: "flat",
      status: "要確認",
      statusCls: "init-status review",
    },
  ];

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
    row1.appendChild(arrowDown());
    wrap.appendChild(row1);
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
  // IMPACT
  // ========================================================
  function renderImpactKpis() {
    const wrap = el("div", { class: "kpi-grid kpi-grid-3" });
    IMPACT_KPIS.forEach((k) => wrap.appendChild(renderKpiCard(k)));
    mount("impact-kpis", Array.from(wrap.children));
  }

  function renderImpactTable() {
    const table = el("table", { class: "data-table" });
    table.appendChild(el("thead", null, el("tr", null, [
      el("th", null, "施策"),
      el("th", null, "対象"),
      el("th", null, "指標"),
      el("th", null, "前後比較"),
      el("th", null, "変化"),
      el("th", null, "状態"),
      el("th", { style: "text-align:right" }, "アクション"),
    ])));
    const tbody = el("tbody");
    IMPACT_ROWS.forEach((r) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, r.title)),
        el("td", null, r.area),
        el("td", null, r.metric),
        el("td", null, renderCompareBar(r)),
        el("td", null, el("span", {
          class: "tag " + (r.direction === "up" ? "t-green" : r.direction === "down" ? "t-red" : ""),
        }, r.delta)),
        el("td", null, el("span", { class: r.statusCls }, r.status)),
        el("td", { style: "text-align:right" }, renderImpactActions(r)),
      ]));
    });
    table.appendChild(tbody);
    mount("impact-table", table);
  }

  function renderCompareBar(r) {
    const wrap = el("div", { class: "compare-bar", style: "width:180px" });
    const beforePct = Math.min(100, r.before);
    const afterPct = Math.min(100, r.after);
    wrap.appendChild(el("div", {
      class: "compare-bar-before",
      style: "width:" + beforePct + "%",
    }));
    wrap.appendChild(el("div", {
      class: "compare-bar-after" + (r.direction === "down" ? " down" : ""),
      style: "width:" + Math.max(0, afterPct - beforePct) + "%",
    }));
    wrap.appendChild(el("div", { class: "cb-text" }, r.before + "% → " + r.after + "%"));
    return wrap;
  }

  function renderImpactActions(r) {
    const wrap = el("div", { class: "action-cluster" });
    wrap.appendChild(el("button", { class: "btn-ghost btn-sm" }, "継続"));
    wrap.appendChild(el("button", { class: "btn-ghost btn-sm" }, "改善"));
    wrap.appendChild(el("button", { class: "btn-ghost btn-sm" }, "停止"));
    return wrap;
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
        buttons.forEach((x) => x.classList.remove("active"));
        views.forEach((v) => v.classList.add("hidden"));
        b.classList.add("active");
        const view = document.getElementById(b.dataset.view);
        if (view) view.classList.remove("hidden");
        if (title) title.textContent = VIEW_TITLES[b.dataset.view] || "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
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
        document.querySelectorAll(`[data-filter='${key}']`).forEach((s) => (s.value = sel.value));
      });
    });
  }

  // ========================================================
  // BOOT
  // ========================================================
  document.addEventListener("DOMContentLoaded", function () {
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

    // Initiatives
    renderInitTabs();
    renderInitiatives();

    // Impact
    renderImpactKpis();
    renderImpactTable();

    // Report
    renderReportList();
    renderTemplates();
  });

})();
