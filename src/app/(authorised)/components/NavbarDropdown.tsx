"use client";
import {
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { signOut } from "next-auth/react";
import Link from "next/link";
interface NavBarDropdownProps {
	fullName: string;
	email: string | null;
}

function classNames(...classes: string[]): string {
	return classes.filter(Boolean).join(" ");
}

export default function NavBarDropdown({
	fullName,
	email,
}: NavBarDropdownProps) {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div className="flex justify-start items-center">
				<MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 text-sm font-semibold text-gray-900">
					<div className="flex flex-col !justify-start !items-start">
						<p className="text-sm">{fullName}</p>
						<p className="text-sm !font-thin">{email}</p>
					</div>
				</MenuButton>
			</div>

			<Transition
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<MenuItem>
							{({ focus }) => (
								<Link
									href="/profile"
									className={classNames(
										focus ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block w-full px-4 py-2 text-left text-sm"
									)}
								>
									Profile
								</Link>
							)}
						</MenuItem>
					</div>
					<div className="py-1">
						<MenuItem>
							{({ focus }) => (
								<button
									type="submit"
									className={classNames(
										focus ? "bg-gray-100 text-gray-900" : "text-gray-700",
										"block w-full px-4 py-2 text-left text-sm"
									)}
									onClick={() => signOut({ callbackUrl: "/" })}
								>
									Sign out
								</button>
							)}
						</MenuItem>
					</div>
				</MenuItems>
			</Transition>
		</Menu>
	);
}
