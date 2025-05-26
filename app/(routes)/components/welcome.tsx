import Image from "next/image";

const Welcome = () => {
    // Option 1: If your SVG has a known intrinsic size and you want to display it responsively
    // Let's assume your banner.svg is intrinsically, for example, 800x800 (or any 1:1 aspect ratio).
    // You provide these intrinsic dimensions to `next/image` for correct aspect ratio handling.
    // Then, you control the *displayed* size using CSS classes.
    const intrinsicSvgWidth = 800; // Replace with your SVG's actual intrinsic width
    const intrinsicSvgHeight = 800; // Replace with your SVG's actual intrinsic height

    return (
        <div className="flex flex-col items-center py-16">
            <p className='text-4xl font-geistSans lg:text-8xl md:text-6xl sm:text-5xl bg-gradient-to-tl from-slate-500 to-yellow-100 dark:from-blue-500 dark:to-cyan-300 text-transparent bg-clip-text py-4 animate-accordion-down'>Introducing</p>

            {/* Optimized Image Component */}
            <Image
                src={"/banner.svg"} // Assumes banner.svg is in your /public directory
                alt={""} // 1. Descriptive alt text for accessibility
                width={intrinsicSvgWidth} // 2. Intrinsic width of the SVG file. Used for aspect ratio.
                height={intrinsicSvgHeight} // 3. Intrinsic height of the SVG file. Used for aspect ratio.
                priority // 4. Preload this image if it's critical and visible on initial load (LCP candidate). Removes default lazy loading.
                className="w-64 h-auto sm:w-80 md:w-96 lg:w-[400px]" // 5. Responsive display size using Tailwind. `h-auto` maintains aspect ratio.
                sizes="(max-width: 639px) 256px, (max-width: 767px) 320px, (max-width: 1023px) 384px, 400px" // 6. Inform the browser about image display size at different viewport widths.
                                                                                                            //    (256px = w-64, 320px = w-80, 384px = w-96, 400px for lg)
                                                                                                            //    While less critical for SVG file size, it's good practice.
            />

            {/*
            Alternative: If you want the image to always be a fixed size (e.g., 400x400) as in your original code:
            <Image
                src={"/banner.svg"}
                alt={"Eye-catching banner for the introduction section"}
                width={400} // Desired display width
                height={400} // Desired display height (ensure this matches SVG's aspect ratio or it will be letterboxed/cropped by CSS if object-fit is used)
                priority
                // sizes="400px" // If truly fixed, you can specify this
                // className="" // Add any additional styling if needed
            />
            */}
        </div>
     );
}

export default Welcome;