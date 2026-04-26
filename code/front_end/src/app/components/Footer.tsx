import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="text-white mt-16" style={{ backgroundColor: '#0d1f1d' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1a7a6e' }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", color: 'white', fontSize: '14px' }}>M</span>
              </div>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: 'white' }}>MyStay</span>
            </div>
            <p style={{ color: '#7ab5af', lineHeight: '1.7' }}>
              A centralized platform for finding quality boarding places near University of Peradeniya.
            </p>
            <p className="mt-3 text-xs font-medium tracking-widest uppercase" style={{ color: '#e07b39' }}>
              Find Your Space.
            </p>
          </div>

          {/* Team */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase" style={{ color: '#2a9d8f' }}>
              Team Members
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#7ab5af' }}>
              <li>E/22/120 – A.S.V. Gunasiri</li>
              <li>E/22/001 – H.M.H.N. Aberathna</li>
              <li>E/22/027 – M.A.N.P. Anawarathne</li>
              <li>E/22/324 – P.H.D. Rathnasiri</li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase" style={{ color: '#2a9d8f' }}>
              Project Info
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: '#7ab5af' }}>
              <li>Course: CO2060 – Software Systems</li>
              <li>Department: Computer Engineering</li>
              <li>University: University of Peradeniya</li>
            </ul>
            <div className="mt-4">
              <a
                href="https://github.com/cepdnaclk/e22-co2060-MyStay-Boarding-Platform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                style={{ color: '#52b788' }}
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 text-center text-xs" style={{ borderTop: '1px solid rgba(42,157,143,0.15)', color: '#5a7874' }}>
          © 2026 MyStay · A CO2060 Software Systems Project · University of Peradeniya
        </div>
      </div>
    </footer>
  );
}
