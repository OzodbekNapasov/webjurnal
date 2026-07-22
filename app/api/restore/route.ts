import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!envUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase credentials are missing on the server.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { groups, students, semesters, lessons, journal_records } = body;

    // Basic structure validation
    if (!Array.isArray(groups) || !Array.isArray(students) || !Array.isArray(semesters) || !Array.isArray(lessons) || !Array.isArray(journal_records)) {
      return NextResponse.json({ error: 'Zaxira nusxasi formati noto\'g\'ri (Jadvallar yetishmayapti)' }, { status: 400 });
    }

    const supabase = createClient(envUrl, serviceKey, {
      auth: { persistSession: false }
    });

    // 1. Delete all existing records in reverse foreign key order
    await supabase.from('journal_records').delete().not('student_id', 'is', null);
    await supabase.from('lessons').delete().not('id', 'is', null);
    await supabase.from('students').delete().not('id', 'is', null);
    await supabase.from('semesters').delete().not('id', 'is', null);
    await supabase.from('groups').delete().not('id', 'is', null);

    // 2. Insert new records in foreign key order
    if (groups.length > 0) {
      const { error } = await supabase.from('groups').insert(groups);
      if (error) throw new Error(`Groups tiklashda xatolik: ${error.message}`);
    }

    if (semesters.length > 0) {
      const { error } = await supabase.from('semesters').insert(semesters);
      if (error) throw new Error(`Semesters tiklashda xatolik: ${error.message}`);
    }

    if (students.length > 0) {
      const { error } = await supabase.from('students').insert(students);
      if (error) throw new Error(`Students tiklashda xatolik: ${error.message}`);
    }

    if (lessons.length > 0) {
      const { error } = await supabase.from('lessons').insert(lessons);
      if (error) throw new Error(`Lessons tiklashda xatolik: ${error.message}`);
    }

    if (journal_records.length > 0) {
      const { error } = await supabase.from('journal_records').insert(journal_records);
      if (error) throw new Error(`Journal Records tiklashda xatolik: ${error.message}`);
    }

    return NextResponse.json({ status: 'success', restored: {
      groups: groups.length,
      semesters: semesters.length,
      students: students.length,
      lessons: lessons.length,
      journal_records: journal_records.length
    } });
  } catch (error: any) {
    console.error('Restore error:', error);
    return NextResponse.json({ error: error.message || 'Tiklashda xatolik yuz berdi' }, { status: 500 });
  }
}
