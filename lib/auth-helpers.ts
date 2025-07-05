import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import type { User } from '@/types/common'

export async function getUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function requireAuth() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    username: profile.username,
    avatar: profile.avatar_url,
    role: profile.is_streamer ? 'streamer' : 'user'
  }
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

export async function signUp(email: string, password: string, username: string) {
  const supabase = createClient()
  
  // ユーザー名の重複チェック
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    throw new Error('このユーザー名は既に使用されています')
  }
  
  // First, sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        display_name: username,
      }
    }
  })
  
  if (authError) {
    throw authError
  }
  
  return authData
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
  
  redirect('/login')
}