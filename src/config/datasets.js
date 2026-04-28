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
    path: 'Environment%20Statistics/Forest%20Resources/Forest_Area.px',
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
  },

  // ─── Gender Statistics ────────────────────────────────────────────────────

  // Business Statistics
  'gender-business-employed-regions': {
    id: 'gender-business-employed-regions',
    name: 'Employed in Business Sector by Regions and Ownership',
    description: 'ბიზნეს სექტორში დასაქმებულთა რაოდენობა, დაქირავებით დასაქმებულთა რაოდენობა და დაქირავებით დასაქმებულთა შრომის საშუალო თვიური ანაზღაურება რეგიონების, საკუთრების ფორმის, ზომისა და სქესის მიხედვით',
    path: 'Gender%20Statistics/Business%20Statistics/01_Number_of_Employed_in_Business_Sector_and_Average_Monthly_Remuneratio.px',
    category: 'gender-statistics',
    subcategory: 'gender-business'
  },
  'gender-business-employed-size': {
    id: 'gender-business-employed-size',
    name: 'Employed in Business Sector by Economic Activity and Ownership',
    description: 'ბიზნეს სექტორში დასაქმებულთა რაოდენობა, დაქირავებით დასაქმებულთა რაოდენობა და შრომის საშუალო თვიური ანაზღაურება ეკონომიკური საქმიანობის სახეების, საკუთრების ფორმის, ზომისა და სქესის მიხედვით',
    path: 'Gender%20Statistics/Business%20Statistics/02_Number_of_Employed_in_Business_Sector_by_Size.px',
    category: 'gender-statistics',
    subcategory: 'gender-business'
  },
  'gender-business-new-enterprises': {
    id: 'gender-business-new-enterprises',
    name: 'Newly Registered Enterprises by Sex of Owner',
    description: 'რეგისტრირებულ ახალ საწარმოთა რაოდენობა მფლობელის სქესის მიხედვით (ერთეული)',
    path: 'Gender%20Statistics/Business%20Statistics/03_Newly_established_enterprises_by_sex_of_owner.px',
    category: 'gender-statistics',
    subcategory: 'gender-business'
  },

  // Education
  'gender-education-population-level': {
    id: 'gender-education-population-level',
    name: 'Population by Level of Education',
    description: 'მოსახლეობის განათლების დონე (ათასი ერთეული)',
    path: 'Gender%20Statistics/Education/01_Population_by_level_of_education.px',
    category: 'gender-statistics',
    subcategory: 'gender-education'
  },
  'gender-education-pupils-students': {
    id: 'gender-education-pupils-students',
    name: 'Number of Pupils and Students',
    description: 'მოსწავლეთა და სტუდენტთა რიცხოვნობა (ერთეული)',
    path: 'Gender%20Statistics/Education/02_Number_of_Pupils_and_Students.px',
    category: 'gender-statistics',
    subcategory: 'gender-education'
  },
  'gender-education-teachers': {
    id: 'gender-education-teachers',
    name: 'Number of Teachers and Academic Staff',
    description: 'პედაგოგების და პროფესორ-მასწავლებელთა რიცხოვნობა',
    path: 'Gender%20Statistics/Education/03_Number_of_schoolteachers_professors_and_lecturers.px',
    category: 'gender-statistics',
    subcategory: 'gender-education'
  },
  'gender-education-pupils-by-age': {
    id: 'gender-education-pupils-by-age',
    name: 'School Pupils by Age and Sex',
    description: 'საჯარო და კერძო სკოლების მოსწავლეთა რიცხოვნობა ასაკისა და სქესის მიხედვით',
    path: 'Gender%20Statistics/Education/04.1_Distribution_of_pupils_by_ages.px',
    category: 'gender-statistics',
    subcategory: 'gender-education'
  },
  'gender-education-graduates': {
    id: 'gender-education-graduates',
    name: 'Graduates from Primary, Basic and Secondary Schools',
    description: 'დამთავრებულები დაწყებით, საბაზო და საშუალო სკოლებში',
    path: 'Gender%20Statistics/Education/04.5_Graduates_From_Primary_Basic_And_Secondary_Schools.px',
    category: 'gender-statistics',
    subcategory: 'gender-education'
  },
  'gender-education-higher-students': {
    id: 'gender-education-higher-students',
    name: 'Students in Higher Educational Institutions by Programmes',
    description: 'სტუდენტთა რიცხოვნობა უმაღლეს საგანმანათლებლო დაწესებულებებში პროგრამების მიხედვით',
    path: 'Gender%20Statistics/Education/06_Number_of_Students_In_Higher_Educational_Institutions_By_Programmes.px',
    category: 'gender-statistics',
    subcategory: 'gender-education'
  },
  'gender-education-higher-graduates': {
    id: 'gender-education-higher-graduates',
    name: 'Graduates of Higher Educational Institutions by Programmes',
    description: 'უმაღლესი საგანმანათლებლო დაწესებულებების კურსდამთავრებულები პროგრამების მიხედვით',
    path: 'Gender%20Statistics/Education/09_Graduates_of_higher_educational_Institutions_by_programs.px',
    category: 'gender-statistics',
    subcategory: 'gender-education'
  },
  'gender-education-doctoral-students': {
    id: 'gender-education-doctoral-students',
    name: 'Number of Doctoral Students',
    description: 'დოქტორანტების რიცხოვნობა (ერთეული)',
    path: 'Gender%20Statistics/Education/12_Number_of_Doctoral_Students.px',
    category: 'gender-statistics',
    subcategory: 'gender-education'
  },

  // Employment and Unemployment
  'gender-employment-lf-by-sex': {
    id: 'gender-employment-lf-by-sex',
    name: 'Labour Force Indicators by Sex',
    description: 'სამუშაო ძალის მაჩვენებლები სქესის მიხედვით',
    path: 'Gender%20Statistics/Employment%20and%20Unemployment/01_Labour_Force_Indicators_By_Sex.px',
    category: 'gender-statistics',
    subcategory: 'gender-employment'
  },
  'gender-employment-lf-urban-rural': {
    id: 'gender-employment-lf-urban-rural',
    name: 'Labour Force Indicators by Urban-Rural',
    description: 'სამუშაო ძალის მაჩვენებლები ქალაქ-სოფლის მიხედვით (ათასი კაცი)',
    path: 'Gender%20Statistics/Employment%20and%20Unemployment/02_Labour_Force_Indicators_by_Urban-Rural.px',
    category: 'gender-statistics',
    subcategory: 'gender-employment'
  },
  'gender-employment-lf-by-age': {
    id: 'gender-employment-lf-by-age',
    name: 'Labour Force Indicators by Age Groups',
    description: 'სამუშაო ძალის მაჩვენებლები ასაკობრივი ჯგუფების მიხედვით',
    path: 'Gender%20Statistics/Employment%20and%20Unemployment/03_Labour_Force_Indicators_By_Age_Groups.px',
    category: 'gender-statistics',
    subcategory: 'gender-employment'
  },
  'gender-employment-employed-unemployed-age': {
    id: 'gender-employment-employed-unemployed-age',
    name: 'Employed and Unemployed Population by Age',
    description: 'დასაქმებული და უმუშევარი მოსახლეობა ასაკობრივი ჯგუფების მიხედვით',
    path: 'Gender%20Statistics/Employment%20and%20Unemployment/04_Employed_and_Unemployed_Population_by_Age.px',
    category: 'gender-statistics',
    subcategory: 'gender-employment'
  },
  'gender-employment-by-education': {
    id: 'gender-employment-by-education',
    name: 'Employed and Unemployed by Education Attainment',
    description: 'დასაქმებული და უმუშევარი მოსახლეობა განათლების დონის მიხედვით',
    path: 'Gender%20Statistics/Employment%20and%20Unemployment/05_Employed_and_Unemployed_by_Education_Attainment.px',
    category: 'gender-statistics',
    subcategory: 'gender-employment'
  },
  'gender-employment-by-branch': {
    id: 'gender-employment-by-branch',
    name: 'Employment by Branch (NACE Rev.2)',
    description: 'დასაქმება ეკონომიკური საქმიანობის სახეების მიხედვით',
    path: 'Gender%20Statistics/Employment%20and%20Unemployment/Employment_by_branch_(NACE_Rev2).px',
    category: 'gender-statistics',
    subcategory: 'gender-employment'
  },
  'gender-employment-parents-rate': {
    id: 'gender-employment-parents-rate',
    name: 'Employment Rate of Parents (aged 25-54)',
    description: 'მშობლების (25-54 წ.) დასაქმების დონე სქესისა და ბავშვის ასაკის მიხედვით',
    path: 'Gender%20Statistics/Employment%20and%20Unemployment/Parents_(aged_25-54)_Employment_rate.px',
    category: 'gender-statistics',
    subcategory: 'gender-employment'
  },
  'gender-employment-long-term-unemployed': {
    id: 'gender-employment-long-term-unemployed',
    name: 'Long-Term Unemployed',
    description: 'ხანგრძლივი დროით უმუშევართა რიცხოვნობა (ათასი კაცი) და ხანგრძლივი უმუშევრობის დონე (%)',
    path: 'Gender%20Statistics/Employment%20and%20Unemployment/Unemployed.px',
    category: 'gender-statistics',
    subcategory: 'gender-employment'
  },

  // Demography
  'gender-demography-population': {
    id: 'gender-demography-population',
    name: 'Population of Georgia',
    description: 'საქართველოს მოსახლეობის რიცხოვნობა 1 იანვრის მდგომარეობით',
    path: 'Gender%20Statistics/Demography/01_Population_of_Georgia.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-mean-age': {
    id: 'gender-demography-mean-age',
    name: 'Mean Age of Population',
    description: 'მოსახლეობის საშუალო ასაკი, 1 იანვრის მდგომარეობით',
    path: 'Gender%20Statistics/Demography/02_Mean_Age_of_Population.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-live-births-legitimacy': {
    id: 'gender-demography-live-births-legitimacy',
    name: 'Live Births by Legitimacy',
    description: 'ცოცხლად დაბადებულთა რიცხოვნობა მშობლების ქორწინებითი მდგომარეობის მიხედვით',
    path: 'Gender%20Statistics/Demography/04_Live_Births_by_Legitimacy_Stat.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-births-by-order': {
    id: 'gender-demography-births-by-order',
    name: 'Live Births by Order of Birth',
    description: 'ცოცხლად დაბადებულები დაბადების რიგითობის მიხედვით',
    path: 'Gender%20Statistics/Demography/05_Live_Births_by_order_of_birth.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-births-mothers-age': {
    id: 'gender-demography-births-mothers-age',
    name: 'Live Births by Age of Mother',
    description: 'ცოცხლად დაბადებულები დედის ასაკის მიხედვით',
    path: 'Gender%20Statistics/Demography/06_Live_Births_by_Age_of_Mother.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-births-regions': {
    id: 'gender-demography-births-regions',
    name: 'Live Births by Regions',
    description: 'ცოცხლად დაბადებულები რეგიონების მიხედვით',
    path: 'Gender%20Statistics/Demography/07_Live_Births_by_Regions.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-fertility-rate': {
    id: 'gender-demography-fertility-rate',
    name: 'Total Fertility Rate',
    description: 'მთლიანი ნაყოფიერობის კოეფიციენტი',
    path: 'Gender%20Statistics/Demography/09_Total_Fertility_Rate.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-deaths-age': {
    id: 'gender-demography-deaths-age',
    name: 'Deaths by Age',
    description: 'გარდაცვლილები ასაკობრივი ჯგუფების მიხედვით',
    path: 'Gender%20Statistics/Demography/12_Deaths_by_Age.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-deaths-regions': {
    id: 'gender-demography-deaths-regions',
    name: 'Deaths by Regions',
    description: 'გარდაცვლილები რეგიონების მიხედვით',
    path: 'Gender%20Statistics/Demography/13_Deaths_by_Regions.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-maternal-mortality': {
    id: 'gender-demography-maternal-mortality',
    name: 'Maternal Mortality',
    description: 'დედათა სიკვდილიანობა',
    path: 'Gender%20Statistics/Demography/14_Maternal_Mortality.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-life-expectancy': {
    id: 'gender-demography-life-expectancy',
    name: 'Life Expectancy at Birth',
    description: 'სიცოცხლის მოსალოდნელი ხანგრძლივობა',
    path: 'Gender%20Statistics/Demography/16_Life_Expectancy_at_Birth.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },
  'gender-demography-marriages-divorces': {
    id: 'gender-demography-marriages-divorces',
    name: 'Married and Divorced People by Age',
    description: 'დაქორწინებული და განქორწინებული პირები ასაკის მიხედვით',
    path: 'Gender%20Statistics/Demography/19_Number_of_Married_and_Divorced_People_by_Age.px',
    category: 'gender-statistics',
    subcategory: 'gender-demography'
  },

  // ICT
  'gender-ict-computer-internet': {
    id: 'gender-ict-computer-internet',
    name: 'Population by Frequency of Computer/Internet Use',
    description: '15 წლის და უფროსი ასაკის მოსახლეობის განაწილება კომპიუტერის/ინტერნეტის გამოყენების სიხშირის მიხედვით (%)',
    path: 'Gender%20Statistics/ICT/01_Distribution_of_population_aged_15_and_older_by_frequency_of_computer.px',
    category: 'gender-statistics',
    subcategory: 'gender-ict'
  },
  'gender-ict-households-access': {
    id: 'gender-ict-households-access',
    name: 'Households with Computer and Internet Access by Sex of Head',
    description: 'კომპიუტერით და ინტერნეტით უზრუნველყოფილი შინამეურნეობების წილი შინამეურნეობის უფროსის სქესის მიხედვით (%)',
    path: 'Gender%20Statistics/ICT/02_Share_of_households_with_computer_and_internet_access_by_sex_of_head_.px',
    category: 'gender-statistics',
    subcategory: 'gender-ict'
  },
  'gender-ict-mobile-phone': {
    id: 'gender-ict-mobile-phone',
    name: 'Population Owning Mobile Phone (aged 6+)',
    description: '6 წლის და უფროსი ასაკის მოსახლეობის წილი, ვინც ფლობს მობილურ ტელეფონს (%)',
    path: 'Gender%20Statistics/ICT/03_Share_of_population_aged_6_and_older_who_own_mobile_phone.px',
    category: 'gender-statistics',
    subcategory: 'gender-ict'
  },
  'gender-ict-internet-by-age': {
    id: 'gender-ict-internet-by-age',
    name: 'Internet Use by Age and Sex',
    description: 'ინტერნეტის გამოყენება ასაკის მიხედვით (%)',
    path: 'Gender%20Statistics/ICT/04_Last_internet_use_by_individuals_aged_6_and_above.px',
    category: 'gender-statistics',
    subcategory: 'gender-ict'
  },
  'gender-ict-smartphone': {
    id: 'gender-ict-smartphone',
    name: 'Population Owning Mobile and Smartphone (aged 6+)',
    description: '6 წლის და უფროსი ასაკის მოსახლეობის წილი, ვინც ფლობს მობილურ ტელეფონს და სმარტფონს (%)',
    path: 'Gender%20Statistics/ICT/5_Share_of_population_aged_6_and_older_who_own_mobile_and_smartphone.px',
    category: 'gender-statistics',
    subcategory: 'gender-ict'
  },

  // Crime (სამართალდარღვევები)
  'gender-crime-convicted-by-type': {
    id: 'gender-crime-convicted-by-type',
    name: 'Convicted Persons by Type of Crime',
    description: 'მსჯავრდებულთა რაოდენობა დანაშაულის სახეების მიხედვით',
    path: 'Gender%20Statistics/crime/01-Number_of_Convicted_Persons_by_Type_of_Crime.px',
    category: 'gender-statistics',
    subcategory: 'gender-crime'
  },
  'gender-crime-convicted-by-age': {
    id: 'gender-crime-convicted-by-age',
    name: 'Convicted Persons by Age Groups',
    description: 'მსჯავრდებულთა შემადგენლობა ასაკობრივი ჯგუფების მიხედვით',
    path: 'Gender%20Statistics/crime/02-Distribution_of_Convicted_Persons_by_Age.px',
    category: 'gender-statistics',
    subcategory: 'gender-crime'
  },
  'gender-crime-domestic-violence-hotline': {
    id: 'gender-crime-domestic-violence-hotline',
    name: 'Hot Lines on Domestic Violence',
    description: 'ოჯახში ძალადობის საკითხებზე განხორციელებული ცხელი ხაზის მონაცემები',
    path: 'Gender%20Statistics/crime/03-Data_of_Hot_Lines_on_Domestic_Violence.px',
    category: 'gender-statistics',
    subcategory: 'gender-crime'
  },
  'gender-crime-domestic-violence-victims': {
    id: 'gender-crime-domestic-violence-victims',
    name: 'Victims and Perpetrators of Domestic Violence',
    description: 'ოჯახური ძალადობის მსხვერპლი და მოძალადე პირების მონაცემები',
    path: 'Gender%20Statistics/crime/04_1_Data_on_the_Victims_and_Perpetrators_of_the_Domestic_Violence.px',
    category: 'gender-statistics',
    subcategory: 'gender-crime'
  },
  'gender-crime-shelters-domestic': {
    id: 'gender-crime-shelters-domestic',
    name: 'Victims in Shelters (Domestic Violence)',
    description: 'შელტერებში განთავსებული ოჯახური ძალადობის მსხვერპლი პირები',
    path: 'Gender%20Statistics/crime/05-Number_of_Victims_(with_dependant_persons)_in_Shelters_under_Domestic.px',
    category: 'gender-statistics',
    subcategory: 'gender-crime'
  },
  'gender-crime-road-accidents': {
    id: 'gender-crime-road-accidents',
    name: 'Persons Injured or Killed by Road Accidents',
    description: 'საგზაო-სატრანსპორტო შემთხვევებში დაშავებული და დაღუპული პირები',
    path: 'Gender%20Statistics/crime/12-Number_of_Persons_Injured_or_Killed_by_Road_Accidents.px',
    category: 'gender-statistics',
    subcategory: 'gender-crime'
  },
  'gender-crime-police-officers': {
    id: 'gender-crime-police-officers',
    name: 'Female Police Officers Share',
    description: 'პოლიციის სპეციალური წოდების მქონე ქალი პოლიციის ოფიცრების წილი',
    path: 'Gender%20Statistics/crime/15-Police_Officers.px',
    category: 'gender-statistics',
    subcategory: 'gender-crime'
  },
  'gender-crime-prison-population': {
    id: 'gender-crime-prison-population',
    name: 'Prison Population',
    description: 'პატიმართა რიცხოვნობა',
    path: 'Gender%20Statistics/crime/16-Prison_Population.px',
    category: 'gender-statistics',
    subcategory: 'gender-crime'
  },

  // Agriculture
  'gender-agriculture-holdings-age-gender': {
    id: 'gender-agriculture-holdings-age-gender',
    name: 'Agricultural Holdings by Age and Gender of Holder',
    description: 'მეურნეობათა კლასიფიკაცია მეურნის ან მეურნეობის ხელმძღვანელის ასაკისა და სქესის მიხედვით',
    path: 'Gender%20Statistics/Agriculture/1-Classification_of_Agricultural_Holdings_by_Age_and_Gender_of_Holder_or.px',
    category: 'gender-statistics',
    subcategory: 'gender-agriculture'
  },
  'gender-agriculture-land-distribution': {
    id: 'gender-agriculture-land-distribution',
    name: 'Distribution of Land Area of Agricultural Holdings',
    description: 'მეურნეობების სარგებლობაში არსებული მიწის ფართობის განაწილება',
    path: 'Gender%20Statistics/Agriculture/2-Distribution_of_Land_Area.px',
    category: 'gender-statistics',
    subcategory: 'gender-agriculture'
  },
  'gender-agriculture-workers-family': {
    id: 'gender-agriculture-workers-family',
    name: 'Average Number of Workers in Family Holdings',
    description: 'ოჯახურ მეურნეობებში მომუშავეთა საშუალო რაოდენობა სქესისა და რეგიონის მიხედვით',
    path: 'Gender%20Statistics/Agriculture/3_Avarage_number_of_workers_in_family_holdings.px',
    category: 'gender-statistics',
    subcategory: 'gender-agriculture'
  },
  'gender-agriculture-workers-holdings': {
    id: 'gender-agriculture-workers-holdings',
    name: 'Average Number of Workers in Agricultural Holdings',
    description: 'სასოფლო მეურნეობებში მომუშავეთა საშუალო რაოდენობა სქესისა და რეგიონის მიხედვით',
    path: 'Gender%20Statistics/Agriculture/4_Avarage_number_of_workers_in_agricultural_holdings.px',
    category: 'gender-statistics',
    subcategory: 'gender-agriculture'
  },
  'gender-agriculture-mandays-family': {
    id: 'gender-agriculture-mandays-family',
    name: 'Man-Days Worked in Family Holdings',
    description: 'ოჯახურ მეურნეობებში ნამუშევარი კაცდღეების რაოდენობა სქესისა და რეგიონის მიხედვით',
    path: 'Gender%20Statistics/Agriculture/6_Amount_of_worked_man-days_in_family_holdings.px',
    category: 'gender-statistics',
    subcategory: 'gender-agriculture'
  },
  'gender-agriculture-production-volume': {
    id: 'gender-agriculture-production-volume',
    name: 'Production Volume of Agricultural Holdings per Labour Day',
    description: 'სასოფლო მეურნეობების წარმოების მოცულობა შრომის დანახარჯის ერთეულზე',
    path: 'Gender%20Statistics/Agriculture/10_Production_volume_of_agricultural_holdings_per_labour_day.px',
    category: 'gender-statistics',
    subcategory: 'gender-agriculture'
  },
  'gender-agriculture-income': {
    id: 'gender-agriculture-income',
    name: 'Average Annual Income of Agricultural Holdings',
    description: 'სასოფლო მეურნეობების საშუალო წლიური მოგება',
    path: 'Gender%20Statistics/Agriculture/11_Average_annual_income_of_agricultural_holdings_by_holding_size.px',
    category: 'gender-statistics',
    subcategory: 'gender-agriculture'
  },

  // Social Protection
  'gender-social-pension-recipients': {
    id: 'gender-social-pension-recipients',
    name: 'Persons Receiving Pension and Social Packages',
    description: 'პენსიის და სოციალური პაკეტის მიმღებთა რიცხოვნობა (ერთეული)',
    path: 'Gender%20Statistics/Social%20Protection/1-Number_of_Persons_Receiving_Pension_and_Social_packages.px',
    category: 'gender-statistics',
    subcategory: 'gender-social-protection'
  },
  'gender-social-subsistence-allowance': {
    id: 'gender-social-subsistence-allowance',
    name: 'Persons Receiving Subsistence Allowance',
    description: 'საარსებო შემწეობის მიმღები პირების რიცხოვნობა (ერთეული)',
    path: 'Gender%20Statistics/Social%20Protection/3-Number_of_Persons_Receiving_Subsistence_Allowance.px',
    category: 'gender-statistics',
    subcategory: 'gender-social-protection'
  },
  'gender-social-abandoned-children': {
    id: 'gender-social-abandoned-children',
    name: 'Abandoned and Adopted Children',
    description: 'მიტოვებული და გაშვილებული ბავშვები (ერთეული)',
    path: 'Gender%20Statistics/Social%20Protection/4-Abandoned_and_adopted_children.px',
    category: 'gender-statistics',
    subcategory: 'gender-social-protection'
  },
  'gender-social-elderly-nursing': {
    id: 'gender-social-elderly-nursing',
    name: 'Elderly People in Nursing Homes',
    description: 'მოხუცებულთა განთავსება თავშესაფარში (ერთეული)',
    path: 'Gender%20Statistics/Social%20Protection/5-Number_of_elderly_people_in_nursing_homes.px',
    category: 'gender-statistics',
    subcategory: 'gender-social-protection'
  },
  'gender-social-idps': {
    id: 'gender-social-idps',
    name: 'Registered Internally Displaced Persons',
    description: 'რეგისტრირებულ იძულებით გადაადგილებულ პირთა რიცხოვნობა',
    path: 'Gender%20Statistics/Social%20Protection/6-The_number_of_Registered_internally_displaced_persons_(IDPs).px',
    category: 'gender-statistics',
    subcategory: 'gender-social-protection'
  },
  'gender-social-disabilities': {
    id: 'gender-social-disabilities',
    name: 'Newly Registered Persons with Disabilities',
    description: 'ახლად რეგისტრირებულ, შეზღუდული შესაძლებლობის მქონე პირები',
    path: 'Gender%20Statistics/Social%20Protection/newly_registered_person_with_disabilities.px',
    category: 'gender-statistics',
    subcategory: 'gender-social-protection'
  },

  // Sport Statistics
  'gender-sport-olympic-medals': {
    id: 'gender-sport-olympic-medals',
    name: 'Medals Won in Olympic Sports by Age and Sex',
    description: 'ოლიმპიურ სახეობებში აღებული მედლების რაოდენობა სპორტსმენების ასაკის და სქესის მიხედვით',
    path: 'Gender%20Statistics/Sport%20Statistics/Number_of_Medals_won_in_Olympic.px',
    category: 'gender-statistics',
    subcategory: 'gender-sport'
  },
  'gender-sport-non-olympic-medals': {
    id: 'gender-sport-non-olympic-medals',
    name: 'Medals Won in Non-Olympic Sports by Age and Sex',
    description: 'არაოლიმპიურ სახეობებში აღებული მედლების რაოდენობა სპორტსმენების ასაკის და სქესის მიხედვით',
    path: 'Gender%20Statistics/Sport%20Statistics/Number_of_Medals_won_in_Non-Olympic_Sports.px',
    category: 'gender-statistics',
    subcategory: 'gender-sport'
  },
  'gender-sport-paralympic-medals': {
    id: 'gender-sport-paralympic-medals',
    name: 'Medals Won in Paralympic Sports by Age and Sex',
    description: 'პარალიმპიურ სახეობებში აღებული მედლების რაოდენობა სპორტსმენების ასაკის და სქესის მიხედვით',
    path: 'Gender%20Statistics/Sport%20Statistics/Number_of_Medals_won_in_Paralympic_Sports.px',
    category: 'gender-statistics',
    subcategory: 'gender-sport'
  },

  // Income
  'gender-income-monthly-incomes': {
    id: 'gender-income-monthly-incomes',
    name: 'Distribution of Average Monthly Incomes',
    description: 'შინამეურნეობების საშუალო თვიური შემოსავლების განაწილება',
    path: 'Gender%20Statistics/Income/01_Distribution_of_Average_Monthly_Incomes.px',
    category: 'gender-statistics',
    subcategory: 'gender-income'
  },
  'gender-income-monthly-expenditures': {
    id: 'gender-income-monthly-expenditures',
    name: 'Distribution of Average Monthly Expenditures',
    description: 'შინამეურნეობების საშუალო თვიური ხარჯების განაწილება',
    path: 'Gender%20Statistics/Income/02_Distribution_of_Average_Monthly_Expenditures.px',
    category: 'gender-statistics',
    subcategory: 'gender-income'
  },
  'gender-income-earnings': {
    id: 'gender-income-earnings',
    name: 'Average Monthly Nominal Wages',
    description: 'დაქირავებით დასაქმებულთა საშუალო თვიური ნომინალური ხელფასი',
    path: 'Gender%20Statistics/Income/03_Earnings.px',
    category: 'gender-statistics',
    subcategory: 'gender-income'
  },
  'gender-income-poverty-by-gender': {
    id: 'gender-income-poverty-by-gender',
    name: 'Relative Poverty Indicators by Gender of Head of Household',
    description: 'ფარდობითი სიღარიბის მაჩვენებლები სქესის მიხედვით (%)',
    path: 'Gender%20Statistics/Income/04_Relative_Poverty_Indicators_by_Gender_of_head_of_household.px',
    category: 'gender-statistics',
    subcategory: 'gender-income'
  },
  'gender-income-wage-ratio': {
    id: 'gender-income-wage-ratio',
    name: "Women's Wages as Ratio to Men's Wages",
    description: 'ქალების ხელფასების თანაფარდობა კაცების ხელფასებთან',
    path: 'Gender%20Statistics/Income/05_RFM.px',
    category: 'gender-statistics',
    subcategory: 'gender-income'
  },
  'gender-income-adj-gpg-activity': {
    id: 'gender-income-adj-gpg-activity',
    name: 'Adjusted Gender Pay Gap by Economic Activity',
    description: 'შესწორებული გენდერული სახელფასო სხვაობა წლების და საქმიანობის ძირითადი სახეების მიხედვით',
    path: 'Gender%20Statistics/Income/Adj_GpG_by_Year_Ec_A.px',
    category: 'gender-statistics',
    subcategory: 'gender-income'
  },
  'gender-income-adj-gpg-occupation': {
    id: 'gender-income-adj-gpg-occupation',
    name: 'Adjusted Gender Pay Gap by Occupation',
    description: 'შესწორებული გენდერული სახელფასო სხვაობა წლების და დაკავებული პოზიციების მიხედვით',
    path: 'Gender%20Statistics/Income/Adj_GPG_by_Year_Occu.px',
    category: 'gender-statistics',
    subcategory: 'gender-income'
  },
  'gender-income-unadj-gpg': {
    id: 'gender-income-unadj-gpg',
    name: 'Unadjusted Gender Pay Gap',
    description: 'გენდერული სახელფასო სხვაობა (შეუსწორებელი) წლების მიხედვით',
    path: 'Gender%20Statistics/Income/Unadj_GPG_by_Years.px',
    category: 'gender-statistics',
    subcategory: 'gender-income'
  },

  // Households
  'gender-households-types': {
    id: 'gender-households-types',
    name: 'Types of Households by Sex of Head',
    description: 'შინამეურნეობის ტიპები შინამეურნეობის უფროსის სქესის მიხედვით (%)',
    path: 'Gender%20Statistics/Households/01_Distribution_of_types_of_households.px',
    category: 'gender-statistics',
    subcategory: 'gender-households'
  },
  'gender-households-urban-rural': {
    id: 'gender-households-urban-rural',
    name: 'Households by Sex of Head in Urban and Rural Areas',
    description: 'შინამეურნეობების განაწილება შინამეურნეობის უფროსის სქესის მიხედვით ქალაქად და სოფლად (%)',
    path: 'Gender%20Statistics/Households/02_Distribution_of_households_by_Gender_of_head_of_household_in_urban_an....px',
    category: 'gender-statistics',
    subcategory: 'gender-households'
  },
  'gender-households-ownership': {
    id: 'gender-households-ownership',
    name: 'Households by Ownership of Dwellings and Sex of Head',
    description: 'შინამეურნეობების განაწილება ძირითადი საცხოვრისის საკუთრების ფორმის და შინამეურნეობის უფროსის სქესის მიხედვით (%)',
    path: 'Gender%20Statistics/Households/03_Distribution_of_households_by_type_of_ownership_of_dwellings_and_Gend....px',
    category: 'gender-statistics',
    subcategory: 'gender-households'
  },

  // Influence and Power (ხელისუფლება)
  'gender-power-government-composition': {
    id: 'gender-power-government-composition',
    name: 'Composition of the Government of Georgia',
    description: 'საქართველოს მთავრობის შემადგენლობა',
    path: 'Gender%20Statistics/Influence%20and%20Power/01-Composition_of_the_Government_of_Georgia.px',
    category: 'gender-statistics',
    subcategory: 'gender-power'
  },
  'gender-power-government-staff': {
    id: 'gender-power-government-staff',
    name: 'Staff of the Administration of the Government of Georgia',
    description: 'საქართველოს მთავრობის ადმინისტრაციის თანამშრომელთა რაოდენობა',
    path: 'Gender%20Statistics/Influence%20and%20Power/02-Staff_of_the_Administration_of_the_Goverment_of_Georgia.px',
    category: 'gender-statistics',
    subcategory: 'gender-power'
  },
  'gender-power-parliament': {
    id: 'gender-power-parliament',
    name: 'Number of Parliament Members of Georgia',
    description: 'საქართველოს პარლამენტის წევრთა რაოდენობა',
    path: 'Gender%20Statistics/Influence%20and%20Power/03-Number_of_Parliament_Members_of_Georgia.px',
    category: 'gender-statistics',
    subcategory: 'gender-power'
  },
  'gender-power-local-council': {
    id: 'gender-power-local-council',
    name: 'Members Elected in Local Self-Governance Body (Sakrebulo)',
    description: 'ადგილობრივი თვითმმართველობის წარმომადგენლობით ორგანოში (საკრებულო) არჩეულ წევრთა შემადგენლობა',
    path: 'Gender%20Statistics/Influence%20and%20Power/08-Composition_of_Members_Elected_in_Local_Self-Governance_Body-Sakrebulo.px',
    category: 'gender-statistics',
    subcategory: 'gender-power'
  },
  'gender-power-judges': {
    id: 'gender-power-judges',
    name: 'Number of Judges in Common Law Courts',
    description: 'საქართველოს საერთო სასამართლოებში მოსამართლეთა რაოდენობა',
    path: 'Gender%20Statistics/Influence%20and%20Power/10-Number_of_Judges_in_common_law_courts_of_Georgia.px',
    category: 'gender-statistics',
    subcategory: 'gender-power'
  },
  'gender-power-ambassadors': {
    id: 'gender-power-ambassadors',
    name: 'Number of Ambassadors of Georgia',
    description: 'საქართველოს ელჩების რაოდენობა',
    path: 'Gender%20Statistics/Influence%20and%20Power/11-Number_of_Ambassadors_of_Georgia.px',
    category: 'gender-statistics',
    subcategory: 'gender-power'
  },
  'gender-power-military': {
    id: 'gender-power-military',
    name: 'Military Personnel',
    description: 'სამხედრო პერსონალი',
    path: 'Gender%20Statistics/Influence%20and%20Power/20_Military_Personnel.px',
    category: 'gender-statistics',
    subcategory: 'gender-power'
  },
  'gender-power-civil-servants': {
    id: 'gender-power-civil-servants',
    name: 'Civil Servants',
    description: 'სამოქალაქო მოხელეები',
    path: 'Gender%20Statistics/Influence%20and%20Power/Civil_Servants.px',
    category: 'gender-statistics',
    subcategory: 'gender-power'
  },

  // Health Care
  'gender-health-doctors': {
    id: 'gender-health-doctors',
    name: 'Number of Medical Doctors',
    description: 'ექიმების რაოდენობა (ერთეული)',
    path: 'Gender%20Statistics/Health%20Care/01_Number_of_Medical_Doctors.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-tuberculosis': {
    id: 'gender-health-tuberculosis',
    name: 'Tuberculosis Cases',
    description: 'ტუბერკულოზის შემთხვევების რაოდენობა (ერთეული)',
    path: 'Gender%20Statistics/Health%20Care/02_Tuberculosis_Influence.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-tb-by-age': {
    id: 'gender-health-tb-by-age',
    name: 'New Cases of Pulmonary Tuberculosis by Age',
    description: 'ახლად გამოვლენილი ფილტვის ტუბერკულოზის შემთხვევები ასაკის მიხედვით',
    path: 'Gender%20Statistics/Health%20Care/03_New_Cases_of_Pulmonary_Tuberculosis_by_Age.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-hiv-aids': {
    id: 'gender-health-hiv-aids',
    name: 'New Cases of HIV/AIDS',
    description: 'შიდსის შემთხვევების რაოდენობა ცხოვრებაში პირველად დადგენილი დიაგნოზით',
    path: 'Gender%20Statistics/Health%20Care/04_New_Cases_of_HIVAIDS.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-hiv-infection': {
    id: 'gender-health-hiv-infection',
    name: 'New Cases of HIV Infection',
    description: 'ახლად გამოვლენილი აივ ინფექციის შემთხვევები',
    path: 'Gender%20Statistics/Health%20Care/05_New_Cases_of_HIV_Infection.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-std-by-age': {
    id: 'gender-health-std-by-age',
    name: 'New Cases of Sexually Transmitted Diseases by Age',
    description: 'სქესობრივი გზით გადამდები დაავადებების ახალი შემთხვევები ასაკობრივი ჯგუფების მიხედვით',
    path: 'Gender%20Statistics/Health%20Care/06_New_cases_of_Sexually_Transmitted_Diseases_by_Age.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-cancer': {
    id: 'gender-health-cancer',
    name: 'New Cases of Malignant Neoplasms',
    description: 'ავთვისებიანი სიმსივნეების შემთხვევების რაოდენობა',
    path: 'Gender%20Statistics/Health%20Care/09_New_Cases_of_Malignant_Neoplasms.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-mortality-causes': {
    id: 'gender-health-mortality-causes',
    name: 'Mortality by Causes of Death',
    description: 'სიკვდილიანობა გარდაცვალების მიზეზების მიხედვით',
    path: 'Gender%20Statistics/Health%20Care/11_Mortality_by_Causes_of_Death.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-suicides': {
    id: 'gender-health-suicides',
    name: 'Suicides',
    description: 'თვითმკვლელობის სტატისტიკა',
    path: 'Gender%20Statistics/Health%20Care/14_Suicides.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-disease-by-sex': {
    id: 'gender-health-disease-by-sex',
    name: 'Morbidity with Acute and Chronic Diseases by Sex',
    description: 'მწვავე და ქრონიკული დაავადებებით ავადობა სქესის მიხედვით',
    path: 'Gender%20Statistics/Health%20Care/14-2_Morbidity_with_acute_and_chronic_diseases_by_sex.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-antenatal-care': {
    id: 'gender-health-antenatal-care',
    name: 'Antenatal Care Coverage',
    description: 'ქალების პროცენტული წილი, რომლებმაც მიიღეს 4 და მეტი ანტენატალური ვიზიტი',
    path: 'Gender%20Statistics/Health%20Care/20_Antenatal_care.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  },
  'gender-health-hpv': {
    id: 'gender-health-hpv',
    name: 'HPV Vaccination Coverage',
    description: 'HPV-ის საწინააღმდეგო ვაქცინაციის მოცვა',
    path: 'Gender%20Statistics/Health%20Care/21_HPV.px',
    category: 'gender-statistics',
    subcategory: 'gender-health'
  }
};

// Category definitions for better organization
export const CATEGORIES = {
  'environment': {
    id: 'environment',
    name: 'Environment',
    description: 'Environmental and ecological statistics',
    icon: '🌱'
  },
  'gender-statistics': {
    id: 'gender-statistics',
    name: 'Gender Statistics',
    georgianName: 'გენდერული სტატისტიკა',
    description: 'Gender-disaggregated statistics across social, economic and demographic domains',
    icon: '⚖️'
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

export const GENDER_SUBCATEGORIES = {
  'gender-business': {
    id: 'gender-business',
    name: 'Business Statistics',
    georgianName: 'ბიზნეს სტატისტიკა',
    description: 'Employment and enterprise statistics by gender'
  },
  'gender-education': {
    id: 'gender-education',
    name: 'Education',
    georgianName: 'განათლება',
    description: 'Educational attainment and enrolment by gender'
  },
  'gender-employment': {
    id: 'gender-employment',
    name: 'Employment and Unemployment',
    georgianName: 'დასაქმება და უმუშევრობა',
    description: 'Labour force indicators by gender'
  },
  'gender-demography': {
    id: 'gender-demography',
    name: 'Demography',
    georgianName: 'დემოგრაფია',
    description: 'Population, births, deaths and life expectancy by gender'
  },
  'gender-ict': {
    id: 'gender-ict',
    name: 'ICT',
    georgianName: 'საინფორმაციო და საკომუნიკაციო ტექნოლოგიები',
    description: 'Internet, computer and mobile phone access by gender'
  },
  'gender-crime': {
    id: 'gender-crime',
    name: 'Crime',
    georgianName: 'სამართალდარღვევები',
    description: 'Crime, domestic violence and law enforcement by gender'
  },
  'gender-agriculture': {
    id: 'gender-agriculture',
    name: 'Agriculture',
    georgianName: 'სოფლის მეურნეობა',
    description: 'Agricultural holdings and workforce by gender'
  },
  'gender-social-protection': {
    id: 'gender-social-protection',
    name: 'Social Protection',
    georgianName: 'სოციალური უზრუნველყოფა',
    description: 'Social assistance, pensions and welfare by gender'
  },
  'gender-sport': {
    id: 'gender-sport',
    name: 'Sport Statistics',
    georgianName: 'სპორტის სტატისტიკა',
    description: 'Sports medals and achievements by gender'
  },
  'gender-income': {
    id: 'gender-income',
    name: 'Income',
    georgianName: 'შემოსავლები',
    description: 'Wages, earnings and gender pay gap indicators'
  },
  'gender-households': {
    id: 'gender-households',
    name: 'Households',
    georgianName: 'შინამეურნეობები',
    description: 'Household structure and ownership by sex of head'
  },
  'gender-power': {
    id: 'gender-power',
    name: 'Influence and Power',
    georgianName: 'ხელისუფლება',
    description: 'Government, parliament and public administration by gender'
  },
  'gender-health': {
    id: 'gender-health',
    name: 'Health Care',
    georgianName: 'ჯანმრთელობის დაცვა',
    description: 'Health indicators and disease statistics by gender'
  }
};

export default DATASETS;
