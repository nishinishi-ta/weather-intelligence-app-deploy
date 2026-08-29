import React from 'react';
import {
  Sun,
  SunMedium,
  SunDim,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudHail,
  CloudLightning,
  Zap,
  Wind,
  Umbrella,
  Thermometer,
  Eye,
  Droplets,
  Compass,
  Gauge,
  Sunrise,
  Sunset,
  Footprints,
  Bike,
  Utensils,
  Mountain,
  Camera,
  Sparkles,
  Shirt,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
  isDay?: number | boolean;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  isDay = 1,
  className = 'w-6 h-6',
  ...props
}) => {
  const isNight = isDay === 0 || (typeof isDay === 'boolean' && !isDay);

  // Handle day/night adaptation for sun vs moon
  let iconComponent = Sun;

  switch (name) {
    case 'Sun':
    case 'SunMedium':
    case 'SunDim':
      iconComponent = isNight ? Moon : SunMedium;
      break;
    case 'CloudSun':
      iconComponent = isNight ? CloudMoon : CloudSun;
      break;
    case 'Cloud':
      iconComponent = Cloud;
      break;
    case 'CloudFog':
      iconComponent = CloudFog;
      break;
    case 'CloudDrizzle':
      iconComponent = CloudDrizzle;
      break;
    case 'CloudRain':
      iconComponent = CloudRain;
      break;
    case 'CloudSunRain':
      iconComponent = isNight ? CloudRain : CloudSun;
      break;
    case 'CloudRainWind':
      iconComponent = CloudRainWind;
      break;
    case 'CloudSnow':
      iconComponent = CloudSnow;
      break;
    case 'Snowflake':
      iconComponent = Snowflake;
      break;
    case 'CloudHail':
      iconComponent = CloudHail;
      break;
    case 'CloudLightning':
      iconComponent = CloudLightning;
      break;
    case 'Zap':
      iconComponent = Zap;
      break;
    case 'Wind':
      iconComponent = Wind;
      break;
    case 'Umbrella':
      iconComponent = Umbrella;
      break;
    case 'Thermometer':
      iconComponent = Thermometer;
      break;
    case 'Eye':
      iconComponent = Eye;
      break;
    case 'Droplets':
      iconComponent = Droplets;
      break;
    case 'Compass':
      iconComponent = Compass;
      break;
    case 'Gauge':
      iconComponent = Gauge;
      break;
    case 'Sunrise':
      iconComponent = Sunrise;
      break;
    case 'Sunset':
      iconComponent = Sunset;
      break;
    case 'Footprints':
      iconComponent = Footprints;
      break;
    case 'Bike':
      iconComponent = Bike;
      break;
    case 'Utensils':
      iconComponent = Utensils;
      break;
    case 'Mountain':
      iconComponent = Mountain;
      break;
    case 'Camera':
      iconComponent = Camera;
      break;
    case 'Sparkles':
      iconComponent = Sparkles;
      break;
    case 'Shirt':
      iconComponent = Shirt;
      break;
    default:
      iconComponent = HelpCircle;
      break;
  }

  const IconToRender = iconComponent;
  return <IconToRender className={className} {...props} />;
};
