// components/modals/announcements/filtered-announcements.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FilterIcon } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnnouncementType, AnnouncementsFilterParams } from "@/lib/types";

interface FilteredAnnouncementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFiltered: (filters: AnnouncementsFilterParams) => void;
    initialFilterParams?: AnnouncementsFilterParams;
}

export interface MyAnnouncementsFilterParams extends AnnouncementsFilterParams {
    title?: string;
}


const FilteredAnnouncementModal = ({ open, onOpenChange, onFiltered, initialFilterParams = {} }: FilteredAnnouncementModalProps) => {
    const [type, setType] = useState<AnnouncementType | undefined>(initialFilterParams.type);
    const [titleFilter, setTitleFilter] = useState<string>((initialFilterParams as MyAnnouncementsFilterParams).title || "");

    const handleTypeChange = (value: string) => { // Changed value type to string
        setType(value === "" ? undefined : (value as AnnouncementType)); // Convert back to undefined or AnnouncementType
    };

    const handleTitleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitleFilter(e.target.value);
    };


    const applyFilters = () => {
        const filters: MyAnnouncementsFilterParams = {};
        if (type) {
            filters.type = type;
        }
        if (titleFilter) {
            filters.title = titleFilter;
        }
        onFiltered(filters);
        onOpenChange(false);
    };


    const clearFilters = () => {
        setType(undefined);
        setTitleFilter("");
        onFiltered({});
        onOpenChange(false);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter Announcements
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Filter Announcements</DialogTitle>
                    <DialogDescription>
                        Filter announcements based on type and title.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type
                        </Label>
                        <Select onValueChange={handleTypeChange} defaultValue={initialFilterParams.type}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={AnnouncementType.COMPANY_NEWS}>{AnnouncementType.COMPANY_NEWS}</SelectItem>
                                <SelectItem value={AnnouncementType.GENERAL}>{AnnouncementType.GENERAL}</SelectItem>
                                <SelectItem value={AnnouncementType.LATEST_UPDATES}>{AnnouncementType.LATEST_UPDATES}</SelectItem>
                                <SelectItem value={AnnouncementType.UPCOMING}>{AnnouncementType.UPCOMING}</SelectItem>
                                <SelectItem value="">All</SelectItem> {/* Empty string for "All" */}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title Contains
                        </Label>
                        <Input id="title" value={titleFilter} onChange={handleTitleFilterChange} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                    <Button type="button" onClick={applyFilters}>Apply Filters</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FilteredAnnouncementModal;