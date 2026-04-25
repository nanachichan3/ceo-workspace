export function Footer() {
  const links = [
    { label: "About", href: "#" },
    { label: "Framework", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <footer className="w-full bg-cream border-t border-stone-200">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
            <span className="font-bold text-stone-900 text-lg">Self-Degree</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-stone-500 hover:text-stone-900 text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-stone-400 text-sm">
            &copy; {new Date().getFullYear()} Self-Degree. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
