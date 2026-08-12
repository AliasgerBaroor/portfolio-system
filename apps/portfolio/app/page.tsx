  import AboutDialog from "@/components/about-dialog/about-dialog";
import { FloatingClock } from "@/components/floating-clock/floating-clock";
import { FloatingItemCount } from "@/components/floating-item-count/floating-item-count";
import { FloatingNavigation, Navigation } from "@/components/floating-navigation";
  import Gallery from "@/components/gallery/gallery";
  import Header from "@/components/header/header"
  import { galleryItems } from "@/data/gallery";

  export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {

    return (
      <main className="min-h-screen bg-background">

        <section className="relative">

          <div className="fixed inset-x-0 top-10 z-[999] flex justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <Header />
            </div>
          </div>

          <section className="relative p-4">
            <FloatingItemCount total={galleryItems.length} />

            <Gallery items={galleryItems} />
            <div>Gallery removed</div>
          </section>

          <FloatingNavigation>

            <Navigation
              items={{
                category: [
                  {
                    id: "all",
                    label: "All",
                    icon: "grid",
                    size: 24
                  },
                  {
                    id: "web",
                    label: "Web",
                    icon: "web",
                    size: 24
                  },
                  {
                    id: "product",
                    label: "Product",
                    icon: "product",
                    size: 18
                  },
                  {
                    id: "brand",
                    label: "Brand",
                    icon: "brand",
                    size: 24
                  },
                  {
                    id: "app",
                    label: "App",
                    icon: "app",
                    size: 20
                  },
                ],
                actions: [
                  {
                    id: "work",
                    label: "",
                    icon: "work",
                    size: 24
                  },
                  {
                    id: "contact",
                    label: "",
                    icon: "contact",
                    size: 24
                  },
                ]
              }}
            />

          </FloatingNavigation>

          <FloatingClock />

          <AboutDialog />
        </section>

      </main>
    );
  }