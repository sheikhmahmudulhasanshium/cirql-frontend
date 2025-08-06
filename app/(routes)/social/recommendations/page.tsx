import type { Metadata } from 'next';
import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Body from "./body";

export const metadata: Metadata = {
  title: 'Recommendations',
  description: 'Discover people you might know based on your shared interests and connections.',
};

const RecommendationsPage = () => {
    return (  
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <Body />
        </BasicPageProvider>
    );
}
 
export default RecommendationsPage;