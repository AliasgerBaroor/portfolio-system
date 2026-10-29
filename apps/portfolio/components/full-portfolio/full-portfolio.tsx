  import { FloatingClock } from "@/components/floating-clock/floating-clock";
  import { FloatingItemCount } from "@/components/floating-item-count/floating-item-count";
  import { FloatingNavigation, Navigation } from "@/components/floating-navigation";
    import Gallery from "@/components/gallery/gallery";
    import Header from "@/components/header/header"
import { gallaries } from "@/data/gallery";
  import { FloatingLogout } from "../floating-logout/floating-logout";
import AboutSheet from "@/components/about/about-sheet";
import { useAboutDialogStore } from "@/stores/about-dialog-store";
import { useContactOpenDialogStore } from "@/stores/contact-dialog-store";
import ContactSheet from "../contact/ContactSheet";

    export default function DashboardLayout() {
      const aboutOpen = useAboutDialogStore(
        (state) => state.isOpen
      );
      const contactOpen = useContactOpenDialogStore(
        (state) => state.isOpen
      );

      const isPopupOpen = aboutOpen || contactOpen;

      return (
        <main className="min-h-screen bg-background">

          <section className="relative">
            <div className="gallery-background">
              {!isPopupOpen && (
                <div className="fixed inset-x-0 top-10 z-[999] flex justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    <Header />
                  </div>
                </div>
              )}
            </div>
            
            <section className="relative min-h-screen">
              <div className="fixed inset-0 z-0">
                <Gallery items={gallaries} />
              </div>

              <div className="relative z-50">
                <FloatingItemCount
                  total={gallaries.length}
                />
              </div>
            </section>

            <div className="relative z-50">
              <FloatingNavigation>
                <Navigation
                  items={{
                    category: [
                      {
                        id: "all",
                        label: "All",
                        icon: "grid",
                        size: 24,
                      },
                      {
                        id: "web",
                        label: "Web",
                        icon: "web",
                        size: 24,
                      },
                      {
                        id: "product",
                        label: "Product",
                        icon: "product",
                        size: 18,
                      },
                      {
                        id: "brand",
                        label: "Branding",
                        icon: "brand",
                        size: 24,
                      },
                      {
                        id: "app",
                        label: "App",
                        icon: "app",
                        size: 20,
                      },
                    ],

                    actions: [
                      {
                        id: "work",
                        label: "Visual",
                        icon: "work",
                        size: 24,
                      },
                      {
                        id: "contact",
                        label: "Details",
                        icon: "contact",
                        size: 24,
                      },
                    ],
                  }}
                />
              </FloatingNavigation>
            </div>
            <div
              className={`
    relative z-50
    ${isPopupOpen ? "hidden md:block" : ""}
  `}
            >
               <FloatingClock />
            </div>

                <AboutSheet />

                <ContactSheet />

            <div className="relative z-50">
              <FloatingLogout />
            </div>
            
          </section>

        </main>
      );
    }