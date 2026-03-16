import { Github, Mail, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MyStay</h3>
            <p className="text-gray-400">
              A centralized platform for finding boarding places near University of Peradeniya.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Team Members</h3>
            <ul className="space-y-2 text-gray-400">
              <li>E/22/120 – A.S.V. Gunasiri</li>
              <li>E/22/001 – H.M.H.N. Aberathna</li>
              <li>E/22/027 – M.A.N.P. Anawarathne</li>
              <li>E/22/324 – P.H.D. Rathnasiri</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Project Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Course: CO2060 – Software Systems</li>
              <li>Department: Computer Engineering</li>
              <li>University: University of Peradeniya</li>
            </ul>
            <div className="mt-4">
              <a 
                href="https://github.com/cepdnaclk/e22-co2060-MyStay-Boarding-Platform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2026 MyStay. A CO2060 Software Systems Project.</p>
        </div>
      </div>
    </footer>
  );
}
