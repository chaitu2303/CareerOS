import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, type, data } = await req.json();

    if (!id || !type || !data) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    let updatedFact;
    
    // Convert generic data to update specific models
    switch (type) {
      case 'skill':
        updatedFact = await prisma.skillFact.update({ where: { id }, data });
        break;
      case 'experience':
        updatedFact = await prisma.experienceFact.update({ where: { id }, data });
        break;
      case 'education':
        updatedFact = await prisma.educationFact.update({ where: { id }, data });
        break;
      case 'project':
        updatedFact = await prisma.projectFact.update({ where: { id }, data });
        break;
      case 'certification':
        updatedFact = await prisma.certificationFact.update({ where: { id }, data });
        break;
      case 'basics':
        updatedFact = await prisma.profileBasics.update({ where: { id }, data });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updatedFact });
  } catch (error) {
    console.error('Fact Update Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await prisma.careerProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const { type, data } = await req.json();

    let newFact;
    const commonData = { ...data, profileId: profile.id, status: 'USER_CREATED' };

    switch (type) {
      case 'skill':
        newFact = await prisma.skillFact.create({ data: commonData });
        break;
      case 'experience':
        newFact = await prisma.experienceFact.create({ data: commonData });
        break;
      case 'education':
        newFact = await prisma.educationFact.create({ data: commonData });
        break;
      case 'project':
        newFact = await prisma.projectFact.create({ data: commonData });
        break;
      case 'certification':
        newFact = await prisma.certificationFact.create({ data: commonData });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: newFact });
  } catch (error) {
    console.error('Fact Create Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const type = url.searchParams.get('type');

    if (!id || !type) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    switch (type) {
      case 'skill':
        await prisma.skillFact.delete({ where: { id } });
        break;
      case 'experience':
        await prisma.experienceFact.delete({ where: { id } });
        break;
      case 'education':
        await prisma.educationFact.delete({ where: { id } });
        break;
      case 'project':
        await prisma.projectFact.delete({ where: { id } });
        break;
      case 'certification':
        await prisma.certificationFact.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fact Delete Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
