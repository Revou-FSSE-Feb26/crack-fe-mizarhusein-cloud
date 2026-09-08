import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ScrollAnimator from "../../components/ScrollAnimator";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollAnimator />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
