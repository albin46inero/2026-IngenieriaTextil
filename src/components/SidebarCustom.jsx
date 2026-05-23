import { NavLink } from "react-router";

/**
 * SidebarCustom — barra lateral para vistas con subnavegación.
 *
 * Props:
 *   title   {string}         — título de la sección  (ej: "Nosotros")
 *   links   {Array<{to, label, icon?}>} — lista de links del sidebar
 *
 * Uso:
 *   <SidebarCustom
 *     title="Nosotros"
 *     links={[
 *       { to: "/about",            label: "¿Quiénes somos?" },
 *       { to: "/about/mision",     label: "Misión" },
 *       { to: "/about/vision",     label: "Visión" },
 *       { to: "/about/objetivos",  label: "Objetivos" },
 *     ]}
 *   />
 */
export default function SidebarCustom({ title = "Sección", links = [] }) {
  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="sticky top-24 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Título del sidebar */}
        <div className="bg-primary px-4 py-3">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
            {title}
          </h2>
        </div>

        {/* Links de navegación */}
        <nav className="flex flex-col p-2 gap-0.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white font-medium"
                    : "text-gray-600 hover:bg-orange-50 hover:text-primary"
                }`
              }
            >
              {link.icon && <span className="shrink-0">{link.icon}</span>}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}