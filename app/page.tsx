import { Suspense } from 'react';
import CMSEditor from './CMSEditor';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading post data...</div>}>
      <CMSEditor />
    </Suspense>
  );
}
