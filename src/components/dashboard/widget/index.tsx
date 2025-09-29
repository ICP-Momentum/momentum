import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TVNoise from '@/components/ui/tv-noise';

interface WidgetProps {
  widgetData?: {
    location?: string;
    timezone?: string;
    temperature?: string;
    weather?: string;
  };
}

interface LocationData {
  location: string;
  timezone: string;
  temperature: string;
  weather: string;
}

export default function Widget({ widgetData }: WidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationData, setLocationData] = useState<LocationData>({
    location: 'Loading...',
    timezone: 'UTC',
    temperature: '--°C',
    weather: 'Loading...',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        // Get user's IP-based location using ipapi.co (free, no API key needed)
        const locationResponse = await fetch('https://ipapi.co/json/');
        const locationInfo = await locationResponse.json();

        // Get timezone abbreviation
        const timezoneAbbr =
          new Date()
            .toLocaleTimeString('en-US', {
              timeZoneName: 'short',
              timeZone: locationInfo.timezone,
            })
            .split(' ')
            .pop() || 'UTC';

        // Get weather data using Open-Meteo (free, no API key needed)
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.latitude}&longitude=${locationInfo.longitude}&current=temperature_2m,weather_code&timezone=auto`
        );
        const weatherInfo = await weatherResponse.json();

        // Weather code mapping (simplified)
        const getWeatherDescription = (code: number) => {
          if (code === 0) return 'Clear';
          if (code <= 3) return 'Partly Cloudy';
          if (code <= 48) return 'Foggy';
          if (code <= 67) return 'Rainy';
          if (code <= 77) return 'Snowy';
          if (code <= 82) return 'Rainy';
          if (code <= 86) return 'Snowy';
          return 'Stormy';
        };

        setLocationData({
          location: `${locationInfo.city}, ${locationInfo.country_name}`,
          timezone: timezoneAbbr,
          temperature: `${Math.round(weatherInfo.current.temperature_2m)}°C`,
          weather: getWeatherDescription(weatherInfo.current.weather_code),
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching location/weather:', error);
        // Fallback to timezone-based location
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneOffset =
          new Date()
            .toLocaleTimeString('en-US', {
              timeZoneName: 'short',
              timeZone: userTimezone,
            })
            .split(' ')
            .pop() || 'UTC';

        const getLocationFromTimezone = (tz: string) => {
          const parts = tz.split('/');
          if (parts.length > 1) {
            return parts[parts.length - 1].replace(/_/g, ' ');
          }
          return tz.replace(/_/g, ' ');
        };

        setLocationData({
          location: getLocationFromTimezone(userTimezone),
          timezone: timezoneOffset,
          temperature: widgetData?.temperature || '--°C',
          weather: widgetData?.weather || 'Unknown',
        });
        setIsLoading(false);
      }
    };

    fetchLocationAndWeather();
  }, [widgetData]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    const restOfDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return { dayOfWeek, restOfDate };
  };

  const dateInfo = formatDate(currentTime);

  return (
    <Card className="w-full aspect-[2] relative overflow-hidden">
      <TVNoise opacity={0.3} intensity={0.2} speed={40} />
      <CardContent className="bg-accent/30 flex-1 flex flex-col justify-between text-sm font-medium uppercase relative z-20">
        <div className="flex justify-between items-center">
          <span className="opacity-50">{dateInfo.dayOfWeek}</span>
          <span>{dateInfo.restOfDate}</span>
        </div>
        <div className="text-center">
          <div className="text-5xl font-display" suppressHydrationWarning>
            {formatTime(currentTime)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="opacity-50">{locationData.temperature}</span>
          <span className={isLoading ? 'opacity-50' : ''}>{locationData.location}</span>

          <Badge variant="secondary" className="bg-accent">
            {locationData.timezone}
          </Badge>
        </div>

        <div className="absolute inset-0 -z-[1]">
          <img
            src="/assets/pc_blueprint.gif"
            alt="logo"
            width={250}
            height={250}
            className="size-full object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
}
