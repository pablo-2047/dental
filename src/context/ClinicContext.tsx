import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Dentist {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  education: string;
  rating: number;
  reviewsCount: number;
  image: string;
  bio: string;
  availableDays: string[]; // ['Monday', 'Wednesday', 'Friday']
  availableSlots: string[]; // ['09:00 AM', '10:30 AM', '11:30 AM']
  shiftName: string; // 'Morning Shift' | 'Afternoon Shift' | 'Mid-day Shift'
}

export interface Service {
  id: string;
  name: string;
  category: 'cosmetic' | 'implant' | 'ortho' | 'general' | 'emergency';
  priceRange: string;
  visits: string;
  description: string;
  faq: { q: string; a: string }[];
  primaryDoctorId: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  patientEmail: string;
  dentistId: string;
  service: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'No-Show';
  notes?: string;
  treatmentPlan?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  allergies: string;
  medicalHistory: string;
  xrays: string[];
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  service: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Message {
  id: string;
  sender: 'patient' | 'clinic';
  text: string;
  timestamp: string;
}

export interface ClinicalTreatment {
  id: string;
  name: string;
  price: number;
}

interface ClinicContextType {
  dentists: Dentist[];
  services: Service[];
  appointments: Appointment[];
  patients: Patient[];
  invoices: Invoice[];
  messages: Message[];
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  bookAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (
    id: string, 
    status: Appointment['status'], 
    notes?: string, 
    treatmentPlan?: string,
    treatmentsPerformed?: string[]
  ) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'xrays'>) => Patient;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'date'>) => Invoice;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  sendClinicMessage: (text: string, sender: 'patient' | 'clinic') => void;
  uploadXRayToPatient: (patientId: string, xrayUrl: string) => void;
  clinicalTreatments: ClinicalTreatment[];
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial Dentist Data with Weekly Rotas and Shift Hours
  const dentists: Dentist[] = [
    {
      id: 'dr-vance',
      name: 'Dr. Sarah Vance',
      specialty: 'Cosmetic Dentistry & Veneers',
      experience: '15+ Years',
      education: 'Harvard School of Dental Medicine',
      rating: 4.9,
      reviewsCount: 312,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      bio: 'Dr. Vance is passionate about creating natural, beautiful smiles. She specializes in advanced cosmetic consultations, porcelain veneers, and laser teeth whitening checks.',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableSlots: ['09:00 AM', '10:30 AM', '11:30 AM'],
      shiftName: 'Morning Shift (09:00 AM - 01:00 PM)'
    },
    {
      id: 'dr-thorne',
      name: 'Dr. Marcus Thorne',
      specialty: 'Implantology & Oral Surgery',
      experience: '12+ Years',
      education: 'Stanford University School of Medicine',
      rating: 4.8,
      reviewsCount: 245,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      bio: 'Dr. Thorne is a leading surgeon in computer-guided implant restorations. Known for his gentle clinical consultation, he plans dental surgeries with zero patient anxiety.',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      availableSlots: ['02:00 PM', '03:30 PM', '05:00 PM'],
      shiftName: 'Afternoon Shift (02:00 PM - 06:00 PM)'
    },
    {
      id: 'dr-rostova',
      name: 'Dr. Elena Rostova',
      specialty: 'Orthodontics & Pediatric Care',
      experience: '8+ Years',
      education: 'Columbia University Dental Medicine',
      rating: 4.9,
      reviewsCount: 188,
      image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
      bio: 'Dr. Rostova specializes in clear aligner orthodontic design and pediatric checkups, ensuring that children and clear aligner patients enjoy a comforting consultation.',
      availableDays: ['Monday', 'Tuesday', 'Thursday'],
      availableSlots: ['10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
      shiftName: 'Mid-day Shift (10:30 AM - 04:30 PM)'
    }
  ];

  // 2. Initial Services Data simplified to Consultations purely
  const services: Service[] = [
    {
      id: 'gen-consult',
      name: 'General Dental Consultation',
      category: 'general',
      priceRange: '₹250',
      visits: '1 visit',
      description: 'Comprehensive dental charting, intraoral camera checkup, and custom treatment formulation. Crucial first step for diagnosing toothaches, gum issues, or routine checkups.',
      primaryDoctorId: 'dr-vance',
      faq: [
        { q: 'What is included in the dental checkup fee?', a: 'The consult fee covers physical dental examination, clinical recommendations, and a detailed diagnostic written treatment estimate. X-rays are charged separately.' },
        { q: 'How long does a general consultation take?', a: 'Typically 20 to 30 minutes, including complete dental checkup and review of medical history.' }
      ]
    },
    {
      id: 'cosmetic-consult',
      name: 'Cosmetic Smile Consultation',
      category: 'cosmetic',
      priceRange: '₹500',
      visits: '1 visit',
      description: 'Aesthetic examination targeting teeth whitening, gaps, veneers, or cosmetic contours. Get a complete custom smile makeover outline.',
      primaryDoctorId: 'dr-vance',
      faq: [
        { q: 'Will I get visual mockups of my smile?', a: 'Yes! During the consult, Dr. Vance utilizes smile styling software to show predicted natural improvements before veneers or whitening are applied.' }
      ]
    },
    {
      id: 'aligner-assess',
      name: 'Invisalign Aligner Assessment',
      category: 'ortho',
      priceRange: '₹500',
      visits: '1 visit',
      description: 'Orthodontic evaluation utilizing clear aligners (Invisalign) to straighten teeth. Includes specialized 3D teeth scan recommendations.',
      primaryDoctorId: 'dr-rostova',
      faq: [
        { q: 'Are aligners suitable for severe crowding?', a: 'Dr. Rostova will assess your teeth alignment. Most cases are easily treatable with Clear Aligners. If surgical brackets are required, she will consult you on other options.' }
      ]
    },
    {
      id: 'implant-consult',
      name: 'Dental Implant Consultation',
      category: 'implant',
      priceRange: '₹500',
      visits: '1 visit',
      description: 'Surgical diagnostic assessment for tooth replacement. Dr. Thorne checks jawbone thickness and takes virtual dental measurements for implant planning.',
      primaryDoctorId: 'dr-thorne',
      faq: [
        { q: 'Is dental implant surgery decided immediately?', a: 'No, surgery is never decided without a proper consultation. Dr. Thorne checks bone quality and plans custom guides first.' }
      ]
    },
    {
      id: 'pain-emergency',
      name: 'Emergency Consultation',
      category: 'emergency',
      priceRange: '₹750',
      visits: 'Same-day slot',
      description: 'Immediate appointment triage for active throbbing toothaches, bleeding gums, jaw injuries, or chipped crown replacements.',
      primaryDoctorId: 'dr-thorne',
      faq: [
        { q: 'Does this consult include immediate pain relief?', a: 'Yes, emergency visits focus on immediately relieving your pain through temporary treatments or medication, before a permanent treatment plan is chosen.' }
      ]
    }
  ];

  // Dental Treatments catalog decided by Doctor after consultation
  const clinicalTreatments: ClinicalTreatment[] = [
    { id: 'scaling-polish', name: 'Routine Scaling & Polish', price: 1499 },
    { id: 'root-canal', name: 'Root Canal Treatment (RCT)', price: 4500 },
    { id: 'composite-filling', name: 'Composite Tooth Filling', price: 1800 },
    { id: 'ceramic-crown', name: 'Ceramic Crown Fitting', price: 6500 },
    { id: 'dental-implant', name: 'Single Dental Implant', price: 35000 },
    { id: 'clear-aligners', name: 'Invisalign Clear Aligners', price: 80000 },
  ];

  // 3. Shared State Hooks with Mock Indian Databases
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activePatientId, setActivePatientId] = useState<string>(''); // Default: empty string (requires sign-in)

  // Load and initialize dummy database state
  useEffect(() => {
    const storedAppts = localStorage.getItem('dc_appointments_inr');
    const storedPatients = localStorage.getItem('dc_patients_inr');
    const storedInvoices = localStorage.getItem('dc_invoices_inr');
    const storedMessages = localStorage.getItem('dc_messages_inr');

    if (storedAppts && storedPatients && storedInvoices && storedMessages) {
      setAppointments(JSON.parse(storedAppts));
      setPatients(JSON.parse(storedPatients));
      setInvoices(JSON.parse(storedInvoices));
      setMessages(JSON.parse(storedMessages));
    } else {
      // Seed Initial Indian Patient Records
      const initialPatients: Patient[] = [
        {
          id: 'pat-1',
          name: 'Hammad Raza',
          age: 26,
          phone: '+91 98765 43210',
          email: 'hammad@example.com',
          allergies: 'Penicillin',
          medicalHistory: 'Mild asthma, otherwise healthy.',
          xrays: [
            'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=400'
          ]
        },
        {
          id: 'pat-2',
          name: 'Aisha Sharma',
          age: 34,
          phone: '+91 99988 77766',
          email: 'aisha.s@example.com',
          allergies: 'None',
          medicalHistory: 'Pregnant (2nd trimester).',
          xrays: []
        },
        {
          id: 'pat-3',
          name: 'Rohan Mehra',
          age: 42,
          phone: '+91 91234 56789',
          email: 'rohan.m@example.com',
          allergies: 'Sulfa Drugs',
          medicalHistory: 'High blood pressure (controlled via daily medication).',
          xrays: [
            'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=400'
          ]
        }
      ];

      // Format dates relative to current local time (2026-05-25)
      const initialAppointments: Appointment[] = [
        {
          id: 'appt-1',
          patientId: 'pat-1',
          patientName: 'Hammad Raza',
          patientAge: 26,
          patientPhone: '+91 98765 43210',
          patientEmail: 'hammad@example.com',
          dentistId: 'dr-vance',
          service: 'Cosmetic Smile Consultation',
          date: '2026-05-24', // Yesterday (Past)
          timeSlot: '10:30 AM',
          status: 'Completed',
          notes: 'Smile consultation completed. Discussed natural porcelain veneer options. Advised taking digital OPG x-ray.',
          treatmentPlan: 'Diagnostic smile makeup. Scheduled routine Scaling & Polish consult on next visit.'
        },
        {
          id: 'appt-2',
          patientId: 'pat-1',
          patientName: 'Hammad Raza',
          patientAge: 26,
          patientPhone: '+91 98765 43210',
          patientEmail: 'hammad@example.com',
          dentistId: 'dr-vance',
          service: 'General Dental Consultation',
          date: '2026-05-27', // Upcoming
          timeSlot: '09:00 AM',
          status: 'Confirmed',
          notes: 'Booked routine consultation slot with Dr. Vance.',
          treatmentPlan: 'Gently check teeth health. Educate regarding home care teeth flossing.'
        },
        {
          id: 'appt-3',
          patientId: 'pat-2',
          patientName: 'Aisha Sharma',
          patientAge: 34,
          patientPhone: '+91 99988 77766',
          patientEmail: 'aisha.s@example.com',
          dentistId: 'dr-rostova',
          service: 'General Dental Consultation',
          date: '2026-05-26', // Tomorrow (Upcoming)
          timeSlot: '11:30 AM',
          status: 'Confirmed',
          notes: 'General checkup consultation. Check gums sensitivity.',
          treatmentPlan: 'Standard visual diagnosis. Check signs of early maternal gum gingivitis.'
        },
        {
          id: 'appt-4',
          patientId: 'pat-3',
          patientName: 'Rohan Mehra',
          patientAge: 42,
          patientPhone: '+91 91234 56789',
          patientEmail: 'rohan.m@example.com',
          dentistId: 'dr-thorne',
          service: 'Dental Implant Consultation',
          date: '2026-05-28', // Upcoming
          timeSlot: '02:00 PM',
          status: 'Pending',
          notes: 'Consultation to evaluate lower right jaw single tooth replacement.',
          treatmentPlan: 'OPG x-ray assessment, check bone density parameters.'
        }
      ];

      const initialInvoices: Invoice[] = [
        {
          id: 'inv-1',
          patientId: 'pat-1',
          patientName: 'Hammad Raza',
          date: '2026-05-24',
          service: 'Cosmetic Smile Consultation',
          amount: 350,
          status: 'Paid'
        },
        {
          id: 'inv-2',
          patientId: 'pat-1',
          patientName: 'Hammad Raza',
          date: '2026-05-27',
          service: 'General Dental Consultation',
          amount: 250,
          status: 'Pending'
        },
        {
          id: 'inv-3',
          patientId: 'pat-3',
          patientName: 'Rohan Mehra',
          date: '2026-05-20',
          service: 'OPG Diagnostic X-ray',
          amount: 500,
          status: 'Paid'
        },
        {
          id: 'inv-4',
          patientId: 'pat-2',
          patientName: 'Aisha Sharma',
          date: '2026-05-10',
          service: 'General Consultation Checkup',
          amount: 250,
          status: 'Overdue'
        }
      ];

      const initialMessages: Message[] = [
        {
          id: 'msg-1',
          sender: 'patient',
          text: 'Hello! I wanted to check if you have parking available at the clinic location?',
          timestamp: '2026-05-25T09:30:00Z'
        },
        {
          id: 'msg-2',
          sender: 'clinic',
          text: 'Hi Hammad! Yes, we have dedicated underground parking for patients right below the DentalCare tower. Just show your appointment SMS to the security guard.',
          timestamp: '2026-05-25T09:35:00Z'
        },
        {
          id: 'msg-3',
          sender: 'patient',
          text: 'Perfect, thank you! See you tomorrow.',
          timestamp: '2026-05-25T09:40:00Z'
        }
      ];

      setPatients(initialPatients);
      setAppointments(initialAppointments);
      setInvoices(initialInvoices);
      setMessages(initialMessages);

      localStorage.setItem('dc_patients_inr', JSON.stringify(initialPatients));
      localStorage.setItem('dc_appointments_inr', JSON.stringify(initialAppointments));
      localStorage.setItem('dc_invoices_inr', JSON.stringify(initialInvoices));
      localStorage.setItem('dc_messages_inr', JSON.stringify(initialMessages));
    }
  }, []);

  // Synchronize state changes to LocalStorage
  const syncToLocalStorage = (appts: Appointment[], pats: Patient[], invs: Invoice[], msgs: Message[]) => {
    localStorage.setItem('dc_appointments_inr', JSON.stringify(appts));
    localStorage.setItem('dc_patients_inr', JSON.stringify(pats));
    localStorage.setItem('dc_invoices_inr', JSON.stringify(invs));
    localStorage.setItem('dc_messages_inr', JSON.stringify(msgs));
  };

  // Helper: Book Appointment (Adds to Shared state immediately)
  const bookAppointment = (newAppt: Omit<Appointment, 'id'>) => {
    const id = `appt-${Date.now()}`;
    const fullAppt: Appointment = { ...newAppt, id };
    
    // Check if patient exists, if not, create profile
    let patientObj = patients.find(p => p.email.toLowerCase() === newAppt.patientEmail.toLowerCase());
    let currentPatients = [...patients];

    if (!patientObj) {
      const newPatId = `pat-${Date.now()}`;
      patientObj = {
        id: newPatId,
        name: newAppt.patientName,
        age: newAppt.patientAge,
        phone: newAppt.patientPhone,
        email: newAppt.patientEmail,
        allergies: 'None declared',
        medicalHistory: 'New patient registered online.',
        xrays: []
      };
      currentPatients.push(patientObj);
      setPatients(currentPatients);
    }

    const updatedAppts = [...appointments, { ...fullAppt, patientId: patientObj.id }];
    setAppointments(updatedAppts);
    
    // Auto-create pending invoice for upcoming booked service in INR
    const serviceRate = services.find(s => s.name === newAppt.service)?.priceRange || '₹250';
    let baseAmount = 250;
    const match = serviceRate.match(/₹(\d+[\d,]*)/);
    if (match) {
      baseAmount = parseInt(match[1].replace(/,/g, ''));
    }

    const invoiceId = `inv-${Date.now()}`;
    const newInvoice: Invoice = {
      id: invoiceId,
      patientId: patientObj.id,
      patientName: newAppt.patientName,
      date: newAppt.date,
      service: newAppt.service,
      amount: baseAmount,
      status: 'Pending'
    };
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);

    syncToLocalStorage(updatedAppts, currentPatients, updatedInvoices, messages);
    return { ...fullAppt, patientId: patientObj.id };
  };

  // Helper: Update Appointment Status (Check-in, Complete, No-Show, update notes)
  const updateAppointmentStatus = (
    id: string, 
    status: Appointment['status'], 
    notes?: string, 
    treatmentPlan?: string,
    treatmentsPerformed?: string[]
  ) => {
    const updated = appointments.map(appt => {
      if (appt.id === id) {
        return {
          ...appt,
          status,
          ...(notes !== undefined ? { notes } : {}),
          ...(treatmentPlan !== undefined ? { treatmentPlan } : {})
        };
      }
      return appt;
    });
    setAppointments(updated);

    // If marked Completed, auto-update any Pending invoice for this appointment to Paid
    let updatedInvoices = [...invoices];
    const matchAppt = appointments.find(a => a.id === id);
    
    if (status === 'Completed' && matchAppt) {
      // Mark initial consultation invoice as Paid
      updatedInvoices = invoices.map(inv => {
        if (inv.patientId === matchAppt.patientId && inv.service === matchAppt.service && inv.status === 'Pending') {
          return { ...inv, status: 'Paid' };
        }
        return inv;
      });

      // If specific treatments were performed, automatically generate a new Paid invoice for them!
      if (treatmentsPerformed && treatmentsPerformed.length > 0) {
        treatmentsPerformed.forEach(tName => {
          const treatObj = clinicalTreatments.find(t => t.name === tName);
          const treatPrice = treatObj ? treatObj.price : 1500;
          
          const newInvoiceId = `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const today = new Date().toISOString().split('T')[0];
          
          updatedInvoices.push({
            id: newInvoiceId,
            patientId: matchAppt.patientId,
            patientName: matchAppt.patientName,
            date: today,
            service: tName,
            amount: treatPrice,
            status: 'Paid'
          });
        });
      }
      setInvoices(updatedInvoices);
    }

    syncToLocalStorage(updated, patients, updatedInvoices, messages);
  };

  // Helper: Add Patient manually (Walk-in creation)
  const addPatient = (patientData: Omit<Patient, 'id' | 'xrays'>) => {
    const id = `pat-${Date.now()}`;
    const newPat: Patient = { ...patientData, id, xrays: [] };
    const updated = [...patients, newPat];
    setPatients(updated);
    syncToLocalStorage(appointments, updated, invoices, messages);
    return newPat;
  };

  // Helper: Create Invoice manually
  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'date'>) => {
    const id = `inv-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newInv: Invoice = { ...invoiceData, id, date: today };
    const updated = [...invoices, newInv];
    setInvoices(updated);
    syncToLocalStorage(appointments, patients, updated, messages);
    return newInv;
  };

  // Helper: Update Invoice Status
  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    const updated = invoices.map(inv => (inv.id === id ? { ...inv, status } : inv));
    setInvoices(updated);
    syncToLocalStorage(appointments, patients, updated, messages);
  };

  // Helper: Patient portal chat sync
  const sendClinicMessage = (text: string, sender: 'patient' | 'clinic') => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toISOString()
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    syncToLocalStorage(appointments, patients, invoices, updated);
  };

  // Helper: Upload X-Ray image link
  const uploadXRayToPatient = (patientId: string, xrayUrl: string) => {
    const updated = patients.map(pat => {
      if (pat.id === patientId) {
        return { ...pat, xrays: [...pat.xrays, xrayUrl] };
      }
      return pat;
    });
    setPatients(updated);
    syncToLocalStorage(appointments, updated, invoices, messages);
  };

  return (
    <ClinicContext.Provider
      value={{
        dentists,
        services,
        appointments,
        patients,
        invoices,
        messages,
        activePatientId,
        setActivePatientId,
        bookAppointment,
        updateAppointmentStatus,
        addPatient,
        createInvoice,
        updateInvoiceStatus,
        sendClinicMessage,
        uploadXRayToPatient,
        clinicalTreatments
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within a ClinicProvider');
  return context;
};
