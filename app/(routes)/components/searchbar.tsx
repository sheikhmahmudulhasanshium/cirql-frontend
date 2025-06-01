// app/(routes)/components/searchbar.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const Searchbar = () => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const trimmed = query.trim();
            if (trimmed) {
                router.push(`/search?q=${encodeURIComponent(trimmed)}`);
            }
        }
    };

    return (
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
            <SearchIcon
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground pointer-events-none sm:h-5 sm:w-5"
            />
            <Input
                type="text"
                placeholder="Search CiRQL"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-full bg-gray-100 dark:bg-slate-700 
                           py-2 sm:py-2.5 pl-9 sm:pl-10 pr-4 h-9 sm:h-10
                           border-transparent focus-visible:border-primary
                           focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background
                           placeholder:text-muted-foreground text-sm"
            />
        </div>
    );
};

export default Searchbar;
