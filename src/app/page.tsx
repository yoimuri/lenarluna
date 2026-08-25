import { getSiteContent } from "@/lib/content";
import JsEnabled from "@/components/JsEnabled";
import { PhotoViewerProvider } from "@/components/PhotoViewer";
import Nav from "@/components/Nav";
import ProfileBand from "@/components/ProfileBand";
import SheetHeader from "@/components/SheetHeader";
import ServiceIndex from "@/components/ServiceIndex";
import Selects from "@/components/Selects";
import About from "@/components/About";
import Archive from "@/components/Archive";
import Videos from "@/components/Videos";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollEdgeFade from "@/components/ScrollEdgeFade";

export default function Home() {
  const { you, videos } = getSiteContent();

  return (
    <>
      <JsEnabled />
      <div id="top" />
      <Nav name={you.name} siteUrl={you.siteUrl} hasVideos={videos.length > 0} />
      <ScrollEdgeFade />
      <PhotoViewerProvider>
        <main>
          <ProfileBand />
          <SheetHeader />
          <ServiceIndex />
          <Selects />
          <About />
          <Archive />
          <Videos />
          <Contact />
        </main>
      </PhotoViewerProvider>
      <Footer />
    </>
  );
}
