"use client"
import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs"
import dialogStyles from "./dialog.module.css";
import tabStyles from "./tabs.module.css";

export default function Login() {
	const [loggedIn, setLoggedIn] = useState(false);

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button className="w-full flex flex-row items-center justify-between text-lg
				p-4 rounded-sm cursor-pointer text-gray-500 hover:text-black hover:bg-gray-100"
				>
					Sign In to Save Data
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className={dialogStyles.Overlay} />
				<Dialog.Content className={dialogStyles.Content}>
					{/* Errors for accessibility issues otherwise */}
					<Dialog.Title hidden>
						Login
					</Dialog.Title>
					<Tabs.Root className={tabStyles.Root} defaultValue="tab1">
						<Tabs.List className={tabStyles.List} aria-label="Manage your account">
							<Tabs.Trigger className={tabStyles.Trigger} value="tab1">
								Log In
							</Tabs.Trigger>
							<Tabs.Trigger className={tabStyles.Trigger} value="tab2">
								Sign Up
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content className={tabStyles.Content} value="tab1">
							<fieldset className={tabStyles.Fieldset}>
								<label className={tabStyles.Label} htmlFor="email">
									Email
								</label>
								<input className={tabStyles.Input} name="email" id="email" type="email" />
							</fieldset>
							<fieldset className={tabStyles.Fieldset}>
								<label className={tabStyles.Label} htmlFor="password">
									Password
								</label>
								<input className={tabStyles.Input} id="password" type="password" name="password" />
							</fieldset>
							<div className="flex flex-row justify-between"
							>
								<button
									className="cursor-pointer text-sm text-blue-700"
									onClick={() => {
										alert("womp womp not implemented yet")
									}}
								>
									Forgot Password?
								</button>
								<button className={`${tabStyles.Button} green`}>Log In</button>
							</div>
						</Tabs.Content>
						<Tabs.Content className={tabStyles.Content} value="tab2">
							<p className={tabStyles.Text}>
								All of your data is encrypted so no one, not even I, can read it.
							</p>
							<fieldset className={tabStyles.Fieldset}>
								<label className={tabStyles.Label} htmlFor="email">
									Email
								</label>
								<input className={tabStyles.Input} name="email" id="email" type="email" />
							</fieldset>
							<fieldset className={tabStyles.Fieldset}>
								<label className={tabStyles.Label} htmlFor="password">
									Password
								</label>
								<input className={tabStyles.Input} id="password" type="password" name="password" />
							</fieldset>
							<div
								style={{ display: "flex", marginTop: 20, justifyContent: "flex-end" }}
							>
								<button className={`${tabStyles.Button} green`}>Sign Up</button>
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}