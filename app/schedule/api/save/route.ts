import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const jsonString = JSON.stringify(data, null, 4);

    // 1. Local filesystem save (works in local dev)
    try {
      const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
      fs.writeFileSync(filePath, jsonString, 'utf-8');
    } catch (fsErr) {
      console.warn('Local fs write skipped (serverless environment):', fsErr);
    }

    // 2. Direct GitHub API commit (if GITHUB_TOKEN is set in Vercel Environment Variables)
    const githubToken = (process.env.GITHUB_TOKEN || '').trim();
    const githubRepo = (process.env.GITHUB_REPO || 'OzodbekNapasov/webjurnal').trim();

    let githubSynced = false;
    let githubError = null;

    if (githubToken) {
      try {
        const fileUrl = `https://api.github.com/repos/${githubRepo}/contents/public/schedule/data.json`;
        
        // Fetch current file SHA from GitHub
        const getRes = await fetch(fileUrl, {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'WebJurnal-App'
          },
          cache: 'no-store'
        });

        let sha: string | undefined = undefined;
        if (getRes.ok) {
          const fileInfo = await getRes.json();
          sha = fileInfo.sha;
        }

        // Convert content to Base64
        const base64Content = Buffer.from(jsonString).toString('base64');

        // Create commit via GitHub API
        const putRes = await fetch(fileUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'WebJurnal-App'
          },
          body: JSON.stringify({
            message: "chore(schedule): update schedule data.json from web editor",
            content: base64Content,
            sha: sha,
            branch: "main"
          })
        });

        if (putRes.ok) {
          githubSynced = true;
        } else {
          const errText = await putRes.text();
          githubError = `GitHub API status ${putRes.status}: ${errText}`;
          console.error('GitHub API error:', githubError);
        }
      } catch (ghErr: any) {
        githubError = ghErr?.message || String(ghErr);
        console.error('GitHub sync exception:', githubError);
      }
    }

    return NextResponse.json({
      status: 'success',
      githubSynced,
      githubError
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error: any) {
    console.error('Error saving schedule data:', error);
    return NextResponse.json({ status: 'error', message: error.message || 'Failed to save' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
