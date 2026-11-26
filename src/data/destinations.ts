import type { Destination, MissionTheme } from '../types/game';

export const DESTINATIONS: Destination[] = [
  {
    id: 'iceland',
    name: 'Reykjavík & Geysers',
    country: 'Iceland',
    continent: 'Europe',
    coords: [-21.9, 64.1],
    latLabel: '64°N • 22°W',
    biome: 'Volcanic Island',
    animalName: 'Atlantic Puffin',
    animalAvatar: 'puffin',
    souvenirName: 'Viking Sunstone',
    souvenirId: 'viking-compass',
    souvenirCategory: 'artifact',
    routeLabel: 'Sail the Viking Path',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Land of Fire & Ice!',
      todayFact:
        'Iceland has bubbling hot springs right next to giant blue glaciers—and colorful puffins nesting on seaside cliffs.',
      timeEra: '1,000 Years Ago',
      historyTitle: 'Dragon-Headed Longships',
      historyFact:
        'Viking explorers sailed across the icy North Atlantic to Iceland using glowing crystals called sunstones to find the sun on cloudy days!',
      skyTop: '#7ea8b8',
      skyBottom: '#e9dcc6',
      accent: '#4d7c8a',
      sceneType: 'geyser-viking',
    },
    questions: {
      scout: {
        prompt:
          'Welcome to chilly Iceland! Which colorful seabird with a bright striped beak nests on Iceland’s cliffs?',
        choices: ['Atlantic Puffin', 'Flamingo', 'Desert Ostrich'],
        correctIndex: 0,
        gentleHint:
          'This little black-and-white swimmer loves cold northern oceans and has a bright orange-striped beak!',
        crewClue:
          'Crew Tip: Look for the playful northern bird nicknamed the "clown of the sea"!',
      },
      navigator: {
        prompt:
          'Iceland is nicknamed the "Land of Fire and Ice." What shoots high into the sky from underground hot springs here?',
        choices: ['Geysers of steam', 'Sandstorms', 'Snow tornadoes'],
        correctIndex: 0,
        gentleHint:
          'Underground volcanoes heat up water until it blasts upward like a giant natural fountain!',
        crewClue:
          'Crew Tip: The English word "geyser" actually comes from a famous hot spring in Iceland called Geysir!',
      },
      trailblazer: {
        prompt:
          'Over 1,000 years ago, which seafaring explorers sailed wooden longships from Scandinavia to settle Iceland?',
        choices: ['The Vikings', 'The Roman Legions', 'The Polynesians'],
        correctIndex: 0,
        gentleHint:
          'They came from Norway and Denmark in fast ships carved with dragon heads.',
        crewClue:
          'Crew Tip: Think of Norse explorers who also sailed all the way to Greenland and Canada!',
      },
    },
    neighbors: ['canada', 'switzerland', 'italy', 'morocco'],
  },
  {
    id: 'italy',
    name: 'Naples & Vesuvius',
    country: 'Italy',
    continent: 'Europe',
    coords: [14.2, 40.8],
    latLabel: '41°N • 14°E',
    biome: 'Sunny Coast & Volcano',
    animalName: 'Italian Red Fox',
    animalAvatar: 'fox',
    souvenirName: 'Neapolitan Pizza Peel',
    souvenirId: 'pizza-peel',
    souvenirCategory: 'artifact',
    routeLabel: 'Taste the Pizza Trail',
    themes: ['grand-tour', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Where Modern Pizza Was Born!',
      todayFact:
        'Italy is shaped just like a tall boot kicking into the sunny Mediterranean Sea, with Mount Vesuvius rising behind Naples.',
      timeEra: '1889 CE',
      historyTitle: 'A Pizza for a Queen',
      historyFact:
        'Bakers in Naples invented modern tomato-and-cheese pizza—and even topped one with red tomatoes, white mozzarella, and green basil to match Italy’s flag!',
      skyTop: '#6ba4b8',
      skyBottom: '#f4d9a6',
      accent: '#c4533a',
      sceneType: 'volcano-bay',
    },
    questions: {
      scout: {
        prompt:
          'If you look closely at Italy on a map, its shape looks just like something you wear! What does Italy look like?',
        choices: ['A tall boot', 'A winter mitten', 'A baseball cap'],
        correctIndex: 0,
        gentleHint:
          'Picture a tall leather shoe with a heel kicking an island like a soccer ball!',
        crewClue:
          'Crew Tip: Look at Italy on the map—it reaches down into the sea like a boot!',
      },
      navigator: {
        prompt:
          'Which world-famous food was invented by bakers right here in Naples, Italy?',
        choices: ['Modern Pizza', 'Maple Syrup', 'Tacos'],
        correctIndex: 0,
        gentleHint:
          'Think warm flat bread, red tomato sauce, melted mozzarella cheese, and fresh basil!',
        crewClue:
          'Crew Tip: It’s sliced into tasty fractions at family dinner nights!',
      },
      trailblazer: {
        prompt:
          'Right beside Naples stands Mount Vesuvius, a famous volcano that preserved which ancient Roman city under ash in 79 CE?',
        choices: ['Pompeii', 'Atlantis', 'Sparta'],
        correctIndex: 0,
        gentleHint:
          'Archaeologists still walk down its ancient stone streets and bakeries today.',
        crewClue:
          'Crew Tip: This ancient city starts with the letter P and sits right at the foot of Vesuvius.',
      },
    },
    neighbors: ['iceland', 'switzerland', 'greece', 'morocco', 'egypt'],
  },
  {
    id: 'greece',
    name: 'Athens & the Acropolis',
    country: 'Greece',
    continent: 'Europe',
    coords: [23.7, 38.0],
    latLabel: '38°N • 24°E',
    biome: 'Sunny Mediterranean',
    animalName: 'Athena’s Little Owl',
    animalAvatar: 'owl',
    souvenirName: 'Golden Olive Wreath',
    souvenirId: 'olive-wreath',
    souvenirCategory: 'artifact',
    routeLabel: 'Follow the Wise Owl',
    themes: ['grand-tour', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Marble Columns Above the Sea',
      todayFact:
        'Greece has thousands of sparkling blue islands and whitewashed villages, plus ancient marble temples shining on hilltops.',
      timeEra: '2,500 Years Ago',
      historyTitle: 'The Very First Olympic Games',
      historyFact:
        'Ancient Greeks started the Olympic Games—and instead of gold medals, winners were crowned with a wreath made of olive branches!',
      skyTop: '#5e9bb5',
      skyBottom: '#f4e6cc',
      accent: '#c88a2b',
      sceneType: 'parthenon',
    },
    questions: {
      scout: {
        prompt:
          'Long ago in ancient Greece, athletes raced in the very first Olympic Games! What prize did winners wear on their heads?',
        choices: ['An olive-leaf crown', 'A cowboy hat', 'A bicycle helmet'],
        correctIndex: 0,
        gentleHint:
          'It was woven from green leaves of Greece’s favorite sunny tree!',
        crewClue:
          'Crew Tip: Olive trees grow everywhere in Greece and stood for peace and victory.',
      },
      navigator: {
        prompt:
          'Which sparkling sea surrounds Greece’s thousands of sunny islands?',
        choices: ['The Mediterranean Sea', 'The Arctic Ocean', 'The Great Lakes'],
        correctIndex: 0,
        gentleHint:
          'Its name means "middle of the land" because it sits right between Europe and Africa.',
        crewClue:
          'Crew Tip: Look right between Italy, Greece, and Egypt on the atlas!',
      },
      trailblazer: {
        prompt:
          'High on a rocky hill in Athens stands the Parthenon, an ancient temple dedicated to Athena—the goddess of wisdom and which bird?',
        choices: ['The Owl', 'The Penguin', 'The Flamingo'],
        correctIndex: 0,
        gentleHint:
          'This wise nighttime bird was stamped onto ancient Athenian silver coins!',
        crewClue:
          'Crew Tip: Think of the bird people still call wise today: hoo-hoo!',
      },
    },
    neighbors: ['italy', 'switzerland', 'egypt', 'india'],
  },
  {
    id: 'switzerland',
    name: 'The Swiss Alps',
    country: 'Switzerland',
    continent: 'Europe',
    coords: [8.2, 46.8],
    latLabel: '47°N • 8°E',
    biome: 'Snowy Mountain Peaks',
    animalName: 'Mountain Fox',
    animalAvatar: 'fox',
    souvenirName: 'Brass Alpine Bell',
    souvenirId: 'alpine-bell',
    souvenirCategory: 'artifact',
    routeLabel: 'Climb the Alpine Peaks',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'Trains Through the Clouds',
      todayFact:
        'Bright red mountain trains wind across tall stone bridges in the snowy Alps, passing emerald lakes and ringing cowbells.',
      timeEra: '1800s',
      historyTitle: 'Carving Tunnels Through Mountains',
      historyFact:
        'Engineers in Switzerland built some of the world’s longest tunnels right through solid mountain rock so trains could cross the snowy Alps all winter!',
      skyTop: '#6b9ab4',
      skyBottom: '#f2e8d7',
      accent: '#c4533a',
      sceneType: 'alps-peaks',
    },
    questions: {
      scout: {
        prompt:
          'High up in the Swiss Alps, what covers the pointy mountaintops even in the warm summertime?',
        choices: ['Sparkling white snow', 'Deep ocean coral', 'Cactus forests'],
        correctIndex: 0,
        gentleHint:
          'The higher you climb up a giant mountain, the colder the air gets!',
        crewClue:
          'Crew Tip: Skiers and sledders love visiting these tall white peaks.',
      },
      navigator: {
        prompt:
          'Which continent is home to the snowy Alps mountain range?',
        choices: ['Europe', 'Australia', 'South America'],
        correctIndex: 0,
        gentleHint:
          'Look just north of boot-shaped Italy on our world atlas!',
        crewClue:
          'Crew Tip: The Alps stretch across Switzerland, Italy, France, and Austria.',
      },
      trailblazer: {
        prompt:
          'Switzerland doesn’t touch any ocean at all! What do geographers call a country completely surrounded by land?',
        choices: ['Landlocked', 'An archipelago', 'A peninsula'],
        correctIndex: 0,
        gentleHint:
          'Think of a country "locked" in by neighboring land on every side.',
        crewClue:
          'Crew Tip: The answer literally has the word "land" right at the start!',
      },
    },
    neighbors: ['iceland', 'italy', 'greece', 'china'],
  },
  {
    id: 'egypt',
    name: 'Giza & the Nile',
    country: 'Egypt',
    continent: 'Africa',
    coords: [31.2, 30.0],
    latLabel: '30°N • 31°E',
    biome: 'Golden Desert & River',
    animalName: 'Desert Fox',
    animalAvatar: 'fox',
    souvenirName: 'Sandstone Scarab',
    souvenirId: 'scarab',
    souvenirCategory: 'artifact',
    routeLabel: 'Sail the Nile Boats',
    themes: ['grand-tour', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Giants of the Golden Sands',
      todayFact:
        'The mighty Nile River flows north through golden desert sands, bringing green palm trees and cool breezes right past the Great Pyramids.',
      timeEra: '4,500 Years Ago',
      historyTitle: 'Older Than Woolly Mammoths!',
      historyFact:
        'Workers floated giant limestone blocks down the Nile on wooden boats to build the Great Pyramid—back when woolly mammoths still walked on Earth!',
      skyTop: '#cf8b57',
      skyBottom: '#f7dfad',
      accent: '#c88a2b',
      sceneType: 'pyramids-nile',
    },
    questions: {
      scout: {
        prompt:
          'Long ago in Egypt, ancient builders stacked giant stone blocks into huge triangles in the desert. What are they called?',
        choices: ['The Pyramids', 'The Igloos', 'The Treehouses'],
        correctIndex: 0,
        gentleHint:
          'They have four triangular sides that meet at a pointy top!',
        crewClue:
          'Crew Tip: One of the most famous ones sits right beside the giant stone Sphinx!',
      },
      navigator: {
        prompt:
          'Which continent is Egypt on—at the northeastern corner beside the Nile River?',
        choices: ['Africa', 'North America', 'Antarctica'],
        correctIndex: 0,
        gentleHint:
          'Look just south of the Mediterranean Sea on our big map.',
        crewClue:
          'Crew Tip: It’s the giant continent that also has the Sahara Desert and the Serengeti!',
      },
      trailblazer: {
        prompt:
          'Ancient Egyptians wrote stories on paper made from river reeds using picture symbols called what?',
        choices: ['Hieroglyphs', 'Morse Code', 'Braille'],
        correctIndex: 0,
        gentleHint:
          'These carved pictures included birds, eyes, suns, and reeds on temple walls.',
        crewClue:
          'Crew Tip: The word starts with "Hiero-" and means "sacred carvings"!',
      },
    },
    neighbors: ['italy', 'greece', 'morocco', 'tanzania', 'india'],
  },
  {
    id: 'morocco',
    name: 'Sahara Star Oasis',
    country: 'Morocco',
    continent: 'Africa',
    coords: [-5.5, 31.5],
    latLabel: '32°N • 6°W',
    biome: 'Sweeping Sand Dunes',
    animalName: 'Fennec Fox',
    animalAvatar: 'fox',
    souvenirName: 'Caravan Star Lantern',
    souvenirId: 'star-lantern',
    souvenirCategory: 'artifact',
    routeLabel: 'Cross the Sahara Caravan',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Lanterns Under Desert Stars',
      todayFact:
        'Towering orange sand dunes ripple like ocean waves across the Sahara, where tiny big-eared fennec foxes come out at twilight.',
      timeEra: '1,000 Years Ago',
      historyTitle: 'The Salt & Gold Caravans',
      historyFact:
        'Long camel caravans crossed the Sahara by night using the stars as a map, trading precious salt, spices, and books between bustling desert cities!',
      skyTop: '#3e5c76',
      skyBottom: '#e5a467',
      accent: '#c4533a',
      sceneType: 'sahara-dunes',
    },
    questions: {
      scout: {
        prompt:
          'Tiny fennec foxes live in the hot Sahara Desert. Why do they have such giant, adorable ears?',
        choices: [
          'To stay cool in the desert heat',
          'To fly like airplanes',
          'To swim underwater',
        ],
        correctIndex: 0,
        gentleHint:
          'Big thin ears work like built-in fans that let warm heat escape into the breeze!',
        crewClue:
          'Crew Tip: Elephants use their big ears for the very same clever trick!',
      },
      navigator: {
        prompt:
          'What is the name of the largest hot desert in the whole world, stretching across northern Africa?',
        choices: ['The Sahara Desert', 'The Amazon Desert', 'The Tundra'],
        correctIndex: 0,
        gentleHint:
          'Its name comes from the Arabic word for "desert" and starts with S.',
        crewClue:
          'Crew Tip: It’s almost as big as the entire United States!',
      },
      trailblazer: {
        prompt:
          'A shady green spot with water and palm trees in the middle of a vast sandy desert is called what?',
        choices: ['An Oasis', 'A Glacier', 'A Fjord'],
        correctIndex: 0,
        gentleHint:
          'Travelers and camel caravans rested here to refill their water flasks.',
        crewClue:
          'Crew Tip: It starts with the letter O and has underground springs!',
      },
    },
    neighbors: ['iceland', 'italy', 'egypt', 'brazil', 'mexico'],
  },
  {
    id: 'tanzania',
    name: 'Serengeti Plains',
    country: 'Tanzania',
    continent: 'Africa',
    coords: [34.8, -2.3],
    latLabel: '2°S • 35°E',
    biome: 'Golden Savanna',
    animalName: 'Golden Lion',
    animalAvatar: 'lion',
    souvenirName: 'Savanna Rhythm Drum',
    souvenirId: 'savanna-drum',
    souvenirCategory: 'wildlife',
    routeLabel: 'Follow the Great Migration',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'The Endless Golden Grasslands',
      todayFact:
        'Flat-topped acacia trees dot the wide Serengeti plains, where giraffes, zebras, elephants, and sleepy lions roam under huge skies.',
      timeEra: 'Millions of Years',
      historyTitle: 'The Cradle of Footprints',
      historyFact:
        'Near the Serengeti at Olduvai Gorge, scientists discovered ancient footsteps preserved in volcanic ash—telling the story of early humans exploring Earth!',
      skyTop: '#d4844a',
      skyBottom: '#f7d89c',
      accent: '#b56727',
      sceneType: 'savanna-acacia',
    },
    questions: {
      scout: {
        prompt:
          'Look out across the tall golden grass of the Serengeti! Which big cat lives in a family group called a pride?',
        choices: ['Lions', 'Penguins', 'Sea Otters'],
        correctIndex: 0,
        gentleHint:
          'Listen for a mighty ROAR echoing across the sunny African savanna!',
        crewClue:
          'Crew Tip: The daddy ones grow big fluffy manes around their heads.',
      },
      navigator: {
        prompt:
          'What do we call a wide, warm grassland dotted with scattered acacia trees where zebras and giraffes graze?',
        choices: ['A Savanna', 'A Coral Reef', 'An Ice Sheet'],
        correctIndex: 0,
        gentleHint:
          'It’s not a thick jungle and not a sandy desert—it’s a sunny grassland starting with S!',
        crewClue:
          'Crew Tip: Think of the wide open plains in Lion King—that’s a savanna!',
      },
      trailblazer: {
        prompt:
          'Every year in the Serengeti, over a million wildebeest and zebras travel in a giant circle searching for fresh grass. What is this seasonal journey called?',
        choices: ['The Great Migration', 'Hibernation', 'Photosynthesis'],
        correctIndex: 0,
        gentleHint:
          'Birds and butterflies do a version of this big seasonal move, too!',
        crewClue:
          'Crew Tip: Moving from place to place with the seasons is called migration.',
      },
    },
    neighbors: ['egypt', 'madagascar', 'india', 'brazil'],
  },
  {
    id: 'madagascar',
    name: 'Baobab Island',
    country: 'Madagascar',
    continent: 'Africa',
    coords: [46.8, -19.0],
    latLabel: '19°S • 47°E',
    biome: 'Island Forest',
    animalName: 'Island Turtle',
    animalAvatar: 'turtle',
    souvenirName: 'Baobab Seed Pod',
    souvenirId: 'baobab-pod',
    souvenirCategory: 'wildlife',
    routeLabel: 'Hop to Lemur Island',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'Trees That Look Upside-Down!',
      todayFact:
        'Madagascar is a giant island off the coast of Africa where ring-tailed lemurs leap between giant baobab trees found almost nowhere else.',
      timeEra: '88 Million Years Ago',
      historyTitle: 'An Island Ark of Wonders',
      historyFact:
        'Because Madagascar drifted apart from other continents millions of years ago, its wildlife evolved into one-of-a-kind creatures—from tiny chameleons to dancing lemurs!',
      skyTop: '#df9467',
      skyBottom: '#f7dfba',
      accent: '#8a5233',
      sceneType: 'baobab-island',
    },
    questions: {
      scout: {
        prompt:
          'Madagascar is completely surrounded by ocean water on every side! What kind of landform is Madagascar?',
        choices: ['A giant island', 'A volcano crater', 'A mountain cave'],
        correctIndex: 0,
        gentleHint:
          'To visit Madagascar from Africa, you have to fly or take a boat across water!',
        crewClue:
          'Crew Tip: Look off the southeast coast of Africa—land with water all around is an island!',
      },
      navigator: {
        prompt:
          'Which fluffy, striped-tail animal lives in the wild ONLY on the island of Madagascar?',
        choices: ['Ring-tailed Lemurs', 'Polar Bears', 'Kangaroos'],
        correctIndex: 0,
        gentleHint:
          'They love sunbathing with their arms stretched wide and waving black-and-white striped tails!',
        crewClue:
          'Crew Tip: You might know them from animated movies set on Madagascar!',
      },
      trailblazer: {
        prompt:
          'Madagascar sits in which warm ocean between Africa, Asia, and Australia?',
        choices: ['The Indian Ocean', 'The Arctic Ocean', 'The Baltic Sea'],
        correctIndex: 0,
        gentleHint:
          'Look north of Madagascar on the atlas—this ocean is named after a big country in South Asia!',
        crewClue:
          'Crew Tip: India sits right at the top of this ocean.',
      },
    },
    neighbors: ['tanzania', 'india', 'outback', 'antarctica'],
  },
  {
    id: 'india',
    name: 'Agra & Monsoon Rivers',
    country: 'India',
    continent: 'Asia',
    coords: [78.0, 27.2],
    latLabel: '27°N • 78°E',
    biome: 'Lush Rivers & Palaces',
    animalName: 'Bengal Tiger',
    animalAvatar: 'lion',
    souvenirName: 'Ancient Number Zero',
    souvenirId: 'zero-tablet',
    souvenirCategory: 'artifact',
    routeLabel: 'Ride the Monsoon Winds',
    themes: ['grand-tour', 'time-travel', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'Marble Domes & Bright Festivals',
      todayFact:
        'From the white marble Taj Mahal to emerald forests where Bengal tigers prowl, India bursts with vibrant colors, spices, and music.',
      timeEra: '1,500 Years Ago',
      historyTitle: 'The Invention of Zero!',
      historyFact:
        'Mathematicians in ancient India were the first to use the number ZERO (0) as a real number—making modern math, rockets, and computers possible!',
      skyTop: '#d79674',
      skyBottom: '#f8e6c6',
      accent: '#c4533a',
      sceneType: 'monsoon-palace',
    },
    questions: {
      scout: {
        prompt:
          'Which striped big cat sneaks quietly through the shady forests and tall reeds of India?',
        choices: ['Bengal Tiger', 'Walrus', 'Koala'],
        correctIndex: 0,
        gentleHint:
          'It has bright orange fur with bold black stripes—and it even loves swimming!',
        crewClue:
          'Crew Tip: Every single tiger has its own unique stripe pattern, just like fingerprints!',
      },
      navigator: {
        prompt:
          'Ancient mathematicians in India gave the whole world a super important number shaped like a circle. Which number was it?',
        choices: ['Zero (0)', 'One hundred (100)', 'Seven (7)'],
        correctIndex: 0,
        gentleHint:
          'Without this round number, you couldn’t write 10, 100, or count down to blast-off!',
        crewClue:
          'Crew Tip: Think of the number that means "nothing" yet makes big numbers work!',
      },
      trailblazer: {
        prompt:
          'Every summer, warm winds blow off the Indian Ocean bringing months of refreshing rain that helps farmers grow rice and mangoes. What are these seasonal winds called?',
        choices: ['Monsoons', 'Blizzards', 'Geysers'],
        correctIndex: 0,
        gentleHint:
          'The word starts with M and brings huge, welcome summer rains to South Asia.',
        crewClue:
          'Crew Tip: Look at the name of the route we just flew to get here!',
      },
    },
    neighbors: ['egypt', 'greece', 'tanzania', 'madagascar', 'nepal', 'borneo'],
  },
  {
    id: 'nepal',
    name: 'Himalayas & Everest',
    country: 'Nepal',
    continent: 'Asia',
    coords: [86.9, 27.9],
    latLabel: '28°N • 87°E',
    biome: 'Roof of the World',
    animalName: 'Mountain Owl',
    animalAvatar: 'owl',
    souvenirName: 'Mountain Flag Pennant',
    souvenirId: 'prayer-flags',
    souvenirCategory: 'artifact',
    routeLabel: 'Soar Above the Clouds',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'Touching the Sky at Mount Everest',
      todayFact:
        'Colorful cloth flags flutter in the crisp mountain wind across Nepal, home to Mount Everest—the tallest mountain above sea level on Earth!',
      timeEra: '1953 CE',
      historyTitle: 'First Footsteps on Top of the World',
      historyFact:
        'Tenzing Norgay of Nepal and Edmund Hillary of New Zealand teamed up as climbing partners to become the first people ever to stand atop Mount Everest!',
      skyTop: '#4c7592',
      skyBottom: '#e9e4db',
      accent: '#2b6cb0',
      sceneType: 'himalaya-peaks',
    },
    questions: {
      scout: {
        prompt:
          'Mount Everest in the Himalayas is famous for being the tallest WHAT on planet Earth?',
        choices: ['Tallest mountain', 'Tallest waterfall', 'Tallest tree'],
        correctIndex: 0,
        gentleHint:
          'Its snowy peak rises so high it pokes right up near where jet airplanes fly!',
        crewClue:
          'Crew Tip: Look at the jagged snowy peaks rising behind our postcard!',
      },
      navigator: {
        prompt:
          'Which giant mountain range in Asia is home to Mount Everest and fuzzy snow leopards?',
        choices: ['The Himalayas', 'The Rocky Mountains', 'The Sahara'],
        correctIndex: 0,
        gentleHint:
          'Its name means "Home of the Snow" and sits right between India and China.',
        crewClue:
          'Crew Tip: It starts with "Hima-" and stretches like a snowy wall across Asia!',
      },
      trailblazer: {
        prompt:
          'In 1953, Edmund Hillary and Sherpa mountaineer Tenzing Norgay proved what matters most in climbing Everest by reaching the summit together. Who were the Sherpa people?',
        choices: [
          'Skilled Himalayan mountain guides',
          'Ancient Viking boat builders',
          'Desert spice merchants',
        ],
        correctIndex: 0,
        gentleHint:
          'They have lived in the high valleys of Nepal for generations and know the mountain trails best.',
        crewClue:
          'Crew Tip: Just like our relay crew, teamwork got them to the very top!',
      },
    },
    neighbors: ['india', 'china', 'borneo'],
  },
  {
    id: 'china',
    name: 'Sichuan & Bamboo Hills',
    country: 'China',
    continent: 'Asia',
    coords: [104.1, 30.7],
    latLabel: '31°N • 104°E',
    biome: 'Misty Bamboo Forests',
    animalName: 'Giant Panda',
    animalAvatar: 'panda',
    souvenirName: 'Ancient Silk Kite',
    souvenirId: 'silk-kite',
    souvenirCategory: 'artifact',
    routeLabel: 'Trace the Ancient Silk Road',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Pandas, Kites & Winding Walls',
      todayFact:
        'Misty green hills filled with crunchy bamboo are home to playful giant pandas—and across northern China winds the stone Great Wall.',
      timeEra: '2,000+ Years Ago',
      historyTitle: 'Paper, Kites & the Compass!',
      historyFact:
        'Ancient inventors in China created kites, paper, silk fabric, and the magnetic compass—which later helped sailors navigate every ocean on Earth!',
      skyTop: '#7ea699',
      skyBottom: '#f2e8cf',
      accent: '#c4533a',
      sceneType: 'bamboo-wall',
    },
    questions: {
      scout: {
        prompt:
          'Giant black-and-white pandas live in the misty hills of China. What crunchy green plant do they munch almost all day long?',
        choices: ['Bamboo', 'Pickles', 'Pinecones'],
        correctIndex: 0,
        gentleHint:
          'It grows super tall and hollow like green stalks in panda forests!',
        crewClue:
          'Crew Tip: Pandas eat up to 25 pounds of this tall green stalk every single day!',
      },
      navigator: {
        prompt:
          'Ancient inventors in China made a breezy toy from silk and bamboo that still flies high in windy parks today. What is it?',
        choices: ['Kites', 'Skateboards', 'Trampolines'],
        correctIndex: 0,
        gentleHint:
          'You hold onto a string while the wind lifts it soaring into the sky!',
        crewClue:
          'Crew Tip: They also invented paper and the magnetic compass!',
      },
      trailblazer: {
        prompt:
          'What was the famous network of ancient trade paths that carried silk, paper, and spices all the way from China toward Europe?',
        choices: ['The Silk Road', 'The Ice Highway', 'The Oregon Trail'],
        correctIndex: 0,
        gentleHint:
          'It was named after the soft, shimmering fabric that China was famous for weaving.',
        crewClue:
          'Crew Tip: Check the route name we flew on our atlas to arrive here!',
      },
    },
    neighbors: ['switzerland', 'nepal', 'japan', 'borneo'],
  },
  {
    id: 'japan',
    name: 'Kyoto & Mount Fuji',
    country: 'Japan',
    continent: 'Asia',
    coords: [138.7, 35.4],
    latLabel: '35°N • 139°E',
    biome: 'Cherry Blossom Islands',
    animalName: 'Snowy Crane',
    animalAvatar: 'owl',
    souvenirName: 'Golden Origami Crane',
    souvenirId: 'origami-crane',
    souvenirCategory: 'artifact',
    routeLabel: 'Drift with Cherry Blossoms',
    themes: ['grand-tour', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Pink Petals & Snow-Capped Fuji',
      todayFact:
        'Japan is an island chain where sleek bullet trains zip past bright red pagoda shrines, blooming pink cherry trees, and snow-capped Mount Fuji.',
      timeEra: '400+ Years Ago',
      historyTitle: 'The Art of Folding Paper',
      historyFact:
        'Japanese artists turned single square sheets of paper into animals, cranes, and boats without using a single cut of scissors—an art called origami!',
      skyTop: '#90afc4',
      skyBottom: '#f8dede',
      accent: '#c4533a',
      sceneType: 'fuji-pagoda',
    },
    questions: {
      scout: {
        prompt:
          'Every springtime in Japan, parks turn soft pink as families picnic under blooming trees! What flowers bloom on them?',
        choices: ['Cherry blossoms', 'Sunflowers', 'Cactus flowers'],
        correctIndex: 0,
        gentleHint:
          'Their soft pink petals float through the breeze like spring snow!',
        crewClue:
          'Crew Tip: In Japan, these famous pink tree flowers are called "sakura"!',
      },
      navigator: {
        prompt:
          'What is the traditional Japanese art of folding a flat piece of paper into cranes, frogs, and stars?',
        choices: ['Origami', 'Pottery', 'Weaving'],
        correctIndex: 0,
        gentleHint:
          'The word comes from "ori" (folding) and "kami" (paper)!',
        crewClue:
          'Crew Tip: Legend says folding 1,000 paper cranes brings good luck and peace.',
      },
      trailblazer: {
        prompt:
          'Japan is made up of thousands of islands curving along the Pacific Ocean. What is a chain or group of islands called?',
        choices: ['An Archipelago', 'A Canyon', 'A Delta'],
        correctIndex: 0,
        gentleHint:
          'It’s a fun big geography word starting with A (ar-kuh-PEL-uh-go)!',
        crewClue:
          'Crew Tip: Hawaii, Indonesia, and Japan are all famous archipelagos.',
      },
    },
    neighbors: ['china', 'borneo', 'hawaii', 'great-barrier-reef'],
  },
  {
    id: 'borneo',
    name: 'Borneo Rainforest',
    country: 'Borneo',
    continent: 'Asia',
    coords: [114.5, 1.5],
    latLabel: '2°N • 115°E',
    biome: 'Tropical Rainforest',
    animalName: 'Canopy Otter',
    animalAvatar: 'otter',
    souvenirName: 'Spice Island Compass',
    souvenirId: 'spice-compass',
    souvenirCategory: 'wildlife',
    routeLabel: 'Swing Through the Canopy',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'One of Earth’s Oldest Forests',
      todayFact:
        'Towering green trees right near the Earth’s warm equator shelter red-haired orangutans, tiny pygmy elephants, and giant blooming flowers.',
      timeEra: '500 Years Ago',
      historyTitle: 'The Spice Island Sailors',
      historyFact:
        'Wooden sailing ships from across Asia and Europe sailed to these lush tropical islands in search of fragrant spices like cinnamon, cloves, and nutmeg!',
      skyTop: '#5d988b',
      skyBottom: '#dce8c5',
      accent: '#467856',
      sceneType: 'borneo-canopy',
    },
    questions: {
      scout: {
        prompt:
          'High up in the leafy treetops of Borneo live shaggy orange apes whose name means "person of the forest." Who are they?',
        choices: ['Orangutans', 'Polar Bears', 'Walruses'],
        correctIndex: 0,
        gentleHint:
          'They have super long arms for swinging from branch to branch and making cozy leaf nests!',
        crewClue:
          'Crew Tip: Their name starts with the color of their reddish-orange fur!',
      },
      navigator: {
        prompt:
          'Borneo sits right on the imaginary warm belt circling the middle of planet Earth. What is that line called?',
        choices: ['The Equator', 'The North Pole', 'The Jet Stream'],
        correctIndex: 0,
        gentleHint:
          'It divides the Northern Hemisphere and Southern Hemisphere right in equal halves!',
        crewClue:
          'Crew Tip: Look at the word "equal"—the Equator splits Earth right down the middle.',
      },
      trailblazer: {
        prompt:
          'What do scientists call the high, leafy "roof" formed by interlocking rainforest treetops where birds and orangutans live?',
        choices: ['The Canopy', 'The Tundra', 'The Bedrock'],
        correctIndex: 0,
        gentleHint:
          'It acts like a giant leafy umbrella soaking up the tropical sunshine!',
        crewClue:
          'Crew Tip: A tent-like cover overhead is also called a canopy.',
      },
    },
    neighbors: ['india', 'nepal', 'china', 'japan', 'great-barrier-reef', 'outback'],
  },
  {
    id: 'great-barrier-reef',
    name: 'Great Barrier Reef',
    country: 'Australia',
    continent: 'Oceania',
    coords: [147.7, -18.3],
    latLabel: '18°S • 148°E',
    biome: 'Coral Reef Ocean',
    animalName: 'Green Sea Turtle',
    animalAvatar: 'turtle',
    souvenirName: 'Painted Coral Shell',
    souvenirId: 'coral-shell',
    souvenirCategory: 'wildlife',
    routeLabel: 'Follow the Sea Turtles',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'An Underwater Rainbow City',
      todayFact:
        'Stretching longer than 1,400 miles off Australia’s coast, the Great Barrier Reef is the largest living coral reef on Earth—so huge astronauts can spot it from space!',
      timeEra: '20,000+ Years',
      historyTitle: 'Built by Tiny Ocean Architects',
      historyFact:
        'Over thousands of years, billions of tiny coral animals built this shimmering underwater city—and Aboriginal and Torres Strait Islander peoples have cared for these waters for millennia.',
      skyTop: '#4e9fb5',
      skyBottom: '#b8e4e0',
      accent: '#d96b52',
      sceneType: 'coral-reef',
    },
    questions: {
      scout: {
        prompt:
          'Splash into the Great Barrier Reef! Which gentle shelled swimmer glides gracefully past colorful clownfish and coral?',
        choices: ['Green Sea Turtle', 'Mountain Goat', 'Camel'],
        correctIndex: 0,
        gentleHint:
          'It uses wide flippers like underwater wings to glide through warm blue water!',
        crewClue:
          'Crew Tip: Look at the route label we followed to arrive at the reef!',
      },
      navigator: {
        prompt:
          'The Great Barrier Reef is so gigantic that astronauts can actually see it from where?',
        choices: ['Outer space', 'Inside a cave', 'The bottom of a well'],
        correctIndex: 0,
        gentleHint:
          'Think of people floating high above planet Earth in the International Space Station!',
        crewClue:
          'Crew Tip: It’s the biggest structure on Earth built by living creatures!',
      },
      trailblazer: {
        prompt:
          'Coral reefs look like underwater rocks or plants, but what are corals actually made of?',
        choices: [
          'Millions of tiny living sea animals',
          'Melted volcano glass',
          'Giant sunken seashells',
        ],
        correctIndex: 0,
        gentleHint:
          'Tiny soft creatures called polyps build hard limestone homes side by side!',
        crewClue:
          'Crew Tip: That’s why scientists call a coral reef a "living" structure.',
      },
    },
    neighbors: ['japan', 'borneo', 'outback', 'new-zealand', 'hawaii'],
  },
  {
    id: 'outback',
    name: 'Uluru & the Outback',
    country: 'Australia',
    continent: 'Oceania',
    coords: [131.0, -25.3],
    latLabel: '25°S • 131°E',
    biome: 'Red Desert Heartland',
    animalName: 'Outback Fox',
    animalAvatar: 'fox',
    souvenirName: 'Painted Boomerang',
    souvenirId: 'boomerang',
    souvenirCategory: 'artifact',
    routeLabel: 'Bounce Across the Red Desert',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'A Giant Rock That Glows Red',
      todayFact:
        'Right in the sunny heart of Australia rises Uluru—a massive red sandstone rock that seems to glow bright orange and crimson at sunset.',
      timeEra: '60,000+ Years',
      historyTitle: 'One of the World’s Oldest Living Cultures',
      historyFact:
        'Australia’s Aboriginal peoples have told stories, painted rock art, and cared for the Outback for over 60,000 years—the oldest continuous culture on Earth!',
      skyTop: '#d47c4f',
      skyBottom: '#f7d5a8',
      accent: '#b6492e',
      sceneType: 'uluru-outback',
    },
    questions: {
      scout: {
        prompt:
          'Which bouncy Australian animal carries its tiny baby (called a joey) in a cozy front pouch?',
        choices: ['Kangaroo', 'Penguin', 'Crocodile'],
        correctIndex: 0,
        gentleHint:
          'It has giant springy back feet and can leap across the red desert in huge bounds!',
        crewClue:
          'Crew Tip: Koalas and wombats also live in Australia and have cozy pouches too!',
      },
      navigator: {
        prompt:
          'Because Australia is in the Southern Hemisphere, when it is snowy winter in December in North America, what season is it in Australia?',
        choices: ['Warm, sunny summer!', 'Freezing blizzard season', 'Autumn'],
        correctIndex: 0,
        gentleHint:
          'Seasons on the southern half of Earth are the exact opposite of the northern half!',
        crewClue:
          'Crew Tip: Lots of families in Australia go to the beach in December!',
      },
      trailblazer: {
        prompt:
          'Australia is famous for being the only place on Earth that is BOTH a single country and an entire WHAT?',
        choices: ['Continent', 'Ocean', 'Mountain range'],
        correctIndex: 0,
        gentleHint:
          'There are 7 of these huge landmasses on Earth, and Australia is one of them!',
        crewClue:
          'Crew Tip: Along with nearby islands like New Zealand, this region is also called Oceania.',
      },
    },
    neighbors: ['madagascar', 'borneo', 'great-barrier-reef', 'new-zealand'],
  },
  {
    id: 'new-zealand',
    name: 'Aotearoa Fjords',
    country: 'New Zealand',
    continent: 'Oceania',
    coords: [168.0, -45.0],
    latLabel: '45°S • 168°E',
    biome: 'Misty Fjords & Peaks',
    animalName: 'Southern Puffin',
    animalAvatar: 'puffin',
    souvenirName: 'Polynesian Star Chart',
    souvenirId: 'star-chart',
    souvenirCategory: 'artifact',
    routeLabel: 'Sail by the Southern Stars',
    themes: ['grand-tour', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Land of the Long White Cloud',
      todayFact:
        'Waterfalls tumble down emerald cliffs into glassy fjords in New Zealand—home to the tiny, fuzzy, flightless kiwi bird!',
      timeEra: '700+ Years Ago',
      historyTitle: 'Wayfinders of the Wide Pacific',
      historyFact:
        'Māori navigators sailed double-hulled canoes thousands of miles across the open Pacific without a compass—reading the stars, ocean swells, and seabirds to find Aotearoa!',
      skyTop: '#4c768e',
      skyBottom: '#d8e6de',
      accent: '#2f6f68',
      sceneType: 'fjord-stars',
    },
    questions: {
      scout: {
        prompt:
          'New Zealand’s favorite native bird is small, round, fuzzy, and shares its name with a yummy green fruit! What bird is it?',
        choices: ['The Kiwi', 'The Mango', 'The Banana'],
        correctIndex: 0,
        gentleHint:
          'It can’t fly, comes out at night, and sniffs for snacks with its long beak!',
        crewClue:
          'Crew Tip: People from New Zealand are even affectionately nicknamed "Kiwis"!',
      },
      navigator: {
        prompt:
          'Long before GPS or phones, how did Polynesian and Māori ocean voyagers steer their canoes across the huge Pacific Ocean?',
        choices: [
          'By reading the stars and ocean waves',
          'By following highway signs',
          'By asking polar bears',
        ],
        correctIndex: 0,
        gentleHint:
          'Look up at the night sky and feel the rhythm of the ocean swells!',
        crewClue:
          'Crew Tip: These brilliant ocean navigators were called wayfinders.',
      },
      trailblazer: {
        prompt:
          'In the Māori language, New Zealand is called "Aotearoa." What does that poetic name mean?',
        choices: [
          'Land of the Long White Cloud',
          'Island of Endless Sand',
          'Kingdom of Volcanoes',
        ],
        correctIndex: 0,
        gentleHint:
          'Picture what early canoe sailors first spotted stretching over the mountains on the horizon!',
        crewClue:
          'Crew Tip: Check the headline on our postcard—it’s a big clue!',
      },
    },
    neighbors: ['great-barrier-reef', 'outback', 'hawaii', 'antarctica', 'patagonia'],
  },
  {
    id: 'hawaii',
    name: 'Hawaiian Volcanoes',
    country: 'United States (Pacific)',
    continent: 'Oceania',
    coords: [-155.5, 19.6],
    latLabel: '20°N • 156°W',
    biome: 'Volcanic Pacific Isles',
    animalName: 'Reef Sea Turtle',
    animalAvatar: 'turtle',
    souvenirName: 'Smooth Lava Keepsake',
    souvenirId: 'lava-stone',
    souvenirCategory: 'wildlife',
    routeLabel: 'Surf the Pacific Trade Winds',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'Islands Built by Volcanoes',
      todayFact:
        'Surrounded by the vast blue Pacific Ocean, Hawaii’s emerald islands have rainbows almost every day, glowing lava, and green sea turtles resting on sunny beaches.',
      timeEra: '1,000+ Years Ago',
      historyTitle: 'Where Surfing Began!',
      historyFact:
        'Long ago in ancient Hawaii, chiefs and everyday islanders carved wooden surfboards to ride towering ocean waves—a joyful sport called "he‘e nalu," or wave sliding!',
      skyTop: '#4c8fb5',
      skyBottom: '#f7cfa0',
      accent: '#c4533a',
      sceneType: 'pacific-volcano',
    },
    questions: {
      scout: {
        prompt:
          'Hawaii sits right in the middle of the biggest ocean on planet Earth! Which ocean is it?',
        choices: ['The Pacific Ocean', 'The Mediterranean Sea', 'The Arctic Ocean'],
        correctIndex: 0,
        gentleHint:
          'It stretches all the way from America to Japan and Australia—and starts with P!',
        crewClue:
          'Crew Tip: The Pacific Ocean is so big that all the continents could fit inside it!',
      },
      navigator: {
        prompt:
          'How were the tall Hawaiian islands originally created millions of years ago?',
        choices: [
          'By underwater volcanoes erupting lava',
          'By giant beavers building dams',
          'By melting icebergs',
        ],
        correctIndex: 0,
        gentleHint:
          'Layer after layer of hot melted rock cooled in the ocean until islands rose above the waves!',
        crewClue:
          'Crew Tip: Some volcanoes in Hawaii are still gently adding new land today!',
      },
      trailblazer: {
        prompt:
          'Ancient Hawaiians invented a famous ocean sport known as "he‘e nalu" (wave sliding). What do we call it today?',
        choices: ['Surfing', 'Ice skating', 'Snowboarding'],
        correctIndex: 0,
        gentleHint:
          'Balance on a long board and glide right down the face of a rolling ocean wave!',
        crewClue:
          'Crew Tip: Look at the story route name we took across the Pacific!',
      },
    },
    neighbors: ['japan', 'great-barrier-reef', 'new-zealand', 'grand-canyon', 'mexico'],
  },
  {
    id: 'canada',
    name: 'Banff & Northern Lights',
    country: 'Canada',
    continent: 'North America',
    coords: [-115.6, 51.2],
    latLabel: '51°N • 116°W',
    biome: 'Pine Mountains & Lakes',
    animalName: 'River Otter',
    animalAvatar: 'otter',
    souvenirName: 'Aurora Sky Crystal',
    souvenirId: 'aurora-crystal',
    souvenirCategory: 'wildlife',
    routeLabel: 'Chase the Northern Lights',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'Emerald Lakes & Dancing Skies',
      todayFact:
        'Canada has more lakes than the rest of the world combined! In the crisp north, green and violet ribbons of Northern Lights dance across starry skies.',
      timeEra: 'Hundreds of Years Ago',
      historyTitle: 'Birchbark Canoes & Sweet Maple Sap',
      historyFact:
        'Indigenous peoples of North America crafted lightweight birchbark canoes to glide along endless rivers—and discovered how to tap sweet maple tree sap to make maple syrup!',
      skyTop: '#24475a',
      skyBottom: '#78bfa6',
      accent: '#59a68b',
      sceneType: 'aurora-pines',
    },
    questions: {
      scout: {
        prompt:
          'What famous bright red leaf sits right in the middle of Canada’s flag?',
        choices: ['A Maple Leaf', 'A Palm Leaf', 'A Banana Leaf'],
        correctIndex: 0,
        gentleHint:
          'Its sweet sap is boiled into yummy syrup you pour on pancakes!',
        crewClue:
          'Crew Tip: Maple trees turn brilliant red and gold every autumn in Canada!',
      },
      navigator: {
        prompt:
          'Far up north in Canada, shimmering green ribbons of light sometimes glow in the night sky. What are they called?',
        choices: [
          'The Northern Lights (Aurora)',
          'Night Rainbows',
          'Firefly Clouds',
        ],
        correctIndex: 0,
        gentleHint:
          'Tiny particles from the sun make the high northern sky glow like magic curtains!',
        crewClue:
          'Crew Tip: Check the route name we flew to get to Canada!',
      },
      trailblazer: {
        prompt:
          'Which continent are Canada, the United States, and Mexico all part of?',
        choices: ['North America', 'Europe', 'South America'],
        correctIndex: 0,
        gentleHint:
          'Look at the upper-left side of our storybook world atlas!',
        crewClue:
          'Crew Tip: It’s the third-largest continent on Earth.',
      },
    },
    neighbors: ['iceland', 'grand-canyon', 'mexico'],
  },
  {
    id: 'grand-canyon',
    name: 'The Grand Canyon',
    country: 'United States',
    continent: 'North America',
    coords: [-112.1, 36.1],
    latLabel: '36°N • 112°W',
    biome: 'Red Rock Canyons',
    animalName: 'Canyon Owl',
    animalAvatar: 'owl',
    souvenirName: 'Painted Canyon Feather',
    souvenirId: 'canyon-feather',
    souvenirCategory: 'wildlife',
    routeLabel: 'Glide the Red Rock Canyons',
    themes: ['grand-tour', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'A Mile-Deep Storybook in Stone',
      todayFact:
        'Striped cliffs of terracotta, gold, and rose plunge a whole mile deep in Arizona, carved layer by layer like a giant geological layer cake.',
      timeEra: '5 Million+ Years',
      historyTitle: 'Carved by a Patient River',
      historyFact:
        'Over millions of years, the rushing Colorado River slowly carved this giant canyon—revealing ancient rock layers that even hold fossil footprints and seashells from long-ago seas!',
      skyTop: '#5e92b0',
      skyBottom: '#f2c191',
      accent: '#c4533a',
      sceneType: 'red-canyon',
    },
    questions: {
      scout: {
        prompt:
          'What powerful force of nature slowly carved the giant Grand Canyon over millions of years?',
        choices: ['A rushing river', 'A giant bulldozer', 'A snowplow'],
        correctIndex: 0,
        gentleHint:
          'Flowing water still winds right along the very bottom of the canyon today!',
        crewClue:
          'Crew Tip: Patient drops of water moving rock bit by bit is called erosion.',
      },
      navigator: {
        prompt:
          'When you look at the striped red cliffs of the Grand Canyon, where are the OLDEST rock layers?',
        choices: ['Way down at the bottom', 'Floating in the clouds', 'At the very top'],
        correctIndex: 0,
        gentleHint:
          'Think about stacking pancakes—the very first pancake you put on the plate ends up at the bottom!',
        crewClue:
          'Crew Tip: Hiking down the canyon is literally like walking backward in time!',
      },
      trailblazer: {
        prompt:
          'Which famous river winds through the bottom of the Grand Canyon?',
        choices: ['The Colorado River', 'The Nile River', 'The Amazon River'],
        correctIndex: 0,
        gentleHint:
          'Its name comes from a Spanish word meaning "colored red"—just like the canyon walls!',
        crewClue:
          'Crew Tip: It flows across the American Southwest toward Mexico.',
      },
    },
    neighbors: ['canada', 'hawaii', 'mexico'],
  },
  {
    id: 'mexico',
    name: 'Yucatán & Butterfly Woods',
    country: 'Mexico',
    continent: 'North America',
    coords: [-89.0, 20.6],
    latLabel: '21°N • 89°W',
    biome: 'Jungle & Pyramids',
    animalName: 'Jungle Otter',
    animalAvatar: 'otter',
    souvenirName: 'Ancient Cacao Pod',
    souvenirId: 'cacao-pod',
    souvenirCategory: 'artifact',
    routeLabel: 'Follow the Monarch Butterflies',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Stone Steps & Secret Chocolate!',
      todayFact:
        'Stepped stone pyramids peek out above emerald jungles in Mexico—and every winter, millions of orange monarch butterflies fly thousands of miles here to rest!',
      timeEra: '3,000+ Years Ago',
      historyTitle: 'The Birthplace of Chocolate!',
      historyFact:
        'Ancient Maya and Olmec peoples in Central America were the first to turn cacao beans into chocolate—as a frothy, warm, slightly spicy drink, not a candy bar!',
      skyTop: '#56979e',
      skyBottom: '#f2e0ba',
      accent: '#7d4c2c',
      sceneType: 'maya-jungle',
    },
    questions: {
      scout: {
        prompt:
          'Every autumn, millions of bright orange-and-black butterflies flutter all the way from Canada and the U.S. to spend winter in Mexico! Which butterflies are they?',
        choices: ['Monarch butterflies', 'Ladybugs', 'Bumblebees'],
        correctIndex: 0,
        gentleHint:
          'Their name means "king" or "queen," and their wings look like stained glass!',
        crewClue:
          'Crew Tip: Check the name of the story route we followed to Mexico!',
      },
      navigator: {
        prompt:
          'Which delicious treat was first invented thousands of years ago in Mexico and Central America from cacao tree beans?',
        choices: ['Chocolate', 'Cotton candy', 'Pretzels'],
        correctIndex: 0,
        gentleHint:
          'Ancient Maya people loved drinking it warm and frothy—sometimes with a tiny dash of spice!',
        crewClue:
          'Crew Tip: Our collectible souvenir from Mexico is a Cacao Pod!',
      },
      trailblazer: {
        prompt:
          'Which brilliant ancient civilization built stepped stone pyramids like Chichén Itzá and studied the stars in the Yucatán jungle?',
        choices: ['The Maya', 'The Vikings', 'The Ancient Greeks'],
        correctIndex: 0,
        gentleHint:
          'They created super accurate calendars by watching the sun, moon, and Venus!',
        crewClue:
          'Crew Tip: Millions of Maya people still live in Mexico and Central America today.',
      },
    },
    neighbors: ['canada', 'grand-canyon', 'hawaii', 'galapagos', 'brazil', 'morocco'],
  },
  {
    id: 'brazil',
    name: 'The Amazon Rainforest',
    country: 'Brazil',
    continent: 'South America',
    coords: [-60.0, -3.1],
    latLabel: '3°S • 60°W',
    biome: 'Giant Rainforest & River',
    animalName: 'River Otter',
    animalAvatar: 'otter',
    souvenirName: 'Carved River Paddle',
    souvenirId: 'river-paddle',
    souvenirCategory: 'wildlife',
    routeLabel: 'Paddle the Giant River',
    themes: ['grand-tour', 'animal-safari', 'open-atlas'],
    postcard: {
      headline: 'A Sea of Emerald Green',
      todayFact:
        'The Amazon is the biggest rainforest on Earth—buzzing with scarlet macaws, sleepy sloths, pink river dolphins, and a river so wide you can barely see the other shore!',
      timeEra: 'Thousands of Years',
      historyTitle: 'Gardeners of the Giant Forest',
      historyFact:
        'For thousands of years, Indigenous peoples of the Amazon planted Brazil nut and fruit orchards and discovered hundreds of forest plants used in medicines today!',
      skyTop: '#4e917a',
      skyBottom: '#d8e9c7',
      accent: '#c4533a',
      sceneType: 'amazon-river',
    },
    questions: {
      scout: {
        prompt:
          'Splash! Believe it or not, what surprising color are some of the friendly dolphins swimming in the Amazon River?',
        choices: ['Bubblegum Pink!', 'Neon Green', 'Polka-Dot'],
        correctIndex: 0,
        gentleHint:
          'Think of flamingos and cotton candy—these river dolphins really turn this rosy color!',
        crewClue:
          'Crew Tip: They’re called Amazon Pink River Dolphins, and they can even turn their necks!',
      },
      navigator: {
        prompt:
          'Which continent is home to Brazil and the enormous Amazon Rainforest?',
        choices: ['South America', 'Europe', 'Africa'],
        correctIndex: 0,
        gentleHint:
          'Look down below Mexico and Central America on our world atlas!',
        crewClue:
          'Crew Tip: It’s shaped a bit like a giant ice-cream cone pointing south.',
      },
      trailblazer: {
        prompt:
          'Because the Amazon’s billions of trees breathe in carbon dioxide and release fresh oxygen, what nickname do scientists often give this rainforest?',
        choices: [
          'The Lungs of the Earth',
          'The Icebox of the Earth',
          'The Compass of the Earth',
        ],
        correctIndex: 0,
        gentleHint:
          'Think about the part of your body that helps you take a big deep breath!',
        crewClue:
          'Crew Tip: Plants and trees help keep Earth’s air fresh for everyone.',
      },
    },
    neighbors: ['mexico', 'morocco', 'tanzania', 'peru', 'patagonia'],
  },
  {
    id: 'peru',
    name: 'Machu Picchu & Andes',
    country: 'Peru',
    continent: 'South America',
    coords: [-72.5, -13.2],
    latLabel: '13°S • 73°W',
    biome: 'Cloud-Top Mountains',
    animalName: 'Fluffy Alpaca',
    animalAvatar: 'alpaca',
    souvenirName: 'Woven Inca Quipu',
    souvenirId: 'inca-quipu',
    souvenirCategory: 'artifact',
    routeLabel: 'Climb the Cloud Citadel',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'A Stone City in the Clouds',
      todayFact:
        'High in Peru’s misty Andes Mountains, fuzzy alpacas and llamas graze among ancient green terraces at Machu Picchu.',
      timeEra: '550 Years Ago',
      historyTitle: 'Messages Tied in Colorful Knots!',
      historyFact:
        'The Inca Empire built thousands of miles of mountain roads without wheels—and recorded numbers and stories by tying clever knots in colorful strings called quipu!',
      skyTop: '#6e9bb0',
      skyBottom: '#dce7d3',
      accent: '#467856',
      sceneType: 'andes-citadel',
    },
    questions: {
      scout: {
        prompt:
          'Which fluffy, long-necked mountain animals love munching grass high up in Peru’s Andes Mountains?',
        choices: ['Alpacas and Llamas', 'Hippos', 'Walruses'],
        correctIndex: 0,
        gentleHint:
          'People spin their super-soft cozy wool into colorful sweaters and hats!',
        crewClue:
          'Crew Tip: Look for our fluffy friend right on this postcard!',
      },
      navigator: {
        prompt:
          'Potatoes, which people now eat as french fries and mashed potatoes all over the world, originally came from which high mountain region?',
        choices: ['The Andes in Peru', 'Antarctica', 'The Sahara Desert'],
        correctIndex: 0,
        gentleHint:
          'Farmers in Peru still grow over 3,000 colorful kinds of potatoes—even purple ones!',
        crewClue:
          'Crew Tip: Just like chocolate from Mexico, potatoes are a South American origin story!',
      },
      trailblazer: {
        prompt:
          'Which ancient South American empire built Machu Picchu high in the Andes and kept records using knotted cords called quipu?',
        choices: ['The Inca Empire', 'The Roman Empire', 'The Vikings'],
        correctIndex: 0,
        gentleHint:
          'Their stone walls fit together so tightly you can’t even slide a piece of paper between the rocks!',
        crewClue:
          'Crew Tip: It’s a short 4-letter name starting with I!',
      },
    },
    neighbors: ['brazil', 'galapagos', 'patagonia'],
  },
  {
    id: 'galapagos',
    name: 'Galápagos Islands',
    country: 'Ecuador',
    continent: 'South America',
    coords: [-90.4, -0.7],
    latLabel: '1°S • 90°W',
    biome: 'Volcanic Wildlife Isles',
    animalName: 'Giant Tortoise',
    animalAvatar: 'turtle',
    souvenirName: 'Explorer’s Brass Spyglass',
    souvenirId: 'spyglass',
    souvenirCategory: 'artifact',
    routeLabel: 'Visit the Tortoise Isles',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Where Blue-Footed Birds Dance!',
      todayFact:
        'On these volcanic islands off South America, giant tortoises live over 100 years, marine iguanas swim in the surf, and sea lions nap right on park benches.',
      timeEra: '1835 CE',
      historyTitle: 'A Young Scientist’s Notebook',
      historyFact:
        'When young naturalist Charles Darwin sailed here on the ship HMS Beagle, watching the islands’ amazing birds and giant tortoises sparked big discoveries about how animals adapt!',
      skyTop: '#5e9fb6',
      skyBottom: '#e5e9d5',
      accent: '#467856',
      sceneType: 'tortoise-isle',
    },
    questions: {
      scout: {
        prompt:
          'The Galápagos Islands are named after huge, gentle, slow-moving reptiles that can live for over 100 years! Who are they?',
        choices: ['Giant Tortoises', 'Cheetahs', 'Hummingbirds'],
        correctIndex: 0,
        gentleHint:
          'They carry big domed shells on their backs and love munching leafy greens!',
        crewClue:
          'Crew Tip: "Galápago" was an old Spanish word for a tortoise’s curved shell.',
      },
      navigator: {
        prompt:
          'What funny, bright color are the webbed feet of the famous dancing seabirds on the Galápagos Islands?',
        choices: ['Bright turquoise blue!', 'Checkerboard', 'Silver metallic'],
        correctIndex: 0,
        gentleHint:
          'They lift their colorful feet high in a silly dance to show off to other birds!',
        crewClue:
          'Crew Tip: They’re famously called Blue-Footed Boobies—a name that always gets a giggle!',
      },
      trailblazer: {
        prompt:
          'In 1835, which famous scientist visited the Galápagos Islands aboard the ship HMS Beagle and filled notebooks with sketches of finches and tortoises?',
        choices: ['Charles Darwin', 'Galileo Galilei', 'Isaac Newton'],
        correctIndex: 0,
        gentleHint:
          'He studied how beaks and shells changed to fit each island’s food and habitat.',
        crewClue:
          'Crew Tip: His last name starts with D, and he wrote about how species adapt over time!',
      },
    },
    neighbors: ['mexico', 'peru', 'hawaii'],
  },
  {
    id: 'patagonia',
    name: 'Patagonia & Dino Valley',
    country: 'Argentina',
    continent: 'South America',
    coords: [-71.5, -49.5],
    latLabel: '50°S • 72°W',
    biome: 'Glaciers & Fossil Valleys',
    animalName: 'Patagonia Alpaca',
    animalAvatar: 'alpaca',
    souvenirName: 'Giant Dino Fossil Tooth',
    souvenirId: 'dino-tooth',
    souvenirCategory: 'wildlife',
    routeLabel: 'Hunt for Giant Fossils',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'Towering Spires & Giant Dinosaurs',
      todayFact:
        'At the breezy southern tip of South America, crackling blue glaciers meet dramatic granite peaks—and rocky valleys hide giant fossils!',
      timeEra: '100 Million Years Ago',
      historyTitle: 'Land of the Biggest Dinosaurs Ever!',
      historyFact:
        'Paleontologists in Patagonia uncovered bones of Patagotitan—a plant-eating dinosaur longer than three school buses lined up end to end!',
      skyTop: '#618aa8',
      skyBottom: '#e9dec8',
      accent: '#8a5d3b',
      sceneType: 'patagonia-fossils',
    },
    questions: {
      scout: {
        prompt:
          'Scientists digging in the rocks of Patagonia found bones of some of the biggest ancient creatures ever to walk on Earth! What were they?',
        choices: ['Giant Dinosaurs', 'Giant Hamsters', 'Giant Goldfish'],
        correctIndex: 0,
        gentleHint:
          'Some had super long necks and were longer than three whole school buses!',
        crewClue:
          'Crew Tip: Ancient bones turned to stone in the ground are called fossils!',
      },
      navigator: {
        prompt:
          'Patagonia sits near the very bottom tip of South America. Which icy continent lies just across the chilly ocean south of here?',
        choices: ['Antarctica', 'Europe', 'Asia'],
        correctIndex: 0,
        gentleHint:
          'It’s the coldest, windiest, snowiest continent at the bottom of the world!',
        crewClue:
          'Crew Tip: Look straight down from Patagonia on our atlas!',
      },
      trailblazer: {
        prompt:
          'Massive slow-moving rivers of packed snow and blue ice that carve deep valleys through Patagonia are called what?',
        choices: ['Glaciers', 'Geysers', 'Coral Reefs'],
        correctIndex: 0,
        gentleHint:
          'Sometimes big chunks break off into the water with a thunderous splash—forming icebergs!',
        crewClue:
          'Crew Tip: The word starts with G and rhymes with "space-yers" (almost!).',
      },
    },
    neighbors: ['brazil', 'peru', 'antarctica', 'new-zealand'],
  },
  {
    id: 'antarctica',
    name: 'Antarctica Ice Shelf',
    country: 'Antarctica',
    continent: 'Antarctica',
    coords: [-45.0, -76.0],
    latLabel: '76°S • 45°W',
    biome: 'Frozen Continent',
    animalName: 'Emperor Penguin',
    animalAvatar: 'puffin',
    souvenirName: 'Explorer Sled Bell',
    souvenirId: 'sled-bell',
    souvenirCategory: 'artifact',
    routeLabel: 'Race to the Frozen South',
    themes: ['grand-tour', 'animal-safari', 'time-travel', 'open-atlas'],
    postcard: {
      headline: 'A Continent Dedicated to Science & Peace',
      todayFact:
        'No single country owns Antarctica! Scientists from around the world share research stations here alongside waddling emperor penguins and breaching whales.',
      timeEra: '1911 CE',
      historyTitle: 'The Race to the South Pole',
      historyFact:
        'Over 100 years ago, explorer Roald Amundsen and his team of trusty sled dogs braved howling blizzards to become the first people ever to reach the South Pole!',
      skyTop: '#5b8ba8',
      skyBottom: '#ebf4f6',
      accent: '#1f5a63',
      sceneType: 'antarctic-ice',
    },
    questions: {
      scout: {
        prompt:
          'Brrr! Which tuxedo-wearing bird waddles across Antarctica’s ice and slides on its belly like a sled?',
        choices: ['Emperor Penguin', 'Toucan', 'Giraffe'],
        correctIndex: 0,
        gentleHint:
          'They can’t fly in the sky, but they zoom like rockets underwater!',
        crewClue:
          'Crew Tip: Penguins live in the icy south—polar bears live way up in the icy north!',
      },
      navigator: {
        prompt:
          'Antarctica is special because no single country owns it! Who works together at stations across Antarctica today?',
        choices: [
          'Scientists from all around the world',
          'Pirate captains',
          'Tropical banana farmers',
        ],
        correctIndex: 0,
        gentleHint:
          'They study penguins, stars, glaciers, and Earth’s climate together in peace!',
        crewClue:
          'Crew Tip: Over 50 nations signed a treaty keeping Antarctica peaceful for science.',
      },
      trailblazer: {
        prompt:
          'Even though Antarctica is covered in miles of ice, very little new snow actually falls there each year—making it Earth’s largest cold WHAT?',
        choices: ['Polar Desert', 'Rainforest', 'Savanna'],
        correctIndex: 0,
        gentleHint:
          'A place with almost no rain or snow falling from the sky is called a desert—even when it’s freezing!',
        crewClue:
          'Crew Tip: Surprise fact: deserts are defined by being super dry, not by being hot!',
      },
    },
    neighbors: ['patagonia', 'madagascar', 'new-zealand'],
  },
];

export const DESTINATIONS_BY_ID: Record<string, Destination> = Object.fromEntries(
  DESTINATIONS.map((d) => [d.id, d])
);

export const CONTINENT_ORDER = [
  'North America',
  'South America',
  'Europe',
  'Africa',
  'Asia',
  'Oceania',
  'Antarctica',
] as const;

export function getSuggestedNextRoutes(
  currentDestId: string,
  visitedDestIds: string[],
  theme: MissionTheme
): string[] {
  const current = DESTINATIONS_BY_ID[currentDestId] ?? DESTINATIONS[0];
  const visitedSet = new Set(visitedDestIds);

  const themeMatches = (id: string) => {
    const dest = DESTINATIONS_BY_ID[id];
    if (!dest) return false;
    return theme === 'open-atlas' || dest.themes.includes(theme);
  };

  // Prefer unvisited neighbors that fit the theme
  const unvisitedNeighbors = current.neighbors.filter((id) => !visitedSet.has(id));
  const themedNeighbors = unvisitedNeighbors.filter(themeMatches);

  const picks: string[] = [];
  for (const id of [...themedNeighbors, ...unvisitedNeighbors]) {
    if (!picks.includes(id) && picks.length < 3) {
      picks.push(id);
    }
  }

  // If fewer than 3 unvisited neighbors, pick exciting unvisited destinations anywhere on Earth
  if (picks.length < 3) {
    const unvisitedAnywhere = DESTINATIONS.filter(
      (d) =>
        d.id !== currentDestId &&
        !visitedSet.has(d.id) &&
        !picks.includes(d.id)
    );
    const prioritized = [
      ...unvisitedAnywhere.filter((d) => themeMatches(d.id)),
      ...unvisitedAnywhere.filter((d) => !themeMatches(d.id)),
    ];
    for (const d of prioritized) {
      if (picks.length < 3) picks.push(d.id);
    }
  }

  // If everything has been visited (e.g. long Open Atlas trip), offer neighbors to revisit
  if (picks.length === 0) {
    return current.neighbors.slice(0, 3);
  }

  return picks;
}
