---
layout: page
title: DXツール開発・提供 | LeadFive
description: 生成AIを活用した業務自動化/データ連携のDXツールを開発・提供。ワークフロー最適化と生産性向上を実現。
permalink: /services/dx-tools/
---

<style>
.svc-hero { text-align:center; padding:6rem 0; background:linear-gradient(135deg, rgba(59,130,246,.08), rgba(139,92,246,.06)); }
.svc-hero h1 { font-size:2.5rem; background:linear-gradient(135deg,#60a5fa,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin:2rem auto; max-width:900px; }
.metric { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:1.25rem; text-align:center; }
.metric .v { font-size:2rem; font-weight:900; color:#60a5fa; }
.section { max-width:1000px; margin:0 auto; padding:3rem 1rem; }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:2rem; }
.card { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:14px; padding:1.5rem; }
.cta { text-align:center; margin:3rem 0; }
.btn { display:inline-block; padding:1rem 2rem; border-radius:999px; text-decoration:none; font-weight:700; transition:.3s; }
.btn-primary { background:linear-gradient(135deg,#60a5fa,#8b5cf6); color:#fff; }
.relsvc { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
@media(max-width:768px){ .metrics{grid-template-columns:1fr;}.grid-2{grid-template-columns:1fr;} }
</style>

<section class="svc-hero">
  <div class="section">
    <h1>DXツール開発・提供</h1>
    <p>生成AI×内製ツールで、業務を自動化しボトルネックを解消。</p>
    <div class="metrics">
      <div class="metric"><div class="v">作業時間 -55%</div><div>自動化で大幅削減</div></div>
      <div class="metric"><div class="v">在庫 -35%</div><div>需要予測×在庫最適化</div></div>
      <div class="metric"><div class="v">納期 98%</div><div>遵守率の向上</div></div>
    </div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">開発内容</h2>
  <div class="grid-2">
    <div class="card"><h3>業務自動化</h3><p>RPA/スクリプト/生成AIで繰り返し作業を削減し、品質を安定化。</p></div>
    <div class="card"><h3>データ連携</h3><p>各種SaaS/基幹DB/スプレッドシートをAPIで統合、データ活用を推進。</p></div>
    <div class="card"><h3>カスタムUI</h3><p>現場で使いやすいUIを提供し、現場起点の改善サイクルを実現。</p></div>
    <div class="card"><h3>セキュリティ</h3><p>ログ/権限/監査に配慮した設計で、安心して全社展開。</p></div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">関連サービス</h2>
  <div class="relsvc">
    <a class="card" href="/services/marketing-support/">マーケティングサポート</a>
    <a class="card" href="/services/ai-adoption/">AI活用サポート</a>
    <a class="card" href="/services/web-sns-ads/">WEB/SNS広告サポート</a>
    <a class="card" href="/case-studies/">導入事例</a>
    <a class="card" href="/blog/">ブログ</a>
  </div>
</section>

<div class="cta">
  <a href="#" class="btn btn-primary" onclick="openContactForm();return false;">お問い合わせ</a>
  <a href="/case-studies/" class="btn" style="margin-left:.5rem; border:1px solid rgba(255,255,255,.2); color:#fff;">事例を見る</a>
  
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.metric,.card').forEach(el=>{
    gsap.from(el,{opacity:0,y:24,duration:.6,scrollTrigger:{trigger:el,start:'top 85%'},immediateRender:false});
  })
</script>

