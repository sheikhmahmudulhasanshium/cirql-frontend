import { SignInButton } from "@/components/auth/sign-in-button"; // Assuming this component exists
import Image from "next/image";
import React from "react";

/**
 * A responsive SVG shape divider.
 * The fill color is applied directly to each <path> element via an inline style.
 * This is the most robust method to ensure theming works without config changes.
 */
const ShapeDivider = () => {
  return (
    // The container handles the absolute positioning and rotation.
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        // The SVG container only handles layout now. Color is applied to the paths.
        className="relative block h-[100px] w-[calc(100%+1.3px)] sm:h-[150px] md:w-[calc(122%+1.3px)] lg:w-[calc(103%+1.3px)]"
      >
        {/*
          THE FIX: Apply the style directly to each path. This bypasses any
          CSS inheritance issues and explicitly sets the color for each shape.
        */}
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          style={{ fill: "var(--background)" }}
          className="opacity-25"
        ></path>
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          style={{ fill: "var(--background)" }}
          className="opacity-50"
        ></path>
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          style={{ fill: "var(--background)" }}
          className="opacity-100" // Opacity is handled by Tailwind
        ></path>
      </svg>
    </div>
  );
};

const Welcome = () => {
  const intrinsicSvgWidth = 5187;
  const intrinsicSvgHeight = 2523;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-gradient-to-b from-bg-indigo-400 to-blue-300 dark:to-blue-950">
      <div className="flex flex-col items-center py-16">
        <h1 className="animate-accordion-down bg-gradient-to-tl from-slate-500 to-yellow-100 bg-clip-text py-4 text-4xl font-geistSans text-transparent sm:text-5xl md:text-6xl lg:text-8xl dark:from-blue-500 dark:to-cyan-300">
          Introducing
        </h1>
        <Image
          src={"/banner.svg"}
          alt={"Promotional banner for the 'Introducing' section"}
          width={intrinsicSvgWidth}
          height={intrinsicSvgHeight}
          priority
          className="h-auto w-64 sm:w-80 md:w-96 lg:w-[400px]"
          sizes="(max-width: 639px) 256px, (max-width: 767px) 320px, (max-width: 1023px) 384px, 400px"
        />
        <div className="py-16 lg:mb-20">
          <SignInButton className="animate-cyclone-bg rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-500 bg-[length:200%_auto] p-0 text-white shadow-lg hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-300 lg:flex lg:min-h-24 lg:items-center lg:justify-center dark:from-blue-600 dark:via-cyan-500 dark:to-teal-500 dark:hover:brightness-110 dark:focus-visible:ring-cyan-300">
            <span className="block select-none px-[1em] py-[0.75em] text-center text-4xl font-bold leading-tight tracking-tight font-geistSans sm:text-3xl md:text-4xl lg:text-5xl lg:py-[1.5em]">
              Let&apos;s Get Started
            </span>
          </SignInButton>
        </div>
      </div>
      
      <ShapeDivider />
    </div>
  );
};

export default Welcome;