import { SignInButton } from "@/components/auth/sign-in-button";
import Image from "next/image";

const Welcome = () => {
    // Actual intrinsic dimensions of your banner.svg
    const intrinsicSvgWidth = 5187;
    const intrinsicSvgHeight = 2523;

    return (
        <div className="flex flex-col items-center py-16">
            <h1 className='text-4xl font-geistSans lg:text-8xl md:text-6xl sm:text-5xl bg-gradient-to-tl from-slate-500 to-yellow-100 dark:from-blue-500 dark:to-cyan-300 text-transparent bg-clip-text py-4 animate-accordion-down'>Introducing</h1>

            <Image
                src={"/banner.svg"} // Assumes banner.svg is in your /public directory
                // IMPORTANT: Remember to update this alt text to be descriptive!
                alt={"Promotional banner for the 'Introducing' section"} // Example - make it specific
                width={intrinsicSvgWidth}  // Using actual intrinsic width
                height={intrinsicSvgHeight} // Using actual intrinsic height
                priority // Good if visible above the fold
                className="w-64 h-auto sm:w-80 md:w-96 lg:w-[400px]" // Responsive display sizes
                sizes="(max-width: 639px) 256px, (max-width: 767px) 320px, (max-width: 1023px) 384px, 400px" // Matches className widths
            />

            <div className="py-16">
              <SignInButton
  className="
    rounded-xl
    bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-500
    dark:from-blue-600 dark:via-cyan-500 dark:to-teal-500
    bg-[length:200%_auto]
    animate-cyclone-bg
    hover:brightness-110
    dark:hover:brightness-110
    focus-visible:ring-2 focus-visible:ring-offset-2
    focus-visible:ring-emerald-300
    dark:focus-visible:ring-cyan-300
    shadow-lg
    text-white
    p-0
    lg:min-h-24
    lg:flex lg:items-center lg:justify-center
  "
>
  <span
    className="
      block
      text-4xl font-geistSans
      sm:text-3xl
      md:text-4xl
      lg:text-5xl
      leading-tight
      tracking-tight
      px-[1em]
      py-[0.75em]
      lg:py-[1.5em]
      font-bold
      select-none
      text-center
    "
  >
    Let&apos;s Get Started
  </span>
</SignInButton>
            </div>
        </div>
     );
}

export default Welcome;