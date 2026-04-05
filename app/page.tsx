import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect to author dashboard by default
  redirect('/author/dashboard');
}
