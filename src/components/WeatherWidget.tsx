import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Clock } from 'lucide-react';

interface WeatherData {
  city: string;
  temp: number | null;
  loading: boolean;
  error: string | null;
}

export const WeatherWidget: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData>({
    city: 'Buscando...',
    temp: null,
    loading: true,
    error: null
  });

  // Clock effect
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Weather and Geolocation effect
  useEffect(() => {
    let mounted = true;

    const fetchWeatherAndLocation = async (lat: number, lon: number) => {
      try {
        // 1. Get City Name
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
        );
        const geoData = await geoRes.json();
        const cityName = geoData.city || geoData.locality || geoData.principalSubdivision || 'Tu Ciudad';

        // 2. Get Temperature
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
        );
        const weatherData = await weatherRes.json();
        const temp = weatherData.current?.temperature_2m;

        if (mounted) {
          setWeather({
            city: cityName,
            temp: temp,
            loading: false,
            error: null
          });
        }
      } catch (err) {
        if (mounted) {
          setWeather(prev => ({ ...prev, loading: false, error: 'Sin conexión' }));
        }
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherAndLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          if (mounted) {
            setWeather({
              city: 'Local',
              temp: null,
              loading: false,
              error: 'Ubicación denegada'
            });
          }
        },
        // Using low accuracy is faster and enough for city-level weather
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setWeather(prev => ({ ...prev, loading: false, error: 'No soportado' }));
    }

    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex items-center gap-4 bg-[#0e0e13]/60 border border-[#3b494c]/50 rounded-full px-4 py-2 backdrop-blur-md shadow-lg transition-all hover:bg-[#0e0e13]/80 hover:border-[#0066ff]/30">
      
      {/* Location & Temp */}
      <div className="flex items-center gap-3 pr-4 border-r border-[#3b494c]/50">
        {weather.loading ? (
          <span className="text-[12px] text-[#849396] animate-pulse font-medium">Ubicando...</span>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-[#e4e1e9]">
              <MapPin className="w-3.5 h-3.5 text-[#0066ff]" />
              <span className="text-[12px] font-semibold tracking-wide truncate max-w-[100px]">
                {weather.city}
              </span>
            </div>
            
            {weather.temp !== null && (
              <div className="flex items-center gap-1 text-[#e4e1e9]">
                <Thermometer className="w-3.5 h-3.5 text-[#25D366]" />
                <span className="text-[12px] font-bold font-mono">
                  {Math.round(weather.temp)}°
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5 text-[#00e5ff]">
        <Clock className="w-4 h-4" />
        <span className="text-[14px] font-black font-mono tracking-wider">
          {time}
        </span>
      </div>

    </div>
  );
};
