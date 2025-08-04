'use client';
import BasicBodyProvider from "@/components/providers/basic-body-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Body = () => {
    const router = useRouter();
    return ( 
    <BasicBodyProvider>
        <div className="min-h-screen w-full flex flex-col items-center px-4 py-8"> 
            <Button variant={'ghost'} size={'icon'} onClick={router.back} name="Go back"><ArrowLeft/></Button>

            <p>This is a dummy  chat</p>
            </div>

    </BasicBodyProvider>
     );
}
 
export default Body;