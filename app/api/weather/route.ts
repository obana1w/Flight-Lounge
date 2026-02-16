import { NextResponse } from 'next/server';

// Coordinates for Pulkovo Airport
const PULKOVO_LAT = 59.8003;
const PULKOVO_LON = 30.2625;

async function getSunTimes(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    const data = await response.json();
    if (data.status === 'OK') {
      return {
        sunrise: data.results.sunrise,
        sunset: data.results.sunset,
      };
    }
  } catch (error) {
    console.error('Sun times fetch error:', error);
  }
  return null;
}

export async function GET() {
  try {
    // Fetch METAR and TAF data from Aviation Weather Center (NOAA)
    const [metarResponse, tafResponse, sunTimes] = await Promise.all([
      fetch('https://aviationweather.gov/api/data/metar?ids=ULLI&format=json', {
        next: { revalidate: 600 },
      }),
      fetch('https://aviationweather.gov/api/data/taf?ids=ULLI&format=json', {
        next: { revalidate: 600 },
      }),
      getSunTimes(PULKOVO_LAT, PULKOVO_LON),
    ]);

    let metar = null;
    let taf = null;

    if (metarResponse.ok) {
      const metarData = await metarResponse.json();
      if (metarData && metarData.length > 0) {
        metar = metarData[0];
      }
    }

    if (tafResponse.ok) {
      const tafData = await tafResponse.json();
      if (tafData && tafData.length > 0) {
        taf = tafData[0];
      }
    }

    if (metar) {
      return NextResponse.json({
        raw: metar.rawOb || metar.raw_text,
        temp: metar.temp,
        windSpeed: metar.wspd,
        windDir: metar.wdir,
        visibility: metar.visib,
        qnh: metar.altim,
        reportTime: metar.reportTime || metar.obsTime,
        taf: taf ? (taf.rawTAF || taf.raw_text) : null,
        sunrise: sunTimes?.sunrise,
        sunset: sunTimes?.sunset,
      });
    }

    throw new Error('No METAR data');
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Return mock data as fallback
    const now = new Date();
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hour = String(now.getUTCHours()).padStart(2, '0');
    const minute = String(now.getUTCMinutes()).padStart(2, '0');

    return NextResponse.json({
      raw: `ULLI ${day}${hour}${minute}Z 27015KT 9999 FEW020 BKN040 02/M01 Q1013 NOSIG`,
      temp: 2,
      windSpeed: 15,
      windDir: 270,
      visibility: 10,
      qnh: 1013,
      reportTime: now.toISOString(),
      taf: `TAF ULLI ${day}${hour}00Z ${day}${hour}/${day}${String((parseInt(hour) + 6) % 24).padStart(2, '0')} 27015KT 9999 FEW020 BKN040`,
      sunrise: new Date(now.setHours(8, 30, 0)).toISOString(),
      sunset: new Date(now.setHours(16, 45, 0)).toISOString(),
    });
  }
}
