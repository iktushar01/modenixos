import Footer from "@/components/modules/HomePage/footer";
import Navbar from "@/components/modules/HomePage/navbar";
import ChatWidget from "@/components/modules/HomePage/ChatWidget";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="marketing-shell min-h-screen bg-background text-foreground">
      <Navbar />
      {children}
      <Footer />
      <ChatWidget />
    </div>
  );
}