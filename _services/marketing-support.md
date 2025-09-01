---
layout: page
title: マーケティングサポート | LeadFive
description: CVR改善、CPA最適化、LTV最大化まで一気通貫で支援。戦略設計から実装・計測・改善まで伴走するマーケティングサポート。
permalink: /services/marketing-support/
---

<style>
.svc-hero { text-align:center; padding:6rem 0; background:linear-gradient(135deg, rgba(139,92,246,.08), rgba(236,72,153,.06)); }
.svc-hero h1 { font-size:2.5rem; background:linear-gradient(135deg,#8b5cf6,#ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin:2rem auto; max-width:900px; }
.metric { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:1.25rem; text-align:center; }
.metric .v { font-size:2rem; font-weight:900; color:#8b5cf6; }
.section { max-width:1000px; margin:0 auto; padding:3rem 1rem; }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:2rem; }
.card { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:14px; padding:1.5rem; }
.cta { text-align:center; margin:3rem 0; }
.btn { display:inline-block; padding:1rem 2rem; border-radius:999px; text-decoration:none; font-weight:700; transition:.3s; }
.btn-primary { background:linear-gradient(135deg,#8b5cf6,#ec4899); color:#fff; }
.relsvc { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
@media(max-width:768px){ .metrics{grid-template-columns:1fr;}.grid-2{grid-template-columns:1fr;} }
</style>

<section class="svc-hero">
  <div class="section">
    <h1>マーケティングサポート</h1>
    <p>戦略設計→実装→計測→改善を一気通貫。AI×心理学で売上最大化。</p>
    <div class="metrics">
      <div class="metric"><div class="v">CVR +128%</div><div>LP最適化で大幅改善</div></div>
      <div class="metric"><div class="v">CPA -36%</div><div>配信最適化で獲得単価抑制</div></div>
      <div class="metric"><div class="v">LTV +22%</div><div>ナーチャリング強化</div></div>
    </div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">提供内容</h2>
  <div class="grid-2">
    <div class="card"><h3>戦略設計</h3><p>市場/競合/心理インサイトを分析し、KPIと戦略を設計。</p></div>
    <div class="card"><h3>実装支援</h3><p>LP/広告/CRM/MAの実装とワークフロー整備を実行。</p></div>
    <div class="card"><h3>計測と可視化</h3><p>計測設計、ダッシュボード化、改善サイクルの高速化。</p></div>
    <div class="card"><h3>成長の仕組み化</h3><p>AI活用で運用を自動化/半自動化し、継続的な改善を実現。</p></div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">関連サービス</h2>
  <div class="relsvc">
    <a class="card" href="/services/dx-tools/">DXツール開発・提供</a>
    <a class="card" href="/services/ai-adoption/">AI活用サポート</a>
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
