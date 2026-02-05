// Location data for job preferences
export interface LocationData {
  [country: string]: {
    [state: string]: string[];
  };
}

export const LOCATION_DATA: LocationData = {
  USA: {
    California: [
      'San Francisco',
      'Los Angeles',
      'San Diego',
      'Sacramento',
      'San Jose',
      'Oakland',
      'Fresno',
      'Long Beach'
    ],
    'New York': [
      'New York City',
      'Buffalo',
      'Rochester',
      'Albany',
      'Syracuse'
    ],
    Texas: [
      'Austin',
      'Houston',
      'Dallas',
      'San Antonio',
      'Fort Worth',
      'El Paso'
    ],
    Florida: [
      'Miami',
      'Orlando',
      'Tampa',
      'Jacksonville',
      'Fort Lauderdale'
    ],
    Washington: [
      'Seattle',
      'Spokane',
      'Tacoma',
      'Vancouver',
      'Bellevue'
    ],
    Illinois: [
      'Chicago',
      'Aurora',
      'Naperville',
      'Rockford'
    ],
    Massachusetts: [
      'Boston',
      'Cambridge',
      'Worcester',
      'Springfield'
    ],
    Colorado: [
      'Denver',
      'Colorado Springs',
      'Aurora',
      'Boulder'
    ],
    Georgia: [
      'Atlanta',
      'Augusta',
      'Columbus',
      'Savannah'
    ],
    Pennsylvania: [
      'Philadelphia',
      'Pittsburgh',
      'Allentown',
      'Erie'
    ]
  },
  Canada: {
    Ontario: [
      'Toronto',
      'Ottawa',
      'Mississauga',
      'Hamilton',
      'London',
      'Kitchener',
      'Windsor'
    ],
    'British Columbia': [
      'Vancouver',
      'Victoria',
      'Burnaby',
      'Surrey',
      'Richmond',
      'Kelowna'
    ],
    Quebec: [
      'Montreal',
      'Quebec City',
      'Laval',
      'Gatineau',
      'Longueuil'
    ],
    Alberta: [
      'Calgary',
      'Edmonton',
      'Red Deer',
      'Lethbridge'
    ],
    Manitoba: [
      'Winnipeg',
      'Brandon',
      'Steinbach'
    ],
    Saskatchewan: [
      'Saskatoon',
      'Regina',
      'Prince Albert'
    ],
    'Nova Scotia': [
      'Halifax',
      'Dartmouth',
      'Sydney'
    ]
  }
};

// Helper functions
export const getCountries = (): string[] => {
  return Object.keys(LOCATION_DATA);
};

export const getStates = (country: string): string[] => {
  return country && LOCATION_DATA[country] ? Object.keys(LOCATION_DATA[country]) : [];
};

export const getCities = (country: string, state: string): string[] => {
  return country && state && LOCATION_DATA[country]?.[state] ? LOCATION_DATA[country][state] : [];
};

export const formatLocation = (city: string, state: string, country: string): string => {
  // Get state abbreviation for USA states
  const stateAbbreviations: { [key: string]: string } = {
    'California': 'CA',
    'New York': 'NY',
    'Texas': 'TX',
    'Florida': 'FL',
    'Washington': 'WA',
    'Illinois': 'IL',
    'Massachusetts': 'MA',
    'Colorado': 'CO',
    'Georgia': 'GA',
    'Pennsylvania': 'PA'
  };

  // Get province abbreviation for Canada
  const provinceAbbreviations: { [key: string]: string } = {
    'Ontario': 'ON',
    'British Columbia': 'BC',
    'Quebec': 'QC',
    'Alberta': 'AB',
    'Manitoba': 'MB',
    'Saskatchewan': 'SK',
    'Nova Scotia': 'NS'
  };

  const abbreviation = country === 'USA' 
    ? stateAbbreviations[state] || state
    : provinceAbbreviations[state] || state;

  return `${city}, ${abbreviation}, ${country}`;
};
