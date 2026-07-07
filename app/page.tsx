import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import ProjectTabs from "@/components/ProjectTabs";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
      <div className="relative mx-auto w-full max-w-3xl flex-1 px-6 pt-[calc(7rem+env(safe-area-inset-top))]">
        <Header />
        <main className="space-y-[72px]">
          {/* Full-bleed photo marquee */}
          <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
            <Gallery />
          </section>

          {/* Full-bleed tabs + grids */}
          <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-6">
            <ProjectTabs />
          </section>

          {/* Contact card */}
          <section id="contact" className="py-16">
            <Contact />
          </section>
        </main>
      </div>
    </div>
  );
}
