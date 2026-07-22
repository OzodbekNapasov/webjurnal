import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // public/schedule/data.json fayliga yozish
    const filePath = path.join(process.cwd(), 'public', 'schedule', 'data.json');
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
    
    return NextResponse.json({ status: 'success' }, {
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
