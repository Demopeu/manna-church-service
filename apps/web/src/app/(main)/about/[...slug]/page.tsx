import { redirect } from 'next/navigation';

export default function AboutCatchAll() {
  redirect('/about/intro');
}
