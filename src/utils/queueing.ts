// Queueing Theory Utilities for M/M/c Model
// M/M/c: Poisson arrivals, exponential service times, c servers

export interface QueueingMetrics {
  expectedWaitTime: number; // in minutes
  utilizationRate: number; // percentage
  averageQueueLength: number;
  isEfficient: boolean;
}

export interface AppointmentSlot {
  time: string;
  available: boolean;
  estimatedWaitTime: number;
  type: 'normal' | 'emergency';
}

// Calculate M/M/c queueing metrics
export function calculateQueueingMetrics(
  arrivalRate: number, // patients per hour
  serviceRate: number, // patients per hour per doctor
  numServers: number // number of doctors
): QueueingMetrics {
  const rho = arrivalRate / (numServers * serviceRate); // utilization factor
  const utilizationRate = rho * 100;
  
  // For M/M/c queue, expected wait time in system (including service)
  const c = numServers;
  const lambda = arrivalRate;
  const mu = serviceRate;
  
  // Calculate P0 (probability of zero customers in system)
  let sum = 0;
  for (let n = 0; n < c; n++) {
    sum += Math.pow(lambda / mu, n) / factorial(n);
  }
  const term2 = (Math.pow(lambda / mu, c) / factorial(c)) * (1 / (1 - rho));
  const p0 = 1 / (sum + term2);
  
  // Expected number in queue (Lq)
  const lq = (Math.pow(lambda / mu, c) * rho) / (factorial(c) * Math.pow(1 - rho, 2)) * p0;
  
  // Expected wait time in queue (Wq) using Little's Law
  const expectedWaitTime = (lq / lambda) * 60; // convert to minutes
  
  return {
    expectedWaitTime: Math.max(0, expectedWaitTime),
    utilizationRate,
    averageQueueLength: lq,
    isEfficient: utilizationRate < 85 && expectedWaitTime < 30
  };
}

// Generate appointment slots with queueing considerations
export function generateAppointmentSlots(
  startTime: string,
  endTime: string,
  slotDuration: number = 30, // minutes
  bookedSlots: string[] = [],
  emergencySlots: number = 2
): AppointmentSlot[] {
  const slots: AppointmentSlot[] = [];
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  
  // Calculate base metrics for this doctor
  const arrivalRate = 8; // estimated patients per hour
  const serviceRate = 2; // patients per hour per doctor
  const metrics = calculateQueueingMetrics(arrivalRate, serviceRate, 1);
  
  let currentTime = start;
  let emergencyCount = 0;
  
  while (currentTime < end) {
    const timeString = formatTime(currentTime);
    const isBooked = bookedSlots.includes(timeString);
    const isEmergencySlot = emergencyCount < emergencySlots && currentTime < start + 4 * 60; // First 4 hours for emergency
    
    slots.push({
      time: timeString,
      available: !isBooked,
      estimatedWaitTime: isBooked ? 0 : metrics.expectedWaitTime,
      type: isEmergencySlot ? 'emergency' : 'normal'
    });
    
    if (isEmergencySlot) emergencyCount++;
    currentTime += slotDuration;
  }
  
  return slots;
}

// Distribute appointments across doctors using least-loaded algorithm
export function getOptimalDoctor(
  doctors: { id: string; currentLoad: number; maxCapacity: number }[]
): string | null {
  const availableDoctors = doctors.filter(d => d.currentLoad < d.maxCapacity);
  
  if (availableDoctors.length === 0) return null;
  
  // Sort by current load (ascending) to balance the queue
  availableDoctors.sort((a, b) => a.currentLoad - b.currentLoad);
  
  return availableDoctors[0].id;
}

// Check emergency slot availability
export function checkEmergencyAvailability(
  date: Date,
  specialty: string,
  maxEmergencySlots: number = 5
): Promise<boolean> {
  // This would typically check database for current emergency bookings
  // For now, return a simulated availability
  const currentHour = new Date().getHours();
  const isBusinessHours = currentHour >= 8 && currentHour <= 18;
  
  // Simulate some randomness in emergency availability
  const randomFactor = Math.random();
  return Promise.resolve(isBusinessHours && randomFactor > 0.3);
}

// Helper functions
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Get time slots for display in booking UI
export function getTimeSlots(): { value: string; label: string }[] {
  return [
    { value: '09:00', label: '9:00 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:30', label: '4:30 PM' },
  ];
}