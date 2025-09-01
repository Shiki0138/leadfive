---
layout: page
title: AI活用サポート | LeadFive
description: 生成AIの活用設計から運用定着まで。プロンプト設計、ガバナンス、教育/トレーニングで成果につなげるAI活用サポート。
permalink: /services/ai-adoption/
---

<style>
.svc-hero { text-align:center; padding:6rem 0; background:linear-gradient(135deg, rgba(16,185,129,.08), rgba(139,92,246,.06)); }
.svc-hero h1 { font-size:2.5rem; background:linear-gradient(135deg,#10b981,#8b5cf6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin:2rem auto; max-width:900px; }
.metric { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:1.25rem; text-align:center; }
.metric .v { font-size:2rem; font-weight:900; color:#10b981; }
.section { max-width:1000px; margin:0 auto; padding:3rem 1rem; }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:2rem; }
.card { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:14px; padding:1.5rem; }
.cta { text-align:center; margin:3rem 0; }
.btn { display:inline-block; padding:1rem 2rem; border-radius:999px; text-decoration:none; font-weight:700; transition:.3s; }
.btn-primary { background:linear-gradient(135deg,#10b981,#8b5cf6); color:#fff; }
.relsvc { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
@media(max-width:768px){ .metrics{grid-template-columns:1fr;}.grid-2{grid-template-columns:1fr;} }
</style>

<section class="svc-hero">
  <div class="section">
    <h1>AI活用サポート</h1>
    <p>使えるAIを現場に定着。ルール/教育/ガイドで成果に直結。</p>
    <div class="metrics">
      <div class="metric"><div class="v">導入 90日</div><div>活用ルール/教育を実装</div></div>
      <div class="metric"><div class="v">工数 -40%</div><div>文章作成/分析を効率化</div></div>
      <div class="metric"><div class="v">満足度 98%</div><div>社内定着度の向上</div></div>
    </div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">支援内容</h2>
  <div class="grid-2">
    <div class="card"><h3>活用設計</h3><p>ユースケース整理/ROI試算/リスク管理を設計し、導入計画を策定。</p></div>
    <div class="card"><h3>プロンプト設計</h3><p>再現性の高いプロンプトテンプレートを整備し、ナレッジとして共有。</p></div>
    <div class="card"><h3>ガバナンス</h3><p>機密/著作権/出力レビューなどの運用ルールを定義し、安全な活用。</p></div>
    <div class="card"><h3>教育/研修</h3><p>現場研修/ワークショップでスキル定着。評価/改善の回し方も支援。</p></div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">関連サービス</h2>
  <div class="relsvc">
    <a class="card" href="/services/marketing-support/">マーケティングサポート</a>
    <a class="card" href="/services/dx-tools/">DXツール開発・提供</a>
    <a class="card" href="/services/web-sns-ads/">WEB/SNS広告サポート</a>
    <a class="card" href="/case-studies/">導入事例</a>
    <a class="card" href="/blog/">ブログ</a>
  </div>
</section>

<div class="cta">
  <a href="#" class="btn btn-primary" onclick="openContactForm();return false;">お問い合わせ</a>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);
  gsap.set('.metric,.card',{opacity:1});
  gsap.utils.toArray('.metric,.card').forEach(el=>{
    gsap.from(el,{y:24,duration:.6,scrollTrigger:{trigger:el,start:'top 85%'},immediateRender:false});
  })
</script>
