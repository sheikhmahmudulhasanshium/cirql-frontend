import BasicBodyProvider from "@/components/providers/basic-body-provider";

const Body = () => {
  return ( 
    <BasicBodyProvider>
      <div className=" flex flex-1 justify-between min-h-svh  w-full">
        home 
      </div>
    </BasicBodyProvider>
   );
}
 
export default Body;