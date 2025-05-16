'use client'
import { Button } from "@/components/ui/button"
import Footer from "./components/footer"
import Header from "./components/header"
//import Spline from '@splinetool/react-spline';

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center">
      <Header/>
      <Button>Click me</Button>
      <Footer/>
     {/* <div style={{ height: '100vh' }} >
            <Spline scene="https://prod.spline.design/i8eNphGELT2tDQVT/scene.splinecode" />
        </div>*/}
    </div>
  )
}
