import { useEffect, useState, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// ================================
// Types
// ================================
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Address {
  state: string;
  district: string;
  city: string;
  pincode: string;
  country: string;
  fullAddress: string;
}

export type LocationDetails = Coordinates & Address;

// ================================
// Constants
// ================================
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/reverse';

// ================================
// Hook
// ================================
export const useLocation = () => {
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================================
  // Request Permission
  // ================================
  const requestPermission = async (): Promise<boolean> => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);

      return result === RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  };

  // ================================
  // Get Coordinates
  // ================================
  const getCoords = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        err => {
          console.log('Location Error:', err); // ADD THIS

          reject(err.message || 'Failed to get location');
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000,
        },
      );
    });
  };

  // ================================
  // Reverse Geocode
  // ================================
  const getAddress = async (lat: number, lng: number): Promise<Address> => {
    const res = await fetch(
      `${NOMINATIM_BASE_URL}?format=json&lat=${lat}&lon=${lng}`,
    );

    const data = await res.json();
    const addr = data?.address || {};

    return {
      state: addr.state || '',
      district: addr.county || addr.state_district || '',
      city: addr.city || addr.town || addr.village || addr.hamlet || '',
      pincode: addr.postcode || '',
      country: addr.country || '',
      fullAddress: data.display_name || '',
    };
  };

  // ================================
  // Main Function
  // ================================
  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      const coords = await getCoords();
      const address = await getAddress(coords.latitude, coords.longitude);

      const finalData: LocationDetails = {
        ...coords,
        ...address,
      };

      setLocation(finalData);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto fetch on mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);
  return {
    location,
    loading,
    error,
    refetch: fetchLocation,
  };
};
