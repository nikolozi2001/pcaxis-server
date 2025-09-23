/**
 * Environmental Statistics PXWeb Datasets Configuration
 * Georgian National Statistics Office - Environmental Data
 */
export const DATASETS = {
  // Environmental Statistics Datasets
  // Air Pollution
  'air-pollution-regions': {
    id: 'air-pollution-regions',
    name: 'Air Pollution by Regions',
    description: 'ატმოსფერული ჰაერის დაბინძურება',
    path: 'Environment%20Statistics/Air%20Pollution/1.Air_Pollution_by_regios.px',
    category: 'environment',
    subcategory: 'air-pollution'
  },
  'air-pollution-cities': {
    id: 'air-pollution-cities',
    name: 'Air Pollution by Cities',
    description: 'ცალკეულ ქალაქებში სტაციონარულ წყაროებში წარმოქმნილი, დაჭერილი და გაფრქვეული მავნე ნივთიერებები (ათასი ტონა)',
    path: 'Environment%20Statistics/Air%20Pollution/2.Air_pollution_by-cities.px',
    category: 'environment',
    subcategory: 'air-pollution'
  },
  'transport-emissions': {
    id: 'transport-emissions',
    name: 'Transport Emissions',
    description: 'ავტოტრანსპორტის მიერ ატმოსფეროში გაფრქვეული მავნე ნივთიერებები სახეობების მიხედვით (ათასი ტონა)',
    path: 'Environment%20Statistics/Air%20Pollution/3.Emission_from_transport.px',
    category: 'environment',
    subcategory: 'air-pollution'
  },
  'stationary-source-pollution': {
    id: 'stationary-source-pollution',
    name: 'Stationary Source Pollution',
    description: 'სტაციონარულ წყაროებში წარმოქმნილი მავნე ნივთიერებების დაჭერა და ატმოსფეროში გაფრქვევა კატეგორიების მიხედვით (ათასი ტონა)',
    path: 'Environment%20Statistics/Air%20Pollution/4.Air_pollution_by_category.px',
    category: 'environment',
    subcategory: 'air-pollution'
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
  'protected-areas-categories': {
    id: 'protected-areas-categories',
    name: 'Protected Areas Categories',
    description: 'საქართველოს დაცული ტერიტორიების კატეგორიები და ფართობი (ჰექტარი)',
    path: 'Environment%20Statistics/Protected%20Areas/Protected-areas.px',
    category: 'environment',
    subcategory: 'protected-areas'
  },
  'protected-areas-birds': {
    id: 'protected-areas-birds',
    name: 'Bird Species in Protected Areas',
    description: 'დაცულ ტერიტორიებზე აღრიცხულ ფრინველთა ძირითადი სახეობები',
    path: 'Environment%20Statistics/Protected%20Areas/Birds_species_preserved_in_protected.px',
    category: 'environment',
    subcategory: 'protected-areas'
  },
  'protected-areas-mammals': {
    id: 'protected-areas-mammals',
    name: 'Mammal Species in Protected Areas',
    description: 'დაცულ ტერიტორიებზე აღრიცხულ ძუძუმწოვართა ძირითადი სახეობები',
    path: 'Environment%20Statistics/Protected%20Areas/Mammals_preserved_in_protected_areas.px',
    category: 'environment',
    subcategory: 'protected-areas'
  },

  // Water Resources
  'water-abstraction': {
    id: 'water-abstraction',
    name: 'Water Abstraction and Protection',
    nameKa: 'წყლის რესურსების დაცვა და გამოყენება',
    description: 'წყლის რესურსების დაცვა და გამოყენება',
    path: 'Environment%20Statistics/Water%20Resources/Water_Abstraction5.px',
    category: 'environment',
    subcategory: 'water-resources'
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
