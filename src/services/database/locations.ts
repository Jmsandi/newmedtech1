import { getAllDocsByType, getDocById, addDoc, updateDoc, deleteDoc } from './core';
import { 
  Location, 
  LocationTransfer, 
  MultiLocationUser, 
  LocationSettings,
  Patient,
  Doctor,
  Nurse,
  Appointment,
  LabTest,
  LabRequest
} from './types';

// Location Management
export const getAllLocations = () => getAllDocsByType<Location>('location');
export const getLocationById = (id: string) => getDocById<Location>(id);
export const createLocation = (location: Omit<Location, '_id'>) => {
  const newLocation: Location = {
    ...location,
    _id: `location_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return addDoc(newLocation);
};
export const updateLocation = (location: Location) => {
  const updatedLocation = {
    ...location,
    updatedAt: new Date().toISOString()
  };
  return updateDoc(updatedLocation);
};
export const deleteLocation = (id: string, rev: string) => deleteDoc(id, rev);

// Location Hierarchy Management
export const getLocationHierarchy = async (): Promise<Location[]> => {
  const allLocations = await getAllLocations();
  
  // Sort by hierarchy (main hospitals first, then children)
  const buildHierarchy = (parentId: string | undefined = undefined): Location[] => {
    const children = allLocations.filter(loc => loc.parentLocationId === parentId);
    return children.sort((a, b) => a.name.localeCompare(b.name));
  };
  
  const mainLocations = buildHierarchy();
  const result: Location[] = [];
  
  const addWithChildren = (location: Location, level = 0) => {
    result.push({ ...location, level } as Location & { level: number });
    const children = buildHierarchy(location._id);
    children.forEach(child => addWithChildren(child, level + 1));
  };
  
  mainLocations.forEach(location => addWithChildren(location));
  return result;
};

export const getLocationsByType = async (locationType: Location['locationType']): Promise<Location[]> => {
  const allLocations = await getAllLocations();
  return allLocations.filter(location => location.locationType === locationType);
};

export const getLocationsByParent = async (parentId: string): Promise<Location[]> => {
  const allLocations = await getAllLocations();
  return allLocations.filter(location => location.parentLocationId === parentId);
};

export const getLocationStatistics = async (locationId: string) => {
  const location = await getLocationById(locationId);
  if (!location) throw new Error('Location not found');
  
  // Get all related data for this location
  const [patients, doctors, nurses, appointments, labTests] = await Promise.all([
    getAllDocsByType<Patient>('patient'),
    getAllDocsByType<Doctor>('doctor'),
    getAllDocsByType<Nurse>('nurse'),
    getAllDocsByType<Appointment>('appointment'),
    getAllDocsByType<LabTest>('labTest')
  ]);
  
  // Filter by location
  const locationPatients = patients.filter(p => p.registeredLocationId === locationId || p.currentLocationId === locationId);
  const locationDoctors = doctors.filter(d => d.primaryLocationId === locationId || d.workingLocations?.includes(locationId));
  const locationNurses = nurses.filter(n => n.assignedLocationId === locationId || n.accessibleLocations?.includes(locationId));
  const locationAppointments = appointments.filter(a => a.locationId === locationId);
  const locationLabTests = labTests.filter(l => l.locationId === locationId);
  
  return {
    location,
    statistics: {
      totalPatients: locationPatients.length,
      activePatients: locationPatients.filter(p => p.currentLocationId === locationId).length,
      totalDoctors: locationDoctors.length,
      totalNurses: locationNurses.length,
      todayAppointments: locationAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
      pendingLabTests: locationLabTests.filter(l => l.status === 'Pending').length,
      bedOccupancy: {
        total: location.capacity.totalBeds,
        occupied: location.capacity.totalBeds - location.capacity.availableBeds,
        available: location.capacity.availableBeds,
        occupancyRate: ((location.capacity.totalBeds - location.capacity.availableBeds) / location.capacity.totalBeds * 100).toFixed(1)
      }
    }
  };
};

// Location Transfer Management
export const getAllLocationTransfers = () => getAllDocsByType<LocationTransfer>('location-transfer');
export const getLocationTransferById = (id: string) => getDocById<LocationTransfer>(id);

export const createLocationTransfer = async (transfer: Omit<LocationTransfer, '_id'>): Promise<string> => {
  const newTransfer: LocationTransfer = {
    ...transfer,
    _id: `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  return await addDoc(newTransfer);
};

export const updateLocationTransfer = (transfer: LocationTransfer) => updateDoc(transfer);

export const approveLocationTransfer = async (transferId: string, approvedBy: string): Promise<void> => {
  const transfer = await getLocationTransferById(transferId);
  if (!transfer) throw new Error('Transfer not found');
  
  const updatedTransfer: LocationTransfer = {
    ...transfer,
    status: 'approved',
    approvedBy,
    updatedAt: new Date().toISOString()
  };
  
  await updateLocationTransfer(updatedTransfer);
};

export const completeLocationTransfer = async (transferId: string): Promise<void> => {
  const transfer = await getLocationTransferById(transferId);
  if (!transfer) throw new Error('Transfer not found');
  
  // Update patient's current location
  const patient = await getDocById<Patient>(transfer.patientId);
  if (patient) {
    const updatedPatient: Patient = {
      ...patient,
      currentLocationId: transfer.toLocationId,
      locationHistory: [
        ...(patient.locationHistory || []),
        transfer
      ]
    };
    await updateDoc(updatedPatient);
  }
  
  // Update transfer status
  const updatedTransfer: LocationTransfer = {
    ...transfer,
    status: 'completed',
    completedAt: new Date().toISOString()
  };
  
  await updateLocationTransfer(updatedTransfer);
};

export const getTransfersByLocation = async (locationId: string, type: 'incoming' | 'outgoing' | 'all' = 'all'): Promise<LocationTransfer[]> => {
  const allTransfers = await getAllLocationTransfers();
  
  switch (type) {
    case 'incoming':
      return allTransfers.filter(t => t.toLocationId === locationId);
    case 'outgoing':
      return allTransfers.filter(t => t.fromLocationId === locationId);
    default:
      return allTransfers.filter(t => t.toLocationId === locationId || t.fromLocationId === locationId);
  }
};

export const getPendingTransfers = async (): Promise<LocationTransfer[]> => {
  const allTransfers = await getAllLocationTransfers();
  return allTransfers.filter(t => t.status === 'pending');
};

// Multi-Location User Management
export const getAllMultiLocationUsers = () => getAllDocsByType<MultiLocationUser>('multi-location-user');
export const getMultiLocationUserById = (id: string) => getDocById<MultiLocationUser>(id);
export const getMultiLocationUserByUserId = async (userId: string): Promise<MultiLocationUser | null> => {
  const allUsers = await getAllMultiLocationUsers();
  return allUsers.find(u => u.userId === userId) || null;
};

export const createMultiLocationUser = (user: Omit<MultiLocationUser, '_id'>) => {
  const newUser: MultiLocationUser = {
    ...user,
    _id: `multi_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return addDoc(newUser);
};

export const updateMultiLocationUser = (user: MultiLocationUser) => {
  const updatedUser = {
    ...user,
    updatedAt: new Date().toISOString()
  };
  return updateDoc(updatedUser);
};

export const grantLocationAccess = async (userId: string, locationId: string, permissions: MultiLocationUser['permissions'][string]): Promise<void> => {
  let multiUser = await getMultiLocationUserByUserId(userId);
  
  if (!multiUser) {
    // Create new multi-location user record
    multiUser = {
      _id: `multi_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'multi-location-user',
      userId,
      primaryLocationId: locationId,
      accessibleLocations: [locationId],
      permissions: {
        [locationId]: permissions
      },
      role: 'staff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await addDoc(multiUser);
  } else {
    // Update existing record
    const updatedUser: MultiLocationUser = {
      ...multiUser,
      accessibleLocations: [...new Set([...multiUser.accessibleLocations, locationId])],
      permissions: {
        ...multiUser.permissions,
        [locationId]: permissions
      },
      updatedAt: new Date().toISOString()
    };
    await updateMultiLocationUser(updatedUser);
  }
};

export const revokeLocationAccess = async (userId: string, locationId: string): Promise<void> => {
  const multiUser = await getMultiLocationUserByUserId(userId);
  if (!multiUser) return;
  
  const updatedUser: MultiLocationUser = {
    ...multiUser,
    accessibleLocations: multiUser.accessibleLocations.filter(id => id !== locationId),
    permissions: Object.fromEntries(
      Object.entries(multiUser.permissions).filter(([id]) => id !== locationId)
    ),
    updatedAt: new Date().toISOString()
  };
  
  await updateMultiLocationUser(updatedUser);
};

export const getUserAccessibleLocations = async (userId: string): Promise<Location[]> => {
  const multiUser = await getMultiLocationUserByUserId(userId);
  if (!multiUser) return [];
  
  const allLocations = await getAllLocations();
  return allLocations.filter(location => 
    multiUser.accessibleLocations.includes(location._id)
  );
};

export const checkUserLocationPermission = async (
  userId: string, 
  locationId: string, 
  permission: keyof MultiLocationUser['permissions'][string]
): Promise<boolean> => {
  const multiUser = await getMultiLocationUserByUserId(userId);
  if (!multiUser) return false;
  
  const locationPermissions = multiUser.permissions[locationId];
  return locationPermissions ? locationPermissions[permission] : false;
};

// Location Settings Management
export const getAllLocationSettings = () => getAllDocsByType<LocationSettings>('location-settings');
export const getLocationSettingsById = (id: string) => getDocById<LocationSettings>(id);
export const getLocationSettingsByLocationId = async (locationId: string): Promise<LocationSettings | null> => {
  const allSettings = await getAllLocationSettings();
  return allSettings.find(s => s.locationId === locationId) || null;
};

export const createLocationSettings = (settings: Omit<LocationSettings, '_id'>) => {
  const newSettings: LocationSettings = {
    ...settings,
    _id: `settings_${settings.locationId}_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return addDoc(newSettings);
};

export const updateLocationSettings = (settings: LocationSettings) => {
  const updatedSettings = {
    ...settings,
    updatedAt: new Date().toISOString()
  };
  return updateDoc(updatedSettings);
};

// Centralized Management Functions
export const getCentralizedDashboardData = async () => {
  const [locations, transfers, multiUsers] = await Promise.all([
    getAllLocations(),
    getAllLocationTransfers(),
    getAllMultiLocationUsers()
  ]);
  
  const activeLocations = locations.filter(l => l.status === 'active');
  const pendingTransfers = transfers.filter(t => t.status === 'pending');
  const recentTransfers = transfers
    .filter(t => new Date(t.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Calculate aggregate statistics
  const totalBeds = activeLocations.reduce((sum, loc) => sum + loc.capacity.totalBeds, 0);
  const availableBeds = activeLocations.reduce((sum, loc) => sum + loc.capacity.availableBeds, 0);
  const totalStaff = activeLocations.reduce((sum, loc) => 
    sum + loc.staffCount.doctors + loc.staffCount.nurses + loc.staffCount.technicians, 0);
  
  return {
    summary: {
      totalLocations: activeLocations.length,
      pendingTransfers: pendingTransfers.length,
      totalUsers: multiUsers.length,
      systemHealth: 'operational' // Could be calculated based on various factors
    },
    capacity: {
      totalBeds,
      availableBeds,
      occupancyRate: ((totalBeds - availableBeds) / totalBeds * 100).toFixed(1)
    },
    locations: activeLocations,
    recentTransfers: recentTransfers.slice(0, 10),
    pendingTransfers: pendingTransfers.slice(0, 5)
  };
};

export const getLocationPerformanceMetrics = async (locationId: string, days = 30) => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
  
  const [transfers, appointments, labTests] = await Promise.all([
    getTransfersByLocation(locationId),
    getAllDocsByType<Appointment>('appointment'),
    getAllDocsByType<LabTest>('labTest')
  ]);
  
  const periodTransfers = transfers.filter(t => 
    new Date(t.createdAt) >= startDate && new Date(t.createdAt) <= endDate
  );
  
  const periodAppointments = appointments.filter(a => 
    a.locationId === locationId &&
    new Date(a.date) >= startDate && new Date(a.date) <= endDate
  );
  
  const periodLabTests = labTests.filter(l => 
    l.locationId === locationId &&
    new Date(l.requestDate) >= startDate && new Date(l.requestDate) <= endDate
  );
  
  return {
    period: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    transfers: {
      total: periodTransfers.length,
      incoming: periodTransfers.filter(t => t.toLocationId === locationId).length,
      outgoing: periodTransfers.filter(t => t.fromLocationId === locationId).length,
      avgProcessingTime: 0 // Could calculate based on created vs completed times
    },
    appointments: {
      total: periodAppointments.length,
      completed: periodAppointments.filter(a => a.status === 'completed').length,
      cancelled: periodAppointments.filter(a => a.status === 'cancelled').length,
      noShow: periodAppointments.filter(a => a.status === 'no-show').length
    },
    laboratory: {
      totalTests: periodLabTests.length,
      completed: periodLabTests.filter(l => l.status === 'Completed').length,
      pending: periodLabTests.filter(l => l.status === 'Pending').length,
      avgTurnaroundTime: 0 // Could calculate based on request vs completion times
    }
  };
};

// Emergency Location Coordination
export const findNearestLocationWithCapacity = async (
  currentLocationId: string,
  serviceRequired: keyof Location['services'],
  maxDistance = 50 // kilometers
): Promise<Location[]> => {
  const currentLocation = await getLocationById(currentLocationId);
  if (!currentLocation || !currentLocation.coordinates) {
    throw new Error('Current location not found or coordinates not available');
  }
  
  const allLocations = await getAllLocations();
  const suitableLocations = allLocations.filter(location => 
    location._id !== currentLocationId &&
    location.status === 'active' &&
    location.services[serviceRequired] &&
    location.capacity.availableBeds > 0 &&
    location.coordinates
  );
  
  // Calculate distances and sort by proximity
  const locationsWithDistance = suitableLocations.map(location => {
    const distance = calculateDistance(
      currentLocation.coordinates!.latitude,
      currentLocation.coordinates!.longitude,
      location.coordinates!.latitude,
      location.coordinates!.longitude
    );
    
    return { ...location, distance };
  }).filter(location => location.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
  
  return locationsWithDistance;
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
} 