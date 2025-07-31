---
layout: default
title: 会社概要 | LeadFive
permalink: /company/
---

<section class="page-header">
  <div class="container">
    <h1 class="page-title">会社概要</h1>
    <p class="page-subtitle">Company Information</p>
  </div>
</section>

<section class="company-info">
  <div class="container">
    <div class="company-message glass-card">
      <h2>代表メッセージ</h2>
      <p class="lead">
        「AIは未来を変える。でも、人間の心理は変わらない。」
      </p>
      <p>
        私たちLeadFiveは、この二つの真実を融合させることで、
        ビジネスに革新的な成長をもたらします。
      </p>
      <p>
        AI技術と人間心理学の深い理解を組み合わせ、
        あなたのビジネスを次のステージへ導きます。
      </p>
      <p class="signature">代表取締役 山下公一</p>
    </div>

    <div class="company-details">
      <h2>会社情報</h2>
      <table class="info-table">
        <tr>
          <th>会社名</th>
          <td>{{ site.company.name }}</td>
        </tr>
        <tr>
          <th>代表者</th>
          <td>{{ site.company.representative }}</td>
        </tr>
        <tr>
          <th>設立</th>
          <td>{{ site.company.established }}</td>
        </tr>
        <tr>
          <th>所在地</th>
          <td>{{ site.company.address }}</td>
        </tr>
        <tr>
          <th>電話番号</th>
          <td>{{ site.company.phone }}</td>
        </tr>
        <tr>
          <th>メールアドレス</th>
          <td><a href="mailto:{{ site.company.email }}">{{ site.company.email }}</a></td>
        </tr>
        <tr>
          <th>事業内容</th>
          <td>
            <ul>
              <li>AIマーケティングコンサルティング</li>
              <li>AIプロンプトエンジニアリング</li>
              <li>エンジニアリングサポート</li>
              <li>戦略コンサルティング</li>
              <li>オンラインサロン運営</li>
            </ul>
          </td>
        </tr>
      </table>
    </div>

    <div id="mission" class="company-mission">
      <h2>ミッション</h2>
      <div class="mission-content glass-card">
        <h3 class="gradient-text">人間心理とAIの融合で、ビジネスに革新を</h3>
        <p>
          私たちは、人間の本能的な行動原理を理解し、
          最新のAI技術と組み合わせることで、
          予測可能で持続的なビジネス成長を実現します。
        </p>
        <p>
          単なる技術提供ではなく、
          お客様のビジネスの本質を理解し、
          共に成長するパートナーとして、
          新しい価値を創造し続けます。
        </p>
      </div>
    </div>

    <div id="access" class="company-access">
      <h2>アクセス</h2>
      <div class="access-content glass-card">
        <p>{{ site.company.address }}</p>
        <div class="access-map">
          <!-- Google Maps embed or static map image here -->
          <p class="text-muted">地図を表示</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.page-header {
  padding: 8rem 0 4rem;
  text-align: center;
  background: linear-gradient(to bottom, rgba(139, 92, 246, 0.1), transparent);
}

.page-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.page-subtitle {
  color: #9ca3af;
  font-size: 1.125rem;
}

.company-info {
  padding: 4rem 0;
}

.company-message {
  margin-bottom: 4rem;
  padding: 3rem;
  text-align: center;
}

.company-message .lead {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
}

.company-details {
  margin-bottom: 4rem;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}

.info-table th,
.info-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.info-table th {
  width: 30%;
  color: #9ca3af;
  font-weight: 500;
}

.info-table ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-table li {
  padding: 0.25rem 0;
}

.company-mission,
.company-access {
  margin-bottom: 4rem;
}

.mission-content,
.access-content {
  padding: 3rem;
  margin-top: 2rem;
}

.mission-content h3 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.access-map {
  margin-top: 2rem;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-muted {
  color: #6b7280;
}

.signature {
  text-align: right;
  font-style: italic;
  color: #9ca3af;
  margin-top: 1.5rem;
  font-size: 0.875rem;
}
</style>