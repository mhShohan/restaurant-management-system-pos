'use server';

import { cookies } from 'next/headers';

export async function storeAccessToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', token);
}

export async function clearAccessToken() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
}
