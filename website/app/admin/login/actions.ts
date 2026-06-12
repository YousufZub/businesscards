'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function adminLogin(formData: FormData) {
  const password = formData.get('password') as string;
  const secret   = process.env.ADMIN_SECRET;

  if (!secret || password !== secret) {
    redirect('/admin/login?error=1');
  }

  cookies().set('admin_token', secret, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 8, // 8 hours
    path:     '/',
  });

  redirect('/admin');
}
