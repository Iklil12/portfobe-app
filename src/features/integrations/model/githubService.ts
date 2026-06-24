import prisma from '@/shared/lib/prisma';

const CACHE_TTL_MINUTES = 15;

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
  React: '#61dafb',
  Shell: '#89e051',
  'Objective-C': '#438eff',
  Other: '#8b949e'
};

function getLanguageColor(language: string) {
  return GITHUB_COLORS[language] || '#8b949e';
}

function buildStatsFromRepos(repos: any[], username: string, detailedLanguages: any[]) {
  const filteredRepos = repos.filter(repo => !repo.fork);
  const displayRepos = filteredRepos.length > 0 ? filteredRepos : repos;

  const topRepos = [...displayRepos]
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
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

  return {
    username,
    languages: detailedLanguages,
    topRepo: topRepos[0] || null,
    topRepos,
  };
}

export async function getGithubStats(userId: string, bustCache: boolean = false) {
  if (!userId) throw new Error("400:UserId is required");

  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: 'GITHUB' } }
  });

  if (!integration || !integration.providerId) throw new Error("404:GitHub integration not found");

  const now = new Date();

  if (bustCache && integration.updatedAt) {
    const lastUpdate = new Date(integration.updatedAt).getTime();
    const secondsSinceLastUpdate = Math.floor((now.getTime() - lastUpdate) / 1000);
    
    if (secondsSinceLastUpdate < 60) {
      throw new Error(`429:Silakan tunggu ${60 - secondsSinceLastUpdate} detik lagi sebelum memperbarui.`);
    }
  }

  if (
    !bustCache &&
    integration.cachedData &&
    integration.cacheExpiresAt &&
    integration.cacheExpiresAt > now
  ) {
    return { cached: true, data: JSON.parse(integration.cachedData) };
  }

  const username = integration.providerId;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfobe-App'
  };

  if (clientId && clientSecret) {
    headers['Authorization'] = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
  }

  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, {
    cache: 'no-store',
    headers: headers
  });

  if (!res.ok) {
    if (integration.cachedData) {
      return { cached: true, data: JSON.parse(integration.cachedData) };
    }
    if (res.status === 404) throw new Error("404:GitHub user not found");
    throw new Error(`500:GitHub API error: ${res.status}`);
  }

  const repos = await res.json();

  if (!Array.isArray(repos) || repos.length === 0) {
    return { cached: false, data: { username, languages: [], topRepo: null } };
  }

  const topReposForLangs = repos.filter((r: any) => !r.fork).slice(0, 15);
  const languageAggr: Record<string, number> = {};
  let totalBytes = 0;

  await Promise.all(topReposForLangs.map(async (repo: any) => {
    try {
      const langRes = await fetch(repo.languages_url, { headers, next: { revalidate: 3600 } });
      if (langRes.ok) {
        const langs = await langRes.json();
        for (const [name, bytes] of Object.entries(langs)) {
          languageAggr[name] = (languageAggr[name] || 0) + (bytes as number);
          totalBytes += (bytes as number);
        }
      }
    } catch (e) {
      console.error('Error fetching languages for repo:', repo.name);
    }
  }));

  const sortedLangs = Object.entries(languageAggr).sort(([, a], [, b]) => b - a);
    
  const top3 = sortedLangs.slice(0, 3);
  const rest = sortedLangs.slice(3);
  
  let detailedLanguages = top3.map(([name, bytes]) => ({
    name,
    percent: totalBytes > 0 ? parseFloat(((bytes / totalBytes) * 100).toFixed(1)) : 0,
    color: getLanguageColor(name)
  }));
  
  if (rest.length > 0) {
    const otherBytes = rest.reduce((acc, [, bytes]) => acc + bytes, 0);
    detailedLanguages.push({
      name: 'Other',
      percent: totalBytes > 0 ? parseFloat(((otherBytes / totalBytes) * 100).toFixed(1)) : 0,
      color: getLanguageColor('Other')
    });
  }

  const statsData = buildStatsFromRepos(repos, username, detailedLanguages);

  const expiresAt = new Date(now.getTime() + CACHE_TTL_MINUTES * 60 * 1000);
  await prisma.integration.update({
    where: { userId_provider: { userId, provider: 'GITHUB' } },
    data: {
      cachedData: JSON.stringify(statsData),
      cacheExpiresAt: expiresAt,
    }
  });

  return { cached: false, data: statsData };
}

export async function getGithubActivity(userId: string) {
  if (!userId) throw new Error("400:UserId is required");

  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId: userId, provider: 'GITHUB' } }
  });

  if (!integration || !integration.providerId) throw new Error("404:GitHub integration not found");

  const username = integration.providerId;

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfobe-App'
  };

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    const auth = Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=15`,
    { headers, next: { revalidate: 900 } }
  );

  if (!response.ok) throw new Error(`${response.status}:Failed to fetch from GitHub`);

  const events = await response.json();

  const filteredActivity = events
    .filter((event: any) => [
      'PushEvent', 'CreateEvent', 'PullRequestEvent', 'ForkEvent', 'IssueCommentEvent'
    ].includes(event.type))
    .slice(0, 5)
    .map((event: any) => {
      let description = '';
      switch (event.type) {
        case 'PushEvent':
          const size = event.payload.size || event.payload.commits?.length || 0;
          description = size > 0 ? `Pushed ${size} commit${size > 1 ? 's' : ''} to` : "Made a push to";
          break;
        case 'CreateEvent':
          description = `Created ${event.payload.ref_type || 'repository'}`;
          break;
        case 'PullRequestEvent':
          description = `${event.payload.action === 'opened' ? 'Opened' : 'Merged'} a pull request in`;
          break;
        case 'ForkEvent':
          description = `Forked repository`;
          break;
        case 'IssueCommentEvent':
          description = `Commented on an issue in`;
          break;
        default:
          description = `Interacted with`;
      }

      return {
        id: event.id,
        type: event.type,
        repo: event.repo.name,
        description: description,
        createdAt: event.created_at,
        link: `https://github.com/${event.repo.name}`
      };
    });

  return filteredActivity;
}
