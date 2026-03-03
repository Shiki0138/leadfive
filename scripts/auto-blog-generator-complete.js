#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const yaml = require('js-yaml');

const ROOT_DIR = path.join(__dirname, '..');
const CONTENT_CALENDAR_PATH = path.join(ROOT_DIR, '_data', 'blog', 'content-calendar.yml');
const AUTO_POST_STATS_PATH = path.join(ROOT_DIR, 'logs', 'auto-posts.json');
const POSTS_DIR = path.join(ROOT_DIR, '_posts');

// Gemini API設定
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const FALLBACK_GEMINI_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash';

// Unsplash画像プール（カテゴリ別、直接URL使用）
const UNSPLASH_IMAGES = {
    business: [
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1533750349088-cd871a92f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    data: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    writing: [
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    team: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    planning: [
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    ai: [
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    sns: [
        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    beauty: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
        'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    medical: [
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    food: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
    psychology: [
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080&q=80',
    ],
};

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickImage(categories) {
    const pool = [];
    for (const cat of categories) {
        if (UNSPLASH_IMAGES[cat]) {
            pool.push(...UNSPLASH_IMAGES[cat]);
        }
    }
    if (pool.length === 0) {
        pool.push(...UNSPLASH_IMAGES.business, ...UNSPLASH_IMAGES.data);
    }
    return pickRandom(pool);
}

// ─────────────────────────────────────────────
// 設定ファイル読み込み
// ─────────────────────────────────────────────
async function loadConfig() {
    try {
        const raw = await fs.readFile(CONTENT_CALENDAR_PATH, 'utf8');
        return yaml.load(raw);
    } catch (error) {
        console.error('設定ファイルの読み込みエラー:', error);
        return null;
    }
}

// ─────────────────────────────────────────────
// 既存記事から内部リンク候補を取得
// ─────────────────────────────────────────────
async function getInternalLinkCandidates(limit = 10) {
    try {
        const files = await fs.readdir(POSTS_DIR);
        const mdFiles = files.filter(f => f.endsWith('.md'));
        const today = new Date();

        const candidates = [];
        for (const file of mdFiles) {
            const match = file.match(/^(\d{4}-\d{2}-\d{2})/);
            if (!match) continue;

            const postDate = new Date(match[1]);
            if (postDate > today) continue;

            try {
                const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf8');
                const titleMatch = content.match(/title:\s*"([^"]+)"/);
                const catMatch = content.match(/categories:\s*\[([^\]]+)\]/);
                if (titleMatch) {
                    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
                    candidates.push({
                        title: titleMatch[1],
                        url: `/blog/${slug}/`,
                        categories: catMatch ? catMatch[1] : '',
                    });
                }
            } catch (_) {
                // skip unreadable files
            }
        }

        // ランダムに選択
        const shuffled = candidates.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, limit);
    } catch (error) {
        console.error('内部リンク候補取得エラー:', error);
        return [];
    }
}

// ─────────────────────────────────────────────
// AIっぽさ排除 システムプロンプト
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `あなたは日本語のプロ編集者であり、SEOライティングの実務経験を持つ構成者です。
指定されたキーワードとテーマをもとに、Google検索で上位表示され、読者が最後まで読みたくなるブログ記事をMarkdown形式で書いてください。

〈目的〉
AIっぽさ（テンプレ感、説明書感、記号過多、過剰な丁寧さ、逃げ文句、抽象語の空回り）を完全に排除した、人間が書いたとしか思えない自然な日本語の記事を作ること。同時にSEOとユーザー体験の両方を満たす構成にする。

〈絶対禁止〉
- 「〜ではないでしょうか」「いかがでしたか」「〜かもしれません」「ぜひ」「まとめ」「おわりに」「はじめに」などの接続・締め型テンプレ
- ✅❌⭐🔥💡📌 などの記号・絵文字（見出し含め一切不可）
- 「この記事では○○について解説します」というメタ説明書型の書き出し
- 同じ語尾の3連続（「〜です。〜です。〜です。」）
- 過剰な修飾語（「非常に重要な」「画期的な」「圧倒的な」）
- 箇条書きの連打（箇条書きは1記事に1〜2箇所まで）
- 「無料相談はこちら」などの直接的な営業CT

〈文体ルール〉
- 体言止め・断定口調を基本とする（例：「売上が上がる」「効果がある」）
- 文の長さにバラつきを出す（短文10文字、長文50文字をリズミカルに配置）
- 1つの段落は2〜4文で区切る
- 専門用語は初出時に日常語で言い換える
- 数値やデータは積極的に使う（ただし出典不明の数字は「想定」「目安」と明記）

〈構成ルール〉
- h1は使わない。h2とh3のみ使用
- h2は4〜6個
- h2見出しは32文字以内
- 冒頭はh2なしのリード段落（2〜3文、見出しの前に配置）
- 最後のh2は総括的なメッセージ（1〜2文の断定で締める）
- 各h2の直後に、Unsplash画像をMarkdown形式で1枚配置する

〈タイトル〉
- 32文字前後（30〜35文字）
- キーワードを自然に含む
- 数字を入れる（例：「5つの」「7つの」）
- 区切りには「｜」を使用

〈メタディスクリプション〉
- 120文字前後
- 記事の価値を具体的に伝える
- キーワードを自然に含む

〈SEOキーワード〉
- 指定されたキーワードを本文中に3〜5回自然に使用する

〈内部リンク〉
- 本文中に1〜2本の内部リンクを自然な文脈で設置する
- リンクは文末やセクション末に「[記事タイトル](URL)」の形式で入れる
- 自然な導線として設置する（「〜は○○の記事で整理している」など）

〈画像〉
- 各h2見出しの直後に1枚、Unsplash URLのMarkdown画像を配置する
- 形式: ![説明テキスト](URL)

〈出力形式〉
- front matterは含めない（本システムが自動生成する）
- 純粋なMarkdownの本文のみを出力する
- リード段落から始める（h2の前に2〜3文）
`;

// ─────────────────────────────────────────────
// メインクラス
// ─────────────────────────────────────────────
class AutoBlogGeneratorComplete {
    constructor() {
        this.date = new Date();
        this.dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][this.date.getDay()];
        this.config = null;
    }

    async initialize() {
        this.config = await loadConfig();
        if (!this.config) {
            console.warn('⚠️ content-calendar.yml が見つからないため、デフォルト設定で実行します。');
            this.config = {};
        }
    }

    // 曜日テーマ選択
    selectDailyTheme() {
        const themes = this.config?.weekly_themes;
        if (themes && themes[this.dayOfWeek]) {
            return themes[this.dayOfWeek];
        }
        return {
            theme: 'AIマーケティング',
            instinct: 'learning',
            structure: 'howTo',
            keywords: ['AI マーケティング 最新トレンド'],
        };
    }

    // 月別キーワード
    getMonthlyKeywords() {
        const months = ['january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'];
        const monthName = months[this.date.getMonth()];
        const campaign = this.config?.monthly_campaigns?.[monthName];
        return campaign?.special_keywords || [];
    }

    // テーマからUnsplash画像カテゴリをマッピング
    getImageCategories(theme) {
        const map = {
            'AIマーケティング': ['ai', 'data', 'business'],
            '消費者心理': ['psychology', 'team', 'business'],
            '成功事例': ['business', 'team', 'data'],
            '実践テクニック': ['planning', 'writing', 'data'],
            'トレンド分析': ['ai', 'data', 'business'],
            '業界別ガイド': ['business', 'beauty', 'medical', 'food'],
            '戦略立案': ['planning', 'business', 'team'],
        };
        return map[theme] || ['business', 'data'];
    }

    // Gemini API 呼び出し
    async generateContentWithAI(prompt) {
        try {
            const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
            const result = await model.generateContent(SYSTEM_PROMPT + '\n\n' + prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Gemini API エラー:', error);
            if (error?.status === 404 || /not found/i.test(error?.message || '')) {
                try {
                    console.warn(`⚠️ ${DEFAULT_GEMINI_MODEL} で失敗。${FALLBACK_GEMINI_MODEL} を試行。`);
                    const fallback = genAI.getGenerativeModel({ model: FALLBACK_GEMINI_MODEL });
                    const result = await fallback.generateContent(SYSTEM_PROMPT + '\n\n' + prompt);
                    return (await result.response).text();
                } catch (fallbackError) {
                    console.error('フォールバックでもエラー:', fallbackError);
                    throw fallbackError;
                }
            }
            throw error;
        }
    }

    // タイトルのサニタイズ
    sanitizeTitle(raw) {
        if (!raw) return '';
        const firstLine = raw.split('\n').map(l => l.trim()).find(l => l.length > 0) || '';
        return firstLine
            .replace(/^["'`]+|["'`]+$/g, '')
            .replace(/^#+\s*/, '')
            .replace(/^(?:タイトル[:：]\s*)/i, '')
            .trim()
            .slice(0, 40);
    }

    // コンテンツの正規化
    normalizeContent(raw) {
        if (!raw) return '';
        let text = raw.trim();

        // front matterの除去（もし返ってきた場合）
        text = text.replace(/^---[\s\S]*?---\n*/, '');

        // h1見出しの除去
        text = text.replace(/^#\s+.+\n*/m, '');

        // 先頭の空行を除去
        text = text.replace(/^\n+/, '');

        // 3行以上の連続空行を2行に
        text = text.replace(/\n{3,}/g, '\n\n');

        return text;
    }

    // 内部リンク情報をプロンプト用にフォーマット
    formatInternalLinks(links) {
        if (!links.length) return '';
        const items = links.map(l => `- [${l.title}](${l.url}) (${l.categories})`).join('\n');
        return `\n〈内部リンク候補〉\n以下の既存記事から関連性の高いものを1〜2本選び、本文中に自然に内部リンクを設置してください：\n${items}\n`;
    }

    // Unsplash画像URLプール情報をプロンプト用にフォーマット
    formatImagePool(theme) {
        const categories = this.getImageCategories(theme);
        const urls = [];
        for (const cat of categories) {
            if (UNSPLASH_IMAGES[cat]) {
                urls.push(...UNSPLASH_IMAGES[cat]);
            }
        }
        // 重複を除去してシャッフル
        const unique = [...new Set(urls)].sort(() => Math.random() - 0.5).slice(0, 8);
        return `\n〈使用可能な画像URL〉\n各h2見出しの直後に以下のURLから選んで画像を配置してください：\n${unique.map(u => `- ${u}`).join('\n')}\n`;
    }

    // スラグ生成
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);
    }

    // ─────────────────────────────────
    // メイン生成ロジック
    // ─────────────────────────────────
    async generateBlogPost() {
        const dailyTheme = this.selectDailyTheme();
        const monthlyKeywords = this.getMonthlyKeywords();

        const forcedCategory = (process.env.CATEGORY || process.env.BLOG_CATEGORY || '').trim();
        const forcedInstinct = (process.env.INSTINCT || process.env.BLOG_INSTINCT || '').trim();

        const selectedTheme = {
            theme: forcedCategory || dailyTheme.theme,
            instinct: forcedInstinct || dailyTheme.instinct,
            structure: dailyTheme.structure || 'howTo',
            keywords: Array.isArray(dailyTheme.keywords) ? [...dailyTheme.keywords] : [],
        };

        const allKeywords = [...selectedTheme.keywords, ...monthlyKeywords];
        const selectedKeyword = allKeywords.length
            ? allKeywords[Math.floor(Math.random() * allKeywords.length)]
            : selectedTheme.theme;

        console.log(`📝 ブログ記事を生成中...`);
        console.log(`  曜日: ${this.dayOfWeek}`);
        console.log(`  テーマ: ${selectedTheme.theme}`);
        console.log(`  本能: ${selectedTheme.instinct}`);
        console.log(`  キーワード: ${selectedKeyword}`);

        // 内部リンク候補の取得
        const internalLinks = await getInternalLinkCandidates(15);
        const linkSection = this.formatInternalLinks(internalLinks);
        const imageSection = this.formatImagePool(selectedTheme.theme);

        const currentYear = new Date().getFullYear();

        // --- タイトル生成 ---
        const titlePrompt = `
以下の条件でブログ記事のタイトルを1つだけ作成してください。
- テーマ: ${selectedTheme.theme}
- キーワード: ${selectedKeyword}
- 文字数: 30〜35文字
- 数字を含める（例：「5つの」「7つの」）
- 区切りには「｜」を使用
- ${currentYear}年を自然に含める
- SEOキーワードを自然に入れる

タイトルのみを1行で返してください。解説・引用符・記号は不要。
`;
        let title = this.sanitizeTitle(await this.generateContentWithAI(titlePrompt));
        if (!title) {
            title = `${currentYear}年版 ${selectedTheme.theme}の実践ガイド`;
        }

        // --- メタディスクリプション生成 ---
        const descPrompt = `
以下のブログ記事のメタディスクリプションを120文字前後で1文だけ作成してください。
タイトル: ${title}
テーマ: ${selectedTheme.theme}
キーワード: ${selectedKeyword}

具体的で、記事の価値が伝わる内容にしてください。
メタディスクリプションのみを返してください。解説は不要。
`;
        let description = (await this.generateContentWithAI(descPrompt)).trim()
            .replace(/^["']+|["']+$/g, '')
            .split('\n')[0]
            .slice(0, 160);
        if (!description) {
            description = `${title} - 実践的なガイドを解説します。`;
        }

        // --- 本文生成 ---
        const contentPrompt = `
以下の条件でブログ記事の本文をMarkdown形式で執筆してください。

【条件】
- タイトル: ${title}
- テーマ: ${selectedTheme.theme}
- キーワード: ${selectedKeyword}（本文中に3〜5回自然に使用）
- 本能: ${selectedTheme.instinct}
- 文字数目安: 3000〜5000文字
${linkSection}
${imageSection}

【重要】
- front matterは不要。リード段落から開始する。
- リード段落（h2なし、2〜3文の断定口調）→ h2見出し4〜6個 → 最後のh2は総括（1〜2文）
- 各h2の直後に![説明](UnsplashURL)を1枚配置する
- AIっぽい文体は絶対に避ける。テンプレ表現、過剰な丁寧さ、逃げ文句は禁止
- 内部リンクは本文の自然な流れの中に1〜2本設置する
`;

        const rawContent = await this.generateContentWithAI(contentPrompt);
        const content = this.normalizeContent(rawContent);

        console.log(`📏 生成コンテンツ長: ${content.length} 文字`);

        // ヒーロー画像
        const imageCategories = this.getImageCategories(selectedTheme.theme);
        const heroImage = pickImage(imageCategories);

        const dateStr = this.date.toISOString().split('T')[0];
        const slug = this.generateSlug(title);

        return {
            filename: `${dateStr}-${slug}.md`,
            title,
            date: this.date.toISOString(),
            categories: [selectedTheme.theme],
            tags: Array.from(new Set([
                selectedKeyword,
                ...(selectedTheme.keywords.slice(0, 3)),
            ])),
            instinct: selectedTheme.instinct,
            description,
            content,
            author: 'LeadFive',
            image: heroImage,
        };
    }

    // Markdownファイルの作成
    async createMarkdownFile(post) {
        const markdown = `---
layout: blog-post
title: "${post.title}"
date: ${post.date}
categories: [${post.categories.join(', ')}]
tags: [${post.tags.join(', ')}]
author: "${post.author}"
description: "${post.description}"
image: "${post.image}"
featured: true
instinct: ${post.instinct}
reading_time: 8
seo_keywords: [${post.tags.map(t => `"${t}"`).join(', ')}]
---

${post.content}
`;

        const filepath = path.join(POSTS_DIR, post.filename);
        await fs.mkdir(POSTS_DIR, { recursive: true });
        await fs.writeFile(filepath, markdown, 'utf8');
        console.log(`✅ ブログ記事を作成しました: ${filepath}`);
        return filepath;
    }

    // 統計情報の保存
    async saveStatistics(post) {
        await fs.mkdir(path.dirname(AUTO_POST_STATS_PATH), { recursive: true });
        let stats = [];

        try {
            const existing = await fs.readFile(AUTO_POST_STATS_PATH, 'utf8');
            stats = JSON.parse(existing);
        } catch (_) {
            // 新規
        }

        stats.push({
            date: post.date,
            title: post.title,
            categories: post.categories,
            tags: post.tags,
            instinct: post.instinct,
            filename: post.filename,
            dayOfWeek: this.dayOfWeek,
        });

        // 最新100件のみ保持
        if (stats.length > 100) {
            stats = stats.slice(-100);
        }

        await fs.writeFile(AUTO_POST_STATS_PATH, JSON.stringify(stats, null, 2), 'utf8');
    }

    // メイン実行
    async run() {
        try {
            console.log('🚀 自動ブログ投稿プロセスを開始します...');
            console.log(`📅 日付: ${this.date.toLocaleDateString('ja-JP')}`);
            console.log(`📅 曜日: ${this.dayOfWeek}`);

            await this.initialize();

            const post = await this.generateBlogPost();

            await this.createMarkdownFile(post);

            await this.saveStatistics(post);

            console.log('✨ ブログ記事の自動投稿が完了しました！');
            console.log(`📝 タイトル: ${post.title}`);
            console.log(`🏷️  カテゴリー: ${post.categories.join(', ')}`);
            console.log(`🧠 本能: ${post.instinct}`);

            return post;
        } catch (error) {
            console.error('❌ エラーが発生しました:', error);
            throw error;
        }
    }
}

// 実行
if (require.main === module) {
    const generator = new AutoBlogGeneratorComplete();
    generator.run().catch(() => process.exit(1));
}

module.exports = AutoBlogGeneratorComplete;
