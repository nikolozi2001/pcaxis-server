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
    path: 'Environment%20Statistics/Waste/Municipal_Waste.px',
    category: 'environment'
  },
  'waste-recycling': {
    id: 'waste-recycling',
    name: 'Waste Recycling',
    description: 'Waste recycling and recovery statistics',
    path: 'Environment%20Statistics/Waste/Waste_Recycling.px',
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
  'felled-timber-volume': {
    id: 'felled-timber-volume',
    name: 'Volume of Timber from Forest Cutting',
    description: 'ტყის ჭრით მიღებული ხე-ტყის მოცულობა(კუბური მეტრი)',
    path: 'Environment%20Statistics/Forest%20Resources/1.Felled_Timber.px',
    category: 'environment',
    subcategory: 'forest-resources'
  },
  'forest-planting-recovery': {
    id: 'forest-planting-recovery',
    name: 'Forest Planting and Natural Recovery Support',
    description: 'ტყის თესვა/დარგვა და ბუნებრივი განახლებისთვის ხელშეწყობა (ჰექტარი)',
    path: 'Environment%20Statistics/Forest%20Resources/2.Forest_planting_and_recovery.px',
    category: 'environment',
    subcategory: 'forest-resources'
  },
  'forest-fires': {
    id: 'forest-fires',
    name: 'Forest and Field Fires by Regions',
    description: 'ტყისა და ველის ხანძრები რეგიონების მიხედვით',
    path: 'Environment%20Statistics/Forest%20Resources/3.Forest_fires.px',
    category: 'environment',
    subcategory: 'forest-resources'
  },
  'forest-fund-by-regions': {
    id: 'forest-fund-by-regions',
    name: 'Forest Fund by Regions',
    description: 'ტყის ფონდი რეგიონების მიხედვით',
    path: 'Environment%20Statistics/Forest%20Resources/Forest_Area.px',
    category: 'environment',
    subcategory: 'forest-resources'
  },
  'illegal-logging': {
    id: 'illegal-logging',
    name: 'Illegal Logging',
    description: 'ტყის უკანონო ჭრა',
    path: 'Environment%20Statistics/Forest%20Resources/Illegal-logging.px',
    category: 'environment',
    subcategory: 'forest-resources'
  },
  'timber-by-cutting-purpose': {
    id: 'timber-by-cutting-purpose',
    name: 'Timber Volume by Cutting Purpose',
    description: 'ხე-ტყის მოცულობა ჭრის მიზნების მიხედვით',
    path: 'Environment%20Statistics/Forest%20Resources/timber-by-cutting-purpose_.px',
    category: 'environment',
    subcategory: 'forest-resources'
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

  // Water Resources Indicators
  'water-use-households': {
    id: 'water-use-households',
    name: 'Water Use in Households per Capita',
    description: 'C-4: წყლის გამოყენება შინამეურნეობებში ერთ სულ მოსახლეზე',
    path: 'Environment%20Statistics/Environmental%20Indicators/01.C_4.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'water-supply-population': {
    id: 'water-supply-population',
    name: 'Water Supply and Connected Population',
    description: 'C-5. წყალმომარაგება და წყალმომარაგების სისტემაზე მიერთებული მოსახლეობა',
    path: 'Environment%20Statistics/Environmental%20Indicators/02.C_5.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'water-losses': {
    id: 'water-losses',
    name: 'Water Losses',
    description: 'C-7. წყლის დანაკარგები',
    path: 'Environment%20Statistics/Environmental%20Indicators/03.C_7.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'sewerage-network-population': {
    id: 'sewerage-network-population',
    name: 'Population Connected to Sewerage Network',
    description: 'C-14. წყალარინების ქსელზე მიერთებული მოსახლეობა',
    path: 'Environment%20Statistics/Environmental%20Indicators/04.C_14.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },

  // Agriculture Indicators
  'fertilizer-use': {
    id: 'fertilizer-use',
    name: 'Fertilizer Use',
    description: 'F-2. სასუქების გამოყენება',
    path: 'Environment%20Statistics/Environmental%20Indicators/05.F_2.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'pesticide-consumption': {
    id: 'pesticide-consumption',
    name: 'Pesticide Consumption',
    description: 'F-4. პესტიციდების მოხმარება#(იმპორტისა და ექსპორტის სხვაობა აქტიური კომპონენტების მიხედვით)',
    path: 'Environment%20Statistics/Environmental%20Indicators/06.F_4.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },

  // Energy Indicators
  'final-energy-consumption': {
    id: 'final-energy-consumption',
    name: 'Final Energy Consumption',
    description: 'G-1. ენერგიის საბოლოო მოხმარება',
    path: 'Environment%20Statistics/Environmental%20Indicators/07.G_1.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'primary-energy-supply': {
    id: 'primary-energy-supply',
    name: 'Total Primary Energy Supply',
    description: 'G-2. პირველადი ენერგიის ჯამური მიწოდება',
    path: 'Environment%20Statistics/Environmental%20Indicators/08.G_2.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'energy-intensity': {
    id: 'energy-intensity',
    name: 'Energy Intensity',
    description: 'G-3. ენერგოინტენსიურობა',
    path: 'Environment%20Statistics/Environmental%20Indicators/09.G_3.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'renewable-energy-supply': {
    id: 'renewable-energy-supply',
    name: 'Renewable Energy Supply',
    description: 'G-4. განახლებადი ენერგიის მიწოდება',
    path: 'Environment%20Statistics/Environmental%20Indicators/10.G_4.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },

  // Transport Indicators
  'passenger-turnover': {
    id: 'passenger-turnover',
    name: 'Passenger Turnover',
    description: 'H-1. მგზავრთბრუნვა',
    path: 'Environment%20Statistics/Environmental%20Indicators/11.H_1.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'freight-turnover': {
    id: 'freight-turnover',
    name: 'Freight Turnover',
    description: 'H-2. ტვირთბრუნვა',
    path: 'Environment%20Statistics/Environmental%20Indicators/12.H_2.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'vehicle-fleet-fuel-type': {
    id: 'vehicle-fleet-fuel-type',
    name: 'Vehicle Fleet by Fuel Type',
    description: 'H-3. საავტომობილო პარკი საწვავის ტიპის მიხედვით',
    path: 'Environment%20Statistics/Environmental%20Indicators/13.H_3.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'vehicle-fleet-age': {
    id: 'vehicle-fleet-age',
    name: 'Vehicle Fleet Age',
    description: 'H-4. საავტომობილო პარკის ასაკი',
    path: 'Environment%20Statistics/Environmental%20Indicators/14.H_4.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },

  // Air Quality Indicators
  'atmospheric-emissions': {
    id: 'atmospheric-emissions',
    name: 'Harmful Substances Emitted into Atmospheric Air',
    description: 'A-1. ატმოსფერულ ჰაერში გაფრქვეული მავნე ნივთიერებები, ათასი ტ/წელი',
    path: 'Environment%20Statistics/Environmental%20Indicators/A1.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'ozone-depleting-substances': {
    id: 'ozone-depleting-substances',
    name: 'Consumption of Ozone-Depleting Substances',
    description: 'A-3. ოზონდამშლელი ნივთიერებების (ოდნ) მოხმარება, ოდპ ტონა',
    path: 'Environment%20Statistics/Environmental%20Indicators/A3.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },

  // Climate Indicators
  'air-temperature': {
    id: 'air-temperature',
    name: 'Air Temperature',
    description: 'B-1. ჰაერის ტემპერატურა',
    path: 'Environment%20Statistics/Environmental%20Indicators/B-1_Air_Temperature.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'atmospheric-precipitation': {
    id: 'atmospheric-precipitation',
    name: 'Atmospheric Precipitation',
    description: 'B-2. ატმოსფერული ნალექი',
    path: 'Environment%20Statistics/Environmental%20Indicators/B-2_Atmospheric_precipitation.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
  },
  'greenhouse-gas-emissions': {
    id: 'greenhouse-gas-emissions',
    name: 'Greenhouse Gas Emissions',
    description: 'B-3. სათბური გაზების ემისიები',
    path: 'Environment%20Statistics/Environmental%20Indicators/B-3_greenhouse-gas-emmisions.px',
    category: 'environment',
    subcategory: 'environmental-indicators'
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
  'environmental-violations-law': {
    id: 'environmental-violations-law',
    name: 'Environmental Violations by Regions and Types',
    description: 'გარემოს დაცვის სფეროში გამოვლენილი სამართალდარღვევების რაოდენობა რეგიონებისა და დარღვევის სახეების მიხედვით (ერთეული)',
    path: 'Environment%20Statistics/Natural%20Hazards%20and%20Violations%20of%20Law/1.Violations_of_Law.px',
    category: 'environment',
    subcategory: 'natural-hazards'
  },
  'hydro-meteorological-hazards': {
    id: 'hydro-meteorological-hazards',
    name: 'Hydro-Meteorological Hazard Occurrences',
    description: 'სტიქიური ჰიდრომეტეოროლოგიური მოვლენების შემთხვევათა რაოდენობა (ერთეული)',
    path: 'Environment%20Statistics/Natural%20Hazards%20and%20Violations%20of%20Law/2.ENVR_Hydro_hazard.px',
    category: 'environment',
    subcategory: 'natural-hazards'
  },
  'geological-phenomena': {
    id: 'geological-phenomena',
    name: 'Geological Phenomena and Risk Assessment',
    description: 'გეოლოგიური მოვლენების (მეწყერი, ღვარცოფი) რაოდენობა, ადამიანთა მსხვერპლი და საშიშროების რისკის ზონაში მოქცეული ობიექტები (ერთეული)',
    path: 'Environment%20Statistics/Natural%20Hazards%20and%20Violations%20of%20Law/3.Geological_Phenomena.px',
    category: 'environment',
    subcategory: 'natural-hazards'
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
  },
  'material-flow-indicators': {
    id: 'material-flow-indicators',
    name: 'Main Indicators of Material Flows',
    description: 'მატერიალური ნაკადების ძირითადი მაჩვენებლები',
    path: 'Environment%20Statistics/Environmental-Economic%20Accounts/1.MFA.px',
    category: 'environment',
    subcategory: 'environmental-economic-accounts'
  },
  'domestic-consumption-material-intensity': {
    id: 'domestic-consumption-material-intensity',
    name: 'Domestic Consumption, Material Intensity and Resource Productivity',
    description: 'შიდა მოხმარება ერთ სულზე, მატერიალური ინტენსივობა და რესურსების პროდუქტიულობა',
    path: 'Environment%20Statistics/Environmental-Economic%20Accounts/2.MFA-DMC.px',
    category: 'environment',
    subcategory: 'environmental-economic-accounts'
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
