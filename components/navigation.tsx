"use client"
import { Dispatch, SetStateAction, useState } from 'react';
import { MdCalendarMonth, MdOutlineAccountCircle } from "react-icons/md";
import { TbPill } from "react-icons/tb";
import { FiInfo } from "react-icons/fi";

const data = [
  { label: 'My Schedule', icon: MdCalendarMonth },
  { label: 'Medications', icon: TbPill },
  { label: 'About', icon: FiInfo },
];

export function Navigation({
  tab,
  setTab
}: Readonly<{
  tab: String;
  setTab: Dispatch<SetStateAction<string>>;
}>) {
  // const [active, setActive] = useState('My Schedule');

  const links = data.map((item) => (
    <button
      className="w-full flex flex-row items-center justify-between text-lg p-4 rounded-sm cursor-pointer
        text-gray-500 hover:text-black hover:bg-gray-100 data-active:bg-gray-300 data-active:text-black"
      data-active={item.label === tab || undefined}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setTab(item.label);
      }}
    >
      <span>{item.label}</span>
      <item.icon className="w-6 h-6" />
    </button>
  ));

  return (
    <nav className="w-1/5 p-4 h-full flex flex-col justify-between border-r-1 border-gray-300">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row items-center justify-between pb-4 border-b-1 border-gray-300">
          <h1 className="text-xl ">AI Prescription Planner</h1>
          <span className="text-sm rounded-md bg-gray-400 px-2 py-1 text-white">v1.0</span>
        </div>
        <div className="flex flex-col justify-stretch gap-y-4">
          {links}
        </div>
      </div>

      {/* TODO: add sign in functionality, not really necessary for the technical project though */}
      {/* <div className="pt-4 border-t-1 border-gray-300">
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <MdOutlineAccountCircle className={classes.linkIcon} stroke='15' />
          <span>Sign in to Sync Across Devices</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div> */}
    </nav>
  );
}