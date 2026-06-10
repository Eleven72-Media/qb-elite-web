import { FieldHashMarks } from "@/components/marketing/field-hashmarks";
import { FloatingNav } from "@/components/marketing/floating-nav";
import { Footer } from "@/components/marketing/footer";

/**
 * Wraps every /preview/* route with the shared marketing chrome
 * (sticky nav up top, full-width footer at the bottom, plus a faint
 * football-field hashmark motif anchored to the viewport edges).
 * Each page supplies its own <main> with content sections in between.
 */
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FloatingNav />
      <FieldHashMarks />
      {children}
      <Footer />
    </>
  );
}
