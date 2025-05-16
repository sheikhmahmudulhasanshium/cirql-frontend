// app/(routes)/components/searchbar.tsx
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const Searchbar = () => {
    return (
        // This div controls the overall width and max-width of the searchbar
        // w-full makes it take the width of its container in Header.tsx
        // max-w-xl limits how wide it can get on larger screens. Adjust as needed.
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
            <SearchIcon
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground pointer-events-none sm:h-5 sm:w-5"
            />
            <Input
                type="text"
                placeholder="Search CiRQL" // Specific placeholder
                className="w-full rounded-full bg-gray-100 dark:bg-slate-700  // Pill shape and background
                           py-2 sm:py-2.5 pl-9 sm:pl-10 pr-4 h-9 sm:h-10       // Padding to accommodate icon and define height
                           border-transparent focus-visible:border-primary    // Border style on focus
                           focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background
                           placeholder:text-muted-foreground text-sm"
            />
        </div>
    );
}

export default Searchbar;