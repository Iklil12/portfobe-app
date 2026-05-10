import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    // Ambil data integrasi GitHub untuk user ini
    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId: userId,
          provider: 'GITHUB',
        }
      }
    });

    if (!integration || !integration.providerId) {
      return NextResponse.json({ error: 'GitHub integration not found' }, { status: 404 });
    }

    const username = integration.providerId;

    // Fetch repository dari GitHub API
    // Menggunakan cache-control 5 menit (300 detik) agar perubahan (seperti repo di-public) cepat terlihat
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
      next: { revalidate: 300 },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` // Optional
      }
    });

    if (!res.ok) {
      if (res.status === 404) return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });
      if (res.status === 403) return NextResponse.json({ error: 'GitHub API rate limit exceeded' }, { status: 429 });
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json({ 
        languages: [], 
        topRepo: null 
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        }
      });
    }

    // Kalkulasi bahasa pemrograman teratas (Berdasarkan Size)
    const languageSizes: Record<string, number> = {};
    let totalSize = 0;

    // Cari repository dengan bintang (stars) terbanyak
    let topRepo = repos[0];

    for (const repo of repos) {
      // Hitung berdasarkan size repository untuk bahasa utamanya (proxy dari jumlah byte code)
      if (!repo.fork && repo.language && repo.size) {
        languageSizes[repo.language] = (languageSizes[repo.language] || 0) + repo.size;
        totalSize += repo.size;
      }

      // Cek apakah repository ini punya bintang lebih banyak
      if (repo.stargazers_count > (topRepo?.stargazers_count || -1)) {
        topRepo = repo;
      }
    }

    // Urutkan dan ambil 3 bahasa teratas, jadikan persentase
    const sortedLanguages = Object.entries(languageSizes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, size]) => {
        const percentage = totalSize > 0 ? Math.round((size / totalSize) * 100) : 0;
        return {
          name,
          percentage,
          color: getLanguageColor(name)
        };
      });

    const formattedTopRepo = topRepo ? {
      name: topRepo.name || topRepo.full_name || 'Untitled Repository',
      stars: topRepo.stargazers_count || 0,
      forks: topRepo.forks_count || 0,
      watchers: topRepo.watchers_count || 0,
      language: topRepo.language || 'Unknown',
      languageColor: getLanguageColor(topRepo.language || ''),
      description: topRepo.description || 'No description provided.',
      url: topRepo.html_url || '#'
    } : null;

    return NextResponse.json({
      username: username,
      languages: sortedLanguages,
      topRepo: formattedTopRepo
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
      }
    });

  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
