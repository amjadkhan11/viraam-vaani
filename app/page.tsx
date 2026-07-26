import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Notifications from "../components/Notifications";
import WhyChooseUs from "../components/WhyChooseUs";
import Courses from "../components/Courses";
import TopPerformers from "../components/TopPerformers";
import Footer from "../components/Footer";
import AdmissionPopup from "@/components/AdmissionPopup";
import StudentRow from "@/components/admin/StudentRow";
export default function Home() {
  return (
    <>
     
      <Hero />
      <Notifications />
      <WhyChooseUs />
      <Courses />
      <TopPerformers />
     <AdmissionPopup />
    </>
  );
}