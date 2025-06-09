"use client"

import * as React from "react"
// --- FIX START: Import the Check icon ---
import { Moon, Sun, Check } from "lucide-react"
// --- FIX END ---
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CustomModeToggleProps {
  value?: 'light' | 'dark' | 'system';
  onChange: (theme: 'light' | 'dark' | 'system') => void;
  disabled?: boolean;
}

export function CustomModeToggle({ value, onChange, disabled }: CustomModeToggleProps) {
  // We still use useTheme to apply the theme change to the UI instantly.
  const { setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme); // Apply theme visually
    onChange(newTheme); // Trigger the save logic in the parent
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={disabled}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* --- FIX START: Use the 'value' prop to show a checkmark --- */}
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          {value === 'light' ? <Check className="mr-2 h-4 w-4" /> : <div className="mr-2 h-4 w-4" />}
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          {value === 'dark' ? <Check className="mr-2 h-4 w-4" /> : <div className="mr-2 h-4 w-4" />}
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          {/* Changed 'Custom' to 'System' to match value */}
          {value === 'system' ? <Check className="mr-2 h-4 w-4" /> : <div className="mr-2 h-4 w-4" />}
          System
        </DropdownMenuItem>
        {/* --- FIX END --- */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}