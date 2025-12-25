"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const packages = [
	{
		name: "Convex Table",
		description: "",
		href: "convex-table",
	},
];

export default function ConvexTests() {
	const tasks = useQuery(api.users.get);

	console.log("tasks", tasks);

	return (
		<div className="flex flex-col items-center justify-center">
			<h1>Convex Related Packages</h1>
			{tasks?.map((task) => (
				<div key={task._id}>{task.name}</div>
			))}
		</div>
	);
}
