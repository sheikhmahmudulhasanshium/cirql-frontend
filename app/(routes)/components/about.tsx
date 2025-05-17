import { Button } from "@/components/ui/button";
import { ArrowBigRightIcon } from "lucide-react";

const About = () => {
    return ( 
                <div className="flex justify-between flex-col items-center">
                    About Element
                    <Button variant={'outline'} size={'lg'} className="text-xl h-12">Let&apos;s Get Started<ArrowBigRightIcon/></Button>
                </div>
     );
}
 
export default About;