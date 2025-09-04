/**
 * Available PXWeb Datasets Configuration
 */
export const DATASETS = {
  // Demography Datasets
  'divorced-people-age': {
    id: 'divorced-people-age',
    name: 'Divorced People Age',
    description: 'Mean age of divorced people by gender',
    path: 'Gender%20Statistics/Demography/21_Mean_Age_of_Divorced_People.px',
    category: 'demography'
  },
  'population': {
    id: 'population',
    name: 'Population of Georgia',
    description: 'Population statistics of Georgia',
    path: 'Gender%20Statistics/Demography/01_Population_of_Georgia.px',
    category: 'demography'
  },
  'mean-age': {
    id: 'mean-age',
    name: 'Mean Age of Population',
    description: 'Mean age of population by gender',
    path: 'Gender%20Statistics/Demography/02_Mean_Age_of_Population.px',
    category: 'demography'
  },
  'live-births-age': {
    id: 'live-births-age',
    name: 'Live Births by Age',
    description: 'Live births by age of mother',
    path: 'Gender%20Statistics/Demography/06_Live_Births_by_Age_of_Mother.px',
    category: 'demography'
  },
  'life-expectancy': {
    id: 'life-expectancy',
    name: 'Life Expectancy',
    description: 'Life expectancy at birth by gender',
    path: 'Gender%20Statistics/Demography/16_Life_Expectancy_at_Birth.px',
    category: 'demography'
  },

  // Environmental Statistics Datasets
  // Air Pollution
  'air-pollution-tbilisi': {
    id: 'air-pollution-tbilisi',
    name: 'Air Pollution in Tbilisi',
    description: 'Air quality indicators and pollution levels in Tbilisi',
    path: 'Environment%20Statistics/Air%20Pollution/01_Air_Pollution_Tbilisi.px',
    category: 'environment'
  },
  'emissions-by-source': {
    id: 'emissions-by-source',
    name: 'Emissions by Source',
    description: 'Air pollutant emissions by source category',
    path: 'Environment%20Statistics/Air%20Pollution/02_Emissions_by_Source.px',
    category: 'environment'
  },

  // Waste Management
  'municipal-waste': {
    id: 'municipal-waste',
    name: 'Municipal Waste',
    description: 'Municipal waste generation and management statistics',
    path: 'Environment%20Statistics/Waste/01_Municipal_Waste.px',
    category: 'environment'
  },
  'waste-recycling': {
    id: 'waste-recycling',
    name: 'Waste Recycling',
    description: 'Waste recycling and recovery statistics',
    path: 'Environment%20Statistics/Waste/02_Waste_Recycling.px',
    category: 'environment'
  },

  // Forest Resources
  'forest-area': {
    id: 'forest-area',
    name: 'Forest Area',
    description: 'Forest area coverage and changes over time',
    path: 'Environment%20Statistics/Forest%20Resources/01_Forest_Area.px',
    category: 'environment'
  },
  'forest-production': {
    id: 'forest-production',
    name: 'Forest Production',
    description: 'Forest production and harvesting statistics',
    path: 'Environment%20Statistics/Forest%20Resources/02_Forest_Production.px',
    category: 'environment'
  },

  // Protected Areas
  'protected-areas': {
    id: 'protected-areas',
    name: 'Protected Areas',
    description: 'Statistics on protected areas and nature reserves',
    path: 'Environment%20Statistics/Protected%20Areas/01_Protected_Areas.px',
    category: 'environment'
  },
  'biodiversity-indicators': {
    id: 'biodiversity-indicators',
    name: 'Biodiversity Indicators',
    description: 'Biodiversity and ecosystem indicators',
    path: 'Environment%20Statistics/Protected%20Areas/02_Biodiversity_Indicators.px',
    category: 'environment'
  },

  // Environmental Indicators
  'environmental-indicators': {
    id: 'environmental-indicators',
    name: 'Environmental Indicators',
    description: 'Key environmental performance indicators',
    path: 'Environment%20Statistics/Environmental%20Indicators/01_Environmental_Indicators.px',
    category: 'environment'
  },
  'climate-indicators': {
    id: 'climate-indicators',
    name: 'Climate Indicators',
    description: 'Climate change and weather indicators',
    path: 'Environment%20Statistics/Environmental%20Indicators/02_Climate_Indicators.px',
    category: 'environment'
  },

  // Natural Hazards
  'natural-disasters': {
    id: 'natural-disasters',
    name: 'Natural Disasters',
    description: 'Natural disaster occurrence and impact statistics',
    path: 'Environment%20Statistics/Natural%20Hazards%20and%20Violations%20of%20Law/01_Natural_Disasters.px',
    category: 'environment'
  },
  'environmental-violations': {
    id: 'environmental-violations',
    name: 'Environmental Violations',
    description: 'Environmental law violations and enforcement',
    path: 'Environment%20Statistics/Natural%20Hazards%20and%20Violations%20of%20Law/02_Environmental_Violations.px',
    category: 'environment'
  },

  // Environmental-Economic Accounts
  'environmental-expenditure': {
    id: 'environmental-expenditure',
    name: 'Environmental Expenditure',
    description: 'Environmental protection expenditure accounts',
    path: 'Environment%20Statistics/Environmental-Economic%20Accounts/01_Environmental_Expenditure.px',
    category: 'environment'
  },
  'green-economy': {
    id: 'green-economy',
    name: 'Green Economy',
    description: 'Green economy and sustainable development indicators',
    path: 'Environment%20Statistics/Environmental-Economic%20Accounts/02_Green_Economy.px',
    category: 'environment'
  }
};

// Category definitions for better organization
export const CATEGORIES = {
  'demography': {
    id: 'demography',
    name: 'Demography',
    description: 'Population and demographic statistics',
    icon: '👥'
  },
  'environment': {
    id: 'environment',
    name: 'Environment',
    description: 'Environmental and ecological statistics',
    icon: '🌱'
  }
};

// Environment subcategories based on the PXWeb structure
export const ENVIRONMENT_SUBCATEGORIES = {
  'air-pollution': {
    id: 'air-pollution',
    name: 'Air Pollution',
    georgianName: 'ატმოსფერული ჰაერის დაბინძურება',
    description: 'Air quality and pollution statistics'
  },
  'environmental-economic-accounts': {
    id: 'environmental-economic-accounts',
    name: 'Environmental-Economic Accounts',
    georgianName: 'გარემოსდაცვითი ეკონომიკური ანგარიშები',
    description: 'Environmental economics and green accounting'
  },
  'environmental-indicators': {
    id: 'environmental-indicators',
    name: 'Environmental Indicators',
    georgianName: 'გარემოსდაცვითი ინდიკატორები',
    description: 'Key environmental performance indicators'
  },
  'protected-areas': {
    id: 'protected-areas',
    name: 'Protected Areas',
    georgianName: 'დაცული ტერიტორიები',
    description: 'Protected areas and biodiversity statistics'
  },
  'waste': {
    id: 'waste',
    name: 'Waste',
    georgianName: 'ნარჩენები',
    description: 'Waste management and recycling statistics'
  },
  'natural-hazards': {
    id: 'natural-hazards',
    name: 'Natural Hazards and Violations of Law',
    georgianName: 'სტიქიური მოვლენები და სამართალდარღვევები',
    description: 'Natural disasters and environmental violations'
  },
  'forest-resources': {
    id: 'forest-resources',
    name: 'Forest Resources',
    georgianName: 'ტყის რესურსები',
    description: 'Forest coverage and forestry statistics'
  }
};

export default DATASETS;
