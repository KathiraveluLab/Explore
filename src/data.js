export const TRANSPORT_MODES = {
  train: {
    id: 'train',
    label: 'Train (CP)',
    badge: '[TRAIN]',
    color: '#1d4ed8',
    dashArray: null,
    description: 'Comboios de Portugal intercity, Alfa Pendular high-speed, and regional rail.'
  },
  bus: {
    id: 'bus',
    label: 'Bus (Rede Expressos)',
    badge: '[BUS]',
    color: '#0f766e',
    dashArray: '8 4',
    description: 'Long-distance intercity coaches connecting towns and mountain corridors.'
  },
  flight: {
    id: 'flight',
    label: 'Flight (TAP / SATA)',
    badge: '[FLIGHT]',
    color: '#7c3aed',
    dashArray: '6 8',
    description: 'Domestic aviation linking mainland hubs with Madeira and the Azores.'
  },
  tram: {
    id: 'tram',
    label: 'Tram (Eletrico)',
    badge: '[TRAM]',
    color: '#d97706',
    dashArray: null,
    description: 'Historic yellow streetcars and metropolitan light rail in Lisbon and Porto.'
  },
  ferry: {
    id: 'ferry',
    label: 'Ferry (Transtejo / Douro)',
    badge: '[FERRY]',
    color: '#0284c7',
    dashArray: '3 6',
    description: 'River crossings across the Tagus estuary and scenic river routes.'
  },
  funicular: {
    id: 'funicular',
    label: 'Funicular (Elevador)',
    badge: '[FUNICULAR]',
    color: '#b91c1c',
    dashArray: '2 4',
    description: 'Historic hillside funiculars and cliffside cable lifts.'
  }
};

function makeHotels(placeName, baseRate = 95) {
  return [
    {
      id: 'pensao',
      name: `Pensão Central de ${placeName}`,
      tier: 'Budget Guesthouse',
      costEur: baseRate,
      bonusPoints: 15,
      phrasePt: 'Tem um quarto simples para uma noite?',
      phrasePronunciation: 'Taym oom kwar-too seem-plesh pah-rah oo-mah noy-teh?',
      phraseEn: 'Do you have a simple room for one night?'
    },
    {
      id: 'hotel',
      name: `Hotel Atlântico ${placeName}`,
      tier: 'Standard Urban Hotel',
      costEur: Math.round(baseRate * 1.9),
      bonusPoints: 35,
      phrasePt: 'A que horas é servido o pequeno-almoço?',
      phrasePronunciation: 'Ah keh oh-rash eh sehr-vee-doo oo peh-keh-noo ahl-moh-soo?',
      phraseEn: 'What time is breakfast served?'
    },
    {
      id: 'pousada',
      name: `Pousada Histórica de ${placeName}`,
      tier: 'Heritage Pousada',
      costEur: Math.round(baseRate * 3.8),
      bonusPoints: 80,
      phrasePt: 'Gostaria de fazer o check-in da minha reserva.',
      phrasePronunciation: 'Goosh-tah-ree-ah deh fah-zehr oo check-in dah mee-nyah heh-zehr-vah.',
      phraseEn: 'I would like to check in for my reservation.'
    }
  ];
}

export const PORTUGAL_PLACES = [
  {
    id: 'lisboa-oriente',
    name: 'Lisboa - Gare do Oriente',
    region: 'Lisboa',
    coords: [38.7677, -9.0992],
    summary: 'Santiago Calatrava-designed intermodal transport hub in Parque das Nações, built for Expo 98.',
    historyAndCulture: 'Gare do Oriente transformed Lisbon eastern riverfront from an industrial dockyard into a modern cultural district featuring the Oceanário de Lisboa and the Pavilhão do Conhecimento.',
    transitSpotlight: 'Serves as the primary northern gateway for Alfa Pendular and Intercidades trains, Lisbon Metro Red Line toward Humberto Delgado Airport, and national Rede Expressos coaches.',
    localPhrase: {
      pt: 'Bom dia! Em que linha parte o comboio para o Porto?',
      pronunciation: 'Bohm dee-ah! Eym keh lee-nyah par-teh oo kom-boy-oo pah-rah oo Pohr-too?',
      en: 'Good morning! Which platform does the train to Porto depart from?',
      context: 'Asking for your train platform at a Portuguese station'
    },
    quiz: {
      question: 'Which international exhibition prompted the construction of Gare do Oriente in 1998?',
      options: ['Expo 98 World Fair', 'Euro 2004 Football Championship', '1986 European Community Accession'],
      answerIndex: 0,
      explanation: 'Gare do Oriente opened in 1998 as the transit centerpiece for Expo 98 in Parque das Nações.'
    },
    discoveryPoints: 60,
    hotelOptions: makeHotels('Oriente', 120)
  },
  {
    id: 'lisboa-alfama',
    name: 'Lisboa - Baixa & Alfama',
    region: 'Lisboa',
    coords: [38.7117, -9.1366],
    summary: 'Lisbon historic heart linking the neoclassical Baixa grid with the medieval hills of Alfama.',
    historyAndCulture: 'Alfama survived the 1755 earthquake with its Moorish street plan intact and is recognized as the birthplace of Fado music, while Baixa Pombalina pioneered early seismic-resistant urban planning.',
    transitSpotlight: 'Linked by iconic Carris Elétrico 28E yellow Remodelado trams, the Lisbon Metro Blue and Green lines, and historic funiculars climbing steep 14% gradients.',
    localPhrase: {
      pt: 'Um bilhete com o cartão Navegante, por favor.',
      pronunciation: 'Oom bee-lyeh-teh kohm oo kar-tah-ooh Nah-veh-gahn-teh, poor fah-vohr.',
      en: 'One ticket with the Navegante transit card, please.',
      context: 'Purchasing or validating urban transit in Lisbon'
    },
    quiz: {
      question: 'What distinguishes the Pombaline reconstruction of Baixa after 1755?',
      options: ['Seismic wooden cage frames (gaiola pombalina)', 'Elevated concrete viaducts', 'Underground canal locks'],
      answerIndex: 0,
      explanation: 'Engineers built flexible timber cage frames inside masonry walls to absorb earthquake shocks.'
    },
    discoveryPoints: 75,
    hotelOptions: makeHotels('Baixa', 145)
  },
  {
    id: 'cacilhas',
    name: 'Almada & Cacilhas',
    region: 'Área Metropolitana de Lisboa',
    coords: [38.6876, -9.1482],
    summary: 'South bank Tagus riverfront gateway famous for panoramic views of Lisbon and fresh seafood along Rua Cândido dos Reis.',
    historyAndCulture: 'Almada grew from an industrial shipbuilding hub into a vibrant artistic and commuter municipality crowned by the Cristo Rei monument overlooking the 25 de Abril Bridge.',
    transitSpotlight: 'Transtejo river ferries cross the Tagus from Cais do Sodré to Cacilhas in roughly 10 minutes, connecting seamlessly to the Metro Sul do Tejo light rail network.',
    localPhrase: {
      pt: 'A que horas sai o próximo barco para Lisboa?',
      pronunciation: 'Ah keh oh-rash sah-ee oo proh-see-moo bar-koo pah-rah Leesh-boh-ah?',
      en: 'What time does the next ferry depart for Lisbon?',
      context: 'Catching a Tagus river ferry'
    },
    quiz: {
      question: 'Which river separates Cacilhas from central Lisbon?',
      options: ['Rio Tejo (Tagus)', 'Rio Douro', 'Rio Mondego'],
      answerIndex: 0,
      explanation: 'Transtejo ferries cross the wide Tagus estuary between Lisbon and south bank terminals like Cacilhas.'
    },
    discoveryPoints: 65,
    hotelOptions: makeHotels('Almada', 90)
  },
  {
    id: 'sintra',
    name: 'Sintra',
    region: 'Lisboa',
    coords: [38.7979, -9.3906],
    summary: 'UNESCO-listed misty mountain town filled with Romanticist palaces, Moorish battlements, and Sintra-Cascais coastal pines.',
    historyAndCulture: 'Sintra served as a summer sanctuary for Portuguese royalty and inspired Romantic architecture such as the colorful Palácio da Pena and Quinta da Regaleira.',
    transitSpotlight: 'Reached in 40 minutes from Lisbon Rossio Station on CP Urbanos de Lisboa commuter rail, plus local bus loop 434 winding up the Serra de Sintra.',
    localPhrase: {
      pt: 'Este autocarro vai até ao Palácio da Pena?',
      pronunciation: 'Ehsh-teh ow-too-kah-hoo vye ah-teh ow Pah-lah-syoo dah Peh-nah?',
      en: 'Does this bus go up to Pena Palace?',
      context: 'Boarding a local shuttle bus in Sintra'
    },
    quiz: {
      question: 'From which central Lisbon terminal do direct CP suburban trains run to Sintra?',
      options: ['Estação do Rossio', 'Cais do Sodré', 'Terreiro do Paço'],
      answerIndex: 0,
      explanation: 'Rossio Station features a horseshoe-arched Neo-Manueline facade and dispatches frequent trains to Sintra.'
    },
    discoveryPoints: 85,
    hotelOptions: makeHotels('Sintra', 135)
  },
  {
    id: 'cascais',
    name: 'Cascais',
    region: 'Lisboa',
    coords: [38.6979, -9.4215],
    summary: 'Atlantic fishing port turned coastal resort town at the western mouth of the Tagus estuary.',
    historyAndCulture: 'Connected to Lisbon by rail in 1889, Cascais evolved from a quiet fishing village into a cosmopolitan maritime town near Boca do Inferno and Cabo da Roca.',
    transitSpotlight: 'The scenic Linha de Cascais commuter train hugs the Atlantic shoreline all the way from Lisbon Cais do Sodré.',
    localPhrase: {
      pt: 'A Linha de Cascais tem vista para o mar do lado esquerdo.',
      pronunciation: 'Ah Lee-nyah deh Kahsh-kye-sh taym veesh-tah pah-rah oo mar doo lah-doo sh-kehr-doo.',
      en: 'The Cascais Line has ocean views on the left side.',
      context: 'Sharing a travel tip on the coastal train'
    },
    quiz: {
      question: 'Why do locals recommend sitting on the left side when riding the train from Lisbon to Cascais?',
      options: ['Uninterrupted Tagus and Atlantic Ocean views', 'Lower ticket tariffs', 'Faster Wi-Fi reception'],
      answerIndex: 0,
      explanation: 'The Linha de Cascais runs directly along the Tagus mouth and Atlantic coast on its southern side.'
    },
    discoveryPoints: 70,
    hotelOptions: makeHotels('Cascais', 140)
  },
  {
    id: 'setubal',
    name: 'Setúbal',
    region: 'Península de Setúbal',
    coords: [38.5244, -8.8882],
    summary: 'Historic port city on the Sado estuary, flanked by the limestone cliffs of Serra da Arrábida.',
    historyAndCulture: 'Renowned for choco frito, Roman fish-salting ruins across the bay in Tróia, and a resident pod of bottlenose dolphins in the Sado River.',
    transitSpotlight: 'Served by Fertagus double-decker commuter trains crossing the lower deck of the 25 de Abril Bridge, as well as CP Linha do Sado services.',
    localPhrase: {
      pt: 'Onde posso comprar o bilhete para o ferry de Tróia?',
      pronunciation: 'Ohn-deh poh-soo kohm-prar oo bee-lyeh-teh pah-rah oo ferry deh Troy-ah?',
      en: 'Where can I buy the ticket for the Troia ferry?',
      context: 'Navigating estuary transit in Setubal'
    },
    quiz: {
      question: 'Which bridge carries Fertagus commuter trains south toward Setúbal?',
      options: ['Ponte 25 de Abril', 'Ponte Vasco da Gama', 'Ponte Dom Luís I'],
      answerIndex: 0,
      explanation: 'Ponte 25 de Abril carries highway traffic on its upper deck and Fertagus rail on its lower deck.'
    },
    discoveryPoints: 80,
    hotelOptions: makeHotels('Setúbal', 95)
  },
  {
    id: 'evora',
    name: 'Évora',
    region: 'Alentejo',
    coords: [38.5714, -7.9135],
    summary: 'Walled UNESCO World Heritage city in the Alentejo plains with a Roman temple and whitewashed alleys.',
    historyAndCulture: 'Évora preserves two millennia of history, from the 1st-century Roman Temple of Évora and the 16th-century Chapel of Bones to the University of Évora founded in 1559.',
    transitSpotlight: 'Linked directly to Lisbon Oriente by CP Intercidades trains across the cork-oak plains of Alentejo and by Rede Expressos coaches.',
    localPhrase: {
      pt: 'Quanto tempo demora a viagem até ao Alentejo?',
      pronunciation: 'Kwahn-too taym-poo deh-moh-rah ah vee-ah-jeym ah-teh ow Ah-leyn-teh-joo?',
      en: 'How long does the journey to the Alentejo take?',
      context: 'Planning regional overland travel'
    },
    quiz: {
      question: 'Which ancient structure stands in the historic square at the highest point of Évora?',
      options: ['Roman Temple of Évora', 'Moorish Lighthouse', 'Gothic Shipyard'],
      answerIndex: 0,
      explanation: 'The Corinthian-column Roman Temple dates back to the 1st century CE in central Évora.'
    },
    discoveryPoints: 95,
    hotelOptions: makeHotels('Évora', 110)
  },
  {
    id: 'faro',
    name: 'Faro',
    region: 'Algarve',
    coords: [37.0194, -7.9304],
    summary: 'Capital of the Algarve, overlooking the barrier islands and salt marshes of Ria Formosa Natural Park.',
    historyAndCulture: 'Within Faro Old Town (Vila Adentro), medieval arches, orange-tree plazas, and Moorish heritage reflect southern Portugal maritime history.',
    transitSpotlight: 'Southern terminus of the CP Alfa Pendular and Intercidades main line from Lisbon, plus regional trains east and west along the Algarve coast.',
    localPhrase: {
      pt: 'Este comboio segue para o Algarve?',
      pronunciation: 'Ehsh-teh kom-boy-oo seh-geh pah-rah oo Ahl-gar-veh?',
      en: 'Does this train continue to the Algarve?',
      context: 'Confirming south-bound rail connections'
    },
    quiz: {
      question: 'Which protected coastal lagoon ecosystem borders the southern edge of Faro?',
      options: ['Ria Formosa Natural Park', 'Ria de Aveiro', 'Lagoa das Sete Cidades'],
      answerIndex: 0,
      explanation: 'Ria Formosa is a complex system of barrier islands, tidal flats, and dunes stretching along the eastern Algarve.'
    },
    discoveryPoints: 95,
    hotelOptions: makeHotels('Faro', 115)
  },
  {
    id: 'lagos',
    name: 'Lagos',
    region: 'Algarve',
    coords: [37.1028, -8.673],
    summary: 'Western Algarve maritime town famed for golden limestone sea stacks at Ponta da Piedade.',
    historyAndCulture: 'Lagos served as a major departure port during the 15th-century Age of Discoveries under Prince Henry the Navigator.',
    transitSpotlight: 'Western terminus of the scenic single-track Linha do Algarve regional train connecting coastal towns from Vila Real de Santo António.',
    localPhrase: {
      pt: 'A estação fica perto do centro histórico?',
      pronunciation: 'Ah sh-tah-sah-ooh fee-kah pehr-too doo sayn-troo sh-toh-ree-koo?',
      en: 'Is the station close to the historic center?',
      context: 'Arriving at a regional railway terminal'
    },
    quiz: {
      question: 'Which famous coastal rock formation lies just south of Lagos?',
      options: ['Ponta da Piedade', 'Cabo Girão', 'Serra do Marão'],
      answerIndex: 0,
      explanation: 'Ponta da Piedade features dramatic ochre limestone cliffs, arches, and sea caves accessible from Lagos.'
    },
    discoveryPoints: 90,
    hotelOptions: makeHotels('Lagos', 120)
  },
  {
    id: 'nazare',
    name: 'Nazaré',
    region: 'Centro (Oeste)',
    coords: [39.6012, -9.0709],
    summary: 'Traditional fishing town beneath Sítio cliff promontory, famous for winter giant surf waves.',
    historyAndCulture: 'The Nazaré submarine canyon funnels Atlantic swells into record-breaking waves off Praia do Norte, while women in traditional seven-skirt dress still dry fish on the beach.',
    transitSpotlight: 'Connected by Rede Expressos coaches from Lisbon Sete Rios and Coimbra, with the historic Ascensor da Nazaré funicular climbing from the beach to Sítio.',
    localPhrase: {
      pt: 'O ascensor para o Sítio já está a funcionar?',
      pronunciation: 'Oo ahsh-sayn-sohr pah-rah oo See-tyoo jah sh-tah ah foon-syoo-nar?',
      en: 'Is the funicular up to Sitio already running?',
      context: 'Riding the Nazaré cliffside funicular'
    },
    quiz: {
      question: 'What underwater geological feature creates the giant waves at Nazaré?',
      options: ['The Nazaré Canyon (deep submarine canyon)', 'A volcanic coral atoll', 'Tidal river bores'],
      answerIndex: 0,
      explanation: 'The 5,000-meter-deep Nazaré Canyon focuses and amplifies long-period Atlantic ocean swells.'
    },
    discoveryPoints: 90,
    hotelOptions: makeHotels('Nazaré', 100)
  },
  {
    id: 'coimbra',
    name: 'Coimbra',
    region: 'Centro',
    coords: [40.2033, -8.4103],
    summary: 'Medieval capital along the Mondego River, home to one of Europe oldest continuously operating universities.',
    historyAndCulture: 'Founded in 1290, the University of Coimbra features the baroque Biblioteca Joanina, academic capes, and the distinct acoustic Coimbra Fado tradition.',
    transitSpotlight: 'A major rail interchange at Coimbra-B on the Linha do Norte high-speed corridor, linking Lisbon, Porto, and regional lines across central Portugal.',
    localPhrase: {
      pt: 'Preciso de apanhar a ligação em Coimbra-B.',
      pronunciation: 'Preh-see-zoo deh ah-pah-nyar ah lee-gah-sah-ooh eym Kweem-brah Beh.',
      en: 'I need to catch the rail connection at Coimbra-B.',
      context: 'Transferring between trains in central Portugal'
    },
    quiz: {
      question: 'In which century was the University of Coimbra originally established by King Dinis?',
      options: ['13th century (1290)', '17th century (1640)', '19th century (1822)'],
      answerIndex: 0,
      explanation: 'King Dinis founded the Estudo Geral in 1290, making it the oldest university in the Portuguese-speaking world.'
    },
    discoveryPoints: 90,
    hotelOptions: makeHotels('Coimbra', 100)
  },
  {
    id: 'aveiro',
    name: 'Aveiro',
    region: 'Centro',
    coords: [40.6405, -8.6538],
    summary: 'Lagoon city of Art Nouveau facades, salt pans, and painted moliceiro boats navigating urban canals.',
    historyAndCulture: 'Known for egg-yolk ovos moles pastries and historic sea-salt harvesting along the Ria de Aveiro lagoon, plus striped fisherman cottages at nearby Costa Nova.',
    transitSpotlight: 'Located on the Linha do Norte railway, served by Alfa Pendular, Intercidades, and CP Urbanos do Porto suburban commuter trains.',
    localPhrase: {
      pt: 'Este bilhete dá para os comboios urbanos do Porto?',
      pronunciation: 'Ehsh-teh bee-lyeh-teh dah pah-rah oosh kom-boy-oosh oor-bah-noosh doo Pohr-too?',
      en: 'Is this ticket valid for the Porto suburban trains?',
      context: 'Checking regional commuter rail fare zones'
    },
    quiz: {
      question: 'What were Aveiro traditional crescent-prowed moliceiro boats originally used to harvest?',
      options: ['Seaweed (moliço) for agricultural fertilizer', 'Deep-sea cod', 'Granite boulders'],
      answerIndex: 0,
      explanation: 'Farmers used shallow-draft moliceiro boats to gather lagoon seaweed (moliço) to enrich coastal farmland.'
    },
    discoveryPoints: 85,
    hotelOptions: makeHotels('Aveiro', 95)
  },
  {
    id: 'porto-campanha',
    name: 'Porto - Campanhã & São Bento',
    region: 'Norte',
    coords: [41.1489, -8.5856],
    summary: 'Northern Portugal rail gateway combining Campanhã intercity junction with São Bento azulejo tile hall.',
    historyAndCulture: 'São Bento Station features over 20,000 hand-painted blue-and-white azulejo tiles by Jorge Colaço depicting royal history and rural transport traditions.',
    transitSpotlight: 'Hub for Alfa Pendular arrivals, Porto Metro lines, and urban commuter rails extending to Braga, Guimarães, Aveiro, and the Douro Valley.',
    localPhrase: {
      pt: 'Qual é o título Andante certo para esta zona?',
      pronunciation: 'Kwahl eh oo tee-too-loo Ahn-dahn-teh sehr-too pah-rah ehsh-tah zoh-nah?',
      en: 'Which Andante fare ticket is right for this zone?',
      context: 'Using the Andante multimodal transit system in Porto'
    },
    quiz: {
      question: 'Approximately how many azulejo tiles decorate the main hall of São Bento Station in Porto?',
      options: ['Around 20,000 tiles', 'Exactly 500 tiles', 'Around 2,000 tiles'],
      answerIndex: 0,
      explanation: 'Jorge Colaço painted roughly 20,000 tin-glazed ceramic tiles installed at São Bento between 1905 and 1916.'
    },
    discoveryPoints: 80,
    hotelOptions: makeHotels('Porto Centro', 125)
  },
  {
    id: 'porto-ribeira',
    name: 'Porto - Ribeira & Gaia',
    region: 'Norte',
    coords: [41.1406, -8.613],
    summary: 'Granite riverfront promenade linked to Vila Nova de Gaia wine cellars by the double-deck Dom Luís I Bridge.',
    historyAndCulture: 'Historically, flat-bottomed rabelo boats transported wine barrels down the Douro River from terraced vineyards to mature in Vila Nova de Gaia.',
    transitSpotlight: 'Served by STCP historic Elétrico 1 along the riverfront, the Funicular dos Guindais climbing the cliff, and Metro do Porto Yellow Line crossing the upper bridge deck.',
    localPhrase: {
      pt: 'Apanhamos o elétrico junto ao rio Douro.',
      pronunciation: 'Ah-pah-nyah-moosh oo eh-leh-tree-koo joon-too ow hee-oo Doh-roo.',
      en: 'Let us catch the tram alongside the Douro River.',
      context: 'Riding STCP vintage tramway in Porto'
    },
    quiz: {
      question: 'Which transit network shares the upper deck of Porto iconic Ponte Dom Luís I with pedestrians?',
      options: ['Metro do Porto light rail', 'Alfa Pendular high-speed rail', 'Atlantic freight trains'],
      answerIndex: 0,
      explanation: 'The Metro do Porto Yellow Line (Linha D) crosses the upper arch deck 45 meters above the Douro River.'
    },
    discoveryPoints: 75,
    hotelOptions: makeHotels('Ribeira', 130)
  },
  {
    id: 'braga',
    name: 'Braga',
    region: 'Norte (Minho)',
    coords: [41.5518, -8.4229],
    summary: 'Ancient Roman city of Bracara Augusta, known for baroque sanctuaries and Portugal oldest water-powered funicular.',
    historyAndCulture: 'Founded by Emperor Augustus, Braga blends university energy with landmarks like Bom Jesus do Monte, whose zigzagging baroque staircase climbs 116 meters.',
    transitSpotlight: 'Northern terminus of the CP Urbanos do Porto Braga Line and home to the 1882 Elevador do Bom Jesus, the oldest water-counterbalance funicular still operating worldwide.',
    localPhrase: {
      pt: 'Este elevador funciona apenas com o peso da água!',
      pronunciation: 'Ehsh-teh eh-leh-vah-dohr foon-syoh-nah ah-peh-nash kohm oo peh-zoo dah ah-gwah!',
      en: 'This funicular operates purely using the weight of water!',
      context: 'Learning about engineering at Bom Jesus do Monte'
    },
    quiz: {
      question: 'How is the 1882 Elevador do Bom Jesus in Braga powered?',
      options: ['Water-ballast counterbalance tanks', 'Diesel hydraulic turbines', 'Overhead 25kV catenary'],
      answerIndex: 0,
      explanation: 'Operators fill the upper car tank with water so gravity pulls it down while hoisting the lighter lower car.'
    },
    discoveryPoints: 90,
    hotelOptions: makeHotels('Braga', 90)
  },
  {
    id: 'guimaraes',
    name: 'Guimarães',
    region: 'Norte (Minho)',
    coords: [41.4425, -8.2918],
    summary: 'Birthplace of the Portuguese nation, boasting a 10th-century castle and intact medieval stone squares.',
    historyAndCulture: 'In 1128, Afonso Henriques won the Battle of São Mamede near Guimarães, laying the foundation for an independent Kingdom of Portugal.',
    transitSpotlight: 'Accessible via direct electrified CP Urbanos trains from Porto Campanhã and Rede Expressos routes through the Minho valley.',
    localPhrase: {
      pt: 'Aqui nasceu Portugal, em Guimarães.',
      pronunciation: 'Ah-kee nah-seh-oo Pohr-too-gahl, eym Gee-mah-rye-nsh.',
      en: 'Here Portugal was born, in Guimaraes.',
      context: 'Cultural motto inscribed on the historic city wall'
    },
    quiz: {
      question: 'Why is Guimarães nicknamed the "Cradle of Portugal" (Berço de Portugal)?',
      options: ['Afonso Henriques launched Portuguese independence there in the 12th century', 'It was the first Atlantic steam port', 'It hosted the 1974 constitution signing'],
      answerIndex: 0,
      explanation: 'Afonso Henriques, Portugal first king, was born in the region and fought the decisive Battle of São Mamede nearby.'
    },
    discoveryPoints: 95,
    hotelOptions: makeHotels('Guimarães', 95)
  },
  {
    id: 'viana-castelo',
    name: 'Viana do Castelo',
    region: 'Norte (Alto Minho)',
    coords: [41.6932, -8.8329],
    summary: 'Atlantic shipyard and coastal heritage town at the mouth of the Lima River beneath Santa Luzia sanctuary.',
    historyAndCulture: 'Famous for intricate Filigree gold Heart of Viana jewelry, maritime cod-fishing heritage, and the Gil Eannes hospital ship museum.',
    transitSpotlight: 'Served by the coastal Linha do Minho railway connecting Porto and Valença, plus the historic Elevador de Santa Luzia climbing the hillside.',
    localPhrase: {
      pt: 'O comboio da Linha do Minho passa junto à costa.',
      pronunciation: 'Oo kom-boy-oo dah Lee-nyah doo Mee-nyoo pah-sah joon-too ah kohsh-tah.',
      en: 'The Minho Line train runs right along the coast.',
      context: 'Traveling northward along Alto Minho'
    },
    quiz: {
      question: 'Which river meets the Atlantic Ocean at Viana do Castelo?',
      options: ['Rio Lima', 'Rio Guadiana', 'Rio Zêzere'],
      answerIndex: 0,
      explanation: 'The Lima River flows from Galicia to its Atlantic estuary right beside Viana do Castelo.'
    },
    discoveryPoints: 90,
    hotelOptions: makeHotels('Viana do Castelo', 88)
  },
  {
    id: 'peso-regua',
    name: 'Peso da Régua (Vale do Douro)',
    region: 'Norte (Douro)',
    coords: [41.1636, -7.7879],
    summary: 'Heart of the terraced Douro wine region, the world oldest demarcated wine appellation (1756).',
    historyAndCulture: 'Dry-stone schist terraces (socalcos) carved along steep river gorges produce Port and Douro table wines protected as a UNESCO Cultural Landscape.',
    transitSpotlight: 'Anchored by the scenic Linha do Douro railway hugging river bends from Porto and Pocinho, complemented by summer riverboats.',
    localPhrase: {
      pt: 'Vale a pena sentar-se do lado do rio no comboio do Douro.',
      pronunciation: 'Vah-leh ah peh-nah seyn-tar-seh doo lah-doo doo hee-oo noo kom-boy-oo doo Doh-roo.',
      en: 'It is worth sitting on the river side on the Douro train.',
      context: 'Enjoying Portugal most scenic rail corridor'
    },
    quiz: {
      question: 'In what year was the Douro wine region formally demarcated, making it one of the oldest regulated wine regions?',
      options: ['1756', '1910', '1975'],
      answerIndex: 0,
      explanation: 'The Marquis of Pombal established the Companhia Geral da Agricultura das Vinhas do Alto Douro in 1756.'
    },
    discoveryPoints: 100,
    hotelOptions: makeHotels('Régua', 105)
  },
  {
    id: 'covilha',
    name: 'Covilhã (Serra da Estrela)',
    region: 'Centro (Beira Interior)',
    coords: [40.2804, -7.5043],
    summary: 'Granite mountain city perched on the southeastern slopes of Serra da Estrela, mainland Portugal highest range.',
    historyAndCulture: 'Once known as the "Portuguese Manchester" for its wool mills, Covilhã now thrives on street-art murals, mountain shepherd traditions, and Queijo Serra da Estrela cheese.',
    transitSpotlight: 'Connected via the winding Linha da Beira Baixa railway and high-altitude mountain coach services crossing Serra da Estrela.',
    localPhrase: {
      pt: 'Está frio na serra; leve um casaco quente!',
      pronunciation: 'Sh-tah free-oo nah seh-hah; leh-veh oom kah-zah-koo keyn-teh!',
      en: 'It is cold in the mountains; bring a warm coat!',
      context: 'Preparing for inland high-altitude transit'
    },
    quiz: {
      question: 'What is the highest point in mainland Portugal, rising just west of Covilhã?',
      options: ['Torre (1,993 m) in Serra da Estrela', 'Pico Ruivo (1,862 m)', 'Serra de Monchique (902 m)'],
      answerIndex: 0,
      explanation: 'Torre reaches 1,993 meters in Serra da Estrela, while Mount Pico in the Azores is the highest point in all of Portugal.'
    },
    discoveryPoints: 105,
    hotelOptions: makeHotels('Covilhã', 85)
  },
  {
    id: 'funchal',
    name: 'Funchal (Madeira)',
    region: 'Região Autónoma da Madeira',
    coords: [32.6669, -16.9241],
    summary: 'Subtropical amphitheater capital of Madeira Island, ringed by terraced hills and Atlantic cliffs.',
    historyAndCulture: 'Discovered by Portuguese navigators in 1419, Madeira features ancient Laurisilva laurel forests, irrigation channels called levadas, and historic Monte toboggan sleds.',
    transitSpotlight: 'Reached via domestic flights into Cristiano Ronaldo Madeira Airport, served by Aerobus and Horários do Funchal buses, plus the Monte cable car.',
    localPhrase: {
      pt: 'O voo para o Funchal tem uma aterragem famosa junto ao mar.',
      pronunciation: 'Oo voh-oo pah-rah oo Foon-shahl taym oo-mah ah-teh-hah-jeym fah-moh-zah joon-too ow mar.',
      en: 'The flight to Funchal has a famous landing right beside the ocean.',
      context: 'Arriving by air on Madeira Island'
    },
    quiz: {
      question: 'What are Madeira traditional mountain irrigation channels that double as scenic walking trails?',
      options: ['Levadas', 'Acequias', 'Azulejos'],
      answerIndex: 0,
      explanation: 'Built starting in the 15th century, levadas carry rainfall from the wet north mountains to terraced southern farms.'
    },
    discoveryPoints: 140,
    hotelOptions: makeHotels('Funchal', 150)
  },
  {
    id: 'ponta-delgada',
    name: 'Ponta Delgada (Açores)',
    region: 'Região Autónoma dos Açores',
    coords: [37.7412, -25.6756],
    summary: 'Volcanic Atlantic port capital on São Miguel Island in the Azores archipelago.',
    historyAndCulture: 'Framed by black-and-white basalt Portas da Cidade gates, pineapple greenhouses, and crater lakes such as Sete Cidades and Furnas hot springs.',
    transitSpotlight: 'Linked to Lisbon and Porto via TAP Air Portugal and Azores Airlines (SATA), with PDL island coaches connecting volcanic calderas.',
    localPhrase: {
      pt: 'Nos Açores podemos ver as quatro estações num só dia.',
      pronunciation: 'Noosh Ah-soh-resh poo-deh-moosh vehr ash kwah-troo sh-tah-soh-ynsh noom soh dee-ah.',
      en: 'In the Azores we can experience four seasons in a single day.',
      context: 'Talking with locals about mid-Atlantic weather'
    },
    quiz: {
      question: 'On which Azorean island is Ponta Delgada located?',
      options: ['São Miguel', 'Terceira', 'Pico'],
      answerIndex: 0,
      explanation: 'Ponta Delgada is the largest city on São Miguel, known as Ilha Verde (the Green Island).'
    },
    discoveryPoints: 150,
    hotelOptions: makeHotels('Ponta Delgada', 140)
  }
];

export const TRANSIT_ROUTES = [
  {
    id: 'tram-lisboa-28',
    from: 'lisboa-oriente',
    to: 'lisboa-alfama',
    mode: 'tram',
    operator: 'Carris',
    serviceName: 'Metro Red + Elétrico 28E',
    durationHours: 1,
    costEur: 4,
    realWorldFareNote: 'Navegante single urban transit validation (~1.80-3.10 EUR on board)',
    basePoints: 35,
    transitPhrase: {
      pt: 'Este elétrico passa por Alfama?',
      pronunciation: 'Ehsh-teh eh-leh-tree-koo pah-sah poor Ahl-fah-mah?',
      en: 'Does this tram go through Alfama?'
    },
    educationalNote: 'Carris yellow Remodelado trams date from the 1930s and remain essential for navigating Lisbon steep curves and narrow 900 mm gauge tracks.'
  },
  {
    id: 'ferry-tejo-cacilhas',
    from: 'lisboa-alfama',
    to: 'cacilhas',
    mode: 'ferry',
    operator: 'Transtejo Soflusa',
    serviceName: 'Ferry Cais do Sodré - Cacilhas',
    durationHours: 1,
    costEur: 3,
    realWorldFareNote: 'Standard Transtejo river crossing (~1.50-2.75 EUR)',
    basePoints: 35,
    transitPhrase: {
      pt: 'Vamos apanhar o cacilheiro para a outra margem.',
      pronunciation: 'Vah-moosh ah-pah-nyar oo kah-see-lyay-roo pah-rah ah oh-trah mar-jeym.',
      en: 'Let us catch the river ferry to the other bank.'
    },
    educationalNote: 'Lisbon commuters affectionately call the Tagus ferries "cacilheiros" after their historic Cacilhas terminal.'
  },
  {
    id: 'train-rossio-sintra',
    from: 'lisboa-alfama',
    to: 'sintra',
    mode: 'train',
    operator: 'CP Urbanos de Lisboa',
    serviceName: 'Linha de Sintra Suburban Rail',
    durationHours: 1,
    costEur: 5,
    realWorldFareNote: 'CP Lisboa suburban 4-zone ticket (~2.40 EUR each way)',
    basePoints: 40,
    transitPhrase: {
      pt: 'Um bilhete de ida e volta para Sintra, por favor.',
      pronunciation: 'Oom bee-lyeh-teh deh ee-dah ee vohl-tah pah-rah Seen-trah, poor fah-vohr.',
      en: 'A round-trip ticket to Sintra, please.'
    },
    educationalNote: 'The Linha de Sintra is one of Portugal busiest commuter corridors, carrying tens of thousands of riders daily from Rossio.'
  },
  {
    id: 'bus-sintra-cascais',
    from: 'sintra',
    to: 'cascais',
    mode: 'bus',
    operator: 'Carris Metropolitana',
    serviceName: 'Coastal Bus 1624 via Cabo da Roca',
    durationHours: 1,
    costEur: 6,
    realWorldFareNote: 'Carris Metropolitana inter-municipal coach (~2.60-4.50 EUR)',
    basePoints: 45,
    transitPhrase: {
      pt: 'O motorista pára no Cabo da Roca?',
      pronunciation: 'Oo moo-too-reesh-tah pah-rah noo Kah-boo dah Hoh-kah?',
      en: 'Does the driver stop at Cabo da Roca?'
    },
    educationalNote: 'This scenic bus route skirts continental Europe westernmost cape, Cabo da Roca, before descending to Guincho beach and Cascais.'
  },
  {
    id: 'train-cascais-lisboa',
    from: 'cascais',
    to: 'lisboa-alfama',
    mode: 'train',
    operator: 'CP Urbanos de Lisboa',
    serviceName: 'Linha de Cascais Coastal Train',
    durationHours: 1,
    costEur: 5,
    realWorldFareNote: 'CP Lisboa suburban coastal pass (~2.40 EUR)',
    basePoints: 35,
    transitPhrase: {
      pt: 'O comboio para o Cais do Sodré parte em dez minutos.',
      pronunciation: 'Oo kom-boy-oo pah-rah oo Kye-sh doo Soo-dreh par-teh eym dehsh mee-noo-toosh.',
      en: 'The train to Cais do Sodre leaves in ten minutes.'
    },
    educationalNote: 'Opened in 1889 and electrified in 1926, the Linha de Cascais was Portugal very first electrified railway.'
  },
  {
    id: 'train-fertagus-setubal',
    from: 'cacilhas',
    to: 'setubal',
    mode: 'train',
    operator: 'Fertagus',
    serviceName: 'Fertagus South Bank Express',
    durationHours: 1,
    costEur: 9,
    realWorldFareNote: 'Fertagus commuter rail ticket (~4.70 EUR)',
    basePoints: 45,
    transitPhrase: {
      pt: 'Este comboio atravessa a ponte sobre o Tejo.',
      pronunciation: 'Ehsh-teh kom-boy-oo ah-trah-veh-sah ah pohn-teh soh-breh oo Teh-joo.',
      en: 'This train crosses the bridge over the Tagus.'
    },
    educationalNote: 'Fertagus operates double-decker electric trains linking Lisbon to Setúbal across the lower rail deck of the 25 de Abril suspension bridge.'
  },
  {
    id: 'bus-setubal-evora',
    from: 'setubal',
    to: 'evora',
    mode: 'bus',
    operator: 'Rede Expressos',
    serviceName: 'Alentejo Express Coach',
    durationHours: 2,
    costEur: 18,
    realWorldFareNote: 'Intercity express bus fare (~12-18 EUR)',
    basePoints: 50,
    transitPhrase: {
      pt: 'Posso colocar a minha mala no bagageiro?',
      pronunciation: 'Poh-soo koo-loo-kar ah mee-nyah mah-lah noo bah-gah-jay-roo?',
      en: 'May I place my suitcase in the luggage bay?'
    },
    educationalNote: 'Rede Expressos coaches bridge east-west routes across the Alentejo cork forests where direct rail lines do not intersect.'
  },
  {
    id: 'train-oriente-evora',
    from: 'lisboa-oriente',
    to: 'evora',
    mode: 'train',
    operator: 'CP - Comboios de Portugal',
    serviceName: 'Intercidades Linha do Alentejo',
    durationHours: 2,
    costEur: 22,
    realWorldFareNote: 'CP Intercidades 2nd class fare (~14-22 EUR)',
    basePoints: 55,
    transitPhrase: {
      pt: 'O meu lugar é junto à janela.',
      pronunciation: 'Oo meh-oo loo-gar eh joon-too ah jah-neh-lah.',
      en: 'My seat is by the window.'
    },
    educationalNote: 'The Intercidades rail service uses the Vasco da Gama / 25 de Abril corridor before crossing undulating Alentejo plains toward Évora.'
  },
  {
    id: 'bus-evora-faro',
    from: 'evora',
    to: 'faro',
    mode: 'bus',
    operator: 'Rede Expressos',
    serviceName: 'Sul-Alentejo Express Coach',
    durationHours: 4,
    costEur: 28,
    realWorldFareNote: 'Long-distance southern coach (~19-28 EUR)',
    basePoints: 65,
    transitPhrase: {
      pt: 'Fazemos uma paragem em Beja pelo caminho?',
      pronunciation: 'Fah-zeh-moosh oo-mah pah-rah-jeym eym Beh-jah peh-loo kah-mee-nyoo?',
      en: 'Do we make a stop in Beja along the way?'
    },
    educationalNote: 'Express coaches link inland Alentejo capitals like Évora and Beja straight down through the Algarve hills to Faro.'
  },
  {
    id: 'train-oriente-faro',
    from: 'lisboa-oriente',
    to: 'faro',
    mode: 'train',
    operator: 'CP - Comboios de Portugal',
    serviceName: 'Alfa Pendular Lisboa - Faro',
    durationHours: 3,
    costEur: 48,
    realWorldFareNote: 'Alfa Pendular tilting high-speed train (~26-48 EUR)',
    basePoints: 70,
    transitPhrase: {
      pt: 'O Alfa Pendular chega a Faro em cerca de três horas.',
      pronunciation: 'Oo Ahl-fah Payn-doo-lar sheh-gah ah Fah-roo eym sehr-kah deh tresh oh-rash.',
      en: 'The Alfa Pendular arrives in Faro in about three hours.'
    },
    educationalNote: 'Active hydraulic tilting allows Alfa Pendular trains to maintain high speeds through curves along southern Portugal.'
  },
  {
    id: 'train-faro-lagos',
    from: 'faro',
    to: 'lagos',
    mode: 'train',
    operator: 'CP Regional',
    serviceName: 'Linha do Algarve Regional',
    durationHours: 2,
    costEur: 12,
    realWorldFareNote: 'CP Regional Algarve coastal fare (~7.50-12 EUR)',
    basePoints: 50,
    transitPhrase: {
      pt: 'Valido o bilhete antes de entrar no comboio regional.',
      pronunciation: 'Vah-lee-doo oo bee-lyeh-teh ahn-tesh deh eyn-trar noo kom-boy-oo heh-jyoo-nahl.',
      en: 'I validate my ticket before boarding the regional train.'
    },
    educationalNote: 'Regional diesel railcars serve historic resort towns across the Algarve coast between Faro, Portimão, and Lagos.'
  },
  {
    id: 'bus-lagos-setubal',
    from: 'lagos',
    to: 'setubal',
    mode: 'bus',
    operator: 'Rede Expressos',
    serviceName: 'Costa Vicentina Coach',
    durationHours: 4,
    costEur: 32,
    realWorldFareNote: 'Southwest coastal coach (~20-32 EUR)',
    basePoints: 70,
    transitPhrase: {
      pt: 'O autocarro segue pela Costa Vicentina.',
      pronunciation: 'Oo ow-too-kah-hoo seh-geh peh-lah Kohsh-tah Vee-seyn-tee-nah.',
      en: 'The coach travels up the Vicentina Coast.'
    },
    educationalNote: 'Where railway tracks stop at Lagos, coaches serve the protected cliffs of Southwest Alentejo and Vicentina Coast Natural Park.'
  },
  {
    id: 'bus-oriente-nazare',
    from: 'lisboa-oriente',
    to: 'nazare',
    mode: 'bus',
    operator: 'Rede Expressos',
    serviceName: 'Oeste Atlantic Express',
    durationHours: 2,
    costEur: 18,
    realWorldFareNote: 'Lisbon to Nazaré express coach (~12-18 EUR)',
    basePoints: 55,
    transitPhrase: {
      pt: 'A que horas chegamos à Nazaré?',
      pronunciation: 'Ah keh oh-rash sheh-gah-moosh ah Nah-zah-reh?',
      en: 'What time do we arrive in Nazare?'
    },
    educationalNote: 'Frequent coaches connect Lisbon directly to the Silver Coast surfing and fishing harbor of Nazaré.'
  },
  {
    id: 'funicular-nazare-sitio',
    from: 'nazare',
    to: 'coimbra',
    mode: 'funicular',
    operator: 'Ascensor da Nazaré + Bus',
    serviceName: 'Ascensor do Sítio & Coimbra Connector',
    durationHours: 2,
    costEur: 19,
    realWorldFareNote: 'Funicular climb (~3 EUR) plus regional link to Coimbra',
    basePoints: 65,
    transitPhrase: {
      pt: 'Subimos no ascensor até ao miradouro do Sítio.',
      pronunciation: 'Soo-bee-moosh noo ahsh-sayn-sohr ah-teh ow mee-rah-doh-roo doo See-tyoo.',
      en: 'We ride the funicular up to the Sitio viewpoint.'
    },
    educationalNote: 'Opened in 1889, the Ascensor da Nazaré climbs a steep 42% slope linking Praia da Nazaré with the cliffside Sítio plateau.'
  },
  {
    id: 'train-oriente-coimbra',
    from: 'lisboa-oriente',
    to: 'coimbra',
    mode: 'train',
    operator: 'CP - Comboios de Portugal',
    serviceName: 'Alfa Pendular Linha do Norte',
    durationHours: 2,
    costEur: 38,
    realWorldFareNote: 'Alfa Pendular Lisbon-Coimbra (~25-38 EUR)',
    basePoints: 60,
    transitPhrase: {
      pt: 'O comboio pára em Coimbra-B?',
      pronunciation: 'Oo kom-boy-oo pah-rah eym Kweem-brah Beh?',
      en: 'Does the train stop at Coimbra-B?'
    },
    educationalNote: 'Linha do Norte is the electrified backbone of Portuguese rail, linking Lisbon, Santarém, Entroncamento, Coimbra, Aveiro, and Porto.'
  },
  {
    id: 'train-coimbra-covilha',
    from: 'coimbra',
    to: 'covilha',
    mode: 'train',
    operator: 'CP Intercidades',
    serviceName: 'Linha da Beira Baixa Mountain Rail',
    durationHours: 3,
    costEur: 26,
    realWorldFareNote: 'CP Beira Baixa regional/intercity (~16-26 EUR)',
    basePoints: 75,
    transitPhrase: {
      pt: 'A linha sobe pelas montanhas da Beira Interior.',
      pronunciation: 'Ah lee-nyah soh-beh peh-lash mohn-tah-nyash dah Bay-rah Eyn-teh-ree-ohr.',
      en: 'The rail line climbs through the Beira Interior mountains.'
    },
    educationalNote: 'Re-electrified along the Tagus and Zêzere valleys, Beira Baixa rail showcases Portugal transition from Atlantic plains to granite peaks.'
  },
  {
    id: 'bus-covilha-peso-regua',
    from: 'covilha',
    to: 'peso-regua',
    mode: 'bus',
    operator: 'Rede Expressos',
    serviceName: 'Trans-Interior Mountain Express',
    durationHours: 3,
    costEur: 25,
    realWorldFareNote: 'Interior highland bus corridor (~18-25 EUR)',
    basePoints: 75,
    transitPhrase: {
      pt: 'A paisagem muda da serra para os socalcos do Douro.',
      pronunciation: 'Ah pye-zah-jeym moo-dah dah seh-hah pah-rah oosh soo-kahl-koosh doo Doh-roo.',
      en: 'The landscape shifts from mountain peaks to Douro terraces.'
    },
    educationalNote: 'Interior buses connect university and mountain towns such as Covilhã, Guarda, and Viseu straight into the Douro Valley.'
  },
  {
    id: 'train-coimbra-aveiro',
    from: 'coimbra',
    to: 'aveiro',
    mode: 'train',
    operator: 'CP Intercidades',
    serviceName: 'Intercidades Coimbra - Aveiro',
    durationHours: 1,
    costEur: 14,
    realWorldFareNote: 'CP regional/IC ticket (~6-14 EUR)',
    basePoints: 45,
    transitPhrase: {
      pt: 'Em menos de uma hora chegamos à ria.',
      pronunciation: 'Eym meh-noosh deh oo-mah oh-rah sheh-gah-moosh ah hee-ah.',
      en: 'In less than an hour we reach the lagoon.'
    },
    educationalNote: 'Short intercity hops along the flat coastal corridor make Coimbra and Aveiro ideal car-free day trips.'
  },
  {
    id: 'train-aveiro-porto',
    from: 'aveiro',
    to: 'porto-campanha',
    mode: 'train',
    operator: 'CP Urbanos do Porto',
    serviceName: 'Linha de Aveiro Commuter Rail',
    durationHours: 1,
    costEur: 8,
    realWorldFareNote: 'CP Urbanos do Porto Aveiro Line (~3.85-8 EUR)',
    basePoints: 40,
    transitPhrase: {
      pt: 'Próxima paragem: Porto-Campanhã.',
      pronunciation: 'Proh-see-mah pah-rah-jeym: Pohr-too Kahm-pah-nyah.',
      en: 'Next stop: Porto-Campanha.'
    },
    educationalNote: 'Hourly CP Urbanos commuter trains seamlessly integrate Aveiro lagoon towns into Greater Porto public transit.'
  },
  {
    id: 'train-oriente-porto',
    from: 'lisboa-oriente',
    to: 'porto-campanha',
    mode: 'train',
    operator: 'CP - Comboios de Portugal',
    serviceName: 'Alfa Pendular Express (Lisboa - Porto)',
    durationHours: 3,
    costEur: 55,
    realWorldFareNote: 'Alfa Pendular Conforto/Turística (~33-55 EUR)',
    basePoints: 70,
    transitPhrase: {
      pt: 'O comboio mais rápido entre Lisboa e o Porto.',
      pronunciation: 'Oo kom-boy-oo myesh hah-pee-doo eyn-treh Leesh-boh-ah ee oo Pohr-too.',
      en: 'The fastest train between Lisbon and Porto.'
    },
    educationalNote: 'Alfa Pendular links Portugal two largest cities in roughly 2 hours 50 minutes at speeds up to 220 km/h.'
  },
  {
    id: 'tram-porto-ribeira',
    from: 'porto-campanha',
    to: 'porto-ribeira',
    mode: 'tram',
    operator: 'STCP & Metro do Porto',
    serviceName: 'Metro + Elétrico 1 Ribeira',
    durationHours: 1,
    costEur: 5,
    realWorldFareNote: 'Andante Z2 + STCP heritage tram fare (~2-5 EUR)',
    basePoints: 40,
    transitPhrase: {
      pt: 'Onde posso carregar o meu cartão Andante?',
      pronunciation: 'Ohn-deh poh-soo kah-heh-gar oo meh-oo kar-tah-ooh Ahn-dahn-teh?',
      en: 'Where can I top up my Andante card?'
    },
    educationalNote: 'Porto combines modern light rail (Metro do Porto) with century-old Brill wooden trams maintained by STCP along the Douro.'
  },
  {
    id: 'funicular-guindais-douro',
    from: 'porto-ribeira',
    to: 'peso-regua',
    mode: 'funicular',
    operator: 'Funicular dos Guindais + CP',
    serviceName: 'Guindais Funicular + Linha do Douro',
    durationHours: 2,
    costEur: 20,
    realWorldFareNote: 'Funicular (~4 EUR) + Linha do Douro train (~11-16 EUR)',
    basePoints: 75,
    transitPhrase: {
      pt: 'Subimos pelo Funicular dos Guindais junto à muralha.',
      pronunciation: 'Soo-bee-moosh peh-loo Foo-nee-koo-lar doosh Geen-dyesh joon-too ah moo-rah-lyah.',
      en: 'We ascend on the Guindais Funicular beside the medieval wall.'
    },
    educationalNote: 'The Funicular dos Guindais lifts passengers 61 meters straight from Ribeira up to Batalha beside the Dom Luís I Bridge.'
  },
  {
    id: 'train-porto-regua',
    from: 'porto-campanha',
    to: 'peso-regua',
    mode: 'train',
    operator: 'CP Regional',
    serviceName: 'Linha do Douro Scenic Rail',
    durationHours: 2,
    costEur: 16,
    realWorldFareNote: 'CP InterRegional Douro fare (~10.65-16 EUR)',
    basePoints: 70,
    transitPhrase: {
      pt: 'Esta é uma das viagens de comboio mais bonitas da Europa.',
      pronunciation: 'Ehsh-tah eh oo-mah dash vee-ah-jeynsh deh kom-boy-oo myesh boo-nee-tash dah Eh-oo-roh-pah.',
      en: 'This is one of the most beautiful train journeys in Europe.'
    },
    educationalNote: 'Built in the 1870s and 1880s to replace treacherous river rapids, the Linha do Douro clings directly to granite cliffs above the river.'
  },
  {
    id: 'train-porto-guimaraes',
    from: 'porto-campanha',
    to: 'guimaraes',
    mode: 'train',
    operator: 'CP Urbanos do Porto',
    serviceName: 'Linha de Guimarães Suburban',
    durationHours: 1,
    costEur: 6,
    realWorldFareNote: 'CP Urbanos do Porto (~3.55-6 EUR)',
    basePoints: 45,
    transitPhrase: {
      pt: 'Este comboio tem paragem em Guimarães.',
      pronunciation: 'Ehsh-teh kom-boy-oo taym pah-rah-jeym eym Gee-mah-rye-nsh.',
      en: 'This train terminates in Guimaraes.'
    },
    educationalNote: 'Electrified in 2004, the Guimarães Line turned a historic textile corridor into a fast green link into the Minho.'
  },
  {
    id: 'bus-guimaraes-braga',
    from: 'guimaraes',
    to: 'braga',
    mode: 'bus',
    operator: 'Rede Expressos / Ave Mobilidade',
    serviceName: 'Minho Inter-City Coach',
    durationHours: 1,
    costEur: 7,
    realWorldFareNote: 'Regional Minho coach (~4-7 EUR)',
    basePoints: 40,
    transitPhrase: {
      pt: 'Há autocarros diretos de Guimarães para Braga.',
      pronunciation: 'Ah ow-too-kah-hoosh dee-reh-toosh deh Gee-mah-rye-nsh pah-rah Brah-gah.',
      en: 'There are direct buses from Guimaraes to Braga.'
    },
    educationalNote: 'Because northern valleys sit perpendicular to rail branches, regional coaches provide the quickest transverse link between Braga and Guimarães.'
  },
  {
    id: 'train-porto-braga',
    from: 'porto-campanha',
    to: 'braga',
    mode: 'train',
    operator: 'CP Urbanos & Alfa Pendular',
    serviceName: 'Linha de Braga Rail Corridor',
    durationHours: 1,
    costEur: 7,
    realWorldFareNote: 'CP Urbanos do Porto (~3.55-7 EUR)',
    basePoints: 45,
    transitPhrase: {
      pt: 'Em Braga podemos visitar o Bom Jesus de elevador.',
      pronunciation: 'Eym Brah-gah poo-deh-moosh vee-zee-tar oo Bohm Jeh-zoosh deh eh-leh-vah-dohr.',
      en: 'In Braga we can visit Bom Jesus by funicular.'
    },
    educationalNote: 'Braga serves as the northernmost high-speed Alfa Pendular stop in Portugal as well as a dense suburban terminal.'
  },
  {
    id: 'bus-braga-viana',
    from: 'braga',
    to: 'viana-castelo',
    mode: 'bus',
    operator: 'Autoridade Intermunicipal / Rede Expressos',
    serviceName: 'Cávado - Lima Valley Coach',
    durationHours: 1,
    costEur: 11,
    realWorldFareNote: 'Regional Alto Minho coach (~6-11 EUR)',
    basePoints: 50,
    transitPhrase: {
      pt: 'Atravessamos os campos verdes do Minho.',
      pronunciation: 'Ah-trah-veh-sah-moosh oosh kahm-poosh vehr-desh doo Mee-nyoo.',
      en: 'We are crossing the green fields of Minho.'
    },
    educationalNote: 'Regional buses traverse lush Vinho Verde vineyards linking inland Braga with coastal Viana do Castelo.'
  },
  {
    id: 'train-viana-porto',
    from: 'viana-castelo',
    to: 'porto-campanha',
    mode: 'train',
    operator: 'CP InterRegional',
    serviceName: 'Linha do Minho Coastal Rail',
    durationHours: 2,
    costEur: 12,
    realWorldFareNote: 'CP Linha do Minho (~7.50-12 EUR)',
    basePoints: 55,
    transitPhrase: {
      pt: 'Atravessamos a Ponte Eiffel sobre o rio Lima.',
      pronunciation: 'Ah-trah-veh-sah-moosh ah Pohn-teh Ay-fehl soh-breh oo hee-oo Lee-mah.',
      en: 'We cross the Eiffel Bridge over the Lima River.'
    },
    educationalNote: 'Trains entering Viana do Castelo cross the two-tier iron lattice bridge designed by Gustave Eiffel in 1878.'
  },
  {
    id: 'flight-lisboa-funchal',
    from: 'lisboa-oriente',
    to: 'funchal',
    mode: 'flight',
    operator: 'TAP Air Portugal',
    serviceName: 'Lisboa (LIS) - Madeira (FNC)',
    durationHours: 2,
    costEur: 210,
    realWorldFareNote: 'Domestic island return-class expedition flight (~120-210 EUR)',
    basePoints: 110,
    transitPhrase: {
      pt: 'Qual é a porta de embarque para o Funchal?',
      pronunciation: 'Kwahl eh ah pohr-tah deh eym-bar-keh pah-rah oo Foon-shahl?',
      en: 'What is the boarding gate for Funchal?'
    },
    educationalNote: 'Madeira Airport runway famously extends out over the Atlantic Ocean on 180 reinforced concrete columns.'
  },
  {
    id: 'flight-porto-funchal',
    from: 'porto-campanha',
    to: 'funchal',
    mode: 'flight',
    operator: 'TAP / easyJet Domestic',
    serviceName: 'Porto (OPO) - Madeira (FNC)',
    durationHours: 2,
    costEur: 195,
    realWorldFareNote: 'Porto Francisco Sá Carneiro to Madeira (~110-195 EUR)',
    basePoints: 105,
    transitPhrase: {
      pt: 'O Metro do Porto liga o centro diretamente ao aeroporto.',
      pronunciation: 'Oo Meh-troo doo Pohr-too lee-gah oo sayn-troo dee-reh-tah-meyn-teh ow ah-eh-roo-pohr-too.',
      en: 'Porto Metro connects the city center directly to the airport.'
    },
    educationalNote: 'Porto Metro Violet Line (Linha E) provides seamless rail-to-flight transfers right up to Francisco Sá Carneiro terminal.'
  },
  {
    id: 'flight-lisboa-azores',
    from: 'lisboa-oriente',
    to: 'ponta-delgada',
    mode: 'flight',
    operator: 'Azores Airlines (SATA) / TAP',
    serviceName: 'Lisboa (LIS) - Ponta Delgada (PDL)',
    durationHours: 3,
    costEur: 245,
    realWorldFareNote: 'Mid-Atlantic domestic air corridor (~140-245 EUR)',
    basePoints: 125,
    transitPhrase: {
      pt: 'Os Açores ficam duas horas e meia a oeste de Lisboa.',
      pronunciation: 'Oosh Ah-soh-resh fee-kah-ooh doo-ash oh-rash ee may-ah ah oh-ehsh-teh deh Leesh-boh-ah.',
      en: 'The Azores lie two and a half hours west of Lisbon.'
    },
    educationalNote: 'Positioned 1,450 km into the North Atlantic, Ponta Delgada relies on SATA Air Açores and TAP flights plus inter-island ferries.'
  },
  {
    id: 'flight-funchal-azores',
    from: 'funchal',
    to: 'ponta-delgada',
    mode: 'flight',
    operator: 'Azores Airlines (SATA)',
    serviceName: 'Macaronesia Link (FNC - PDL)',
    durationHours: 2,
    costEur: 185,
    realWorldFareNote: 'Inter-archipelago SATA link (~115-185 EUR)',
    basePoints: 120,
    transitPhrase: {
      pt: 'Ligamos a Madeira aos Açores pelo Atlântico.',
      pronunciation: 'Lee-gah-moosh ah Mah-day-rah owsh Ah-soh-resh peh-loo Ah-tlahn-tee-koo.',
      en: 'We connect Madeira to the Azores across the Atlantic.'
    },
    educationalNote: 'Both Madeira and the Azores are Autonomous Regions of Portugal located in the volcanic Macaronesia biogeographical zone.'
  }
];
