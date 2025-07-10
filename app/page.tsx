"use client"
import About from "@/components/tabs/about";
import { Navigation } from "../components/navigation";
import { useState } from "react";
import MySchedule from "@/components/tabs/my-schedule";
import Medications from "@/components/tabs/medications";
import { useUser } from "@/contexts/UserContext";
import PleaseLogin from "@/components/tabs/please-login";


function renderTab(tab: string, signedIn: boolean = false) {
  if(tab == "About") {
    return <About />;
  }
  if(!signedIn) {
    return (
      <PleaseLogin />
    )
  }
  switch(tab) {
    case 'My Schedule':
      return <MySchedule />;
    case 'Medications':
      return <Medications />;
  }
}


export default function Home() {
  const [tab, setTab] = useState("My Schedule");
  const user = useUser();

  return (
    <div className="w-full h-full flex flex-row bg-white text-black">
      <Navigation tab={tab} setTab={setTab}/>
      <div className="bg-gray-100 w-4/5 h-full p-8">
        {
          renderTab(tab, user != null)
        }
      </div>
    </div>
  )
}
