// app/contacts/page.tsx
import BasicPageProvider from "@/components/providers/basic-page-provider";
import Footer from "../components/footer";
import { Mail } from "lucide-react";
import Header from "../components/header-sign-out";
import { ContactForm } from "./contact-form";
const Contacts = () => {
    return ( 
        <BasicPageProvider header={<Header/>} footer={<Footer/>}>
            <main className="bg-background text-foreground">
                <div className="container mx-auto px-4 py-16 sm:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        
                        {/* Column 1: Informational Text */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                Contact Us
                            </h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                To ensure your message is delivered securely, we use Google to send emails directly from your account. Please fill out the form and sign in when prompted.
                            </p>
                            <div className="mt-8">
                               <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">Our Receiving Email</h3>
                                        <p className="text-primary font-medium">
                                            contact.cirql@gmail.com
                                        </p>
                                    </div>
                               </div>
                            </div>
                        </div>

                        {/* Column 2: The Contact Form */}
                        <div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </main>
        </BasicPageProvider>
     );
}
 
export default Contacts;