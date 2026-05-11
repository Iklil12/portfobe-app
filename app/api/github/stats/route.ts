import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Cache TTL: 15 menit. GitHub hanya dipanggil jika cache sudah kedaluwarsa.
// Semua pengunjung berbagi satu cache yang sama → aman dari rate limit.
const CACHE_TTL_MINUTES = 15;

// Fallback GitHub colors for languages
const GITHUB_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

function getLanguageColor(language: string) {
  return GITHUB_COLORS[language] || '#8b949e';
}

function buildStatsFromRepos(repos: any[], username: string) {
  const languageSizes: Record<string, number> = {};
  let totalSize = 0;

  // Filter fork, ambil repo asli. Jika semua fork, ambil semua.
  const filteredRepos = repos.filter(repo => !repo.fork);
  const displayRepos = filteredRepos.length > 0 ? filteredRepos : repos;

  for (const repo of displayRepos) {
    if (repo.language && repo.size) {
      languageSizes[repo.language] = (languageSizes[repo.language] || 0) + repo.size;
      totalSize += repo.size;
    }
  }

  // Ambil 3 repo teratas: urutkan berdasarkan stars (desc), jika sama pakai push date (desc)
  // displayRepos sudah diurutkan by pushed dari GitHub API, jadi urutan push sudah benar
  const topRepos = [...displayRepos]
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      // Jika stars sama, yang paling baru di-push duluan (sudah sorted by GitHub)
      return 0;
    })
    .slice(0, 3)
    .map(repo => ({
      name: repo.name || repo.full_name || 'Untitled Repository',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      language: repo.language || null,
      languageColor: getLanguageColor(repo.language || ''),
      description: repo.description || null,
      url: repo.html_url || '#'
    }));

  const languages = Object.entries(languageSizes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, size]) => ({
      name,
      percentage: totalSize > 0 ? Math.round((size / totalSize) * 100) : 0,
      color: getLanguageColor(name)
    }));

  return {
    username,
    languages,
    topRepo: topRepos[0] || null,   // Backward compat: tetap ada topRepo
    topRepos,                        // Baru: array sampai 3 repo
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    // Parameter opsional: ?bust=1 untuk paksa refresh cache (misal dari dashboard settings)
    const bustCache = searchParams.get('bust') === '1';

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    // Ambil data integrasi GitHub untuk user ini
    const integration = await prisma.integration.findUnique({
      where: { userId_provider: { userId, provider: 'GITHUB' } }
    });

    if (!integration || !integration.providerId) {
      return NextResponse.json({ error: 'GitHub integration not found' }, { status: 404 });
    }

    const now = new Date();

    // === PERIKSA CACHE DATABASE ===
    // 1. Jika ini permintaan refresh (bustCache), berikan rate limit 1 menit untuk keamanan
    if (bustCache && integration.updatedAt) {
      const lastUpdate = new Date(integration.updatedAt).getTime();
      const secondsSinceLastUpdate = Math.floor((now.getTime() - lastUpdate) / 1000);
      
      if (secondsSinceLastUpdate < 60) {
        return NextResponse.json(
          { error: `Silakan tunggu ${60 - secondsSinceLastUpdate} detik lagi sebelum memperbarui.` }, 
          { status: 429 }
        );
      }
    }

    // 2. Jika cache masih valid dan tidak ada permintaan bust, langsung kembalikan data dari DB
    if (
      !bustCache &&
      integration.cachedData &&
      integration.cacheExpiresAt &&
      integration.cacheExpiresAt > now
    ) {
      const cached = JSON.parse(integration.cachedData);
      return NextResponse.json(cached, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
      });
    }

    // === CACHE KEDALUWARSA / KOSONG → AMBIL DARI GITHUB ===
    const username = integration.providerId;

    // Autentikasi Basic → kuota 5.000 req/jam (vs 60 tanpa auth)
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (clientId && clientSecret) {
      headers['Authorization'] = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
    }

    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
      cache: 'no-store',
      headers: headers
    });

    if (!res.ok) {
      // Jika GitHub error, kembalikan cache lama (jika ada) daripada error kosong
      if (integration.cachedData) {
        return NextResponse.json(JSON.parse(integration.cachedData), {
          headers: { 'Cache-Control': 'public, s-maxage=60' }
        });
      }
      if (res.status === 404) return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });
      if (res.status === 403) return NextResponse.json({ error: 'GitHub API rate limit exceeded' }, { status: 429 });
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      const emptyResult = { username, languages: [], topRepo: null };
      return NextResponse.json(emptyResult, {
        headers: { 'Cache-Control': 'public, s-maxage=60' }
      });
    }

    // Bangun data stats
    const statsData = buildStatsFromRepos(repos, username);

    // === SIMPAN KE DATABASE CACHE ===
    // Set expiry 15 menit ke depan
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MINUTES * 60 * 1000);
    await prisma.integration.update({
      where: { userId_provider: { userId, provider: 'GITHUB' } },
      data: {
        cachedData: JSON.stringify(statsData),
        cacheExpiresAt: expiresAt,
      }
    });

    return NextResponse.json(statsData, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });

  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
