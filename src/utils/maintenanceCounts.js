// Utility to aggregate maintenance request counts by property
export function getMaintenanceCountsByProperty(maintenanceRequests) {
  // Only count pending requests to match dashboard
  maintenanceRequests = maintenanceRequests.filter(req => req.status === 'pending');
  const counts = {};
  maintenanceRequests.forEach(req => {
    const propId = req.property;
    if (!counts[propId]) counts[propId] = 0;
    counts[propId]++;
  });
  return counts;
}
