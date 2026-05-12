// =========================================================
// Odakyu Tourism Intelligence PoC — Mock App
// All data on this file is anonymized/aggregated DEMO data.
// AI suggestions are framed as hypotheses to be validated.
// =========================================================

(function () {
  "use strict";

  // ---------- Demo data ----------
  const FILTERS = {
    month: "2026-04",
    area: "hakone",
  };

  const KPIS = [
    {
      key: "ridership",
      label: "箱根エリア推定流入（週次平均）",
      value: "128.4k",
      delta: { dir: "up", text: "+6.2% WoW" },
      foot: "鉄道・バス・ロマンスカー集計",
      badge: "DATA",
    },
    {
      key: "concentration",
      label: "王道集中率（大涌谷・芦ノ湖）",
      value: "61%",
      delta: { dir: "up", text: "+3.1pt" },
      foot: "全流入に対する王道シェア",
      badge: "DATA",
    },
    {
      key: "spend",
      label: "消費転換率（流入→購買/施設利用）",
      value: "27%",
      delta: { dir: "down", text: "-2.4pt" },
      foot: "商業施設・クーポン集計",
      badge: "DATA",
    },
    {
      key: "hypothesis",
      label: "AI生成 施策仮説（今月）",
      value: "12 件",
      delta: { dir: "flat", text: "仮説" },
      foot: "革新4 / 着実5 / 緊急3",
      badge: "AI",
    },
  ];

  const STAKEHOLDERS = [
    { role: "Data Owner", name: "小田急電鉄", value: "交通・チケット・購買・Web/アプリの既存ログを提供" },
    { role: "Product / UI", name: "Tradfit", value: "観光データダッシュボード、施策カード、KPI/ガント運用基盤" },
    { role: "AI / Analytics", name: "Cellmuller", value: "データ統合・特徴量・AI仮説生成・提案資料化" },
    { role: "Beneficiary", name: "沿線事業者", value: "回遊・分散・消費を伸ばす施策を受け取る" },
    { role: "Outcome", name: "旅行者", value: "混雑回避・適切な行き先・滞在価値の向上" },
  ];

  const REFRAME = [
    { from: "旧案: 接客入力・Hospitalia発話で観光ニーズを拾う", to: "新案: 既存データで回遊・消費・分散を可視化" },
    { from: "課題: 現場入力の協力と発話量に依存", to: "差別化: 部門横断・施策化までを一体で提供" },
    { from: "Tradfit: 発話データ提供者として位置づけ", to: "Tradfit: 施策運用ダッシュボード基盤として活用" },
    { from: "AI: 観光客の声を要約", to: "AI: 集計ギャップから施策仮説・KPI・検証方法を生成" },
  ];

  const SOURCES = [
    { owner: "Odakyu", name: "鉄道・バス乗降", grain: "駅/停留所 × 時間帯 × 日次", status: "ready", note: "回遊ファネルの基礎" },
    { owner: "Odakyu", name: "箱根フリーパス", grain: "券種 × 販売場所 × 利用エリア", status: "ready", note: "観光目的客のセグメント化" },
    { owner: "Odakyu", name: "ロマンスカー予約", grain: "発着 × 時間帯 × 席種", status: "req", note: "高付加価値層の兆し" },
    { owner: "Odakyu", name: "商業施設購買", grain: "施設 × カテゴリ × 時間帯", status: "req", note: "消費転換の評価" },
    { owner: "Odakyu", name: "Web/アプリ閲覧", grain: "言語 × ページ × 検索語", status: "ready", note: "旅行前関心とのギャップ" },
    { owner: "Odakyu", name: "クーポン / QR", grain: "配布・表示・利用ID", status: "opt", note: "施策効果の前後比較" },
    { owner: "Tradfit", name: "観光DB / 施策管理", grain: "施策 × KPI × ガント", status: "ready", note: "施策運用UIの提供" },
    { owner: "Cellmuller", name: "AI分析レイヤー", grain: "仮説 × 根拠 × KPI 雛形", status: "ready", note: "仮説生成と提案化" },
  ];

  const COMMON_KEYS = [
    { key: "time_bucket", ex: "2026-04 / 週次 / 10-12時", purpose: "流入・消費・混雑を時間軸で重ねる" },
    { key: "area_id", ex: "箱根湯本 / 大涌谷 / 仙石原 / 強羅 / 小田原", purpose: "場所単位でデータを揃える" },
    { key: "segment_id", ex: "券種 / 言語 / 国籍proxy / 旅行者タイプ", purpose: "誰に近い行動かを比較する" },
    { key: "campaign_id", ex: "QR / クーポン / サイネージ / モデルコース", purpose: "施策前後で効果を見る" },
  ];

  const PROCESS = [
    { n: 1, t: "正規化", d: "駅名・施設名・カテゴリの揺れを統一。匿名集計のみ。" },
    { n: 2, t: "集計化", d: "個人IDではなく time × area × segment へ畳む。" },
    { n: 3, t: "特徴量", d: "王道集中率 / 非王道率 / 消費転換 / 施策反応率を作る。" },
  ];

  const FUNNEL = [
    { label: "推定流入", value: "128k", sub: "新宿・小田原・湯本ゲート合算" },
    { label: "箱根湯本到達", value: "82k", sub: "主要ゲートウェイ" },
    { label: "王道ルート", value: "61%", sub: "大涌谷・芦ノ湖方向" },
    { label: "非王道回遊", value: "18%", sub: "強羅・仙石原・温泉街" },
    { label: "消費転換", value: "27%", sub: "購買 / 施設 / クーポン" },
  ];

  const HEATMAP = [
    { area: "箱根湯本", inflow: "high", roam: "mid", spend: "low", priority: "high" },
    { area: "大涌谷", inflow: "high", roam: "high", spend: "mid", priority: "mid" },
    { area: "仙石原", inflow: "low", roam: "mid", spend: "mid", priority: "high" },
    { area: "強羅", inflow: "mid", roam: "mid", spend: "low", priority: "high" },
    { area: "小田原", inflow: "mid", roam: "low", spend: "mid", priority: "mid" },
  ];
  const HM_LABEL = { low: "低", mid: "中", high: "高" };

  const FUNNEL_INSIGHTS = [
    {
      title: "箱根湯本: 流入は多いが消費転換が弱い",
      caption: "到達数は最大級だが、購買/施設利用へ接続していない。荷物・待ち時間・乗換導線が摩擦の可能性。",
      pills: [["red", "消費転換 -51"], ["gold", "ボトルネック"]],
      level: "danger",
    },
    {
      title: "仙石原: 流入は少ないが購買が相対的に強い",
      caption: "王道混雑時の代替先として誘導検証の価値あり。",
      pills: [["green", "分散候補"], ["blue", "AB検証可"]],
      level: "success",
    },
    {
      title: "強羅: 移動はあるが消費が伸びない",
      caption: "体験/飲食/クーポン連携で滞在時間×消費を伸ばせる余地。",
      pills: [["gold", "回遊→消費"], ["purple", "高単価素材"]],
      level: "warning",
    },
  ];

  const CLUSTERS = [
    { name: "温泉街散策", score: 72, color: "var(--green)" },
    { name: "カフェ回遊", score: 58, color: "var(--teal)" },
    { name: "美術館・体験", score: 46, color: "var(--gold)" },
    { name: "夜間飲食", score: 38, color: "var(--red)" },
    { name: "高単価ショッピング", score: 31, color: "var(--purple)" },
  ];

  const ROUTE_HYPOTHESES = [
    {
      finding: "雨天日に強羅周辺の回遊が伸びる",
      crossed: "乗降 + 天気 + Web閲覧",
      hypothesis: "雨の日モデルコースをQRで提示",
      validate: "QR表示後の強羅・施設購買の前後差分",
    },
    {
      finding: "仙石原は流入少だが購買転換が高い",
      crossed: "乗降 + 購買 + クーポン",
      hypothesis: "王道混雑時の代替先として誘導",
      validate: "サイネージ・クーポン反応率と購買額",
    },
    {
      finding: "夜間飲食の検索は多いが移動が弱い",
      crossed: "Web + 乗降 + 購買",
      hypothesis: "夜間回遊バス・飲食特典を検証",
      validate: "夜間乗降と飲食購買の前後比較",
    },
    {
      finding: "ロマンスカー利用後の沿線消費が低下",
      crossed: "ロマンスカー + 商業施設購買",
      hypothesis: "降車駅近接で短時間消費導線を出す",
      validate: "対象駅×時間帯の購買額の変化",
    },
  ];

  const SPEND_GAP = [
    { area: "箱根湯本", inflow: 92, spend: 41, gap: -51, note: "待ち時間・荷物・乗換で消費前に離脱" },
    { area: "大涌谷", inflow: 88, spend: 63, gap: -25, note: "集中はあるが消費余地あり" },
    { area: "仙石原", inflow: 36, spend: 54, gap: 18, note: "少ない流入でも消費が強い" },
    { area: "小田原", inflow: 61, spend: 49, gap: -12, note: "乗換客を街歩きへ転換したい" },
    { area: "強羅", inflow: 58, spend: 31, gap: -27, note: "体験/飲食/土産導線の設計余地" },
  ];

  const SPEND_ACTIONS = [
    {
      title: "箱根湯本: 荷物預かり + 食べ歩きQR",
      caption: "流入が多く消費が弱い場所。回遊前の摩擦を先に解消する。",
      pills: [["red", "消費転換"], ["blue", "QR"]],
      level: "danger",
    },
    {
      title: "仙石原: 王道混雑時の代替誘導",
      caption: "購買転換が高く、分散先として価値がある。",
      pills: [["green", "分散"], ["gold", "高単価"]],
      level: "success",
    },
    {
      title: "強羅: 体験クーポンのAB検証",
      caption: "移動はあるが消費が弱い。体験予約への誘導を検証。",
      pills: [["blue", "AB検証"], ["purple", "体験"]],
      level: "warning",
    },
  ];

  const SPEND_PIPELINE = [
    { t: "施策登録", n: "ID", d: "QR・サイネージ・クーポンに施策IDを付与" },
    { t: "表示/配布", n: "View", d: "どこで誰向けに出したかを記録" },
    { t: "反応", n: "Click", d: "QR読取・ページ閲覧・クーポン保存" },
    { t: "移動", n: "Move", d: "集計乗降で対象エリアへの変化を見る" },
    { t: "消費", n: "Pay", d: "購買・施設利用・クーポン利用に接続" },
  ];

  const ACTION_CARDS = [
    {
      category: "innovation",
      title: "箱根湯本ゼロ摩擦回遊パック",
      summary: "荷物預かり・食べ歩き・短時間散策をQRで一括案内。",
      rationale: "流入92 vs 消費41のギャップ最大地点。摩擦解消で消費接続を狙う。",
      target: "全国内客 / 11-15時 / 大型荷物の家族・カップル",
      execute: "QR×食べ歩き提携店30、荷物拠点2",
      kpis: ["消費転換 +6pt", "湯本-強羅の乗降比率"],
      tags: [["red", "消費転換"], ["blue", "QR"]],
      data: ["乗降", "購買", "Web"],
    },
    {
      category: "innovation",
      title: "仙石原プレミアム分散導線",
      summary: "王道混雑時、購買転換の高い仙石原へ誘導。",
      rationale: "流入36でも購買54の優良エリア。混雑外注の出口として最適。",
      target: "高単価券種 / 平日10-14時 / 英語・繁体字",
      execute: "サイネージ + ロマンスカー予約サイト掲載",
      kpis: ["大涌谷集中率 -3pt", "仙石原購買額 +12%"],
      tags: [["gold", "分散"], ["purple", "高単価"]],
      data: ["乗降", "ロマンスカー", "購買"],
    },
    {
      category: "steady",
      title: "雨天時モデルコース差し替え",
      summary: "天気とWeb閲覧を見て、雨の日の屋内・温泉・カフェ動線を自動表示。",
      rationale: "雨天日の強羅・温泉街クラスタが伸びる事象を再現可能化。",
      target: "降水確率60%以上の日 / 全エリア",
      execute: "公式アプリ + サイネージ + パートナーサイト",
      kpis: ["雨天日の非王道率 +5pt", "強羅購買 +8%"],
      tags: [["teal", "天気"], ["green", "回遊"]],
      data: ["Web", "乗降", "天気"],
    },
    {
      category: "steady",
      title: "強羅 体験クーポンABテスト",
      summary: "乗降はあるが購買が弱い地点で、体験予約へ誘導。",
      rationale: "流入58/消費31。体験素材の試行で消費構造の検証が可能。",
      target: "ファミリー / カップル / 平日午後",
      execute: "クーポン2案 × 14日テスト",
      kpis: ["クーポン利用率", "強羅購買額"],
      tags: [["blue", "AB検証"], ["gold", "体験"]],
      data: ["乗降", "クーポン", "購買"],
    },
    {
      category: "urgent",
      title: "大涌谷集中時の迂回表示",
      summary: "混雑が高い時間帯はサイネージ/QRで代替先を提示。",
      rationale: "王道集中率61%、ピーク時は仙石原・強羅の体験余地が浮く。",
      target: "土日10-12時 / 全旅行者",
      execute: "Webバナー + サイネージ + アプリPush",
      kpis: ["大涌谷の時間帯集中度", "代替先到達率"],
      tags: [["red", "混雑"], ["teal", "迂回"]],
      data: ["乗降", "Web", "クーポン"],
    },
    {
      category: "urgent",
      title: "小田原 乗換客の街歩き転換",
      summary: "乗換待ち時間がある層に短時間消費導線を提示。",
      rationale: "乗換接続待ち15-30分の層が常時発生。短時間消費を逃している。",
      target: "新幹線接続待ち層 / 平日終日",
      execute: "改札外サイネージ + 提携店クーポン",
      kpis: ["乗換客の街区流入", "提携店利用率"],
      tags: [["green", "短時間"], ["gold", "消費"]],
      data: ["乗降", "購買", "クーポン"],
    },
    {
      category: "innovation",
      title: "ロマンスカー降車駅 高単価導線",
      summary: "ロマンスカー利用者の沿線消費がやや落ちる事象に介入。",
      rationale: "ロマンスカー × 商業購買の相関が時期によって弱い時間帯あり。",
      target: "上位券種 / 14-17時 / 単独・カップル",
      execute: "予約完了画面 + 駅内サイネージ",
      kpis: ["対象駅近接の購買額", "再訪率"],
      tags: [["purple", "高単価"], ["blue", "予約導線"]],
      data: ["ロマンスカー", "購買"],
    },
    {
      category: "steady",
      title: "インバウンド向け多言語モデルコース",
      summary: "Web閲覧の言語比から、外国語クラスタへモデルコースを最適化。",
      rationale: "Web閲覧と現地流入の言語ギャップを縮める。",
      target: "英語 / 繁体字 / タイ語の閲覧者",
      execute: "Webサイト + アプリ + パートナーOTA",
      kpis: ["外国語閲覧→流入転換", "外国語クーポン利用"],
      tags: [["teal", "多言語"], ["green", "閲覧→来訪"]],
      data: ["Web", "クーポン", "チケット"],
    },
    {
      category: "urgent",
      title: "免税購買の伸びる時間帯告知",
      summary: "免税ピーク時間帯に近接店舗を即座に告知する。",
      rationale: "免税購買は時間帯偏在が大きい。情報出し方で取りこぼしを減らせる。",
      target: "外国語閲覧 / 14-18時",
      execute: "アプリPush + 店頭サイネージ",
      kpis: ["免税購買額", "免税回数"],
      tags: [["red", "緊急"], ["gold", "免税"]],
      data: ["購買", "Web"],
    },
  ];

  const ACTION_OUTPUT_FIELDS = [
    { k: "根拠", v: "どのデータのどのギャップから出た施策か", how: "Athena集計 + AI要約" },
    { k: "対象", v: "エリア・時間帯・券種/言語/セグメント", how: "特徴量テーブルから抽出" },
    { k: "実行案", v: "QR・サイネージ・クーポン・Web掲載・施設連携", how: "施策テンプレート + AI生成" },
    { k: "KPI", v: "乗降変化・購買額・クーポン利用・回遊率", how: "施策IDで前後比較" },
    { k: "次アクション", v: "誰が、いつまでに、何を行うか", how: "Tradfitダッシュボードの実行管理に反映" },
  ];

  const PIPELINE = [
    { stage: "Ingest", t: "1. 受領", d: "CSV/Parquet/API を S3 raw 層へ。月次手動アップロードでも可。" },
    { stage: "Normalize", t: "2. 整形", d: "Glue/Lambda で駅名・施設名・時間帯を正規化。" },
    { stage: "Integrate", t: "3. 統合", d: "Glue Data Catalog 登録、Athena 横断クエリ。" },
    { stage: "Features", t: "4. 特徴量", d: "回遊率・消費転換率・非王道率・反応率を生成。" },
    { stage: "Hypothesis", t: "5. AI生成", d: "Bedrock で示唆・施策カード・KPI 雛形を生成。" },
    { stage: "Surface", t: "6. 表示", d: "Next.js 観光ダッシュボードが S3 JSON/API から表示。" },
  ];

  const AWS_TABLE = [
    { svc: "S3", role: "raw / processed / output のデータレイク。月次 JSON も配置。" },
    { svc: "Glue Data Catalog", role: "スキーマ管理。Athena の横断クエリを支える。" },
    { svc: "Glue / Lambda", role: "ETL・正規化・特徴量生成。PoC は Lambda 中心でも可。" },
    { svc: "Athena", role: "S3 上を SQL 集計。探索分析と定期集計に使う。" },
    { svc: "Step Functions", role: "取り込み→集計→AI生成→出力をワークフロー化。" },
    { svc: "Bedrock (Claude / Nova)", role: "示唆・施策カード・KPI 案・説明文の生成。" },
    { svc: "Cognito / NextAuth", role: "既存ダッシュボードの認証を流用。" },
  ];

  const WEEKPLAN = [
    { w: "Week 1", t: "サンプルデータ定義", d: "出してほしい集計粒度を確定。難しければダミーで画面先行。" },
    { w: "Week 2", t: "S3 / Athena 集計", d: "CSV を S3 へ、Athena で回遊/消費/非王道指標を作る。" },
    { w: "Week 3", t: "AI 仮説生成", d: "集計を Bedrock へ渡し、施策カード・KPI・根拠を出す。" },
    { w: "Week 4", t: "ダッシュボード化", d: "Next.js に反映し、社内説明に使えるモックへ。" },
  ];

  const MAP_NODES = [
    { x: 10, y: 65, cls: "hot", label: "箱根湯本", sub: "流入多 / 消費弱" },
    { x: 42, y: 36, cls: "hot", label: "大涌谷", sub: "王道集中" },
    { x: 67, y: 25, cls: "good", label: "芦ノ湖", sub: "王道" },
    { x: 55, y: 72, cls: "gold", label: "仙石原", sub: "分散候補" },
    { x: 29, y: 75, cls: "good", label: "強羅", sub: "回遊→消費" },
    { x: 78, y: 60, cls: "", label: "小田原", sub: "乗換接続" },
  ];

  const MAP_LINES = [
    { x: 11, y: 62, w: 66, rot: -18, color: "#8a99a8" },
    { x: 40, y: 49, w: 35, rot: 34, color: "#8a99a8" },
    { x: 25, y: 69, w: 35, rot: 6, color: "var(--green)" },
    { x: 50, y: 72, w: 22, rot: -8, color: "var(--gold)" },
  ];

  // ---------- Helpers ----------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "style") node.setAttribute("style", attrs[k]);
        else if (k.startsWith("on") && typeof attrs[k] === "function") {
          node.addEventListener(k.slice(2), attrs[k]);
        } else if (attrs[k] !== undefined && attrs[k] !== null) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    if (children !== undefined && children !== null) {
      if (Array.isArray(children)) {
        children.forEach((c) => c && node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
      } else if (typeof children === "string") {
        node.textContent = children;
      } else {
        node.appendChild(children);
      }
    }
    return node;
  }
  function mount(id, content) {
    const host = document.getElementById(id);
    if (!host) return;
    host.innerHTML = "";
    if (Array.isArray(content)) content.forEach((c) => host.appendChild(c));
    else if (content) host.appendChild(content);
  }
  function pillsRow(pairs) {
    return el(
      "div",
      { class: "pill-row" },
      pairs.map(([cls, label]) => el("span", { class: "pill " + cls }, label))
    );
  }

  // ---------- Renderers ----------
  function renderKpiStrip() {
    const wrap = el("div", { class: "kpi-strip" });
    KPIS.forEach((k) => {
      const card = el("div", { class: "kpi-card" });
      card.appendChild(
        el("div", { class: "kpi-label" }, [
          el("span", null, k.label + "  "),
        ])
      );
      card.appendChild(el("div", { class: "kpi-value" }, k.value));
      const foot = el("div", { class: "kpi-foot" });
      foot.appendChild(
        el(
          "span",
          { class: "delta " + (k.delta.dir === "up" ? "up" : k.delta.dir === "down" ? "down" : "flat") },
          k.delta.text
        )
      );
      foot.appendChild(el("span", null, k.foot));
      if (k.badge) {
        const badge = el("span", { class: k.badge === "AI" ? "ai-badge" : "data-badge" }, k.badge);
        foot.appendChild(badge);
      }
      card.appendChild(foot);
      wrap.appendChild(card);
    });
    mount("kpi-strip", wrap);
  }

  function renderStakeholders() {
    const wrap = el("div", { class: "stakeholder" });
    STAKEHOLDERS.forEach((s) => {
      const c = el("div", { class: "stake" });
      c.appendChild(el("div", { class: "role" }, s.role));
      c.appendChild(el("b", null, s.name));
      c.appendChild(el("div", { class: "caption" }, s.value));
      wrap.appendChild(c);
    });
    mount("stakeholder-loop", wrap);
  }

  function renderReframe() {
    const tbody = el("tbody");
    REFRAME.forEach((r) => {
      tbody.appendChild(
        el("tr", null, [
          el("td", null, r.from),
          el("td", null, [el("b", null, r.to)]),
        ])
      );
    });
    const table = el("table", { class: "table" }, [
      el("thead", null, [
        el("tr", null, [el("th", null, "旧"), el("th", null, "今回のPoC")]),
      ]),
      tbody,
    ]);
    mount("reframe-table", table);
  }

  function renderSources() {
    const wrap = el("div", { class: "source-grid" });
    SOURCES.forEach((s) => {
      const node = el("div", { class: "source" });
      node.appendChild(
        el("div", { class: "source-head" }, [
          el("span", { class: "source-owner" }, s.owner),
          el(
            "span",
            { class: "source-status " + s.status },
            s.status === "ready" ? "活用可" : s.status === "req" ? "要相談" : "後追い"
          ),
        ])
      );
      node.appendChild(el("b", null, s.name));
      node.appendChild(el("div", { class: "source-grain" }, s.grain));
      node.appendChild(el("div", { class: "caption" }, s.note));
      wrap.appendChild(node);
    });
    mount("source-grid", wrap);
  }

  function renderCommonKeys() {
    const tbody = el("tbody");
    COMMON_KEYS.forEach((k) => {
      tbody.appendChild(
        el("tr", null, [
          el("td", null, [el("b", null, k.key)]),
          el("td", null, k.ex),
          el("td", null, k.purpose),
        ])
      );
    });
    const table = el("table", { class: "table" }, [
      el("thead", null, [
        el("tr", null, [el("th", null, "統合キー"), el("th", null, "例"), el("th", null, "目的")]),
      ]),
      tbody,
    ]);
    mount("common-keys", table);
  }

  function renderProcess() {
    const wrap = el("div", { class: "process-row" });
    PROCESS.forEach((p) => {
      const step = el("div", { class: "process-step" });
      step.appendChild(el("span", { class: "step-num" }, String(p.n)));
      step.appendChild(el("b", null, p.t));
      step.appendChild(el("div", { class: "caption" }, p.d));
      wrap.appendChild(step);
    });
    mount("process-row", wrap);
  }

  function renderFunnel() {
    const wrap = el("div", { class: "funnel" });
    FUNNEL.forEach((f) => {
      const step = el("div", { class: "funnel-step" });
      step.appendChild(el("div", { class: "label" }, f.label));
      step.appendChild(el("div", { class: "value" }, f.value));
      step.appendChild(el("div", { class: "sub" }, f.sub));
      wrap.appendChild(step);
    });
    mount("funnel", wrap);
  }

  function renderHeatmap() {
    const table = el("table", { class: "heatmap" });
    const thead = el("tr", null, [
      el("th", null, "場所"),
      el("th", null, "流入"),
      el("th", null, "回遊"),
      el("th", null, "購買"),
      el("th", null, "施策優先度"),
    ]);
    table.appendChild(thead);
    HEATMAP.forEach((row) => {
      table.appendChild(
        el("tr", null, [
          el("td", { class: "row-label" }, row.area),
          el("td", { class: "hm-" + row.inflow }, HM_LABEL[row.inflow]),
          el("td", { class: "hm-" + row.roam }, HM_LABEL[row.roam]),
          el("td", { class: "hm-" + row.spend }, HM_LABEL[row.spend]),
          el("td", { class: "hm-" + row.priority }, HM_LABEL[row.priority]),
        ])
      );
    });
    mount("heatmap", table);
  }

  function renderFunnelInsights() {
    const wrap = el("div");
    FUNNEL_INSIGHTS.forEach((ins) => {
      const card = el("div", { class: "action-card " + ins.level });
      card.appendChild(el("strong", null, ins.title));
      card.appendChild(el("div", { class: "caption" }, ins.caption));
      card.appendChild(pillsRow(ins.pills));
      wrap.appendChild(card);
    });
    mount("funnel-insights", wrap);
  }

  function renderMap() {
    const map = el("div", { class: "map" });
    MAP_LINES.forEach((ln) => {
      map.appendChild(
        el("div", {
          class: "line",
          style: `left:${ln.x}%;top:${ln.y}%;width:${ln.w}%;transform:rotate(${ln.rot}deg);background:${ln.color}`,
        })
      );
    });
    MAP_NODES.forEach((n) => {
      map.appendChild(
        el("div", { class: "station " + (n.cls || ""), style: `left:${n.x}%;top:${n.y}%` })
      );
      map.appendChild(
        el("div", { class: "station-label", style: `left:${n.x + 3}%;top:${n.y + 5}%` }, [
          el("span", null, n.label),
          el("b", null, n.sub),
        ])
      );
    });
    mount("route-map", map);
  }

  function renderClusters() {
    const wrap = el("div");
    CLUSTERS.forEach((c) => {
      const row = el("div", { class: "cluster-row" });
      row.appendChild(el("span", null, c.name));
      const bar = el("div", { class: "cluster-bar" });
      bar.appendChild(el("span", { style: `width:${c.score}%;background:${c.color}` }));
      row.appendChild(bar);
      row.appendChild(el("span", { class: "cluster-num" }, String(c.score)));
      wrap.appendChild(row);
    });
    mount("clusters", wrap);
  }

  function renderRouteHypotheses() {
    const tbody = el("tbody");
    ROUTE_HYPOTHESES.forEach((h) => {
      tbody.appendChild(
        el("tr", null, [
          el("td", null, [el("b", null, h.finding)]),
          el("td", null, h.crossed),
          el("td", null, h.hypothesis),
          el("td", null, h.validate),
        ])
      );
    });
    const table = el("table", { class: "table" }, [
      el("thead", null, [
        el("tr", null, [
          el("th", null, "発見（事実）"),
          el("th", null, "掛け合わせたデータ"),
          el("th", null, "AI仮説（要検証）"),
          el("th", null, "検証方法"),
        ]),
      ]),
      tbody,
    ]);
    mount("route-hypotheses", table);
  }

  function renderSpendGap() {
    const tbody = el("tbody");
    SPEND_GAP.forEach((row) => {
      const gap = row.gap;
      const cls = gap >= 10 ? "green" : gap <= -25 ? "red" : "gold";
      tbody.appendChild(
        el("tr", null, [
          el("td", null, [el("b", null, row.area)]),
          el("td", null, String(row.inflow)),
          el("td", null, String(row.spend)),
          el("td", null, [
            el("span", { class: "pill " + cls }, (gap >= 0 ? "+" : "") + gap),
          ]),
          el("td", null, row.note),
        ])
      );
    });
    const table = el("table", { class: "table" }, [
      el("thead", null, [
        el("tr", null, [
          el("th", null, "エリア"),
          el("th", null, "流入指数"),
          el("th", null, "購買指数"),
          el("th", null, "ギャップ"),
          el("th", null, "示唆"),
        ]),
      ]),
      tbody,
    ]);
    mount("spend-table", table);
  }

  function renderSpendActions() {
    const wrap = el("div");
    SPEND_ACTIONS.forEach((a) => {
      const card = el("div", { class: "action-card " + a.level });
      card.appendChild(el("strong", null, a.title));
      card.appendChild(el("div", { class: "caption" }, a.caption));
      card.appendChild(pillsRow(a.pills));
      wrap.appendChild(card);
    });
    mount("spend-actions", wrap);
  }

  function renderSpendPipeline() {
    const wrap = el("div", { class: "flow" });
    SPEND_PIPELINE.forEach((p) => {
      const c = el("div", { class: "flow-card" });
      c.appendChild(el("b", null, p.t));
      c.appendChild(el("div", { class: "num" }, p.n));
      c.appendChild(el("div", { class: "caption" }, p.d));
      wrap.appendChild(c);
    });
    mount("spend-pipeline", wrap);
  }

  // Action filter state
  const ACTION_FILTERS = [
    { id: "all", label: "すべて" },
    { id: "innovation", label: "革新案" },
    { id: "steady", label: "着実案" },
    { id: "urgent", label: "緊急対応案" },
  ];
  let currentActionFilter = "all";

  function renderActionFilter() {
    const wrap = el("div", { class: "action-filter" });
    ACTION_FILTERS.forEach((f) => {
      const count = f.id === "all" ? ACTION_CARDS.length : ACTION_CARDS.filter((c) => c.category === f.id).length;
      const btn = el(
        "button",
        {
          class: "action-filter-btn" + (f.id === currentActionFilter ? " active" : ""),
          "data-filter": f.id,
          onclick: function () {
            currentActionFilter = f.id;
            renderActionFilter();
            renderActionCards();
          },
        },
        [el("span", null, f.label), el("span", { class: "count" }, "(" + count + ")")]
      );
      wrap.appendChild(btn);
    });
    mount("action-filter", wrap);
  }

  function renderActionCards() {
    const wrap = el("div", { class: "action-grid" });
    const list =
      currentActionFilter === "all"
        ? ACTION_CARDS
        : ACTION_CARDS.filter((c) => c.category === currentActionFilter);
    list.forEach((a) => {
      const card = el("div", { class: "action-card large" });
      const head = el("header", null, [
        el("h4", null, a.title),
        el("span", { class: "ai-badge" }, "AI仮説"),
      ]);
      card.appendChild(head);
      card.appendChild(el("div", { class: "caption" }, a.summary));
      const meta = el("div", { class: "kpi-line" }, [
        el("span", null, [el("b", null, "根拠"), document.createTextNode(a.rationale)]),
        el("span", null, [el("b", null, "対象"), document.createTextNode(a.target)]),
        el("span", null, [el("b", null, "実行"), document.createTextNode(a.execute)]),
        el("span", null, [el("b", null, "KPI"), document.createTextNode(a.kpis.join(" / "))]),
      ]);
      card.appendChild(meta);
      const tags = el("div", { class: "pill-row", style: "margin-top:10px" });
      a.tags.forEach(([cls, label]) => tags.appendChild(el("span", { class: "pill " + cls }, label)));
      a.data.forEach((d) => tags.appendChild(el("span", { class: "pill outline" }, "#" + d)));
      card.appendChild(tags);
      wrap.appendChild(card);
    });
    if (list.length === 0) {
      wrap.appendChild(el("div", { class: "notice" }, "このカテゴリの仮説はまだありません。"));
    }
    mount("action-grid", wrap);
  }

  function renderActionOutputFields() {
    const tbody = el("tbody");
    ACTION_OUTPUT_FIELDS.forEach((r) => {
      tbody.appendChild(
        el("tr", null, [
          el("td", null, [el("b", null, r.k)]),
          el("td", null, r.v),
          el("td", null, r.how),
        ])
      );
    });
    const table = el("table", { class: "table" }, [
      el("thead", null, [
        el("tr", null, [el("th", null, "施策カードの構成項目"), el("th", null, "内容"), el("th", null, "生成方法")]),
      ]),
      tbody,
    ]);
    mount("action-output", table);
  }

  function renderPipeline() {
    const wrap = el("div", { class: "pipeline" });
    PIPELINE.forEach((p) => {
      const step = el("div", { class: "pipeline-step" });
      step.appendChild(el("span", { class: "stage" }, p.stage));
      step.appendChild(el("b", null, p.t));
      step.appendChild(el("div", { class: "caption" }, p.d));
      wrap.appendChild(step);
    });
    mount("pipeline", wrap);
  }

  function renderAwsTable() {
    const tbody = el("tbody");
    AWS_TABLE.forEach((r) => {
      tbody.appendChild(
        el("tr", null, [el("td", null, [el("b", null, r.svc)]), el("td", null, r.role)])
      );
    });
    const table = el("table", { class: "table" }, [
      el("thead", null, [el("tr", null, [el("th", null, "AWSサービス"), el("th", null, "役割")])]),
      tbody,
    ]);
    mount("aws-table", table);
  }

  function renderWeekplan() {
    const wrap = el("div");
    WEEKPLAN.forEach((w) => {
      const card = el("div", { class: "action-card" });
      card.appendChild(
        el("strong", null, [
          el("span", null, w.w + " — "),
          el("span", null, w.t),
        ])
      );
      card.appendChild(el("div", { class: "caption" }, w.d));
      wrap.appendChild(card);
    });
    mount("weekplan", wrap);
  }

  // ---------- Sidebar navigation ----------
  function bindNav() {
    const buttons = document.querySelectorAll(".nav-btn");
    const views = document.querySelectorAll(".view");
    buttons.forEach((b) => {
      b.addEventListener("click", function () {
        buttons.forEach((x) => x.classList.remove("active"));
        views.forEach((v) => v.classList.add("hidden"));
        b.classList.add("active");
        const target = document.getElementById(b.dataset.view);
        if (target) target.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // ---------- Toolbar (month / area) ----------
  function bindToolbar() {
    document.querySelectorAll("[data-filter='month']").forEach((sel) => {
      sel.value = FILTERS.month;
      sel.addEventListener("change", function () {
        FILTERS.month = sel.value;
        // mockだが、すべての月セレクトを同期させる
        document.querySelectorAll("[data-filter='month']").forEach((s) => (s.value = FILTERS.month));
      });
    });
    document.querySelectorAll("[data-filter='area']").forEach((sel) => {
      sel.value = FILTERS.area;
      sel.addEventListener("change", function () {
        FILTERS.area = sel.value;
        document.querySelectorAll("[data-filter='area']").forEach((s) => (s.value = FILTERS.area));
      });
    });
  }

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", function () {
    bindNav();
    bindToolbar();
    renderKpiStrip();
    renderStakeholders();
    renderReframe();
    renderSources();
    renderCommonKeys();
    renderProcess();
    renderFunnel();
    renderHeatmap();
    renderFunnelInsights();
    renderMap();
    renderClusters();
    renderRouteHypotheses();
    renderSpendGap();
    renderSpendActions();
    renderSpendPipeline();
    renderActionFilter();
    renderActionCards();
    renderActionOutputFields();
    renderPipeline();
    renderAwsTable();
    renderWeekplan();
  });
})();
