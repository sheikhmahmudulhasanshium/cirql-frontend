import Image from "next/image";

const Welcome = () => {
    // Actual intrinsic dimensions of your banner.svg
    const intrinsicSvgWidth = 5187;
    const intrinsicSvgHeight = 2523;

    return (
        <div className="flex flex-col items-center py-16">
            <p className='text-4xl font-geistSans lg:text-8xl md:text-6xl sm:text-5xl bg-gradient-to-tl from-slate-500 to-yellow-100 dark:from-blue-500 dark:to-cyan-300 text-transparent bg-clip-text py-4 animate-accordion-down'>Introducing</p>

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
        </div>
     );
}

export default Welcome;