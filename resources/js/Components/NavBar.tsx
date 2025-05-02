import { Link, router } from "@inertiajs/react";

// Define props type
type NavBarProps = {
    auth?: { user?: { id: number; name: string } | null };
};

// ✅ Explicitly define the functional component with props
const NavBar: React.FC<NavBarProps> = ({ auth }) => {
    return (
        <nav className="my-4">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="text-blue-500 hover:underline">Home</Link>
                </li>
                {auth?.user && (
                    <>
                        <li>
                            <Link href="/farms" className="text-blue-500 hover:underline">Farms</Link>
                        </li>
                        <li>
                            <Link href="/animals" className="text-blue-500 hover:underline">Animals</Link>
                        </li>
                        <li>
                            <Link href="/dashboard" className="text-green-500 hover:underline">Dashboard</Link>
                        </li>
                    </>
                )}

                {auth?.user && (
                    <li>
                        <button
                            onClick={() => router.post("/logout")}
                            className="text-red-500 hover:underline"
                        >
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

// ✅ Properly export the component
export default NavBar;
