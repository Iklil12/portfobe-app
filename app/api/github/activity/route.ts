import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    // 1. Cari username GitHub dari tabel Integration
    const integration = await prisma.integration.findUnique({
      where: {
        userId_provider: {
          userId: userId,
          provider: 'GITHUB'
        }
      }
    });

    if (!integration || !integration.providerId) {
      return NextResponse.json({ error: 'GitHub integration not found' }, { status: 404 });
    }

    const username = integration.providerId;

    // 2. Fetch events dari GitHub API
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
      { headers, next: { revalidate: 60 } } // Cache 1 menit untuk testing/real-time
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from GitHub' }, { status: response.status });
    }

    const events = await response.json();

    // 3. Filter & Saring: Ambil aktivitas populer (Max 5)
    const filteredActivity = events
      .filter((event: any) => [
        'PushEvent', 
        'CreateEvent', 
        'PullRequestEvent', 
        'ForkEvent', 
        'IssueCommentEvent'
      ].includes(event.type))
      .slice(0, 5)
      .map((event: any) => {
        let description = '';
        
        switch (event.type) {
          case 'PushEvent':
            const commitCount = event.payload.size || event.payload.commits?.length || 0;
            if (commitCount === 0) {
              description = "Made a push to";
            } else {
              description = `Pushed ${commitCount} commit${commitCount > 1 ? 's' : ''} to`;
            }
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

        const commitMessage = event.type === 'PushEvent' 
          ? (event.payload.commits?.[0]?.message?.split('\n')[0] || '') 
          : '';

        return {
          id: event.id,
          type: event.type,
          repo: event.repo.name,
          description: description,
          commitMessage: commitMessage,
          createdAt: event.created_at,
          link: `https://github.com/${event.repo.name}`
        };
      });

    return NextResponse.json({ activities: filteredActivity });

  } catch (error) {
    console.error('GitHub Activity Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
