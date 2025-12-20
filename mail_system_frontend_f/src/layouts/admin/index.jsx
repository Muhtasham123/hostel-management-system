import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import Mail from "../../views/admin/mail/index"
import ViewMail from "../../views/admin/viewmail/index"
import ViewScheduledMail from "../../views/admin/scheduledmails/components/ViewMail"
import AddHostel from "../../views/admin/hostels/components/form"

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    if (window.location.pathname.includes("view")) {
    setCurrentRoute("View Mail");
  }
    else if (window.location.pathname.includes("mail")) {
      setCurrentRoute("Compose Mail");
    } else if (window.location.pathname.includes("schedule")){
      setCurrentRoute("Schedule Mail");
    }
    else if (window.location.pathname.includes("hostel/add")) {
      setCurrentRoute("Add Hostel");
    }

    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    const newRoutes = routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      }else {
        return null;
      }
    });

    newRoutes.push(<Route path={`/mail/:recipients?`} element={<Mail/>} />)
    newRoutes.push(<Route path={`/scheduleMail/:recipients?`} element={<Mail />} />)
    newRoutes.push(<Route path={`/viewMail/:id?`} element={<ViewMail />} />)
    newRoutes.push(<Route path={`/view/scheduled-mail/:id?`} element={<ViewScheduledMail />} />)
    newRoutes.push(<Route path={`/hostel/add`} element={<AddHostel reqType="post" data={null}/>} />)

    return newRoutes
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}

                <Route
                  path="/"
                  element={<Navigate to="/admin/hostels" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
