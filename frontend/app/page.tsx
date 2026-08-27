import { GovernmentBar } from "@/components/jjm/government-bar";
import { Hero } from "@/components/jjm/hero";
import { VillageFinder } from "@/components/jjm/village-finder";
import { WaterAtGlance } from "@/components/jjm/water-at-glance";
import { WaterQuality } from "@/components/jjm/water-quality";
import { WaterData } from "@/components/jjm/water-data";
import { Resources } from "@/components/jjm/resources";
import { AboutJJM } from "@/components/jjm/about-jjm";
import { ReportWaterProblem } from "@/components/jjm/report-water-problem";
import { Footer } from "@/components/jjm/footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafaf9]">

      <GovernmentBar />

      <Hero />

      <VillageFinder />
       
        <WaterAtGlance />

        <WaterQuality />
        
        <WaterData />

        <Resources />

        <AboutJJM />

        <ReportWaterProblem />

        <Footer />

      <section
        id="about"
        className="
          mx-auto
          max-w-[1200px]
          px-5
          py-24
          sm:px-7
          lg:px-10
        "
      >
        <div className="border-t border-[#e7e5e4] pt-10">
          <p className="text-[13px] leading-6 text-[#79716b]">
            Jal Jeevan Mission information, services and
            public resources.
          </p>
        </div>
      </section>

    </main>
  );
}