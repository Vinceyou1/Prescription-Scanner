"use client"

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs"
import dialogStyles from "./dialog.module.css";
import tabStyles from "./tabs.module.css";
import { confirmSignUp, signIn, signUp } from "aws-amplify/auth"
import { useState } from "react";

async function Confirmation(email: string, setError: (error: string | null) => void) {
	const code = prompt("Please enter the confirmation code sent to your email: ");

	const { isSignUpComplete } = await confirmSignUp({
		username: email,
		confirmationCode: code || ""
	}).catch((error) => {
		alert("Error signing up: " + error.message);
		setError(error.message);
		return { isSignUpComplete: false, userId: null, nextStep: null };
	});

	if (isSignUpComplete) {
		alert("Sign up complete! You can now log in.");
	}
}

async function SignUp(email: string, password: string, setError: (error: string | null) => void) {
	await signUp({
		username: email,
		password: password
	}).catch((error) => {
		setError(error.message);
	});
}

async function SignIn(email: string, password: string, setError: (error: string | null) => void) {
	const { nextStep } = await signIn({
		username: email,
		password: password
	}).catch((error) => {
		setError(error.message);
		return { isSignUpComplete: false, userId: null, nextStep: null };
	});

	if (nextStep?.signInStep == "CONFIRM_SIGN_UP") {
		Confirmation(email, setError);
	}
}



export default function Login() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button className="w-full flex flex-row items-center justify-between text-lg
				p-4 rounded-sm cursor-pointer text-gray-500 hover:text-black hover:bg-gray-100"
				>
					Log In
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className={dialogStyles.Overlay} />
				<Dialog.Content className={dialogStyles.Content}>
					{/* Errors for accessibility issues otherwise */}
					<Dialog.Title hidden>
						Login
					</Dialog.Title>
					<Tabs.Root className={tabStyles.Root} defaultValue="tab1" onChange={() => {
						setError(null);
					}}>
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
							{error && <p className="text-red-500">Error: {error}</p>}
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
								<button className={tabStyles.Button} onClick={() => {
									setLoading(true);
									const email = (document.getElementById("email") as HTMLInputElement).value;
									const password = (document.getElementById("password") as HTMLInputElement).value;
									SignIn(email, password, setError).finally(() => {
										setLoading(false);
									});
								}}>
									{loading ? "Loading..." : "Log In"}
								</button>
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
							{error && <p className="text-red-500">Error: {error}</p>}
							<div
								style={{ display: "flex", marginTop: 20, justifyContent: "flex-end" }}
							>
								<button className={tabStyles.Button} onClick={() => {
									setLoading(true);
									const email = (document.getElementById("email") as HTMLInputElement).value;
									const password = (document.getElementById("password") as HTMLInputElement).value;
									SignUp(email, password, setError).finally(() => {
										setLoading(false)
									});
								}}>
									{loading ? "Loading..." : "Sign Up"}
								</button>
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}