import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!envUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase credentials are missing on the server.' }, { status: 500 });
  }

  try {
    const supabase = createClient(envUrl, serviceKey, {
      auth: { persistSession: false }
    });

    // Fetch all tables
    const [groupsRes, studentsRes, semestersRes, lessonsRes, recordsRes] = await Promise.all([
      supabase.from('groups').select('*'),
      supabase.from('students').select('*'),
      supabase.from('semesters').select('*'),
      supabase.from('lessons').select('*'),
      supabase.from('journal_records').select('*')
    ]);

    if (groupsRes.error) throw new Error(`Groups error: ${groupsRes.error.message}`);
    if (studentsRes.error) throw new Error(`Students error: ${studentsRes.error.message}`);
    if (semestersRes.error) throw new Error(`Semesters error: ${semestersRes.error.message}`);
    if (lessonsRes.error) throw new Error(`Lessons error: ${lessonsRes.error.message}`);
    if (recordsRes.error) throw new Error(`Records error: ${recordsRes.error.message}`);

    const backupData = {
      version: 1.0,
      exportedAt: new Date().toISOString(),
      groups: groupsRes.data || [],
      students: studentsRes.data || [],
      semesters: semestersRes.data || [],
      lessons: lessonsRes.data || [],
      journal_records: recordsRes.data || []
    };

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=web_jurnal_backup_${new Date().toISOString().slice(0, 10)}.json`
      }
    });
  } catch (error: any) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
  }
}
