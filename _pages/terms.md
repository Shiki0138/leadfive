---
layout: page
title: 利用規約 | LeadFive
description: 本ウェブサイトのご利用にあたっての規約を定めています。
permalink: /terms/
---

<!-- Background video to align with case studies page -->
<div class="video-background">
  <video autoplay muted loop playsinline>
    <source src="{{ '/assets/videos/hero-background.mp4' | relative_url }}" type="video/mp4">
  </video>
</div>
<div class="video-overlay"></div>

<div class="case-studies-hero">
  <div class="container">
    <h1>利用規約</h1>
    <p>Terms of Service</p>
  </div>
  
</div>

<div class="container">
  <section class="legal-content">
    <p class="last-updated">最終更新日：{{ 'now' | date: '%Y年%-m月%-d日' }}</p>

    <div class="legal-section">
      <h2>1. 適用範囲</h2>
      <p>本利用規約（以下、「本規約」）は、合同会社LeadFive（以下、「当社」）が提供する本ウェブサイトの利用条件を定めるものです。ご利用にあたっては本規約に同意いただいたものとみなします。個別サービスに規約・ガイドライン等が定められている場合は、当該規約も併せて適用されます。</p>
    </div>

    <div class="legal-section">
      <h2>2. 禁止事項</h2>
      <ul>
        <li>法令または公序良俗に反する行為</li>
        <li>当社または第三者の権利・利益を侵害する行為</li>
        <li>本サイトの運営を妨害する行為（過度なアクセス、スパム等）</li>
        <li>虚偽の情報を送信する行為</li>
      </ul>
    </div>

    <div class="legal-section">
      <h2>3. 知的財産権</h2>
      <p>本サイトに掲載される文章、画像、デザイン、プログラム等の一切のコンテンツは、当社または権利者に帰属します。無断転載・複製・改変等を禁じます。</p>
    </div>

    <div class="legal-section">
      <h2>4. 免責事項</h2>
      <p>当社は、本サイトの内容の正確性・有用性・最新性等について保証しません。本サイトの利用により生じたいかなる損害についても、一切の責任を負いません。</p>
    </div>

    <div class="legal-section">
      <h2>5. リンク</h2>
      <p>本サイトから第三者のサイトへリンクされている場合、当該サイトの内容について当社は責任を負いません。リンク先の利用条件をご確認ください。</p>
    </div>

    <div class="legal-section">
      <h2>6. 規約の変更</h2>
      <p>当社は、必要に応じて本規約を変更することがあります。変更後の規約は本サイト上に掲載した時点で効力を生じます。</p>
    </div>

    <div class="legal-section">
      <h2>7. 準拠法・管轄</h2>
      <p>本規約は日本法に準拠し、本サイトに関して生じる紛争は大阪地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
    </div>
  </section>
</div>

<style>
/* Background video and overlay to match privacy */
.video-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; overflow: hidden; }
.video-background video { width: 100%; height: 100%; object-fit: cover; }
.video-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); z-index: -1; }

/* Hero style aligned with privacy/case-studies */
.case-studies-hero {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.05));
  padding: 6rem 0;
  margin-bottom: 4rem;
  text-align: center;
}
.case-studies-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.case-studies-hero p { color: #e5e7eb; font-size: 1.125rem; }

/* Content panel styled like privacy */
.legal-content { background: rgba(20, 20, 20, 0.8); padding: 3rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 4rem; }
.last-updated { color: #9ca3af; font-size: 0.875rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.legal-section { margin-bottom: 2rem; }
.legal-section h2 { font-size: 1.5rem; color: #fff; margin-bottom: 0.75rem; }
.legal-section p { color: #d1d5db; line-height: 1.8; }
.legal-section ul { list-style: none; padding-left: 1.5rem; margin: 1rem 0; }
.legal-section li { position: relative; padding: 0.4rem 0; color: #cbd5e1; }
.legal-section li::before { content: "•"; position: absolute; left: -1.5rem; color: #8b5cf6; font-weight: bold; }
.legal-section a { color: #93c5fd; text-decoration: none; }
.legal-section a:hover { text-decoration: underline; color: #60a5fa; }
@media (max-width: 768px) {
  .case-studies-hero { padding: 4rem 0 3rem; }
  .case-studies-hero h1 { font-size: 2rem; }
  .legal-content { padding: 1.5rem; margin: 0 0.5rem 3rem; }
}
</style>
