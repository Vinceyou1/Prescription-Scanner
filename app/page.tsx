"use client"
import About from "@/components/tabs/about";
import { Navigation } from "../components/navigation";
import { useState } from "react";
import MySchedule from "@/components/tabs/schedule/my-schedule";
import Medications from "@/components/tabs/medications/medications";
import { useAuth } from "@/contexts/AuthContext";
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
  const auth = useAuth();

  return (
    <div className="h-screen w-full flex flex-row items-stretch bg-white text-black">
      <Navigation tab={tab} setTab={setTab}/>
      <div className="w-4/5 bg-gray-100 p-8">
        {
          renderTab(tab, auth != null)
        }
      </div>
    </div>
  )
}
