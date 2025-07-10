import { signOut } from "@aws-amplify/auth"

function handleSignOut() {
	signOut().catch((error) => {
		alert("Error signing out: " + error.message)
	})
}

export default function Logout() {
	return (
		<button
			className="w-full flex flex-row items-center justify-between text-lg p-4 rounded-sm cursor-pointer
			text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
			onClick={handleSignOut}
		>
			<span>Log Out</span>
		</button>
	)
}