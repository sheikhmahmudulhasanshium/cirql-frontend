// app/(routes)/search/page.tsx
'use client'; // This makes it a Client Component

import { useSearchParams } from 'next/navigation';
import { Suspense,  } from 'react'; // Import ReactNode

// --- Import your components ---
import BasicPageProvider from '@/components/providers/basic-page-provider'; // Adjust path if needed
import Header from '../components/header-sign-out';
import Footer from '../components/footer';
// --- End of imports ---

// Create a child component to use the hook, allowing SearchPage to be default export
function SearchResultsContent() { // Renamed to avoid confusion with the outer SearchResults
  const searchParamsHook = useSearchParams();
  const rawQuery = searchParamsHook.get('q');
  const query = rawQuery ?? "";

  return (
    // This is where your actual search results would go
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <p>You searched for: <span className="font-semibold">{query}</span></p>
      {/* Add your search results display logic here */}
      <p className="mt-4">
        If you see this, the component rendered with the query.
      </p>
    </div>
  );
}


// This component will now be wrapped by BasicPageProvider
function SearchResultsWithLayout() {
  return (
    <BasicPageProvider
      header={<Header />} // Provide your Header component
      footer={<Footer />} // Provide your Footer component
    >
      <SearchResultsContent />
    </BasicPageProvider>
  );
}

export default function SearchPage() {
  // Pages using useSearchParams should be wrapped in Suspense
  return (
    <Suspense fallback={
      // Fallback can also use the BasicPageProvider for consistent loading state
      <BasicPageProvider
        header={<Header />}
        footer={<Footer />}
      >
        <div className="container mx-auto p-4">Loading search...</div>
      </BasicPageProvider>
    }>
      <SearchResultsWithLayout />
    </Suspense>
  );
}