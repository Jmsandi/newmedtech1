import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Calendar,
  User,
  Beaker,
  Settings,
  UserCheck,
  TestTube,
  FileText,
  Activity,
  Shield,
  Truck,
  TrendingUp,
  Pill,
  Database,
  MessageSquare,
  Heart,
  AlertTriangle,
  Baby,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  // Typewriter animation state
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedDescription, setDisplayedDescription] = useState("");
  const [titleComplete, setTitleComplete] = useState(false);
  const [showTitleCursor, setShowTitleCursor] = useState(true);
  const [showDescCursor, setShowDescCursor] = useState(false);
  
  const fullTitle = "Hospital Management System";
  const fullDescription = "A comprehensive solution for hospitals to efficiently manage patients, doctors, appointments, and medical records across Africa.";
  
  useEffect(() => {
    // Title typing animation
    let titleIndex = 0;
    const titleTimer = setInterval(() => {
      if (titleIndex < fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, titleIndex + 1));
        titleIndex++;
      } else {
        clearInterval(titleTimer);
        setTitleComplete(true);
        setShowTitleCursor(false);
        setShowDescCursor(true);
      }
    }, 50); // Adjust speed here (lower = faster)
    
    return () => clearInterval(titleTimer);
  }, []);
  
  useEffect(() => {
    // Description typing animation starts after title is complete
    if (titleComplete) {
      let descIndex = 0;
      const descTimer = setInterval(() => {
        if (descIndex < fullDescription.length) {
          setDisplayedDescription(fullDescription.slice(0, descIndex + 1));
          descIndex++;
        } else {
          clearInterval(descTimer);
          setShowDescCursor(false);
        }
      }, 50); // Faster typing for description
      
      return () => clearInterval(descTimer);
    }
  }, [titleComplete]);

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/african-healthcare-background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-blue-900/50 to-purple-900/60"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <header className="container mx-auto py-6 px-4 animate-slideDown">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src="/logo.svg" alt="MedTech Care Logo" className="h-8 w-8 animate-spin-slow" />
                <h1 className="text-2xl font-bold ml-2 text-white drop-shadow-lg">MedTech Care</h1>
              </div>
            </div>
          </header>
        
        <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl min-h-[1.2em]">
            {displayedTitle}
            {showTitleCursor && (
              <span className="animate-pulse text-emerald-400">|</span>
            )}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8 drop-shadow-lg min-h-[3.5em] flex items-start justify-center">
            <span>
              {displayedDescription}
              {showDescCursor && (
                <span className="animate-pulse text-emerald-400">|</span>
              )}
            </span>
          </p>
          
          {/* Get Started Button */}
          <div className="mb-16 animate-fadeInUp animation-delay-300">
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-2xl text-lg px-10 py-4 rounded-full transform hover:scale-105 transition-all duration-300 border-0" 
              size="lg" 
              onClick={() => navigate("/login")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl animate-fadeInUp animation-delay-500">
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700"></div>
              <div className="relative p-8 text-center">
                <div className="bg-white/20 p-4 rounded-full inline-block mb-6 group-hover:bg-white/30 transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Patient Management</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Efficiently register, track, and manage patient information with comprehensive medical records system.
                </p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700"></div>
              <div className="relative p-8 text-center">
                <div className="bg-white/20 p-4 rounded-full inline-block mb-6 group-hover:bg-white/30 transition-all duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Appointment Scheduling</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Streamline appointment bookings with automated reminders and intelligent wait list management.
                </p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700"></div>
              <div className="relative p-8 text-center">
                <div className="bg-white/20 p-4 rounded-full inline-block mb-6 group-hover:bg-white/30 transition-all duration-300">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Doctor Management</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Manage doctor profiles, schedules, specialties and availability with real-time tracking.
                </p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600"></div>
              <div className="relative p-8 text-center">
                <div className="bg-white/20 p-4 rounded-full inline-block mb-6 group-hover:bg-white/30 transition-all duration-300">
                  <Beaker className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Laboratory Services</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Track and manage test results, samples, and laboratory workflows with precision.
                </p>
              </div>
            </div>
          </div>

          {/* Comprehensive Features Section - optimized */}
          <div className="mt-32 max-w-7xl">
            <div className="text-center mb-20 animate-fadeInUp animation-delay-700">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Complete Healthcare Management Solution
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Discover all the powerful features designed to streamline healthcare operations across Africa
              </p>
            </div>

            {/* Admin Portal Features */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-white mb-12 text-center">
                <Settings className="inline-block mr-3 h-7 w-7" />
                Admin Portal Features
              </h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Users, title: "Patient Management", desc: "Complete patient registration, medical history tracking, and comprehensive patient profiles with search and filtering capabilities.", gradient: "from-blue-500 to-cyan-600" },
                  { icon: User, title: "Doctor Management", desc: "Manage doctor profiles, specialties, schedules, availability, and performance tracking with comprehensive analytics.", gradient: "from-green-500 to-emerald-600" },
                  { icon: UserCheck, title: "Nurse Management", desc: "Nurse scheduling, shift management, patient assignments, and performance monitoring with role-based access control.", gradient: "from-purple-500 to-violet-600" },
                  { icon: Calendar, title: "Appointment System", desc: "Advanced scheduling with conflict detection, automated reminders, waitlist management, and real-time availability tracking.", gradient: "from-orange-500 to-red-500" },
                  { icon: TestTube, title: "Laboratory Management", desc: "Test ordering, result tracking, sample management, quality control, and integration with external lab systems.", gradient: "from-pink-500 to-rose-600" },
                  { icon: FileText, title: "Medical Records", desc: "Digital medical records, treatment history, prescription tracking, and secure document management with audit trails.", gradient: "from-indigo-500 to-purple-600" }
                ].map((item, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}></div>
                    <div className="relative p-8">
                      <div className="bg-white/20 p-3 rounded-xl inline-block mb-6 group-hover:bg-white/30 transition-all duration-300">
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">{item.title}</h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Management Features */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-white mb-12 text-center">
                <Shield className="inline-block mr-3 h-7 w-7" />
                Emergency Team Management
              </h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Activity, title: "Emergency Dashboard", desc: "Real-time emergency status monitoring, active cases tracking, and resource allocation overview.", gradient: "from-red-500 to-pink-600" },
                  { icon: Users, title: "Team Coordination", desc: "Emergency team roster, role assignments, skill tracking, and availability management for rapid response.", gradient: "from-blue-500 to-indigo-600" },
                  { icon: Truck, title: "Resource Deployment", desc: "Equipment tracking, vehicle management, supply allocation, and deployment coordination for emergency responses.", gradient: "from-green-500 to-teal-600" },
                  { icon: TrendingUp, title: "Emergency Analytics", desc: "Response time analysis, outcome tracking, performance metrics, and improvement recommendations.", gradient: "from-purple-500 to-pink-600" }
                ].map((item, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}></div>
                    <div className="relative p-8">
                      <div className="bg-white/20 p-3 rounded-xl inline-block mb-6 group-hover:bg-white/30 transition-all duration-300">
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">{item.title}</h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pharmacy Management Features */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-white mb-12 text-center">
                <Pill className="inline-block mr-3 h-7 w-7" />
                Pharmacy Management Portal
              </h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: FileText, title: "Prescription Management", desc: "Digital prescriptions, verification workflow, dispensing tracking, and prescription history management.", gradient: "from-blue-500 to-cyan-600" },
                  { icon: Database, title: "Inventory Control", desc: "Stock level monitoring, expiry date tracking, automated reordering, and supplier management systems.", gradient: "from-green-500 to-emerald-600" },
                  { icon: Users, title: "Patient Care Plans", desc: "Medication therapy management, adherence monitoring, and personalized treatment plan coordination.", gradient: "from-purple-500 to-violet-600" },
                  { icon: TestTube, title: "Lab Integration", desc: "Laboratory result monitoring, drug interaction checking, and clinical decision support integration.", gradient: "from-red-500 to-rose-600" },
                  { icon: MessageSquare, title: "Communication Hub", desc: "Secure messaging with healthcare providers, patient consultation coordination, and clinical communications.", gradient: "from-yellow-500 to-orange-500" },
                  { icon: TrendingUp, title: "Pharmacy Analytics", desc: "Sales reporting, medication utilization analysis, cost management, and performance dashboards.", gradient: "from-indigo-500 to-purple-600" }
                ].map((item, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}></div>
                    <div className="relative p-8">
                      <div className="bg-white/20 p-3 rounded-xl inline-block mb-6 group-hover:bg-white/30 transition-all duration-300">
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">{item.title}</h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialized Health Programs */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-white mb-12 text-center">
                <Heart className="inline-block mr-3 h-7 w-7" />
                Specialized Health Programs
              </h3>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-red-600"></div>
                  <div className="relative p-10">
                    <div className="flex items-center mb-8">
                      <div className="bg-white/20 p-4 rounded-xl mr-6 group-hover:bg-white/30 transition-all duration-300">
                        <Baby className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-2xl font-semibold text-white">Maternal Mortality Control</h4>
                    </div>
                    <ul className="text-white/90 text-sm space-y-3 leading-relaxed">
                      <li>• Prenatal care tracking and monitoring</li>
                      <li>• High-risk pregnancy identification and management</li>
                      <li>• Birth outcome recording and analysis</li>
                      <li>• Maternal health education and support programs</li>
                      <li>• Real-time alerts for critical maternal conditions</li>
                      <li>• Community health worker coordination</li>
                    </ul>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500"></div>
                  <div className="relative p-10">
                    <div className="flex items-center mb-8">
                      <div className="bg-white/20 p-4 rounded-xl mr-6 group-hover:bg-white/30 transition-all duration-300">
                        <AlertTriangle className="h-10 w-10 text-white" />
                      </div>
                      <h4 className="text-2xl font-semibold text-white">Disease Outbreak Control</h4>
                    </div>
                    <ul className="text-white/90 text-sm space-y-3 leading-relaxed">
                      <li>• Real-time disease surveillance and reporting</li>
                      <li>• Contact tracing and quarantine management</li>
                      <li>• Vaccination campaign coordination</li>
                      <li>• Public health alert systems</li>
                      <li>• Epidemiological data analysis and modeling</li>
                      <li>• Cross-border health monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology & Integration Features */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-white mb-12 text-center">
                <Settings className="inline-block mr-3 h-7 w-7" />
                Technology & Integration
              </h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Phone, title: "Mobile Access", desc: "Responsive design for smartphones and tablets, enabling healthcare access in remote areas.", gradient: "from-blue-500 to-indigo-600" },
                  { icon: Database, title: "Data Security", desc: "HIPAA-compliant security, encrypted data storage, and comprehensive audit trails for patient privacy.", gradient: "from-green-500 to-teal-600" },
                  { icon: MapPin, title: "Multi-Location", desc: "Support for multiple hospital locations, clinics, and health centers with centralized management.", gradient: "from-purple-500 to-pink-600" },
                  { icon: Clock, title: "24/7 Operations", desc: "Round-the-clock system availability with real-time monitoring and automated backup systems.", gradient: "from-yellow-500 to-orange-500" }
                ].map((item, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}></div>
                    <div className="relative p-8">
                      <div className="bg-white/20 p-3 rounded-xl inline-block mb-6 group-hover:bg-white/30 transition-all duration-300">
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">{item.title}</h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        
        <footer className="container mx-auto py-6 px-4 border-t border-white/30">
          <div className="text-center text-white/80">
            <p>© 2025 MedTech Hospital Management System. All rights reserved.</p>
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
