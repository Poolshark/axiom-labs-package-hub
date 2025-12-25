import { ConvexClientProvider } from "@/providers";

export default function ConvexLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
