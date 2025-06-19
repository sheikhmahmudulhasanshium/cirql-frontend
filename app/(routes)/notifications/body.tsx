import BasicBodyProvider from '@/components/providers/basic-body-provider';
import Announcements from '../components/announcement';

const Body = () => {
    
    return (
        <BasicBodyProvider>
            <Announcements/>
        </BasicBodyProvider>
        
    )
    
}
 
export default Body;