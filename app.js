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
    title: "伊豆エリアで高付加価値需要が増加傾向",
    text: "週末のロマンスカー予約・Web閲覧から、熱海・伊東方面への事前案内を推奨。雨予報日は屋内・温泉導線を優先して検討してください。",
    action: "対応を確認",
  };

  const KPI_DASHBOARD = [
    {
      key: "wide-referral",
      label: "広域送客余地",
      icon: "i-map", iconColor: "t-navy",
      primaryBadge: "推定",
      primaryMain: "42,800",
      primaryUnit: "人 / 週",
      indexLine: "指数 81　前週比 +5pt",
      caption: "接続観光地へ誘導可能な来訪者の推定規模（乗降・予約・Web/Appから推計）。",
    },
    {
      key: "hva-signal",
      label: "高付加価値需要",
      icon: "i-chart", iconColor: "t-green",
      primaryMain: "8,400",
      primaryUnit: "件 / 週",
      indexLine: "指数 74　前週比 +6pt",
      caption: "宿泊・体験・食・温泉関連の閲覧／予約イベント（Web/App・予約ログから集計したデモ値）。",
    },
    {
      key: "spend-loss",
      label: "消費機会ロス",
      icon: "i-yen", iconColor: "t-red",
      primaryBadge: "推定",
      primaryMain: "中高",
      primaryUnit: "",
      referenceLine: "参考: 900万〜1,300万円 / 週（推定レンジ）",
      indexLine: "前月比 やや拡大",
      caption: "来訪に対して施設利用・予約への転換が弱いと推定される余地。換算は参考値です。",
    },
    {
      key: "underflow",
      label: "回遊不足エリア",
      icon: "i-flow", iconColor: "t-gold",
      primaryMain: "5",
      primaryUnit: "エリア / 対象12エリア中",
      indexLine: "指数 72",
      caption: "来訪はあるが周辺回遊が弱いエリア数。",
    },
    {
      key: "impact",
      label: "施策効果",
      icon: "i-target", iconColor: "t-navy",
      primaryMain: "12件中8件",
      primaryUnit: "で反応改善（実測）",
      referenceLine: "参考（推定レンジ）: 付加売上効果 +9〜15% / 月",
      indexLine: "指数 68　効果指数 +7pt",
      caption: "実施中施策に紐づくクリック・予約の変化。効果の裏付けや保証を意味するものではありません。",
    },
    {
      key: "izu-referral",
      label: "伊豆送客候補",
      icon: "i-broadcast", iconColor: "t-blue",
      primaryMain: "6",
      primaryUnit: "導線",
      secondaryAbsolute: "推定接触者 18,000人 / 週",
      indexLine: "前週比 +2導線",
      caption: "伊豆方面への周遊候補として検出された導線数。配信・表示のユニーク接触者の推定。",
    },
  ];

  const MARKET_TRENDS_DASH = [
    { label: "訪日市場", text: "台湾・韓国市場の検索関心が前月比 +12%（想定集計）" },
    { label: "天候", text: "週末は雨予報のため、屋内・温泉・宿泊体験導線の訴求を優先検討" },
    { label: "宿泊需要", text: "伊豆方面の宿泊検索・予約関連で、需要が増加傾向" },
    { label: "検索関心", text: "「伊豆 温泉 旅館」「熱海 海鮮」クエリの関心が上昇" },
    { label: "イベント", text: "大型連休前後は湘南・箱根の事前閲覧が先行 — 旅前メールの枠を確保" },
  ];

  const PRIORITY_AREAS = [
    { rank: 1, name: "熱海", judge: "来訪は高く宿泊・食体験への事前案内を強化する余地。", score: 88, scoreBar: "b-red", priority: "high", priorityLabel: "最優先", scale: "推定対象 9.4万人 / 週" },
    { rank: 2, name: "箱根湯本", judge: "ゲートウェイとして来訪が大きく、消費転換と広域接続の両面で要対応。", score: 86, scoreBar: "b-red", priority: "high", priorityLabel: "高", scale: "推定対象 18.6万人 / 週" },
    { rank: 3, name: "伊東", judge: "滞在価値指数が高く、送客強化・半日導線の設計余地。", score: 79, scoreBar: "b-gold", priority: "high", priorityLabel: "高", scale: "推定対象 4.9万人 / 週" },
    { rank: 4, name: "江ノ島", judge: "湘南エリアの立ち寄り需要。箱根・伊豆との周遊候補として訴求余地。", score: 71, scoreBar: "b-gold", priority: "medium", priorityLabel: "中", scale: "推定対象 12.8万人 / 週" },
    { rank: 5, name: "修善寺", judge: "静かな温泉滞在・文化体験志向に合う高付加価値需要の兆し。", score: 64, scoreBar: "b-green", priority: "medium", priorityLabel: "中", scale: "推定対象 2.6万人 / 週" },
  ];

  const RECOMMENDED_ACTIONS = [
    {
      title: "熱海: 温泉宿泊・食体験の旅前案内を強化",
      sub: "ロマンスカー予約後の閲覧で温泉・飲食ページへの関心が高い。予約後メールと駅サイネージで接続訴求。",
      tags: [["t-red", "最優先"], ["t-navy", "対象 / 熱海"]],
    },
    {
      title: "伊東: 海鮮・温泉・文化施設の半日導線を設計",
      sub: "日帰り〜短期滞在層向けに、高単価体験を組み合わせた周遊候補を提示。",
      tags: [["t-gold", "高"], ["t-blue", "対象 / 伊東"]],
    },
    {
      title: "箱根滞在後 → 熱海・伊豆方面の広域周遊案内",
      sub: "接続観光地としての連携導線。混雑ピーク時は分散周遊の候補として有効。",
      tags: [["t-green", "広域送客"], ["t-navy", "周遊候補"]],
    },
    {
      title: "江ノ島・湘南: 旅前の立ち寄り導線",
      sub: "小田原経由の伊豆・箱根周遊と組み合わせた訴求余地。",
      tags: [["t-gold", "中"], ["t-navy", "対象 / 湘南"]],
    },
  ];

  const TREND_AREAS = [
    { name: "熱海",   color: "#1f4775", data: [62, 65, 68, 72, 76, 80, 84] },
    { name: "箱根湯本", color: "#0a8e6b", data: [78, 80, 82, 84, 85, 86, 86] },
    { name: "伊東",   color: "#b07712", data: [48, 50, 52, 55, 58, 62, 66] },
    { name: "江ノ島", color: "#2c5e94", data: [44, 46, 48, 50, 52, 54, 56] },
  ];
  const TREND_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];

  const COMPOSITION = [
    { name: "箱根エリア", val: 28, bar: "" },
    { name: "伊豆エリア", val: 24, bar: "c-green" },
    { name: "湘南・江ノ島", val: 18, bar: "c-blue" },
    { name: "小田原", val: 14, bar: "c-gold" },
    { name: "その他沿線", val: 16, bar: "c-violet" },
  ];

  // ----- 上位客層インサイト（セグメント画面） -----
  const SEGMENT_INSIGHT_KPIS = [
    { key: "hva-sig", label: "高付加価値需要", icon: "i-chart", iconColor: "t-green", primaryMain: "6,700", primaryUnit: "件 / 週（関連行動）", indexLine: "指数 74　前週比 +6pt", caption: "滞在・体験単価の向上余地が示唆される関心の強さを、指数化した補助指標です。" },
    { key: "focus-n", label: "注目エリア", icon: "i-pin", iconColor: "t-navy", primaryMain: "5", primaryUnit: "エリア", indexLine: "関心度 上位 / 前月比 +1", caption: "伊豆・湘南・箱根の接続観光地で、需要の兆しが相対的に強い地点。" },
    { key: "themes", label: "関心テーマ密度", icon: "i-ticket", iconColor: "t-gold", primaryMain: "182,000", primaryUnit: "ページビュー / 週", indexLine: "指数 68　前週比 ±0pt", caption: "温泉・食・文化・自然など、関心カテゴリが重なって現れる度合い（Web/App集計のデモ）。" },
    { key: "touch", label: "推奨タッチポイント", icon: "i-broadcast", iconColor: "t-blue", primaryMain: "7", primaryUnit: "経路", secondaryAbsolute: "推定到達 24万人 / 週（リーチ重複あり）", indexLine: "前月比 +1経路", caption: "旅前〜現地まで一貫して訴求を載せられる接点候補。" },
  ];
  const SEGMENT_FOCUS_AREAS = [
    { name: "熱海", score: 86, note: "宿泊・食体験ページへの遷移が増加。旅前案内の強化余地。", abs: "関連行動 推定 1,240件/週" },
    { name: "伊東", score: 81, note: "海鮮・温泉・文化施設の複合関心。半日周遊の設計余地。", abs: "関連行動 推定 980件/週" },
    { name: "修善寺", score: 74, note: "静穏志向・文化体験の関心が相対的に高い。", abs: "関連行動 推定 620件/週" },
    { name: "伊豆高原", score: 72, note: "自然・アート・宿泊の組み合わせ関心。", abs: "関連行動 推定 710件/週" },
    { name: "下田", score: 66, note: "海・歴史テーマの閲覧が長期滞在文脈で増加。", abs: "関連行動 推定 540件/週" },
  ];
  const SEGMENT_MARKET_TRENDS = [
    { label: "訪日市場", text: "台湾・韓国市場の検索関心が前月比 +12%（想定集計）" },
    { label: "宿泊需要", text: "伊豆方面の宿泊検索・予約関連で、需要が増加傾向" },
    { label: "検索関心", text: "「伊豆 温泉 旅館」「熱海 海鮮」の関心が上昇" },
    { label: "天候", text: "週末は雨予報のため屋内・温泉導線の訴求を優先検討" },
  ];
  const SEGMENT_THEMES = [
    { name: "温泉", weight: 92 },
    { name: "食・ガストロノミー", weight: 84 },
    { name: "文化体験", weight: 71 },
    { name: "自然・アート", weight: 68 },
    { name: "宿泊滞在", weight: 76 },
    { name: "プライベート/少人数体験", weight: 58 },
  ];
  const SEGMENT_TOUCHPOINTS = [
    "ロマンスカー予約後メール",
    "Web/App内レコメンド",
    "駅サイネージ",
    "観光案内QR",
    "宿泊施設連携",
    "海外向けLP",
    "海外旅行会社/OTA向け素材",
  ];
  const SEGMENT_CONTENT_IDEAS = [
    "熱海：温泉宿泊と食体験をセットにした旅前ガイド（所要時間・予約導線付き）",
    "伊東：海鮮・温泉・文化施設を半日で回るモデルコース（乗換・接続の注意書き付き）",
    "修善寺：静かな温泉滞在と文化体験を組み合わせた滞在型コンテンツ",
    "伊豆高原：自然散策・アート施設・宿泊をつなぐ周遊候補マップ",
    "下田：海・歴史を軸にした長期滞在向けテーマ記事と周遊候補",
  ];

  // ----- Area Analysis -----
  const AREAS = [
    {
      name: "箱根湯本", sub: "ゲートウェイ / 鉄道・バス",
      visit: 92, flow: 58, spend: 34, hva: 48, crowd: "高",
      ev: "推定 18.6万人/週", ef: "推定 10.8万人/週", sr: "参考 推定レンジ 4.2〜5.9億円/週", ha: "関連行動 1,180件/週", pt: "対象規模 推定 18.6万人/週",
      priority: "high", priorityLabel: "最優先",
      state: "来訪は多いが消費転換と広域接続の両面で課題",
      decision: "荷物・待ち時間・乗換前消費の改善と、接続観光地への周遊案内を優先",
    },
    {
      name: "大涌谷", sub: "王道観光 / 観光ピーク",
      visit: 88, flow: 81, spend: 61, hva: 62, crowd: "高",
      ev: "推定 14.2万人/週", ef: "推定 11.5万人/週", sr: "参考 推定レンジ 5.6〜7.1億円/週", ha: "関連行動 920件/週", pt: "対象規模 推定 14.2万人/週",
      priority: "medium", priorityLabel: "中",
      state: "ピーク時の集中度が高く、混雑による満足度低下リスク",
      decision: "時間帯シフトと接続観光地への分散周遊候補を併記して案内",
    },
    {
      name: "強羅", sub: "中継・宿泊エリア",
      visit: 58, flow: 65, spend: 30, hva: 55, crowd: "中",
      ev: "推定 6.8万人/週", ef: "推定 4.4万人/週", sr: "参考 推定レンジ 1.6〜2.2億円/週", ha: "関連行動 640件/週", pt: "対象規模 推定 6.8万人/週",
      priority: "high", priorityLabel: "高",
      state: "回遊余地があるが施設利用が弱い",
      decision: "体験・飲食・短時間滞在プランを強化",
    },
    {
      name: "仙石原", sub: "観光・自然散策",
      visit: 36, flow: 48, spend: 68, hva: 70, crowd: "低",
      ev: "推定 3.1万人/週", ef: "推定 1.5万人/週", sr: "参考 推定レンジ 0.9〜1.3億円/週", ha: "関連行動 510件/週", pt: "対象規模 推定 3.1万人/週",
      priority: "low", priorityLabel: "低",
      state: "来訪は少ないが消費効率が高い",
      decision: "王道ルート混雑時の代替誘導先として強化",
    },
    {
      name: "小田原", sub: "乗換 / 沿線玄関口",
      visit: 61, flow: 52, spend: 44, hva: 50, crowd: "中",
      ev: "推定 11.4万人/週", ef: "推定 5.9万人/週", sr: "参考 推定レンジ 2.1〜2.9億円/週", ha: "関連行動 780件/週", pt: "対象規模 推定 11.4万人/週",
      priority: "medium", priorityLabel: "中",
      state: "広域周遊の接続点として滞留と街区消費の両立が課題",
      decision: "短時間消費導線と、熱海・伊豆方面の連携導線案内を検討",
    },
    {
      name: "江ノ島", sub: "湘南 / 海沿いレジャー",
      visit: 72, flow: 54, spend: 48, hva: 58, crowd: "高",
      ev: "推定 12.8万人/週", ef: "推定 6.9万人/週", sr: "参考 推定レンジ 2.8〜3.6億円/週", ha: "関連行動 860件/週", pt: "対象規模 推定 12.8万人/週",
      priority: "medium", priorityLabel: "中",
      state: "立ち寄り需要が強く、箱根・伊豆との周遊候補として訴求余地",
      decision: "旅前の立ち寄りと広域周遊を組み合わせた案内を強化",
    },
    {
      name: "熱海", sub: "温泉街・宿泊 / 接続観光地",
      visit: 86, flow: 62, spend: 52, hva: 82, crowd: "高",
      ev: "推定 9.4万人/週", ef: "推定 5.8万人/週", sr: "参考 推定レンジ 3.4〜4.5億円/週", ha: "関連行動 1,240件/週", pt: "対象規模 推定 9.4万人/週",
      priority: "high", priorityLabel: "最優先",
      state: "来訪は高く、宿泊・食体験への事前案内強化の余地",
      decision: "宿泊・食体験への事前案内を強化",
    },
    {
      name: "伊東", sub: "温泉・海鮮・文化 / 伊豆東岸",
      visit: 54, flow: 48, spend: 58, hva: 79, crowd: "中",
      ev: "推定 4.9万人/週", ef: "推定 2.3万人/週", sr: "参考 推定レンジ 1.4〜1.9億円/週", ha: "関連行動 980件/週", pt: "対象規模 推定 4.9万人/週",
      priority: "high", priorityLabel: "高",
      state: "滞在価値指数が高く、送客強化と半日導線の設計余地",
      decision: "温泉・海鮮・文化施設の半日導線を設計",
    },
    {
      name: "修善寺", sub: "温泉・文化 / 伊豆中部",
      visit: 38, flow: 42, spend: 44, hva: 76, crowd: "低",
      ev: "推定 2.6万人/週", ef: "推定 1.1万人/週", sr: "参考 推定レンジ 0.6〜0.9億円/週", ha: "関連行動 620件/週", pt: "対象規模 推定 2.6万人/週",
      priority: "medium", priorityLabel: "中",
      state: "静かな温泉滞在・文化体験志向に合う高付加価値需要の兆し",
      decision: "静かな温泉滞在・文化体験を訴求",
    },
    {
      name: "伊豆高原", sub: "自然・アート・宿泊",
      visit: 44, flow: 50, spend: 52, hva: 78, crowd: "中",
      ev: "推定 3.4万人/週", ef: "推定 1.7万人/週", sr: "参考 推定レンジ 0.9〜1.2億円/週", ha: "関連行動 710件/週", pt: "対象規模 推定 3.4万人/週",
      priority: "medium", priorityLabel: "中",
      state: "自然・アート・宿泊の組み合わせ関心が強い",
      decision: "自然・アート・宿泊滞在を組み合わせる周遊候補を提示",
    },
    {
      name: "下田", sub: "海・歴史 / 伊豆南端",
      visit: 32, flow: 36, spend: 46, hva: 72, crowd: "低",
      ev: "推定 2.1万人/週", ef: "推定 0.8万人/週", sr: "参考 推定レンジ 0.5〜0.7億円/週", ha: "関連行動 540件/週", pt: "対象規模 推定 2.1万人/週",
      priority: "medium", priorityLabel: "中",
      state: "遠方エリアのため単発誘導より長期滞在テーマとの相性が高い",
      decision: "海・歴史・長期滞在導線を強化",
    },
  ];

  const SEGMENTS = [
    { seg: "上位客層の関心", visit: 62, spend: 71, visitAbs: "推定 4.2万人/週", spendAbs: "参考 推定レンジ 7.1〜9.2億円/週", hint: "温泉・食・文化の複合関心。旅前メールと宿泊連携の余地" },
    { seg: "国内 ファミリー",  visit: 78, spend: 52, visitAbs: "推定 28.6万人/週", spendAbs: "参考 推定レンジ 18〜24億円/週", hint: "週末・10〜14時に集中" },
    { seg: "国内 カップル",    visit: 65, spend: 58, visitAbs: "推定 11.2万人/週", spendAbs: "参考 推定レンジ 9.4〜12億円/週", hint: "体験・飲食・宿泊の単価向上余地が相対的に大きい" },
    { seg: "インバウンド 英語", visit: 42, spend: 64, visitAbs: "推定 3.8万人/週", spendAbs: "参考 推定レンジ 5.2〜6.8億円/週", hint: "Web閲覧から現地周遊までの導線を補強" },
    { seg: "インバウンド 繁体字", visit: 38, spend: 55, visitAbs: "推定 3.1万人/週", spendAbs: "参考 推定レンジ 3.9〜5.1億円/週", hint: "湘南・箱根・伊豆の周遊候補の訴求余地" },
    { seg: "シニア層",          visit: 48, spend: 40, visitAbs: "推定 6.5万人/週", spendAbs: "参考 推定レンジ 4.1〜5.3億円/週", hint: "平日午前帯の滞留が多い" },
  ];

  // ----- Area Map (広域エリア概況マップ) -----
  // ノードの座標は概略レイアウト用（px, SVG viewBox 800×460 基準）
  // ノード座標: viewBox 800×390 基準
  // 上段(y≈85): 新宿〜大涌谷 主要ルート
  // 中段(y≈200): 小田原・箱根湯本の中継点
  // 下段(y≈260-350): 伊豆方面
  // 左下(y≈210): 湘南
  const MAP_NODES = [
    {
      id: "shinjuku", name: "新宿", x: 60, y: 85,
      weeklyVisitors: 248000, visitorIndex: 100, congestion: "medium",
      valueDemandIndex: 42, category: "gateway",
      showStats: true, statNote: "指数 100",
      recommendation: "全エリアへの出発点。旅前コンテンツと予約導線の起点として機能。",
    },
    {
      id: "enoshima", name: "江ノ島・湘南", nameShort: "江ノ島", x: 60, y: 215,
      weeklyVisitors: 128000, visitorIndex: 72, congestion: "high",
      valueDemandIndex: 58, category: "shonan",
      showStats: true, statNote: "指数 72",
      recommendation: "旅前の立ち寄りと広域周遊を組み合わせた案内を強化。",
    },
    {
      id: "odawara", name: "小田原", x: 230, y: 85,
      weeklyVisitors: 114000, visitorIndex: 61, congestion: "medium",
      valueDemandIndex: 50, category: "connector",
      showStats: true, statNote: "指数 61",
      recommendation: "短時間消費導線と熱海・伊豆方面の連携導線案内を検討。",
    },
    {
      id: "yumoto", name: "箱根湯本", x: 370, y: 85,
      weeklyVisitors: 186000, visitorIndex: 92, congestion: "critical",
      valueDemandIndex: 48, category: "hakone",
      showStats: true, statNote: "指数 92",
      recommendation: "荷物・待ち時間・乗換前消費の改善を優先。",
    },
    {
      id: "gora", name: "強羅", x: 510, y: 85,
      weeklyVisitors: 68000, visitorIndex: 58, congestion: "medium",
      valueDemandIndex: 55, category: "hakone",
      showStats: true, statNote: "指数 58",
      recommendation: "体験・飲食・短時間滞在プランを強化。",
    },
    {
      id: "owakudani", name: "大涌谷", x: 645, y: 85,
      weeklyVisitors: 142000, visitorIndex: 88, congestion: "high",
      valueDemandIndex: 62, category: "hakone",
      showStats: true, statNote: "指数 88",
      recommendation: "時間帯シフトと代替ルート案内を検討。",
    },
    {
      id: "atami", name: "熱海", x: 290, y: 255,
      weeklyVisitors: 94000, visitorIndex: 86, congestion: "high",
      valueDemandIndex: 82, category: "izu",
      showStats: true, statNote: "高付加価値需要 82",
      recommendation: "宿泊・食体験への事前案内を強化。",
    },
    {
      id: "ito", name: "伊東", x: 430, y: 255,
      weeklyVisitors: 58000, visitorIndex: 54, congestion: "medium",
      valueDemandIndex: 79, category: "izu",
      showStats: true, statNote: "送客候補",
      recommendation: "温泉・海鮮・文化施設の半日導線を提案。",
    },
    {
      id: "shuzenji", name: "修善寺", x: 360, y: 340,
      weeklyVisitors: 31000, visitorIndex: 42, congestion: "low",
      valueDemandIndex: 76, category: "izu",
      showStats: false, labelBelow: false,
      recommendation: "静かな温泉滞在・文化体験を訴求。",
    },
    {
      id: "izukogen", name: "伊豆高原", x: 565, y: 255,
      weeklyVisitors: 34000, visitorIndex: 44, congestion: "medium",
      valueDemandIndex: 78, category: "izu",
      showStats: false,
      recommendation: "自然・アート・宿泊滞在を組み合わせる周遊候補を提示。",
    },
    {
      id: "shimoda", name: "下田", x: 695, y: 255,
      weeklyVisitors: 21000, visitorIndex: 32, congestion: "low",
      valueDemandIndex: 72, category: "izu",
      showStats: false,
      recommendation: "海・歴史・長期滞在導線を強化。",
    },
  ];
  const MAP_EDGES = [
    { from: "shinjuku",  to: "odawara",   type: "main" },
    { from: "shinjuku",  to: "enoshima",  type: "branch" },
    { from: "odawara",   to: "yumoto",    type: "main" },
    { from: "yumoto",    to: "gora",      type: "main" },
    { from: "gora",      to: "owakudani", type: "main" },
    { from: "odawara",   to: "atami",     type: "connect" },
    { from: "atami",     to: "ito",       type: "connect" },
    { from: "atami",     to: "shuzenji",  type: "connect" },
    { from: "ito",       to: "izukogen",  type: "connect" },
    { from: "izukogen",  to: "shimoda",   type: "connect" },
  ];
  // 各レイヤーでノードの参照指標とカラーを決定（AREAS配列と名寄せ）
  function mapNodeArea(n) {
    var key = n.nameShort || n.name.split("\n")[0];
    return AREAS.find(function(a) { return a.name === key; }) || null;
  }
  const MAP_LAYERS = {
    visit: { label: "来訪",           barCls: "b-red",   getVal: function(n) { return n.visitorIndex; } },
    flow:  { label: "回遊",           barCls: "b-gold",  getVal: function(n) { var a = mapNodeArea(n); return a ? a.flow : (n.visitorIndex * 0.6 | 0); } },
    spend: { label: "消費/利用",      barCls: "b-green", getVal: function(n) { var a = mapNodeArea(n); return a ? a.spend : (n.visitorIndex * 0.45 | 0); } },
    hva:   { label: "高付加価値需要", barCls: "b-gold",  getVal: function(n) { return n.valueDemandIndex; } },
  };

  // ----- Flow Analysis -----
  const FLOW_KPIS = [
    {
      label: "主要導線の集中度",
      icon: "i-target", iconColor: "t-navy",
      primaryMain: "182,000",
      primaryUnit: "セッション / 週",
      secondaryAbsolute: "実測: 周遊モデル閲覧（Web/App・合算）",
      indexLine: "指数 69　前週比 +3pt",
      caption: "同一モデルコース閲覧に集中している度合い。分散案内の要否を補助します。",
    },
    {
      label: "周遊分散（副次エリア）",
      icon: "i-flow", iconColor: "t-green",
      primaryBadge: "推定",
      primaryMain: "67,000",
      primaryUnit: "人 / 週",
      indexLine: "指数 41　前週比 +2pt",
      caption: "接続観光地の副次スポットへ移動したと推定される人数（乗降・トラフィックから推計）。",
    },
    {
      label: "天候連動の反応",
      icon: "i-cloud-rain", iconColor: "t-gold",
      primaryMain: "+4,200",
      primaryUnit: "クリック / 週（雨天時・屋内LP）",
      indexLine: "影響度 中　前週比 ±0",
      caption: "降水確率しきい値超過日の、屋内・温泉系LPへの追加クリック（ログ実測のデモ）。",
    },
  ];

  const ROUTE_FLOW = {
    primary: [
      "新宿 → 箱根湯本 → 大涌谷",
      "新宿 → 小田原 → 箱根",
      "新宿 → 片瀬江ノ島",
    ],
    candidates: [
      "小田原 → 熱海",
      "熱海 → 伊東",
      "伊東 → 伊豆高原",
      "三島/小田原接続 → 修善寺",
      "箱根滞在後 → 熱海/伊豆方面",
    ],
    judgment: "<strong>判断:</strong> 小田急線区間のみの直行を前提にしない集計です。鉄道・バス等の<strong>接続観光地</strong>を含む<strong>広域送客・連携導線</strong>として、週末は<strong>熱海・伊東方面の周遊候補</strong>を旅前チャネルで補強することを推奨します。",
  };

  // time heatmap: rows = area, cols = time bucket, value = level 1-5
  const TIME_HEATMAP = {
    cols: ["8時", "10時", "12時", "14時", "16時", "18時"],
    rows: [
      { area: "箱根湯本", v: [2, 5, 4, 4, 3, 2] },
      { area: "大涌谷",   v: [1, 4, 5, 4, 2, 1] },
      { area: "熱海",     v: [2, 3, 4, 4, 3, 3] },
      { area: "伊東",     v: [1, 2, 3, 3, 3, 2] },
      { area: "江ノ島",   v: [2, 4, 4, 3, 3, 2] },
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
  // x: 来訪指数, y: 消費・滞在価値指数（0–100）; bottom 座標でプロット
  const SPEND_AREAS = [
    { name: "箱根湯本", v: 92, s: 34, cls: "priority-a", label: "箱湯", note: "来訪多・消費転換に課題", est: "推定来訪 18.6万人/週" },
    { name: "熱海",     v: 86, s: 52, cls: "priority-c", label: "熱海", note: "来訪多・宿泊/食体験の伸び余地", est: "推定来訪 9.4万人/週" },
    { name: "大涌谷",   v: 88, s: 61, cls: "priority-c", label: "大涌", note: "維持しつつ単価・分散周遊を検討", est: "推定来訪 14.2万人/週" },
    { name: "伊東",     v: 52, s: 76, cls: "priority-b", label: "伊東", note: "滞在価値高・送客強化候補", est: "推定来訪 4.9万人/週" },
    { name: "修善寺",   v: 38, s: 80, cls: "priority-b", label: "修善", note: "高付加価値体験候補", est: "推定来訪 2.6万人/週" },
    { name: "伊豆高原", v: 44, s: 78, cls: "priority-b", label: "伊高", note: "自然・アート滞在候補", est: "推定来訪 3.4万人/週" },
    { name: "下田",     v: 30, s: 74, cls: "priority-b", label: "下田", note: "長期滞在候補", est: "推定来訪 2.1万人/週" },
    { name: "江ノ島",   v: 70, s: 50, cls: "priority-c", label: "江ノ", note: "立ち寄りと周遊の接続余地", est: "推定来訪 12.8万人/週" },
  ];

  const SPEND_LOSS = [
    { area: "箱根湯本", visit: 92, spend: 34, gap: -58, estVisit: "推定 18.6万人/週", estUse: "施設・提携 利用 推定 38万件/週", refLoss: "参考 推定レンジ 2,600〜3,400万円/週", hint: "乗換前消費と広域周遊案内の両面で改善余地" },
    { area: "強羅",     visit: 58, spend: 30, gap: -28, estVisit: "推定 6.8万人/週", estUse: "施設・提携 利用 推定 11万件/週", refLoss: "参考 推定レンジ 820〜1,100万円/週", hint: "体験・飲食・半日導線の設計余地" },
    { area: "江ノ島",   visit: 72, spend: 48, gap: -24, estVisit: "推定 12.8万人/週", estUse: "施設・提携 利用 推定 24万件/週", refLoss: "参考 推定レンジ 1,100〜1,450万円/週", hint: "箱根・伊豆周遊との接続訴求を強化" },
    { area: "小田原",   visit: 61, spend: 44, gap: -17, estVisit: "推定 11.4万人/週", estUse: "施設・提携 利用 推定 19万件/週", refLoss: "参考 推定レンジ 740〜980万円/週", hint: "接続観光地への送客タイミングの最適化" },
  ];

  const SPEND_EFF = [
    { area: "伊東",   visit: 54, spend: 76, eff: "+22", estVisit: "推定 4.9万人/週", estUse: "施設利用 推定 14万件/週", refSpend: "参考 推定レンジ 1.9〜2.5億円/週", hint: "送客強化・半日モデルコースの訴求余地" },
    { area: "修善寺", visit: 38, spend: 80, eff: "+42", estVisit: "推定 2.6万人/週", estUse: "施設利用 推定 7.8万件/週", refSpend: "参考 推定レンジ 0.9〜1.2億円/週", hint: "静穏・文化体験の上位客層向け施策候補" },
    { area: "仙石原", visit: 36, spend: 68, eff: "+32", estVisit: "推定 3.1万人/週", estUse: "施設利用 推定 8.2万件/週", refSpend: "参考 推定レンジ 0.7〜0.95億円/週", hint: "混雑時の分散周遊先として有効" },
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
      reason: "来訪は多いが、施設利用・クーポンへの転換が相対的に低く、乗換前の摩擦が要因候補のため。",
      effect: "湯本周辺の施設利用・予約転換 +6 pt",
      task: "提携店舗の食べ歩きパス、荷物預かり拠点の拡充、案内マップ更新",
      kpis: ["食べ歩きパス利用率", "湯本周辺施設利用・予約指数"],
      meta: [["t-red", "送客転換"], ["t-navy", "対象 / 箱根湯本"]],
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
      reason: "移動はあるが、体験・飲食予約への転換が弱く、体験素材の有効性を確認したいため。",
      effect: "強羅周辺の施設利用・予約転換 +5 pt",
      task: "体験予約クーポン2案を14日比較。利用率と周辺施設利用・予約指数の変化を確認。",
      kpis: ["クーポン利用率", "強羅周辺施設利用・予約指数"],
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
    {
      id: "i10",
      title: "熱海 温泉宿泊・食体験パッケージ訴求",
      status: "running", statusLabel: "実施中",
      priority: "p-high", priorityLabel: "優先度 高",
      area: "熱海",
      segment: "ロマンスカー予約済みで温泉・飲食カテゴリの閲覧が高い層",
      reason: "ロマンスカー予約後の閲覧で温泉・飲食ページへの関心が高い状態が続いているため。",
      effect: "予約後ページ閲覧率・宿泊/飲食送客率の改善",
      task: "予約後メール・Web/App・駅サイネージで旅前モデルコースと予約導線を提示",
      kpis: ["予約後ページ閲覧率", "宿泊/飲食送客率"],
      meta: [["t-red", "伊豆送客"], ["t-navy", "旅前案内"]],
    },
    {
      id: "i11",
      title: "伊東 海鮮・温泉・文化施設の半日導線",
      status: "consider", statusLabel: "検討中",
      priority: "p-high", priorityLabel: "優先度 高",
      area: "伊東",
      segment: "日帰り〜2泊の国内旅行者、海鮮・温泉の閲覧が重なる層",
      reason: "日帰り〜短期滞在層向けに、半日で回れる体験導線の不足が見られるため。",
      effect: "施設利用率・回遊指数・消費指数の改善",
      task: "半日モデルコースのマップ化、QR・観光案内との連動",
      kpis: ["施設利用率", "回遊指数", "消費指数"],
      meta: [["t-gold", "半日導線"], ["t-blue", "伊豆"]],
    },
    {
      id: "i12",
      title: "修善寺 静かな温泉滞在・文化体験導線",
      status: "consider", statusLabel: "検討中",
      priority: "p-med", priorityLabel: "優先度 中",
      area: "修善寺",
      segment: "静穏・文化体験カテゴリの閲覧が高い層、海外向けLP流入",
      reason: "静穏志向・文化体験志向に合う高付加価値需要の兆しが相対的に高いため。",
      effect: "滞在時間・体験予約率・宿泊送客率の改善",
      task: "海外向けLP・宿泊施設連携パンフレットで滞在型プランを訴求",
      kpis: ["滞在時間", "体験予約率", "宿泊送客率"],
      meta: [["t-navy", "文化体験"], ["t-green", "静穏"]],
    },
    {
      id: "i13",
      title: "伊豆高原 自然・アート滞在プラン",
      status: "review", statusLabel: "要確認",
      priority: "p-med", priorityLabel: "優先度 中",
      area: "伊豆高原",
      segment: "自然・アート・宿泊カテゴリの複合閲覧が検出された層",
      reason: "自然・アート・宿泊の組み合わせ関心が上位客層向け施策候補として検出されているため。",
      effect: "宿泊導線クリック率・体験予約率の改善",
      task: "Web/App・SNS・宿泊連携で1日〜2日の周遊候補を提示",
      kpis: ["宿泊導線クリック率", "体験予約率"],
      meta: [["t-gold", "要確認"], ["t-blue", "周遊候補"]],
    },
    {
      id: "i14",
      title: "下田 海・歴史・長期滞在提案",
      status: "consider", statusLabel: "検討中",
      priority: "p-med", priorityLabel: "優先度 中",
      area: "下田",
      segment: "歴史・海関連の検索と3泊以上プラン閲覧が重なる層",
      reason: "遠方エリアのため単発誘導より長期滞在テーマとの相性が高い傾向のため。",
      effect: "滞在日数・周遊導線利用率の改善",
      task: "旅前メール・海外向け記事で3泊以上モデルと接続周遊を提示",
      kpis: ["滞在日数", "周遊導線利用率"],
      meta: [["t-navy", "長期滞在"], ["t-green", "伊豆南端"]],
    },
    {
      id: "i15",
      title: "江ノ島・湘南 旅前立ち寄り導線",
      status: "running", statusLabel: "実施中",
      priority: "p-med", priorityLabel: "優先度 中",
      area: "江ノ島・湘南",
      segment: "湘南エリア閲覧後に箱根・伊豆ページへ遷移した旅前層",
      reason: "湘南の立ち寄り需要と、箱根・伊豆広域周遊を組み合わせる余地があるため。",
      effect: "周遊候補クリック率・湘南→伊豆方面遷移率の改善",
      task: "旅前メール・Web/Appで小田原経由の周遊チェックリストを提示",
      kpis: ["周遊候補クリック率", "湘南→伊豆方面遷移率"],
      meta: [["t-blue", "湘南"], ["t-gold", "広域周遊"]],
    },
  ];

  // 概要タブ「判断根拠」「関連データ」用（デモ）。実装時はAPI/集計定義に差し替え。
  const DEFAULT_INIT_RELATED_SOURCES = [
    "鉄道/バス乗降データ",
    "フリーパス利用データ",
    "Web/App閲覧ログ",
    "QR読み取りログ",
    "クーポン利用データ",
    "提携施設/体験予約データ",
  ];
  const INITIATIVE_DATA_PIPELINE_STEPS = [
    "交通利用データ",
    "エリア/時間帯集計",
    "Web/App閲覧・予約遷移",
    "提携施設利用/クーポン利用",
    "施策候補",
  ];
  const INITIATIVE_DATA_BLEND_ROWS = [
    { item: "移動量", source: "鉄道/バス乗降、フリーパス利用", looking: "対象エリアに人が来ているか" },
    { item: "時間帯", source: "乗降時刻、予約時刻", looking: "いつ滞在しているか" },
    { item: "関心", source: "Web/App閲覧、QR読み取り", looking: "何に興味を持っているか" },
    { item: "利用/予約", source: "施設利用、クーポン、体験予約", looking: "実際の利用につながっているか" },
    { item: "ギャップ", source: "来訪数と利用/予約率の差分", looking: "送客施策の余地があるか" },
  ];
  const INITIATIVE_OVERVIEW_EVIDENCE = {
    i01: {
      basis: [
        { label: "来訪", value: "箱根湯本・強羅 推定流入 24.8万人/週（乗降・フリーパス併算・デモ）" },
        { label: "天候連動", value: "降水確率60%超の日 屋外モデルコース閲覧 −18%（前週比）" },
        { label: "屋内関心", value: "屋内温泉・美術館カテゴリ 閲覧 8,600件/週" },
        { label: "予約/利用", value: "雨天時 提携施設・体験予約遷移 5.2%（エリア平均比 −2.1pt）" },
        { label: "ギャップ", value: "駅周辺セッションは多いが、屋内施設への予約転換が伸びにくい" },
      ],
    },
    i02: {
      basis: [
        { label: "来訪", value: "箱根湯本エリア 推定流入 18.6万人/週" },
        { label: "時間帯", value: "11:00〜16:00 に乗降・滞留が集中（駅改札・フリーパス照会から集計）" },
        { label: "関心", value: "商店街・食べ歩きLP 閲覧 5,400件/週" },
        { label: "利用/予約", value: "提携飲食・体験の予約クリック 4.1%" },
        { label: "ギャップ", value: "来訪に対して施設利用・予約への転換が相対的に低い" },
      ],
    },
    i03: {
      basis: [
        { label: "集中度", value: "王道ルート集中度 72/100（週末ピーク帯・デモ）" },
        { label: "来訪", value: "大涌谷周辺 推定 8,900人/週（同一時間帯）" },
        { label: "代替関心", value: "仙石原・強羅方面LP 閲覧 +12%（混雑案内表示後セッション）" },
        { label: "遷移", value: "代替先バス・体験の予約クリック 2.8%" },
        { label: "ギャップ", value: "混雑時に誘導余地があるが、代替先到達・予約までの転換が限定的" },
      ],
    },
    i04: {
      basis: [
        { label: "来訪", value: "仙石原エリア 推定流入 3,600人/週" },
        { label: "施設利用・予約", value: "周辺施設利用・予約指数 64/100（エリア内比で高水準）" },
        { label: "関心", value: "自然散策・美術カテゴリ 閲覧 2,100件/週" },
        { label: "誘導", value: "王道集中時の代替LP CTR 12%（案内表示後・デモ）" },
        { label: "ギャップ", value: "来訪規模は限定的だが利用効率が高く、送客の伸長余地がある" },
      ],
    },
    i05: {
      basis: [
        { label: "推定流入", value: "強羅周辺 12,400人/週" },
        { label: "ピーク時間帯", value: "11:00〜17:00に集中（乗降・滞留の集計デモ）" },
        { label: "Web/App関心", value: "工芸体験・飲食ページ閲覧 3,200件/週" },
        { label: "予約/利用", value: "提携施設予約率 6.8%（体験・飲食合算）" },
        { label: "ギャップ", value: "来訪に対して予約転換が低い" },
      ],
    },
    i06: {
      basis: [
        { label: "乗換セッション", value: "待ち時間15〜30分相当の行動セッション 推定 4,200件/週" },
        { label: "時間帯", value: "16:00〜20:00 に駅周辺乗降・フリーパス照会がピーク" },
        { label: "関心", value: "改札外提携店・街区マップページ閲覧 1,800件/週" },
        { label: "利用/クーポン", value: "提携店クーポン利用率 9.3%（改札外着地セッション比）" },
        { label: "ギャップ", value: "待ち時間がある一方で街区流入・予約クリックは限定的" },
      ],
    },
    i07: {
      basis: [
        { label: "閲覧", value: "英語・繁体字LPの閲覧比率 34%（エリア来訪推計との差が大きい層あり・デモ）" },
        { label: "関心", value: "多言語モデルコースの平均閲覧時間 +40秒（日本語ページ比）" },
        { label: "予約遷移", value: "外国語経路からの体験・施設予約クリック 3.1%" },
        { label: "ギャップ", value: "言語別の関心と、予約・クーポン取得までの転換にずれ" },
      ],
    },
    i08: {
      basis: [
        { label: "滞留", value: "湯本商店街半径500m 推定滞留セッション 高水準帯（デモ）" },
        { label: "関心", value: "ランチ・カフェカテゴリ 閲覧 2,600件/週" },
        { label: "クーポン", value: "商店街連携クーポン利用率 11%" },
        { label: "ギャップ", value: "短時間の回転は良いが提携網の引き上げ余地がある" },
      ],
    },
    i09: {
      basis: [
        { label: "時間帯", value: "免税案内・対象店舗LP閲覧が 13:00〜15:00 に偏在" },
        { label: "来訪", value: "対象エリアの週次流入はおおむね横ばい（乗降ベース・デモ）" },
        { label: "店舗遷移", value: "免税掲載店への地図・予約遷移 6.4%" },
        { label: "ギャップ", value: "閲覧はあるが時間帯によって店舗到達・予約が不均一" },
      ],
    },
    i10: {
      basis: [
        { label: "予約後行動", value: "ロマンスカー予約完了後7日以内の温泉・飲食カテゴリ閲覧 2,900件/週" },
        { label: "関心", value: "温泉宿泊パッケージ系ページの滞在が長め（セッション内・デモ）" },
        { label: "予約/利用", value: "体験・宿泊予約への遷移 5.5%" },
        { label: "ギャップ", value: "予約確定後の旅前タッチポイントでの整理が弱い" },
      ],
    },
    i11: {
      basis: [
        { label: "来訪", value: "伊東エリア 推定流入 9,200人/週" },
        { label: "関心", value: "海鮮・温泉カテゴリの複合閲覧 1,700件/週" },
        { label: "導線", value: "半日モデルコース完走率（送信セッション比）42%（デモ）" },
        { label: "ギャップ", value: "日帰り〜短期滞在で施設が散らばり利用・予約が分散しやすい" },
      ],
    },
    i12: {
      basis: [
        { label: "関心", value: "静穏・文化体験カテゴリ 閲覧 1,400件/週" },
        { label: "流入", value: "海外向けLPから体験詳細へ +9%（前月比・デモ）" },
        { label: "予約", value: "文化体験・温泉施設の予約率 7.2%" },
        { label: "ギャップ", value: "高付加価値需要の兆しに対し予約枠取り込みに余地" },
      ],
    },
    i13: {
      basis: [
        { label: "関心", value: "自然・アート・宿泊の複合閲覧 980件/週" },
        { label: "来訪", value: "伊豆高原周辺 推定 5,100人/週" },
        { label: "予約", value: "1〜2泊プラン・体験バンドルのクリック 4.6%" },
        { label: "ギャップ", value: "周遊候補提示が散在し、予約・クーポンへの遷移が分散しやすい" },
      ],
    },
    i14: {
      basis: [
        { label: "検索・閲覧", value: "歴史・海関連キーワードと3泊以上プラン閲覧の重複セッションあり（デモ）" },
        { label: "滞在", value: "平均滞在日数の伸長余地（周辺エリア比・デモ）" },
        { label: "導線", value: "長期滞在モデルページ閲覧 640件/週" },
        { label: "ギャップ", value: "遠方来訪に対し長期テーマの束ねが弱い" },
      ],
    },
    i15: {
      basis: [
        { label: "遷移", value: "湘南閲覧後に箱根・伊豆ページへ遷移 1,200件/週" },
        { label: "来訪", value: "湘南エリアのセッション規模は安定帯（デモ）" },
        { label: "周遊", value: "広域チェックリスト・送客クリック 3.3%" },
        { label: "ギャップ", value: "立ち寄り需要と箱根・伊豆方面の接続が弱い" },
      ],
    },
  };

  // ----- Initiative Details (drawer 詳細) -----
  // 各施策の運用詳細データ。チェックリストの完了とステータス変更は localStorage に保存される。
  const INITIATIVE_DETAILS = {
    i01: {
      related: ["雨天時の回遊指数", "屋内施設利用率", "ルート閲覧率"],
      department: "観光戦略部", owner: "佐藤 真理",
      period: { start: "2026/04/01", end: "2026/06/30" },
      checklist: [
        { id: "c1", label: "天気API連携と通知条件の確定", checked: true },
        { id: "c2", label: "対象屋内施設リストの確定", checked: true },
        { id: "c3", label: "ルート案内素材を作成", checked: true },
        { id: "c4", label: "アプリ通知文面のレビュー", checked: false },
        { id: "c5", label: "効果測定KPIを設定", checked: false },
        { id: "c6", label: "配信開始", checked: false },
      ],
      timeline: [
        { label: "施策設計", date: "04/01〜04/07", done: true },
        { label: "素材作成", date: "04/08〜04/18", done: true },
        { label: "配信開始", date: "04/22", done: false },
        { label: "効果レビュー", date: "05/06", done: false },
      ],
      delivery: {
        channels: ["Web/App", "QR", "サイネージ"],
        areas: ["箱根湯本", "強羅"],
        times: ["雨天予報日 全日", "週末 10:00〜15:00"],
        facilities: ["美術館", "屋内温泉", "屋内体験", "カフェ"],
        conditions: ["雨天予報が降水確率60%以上", "王道ルート集中度が65以上"],
        materials: {
          title: "雨でも楽しめる、屋内をめぐる半日ルート",
          body:  "美術館・温泉・カフェを組み合わせた屋内回遊コースをご案内します。",
          cta:   "ルートを見る",
          qrLabel: "湯本駅・強羅駅サイネージのQRから遷移",
          place: "湯本駅・強羅駅構内サイネージ、対象施設パートナーQR",
        },
      },
      measurement: {
        period: "実施開始から14日（前後比較）",
        events: [
          { label: "ルート表示数",       current: 78, target: 80, unit: "指数", change: "+18", judge: "改善傾向" },
          { label: "ルート閲覧率",       current: 24, target: 22, unit: "%",   change: "+12pt", judge: "改善傾向" },
          { label: "対象施設利用率",     current: 38, target: 40, unit: "%",   change: "+5pt",  judge: "改善傾向" },
          { label: "クーポン利用率",     current: 12, target: 15, unit: "%",   change: "+3pt",  judge: "要確認" },
          { label: "雨天時 回遊指数",    current: 64, target: 65, unit: "/100", change: "+8",   judge: "改善傾向" },
        ],
        nextDecision: "改善傾向",
      },
    },
    i02: {
      related: ["来訪集中度", "消費機会ロス", "回遊不足エリア"],
      department: "沿線事業部", owner: "山田 健太",
      period: { start: "2026/03/15", end: "2026/06/15" },
      checklist: [
        { id: "c1", label: "提携店舗候補を確認",         checked: true  },
        { id: "c2", label: "クーポン条件を確定",         checked: true  },
        { id: "c3", label: "QR/サイネージ掲載内容を確認", checked: true  },
        { id: "c4", label: "Web/App掲載文を確認",        checked: true  },
        { id: "c5", label: "効果測定KPIを設定",          checked: false },
        { id: "c6", label: "配信開始",                  checked: false },
      ],
      timeline: [
        { label: "店舗候補選定", date: "03/15〜03/25", done: true  },
        { label: "条件確定",     date: "03/26〜04/05", done: true  },
        { label: "配信開始",     date: "04/15",       done: false },
        { label: "中間レビュー", date: "05/06",       done: false },
      ],
      delivery: {
        channels: ["Web/App", "QR", "サイネージ"],
        areas: ["箱根湯本"],
        times: ["平日 11:00〜15:00", "週末 10:00〜16:00"],
        facilities: ["商店街 提携店", "荷物預かり拠点", "湯本駅前案内"],
        conditions: ["湯本駅 改札出場 30分以内", "提携店半径500m以内"],
        materials: {
          title: "湯本さんぽ 食べ歩きパス",
          body:  "提携20店で使える、湯本商店街限定の食べ歩きパス。荷物預かりも近くで便利。",
          cta:   "パスを取得",
          qrLabel: "湯本駅改札外サイネージから取得",
          place: "湯本駅構内サイネージ、提携店店頭、Web/Appバナー",
        },
      },
      measurement: {
        period: "実施開始から14日（前後比較）",
        events: [
          { label: "パス取得数",         current: 62, target: 70, unit: "指数",  change: "+22", judge: "改善傾向" },
          { label: "提携店利用率",       current: 41, target: 45, unit: "%",    change: "+7pt", judge: "改善傾向" },
          { label: "荷物預かり利用件数", current: 56, target: 60, unit: "指数",  change: "+18", judge: "改善傾向" },
          { label: "湯本周辺施設利用・予約指数", current: 41, target: 42, unit: "/100", change: "+7",   judge: "改善傾向" },
          { label: "滞在時間",           current: 38, target: 40, unit: "分",   change: "+6",   judge: "要確認" },
        ],
        nextDecision: "改善傾向",
      },
    },
    i03: {
      related: ["王道ルート集中度", "代替先到達率", "サイネージCTR"],
      department: "箱根担当", owner: "鈴木 香織",
      period: { start: "2026/05/01", end: "2026/07/31" },
      checklist: [
        { id: "c1", label: "混雑検知ルール定義",        checked: true  },
        { id: "c2", label: "代替先一覧の整備",          checked: true  },
        { id: "c3", label: "サイネージ表示素材を作成",  checked: false },
        { id: "c4", label: "アプリ通知文面のレビュー",  checked: false },
        { id: "c5", label: "効果測定KPIを設定",         checked: false },
        { id: "c6", label: "配信開始",                 checked: false },
      ],
      timeline: [
        { label: "施策設計",   date: "05/01〜05/10", done: true  },
        { label: "素材作成",   date: "05/11〜05/22", done: false },
        { label: "テスト配信", date: "05/26",       done: false },
        { label: "本配信",     date: "06/03",       done: false },
      ],
      delivery: {
        channels: ["サイネージ", "Web/App"],
        areas: ["大涌谷", "強羅", "仙石原"],
        times: ["週末 10:00〜14:00", "祝日 全日"],
        facilities: ["箱根ロープウェイ駅", "強羅駅", "仙石原バス停"],
        conditions: ["王道ルート集中度が70以上", "週末ピーク帯"],
        materials: {
          title: "混雑時の代替コース案内",
          body:  "ピーク時間帯は強羅・仙石原方面の代替コースもおすすめです。",
          cta:   "代替コースを見る",
          qrLabel: "駅サイネージのQRから遷移",
          place: "箱根エリア各駅サイネージ、アプリ通知",
        },
      },
      measurement: {
        period: "実施開始から14日（前後比較）",
        events: [
          { label: "案内表示数",       current: 42, target: 60, unit: "指数",  change: "—",   judge: "未実施" },
          { label: "代替先到達率",     current: 18, target: 25, unit: "%",    change: "—",   judge: "未実施" },
          { label: "王道集中度",       current: 72, target: 67, unit: "/100", change: "—",   judge: "未実施" },
          { label: "仙石原 来訪指数",  current: 36, target: 42, unit: "/100", change: "—",   judge: "未実施" },
          { label: "代替先 施設利用・予約指数", current: 55, target: 58, unit: "/100", change: "—", judge: "未実施" },
        ],
        nextDecision: "実施準備中",
      },
    },
    i04: {
      related: ["仙石原 来訪指数", "客単価指数", "代替誘導クリック率"],
      department: "マーケティング部", owner: "高橋 沙織",
      period: { start: "2026/05/15", end: "2026/08/15" },
      checklist: [
        { id: "c1", label: "予約完了画面の訴求文を確定",    checked: true  },
        { id: "c2", label: "サイネージ素材の作成",          checked: false },
        { id: "c3", label: "対象客層の条件整理",            checked: false },
        { id: "c4", label: "効果測定KPIを設定",             checked: false },
        { id: "c5", label: "テスト配信",                   checked: false },
        { id: "c6", label: "本配信",                       checked: false },
      ],
      timeline: [
        { label: "施策設計",   date: "05/15〜05/25", done: true  },
        { label: "素材準備",   date: "05/26〜06/05", done: false },
        { label: "テスト配信", date: "06/10",       done: false },
        { label: "本配信",     date: "06/15",       done: false },
      ],
      delivery: {
        channels: ["Web/App", "サイネージ"],
        areas: ["仙石原", "強羅", "小田原"],
        times: ["週末 全日", "祝前日 16:00〜20:00"],
        facilities: ["ロマンスカー予約完了画面", "箱根登山バス車内"],
        conditions: ["王道集中度70以上", "ロマンスカー予約完了直後"],
        materials: {
          title: "混雑回避ならこちらもおすすめ",
          body:  "美術館・自然散策が楽しめる仙石原方面はゆったり過ごせます。",
          cta:   "仙石原コースを見る",
          qrLabel: "予約完了画面からアプリへ遷移",
          place: "予約完了ページ、車内サイネージ、Web/Appバナー",
        },
      },
      measurement: {
        period: "実施開始から14日（前後比較）",
        events: [
          { label: "訴求表示数",       current: 38, target: 60, unit: "指数",  change: "—", judge: "未実施" },
          { label: "代替先クリック率", current: 12, target: 18, unit: "%",    change: "—", judge: "未実施" },
          { label: "仙石原 来訪指数",  current: 36, target: 48, unit: "/100", change: "—", judge: "未実施" },
          { label: "客単価指数",       current: 64, target: 66, unit: "/100", change: "—", judge: "未実施" },
        ],
        nextDecision: "実施準備中",
      },
    },
    i05: {
      related: ["クーポン利用率", "強羅周辺施設利用・予約指数", "比較検証データ"],
      department: "箱根担当", owner: "中村 由衣",
      period: { start: "2026/04/01", end: "2026/04/30" },
      checklist: [
        { id: "c1", label: "比較する2案を確定",       checked: true  },
        { id: "c2", label: "対象施設の選定",          checked: true  },
        { id: "c3", label: "クーポン条件の設定",      checked: true  },
        { id: "c4", label: "効果測定KPIを設定",       checked: true  },
        { id: "c5", label: "テスト配信",             checked: false },
        { id: "c6", label: "結果レビュー",           checked: false },
      ],
      timeline: [
        { label: "案策定",     date: "04/01〜04/07", done: true  },
        { label: "条件設定",   date: "04/08〜04/14", done: true  },
        { label: "配信",       date: "04/15〜04/28", done: false },
        { label: "結果レビュー", date: "04/30",     done: false },
      ],
      delivery: {
        channels: ["QR", "Web/App"],
        areas: ["強羅"],
        times: ["平日 11:00〜17:00", "週末 10:00〜18:00"],
        facilities: ["強羅駅周辺 工芸体験施設", "提携飲食店"],
        conditions: ["強羅駅で改札を出場した来訪者"],
        materials: {
          title: "強羅で体験＆食事 1,000円OFFクーポン",
          body:  "工芸体験＋食事をセットで楽しめる強羅周辺の提携施設で使えます。",
          cta:   "クーポンを取得",
          qrLabel: "強羅駅サイネージから取得",
          place: "強羅駅構内QR、Web/App、提携施設掲示",
        },
      },
      measurement: {
        period: "実施開始から14日（A/B比較）",
        events: [
          { label: "クーポン取得数",     current: 52, target: 60, unit: "指数",  change: "+18", judge: "要確認" },
          { label: "クーポン利用率",     current: 14, target: 18, unit: "%",    change: "±0",   judge: "要確認" },
          { label: "予約クリック率",     current: 22, target: 25, unit: "%",    change: "+4pt", judge: "改善傾向" },
          { label: "強羅周辺施設利用・予約指数", current: 42, target: 45, unit: "/100", change: "+2", judge: "要確認" },
        ],
        nextDecision: "要確認",
      },
    },
    i06: {
      related: ["乗換滞留時間", "提携店利用率", "改札外街区流入率"],
      department: "沿線事業部", owner: "伊藤 大輔",
      period: { start: "2026/06/01", end: "2026/08/31" },
      checklist: [
        { id: "c1", label: "対象提携店リストの確認",  checked: true  },
        { id: "c2", label: "改札外サイネージ枠を確保", checked: false },
        { id: "c3", label: "街区マップ案内を作成",    checked: false },
        { id: "c4", label: "クーポン条件の設定",      checked: false },
        { id: "c5", label: "効果測定KPIを設定",       checked: false },
        { id: "c6", label: "配信開始",               checked: false },
      ],
      timeline: [
        { label: "施策設計",   date: "06/01〜06/10", done: true  },
        { label: "素材作成",   date: "06/11〜06/20", done: false },
        { label: "テスト配信", date: "06/25",       done: false },
        { label: "本配信",     date: "07/01",       done: false },
      ],
      delivery: {
        channels: ["サイネージ", "QR", "現地案内"],
        areas: ["小田原"],
        times: ["平日 16:00〜20:00", "週末 全日"],
        facilities: ["小田原駅改札外 提携店", "街区案内所"],
        conditions: ["乗換待ち15〜30分の来訪者", "改札出場5分以内"],
        materials: {
          title: "乗換時間で楽しむ 小田原 改札外案内",
          body:  "15〜30分で楽しめる近隣のおすすめスポット・グルメをご案内します。",
          cta:   "近隣マップを見る",
          qrLabel: "小田原駅改札外サイネージから遷移",
          place: "小田原駅 改札外サイネージ、QR、街区マップ",
        },
      },
      measurement: {
        period: "実施開始から14日（前後比較）",
        events: [
          { label: "案内表示数",     current: 0, target: 50, unit: "指数",  change: "—", judge: "未実施" },
          { label: "提携店利用率",   current: 28, target: 32, unit: "%",   change: "—", judge: "未実施" },
          { label: "街区流入率",     current: 36, target: 42, unit: "%",   change: "—", judge: "未実施" },
          { label: "滞留時間",       current: 18, target: 22, unit: "分",  change: "—", judge: "未実施" },
        ],
        nextDecision: "実施準備中",
      },
    },
    i07: {
      related: ["閲覧→来訪転換率", "外国語クーポン利用率", "Web言語比"],
      department: "インバウンド対応TF", owner: "Chen Lin",
      period: { start: "2026/02/01", end: "2026/07/31" },
      checklist: [
        { id: "c1", label: "英語/繁体字/タイ語コース整備", checked: true  },
        { id: "c2", label: "言語別表示ロジック",         checked: true  },
        { id: "c3", label: "言語別クーポン素材",         checked: true  },
        { id: "c4", label: "効果測定KPIを設定",          checked: true  },
        { id: "c5", label: "配信開始",                  checked: true  },
        { id: "c6", label: "中間レビュー",              checked: false },
      ],
      timeline: [
        { label: "コース整備",   date: "02/01〜02/28", done: true  },
        { label: "公開",         date: "03/15",       done: true  },
        { label: "中間レビュー", date: "05/15",       done: false },
        { label: "効果総括",     date: "07/31",       done: false },
      ],
      delivery: {
        channels: ["Web/App"],
        areas: ["沿線全域"],
        times: ["全日"],
        facilities: ["訪日向け施設全般"],
        conditions: ["Web/App言語設定が英/繁/タイ"],
        materials: {
          title: "Recommended courses for your stay",
          body:  "Top model courses curated for first-time visitors. Available in EN / 繁體 / ภาษาไทย.",
          cta:   "View course",
          qrLabel: "アプリ言語設定別に表示",
          place: "Web/Appホーム、検索結果、メール訴求",
        },
      },
      measurement: {
        period: "実施開始から30日（前後比較）",
        events: [
          { label: "言語別表示数",     current: 84, target: 80, unit: "指数",  change: "+12", judge: "改善傾向" },
          { label: "閲覧→来訪転換率", current: 26, target: 28, unit: "%",   change: "+8pt", judge: "改善傾向" },
          { label: "外国語クーポン利用率", current: 18, target: 22, unit: "%", change: "+4pt", judge: "要確認" },
          { label: "滞在時間",         current: 42, target: 45, unit: "分",  change: "+3",   judge: "改善傾向" },
        ],
        nextDecision: "改善傾向",
      },
    },
    i08: {
      related: ["連携店舗数", "提携店利用率", "湯本商店街滞在時間"],
      department: "沿線事業部", owner: "渡辺 真奈",
      period: { start: "2026/05/01", end: "2026/06/30" },
      checklist: [
        { id: "c1", label: "提携先候補20店をリスト化",   checked: true  },
        { id: "c2", label: "連携条件の擦り合わせ",        checked: false },
        { id: "c3", label: "案内素材ドラフト",            checked: false },
        { id: "c4", label: "効果測定KPIを設定",           checked: false },
        { id: "c5", label: "テスト配信",                 checked: false },
        { id: "c6", label: "本配信",                     checked: false },
      ],
      timeline: [
        { label: "店舗候補リスト", date: "05/01〜05/10", done: true  },
        { label: "条件擦り合わせ", date: "05/11〜05/25", done: false },
        { label: "素材作成",       date: "05/26〜06/05", done: false },
        { label: "本配信",         date: "06/15",       done: false },
      ],
      delivery: {
        channels: ["Web/App", "QR", "現地案内"],
        areas: ["箱根湯本商店街"],
        times: ["平日 11:00〜15:00", "週末 全日"],
        facilities: ["商店街 提携食事処"],
        conditions: ["商店街エリアへの来訪者"],
        materials: {
          title: "湯本商店街 ご当地グルメパス（検討中）",
          body:  "提携食事処で利用できる湯本ならではのグルメ案内（仕様調整中）。",
          cta:   "詳細を見る",
          qrLabel: "—",
          place: "—",
        },
      },
      measurement: {
        period: "実施前（基準値のみ）",
        events: [
          { label: "連携店舗数",       current: 8,  target: 20, unit: "店",   change: "—", judge: "未実施" },
          { label: "提携店利用率",     current: 14, target: 22, unit: "%",   change: "—", judge: "未実施" },
          { label: "商店街滞在時間",   current: 22, target: 34, unit: "分",  change: "—", judge: "未実施" },
        ],
        nextDecision: "検討中",
      },
    },
    i09: {
      related: ["免税利用件数", "免税平均単価", "ピーク時間帯売上指数"],
      department: "インバウンド対応TF", owner: "Park Min Ho",
      period: { start: "2026/01/10", end: "2026/03/31" },
      checklist: [
        { id: "c1", label: "対象店舗の選定",          checked: true },
        { id: "c2", label: "通知タイミング設計",      checked: true },
        { id: "c3", label: "サイネージ素材",          checked: true },
        { id: "c4", label: "効果測定KPIを設定",       checked: true },
        { id: "c5", label: "配信",                   checked: true },
        { id: "c6", label: "結果レビュー",           checked: true },
      ],
      timeline: [
        { label: "施策設計",   date: "01/10〜01/20", done: true },
        { label: "配信開始",   date: "02/01",       done: true },
        { label: "中間レビュー", date: "03/01",     done: true },
        { label: "効果総括",   date: "03/31",       done: true },
      ],
      delivery: {
        channels: ["Web/App", "サイネージ"],
        areas: ["箱根全域"],
        times: ["12:00〜14:00", "16:00〜18:00"],
        facilities: ["免税対応店舗 20店"],
        conditions: ["インバウンド来訪者", "免税対象購入額に近づいた状態"],
        materials: {
          title: "Tax-free shops near you",
          body:  "Find tax-free shops nearby with current peak times.",
          cta:   "View map",
          qrLabel: "アプリ通知 + 駅サイネージ",
          place: "アプリプッシュ、駅サイネージ、店頭",
        },
      },
      measurement: {
        period: "実施開始から60日（実績）",
        events: [
          { label: "案内表示数",       current: 92, target: 80, unit: "指数",  change: "+24", judge: "改善傾向" },
          { label: "免税利用件数",     current: 78, target: 70, unit: "指数",  change: "+14", judge: "改善傾向" },
          { label: "免税平均単価",     current: 62, target: 60, unit: "/100", change: "+6",   judge: "改善傾向" },
          { label: "ピーク時間売上",   current: 71, target: 68, unit: "/100", change: "+9",   judge: "改善傾向" },
        ],
        nextDecision: "継続",
      },
    },
    i10: {
      related: ["高付加価値需要", "予約後閲覧率", "宿泊需要"],
      department: "沿線事業部", owner: "佐藤 真理",
      period: { start: "2026/05/01", end: "2026/08/31" },
      checklist: [
        { id: "c1", label: "予約後メール文面・件名の確定", checked: true },
        { id: "c2", label: "熱海モデルコースLPの構成", checked: true },
        { id: "c3", label: "駅サイネージ枠の予約", checked: false },
        { id: "c4", label: "効果測定KPIの確定", checked: false },
        { id: "c5", label: "テスト配信", checked: false },
        { id: "c6", label: "本番配信", checked: false },
      ],
      timeline: [
        { label: "設計", date: "05/01〜05/12", done: true },
        { label: "素材作成", date: "05/13〜05/24", done: true },
        { label: "配信開始", date: "05/28", done: false },
        { label: "中間レビュー", date: "06/15", done: false },
      ],
      delivery: {
        channels: ["Web/App", "予約後メール", "駅サイネージ"],
        areas: ["熱海"],
        times: ["予約完了後24時間以内", "旅前72時間以内"],
        facilities: ["温泉旅館", "飲食", "体験"],
        conditions: ["温泉・飲食カテゴリの閲覧が高い来訪者"],
        materials: {
          title: "熱海の温泉と食を、旅前にまとめてチェック",
          body: "宿泊・食体験の候補と所要時間の目安を提示。接続観光地への周遊は任意です。",
          cta: "モデルコースを見る",
          qrLabel: "駅サイネージQRから同一コンテンツへ",
          place: "予約完了メール、Web/Appホーム、熱海方面案内サイネージ",
        },
      },
      measurement: {
        period: "配信開始から14日",
        events: [
          { label: "予約後ページ閲覧率", current: 24, target: 28, unit: "%", change: "+3pt", judge: "改善傾向" },
          { label: "宿泊送客率", current: 11, target: 14, unit: "%", change: "+1pt", judge: "要確認" },
          { label: "飲食送客率", current: 9, target: 12, unit: "%", change: "+1pt", judge: "要確認" },
        ],
        nextDecision: "継続検討",
      },
    },
    i11: {
      related: ["回遊指数", "消費指数", "半日導線完了率"],
      department: "伊豆エリア担当", owner: "木村 亮",
      period: { start: "2026/05/15", end: "2026/09/30" },
      checklist: [
        { id: "c1", label: "対象施設リスト確定", checked: true },
        { id: "c2", label: "半日マップ原稿", checked: false },
        { id: "c3", label: "QR設置場所調整", checked: false },
        { id: "c4", label: "観光案内所連携", checked: false },
        { id: "c5", label: "効果測定KPI設定", checked: false },
        { id: "c6", label: "本配信", checked: false },
      ],
      timeline: [
        { label: "設計", date: "05/15〜05/28", done: true },
        { label: "素材", date: "06/01〜06/14", done: false },
        { label: "テスト", date: "06/20", done: false },
        { label: "本配信", date: "07/01", done: false },
      ],
      delivery: {
        channels: ["Web/App", "QR", "観光案内"],
        areas: ["伊東"],
        times: ["週末 9:00〜15:00", "祝前日"],
        facilities: ["海鮮市場", "温泉", "文化施設"],
        conditions: ["伊東エリアの閲覧・検索が高い来訪者"],
        materials: {
          title: "伊東・半日で楽しむ 海と温泉と文化",
          body: "三島・小田原からの接続例を併記し、周遊候補として選択しやすくします。",
          cta: "マップを保存",
          qrLabel: "伊東駅・観光案内所QR",
          place: "Web/App、駅周辺QR、観光案内所",
        },
      },
      measurement: {
        period: "配信開始から21日",
        events: [
          { label: "施設利用率", current: 0, target: 38, unit: "%", change: "—", judge: "未実施" },
          { label: "回遊指数", current: 48, target: 55, unit: "/100", change: "—", judge: "未実施" },
        ],
        nextDecision: "実施準備中",
      },
    },
    i12: {
      related: ["滞在時間", "体験予約率", "宿泊送客率"],
      department: "観光戦略部", owner: "井上 誠",
      period: { start: "2026/06/01", end: "2026/10/31" },
      checklist: [
        { id: "c1", label: "LP構成ドラフト", checked: false },
        { id: "c2", label: "宿泊協会への素材共有", checked: false },
        { id: "c3", label: "英語・繁体字表記レビュー", checked: false },
        { id: "c4", label: "KPI設定", checked: false },
        { id: "c5", label: "テスト配信", checked: false },
        { id: "c6", label: "本配信", checked: false },
      ],
      timeline: [
        { label: "設計", date: "06/01〜06/14", done: false },
        { label: "素材", date: "06/15〜07/05", done: false },
        { label: "配信", date: "07/12", done: false },
        { label: "レビュー", date: "08/01", done: false },
      ],
      delivery: {
        channels: ["予約後メール", "海外向けLP", "宿泊施設連携"],
        areas: ["修善寺"],
        times: ["旅前14日以内", "平日午前"],
        facilities: ["温泉旅館", "文化施設", "竹林周辺"],
        conditions: ["静穏・文化カテゴリの閲覧が高い来訪者"],
        materials: {
          title: "修善寺で過ごす、静かな温泉と文化の半日以上",
          body: "滞在型の体験プランを提示し、混雑ピークとは異なる価値を訴求します。",
          cta: "プランを見る",
          qrLabel: "宿泊施設パンフレットQR",
          place: "海外LP、宿泊施設、予約後メール",
        },
      },
      measurement: {
        period: "配信開始から30日",
        events: [
          { label: "海外LP滞在時間", current: 0, target: 95, unit: "秒", change: "—", judge: "未実施" },
          { label: "体験予約率", current: 0, target: 8, unit: "%", change: "—", judge: "未実施" },
        ],
        nextDecision: "実施準備中",
      },
    },
    i13: {
      related: ["宿泊導線CTR", "体験予約率", "自然・アート関心"],
      department: "マーケティング部", owner: "高橋 沙織",
      period: { start: "2026/05/20", end: "2026/09/15" },
      checklist: [
        { id: "c1", label: "コース原稿レビュー", checked: true },
        { id: "c2", label: "SNSクリエイティブ2案", checked: false },
        { id: "c3", label: "宿泊施設バナー枠確保", checked: false },
        { id: "c4", label: "KPI設定", checked: false },
        { id: "c5", label: "配信", checked: false },
        { id: "c6", label: "レビュー", checked: false },
      ],
      timeline: [
        { label: "設計", date: "05/20〜06/05", done: true },
        { label: "素材", date: "06/06〜06/20", done: false },
        { label: "配信", date: "06/25", done: false },
        { label: "レビュー", date: "07/20", done: false },
      ],
      delivery: {
        channels: ["Web/App", "SNS広告", "宿泊連携"],
        areas: ["伊豆高原"],
        times: ["週末旅前", "連休前2週間"],
        facilities: ["美術館", "散策路", "宿泊施設"],
        conditions: ["自然・アートの複合閲覧が高い来訪者"],
        materials: {
          title: "伊豆高原：自然とアートと宿泊をつなぐ1日",
          body: "公共交通と車利用の両パターンを併記し、周遊候補として計画しやすくします。",
          cta: "滞在プランを見る",
          qrLabel: "Web/App内バナー",
          place: "Web/App、SNS、宿泊施設デジタルサイネージ",
        },
      },
      measurement: {
        period: "配信開始から14日",
        events: [
          { label: "宿泊導線クリック率", current: 6, target: 9, unit: "%", change: "+0.4pt", judge: "要確認" },
          { label: "体験予約率", current: 4, target: 7, unit: "%", change: "±0", judge: "要確認" },
        ],
        nextDecision: "要確認",
      },
    },
    i14: {
      related: ["滞在日数", "周遊導線利用率", "検索関心"],
      department: "インバウンド対応TF", owner: "王 偉",
      period: { start: "2026/06/10", end: "2026/11/30" },
      checklist: [
        { id: "c1", label: "長期滞在記事構成", checked: false },
        { id: "c2", label: "旅前メールセグメント条件", checked: false },
        { id: "c3", label: "英語・繁体字校正", checked: false },
        { id: "c4", label: "KPI設定", checked: false },
        { id: "c5", label: "配信", checked: false },
        { id: "c6", label: "レビュー", checked: false },
      ],
      timeline: [
        { label: "設計", date: "06/10〜06/25", done: false },
        { label: "素材", date: "07/01〜07/20", done: false },
        { label: "配信", date: "08/01", done: false },
        { label: "レビュー", date: "09/15", done: false },
      ],
      delivery: {
        channels: ["旅前メール", "Web/App", "海外向け記事"],
        areas: ["下田"],
        times: ["予約完了後7日", "旅前30日"],
        facilities: ["海浜", "歴史施設", "宿泊"],
        conditions: ["長期滞在・歴史テーマの閲覧が高い来訪者"],
        materials: {
          title: "下田：海と歴史でゆったり3泊以上",
          body: "小田原・熱海からの接続周遊候補を併記し、計画の幅を提示します。",
          cta: "記事を読む",
          qrLabel: "旅前メール内リンク",
          place: "旅前メール、Web/App特集、海外向けコラム",
        },
      },
      measurement: {
        period: "配信開始から30日",
        events: [
          { label: "滞在日数（指数）", current: 0, target: 52, unit: "/100", change: "—", judge: "未実施" },
          { label: "周遊導線利用率", current: 0, target: 18, unit: "%", change: "—", judge: "未実施" },
        ],
        nextDecision: "実施準備中",
      },
    },
    i15: {
      related: ["周遊候補CTR", "湘南→伊豆遷移率", "旅前メールCTR"],
      department: "沿線事業部", owner: "山田 健太",
      period: { start: "2026/04/20", end: "2026/08/31" },
      checklist: [
        { id: "c1", label: "チェックリスト原稿", checked: true },
        { id: "c2", label: "所要時間データ整備", checked: true },
        { id: "c3", label: "旅前メール組み込み", checked: true },
        { id: "c4", label: "駅サイネージ試験掲出", checked: false },
        { id: "c5", label: "KPIレビュー", checked: false },
        { id: "c6", label: "定常化判断", checked: false },
      ],
      timeline: [
        { label: "設計", date: "04/20〜05/05", done: true },
        { label: "配信", date: "05/10", done: true },
        { label: "拡張", date: "06/01", done: false },
        { label: "レビュー", date: "07/15", done: false },
      ],
      delivery: {
        channels: ["Web/App", "駅サイネージ", "旅前メール"],
        areas: ["江ノ島・湘南", "小田原"],
        times: ["週末旅前", "大型連休前"],
        facilities: ["海沿いレジャー", "小田原乗換案内"],
        conditions: ["湘南エリア閲覧後に伊豆・箱根閲覧がある来訪者"],
        materials: {
          title: "湘南に立ち寄るなら：箱根・伊豆との周遊チェックリスト",
          body: "小田原経由の接続例と所要時間目安を提示します（全区間が小田急のみとは限りません）。",
          cta: "チェックリストを保存",
          qrLabel: "新宿・藤沢方面案内サイネージ",
          place: "旅前メール、Web/App特集、駅サイネージ",
        },
      },
      measurement: {
        period: "実施開始から28日",
        events: [
          { label: "旅前メールCTR", current: 14, target: 16, unit: "%", change: "+1.2pt", judge: "改善傾向" },
          { label: "周遊マップ保存率", current: 21, target: 24, unit: "%", change: "+2pt", judge: "改善傾向" },
        ],
        nextDecision: "改善傾向",
      },
    },
  };

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

  function fmtNum(n) {
    return String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /** エリアフィルタ用。数値はすべてデモ想定。 */
  const REFERRAL_FILTER_VARIANTS = {
    all:       { score: 81, scoreDelta: "+5pt", estWeeklyPeople: 42800, reachImpWeekly: 312000, lossTier: "中高", lossRefLow: 900, lossRefHigh: 1300, lossMoM: "やや拡大", rec: 8, run: 4 },
    enoshima:  { score: 69, scoreDelta: "+3pt", estWeeklyPeople: 28300, reachImpWeekly: 198000, lossTier: "中",   lossRefLow: 620, lossRefHigh: 890, lossMoM: "横ばい", rec: 5, run: 2 },
    hakone:    { score: 78, scoreDelta: "+4pt", estWeeklyPeople: 36400, reachImpWeekly: 276000, lossTier: "高",   lossRefLow: 840, lossRefHigh: 1240, lossMoM: "やや拡大", rec: 6, run: 3 },
    odawara:   { score: 72, scoreDelta: "+2pt", estWeeklyPeople: 31200, reachImpWeekly: 241000, lossTier: "中",   lossRefLow: 580, lossRefHigh: 820, lossMoM: "横ばい", rec: 5, run: 2 },
    atami:     { score: 84, scoreDelta: "+6pt", estWeeklyPeople: 39600, reachImpWeekly: 289000, lossTier: "中高", lossRefLow: 760, lossRefHigh: 1120, lossMoM: "やや拡大", rec: 7, run: 3 },
    ito:       { score: 76, scoreDelta: "+4pt", estWeeklyPeople: 31800, reachImpWeekly: 224000, lossTier: "中",   lossRefLow: 540, lossRefHigh: 780, lossMoM: "横ばい", rec: 6, run: 2 },
    shuzenji:  { score: 68, scoreDelta: "+1pt", estWeeklyPeople: 21400, reachImpWeekly: 168000, lossTier: "低",   lossRefLow: 380, lossRefHigh: 520, lossMoM: "横ばい", rec: 4, run: 1 },
    izukogen:  { score: 71, scoreDelta: "+2pt", estWeeklyPeople: 24600, reachImpWeekly: 186000, lossTier: "中",   lossRefLow: 460, lossRefHigh: 640, lossMoM: "横ばい", rec: 5, run: 2 },
    shimoda:   { score: 62, scoreDelta: "±0pt", estWeeklyPeople: 18200, reachImpWeekly: 134000, lossTier: "低",   lossRefLow: 310, lossRefHigh: 440, lossMoM: "横ばい", rec: 4, run: 1 },
    "izu-all": { score: 80, scoreDelta: "+5pt", estWeeklyPeople: 40100, reachImpWeekly: 298000, lossTier: "中高", lossRefLow: 880, lossRefHigh: 1280, lossMoM: "やや拡大", rec: 9, run: 4 },
  };

  function buildReferralKpis(v) {
    return [
      {
        label: "送客機会スコア",
        icon: "i-map", iconColor: "t-navy",
        primaryBadge: "推定",
        primaryMain: fmtNum(v.estWeeklyPeople),
        primaryUnit: "人 / 週",
        secondaryAbsolute: "表示・配信の推定インプレ " + fmtNum(v.reachImpWeekly) + " 回/週（重複あり）",
        indexLine: "指数 " + v.score + "　前週比 " + v.scoreDelta,
        caption: "接続観光地へ周遊・送客余地があると推定される来訪者規模。乗降・予約・閲覧等から推計したデモ値です。",
      },
      {
        label: "消費機会ロス",
        icon: "i-yen", iconColor: "t-red",
        primaryBadge: "推定",
        primaryMain: v.lossTier,
        primaryUnit: "",
        referenceLine: "参考: " + fmtNum(v.lossRefLow) + "万〜" + fmtNum(v.lossRefHigh) + "万円 / 週（推定レンジ）",
        indexLine: "前月比 " + v.lossMoM,
        caption: "来訪に対して施設利用・予約への転換が弱いと推定される余地。金額は換算した参考値であり、断定ではありません。",
      },
      {
        label: "推奨施策",
        icon: "i-ticket", iconColor: "t-gold",
        primaryMain: String(v.rec),
        primaryUnit: "件",
        secondaryAbsolute: "実測: 候補リストの登録件数（運用ツール）",
        indexLine: "前週比 +2件",
        caption: "優先的に検討する案内・クーポン施策の候補数。",
      },
      {
        label: "実施中施策",
        icon: "i-target", iconColor: "t-green",
        primaryMain: String(v.run),
        primaryUnit: "件",
        secondaryAbsolute: "実測: 稼働フラグのある施策ID数",
        indexLine: "前週比 +1件",
        caption: "現在配信・運用中の施策数。",
      },
    ];
  }

  let REFERRAL_KPIS = buildReferralKpis(REFERRAL_FILTER_VARIANTS.all);

  const REFERRAL_AREAS = [
    {
      area: "熱海",
      estVisit: "推定 9.4万人/週", relActs: "関連閲覧・予約 1,240件/週", priScale: "対象規模 推定 3.6万人/週",
      state: "来訪多・滞在価値伸長余地", stateCls: "tone-warn",
      decide: "温泉宿泊・食体験の旅前案内を強化",
      priority: "最優先", priorityCls: "high",
      effect: "予約後閲覧率・宿泊/飲食送客率の改善",
    },
    {
      area: "箱根湯本",
      estVisit: "推定 18.6万人/週", relActs: "関連閲覧・予約 1,180件/週", priScale: "対象規模 推定 12万人/週",
      state: "来訪多・消費転換弱", stateCls: "tone-warn",
      decide: "荷物・短時間消費と広域周遊案内の両立",
      priority: "高", priorityCls: "high",
      effect: "乗換前摩擦の低減と周遊候補の提示",
    },
    {
      area: "伊東",
      estVisit: "推定 4.9万人/週", relActs: "関連閲覧・予約 980件/週", priScale: "対象規模 推定 2.8万人/週",
      state: "滞在価値高・送客余地", stateCls: "tone-good",
      decide: "海鮮・温泉・文化の半日導線を設計",
      priority: "高", priorityCls: "high",
      effect: "施設利用率・回遊指数の向上",
    },
    {
      area: "江ノ島・湘南",
      estVisit: "推定 12.8万人/週", relActs: "関連閲覧・予約 860件/週", priScale: "対象規模 推定 5.1万人/週",
      state: "立ち寄り需要・周遊接続", stateCls: "tone-attention",
      decide: "旅前の立ち寄りと伊豆・箱根周遊の訴求",
      priority: "中", priorityCls: "medium",
      effect: "広域送客・連携導線の補強",
    },
    {
      area: "修善寺",
      estVisit: "推定 2.6万人/週", relActs: "関連閲覧・予約 620件/週", priScale: "対象規模 推定 1.1万人/週",
      state: "静穏・文化関心が強い", stateCls: "tone-info",
      decide: "静かな温泉滞在・文化体験コンテンツ",
      priority: "中", priorityCls: "medium",
      effect: "滞在時間・体験予約率の向上",
    },
    {
      area: "小田原",
      estVisit: "推定 11.4万人/週", relActs: "関連閲覧・予約 780件/週", priScale: "対象規模 推定 6.8万人/週",
      state: "接続拠点・街区消費", stateCls: "tone-neutral",
      decide: "短時間消費と熱海・伊豆方面の案内",
      priority: "中", priorityCls: "medium",
      effect: "乗換客の街区流入と周遊候補の提示",
    },
  ];

  // Offers — incl. drawer-only fields (content, observe, next)
  const REFERRAL_OFFERS = [
    {
      id: "of01",
      title: "熱海 温泉宿泊・食体験の事前案内",
      area: "熱海",
      channels: ["Web/App", "予約後メール", "駅サイネージ"],
      reason: "ロマンスカー予約後の閲覧で、温泉・食体験ページへの関心が高い状態が続いているため。",
      kpis: ["予約後ページ閲覧率", "宿泊/飲食送客率"],
      priority: "最優先", priorityCls: "high",
      content: "予約完了から72時間以内に、熱海の温泉宿・飲食のモデルコースと予約導線を提示。接続観光地である旨を注記。",
      observe: ["予約後メール開封率", "温泉LP遷移率", "宿泊検索連動率"],
      next: "開封率が基準未達の場合は件名・送信タイミングを2案で比較。",
    },
    {
      id: "of02",
      title: "伊東 海鮮・温泉・文化施設の半日導線",
      area: "伊東",
      channels: ["Web/App", "QR", "観光案内"],
      reason: "日帰り〜短期滞在層に対し、半日で回れる高単価体験の導線が不足している傾向のため。",
      kpis: ["施設利用率", "回遊指数", "消費指数"],
      priority: "高", priorityCls: "high",
      content: "海鮮市場・温泉・文化施設をつなぐ半日モデルコースをマップ化。三島・小田原からの接続注記を付与。",
      observe: ["モデルコース完了率", "施設QR遷移率", "回遊指数"],
      next: "平日・週末で導線の人気施設を入れ替え、クリック分布を確認。",
    },
    {
      id: "of03",
      title: "修善寺 静かな温泉滞在・文化体験",
      area: "修善寺",
      channels: ["予約後メール", "海外向けLP", "宿泊施設連携"],
      reason: "混雑回避志向・文化体験志向に合う高付加価値需要の兆しが相対的に高いため。",
      kpis: ["滞在時間", "体験予約率", "宿泊送客率"],
      priority: "高", priorityCls: "high",
      content: "静穏型温泉と文化施設を組み合わせた滞在プランを多言語LPと宿泊施設パンフレットで案内。",
      observe: ["海外LP滞在時間", "体験予約クリック率", "宿泊連携CV"],
      next: "OTA向け短尺素材の追加可否を宿泊協会と協議。",
    },
    {
      id: "of04",
      title: "伊豆高原 自然・アート滞在導線",
      area: "伊豆高原",
      channels: ["Web/App", "SNS広告", "宿泊連携"],
      reason: "自然・アート・宿泊を組み合わせた関心が上位客層向け施策候補として検出されているため。",
      kpis: ["宿泊導線クリック率", "体験予約率"],
      priority: "中", priorityCls: "medium",
      content: "美術館・散策路・宿を1日単位でつなぐ周遊候補を提示。車利用・公共交通の両パターンを併記。",
      observe: ["滞在プラン保存率", "アート施設利用率"],
      next: "伊東からの半日接続と2泊目以降案内のAB表示を検討。",
    },
    {
      id: "of05",
      title: "下田 海・歴史・長期滞在提案",
      area: "下田",
      channels: ["旅前メール", "Web/App", "海外向け記事"],
      reason: "遠方エリアのため単発誘導より長期滞在テーマとの相性が高い傾向のため。",
      kpis: ["滞在日数", "周遊導線利用率"],
      priority: "中", priorityCls: "medium",
      content: "海・歴史を軸に3泊以上のモデルと、小田原・熱海からの接続周遊候補をセットで提示。",
      observe: ["長期滞在プラン閲覧率", "周遊マップ利用率"],
      next: "台湾・韓国向け記事の検索クエリに合わせ見出しを最適化。",
    },
    {
      id: "of06",
      title: "江ノ島・湘南 旅前の立ち寄り導線",
      area: "江ノ島・湘南",
      channels: ["Web/App", "駅サイネージ", "旅前メール"],
      reason: "湘南の立ち寄り需要と、箱根・伊豆広域周遊を組み合わせる余地があるため。",
      kpis: ["周遊候補クリック率", "湘南→伊豆方面遷移率"],
      priority: "中", priorityCls: "medium",
      content: "小田原経由で湘南→箱根／伊豆をつなぐ旅前チェックリストと所要時間目安を提示。",
      observe: ["旅前メールCTR", "周遊マップ保存率"],
      next: "週末ピーク時は混雑時間帯に合わせ訴求順を自動入れ替え。",
    },
  ];

  // x = 来訪指数 (visit), y = 消費・滞在価値指数 (spend), 0–100
  const REFERRAL_MATRIX = [
    { name: "箱根湯本", visit: 88, spend: 38, tag: "最優先改善",   tagCls: "tone-warn"      },
    { name: "熱海",     visit: 82, spend: 52, tag: "単価伸長余地", tagCls: "tone-attention" },
    { name: "大涌谷",   visit: 72, spend: 58, tag: "維持・単価向上", tagCls: "tone-good"      },
    { name: "伊東",     visit: 52, spend: 76, tag: "誘導強化",     tagCls: "tone-info"      },
    { name: "修善寺",   visit: 36, spend: 80, tag: "誘導強化",     tagCls: "tone-info"      },
    { name: "下田",     visit: 28, spend: 72, tag: "誘導強化",     tagCls: "tone-info"      },
    { name: "江ノ島",   visit: 68, spend: 50, tag: "接続強化",     tagCls: "tone-attention" },
    { name: "小田原",   visit: 58, spend: 44, tag: "改善余地",     tagCls: "tone-neutral"   },
  ];

  const REFERRAL_FUNNEL = [
    { label: "表示",    value: 100, hint: "案内・クーポンの表示数" },
    { label: "クリック", value: 42,  hint: "詳細閲覧・遷移の発生" },
    { label: "保存",    value: 26,  hint: "クーポン取得・保存" },
    { label: "利用",    value: 14,  hint: "店舗・施設での利用" },
    { label: "回遊変化", value: 9,   hint: "対象エリアへの来訪変化" },
  ];

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

    if (k.primaryMain != null) {
      const block = el("div", { class: "kpi-primary-block" });
      if (k.primaryBadge) {
        block.appendChild(el("span", { class: "kpi-val-badge" }, k.primaryBadge));
      }
      const row = el("div", { class: "kpi-primary-row" });
      row.appendChild(el("div", { class: "kpi-primary-main" }, String(k.primaryMain)));
      if (k.primaryUnit) row.appendChild(el("div", { class: "kpi-primary-unit" }, k.primaryUnit));
      block.appendChild(row);
      if (k.secondaryAbsolute) {
        block.appendChild(el("div", { class: "kpi-secondary-abs" }, k.secondaryAbsolute));
      }
      if (k.referenceLine) {
        block.appendChild(el("div", { class: "kpi-reference-line" }, k.referenceLine));
      }
      card.appendChild(block);
      if (k.indexLine) {
        card.appendChild(el("div", { class: "kpi-index-line" }, k.indexLine));
      }
      if (k.caption) {
        card.appendChild(el("div", { class: "kpi-caption" }, k.caption));
      }
      if (k.spark && k.showSpark !== false) card.appendChild(sparkline(k.spark, sparkColor));
    } else {
      const valRow = el("div", { class: "kpi-value-row" }, [
        el("div", { class: "kpi-value" }, String(k.value)),
        k.denom ? el("div", { class: "kpi-value-unit" }, k.denom) : null,
        k.delta ? deltaBadge(k.delta) : null,
      ]);
      card.appendChild(valRow);
      if (k.spark) card.appendChild(sparkline(k.spark, sparkColor));
      if (k.decision) card.appendChild(el("div", { class: "kpi-decision", html: k.decision }));
    }
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
        a.scale ? el("div", { class: "pri-area-scale" }, a.scale) : null,
      ]));
      const score = el("div", { class: "pri-score" }, [
        el("div", { class: "pri-score-label" }, "優先度指数"),
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

  function renderMarketSignalsDash() {
    const ul = el("ul", { class: "market-signals-list" });
    MARKET_TRENDS_DASH.forEach((s) => {
      const li = el("li", { class: "market-signal-item" });
      li.appendChild(el("span", { class: "market-signal-label" }, s.label));
      li.appendChild(el("span", { class: "market-signal-text" }, s.text));
      ul.appendChild(li);
    });
    mount("market-signals-dash", ul);
  }

  function renderSegmentInsight() {
    const kwrap = el("div", { class: "kpi-grid kpi-grid-4" });
    SEGMENT_INSIGHT_KPIS.forEach((k) => kwrap.appendChild(renderKpiCard(k)));
    mount("segment-insight-kpis", Array.from(kwrap.children));

    const focus = el("div", { class: "priority-list" });
    SEGMENT_FOCUS_AREAS.forEach((a, i) => {
      const row = el("div", { class: "priority-row" });
      row.appendChild(el("div", { class: "pri-rank" }, "#" + (i + 1)));
      row.appendChild(el("div", { class: "pri-area" }, [
        el("div", { class: "pri-area-name" }, a.name),
        el("div", { class: "pri-area-judge" }, a.note),
        a.abs ? el("div", { class: "pri-area-scale" }, a.abs) : null,
      ]));
      row.appendChild(el("div", { class: "pri-score" }, [
        el("div", { class: "pri-score-label" }, "需要の兆し（指数）"),
        el("div", { class: "pri-score-bar b-red" }, el("span", { style: "width:" + a.score + "%" })),
      ]));
      row.appendChild(el("div", { class: "pri-score-val" }, a.score + " / 100"));
      row.appendChild(el("span", { class: "pri-badge medium" }, "注目"));
      focus.appendChild(row);
    });
    mount("segment-focus-areas", focus);

    const sms = el("ul", { class: "market-signals-list" });
    SEGMENT_MARKET_TRENDS.forEach((s) => {
      const li = el("li", { class: "market-signal-item" });
      li.appendChild(el("span", { class: "market-signal-label" }, s.label));
      li.appendChild(el("span", { class: "market-signal-text" }, s.text));
      sms.appendChild(li);
    });
    mount("segment-market-signals", sms);

    const thWrap = el("div", { class: "judgment-list" });
    SEGMENT_THEMES.forEach((t) => {
      const item = el("div", { class: "judgment-item j-gold" });
      item.appendChild(el("div", { class: "j-area" }, t.name));
      item.appendChild(el("div", { class: "j-state" }, "関心指数（集計） " + t.weight + " / 100"));
      thWrap.appendChild(item);
    });
    mount("segment-themes", thWrap);

    const tp = el("div", { class: "offer-chips" });
    SEGMENT_TOUCHPOINTS.forEach((t) => tp.appendChild(el("span", { class: "offer-chip" }, t)));
    mount("segment-touchpoints", tp);

    const contentList = el("ol", { class: "segment-content-list" });
    SEGMENT_CONTENT_IDEAS.forEach((c) => contentList.appendChild(el("li", null, c)));
    mount("segment-content", contentList);
  }

  // ========================================================
  // AREA MAP
  // ========================================================
  var _mapActiveLayer = "visit";
  var _mapSelectedNode = null;

  function renderAreaMap() {
    var host = document.getElementById("area-map-wrap");
    if (!host) return;
    host.innerHTML = "";

    // ── outer layout: [svg-wrap] [detail-panel] ──────────────────────────
    var layout = el("div", { class: "amap-layout" });

    // ── SVG ──────────────────────────────────────────────────────────────
    var svgWrap = el("div", { class: "amap-svg-wrap" });
    // viewBox: 節点座標を MAP_NODES に直書き（800×390 基準）
    var VW = 800, VH = 390;
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + VW + " " + VH);
    svg.setAttribute("class", "amap-svg");
    svg.setAttribute("aria-hidden", "true");

    // ─ defs ─
    var defs = document.createElementNS(ns, "defs");
    // drop-shadow filter for nodes
    var filt = document.createElementNS(ns, "filter");
    filt.setAttribute("id", "node-shadow"); filt.setAttribute("x", "-30%"); filt.setAttribute("y", "-30%"); filt.setAttribute("width", "160%"); filt.setAttribute("height", "160%");
    var fe = document.createElementNS(ns, "feDropShadow");
    fe.setAttribute("dx","0"); fe.setAttribute("dy","1"); fe.setAttribute("stdDeviation","2.5"); fe.setAttribute("flood-color","rgba(11,28,46,0.13)");
    filt.appendChild(fe); defs.appendChild(filt);
    // markers
    ["main","branch","connect"].forEach(function(t) {
      var mk = document.createElementNS(ns, "marker");
      mk.setAttribute("id", "arr-" + t);
      mk.setAttribute("markerWidth","5"); mk.setAttribute("markerHeight","5");
      mk.setAttribute("refX","4.5"); mk.setAttribute("refY","2.5");
      mk.setAttribute("orient","auto");
      var poly = document.createElementNS(ns, "polygon");
      poly.setAttribute("points","0 0,5 2.5,0 5");
      poly.setAttribute("fill", t==="main" ? "#8aadd4" : "#c8d4e0");
      mk.appendChild(poly); defs.appendChild(mk);
    });
    svg.appendChild(defs);

    // ─ ルートラベル（帯） ─
    function svgText(x, y, txt, cls) {
      var t = document.createElementNS(ns, "text");
      t.setAttribute("x", x); t.setAttribute("y", y);
      t.setAttribute("class", cls || "amap-route-label");
      t.setAttribute("text-anchor", "middle");
      t.textContent = txt;
      return t;
    }
    svg.appendChild(svgText(400, 18, "── 小田急本線 ──", "amap-route-label"));
    svg.appendChild(svgText(120, 178, "湘南方面", "amap-route-label-sub"));
    svg.appendChild(svgText(530, 178, "箱根登山線", "amap-route-label-sub"));
    svg.appendChild(svgText(500, 230, "─ 東海道線接続 伊豆方面 ─", "amap-route-label"));

    // ─ エッジ ─
    MAP_EDGES.forEach(function(e) {
      var from = MAP_NODES.find(function(n){ return n.id === e.from; });
      var to   = MAP_NODES.find(function(n){ return n.id === e.to; });
      if (!from || !to) return;
      var x1 = from.x, y1 = from.y, x2 = to.x, y2 = to.y;
      var line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x1); line.setAttribute("y1", y1);
      line.setAttribute("x2", x2); line.setAttribute("y2", y2);
      line.setAttribute("class", "amap-edge amap-edge-" + e.type);
      line.setAttribute("marker-end", "url(#arr-" + e.type + ")");
      svg.appendChild(line);
      // animated flow
      if (e.type === "main" || e.type === "connect") {
        var fd = document.createElementNS(ns, "line");
        fd.setAttribute("x1", x1); fd.setAttribute("y1", y1);
        fd.setAttribute("x2", x2); fd.setAttribute("y2", y2);
        fd.setAttribute("class", "amap-flow-dash amap-flow-" + e.type);
        svg.appendChild(fd);
      }
    });

    // ─ ノード + ラベル + 数値 ─
    MAP_NODES.forEach(function(n) {
      var cx = n.x, cy = n.y;
      var r = nodeRadius(n);

      // pulse ring
      if (n.congestion === "critical" || n.congestion === "high") {
        var pulse = document.createElementNS(ns, "circle");
        pulse.setAttribute("cx", cx); pulse.setAttribute("cy", cy);
        pulse.setAttribute("r", r + 6);
        pulse.setAttribute("class", "amap-pulse amap-pulse-" + n.congestion);
        svg.appendChild(pulse);
      }

      // node circle
      var circle = document.createElementNS(ns, "circle");
      circle.setAttribute("cx", cx); circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("class", "amap-node amap-node-" + n.congestion);
      circle.setAttribute("data-id", n.id);
      circle.setAttribute("filter", "url(#node-shadow)");
      svg.appendChild(circle);

      // エリア名
      var nameText = n.nameShort || n.name.split("\n")[0];
      var labelY = n.labelBelow === false ? cy - r - 12 : cy + r + 13;
      var tName = document.createElementNS(ns, "text");
      tName.setAttribute("x", cx); tName.setAttribute("y", labelY);
      tName.setAttribute("class", "amap-label" + (n.congestion === "critical" ? " amap-label-critical" : ""));
      tName.setAttribute("text-anchor", "middle");
      tName.textContent = nameText;
      svg.appendChild(tName);

      // 数値サブテキスト（主要ノードのみ）
      if (n.showStats) {
        var statY = labelY + 13;
        var tStat = document.createElementNS(ns, "text");
        tStat.setAttribute("x", cx); tStat.setAttribute("y", statY);
        tStat.setAttribute("class", "amap-stat");
        tStat.setAttribute("text-anchor", "middle");
        tStat.textContent = "推定 " + formatVisitors(n.weeklyVisitors) + "/週";
        svg.appendChild(tStat);
        if (n.statNote) {
          var tNote = document.createElementNS(ns, "text");
          tNote.setAttribute("x", cx); tNote.setAttribute("y", statY + 12);
          tNote.setAttribute("class", "amap-stat-note");
          tNote.setAttribute("text-anchor", "middle");
          tNote.textContent = n.statNote;
          svg.appendChild(tNote);
        }
      }
    });

    // ─ ヒット領域（最前面） ─
    MAP_NODES.forEach(function(n) {
      var cx = n.x, cy = n.y;
      var r = nodeRadius(n) + 7;
      var hit = document.createElementNS(ns, "circle");
      hit.setAttribute("cx", cx); hit.setAttribute("cy", cy);
      hit.setAttribute("r", r);
      hit.setAttribute("class", "amap-hit");
      hit.setAttribute("data-id", n.id);
      hit.setAttribute("tabindex", "0");
      hit.setAttribute("role", "button");
      hit.setAttribute("aria-label", (n.nameShort || n.name.split("\n")[0]));
      hit.addEventListener("mouseenter", function() { showMapTooltip(n, hit, svg); });
      hit.addEventListener("mouseleave", hideMapTooltip);
      hit.addEventListener("focus",      function() { showMapTooltip(n, hit, svg); });
      hit.addEventListener("blur",       hideMapTooltip);
      hit.addEventListener("click",      function() { selectMapNode(n.id); });
      hit.addEventListener("keydown",    function(ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); selectMapNode(n.id); }
      });
      svg.appendChild(hit);
    });

    svgWrap.appendChild(svg);
    layout.appendChild(svgWrap);

    // ── 詳細パネル（右側縦長） ──────────────────────────────────────────
    var detail = el("div", { class: "amap-detail", id: "amap-detail" });
    var initNode = MAP_NODES.find(function(n){ return n.id === "yumoto"; });
    detail.appendChild(buildMapDetailCard(initNode || null));
    layout.appendChild(detail);

    host.appendChild(layout);

    // ── 吹き出しカード（熱海・伊東） ──────────────────────────────────
    var callouts = el("div", { class: "amap-callouts" });
    [
      { id: "atami",  badge: "高付加価値需要 82", badgeCls: "amap-co-badge-gold",
        stat: "推定 9.4万人/週", note: "宿泊・食体験への事前案内を強化" },
      { id: "ito",    badge: "送客候補", badgeCls: "amap-co-badge-blue",
        stat: "推定 5.8万人/週", note: "温泉・海鮮・文化施設の半日導線を提案" },
    ].forEach(function(c) {
      var n = MAP_NODES.find(function(x){ return x.id === c.id; });
      if (!n) return;
      var co = el("div", { class: "amap-callout" });
      var coHead = el("div", { class: "amap-co-head" });
      coHead.appendChild(el("span", { class: "amap-co-name" }, n.nameShort || n.name.split("\n")[0]));
      coHead.appendChild(el("span", { class: "amap-co-badge " + c.badgeCls }, c.badge));
      co.appendChild(coHead);
      co.appendChild(el("div", { class: "amap-co-stat" }, c.stat));
      co.appendChild(el("div", { class: "amap-co-note" }, c.note));
      callouts.appendChild(co);
    });
    host.appendChild(callouts);

    // ── 凡例 ─────────────────────────────────────────────────────────────
    var legend = el("div", { class: "amap-legend" });
    var legLeft = el("div", { class: "amap-leg-items" });
    [
      { cls: "low",      label: "低" },
      { cls: "medium",   label: "中" },
      { cls: "high",     label: "高" },
      { cls: "critical", label: "最優先" },
    ].forEach(function(li) {
      var item = el("span", { class: "amap-leg-item" });
      item.appendChild(el("span", { class: "amap-leg-dot amap-node-" + li.cls }));
      item.appendChild(el("span", { class: "amap-leg-label" }, li.label));
      legLeft.appendChild(item);
    });
    legend.appendChild(legLeft);
    legend.appendChild(el("span", { class: "amap-leg-note" }, "概略マップ / デモデータ"));
    host.appendChild(legend);

    // 初期状態：箱根湯本を選択・ハイライト
    applyMapLayer(_mapActiveLayer);
    selectMapNode("yumoto");
  }

  function nodeRadius(n) {
    if (n.weeklyVisitors >= 180000) return 24;
    if (n.weeklyVisitors >= 100000) return 19;
    if (n.weeklyVisitors >= 60000)  return 15;
    if (n.weeklyVisitors >= 30000)  return 12;
    return 10;
  }

  function applyMapLayer(layerKey) {
    _mapActiveLayer = layerKey;
    var host = document.getElementById("area-map-wrap");
    if (!host) return;
    var svg = host.querySelector(".amap-svg");
    if (!svg) return;
    MAP_NODES.forEach(function(n) {
      var circle = svg.querySelector(".amap-node[data-id='" + n.id + "']");
      if (!circle) return;
      ["visit","flow","spend","hva"].forEach(function(l){ circle.classList.remove("amap-layer-" + l); });
      circle.classList.add("amap-layer-" + layerKey);
    });
    var card = document.getElementById("area-map-card");
    if (!card) return;
    card.querySelectorAll(".amap-tab").forEach(function(btn) {
      btn.classList.toggle("active", btn.dataset.layer === layerKey);
    });
  }

  function selectMapNode(nodeId) {
    _mapSelectedNode = nodeId;
    var host = document.getElementById("area-map-wrap");
    if (!host) return;
    var svg = host.querySelector(".amap-svg");
    if (svg) {
      svg.querySelectorAll(".amap-node").forEach(function(c) {
        c.classList.toggle("amap-selected", c.dataset.id === nodeId);
      });
    }
    var n = MAP_NODES.find(function(x){ return x.id === nodeId; });
    var detail = document.getElementById("amap-detail");
    if (detail && n) {
      detail.innerHTML = "";
      detail.appendChild(buildMapDetailCard(n));
    }
    // テーブル行ハイライト
    var shortName = n ? (n.nameShort || n.name.split("\n")[0]) : "";
    document.querySelectorAll("#area-table tbody tr").forEach(function(row) {
      var nc = row.querySelector(".td-strong");
      row.classList.toggle("amap-row-highlight", !!(nc && nc.textContent.trim() === shortName));
    });
  }

  function buildMapDetailCard(n) {
    var wrap = el("div", { class: "amap-detail-inner" });
    if (!n) {
      wrap.appendChild(el("p", { class: "amap-detail-empty" }, "ノードをクリックするとエリア詳細を表示します"));
      return wrap;
    }
    var congMap  = { critical: "最優先", high: "高", medium: "中", low: "低" };
    var congCls  = { critical: "amap-det-badge-critical", high: "amap-det-badge-high", medium: "amap-det-badge-medium", low: "amap-det-badge-low" };
    var areaName = n.nameShort || n.name.split("\n")[0];
    var isSelected = n.congestion === "critical";

    // ヘッダー
    var head = el("div", { class: "amap-det-head" + (isSelected ? " amap-det-head-critical" : "") });
    head.appendChild(el("div", { class: "amap-det-name" }, areaName));
    var badge = congMap[n.congestion] || n.congestion;
    head.appendChild(el("span", { class: "amap-det-badge " + (congCls[n.congestion] || "") }, badge));
    wrap.appendChild(head);

    // 指標
    var kpis = [
      { label: "推定来訪者数", val: formatVisitors(n.weeklyVisitors) + " / 週", big: true },
      { label: "来訪指数",     val: n.visitorIndex + " / 100" },
      { label: "混雑傾向",     val: congMap[n.congestion] || n.congestion },
      { label: "高付加価値需要指数", val: n.valueDemandIndex + " / 100" },
    ];
    var kpiGrid = el("div", { class: "amap-det-kpis" });
    kpis.forEach(function(k) {
      var item = el("div", { class: "amap-det-kpi" });
      item.appendChild(el("div", { class: "amap-det-kpi-label" }, k.label));
      item.appendChild(el("div", { class: "amap-det-kpi-val" + (k.big ? " big" : "") }, k.val));
      kpiGrid.appendChild(item);
    });
    wrap.appendChild(kpiGrid);

    // 推奨判断
    wrap.appendChild(el("div", { class: "amap-det-rec-label" }, "推奨判断"));
    wrap.appendChild(el("div", { class: "amap-det-rec" }, n.recommendation));

    // 詳細を見るボタン
    var btn = el("button", { class: "amap-det-btn", onclick: function() { selectMapNode(n.id); } }, "詳細を見る");
    btn.addEventListener("click", function() {
      document.querySelector("#area-table tbody tr.amap-row-highlight") &&
        document.querySelector("#area-table tbody tr.amap-row-highlight").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    wrap.appendChild(btn);
    return wrap;
  }

  function formatVisitors(v) {
    if (v >= 10000) return (v / 10000).toFixed(1) + "万人";
    return v.toLocaleString() + "人";
  }

  var _mapTooltipEl = null;
  function showMapTooltip(n, hitEl, svgEl) {
    hideMapTooltip();
    var congMap = { critical: "最優先", high: "高", medium: "中", low: "低" };
    var tt = document.createElement("div");
    tt.className = "amap-tooltip";
    tt.innerHTML =
      "<div class='amap-tt-name'>" + (n.nameShort || n.name.replace("\n"," ")) + "</div>" +
      "<div class='amap-tt-row'><span>推定来訪者数</span><span>" + formatVisitors(n.weeklyVisitors) + "/週</span></div>" +
      "<div class='amap-tt-row'><span>来訪指数</span><span>" + n.visitorIndex + "</span></div>" +
      "<div class='amap-tt-row'><span>混雑傾向</span><span>" + (congMap[n.congestion]||n.congestion) + "</span></div>" +
      "<div class='amap-tt-row'><span>高付加価値需要</span><span>" + n.valueDemandIndex + "</span></div>" +
      "<div class='amap-tt-rec'>" + n.recommendation + "</div>";
    document.body.appendChild(tt);
    _mapTooltipEl = tt;
    var svgRect = svgEl.getBoundingClientRect();
    var vb = svgEl.viewBox.baseVal;
    var sx = svgRect.width / vb.width, sy = svgRect.height / vb.height;
    var cx = parseFloat(hitEl.getAttribute("cx"));
    var cy = parseFloat(hitEl.getAttribute("cy"));
    var px = svgRect.left + cx * sx + window.scrollX;
    var py = svgRect.top  + cy * sy + window.scrollY;
    tt.style.left = px + "px";
    tt.style.top  = (py - tt.offsetHeight - 8) + "px";
    requestAnimationFrame(function() { tt.style.top = (py - tt.offsetHeight - 8) + "px"; });
  }
  function hideMapTooltip() {
    if (_mapTooltipEl) { _mapTooltipEl.remove(); _mapTooltipEl = null; }
  }

  // ========================================================
  // AREA ANALYSIS
  // ========================================================
  function renderAreaTable() {
    const table = el("table", { class: "data-table" });
    table.appendChild(el("thead", null, el("tr", null, [
      el("th", null, "エリア"),
      el("th", null, "来訪（指数・推定）"),
      el("th", null, "回遊（指数・推定）"),
      el("th", null, "消費（指数・参考）"),
      el("th", null, "高付加価値需要"),
      el("th", null, "混雑傾向"),
      el("th", null, "優先度（対象規模）"),
      el("th", null, "推奨判断"),
    ])));
    const tbody = el("tbody");
    AREAS.forEach((a) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("div", { class: "td-area" }, [
          el("span", { class: "td-strong" }, a.name),
          el("span", { class: "td-area-sub" }, a.sub),
        ])),
        el("td", null, scoreCellWithAbs(a.visit, "b-red", a.ev)),
        el("td", null, scoreCellWithAbs(a.flow, "b-gold", a.ef)),
        el("td", null, scoreCellWithAbs(a.spend, "b-green", a.sr)),
        el("td", null, scoreCellWithAbs(a.hva, "b-gold", a.ha)),
        el("td", null, crowdBadge(a.crowd)),
        el("td", null, el("div", { class: "td-pri-stack" }, [
          el("span", { class: "pri-badge " + a.priority }, a.priorityLabel),
          el("div", { class: "td-abs-note" }, a.pt),
        ])),
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
  function scoreCellWithAbs(v, barCls, absText) {
    const wrap = el("div", { class: "td-score-stack" });
    wrap.appendChild(scoreCell(v, barCls));
    if (absText) wrap.appendChild(el("div", { class: "td-abs-note" }, absText));
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
      el("th", null, "来訪"),
      el("th", null, "消費・滞在価値"),
      el("th", null, "特徴"),
    ])));
    const tbody = el("tbody");
    SEGMENTS.forEach((s) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, s.seg)),
        el("td", null, scoreCellWithAbs(s.visit, "", s.visitAbs)),
        el("td", null, scoreCellWithAbs(s.spend, "b-green", s.spendAbs)),
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
    row1.appendChild(makeFlowNode("現在集中している主な導線", ROUTE_FLOW.primary, "primary"));
    wrap.appendChild(row1);
    wrap.appendChild(arrowDown());
    const row2 = el("div", { class: "flow-row" });
    row2.appendChild(makeFlowNode("分散・送客候補（接続観光地・周遊）", ROUTE_FLOW.candidates, "candidate"));
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
    const wrap = el("div", { class: "heatmap-wrap" });
    wrap.appendChild(el("p", { class: "heatmap-caption" }, "1〜5は相対混雑度。母数: 主要スポット・駅の推定滞在（乗降・モバイル・現地ログ等から集計したデモ値）。"));
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
    wrap.appendChild(table);
    mount("time-heatmap", wrap);
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
    wrap.appendChild(el("div", { class: "axis-y" }, "消費・滞在価値指数（高 →）"));
    const board = el("div", { class: "matrix-board" });
    board.appendChild(el("div", { class: "matrix-axis-line v" }));
    board.appendChild(el("div", { class: "matrix-axis-line h" }));
    board.appendChild(el("div", { class: "quad-label tl" }, [
      "誘導強化", el("small", null, "来訪少 × 消費/滞在価値高"),
    ]));
    board.appendChild(el("div", { class: "quad-label tr" }, [
      "維持・単価向上", el("small", null, "来訪多 × 消費/滞在価値高"),
    ]));
    board.appendChild(el("div", { class: "quad-label bl" }, [
      "優先度低", el("small", null, "来訪少 × 消費/滞在価値低"),
    ]));
    board.appendChild(el("div", { class: "quad-label br" }, [
      "最優先改善", el("small", null, "来訪多 × 消費/滞在価値低"),
    ]));

    SPEND_AREAS.forEach((a) => {
      const left = (a.v / 100) * 100;
      const bottom = (a.s / 100) * 100;
      const dot = el("div", {
        class: "matrix-dot " + a.cls,
        style: `left:${left}%;bottom:${bottom}%;`,
        title: `${a.name} / 来訪指数 ${a.v}（${a.est || ""}） × 消費・滞在価値 ${a.s}` + (a.note ? ` — ${a.note}` : ""),
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
      el("th", null, "来訪指数"),
      el("th", null, "推定来訪者数"),
      el("th", null, "消費指数"),
      el("th", null, "施設利用（推定）"),
      el("th", null, "ギャップ"),
      el("th", null, "参考（推定レンジ）"),
      el("th", null, "推奨判断"),
    ])));
    const tbody = el("tbody");
    SPEND_LOSS.forEach((r) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, r.area)),
        el("td", null, el("span", { class: "td-num" }, r.visit)),
        el("td", null, el("span", { class: "td-note" }, r.estVisit)),
        el("td", null, el("span", { class: "td-num" }, r.spend)),
        el("td", null, el("span", { class: "td-note" }, r.estUse)),
        el("td", null, el("span", { class: "tag t-red" }, r.gap)),
        el("td", null, el("span", { class: "td-note" }, r.refLoss)),
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
      el("th", null, "来訪指数"),
      el("th", null, "推定来訪者数"),
      el("th", null, "消費指数"),
      el("th", null, "施設利用（推定）"),
      el("th", null, "効率"),
      el("th", null, "参考（推定レンジ）"),
      el("th", null, "推奨判断"),
    ])));
    const tbody = el("tbody");
    SPEND_EFF.forEach((r) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, r.area)),
        el("td", null, el("span", { class: "td-num" }, r.visit)),
        el("td", null, el("span", { class: "td-note" }, r.estVisit)),
        el("td", null, el("span", { class: "td-num" }, r.spend)),
        el("td", null, el("span", { class: "td-note" }, r.estUse)),
        el("td", null, el("span", { class: "tag t-green" }, r.eff)),
        el("td", null, el("span", { class: "td-note" }, r.refSpend)),
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
      const effectiveStatusOf = (i) => lsGetInitStatus(i.id) || i.status;
      const count = f.id === "all" ? INITIATIVES.length : INITIATIVES.filter((i) => effectiveStatusOf(i) === f.id).length;
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
    const effectiveStatusOf = (i) => lsGetInitStatus(i.id) || i.status;
    const list = activeInitFilter === "all"
      ? INITIATIVES
      : INITIATIVES.filter((i) => effectiveStatusOf(i) === activeInitFilter);
    list.forEach((it) => grid.appendChild(renderInitCard(it)));
    if (list.length === 0) {
      grid.appendChild(el("div", { style: "padding:40px;text-align:center;color:var(--ink-4);font-size:13px;" }, "該当する施策はありません"));
    }
    const old = document.getElementById("initiative-grid");
    if (old) old.replaceWith(grid);
  }

  function renderInitCard(it) {
    const card = el("div", { class: "init-card" });

    const overrideStatus = lsGetInitStatus(it.id);
    const effectiveStatus = overrideStatus || it.status;
    const statusLabelMap = { running: "実施中", consider: "検討中", review: "要確認", done: "完了", held: "保留" };
    const effectiveStatusLabel = statusLabelMap[effectiveStatus] || it.statusLabel;

    const head = el("div", { class: "init-head" }, [
      el("div", { class: "init-title" }, it.title),
      el("span", { class: "init-status " + effectiveStatus }, effectiveStatusLabel),
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
    const detailBtn = el("button", { class: "link-btn", "aria-label": it.title + " の詳細を見る" }, [
      el("span", null, "詳細を見る"),
      icon("i-arrow-right"),
    ]);
    detailBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openInitiativeDrawer(it.id);
    });
    foot.appendChild(detailBtn);
    card.appendChild(foot);

    // also allow clicking the card body to open
    card.classList.add("is-clickable");
    card.addEventListener("click", () => openInitiativeDrawer(it.id));
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInitiativeDrawer(it.id); }
    });

    return card;
  }

  // ========================================================
  // INITIATIVE DETAIL DRAWER
  // ========================================================
  const LS_INIT_CHECK  = "oti_init_check_";   // + initiativeId -> {checkId: bool}
  const LS_INIT_STATUS = "oti_init_status_";  // + initiativeId -> override status

  function lsGetCheck(id) {
    try { return JSON.parse(localStorage.getItem(LS_INIT_CHECK + id) || "{}"); } catch { return {}; }
  }
  function lsSaveCheck(id, obj) {
    localStorage.setItem(LS_INIT_CHECK + id, JSON.stringify(obj));
  }
  function lsGetInitStatus(id) {
    return localStorage.getItem(LS_INIT_STATUS + id) || "";
  }
  function lsSaveInitStatus(id, val) {
    if (val) localStorage.setItem(LS_INIT_STATUS + id, val);
    else localStorage.removeItem(LS_INIT_STATUS + id);
  }

  let activeInitDrawerId = null;
  let activeInitDrawerTab = "overview";

  function openInitiativeDrawer(initiativeId) {
    const it = INITIATIVES.find(x => x.id === initiativeId);
    const detail = INITIATIVE_DETAILS[initiativeId];
    if (!it || !detail) return;

    activeInitDrawerId = initiativeId;
    activeInitDrawerTab = "overview";
    renderInitiativeDrawer(it, detail);
  }

  function closeInitiativeDrawer() {
    const root = document.getElementById("drawer-root");
    if (!root) return;
    root.classList.remove("is-open");
    document.removeEventListener("keydown", initDrawerKeyHandler);
    setTimeout(() => { root.innerHTML = ""; }, 220);
    activeInitDrawerId = null;
  }

  function initDrawerKeyHandler(e) {
    if (e.key === "Escape") closeInitiativeDrawer();
  }

  function renderInitiativeDrawer(it, detail) {
    const root = document.getElementById("drawer-root");
    if (!root) return;
    root.innerHTML = "";

    const scrim = el("div", { class: "drawer-scrim" });
    scrim.addEventListener("click", closeInitiativeDrawer);

    const drawer = el("aside", { class: "drawer drawer-wide", role: "dialog", "aria-label": it.title });

    // --- Head ---
    const head = el("header", { class: "drawer-head init-drawer-head" });
    const hLeft = el("div", { class: "drawer-head-left" });
    hLeft.appendChild(el("div", { class: "drawer-eyebrow" }, "施策詳細"));
    hLeft.appendChild(el("h3", { class: "drawer-title" }, it.title));

    const headMeta = el("div", { class: "init-drawer-meta" });
    const effectiveStatus = lsGetInitStatus(it.id) || it.status;
    const statusLabelMap = { running: "実施中", consider: "検討中", review: "要確認", done: "完了", held: "保留" };
    headMeta.appendChild(el("span", { class: "init-status " + effectiveStatus }, statusLabelMap[effectiveStatus] || it.statusLabel));
    headMeta.appendChild(el("span", { class: "priority-chip " + it.priority }, it.priorityLabel));
    headMeta.appendChild(el("span", { class: "init-drawer-area" }, [icon("i-pin"), " " + it.area]));
    hLeft.appendChild(headMeta);

    head.appendChild(hLeft);
    const closeBtn = el("button", { class: "drawer-close", "aria-label": "閉じる", title: "閉じる" }, "×");
    closeBtn.addEventListener("click", closeInitiativeDrawer);
    head.appendChild(closeBtn);
    drawer.appendChild(head);

    // --- Tabs ---
    const tabBar = el("nav", { class: "drawer-tabs", role: "tablist" });
    const tabs = [
      { key: "overview",    label: "概要" },
      { key: "plan",        label: "実施計画" },
      { key: "delivery",    label: "配信設定" },
      { key: "measurement", label: "効果測定" },
    ];
    tabs.forEach(t => {
      const btn = el("button", {
        class: "drawer-tab" + (t.key === activeInitDrawerTab ? " active" : ""),
        role: "tab",
        "aria-selected": t.key === activeInitDrawerTab ? "true" : "false",
      }, t.label);
      btn.addEventListener("click", () => switchInitiativeDrawerTab(t.key));
      tabBar.appendChild(btn);
    });
    drawer.appendChild(tabBar);

    // --- Body ---
    const body = el("div", { class: "drawer-body init-drawer-body", id: "init-drawer-body" });
    body.appendChild(renderInitiativeTabContent(it, detail, activeInitDrawerTab));
    drawer.appendChild(body);

    // --- Foot ---
    drawer.appendChild(renderInitiativeDrawerFoot(it));

    root.appendChild(scrim);
    root.appendChild(drawer);
    requestAnimationFrame(() => root.classList.add("is-open"));
    document.addEventListener("keydown", initDrawerKeyHandler);
  }

  function switchInitiativeDrawerTab(tabKey) {
    activeInitDrawerTab = tabKey;
    // toggle button state
    document.querySelectorAll(".drawer-tab").forEach((b) => {
      const isActive = b.textContent === ({
        overview: "概要", plan: "実施計画", delivery: "配信設定", measurement: "効果測定",
      })[tabKey];
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    // swap body
    const body = document.getElementById("init-drawer-body");
    if (!body || !activeInitDrawerId) return;
    const it = INITIATIVES.find(x => x.id === activeInitDrawerId);
    const detail = INITIATIVE_DETAILS[activeInitDrawerId];
    if (!it || !detail) return;
    body.innerHTML = "";
    body.appendChild(renderInitiativeTabContent(it, detail, tabKey));
  }

  function renderInitiativeTabContent(it, detail, tabKey) {
    switch (tabKey) {
      case "plan":        return renderInitiativePlanTab(it, detail);
      case "delivery":    return renderInitiativeDeliveryTab(it, detail);
      case "measurement": return renderInitiativeMeasurementTab(it, detail);
      case "overview":
      default:            return renderInitiativeOverviewTab(it, detail);
    }
  }

  // -------- Tab 1: Overview --------
  function renderInitiativeOverviewTab(it, detail) {
    const wrap = el("div", { class: "tab-pane" });
    const relatedList = detail && detail.related ? detail.related : [];

    wrap.appendChild(drawerSection("対象エリア", el("p", { class: "drawer-text" }, it.area)));
    wrap.appendChild(drawerSection("対象セグメント", el("p", { class: "drawer-text" }, it.segment || "Web/App・予約・閲覧ログに基づく動的セグメント（条件は配信設定タブで確認）")));
    if (detail && detail.delivery && detail.delivery.channels) {
      wrap.appendChild(drawerSection("配信チャネル", chipList(detail.delivery.channels, "kpi")));
    }
    wrap.appendChild(drawerSection("判断理由", el("p", { class: "drawer-text" }, it.reason)));

    const evPack = INITIATIVE_OVERVIEW_EVIDENCE[it.id];
    const basis = evPack && evPack.basis ? evPack.basis : [];
    if (basis.length) {
      const grid = el("div", { class: "judgment-basis-grid" });
      basis.forEach(function (b) {
        const card = el("div", { class: "judgment-basis-card" });
        card.appendChild(el("div", { class: "judgment-basis-label" }, b.label));
        card.appendChild(el("div", { class: "judgment-basis-value" }, b.value));
        grid.appendChild(card);
      });
      wrap.appendChild(drawerSection("判断根拠", grid));
    }

    const blendWrap = el("div", { class: "data-blend-wrap" });
    blendWrap.appendChild(el("p", { class: "drawer-text data-blend-lead" },
      "鉄道・バス・フリーパス等の移動データと、Web/App・予約・クーポン等の行動ログを、エリア・時間帯で突き合わせて施策仮説に落とし込んでいます（表示はデモ値。実装時は各ソース定義に差し替え）。"));
    const flow = el("div", { class: "data-blend-flow" });
    INITIATIVE_DATA_PIPELINE_STEPS.forEach(function (step, i) {
      flow.appendChild(el("span", { class: "data-blend-flow-step" }, step));
      if (i < INITIATIVE_DATA_PIPELINE_STEPS.length - 1) {
        flow.appendChild(el("span", { class: "data-blend-flow-arrow" }, "→"));
      }
    });
    blendWrap.appendChild(flow);
    const table = el("table", { class: "data-blend-table" });
    const thead = el("thead");
    const headTr = el("tr");
    headTr.appendChild(el("th", null, "判断項目"));
    headTr.appendChild(el("th", null, "参照データ"));
    headTr.appendChild(el("th", null, "見ていること"));
    thead.appendChild(headTr);
    table.appendChild(thead);
    const tbody = el("tbody");
    INITIATIVE_DATA_BLEND_ROWS.forEach(function (row) {
      const tr = el("tr");
      tr.appendChild(el("td", null, row.item));
      tr.appendChild(el("td", null, row.source));
      tr.appendChild(el("td", null, row.looking));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    blendWrap.appendChild(table);
    wrap.appendChild(drawerSection("データの掛け合わせ", blendWrap));

    const sources = evPack && evPack.sources ? evPack.sources : DEFAULT_INIT_RELATED_SOURCES;
    const srcUl = el("ul", { class: "related-data-list" });
    sources.forEach(function (s) {
      srcUl.appendChild(el("li", null, s));
    });
    wrap.appendChild(drawerSection("関連データ", srcUl));

    wrap.appendChild(drawerSection("期待効果", el("p", { class: "drawer-text drawer-text-strong" }, it.effect)));
    wrap.appendChild(drawerSection("必要な実施内容", el("p", { class: "drawer-text" }, it.task)));
    wrap.appendChild(drawerSection("成功指標", chipList(it.kpis, "kpi")));
    wrap.appendChild(drawerSection("関連する分析指標", chipList(relatedList, "obs")));
    const nextStr = detail && detail.measurement && detail.measurement.nextDecision
      ? "効果測定の見立て: " + detail.measurement.nextDecision + "。詳細は効果測定タブを参照。"
      : "実施計画の未完了項目を進め、配信条件と素材を確定してください。";
    wrap.appendChild(drawerSection("次にやること", el("p", { class: "drawer-text" }, nextStr)));

    return wrap;
  }

  // -------- Tab 2: Plan --------
  function renderInitiativePlanTab(it, detail) {
    const wrap = el("div", { class: "tab-pane" });

    // top meta
    const top = el("div", { class: "drawer-meta-grid" });
    top.appendChild(drawerMeta("担当部署", detail.department));
    top.appendChild(drawerMeta("担当者", detail.owner));
    top.appendChild(drawerMeta("実施期間", detail.period.start + " 〜 " + detail.period.end));
    const effectiveStatus = lsGetInitStatus(it.id) || it.status;
    const statusLabelMap = { running: "実施中", consider: "検討中", review: "要確認", done: "完了", held: "保留" };
    top.appendChild(drawerMeta("進行ステータス", el("span", { class: "init-status " + effectiveStatus }, statusLabelMap[effectiveStatus] || it.statusLabel)));
    wrap.appendChild(top);

    // Checklist
    const stored = lsGetCheck(it.id);
    const items = detail.checklist.map(c => ({
      ...c,
      checked: stored[c.id] !== undefined ? stored[c.id] : c.checked,
    }));
    const total = items.length;
    const done = items.filter(c => c.checked).length;

    const clHead = el("div", { class: "drawer-section-row" });
    clHead.appendChild(el("h4", { class: "drawer-section-title" }, "実施チェックリスト"));
    const progress = el("span", { class: "checklist-progress" }, done + " / " + total + " 完了");
    clHead.appendChild(progress);

    const clWrap = el("div", { class: "drawer-section" });
    clWrap.appendChild(clHead);

    const clBar = el("div", { class: "checklist-bar" });
    clBar.appendChild(el("div", { class: "checklist-bar-fill", style: "width:" + (total === 0 ? 0 : (done / total * 100)) + "%" }));
    clWrap.appendChild(clBar);

    const clList = el("ul", { class: "checklist" });
    items.forEach(c => {
      const li = el("li", { class: "checklist-item" + (c.checked ? " is-checked" : "") });
      const box = el("span", { class: "checklist-box" });
      if (c.checked) box.appendChild(icon("i-check"));
      const label = el("span", { class: "checklist-label" }, c.label);
      li.appendChild(box);
      li.appendChild(label);
      li.addEventListener("click", () => toggleInitiativeChecklist(it.id, c.id));
      li.tabIndex = 0;
      li.setAttribute("role", "checkbox");
      li.setAttribute("aria-checked", c.checked ? "true" : "false");
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleInitiativeChecklist(it.id, c.id); }
      });
      clList.appendChild(li);
    });
    clWrap.appendChild(clList);
    wrap.appendChild(clWrap);

    // Timeline
    const tlWrap = el("div", { class: "drawer-section" });
    tlWrap.appendChild(el("h4", { class: "drawer-section-title" }, "簡易タイムライン"));
    const tl = el("ol", { class: "mini-timeline" });
    detail.timeline.forEach((t, idx) => {
      const li = el("li", { class: "mini-timeline-item" + (t.done ? " done" : "") + (idx === detail.timeline.length - 1 ? " last" : "") });
      li.appendChild(el("span", { class: "mini-timeline-dot" }));
      const body = el("div", { class: "mini-timeline-body" });
      body.appendChild(el("div", { class: "mini-timeline-label" }, t.label));
      body.appendChild(el("div", { class: "mini-timeline-date" }, t.date));
      li.appendChild(body);
      tl.appendChild(li);
    });
    tlWrap.appendChild(tl);
    wrap.appendChild(tlWrap);

    return wrap;
  }

  function toggleInitiativeChecklist(initiativeId, checklistItemId) {
    const detail = INITIATIVE_DETAILS[initiativeId];
    if (!detail) return;
    const stored = lsGetCheck(initiativeId);
    const defaultItem = detail.checklist.find(c => c.id === checklistItemId);
    const current = stored[checklistItemId] !== undefined ? stored[checklistItemId] : (defaultItem && defaultItem.checked);
    stored[checklistItemId] = !current;
    lsSaveCheck(initiativeId, stored);
    // Re-render only plan tab
    if (activeInitDrawerTab === "plan" && activeInitDrawerId === initiativeId) {
      const body = document.getElementById("init-drawer-body");
      const it = INITIATIVES.find(x => x.id === initiativeId);
      if (body && it) {
        body.innerHTML = "";
        body.appendChild(renderInitiativePlanTab(it, detail));
      }
    }
    updateInitiativeProgress(initiativeId);
  }

  function updateInitiativeProgress(initiativeId) {
    // (placeholder) progress is rendered in plan tab. Could update card badge later.
    return;
  }

  // -------- Tab 3: Delivery --------
  function renderInitiativeDeliveryTab(it, detail) {
    const wrap = el("div", { class: "tab-pane" });
    const d = detail.delivery;

    const grid = el("div", { class: "delivery-grid" });
    grid.appendChild(deliveryField("配信チャネル",   chipList(d.channels, "kpi"),   "i-broadcast"));
    grid.appendChild(deliveryField("対象エリア",     chipList(d.areas, "obs"),       "i-pin"));
    grid.appendChild(deliveryField("対象時間帯",     chipList(d.times, "obs"),       "i-calendar"));
    grid.appendChild(deliveryField("対象施設カテゴリ", chipList(d.facilities, "obs"), "i-store"));
    grid.appendChild(deliveryField("表示条件",       chipList(d.conditions, "obs"), "i-tune"));
    wrap.appendChild(grid);

    // Material preview card
    const m = d.materials;
    const preview = el("div", { class: "drawer-section" });
    preview.appendChild(el("h4", { class: "drawer-section-title" }, "配信素材プレビュー"));
    const card = el("div", { class: "material-card" });

    const cardHead = el("div", { class: "material-card-head" });
    cardHead.appendChild(el("span", { class: "material-card-eyebrow" }, "PREVIEW"));
    cardHead.appendChild(el("span", { class: "material-card-place" }, m.place || "—"));
    card.appendChild(cardHead);

    card.appendChild(el("div", { class: "material-card-title" }, m.title));
    card.appendChild(el("div", { class: "material-card-body" }, m.body));

    const cta = el("div", { class: "material-card-cta" });
    cta.appendChild(el("span", { class: "material-card-cta-btn" }, m.cta));
    cta.appendChild(el("span", { class: "material-card-qrhint" }, m.qrLabel || ""));
    card.appendChild(cta);

    preview.appendChild(card);
    wrap.appendChild(preview);

    return wrap;
  }

  function deliveryField(label, valueNode, iconKey) {
    const w = el("div", { class: "delivery-field" });
    const head = el("div", { class: "delivery-field-head" });
    head.appendChild(el("span", { class: "delivery-field-icon" }, icon(iconKey)));
    head.appendChild(el("span", { class: "delivery-field-label" }, label));
    w.appendChild(head);
    w.appendChild(valueNode);
    return w;
  }

  // -------- Tab 4: Measurement --------
  function renderInitiativeMeasurementTab(it, detail) {
    const wrap = el("div", { class: "tab-pane" });
    const m = detail.measurement;

    const top = el("div", { class: "measure-period" });
    top.appendChild(el("span", { class: "measure-period-label" }, "測定期間"));
    top.appendChild(el("span", { class: "measure-period-value" }, m.period));
    wrap.appendChild(top);

    const list = el("div", { class: "measure-list" });
    m.events.forEach(ev => {
      const card = el("div", { class: "measure-card" });

      const top1 = el("div", { class: "measure-card-top" });
      top1.appendChild(el("span", { class: "measure-card-label" }, ev.label));
      top1.appendChild(buildJudgeChip(ev.judge));
      card.appendChild(top1);

      const valRow = el("div", { class: "measure-card-values" });
      const cur = el("div", { class: "measure-val measure-val-current" });
      cur.appendChild(el("span", { class: "measure-val-num" }, String(ev.current)));
      cur.appendChild(el("span", { class: "measure-val-unit" }, ev.unit));
      cur.appendChild(el("span", { class: "measure-val-tag" }, "現在値"));
      valRow.appendChild(cur);

      valRow.appendChild(el("div", { class: "measure-arrow" }, icon("i-arrow-right")));

      const tgt = el("div", { class: "measure-val measure-val-target" });
      tgt.appendChild(el("span", { class: "measure-val-num" }, String(ev.target)));
      tgt.appendChild(el("span", { class: "measure-val-unit" }, ev.unit));
      tgt.appendChild(el("span", { class: "measure-val-tag" }, "目標値"));
      valRow.appendChild(tgt);

      const chgWrap = el("div", { class: "measure-change" });
      chgWrap.appendChild(el("span", { class: "measure-change-key" }, "変化"));
      chgWrap.appendChild(el("span", { class: "measure-change-val " + classifyChange(ev.change) }, ev.change));
      valRow.appendChild(chgWrap);
      card.appendChild(valRow);

      // mini bar (current vs target)
      const max = Math.max(toNum(ev.current), toNum(ev.target), 1);
      const bar = el("div", { class: "measure-bar" });
      bar.appendChild(el("div", { class: "measure-bar-target", style: "width:" + (toNum(ev.target) / max * 100) + "%" }));
      bar.appendChild(el("div", { class: "measure-bar-current", style: "width:" + (toNum(ev.current) / max * 100) + "%" }));
      card.appendChild(bar);

      list.appendChild(card);
    });
    wrap.appendChild(list);

    const decision = el("div", { class: "drawer-section measure-next" });
    decision.appendChild(el("h4", { class: "drawer-section-title" }, "次の判断"));
    decision.appendChild(el("div", { class: "measure-next-row" }, [
      buildJudgeChip(m.nextDecision),
      el("p", { class: "drawer-text" }, "実施後は効果測定画面で、継続・改善・停止・追加検証を判断します。"),
    ]));
    wrap.appendChild(decision);

    return wrap;
  }

  function buildJudgeChip(label) {
    const map = {
      "改善傾向": "tone-good",
      "要確認":   "tone-attention",
      "未実施":   "tone-neutral",
      "実施準備中": "tone-neutral",
      "検討中":   "tone-neutral",
      "継続":     "tone-good",
      "改善":     "tone-attention",
      "停止":     "tone-warn",
      "追加検証": "tone-info",
    };
    return el("span", { class: "judge-chip " + (map[label] || "tone-neutral") }, label);
  }
  function classifyChange(text) {
    if (!text || text === "—") return "neutral";
    if (text.startsWith("+")) return "up";
    if (text.startsWith("-")) return "down";
    return "neutral";
  }
  function toNum(v) {
    const n = Number(String(v).replace(/[^\d.\-]/g, ""));
    return isNaN(n) ? 0 : n;
  }

  // -------- Foot (status-aware actions) --------
  function renderInitiativeDrawerFoot(it) {
    const foot = el("footer", { class: "drawer-foot init-drawer-foot" });
    const effectiveStatus = lsGetInitStatus(it.id) || it.status;

    // status-specific buttons
    const buttons = [];
    if (effectiveStatus === "consider") {
      buttons.push({ kind: "primary", label: "実施準備へ進める", action: () => {
        lsSaveInitStatus(it.id, "running");
        showToast("実施準備に移動しました。");
        renderInitiatives();
        closeInitiativeDrawer();
      }});
      buttons.push({ kind: "ghost",   label: "保留", action: () => {
        lsSaveInitStatus(it.id, "held");
        showToast("保留にしました。");
        renderInitiatives();
        closeInitiativeDrawer();
      }});
    } else if (effectiveStatus === "running") {
      buttons.push({ kind: "primary", label: "効果測定で確認", action: () => {
        showToast("効果測定画面で確認できます。");
        closeInitiativeDrawer();
        const btn = document.querySelector('.nav-item[data-view="impact"]');
        if (btn) btn.click();
      }});
      buttons.push({ kind: "ghost",   label: "改善メモを追加", action: () => {
        showToast("改善メモを追加しました。");
      }});
    } else if (effectiveStatus === "review") {
      buttons.push({ kind: "primary", label: "改善案を作成", action: () => {
        showToast("改善案を下書きに追加しました。");
      }});
      buttons.push({ kind: "ghost",   label: "継続", action: () => {
        lsSaveInitStatus(it.id, "running");
        showToast("継続として扱います。");
        renderInitiatives();
        closeInitiativeDrawer();
      }});
      buttons.push({ kind: "ghost",   label: "停止", action: () => {
        lsSaveInitStatus(it.id, "done");
        showToast("施策を停止しました。");
        renderInitiatives();
        closeInitiativeDrawer();
      }});
    } else if (effectiveStatus === "held") {
      buttons.push({ kind: "primary", label: "保留を解除", action: () => {
        lsSaveInitStatus(it.id, "consider");
        showToast("保留を解除しました。");
        renderInitiatives();
        closeInitiativeDrawer();
      }});
    } else if (effectiveStatus === "done") {
      buttons.push({ kind: "ghost",   label: "レポートに追加", action: () => {
        showToast("レポートに追加しました。");
      }});
    }

    buttons.forEach(b => {
      const btn = el("button", { class: (b.kind === "primary" ? "btn-primary" : "btn-ghost") + " btn-sm" }, b.label);
      btn.addEventListener("click", (e) => { e.stopPropagation(); b.action(); });
      foot.appendChild(btn);
    });

    const closeBtn = el("button", { class: "btn-ghost btn-sm" }, "閉じる");
    closeBtn.addEventListener("click", closeInitiativeDrawer);
    foot.appendChild(closeBtn);
    return foot;
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
      el("th", null, "推定来訪・関連行動"),
      el("th", null, "状態"),
      el("th", null, "推奨判断"),
      el("th", null, "優先度・対象規模"),
      el("th", null, "期待効果"),
    ])));
    const tbody = el("tbody");
    REFERRAL_AREAS.forEach((a) => {
      const stateCell = el("span", { class: "state-pill " + a.stateCls });
      stateCell.appendChild(el("span", { class: "state-dot" }));
      stateCell.appendChild(el("span", { class: "state-label" }, a.state));

      const absCell = el("div", { class: "td-stack-tight" }, [
        el("div", { class: "td-note" }, a.estVisit),
        el("div", { class: "td-note" }, a.relActs),
      ]);

      const priCell = el("div", { class: "td-pri-stack" }, [
        el("span", { class: "pri-badge " + a.priorityCls }, a.priority),
        el("div", { class: "td-abs-note" }, a.priScale),
      ]);

      tbody.appendChild(el("tr", null, [
        el("td", null, el("span", { class: "td-strong" }, a.area)),
        el("td", null, absCell),
        el("td", null, stateCell),
        el("td", null, el("span", { class: "ref-decide" }, a.decide)),
        el("td", null, priCell),
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
    wrap.appendChild(el("div", { class: "ref-axis-y-label" }, "↑ 消費・滞在価値指数（高）"));

    const board = el("div", { class: "ref-matrix-board" });
    board.appendChild(el("div", { class: "ref-axis-x-label" }, "来訪指数（高） →"));

    // quadrant captions (left-top, right-top, left-bottom, right-bottom)
    const captions = [
      { cls: "q-tl", title: "誘導強化",       note: "来訪少 × 消費/滞在価値高" },
      { cls: "q-tr", title: "維持・単価向上", note: "来訪多 × 消費/滞在価値高" },
      { cls: "q-bl", title: "優先度低",       note: "来訪少 × 消費/滞在価値低" },
      { cls: "q-br", title: "最優先改善",     note: "来訪多 × 消費/滞在価値低" },
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
    const v = REFERRAL_FILTER_VARIANTS[area] || REFERRAL_FILTER_VARIANTS["all"];
    REFERRAL_KPIS = buildReferralKpis(v);

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
    "segment-insight": "上位客層インサイト",
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

        // close any open drawer when navigating
        const drawerRoot = document.getElementById("drawer-root");
        if (drawerRoot && drawerRoot.classList.contains("is-open")) {
          if (activeInitDrawerId) closeInitiativeDrawer();
          else closeReferralDrawer();
        }

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

    const areaSel0 = document.querySelector("select[data-filter='area']");
    if (areaSel0) applyReferralFilter(areaSel0.value);

    // Dashboard
    renderAlertBar();
    renderKpis();
    renderMarketSignalsDash();
    renderPriorityAreas();
    renderRecommendedActions();
    renderTrendChart();
    renderComposition();

    // Area map layer tabs
    document.querySelectorAll(".amap-tab").forEach(function(btn) {
      btn.addEventListener("click", function() { applyMapLayer(btn.dataset.layer); });
    });

    // Area
    renderAreaMap();
    renderAreaTable();
    renderAreaJudgment();
    renderSegmentTable();

    renderSegmentInsight();

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
