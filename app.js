// =========================================================
// Odakyu Tourism Action Cockpit — PoC Mock
// All data: anonymized/aggregated DEMO (Synthetic Data)
// AI suggestions are hypotheses to be validated, not conclusions.
// =========================================================

(function () {
  "use strict";

  // =========================================================
  // DEMO DATA
  // =========================================================

  // --- Screen 1: Executive Cockpit ---

  const KPI_CARDS = [
    {
      id: "concentration",
      type: "kpi-primary",
      eyebrow: "王道ルート集中指数",
      label: "混雑緩和・代替ルート誘導の優先判断に使う",
      score: 72,
      denom: 100,
      decision: "<strong>判断用途:</strong> 大涌谷・芦ノ湖への集中度が高いほど、代替ルート誘導施策の優先度が上がる。72は「分散施策を今すぐ検討すべき」水準。",
    },
    {
      id: "spend-gap",
      type: "kpi-warning",
      eyebrow: "消費ギャップ指数",
      label: "流入はあるが消費されていないエリアの販促判断に使う",
      score: 64,
      denom: 100,
      decision: "<strong>判断用途:</strong> 流入指数と消費転換指数の乖離。数値が大きいほど「人は来ているがお金が落ちていない」エリアが多い。64は改善余地が大きい状態。",
    },
    {
      id: "dispersion",
      type: "kpi-opportunity",
      eyebrow: "分散誘導余地指数",
      label: "非王道スポットへの送客施策を打つべきエリア判断に使う",
      score: 81,
      denom: 100,
      decision: "<strong>判断用途:</strong> 仙石原・強羅など非王道エリアの消費効率と受け入れ余地を総合。81は「積極的な誘導施策を打てる余地がある」水準。",
    },
  ];

  const DATA_INSIGHTS = [
    {
      icon: "⚠",
      color: "red",
      title: "箱根湯本: 流入多 × 消費転換弱（推定）",
      desc: "鉄道・バス乗降データと商業施設購買を重ねると、最大流入地点での消費転換率が相対的に低い可能性が示唆される。荷物・待ち時間・乗換前の摩擦が要因の仮説。",
      tags: [["fact", "事実"], ["estim", "推定"], ["verify", "要検証"]],
    },
    {
      icon: "✦",
      color: "green",
      title: "仙石原: 流入は少ないが消費効率が高い（推定）",
      desc: "フリーパス利用データと購買記録の照合で、仙石原エリアは訪問者あたりの消費効率が王道エリアを上回る可能性。王道混雑時の代替誘導先として検証価値が高い。",
      tags: [["fact", "事実"], ["estim", "推定"]],
    },
    {
      icon: "⬡",
      color: "blue",
      title: "Web関心と現地行動のズレ（推定）",
      desc: "アプリ・Webの検索・閲覧データと実際の乗降・訪問エリアを比較すると、「関心はあるが来ていないエリア」が存在する可能性。Web→来訪転換の施策余地がある。",
      tags: [["estim", "推定"], ["hypo", "AI仮説"]],
    },
    {
      icon: "☁",
      color: "gold",
      title: "天気×回遊パターンの変化（推定）",
      desc: "雨天日と晴天日で乗降・滞在エリアのパターンが変わる可能性が想定される。屋内スポット・温泉・カフェへの誘導は雨天時に特に効果的な仮説として検証できる。",
      tags: [["estim", "推定"], ["hypo", "AI仮説"]],
    },
  ];

  const BI_DIFF = [
    { old: "乗降データを可視化する（BIレポート）", newv: "乗降＋購買＋Web＋チケットを横断し、回遊と消費の機会を特定する" },
    { old: "「どこが混んでいるか」を把握する", newv: "「混雑の先にある消費機会と分散余地」を施策につなぐ" },
    { old: "分析は担当者が解釈する", newv: "AIが施策仮説・KPI・検証方法をカードで提示する" },
    { old: "部門ごとにデータが点在", newv: "共通キー（time_bucket × area_id × segment）で横断分析" },
  ];

  const WEEKLY_FOCUS = [
    {
      level: "high",
      badge: "最優先判断",
      title: "箱根湯本: 消費転換改善の施策検証を開始",
      sub: "流入過多だが消費が弱い。荷物・待ち時間・食べ歩き導線の改善仮説を最優先で検討。",
    },
    {
      level: "medium",
      badge: "検討判断",
      title: "仙石原: 王道混雑時の代替誘導先として検証準備",
      sub: "消費効率が高く、分散先として試験誘導する価値がある。サイネージ・クーポン案を設計。",
    },
    {
      level: "low",
      badge: "中長期判断",
      title: "雨天時の屋内回遊施策を設計・優先検証",
      sub: "天気パターンと回遊データが揃えば、屋内モデルコースのABテストが可能になる。",
    },
  ];

  const DATA_STATUS = [
    { name: "鉄道・バス乗降", status: "ready" },
    { name: "箱根フリーパス", status: "ready" },
    { name: "Web/アプリ閲覧", status: "ready" },
    { name: "ロマンスカー予約", status: "confirm" },
    { name: "商業施設購買", status: "confirm" },
    { name: "クーポン/QR利用", status: "later" },
    { name: "キャンペーンID", status: "later" },
  ];

  // --- Screen 2: Data Fusion Map ---

  const FUSION_SOURCES = [
    { title: "鉄道・バス乗降", sub: "駅/停留所 × 時間帯 × 日次", status: "ready" },
    { title: "箱根フリーパス", sub: "券種 × 利用エリア × 日次", status: "ready" },
    { title: "ロマンスカー予約", sub: "発着 × 席種 × 時間帯", status: "confirm" },
    { title: "Web/アプリ閲覧", sub: "言語 × ページ × 検索語", status: "ready" },
    { title: "商業施設購買", sub: "施設 × カテゴリ × 時間帯", status: "confirm" },
    { title: "クーポン/QR", sub: "配布 × 表示 × 利用ID", status: "outside" },
  ];

  const FUSION_OUTPUTS = [
    { title: "回遊ファネル分析", sub: "流入→王道/非王道→消費の漏れを特定" },
    { title: "消費ギャップマップ", sub: "エリア別 流入vs消費の乖離を可視化" },
    { title: "AI施策カード生成", sub: "データギャップから施策仮説・KPI・検証方法" },
    { title: "意思決定コックピット", sub: "3KPIと重点判断を経営層が即理解できる形で" },
  ];

  const COMMON_KEYS_DATA = [
    { key: "time_bucket", example: "2026-04 / 週次 / 10-12時", purpose: "流入・消費・混雑を同じ時間軸で重ねる" },
    { key: "area_id", example: "箱根湯本 / 大涌谷 / 仙石原 / 強羅 / 小田原", purpose: "エリア単位でデータを揃えて比較する" },
    { key: "segment", example: "フリーパス券種 / 言語 / 旅行者タイプ", purpose: "誰に向けた施策かを分けて分析する" },
    { key: "campaign_id", example: "QR / クーポン / サイネージ / モデルコース", purpose: "施策前後で効果を測定・比較する" },
  ];

  const DATA_DECISIONS = [
    { source: "乗降データ", decision: "混雑・流入判断 → 分散施策のトリガーに使う" },
    { source: "フリーパス利用", decision: "周遊行動判断 → どのエリアを巡回しているか" },
    { source: "ロマンスカー予約", decision: "来訪前需要判断 → 高付加価値層の兆しを掴む" },
    { source: "Web/アプリ閲覧", decision: "関心と現地行動のズレ判断 → 未訪問エリアへの誘導機会" },
    { source: "購買/クーポン", decision: "消費転換判断 → 施策前後の効果比較に使う" },
  ];

  // --- Screen 3: Opportunity Map ---

  const AREAS = [
    {
      name: "箱根湯本",
      inflow: 92,
      conversion: 34,
      quadrant: "bl",
      priority: "p-a",
      priorityLabel: "最優先改善",
      dotClass: "priority-a",
      recommendation: "荷物・待ち時間・乗換前消費の改善を検証。流入は最大級だが消費転換が最も弱い。消費前の摩擦を取り除く施策からPoC開始を推奨。",
    },
    {
      name: "大涌谷",
      inflow: 88,
      conversion: 61,
      quadrant: "tr",
      priority: "p-b",
      priorityLabel: "維持・単価向上",
      dotClass: "priority-b",
      recommendation: "王道観光の中心で流入・消費ともに高い。単価向上と混雑ピーク分散を同時検討。高付加価値体験の開発余地がある。",
    },
    {
      name: "仙石原",
      inflow: 36,
      conversion: 68,
      quadrant: "tl",
      priority: "p-c",
      priorityLabel: "誘導強化",
      dotClass: "priority-c",
      recommendation: "王道混雑時の代替誘導先として最有力。少ない流入でも消費効率が高い。サイネージ・クーポンによる積極誘導の検証を推奨。",
    },
    {
      name: "強羅",
      inflow: 58,
      conversion: 30,
      quadrant: "bl",
      priority: "p-a",
      priorityLabel: "最優先改善",
      dotClass: "priority-a",
      recommendation: "体験・飲食・クーポン導線の改善を検証。移動はあるが消費につながっていない。体験予約への誘導ABテストが有効な仮説。",
    },
    {
      name: "小田原",
      inflow: 61,
      conversion: 44,
      quadrant: "bl",
      priority: "p-b",
      priorityLabel: "消費転換改善",
      dotClass: "priority-b",
      recommendation: "乗換客を街歩き・消費へ転換する施策を検討。乗換待ち時間15-30分の層が常時発生しており、短時間消費の導線設計余地がある。",
    },
  ];

  // --- Screen 4: AI Action Cards ---

  const ACTION_CARDS_DATA = [
    {
      category: "urgent",
      title: "箱根湯本: ゼロ摩擦回遊パック",
      purpose: "流入最大地点の消費転換を上げるべきか判断する",
      fact: "乗降データと購買記録を重ねると、箱根湯本の流入指数92に対して消費転換指数は34程度と推定。大型荷物・乗換待ち・情報不足が消費前離脱の要因仮説として浮かぶ。",
      hypothesis: "荷物預かり拠点 + 食べ歩きQR + 短時間散策マップをセットで提示することで、消費転換率が改善する。荷物摩擦の解消が先決という仮説。",
      validate: "QR読取率・クーポン利用率と対象エリア乗降の前後差分を比較（施策ID別）",
      dataNeeded: "乗降、購買、クーポン/QR",
      kpi: "消費転換指数 +6pt、食べ歩きQR利用率 20%以上",
      confidence: "AI仮説 / 要検証",
    },
    {
      category: "urgent",
      title: "大涌谷集中時: 代替先リアルタイム提示",
      purpose: "混雑時に代替エリアへの分散を促せるか判断する",
      fact: "王道集中指数72は「週末ピーク時に大涌谷・芦ノ湖方向に流入が偏っている」可能性を示す。混雑時間帯に代替スポットの認知が低い状況が推定される。",
      hypothesis: "混雑検知 → サイネージ/アプリで仙石原・強羅の代替ルートをリアルタイム提示 → 分散行動を促せる。",
      validate: "提示前後の大涌谷 vs 仙石原・強羅の乗降比率変化",
      dataNeeded: "乗降、Web/アプリ、クーポン",
      kpi: "王道集中指数 -5pt、代替先到達率 +8%",
      confidence: "AI仮説 / 要検証",
    },
    {
      category: "innovation",
      title: "仙石原: プレミアム分散導線",
      purpose: "王道混雑の代替先として、高消費効率エリアへの誘導価値を判断する",
      fact: "仙石原は流入指数36に対して消費転換指数68と推定。訪問者あたりの消費効率が相対的に高い可能性があり、分散先として有力。",
      hypothesis: "ロマンスカー予約完了画面・サイネージで「空いていて価値が高い代替先」として仙石原を訴求すると、高単価層の誘導ができる。",
      validate: "対象チャネル経由の仙石原乗降変化と購買額の前後比較",
      dataNeeded: "乗降、ロマンスカー、購買",
      kpi: "仙石原来訪指数 +12%、客単価指数変化",
      confidence: "AI仮説 / 要検証",
    },
    {
      category: "innovation",
      title: "雨天時: 屋内回遊ルート自動提示",
      purpose: "雨天時の滞在満足度と消費転換を上げるべきか判断する",
      fact: "天気データと乗降パターンを重ねると、雨天日には屋外スポット集中が下がり駅周辺滞留が増える想定。Web閲覧でも屋内系コンテンツへのシフトが仮定される。",
      hypothesis: "雨天時に美術館・温泉・カフェを組み合わせた半日ルートをQR/アプリで自動提示すると、分散と消費が改善する。",
      validate: "QR導線別の閲覧率・クーポン利用率・雨天日の回遊先変化を比較",
      dataNeeded: "天気、Web閲覧、QR、クーポン、乗降",
      kpi: "消費転換指数 +10pt、代替ルート閲覧率 15%以上",
      confidence: "AI仮説 / 要検証",
    },
    {
      category: "steady",
      title: "強羅: 体験クーポンABテスト",
      purpose: "体験予約への誘導で強羅の消費転換を改善できるか判断する",
      fact: "強羅の流入指数58に対して消費転換指数は30程度と推定。移動はあるが消費につながっていない。体験・飲食・土産の導線が弱い可能性。",
      hypothesis: "体験予約（工芸・温泉・アクティビティ）への誘導クーポンを2案準備し14日ABテストを行うと、購買転換の差が見える。",
      validate: "クーポン利用率・強羅周辺購買額の前後比較",
      dataNeeded: "乗降、クーポン、購買",
      kpi: "クーポン利用率 10%以上、購買転換指数 +5pt",
      confidence: "AI仮説 / 要検証",
    },
    {
      category: "steady",
      title: "インバウンド: 多言語モデルコース最適化",
      purpose: "Web閲覧の言語比からインバウンド誘客の改善余地を判断する",
      fact: "Web/アプリ閲覧の言語比率と実際の乗降・購買データを重ねると、言語ごとに「関心はあるが来ていないエリア」が異なる可能性がある。",
      hypothesis: "英語・繁体字・タイ語の閲覧者に最適化したモデルコースを表示することで、外国語圏の来訪転換率と現地消費が改善する。",
      validate: "外国語閲覧→フリーパス購買の転換率変化・外国語クーポン利用率",
      dataNeeded: "Web/アプリ、チケット、クーポン",
      kpi: "外国語閲覧→来訪転換率 +8%、外国語クーポン利用率向上",
      confidence: "AI仮説 / 要検証",
    },
    {
      category: "steady",
      title: "小田原: 乗換客の短時間消費導線",
      purpose: "乗換待ち時間を活用した短時間消費の改善余地を判断する",
      fact: "小田原の乗換接続データを見ると、待ち時間15〜30分の層が常時発生していると推定される。この時間を活用した消費が現状では弱い。",
      hypothesis: "改札外サイネージ + 提携店クーポンで短時間消費への動線を設計すると、乗換客の街区流入と購買が改善する。",
      validate: "改札外サイネージ設置前後の街区乗降・提携店利用率比較",
      dataNeeded: "乗降、購買、クーポン",
      kpi: "乗換客の街区流入率 +5pt、提携店クーポン利用率",
      confidence: "AI仮説 / 要検証",
    },
  ];

  const CARD_STRUCTURE = [
    { field: "判断目的", layer: "fact", layerLabel: "事実ベース", desc: "この施策で「何を判断するか」を最初に明示。分析で終わらず意思決定に接続する。" },
    { field: "根拠となる事実", layer: "fact", layerLabel: "事実ベース", desc: "集計データから読み取れる事実・傾向。断定ではなく「推定」「可能性」で表現。" },
    { field: "AI仮説", layer: "ai", layerLabel: "AI生成", desc: "事実ギャップから導いた施策案。検証すべき仮説として提示。原因断定なし。" },
    { field: "検証方法", layer: "verify", layerLabel: "要検証", desc: "何を比較すれば仮説が確認できるか。施策IDで前後比較する設計。" },
    { field: "必要データ", layer: "fact", layerLabel: "事実ベース", desc: "この施策検証に必要なデータ種別。PoC開始時の受領計画に使う。" },
    { field: "成功KPI", layer: "verify", layerLabel: "要検証", desc: "仮説を「検証済み」にするための定量指標。目標値は仮設定・要調整。" },
    { field: "信頼度ラベル", layer: "ai", layerLabel: "AI仮説", desc: "事実 / 推定 / AI仮説 / 要検証 の4段階で情報の確度を明示する。" },
  ];

  // --- Screen 5: PoC Plan ---

  const POC_STEPS = [
    {
      week: "Week 1–2",
      title: "データ受領・粒度確認",
      desc: "乗降・フリーパス・Web閲覧など取得しやすいデータを優先受領。粒度・フォーマット・匿名化要件を確認。完全データを待たず、取得済みのものから着手。",
      active: true,
    },
    {
      week: "Week 2–3",
      title: "エリア × 時間軸で統合",
      desc: "S3に集約 → Glue/Athenaで共通キー（time_bucket × area_id × segment）に正規化・統合。個人IDは使わず集計単位で処理。",
      active: false,
    },
    {
      week: "Week 3–4",
      title: "回遊・消費・関心ギャップ分析",
      desc: "3KPI（王道集中・消費ギャップ・分散余地）を算出。エリア別マトリクスと機会マップを生成。ヒートマップで打ち手ポイントを特定。",
      active: false,
    },
    {
      week: "Week 4–5",
      title: "AI施策カード生成",
      desc: "分析ギャップをBedrockに渡し、施策仮説・KPI案・検証方法・根拠データをカード形式で生成。事実とAI仮説を明示的に分離。",
      active: false,
    },
    {
      week: "Week 5–6",
      title: "小田急担当者レビュー",
      desc: "コックピット画面で3KPIと重点判断を確認。施策カードを担当者がスクリーニングし、優先順位を付ける。社内説明資料として活用。",
      active: false,
    },
    {
      week: "Week 7–8",
      title: "検証施策の選定と本格導入計画",
      desc: "検証する施策を2〜3件に絞り込み、KPI・予算・担当・スケジュールを確定。本格導入のロードマップを作成。",
      active: false,
    },
  ];

  const POC_DATA = [
    { name: "乗降データ（鉄道・バス）", prio: "p1", prioLabel: "必須 / 第1弾" },
    { name: "箱根フリーパス利用", prio: "p1", prioLabel: "必須 / 第1弾" },
    { name: "Web/アプリ閲覧ログ", prio: "p1", prioLabel: "必須 / 第1弾" },
    { name: "ロマンスカー予約データ", prio: "p2", prioLabel: "重要 / 第2弾" },
    { name: "商業施設購買データ", prio: "p2", prioLabel: "重要 / 第2弾" },
    { name: "クーポン/QR利用ログ", prio: "p3", prioLabel: "後追い可" },
    { name: "キャンペーンIDログ", prio: "p3", prioLabel: "後追い可" },
  ];

  const DELIVERABLES = [
    { icon: "◈", name: "意思決定ダッシュボード", desc: "3KPI + 重点判断 + エリアマトリクスを1画面で" },
    { icon: "↑", name: "施策優先度リスト", desc: "エリア別の最優先改善・誘導強化・維持リスト" },
    { icon: "✦", name: "AI施策カード（2〜5件）", desc: "根拠・仮説・KPI・検証方法セット" },
    { icon: "✓", name: "PoC検証KPI設計", desc: "施策IDで前後比較できる測定設計" },
    { icon: "▶", name: "本格導入ロードマップ", desc: "段階的な導入計画と必要データ整理" },
  ];

  const TECH_STACK = [
    { name: "Amazon S3", role: "データレイク（raw/processed/output）" },
    { name: "AWS Glue / Athena", role: "ETL・正規化・SQL横断分析" },
    { name: "Amazon Bedrock", role: "施策仮説・KPI案・根拠の生成" },
    { name: "Step Functions", role: "取込→集計→AI生成のワークフロー" },
    { name: "Next.js Dashboard", role: "コックピット画面の表示基盤" },
    { name: "Tradfit", role: "施策カード・KPI・ガント管理UI" },
  ];

  // =========================================================
  // HELPERS
  // =========================================================

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k === "style") node.setAttribute("style", v);
        else if (k.startsWith("on") && typeof v === "function") {
          node.addEventListener(k.slice(2), v);
        } else if (v != null) {
          node.setAttribute(k, v);
        }
      });
    }
    if (children != null) {
      const arr = Array.isArray(children) ? children : [children];
      arr.forEach((c) => {
        if (c == null) return;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
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

  function badge(type, text) {
    return el("span", { class: "badge " + type }, text);
  }

  // =========================================================
  // SCREEN 1: Executive Cockpit
  // =========================================================

  function renderKpiRow() {
    const row = el("div", { class: "kpi-row" });
    KPI_CARDS.forEach((k) => {
      const card = el("div", { class: "kpi-card " + k.type });
      card.appendChild(el("div", { class: "kpi-card-eyebrow" }, k.eyebrow));
      card.appendChild(el("div", { class: "kpi-card-label" }, k.label));
      const scoreRow = el("div", { class: "kpi-score-row" });
      scoreRow.appendChild(el("span", { class: "kpi-score" }, String(k.score)));
      scoreRow.appendChild(el("span", { class: "kpi-score-denom" }, "/ " + k.denom));
      card.appendChild(scoreRow);
      const bar = el("div", { class: "kpi-score-bar" });
      const fill = el("div", { class: "kpi-score-fill", style: "width:0%" });
      bar.appendChild(fill);
      card.appendChild(bar);
      card.appendChild(el("div", { class: "kpi-decision", html: k.decision }));
      row.appendChild(card);
      // Animate bar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.width = k.score + "%";
          fill.style.transition = "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        });
      });
    });
    mount("kpi-row", row);
  }

  function renderDataInsights() {
    const list = el("div", { class: "insight-list" });
    DATA_INSIGHTS.forEach((d) => {
      const item = el("div", { class: "insight-item" });
      item.appendChild(el("div", { class: "insight-icon " + d.color }, d.icon));
      const body = el("div", { class: "insight-body" });
      body.appendChild(el("div", { class: "insight-title" }, d.title));
      body.appendChild(el("div", { class: "insight-desc" }, d.desc));
      const tags = el("div", { class: "insight-tags" });
      d.tags.forEach(([type, text]) => tags.appendChild(badge(type, text)));
      body.appendChild(tags);
      item.appendChild(body);
      list.appendChild(item);
    });
    mount("data-insights", list);
  }

  function renderBiDiff() {
    const table = el("table", { class: "bidiff-table" });
    table.appendChild(el("thead", null, [
      el("tr", null, [
        el("th", null, "既存BI / 旧アプローチ"),
        el("th", null, "このPoCの差別化"),
      ]),
    ]));
    const tbody = el("tbody");
    BI_DIFF.forEach((row) => {
      tbody.appendChild(el("tr", null, [
        el("td", { class: "td-old" }, row.old),
        el("td", { class: "td-new" }, row.newv),
      ]));
    });
    table.appendChild(tbody);
    mount("bi-diff", table);
  }

  function renderWeeklyFocus() {
    const list = el("div", { class: "focus-list" });
    WEEKLY_FOCUS.forEach((f) => {
      const item = el("div", { class: "focus-item " + f.level });
      item.appendChild(el("div", { class: "focus-badge" }, f.badge));
      item.appendChild(el("div", { class: "focus-title" }, f.title));
      item.appendChild(el("div", { class: "focus-sub" }, f.sub));
      list.appendChild(item);
    });
    mount("weekly-focus", list);
  }

  function renderDataStatus() {
    const list = el("div", { class: "data-status-list" });
    const statusLabel = { ready: "取得可能", confirm: "要確認", later: "後追い" };
    DATA_STATUS.forEach((d) => {
      const item = el("div", { class: "data-status-item" });
      item.appendChild(el("span", { class: "ds-name" }, d.name));
      item.appendChild(el("span", { class: "ds-status " + d.status }, statusLabel[d.status]));
      list.appendChild(item);
    });
    mount("data-status", list);
  }

  // =========================================================
  // SCREEN 2: Data Fusion Map
  // =========================================================

  function renderFusionDiagram() {
    const wrap = el("div", { class: "fusion-diagram" });
    const centerRow = el("div", { class: "fusion-center-row" });

    // Sources
    const sourcesCol = el("div", { class: "fusion-sources" });
    FUSION_SOURCES.forEach((s) => {
      const card = el("div", { class: "fusion-source-card" });
      card.appendChild(el("div", { class: "fcard-title" }, s.title));
      card.appendChild(el("div", { class: "fcard-sub" }, s.sub));
      const statusLabel = { ready: "取得可能", confirm: "要確認", outside: "PoC対象外" };
      card.appendChild(el("span", { class: "fcard-status " + s.status }, statusLabel[s.status]));
      sourcesCol.appendChild(card);
    });
    centerRow.appendChild(sourcesCol);

    // Hub
    const hub = el("div", { class: "fusion-hub" });
    const hubInner = el("div", { class: "fusion-hub-inner" });
    hubInner.appendChild(el("div", { class: "hub-title" }, "統合レイヤー"));
    hubInner.appendChild(el("div", { class: "hub-name" }, "Data Fusion Hub"));
    hubInner.appendChild(el("div", { class: "hub-sub" }, "匿名・集計 / 個人特定なし"));
    const keys = el("div", { class: "hub-keys" });
    ["time_bucket", "area_id", "segment", "campaign_id"].forEach((k) => {
      keys.appendChild(el("div", { class: "hub-key" }, k));
    });
    hubInner.appendChild(keys);
    hub.appendChild(hubInner);
    centerRow.appendChild(hub);

    // Outputs
    const outputsCol = el("div", { class: "fusion-outputs" });
    FUSION_OUTPUTS.forEach((o) => {
      const card = el("div", { class: "fusion-output-card" });
      card.appendChild(el("div", { class: "fcard-title" }, o.title));
      card.appendChild(el("div", { class: "fcard-sub" }, o.sub));
      outputsCol.appendChild(card);
    });
    centerRow.appendChild(outputsCol);

    wrap.appendChild(centerRow);
    mount("fusion-diagram", wrap);
  }

  function renderCommonKeys() {
    const table = el("table", { class: "keys-table" });
    table.appendChild(el("thead", null, [
      el("tr", null, [
        el("th", null, "統合キー"),
        el("th", null, "値の例"),
        el("th", null, "意思決定への用途"),
      ]),
    ]));
    const tbody = el("tbody");
    COMMON_KEYS_DATA.forEach((k) => {
      tbody.appendChild(el("tr", null, [
        el("td", null, [el("span", { class: "key-mono" }, k.key)]),
        el("td", { class: "key-example" }, k.example),
        el("td", { class: "key-purpose" }, k.purpose),
      ]));
    });
    table.appendChild(tbody);
    mount("common-keys", table);
  }

  function renderDataDecisions() {
    const list = el("div", { class: "decision-list" });
    DATA_DECISIONS.forEach((d) => {
      const item = el("div", { class: "decision-item" });
      item.appendChild(el("div", { class: "dec-source" }, d.source));
      item.appendChild(el("div", { class: "dec-decision" }, d.decision));
      list.appendChild(item);
    });
    mount("data-decisions", list);
  }

  // =========================================================
  // SCREEN 3: Opportunity Map
  // =========================================================

  function renderOppMatrix() {
    const container = el("div", { class: "matrix-container" });

    const grid = el("div", { class: "matrix-grid" });

    // Quadrants
    const quadrants = el("div", { class: "matrix-quadrants" });

    const quadData = [
      { cls: "q-tl", label: "誘導強化", sublabel: "流入小 × 消費大\n分散先として誘導を強化" },
      { cls: "q-tr", label: "維持・単価向上", sublabel: "流入大 × 消費大\n現状維持 + 高単価化" },
      { cls: "q-bl", label: "最優先改善", sublabel: "流入小 × 消費小\n現状維持・優先度低" },
      { cls: "q-br", label: "最優先改善", sublabel: "流入大 × 消費小\n消費転換の最優先改善対象" },
    ];

    quadData.forEach((q) => {
      const qEl = el("div", { class: "quadrant " + q.cls });
      qEl.appendChild(el("div", { class: "quadrant-label" }, q.label));
      qEl.appendChild(el("div", { class: "quadrant-sublabel" }, q.sublabel));
      quadrants.appendChild(qEl);
    });

    // Area dots positioned on quadrants
    const dotPositions = [
      { area: "箱根湯本", q: "br", left: "75%", top: "68%", cls: "priority-a" },
      { area: "大涌谷",  q: "tr", left: "72%", top: "28%", cls: "priority-b" },
      { area: "仙石原",  q: "tl", left: "28%", top: "35%", cls: "priority-c" },
      { area: "強羅",    q: "br", left: "52%", top: "72%", cls: "priority-a" },
      { area: "小田原",  q: "br", left: "60%", top: "55%", cls: "priority-b" },
    ];
    const abbreviate = { "箱根湯本": "湯本", "大涌谷": "大涌谷", "仙石原": "仙石原", "強羅": "強羅", "小田原": "小田原" };

    const dotsWrap = el("div", { style: "position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;" });
    quadrants.style.position = "relative";
    dotPositions.forEach((d) => {
      const dot = el("div", {
        class: "area-dot " + d.cls,
        style: `position:absolute;left:${d.left};top:${d.top};transform:translate(-50%,-50%);pointer-events:all;`,
        title: d.area,
      }, abbreviate[d.area] || d.area);
      quadrants.appendChild(dot);
    });

    grid.appendChild(quadrants);

    // X-axis
    const axisX = el("div", { class: "matrix-axis-x" });
    axisX.appendChild(el("span", null, "流入 小"));
    axisX.appendChild(el("span", null, "← 流入指数 →"));
    axisX.appendChild(el("span", null, "流入 大"));
    grid.appendChild(axisX);
    grid.appendChild(el("div", { class: "matrix-axis-label-x" }, "流入指数（DEMO / 0-100）"));

    container.appendChild(
      el("div", { style: "display:flex;align-items:center;gap:6px;margin-bottom:8px" }, [
        el("div", {
          style: "writing-mode:vertical-rl;transform:rotate(180deg);font-size:10.5px;font-weight:700;color:var(--muted-2);white-space:nowrap;margin-right:4px;"
        }, "消費転換指数"),
        grid,
      ])
    );

    // Legend
    const legend = el("div", { style: "display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;font-size:11px;" });
    [
      { cls: "priority-a", label: "最優先改善" },
      { cls: "priority-b", label: "維持/改善" },
      { cls: "priority-c", label: "誘導強化" },
    ].forEach(({ cls, label }) => {
      const item = el("div", { style: "display:flex;align-items:center;gap:5px;color:var(--muted);" });
      item.appendChild(el("span", { class: "area-dot " + cls, style: "position:relative;width:16px;height:16px;font-size:0;" }));
      item.appendChild(el("span", null, label));
      legend.appendChild(item);
    });
    container.appendChild(legend);

    mount("opp-matrix", container);
  }

  function renderAreaCards() {
    const list = el("div", { class: "area-card-list" });
    AREAS.forEach((a) => {
      const card = el("div", { class: "area-card " + a.priority });
      const header = el("div", { class: "area-card-header" });
      header.appendChild(el("div", { class: "area-name" }, a.name));
      header.appendChild(el("span", { class: "area-priority" }, a.priorityLabel));
      card.appendChild(header);
      const scores = el("div", { class: "area-scores" });
      const s1 = el("div", { class: "area-score-item" });
      s1.innerHTML = `<strong>${a.inflow}</strong>流入指数`;
      const s2 = el("div", { class: "area-score-item" });
      s2.innerHTML = `<strong>${a.conversion}</strong>消費転換`;
      scores.appendChild(s1);
      scores.appendChild(s2);
      card.appendChild(scores);
      card.appendChild(el("div", { class: "area-recommendation" }, a.recommendation));
      list.appendChild(card);
    });
    mount("area-cards", list);
  }

  // =========================================================
  // SCREEN 4: AI Action Cards
  // =========================================================

  let activeFilter = "all";

  const FILTERS = [
    { id: "all", label: "すべて" },
    { id: "urgent", label: "緊急検証" },
    { id: "innovation", label: "革新施策" },
    { id: "steady", label: "着実施策" },
  ];

  function renderActionFilterBar() {
    const bar = document.getElementById("action-filter-bar");
    if (!bar) return;
    bar.innerHTML = "";
    bar.appendChild(el("span", { class: "afb-label" }, "カテゴリ:"));
    FILTERS.forEach((f) => {
      const count = f.id === "all" ? ACTION_CARDS_DATA.length : ACTION_CARDS_DATA.filter((c) => c.category === f.id).length;
      const btn = el("button", {
        class: "afb-btn" + (f.id === activeFilter ? " active" : ""),
        "data-cat": f.id,
        onclick: function () {
          activeFilter = f.id;
          renderActionFilterBar();
          renderActionCards();
        },
      }, [el("span", null, f.label), el("span", { class: "afb-count" }, "(" + count + ")")]);
      bar.appendChild(btn);
    });
  }

  function renderActionCards() {
    const list = activeFilter === "all"
      ? ACTION_CARDS_DATA
      : ACTION_CARDS_DATA.filter((c) => c.category === activeFilter);

    const grid = el("div", { class: "action-cards-grid" });
    list.forEach((a) => {
      const card = el("div", { class: "action-card cat-" + a.category });

      // Header
      const header = el("div", { class: "ac-header" });
      header.appendChild(el("div", { class: "ac-title" }, a.title));
      header.appendChild(el("span", { class: "ac-hypo-badge" }, "AI仮説"));
      card.appendChild(header);

      // Purpose
      card.appendChild(el("div", { class: "ac-purpose" }, "判断目的: " + a.purpose));

      // Fact + Hypothesis
      const fh = el("div", { class: "ac-fact-hypo" });
      const factEl = el("div", { class: "ac-fact" });
      factEl.appendChild(el("span", { class: "ac-fact-label" }, "事実 / 推定"));
      factEl.appendChild(document.createTextNode(a.fact));
      fh.appendChild(factEl);
      const hypoEl = el("div", { class: "ac-hypo" });
      hypoEl.appendChild(el("span", { class: "ac-hypo-label" }, "AI仮説"));
      hypoEl.appendChild(document.createTextNode(a.hypothesis));
      fh.appendChild(hypoEl);
      card.appendChild(fh);

      // Meta grid
      const meta = el("div", { class: "ac-meta" });
      [
        ["検証方法", a.validate],
        ["必要データ", a.dataNeeded],
      ].forEach(([k, v]) => {
        const item = el("div", { class: "ac-meta-item" });
        item.appendChild(el("div", { class: "ac-meta-key" }, k));
        item.appendChild(el("div", { class: "ac-meta-val" }, v));
        meta.appendChild(item);
      });
      card.appendChild(meta);

      // KPI
      const kpiEl = el("div", { class: "ac-kpi" });
      kpiEl.appendChild(el("span", { class: "ac-kpi-label" }, "成功KPI"));
      kpiEl.appendChild(document.createTextNode(a.kpi));
      card.appendChild(kpiEl);

      // Footer
      const footer = el("div", { class: "ac-footer" });
      footer.appendChild(el("span", { class: "ac-confidence" }, a.confidence));
      card.appendChild(footer);

      grid.appendChild(card);
    });

    if (list.length === 0) {
      grid.appendChild(el("div", { class: "notice" }, "このカテゴリの仮説はまだありません。"));
    }
    mount("action-cards-grid", grid);
  }

  function renderCardStructure() {
    const table = el("table", { class: "cstruct-table" });
    table.appendChild(el("thead", null, [
      el("tr", null, [
        el("th", null, "施策カード項目"),
        el("th", null, "情報の種別"),
        el("th", null, "設計意図"),
      ]),
    ]));
    const tbody = el("tbody");
    CARD_STRUCTURE.forEach((row) => {
      tbody.appendChild(el("tr", null, [
        el("td", { class: "td-field" }, row.field),
        el("td", null, [el("span", { class: "td-layer " + row.layer }, row.layerLabel)]),
        el("td", null, row.desc),
      ]));
    });
    table.appendChild(tbody);
    mount("card-structure", table);
  }

  // =========================================================
  // SCREEN 5: PoC Plan
  // =========================================================

  function renderPocSteps() {
    const steps = el("div", { class: "poc-steps" });
    POC_STEPS.forEach((s) => {
      const step = el("div", { class: "poc-step" + (s.active ? " active" : "") });
      step.appendChild(el("div", { class: "poc-step-num" }, s.active ? "▶" : ""));
      const body = el("div", { class: "poc-step-body" });
      body.appendChild(el("div", { class: "poc-step-week" }, s.week));
      body.appendChild(el("div", { class: "poc-step-title" }, s.title));
      body.appendChild(el("div", { class: "poc-step-desc" }, s.desc));
      step.appendChild(body);
      steps.appendChild(step);
    });
    mount("poc-steps", steps);
  }

  function renderPocData() {
    const list = el("div", { class: "poc-data-list" });
    POC_DATA.forEach((d) => {
      const item = el("div", { class: "poc-data-item" });
      item.appendChild(el("span", { class: "poc-data-name" }, d.name));
      item.appendChild(el("span", { class: "poc-data-prio " + d.prio }, d.prioLabel));
      list.appendChild(item);
    });
    mount("poc-data", list);
  }

  function renderDeliverables() {
    const list = el("div", { class: "deliverable-list" });
    DELIVERABLES.forEach((d) => {
      const item = el("div", { class: "deliverable-item" });
      item.appendChild(el("div", { class: "deliverable-icon" }, d.icon));
      const body = el("div");
      body.appendChild(el("div", { class: "deliverable-name" }, d.name));
      body.appendChild(el("div", { class: "deliverable-desc" }, d.desc));
      item.appendChild(body);
      list.appendChild(item);
    });
    mount("poc-deliverables", list);
  }

  function renderTechStack() {
    const grid = el("div", { class: "tech-stack-grid" });
    TECH_STACK.forEach((t) => {
      const item = el("div", { class: "tech-item" });
      item.appendChild(el("div", { class: "tech-name" }, t.name));
      item.appendChild(el("div", { class: "tech-role" }, t.role));
      grid.appendChild(item);
    });
    mount("tech-stack", grid);
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  const SCREEN_LABELS = {
    cockpit: "Executive Cockpit",
    fusion: "Data Fusion Map",
    opportunity: "Opportunity Map",
    actions: "AI Action Cards",
    poc: "PoC Plan",
  };

  function bindNav() {
    const buttons = document.querySelectorAll(".nav-btn");
    const views = document.querySelectorAll(".view");
    const breadcrumb = document.getElementById("topbar-breadcrumb");

    buttons.forEach((btn) => {
      btn.addEventListener("click", function () {
        buttons.forEach((b) => b.classList.remove("active"));
        views.forEach((v) => v.classList.add("hidden"));
        btn.classList.add("active");
        const target = document.getElementById(btn.dataset.view);
        if (target) target.classList.remove("hidden");
        if (breadcrumb) breadcrumb.textContent = SCREEN_LABELS[btn.dataset.view] || "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function bindFilters() {
    document.querySelectorAll("[data-filter='month']").forEach((sel) => {
      sel.addEventListener("change", function () {
        document.querySelectorAll("[data-filter='month']").forEach((s) => (s.value = sel.value));
      });
    });
    document.querySelectorAll("[data-filter='area']").forEach((sel) => {
      sel.addEventListener("change", function () {
        document.querySelectorAll("[data-filter='area']").forEach((s) => (s.value = sel.value));
      });
    });
  }

  // =========================================================
  // BOOT
  // =========================================================

  document.addEventListener("DOMContentLoaded", function () {
    bindNav();
    bindFilters();

    // Screen 1
    renderKpiRow();
    renderDataInsights();
    renderBiDiff();
    renderWeeklyFocus();
    renderDataStatus();

    // Screen 2
    renderFusionDiagram();
    renderCommonKeys();
    renderDataDecisions();

    // Screen 3
    renderOppMatrix();
    renderAreaCards();

    // Screen 4
    renderActionFilterBar();
    renderActionCards();
    renderCardStructure();

    // Screen 5
    renderPocSteps();
    renderPocData();
    renderDeliverables();
    renderTechStack();
  });

})();
