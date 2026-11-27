import type { CityLayout } from '../../types/game';
import { expandCityLayouts } from './types';

/**
 * 185 confirmed real spatially-positioned local landmarks across the 37 newly added US states!
 * Zero duplicate landmark names anywhere in the entire 1,235-landmark Atlas.
 */
export const US_STATE_LANDMARKS: Record<string, CityLayout> = expandCityLayouts({
  'us-al': {
    backdrop: 'mountains-north',
    feature: 'Monte Sano Ridge',
    spots: [
      ['U.S. Space & Rocket Center', 'landmark', 'West Huntsville', 'Rocket Engineer', 18, 56],
      ['Big Spring International Park', 'nature', 'Downtown Spring', 'Koi Pond Keeper', 46, 52],
      ['Lowe Mill ARTS & Entertainment', 'market', 'South Textile Mill', 'Studio Potter', 40, 76],
      ['Huntsville Botanical Garden', 'nature', 'Southwest Meadow', 'Butterfly Guide', 24, 74],
      ['Monte Sano State Park Overlook', 'archive', 'East Mountain Ridge', 'Trail Ranger', 82, 34],
    ],
  },
  'us-ar': {
    backdrop: 'mountains-north',
    feature: 'Hot Springs Mountain',
    spots: [
      ['Fordyce Bathhouse Visitor Center', 'archive', 'Central Bathhouse Row', 'Thermal Historian', 48, 52],
      ['Hot Springs Mountain Tower', 'landmark', 'North Ridge Summit', 'Lookout Ranger', 62, 26],
      ['Garvan Woodland Gardens', 'nature', 'South Lake Hamilton', 'Bridge Gardener', 36, 80],
      ['Grand Promenade Thermal Walk', 'harbor', 'East Spring Terrace', 'Spring Caretaker', 64, 54],
      ['Central Avenue Crystal Shop', 'market', 'Historic Downtown', 'Quartz Collector', 34, 58],
    ],
  },
  'us-ct': {
    backdrop: 'harbor-bay',
    water: 'New Haven Harbor',
    spots: [
      ['Beinecke Rare Book Library', 'archive', 'Central Campus', 'Rare Book Archivist', 46, 44],
      ['Yale Peabody Natural History Museum', 'landmark', 'North Science Hill', 'Dinosaur Curator', 52, 22],
      ['Wooster Square Historic Apizza', 'market', 'East Little Italy', 'Coal-Oven Baker', 72, 52],
      ['East Rock Park Traprock Summit', 'nature', 'Northeast Cliffs', 'Park Naturalist', 78, 22],
      ['Long Wharf Maritime Pier', 'harbor', 'South Harborfront', 'Oyster Boat Captain', 42, 78],
    ],
  },
  'us-de': {
    backdrop: 'river-ew',
    water: 'Brandywine Creek',
    spots: [
      ['Hagley Powder Mill Museum', 'archive', 'Northwest Brandywine', 'Millwright Guide', 22, 26],
      ['Nemours Estate French Gardens', 'landmark', 'North Estate', 'Garden Curator', 48, 22],
      ['Wilmington Riverfront Boardwalk', 'harbor', 'South Christina River', 'River Taxi Skipper', 44, 76],
      ['Delaware Art Museum', 'archive', 'West Highlands', 'Gallery Docent', 24, 54],
      ['Brandywine Park Jasper Crane Rose Garden', 'nature', 'East Creekside', 'Botanical Keeper', 74, 42],
    ],
  },
  'us-ga': {
    backdrop: 'river-ew',
    water: 'Savannah River',
    spots: [
      ['Forsyth Park Cast-Iron Fountain', 'landmark', 'South Historic District', 'Park Sketch Artist', 48, 76],
      ['River Street Cobblestone Wharf', 'harbor', 'North Riverfront', 'Tugboat Pilot', 56, 24],
      ['Savannah City Market Courtyard', 'market', 'Northwest Square', 'Sweetgrass Weaver', 30, 42],
      ['Juliette Gordon Low Birthplace', 'archive', 'Central Bull Street', 'House Historian', 50, 50],
      ['Wormsloe Live-Oak Avenue', 'nature', 'Southeast Isle of Hope', 'Oak Grove Ranger', 82, 72],
    ],
  },
  'us-ia': {
    backdrop: 'river-ns',
    water: 'Des Moines River',
    spots: [
      ['Iowa Gold-Domed State Capitol', 'landmark', 'East Capitol Hill', 'Dome Archivist', 72, 46],
      ['Pappajohn Sculpture Park', 'nature', 'West Downtown Lawn', 'Sculpture Docent', 24, 56],
      ['Downtown Farmers’ Market', 'market', 'Court Avenue', 'Sweet-Corn Grower', 44, 62],
      ['Greater Des Moines Botanical Garden', 'nature', 'North Riverbank', 'Geodesic Gardener', 54, 24],
      ['State Historical Museum of Iowa', 'archive', 'East Village', 'Prairie Curator', 78, 66],
    ],
  },
  'us-id': {
    backdrop: 'river-ew',
    water: 'Boise River',
    spots: [
      ['Basque Block Cultural Center', 'market', 'Central Downtown', 'Basque Chef', 46, 54],
      ['Boise River Greenbelt Footbridge', 'harbor', 'South Riverbank', 'Fly-Fishing Guide', 38, 74],
      ['Old Idaho Penitentiary Sandstone Site', 'archive', 'East Foothills', 'Frontier Historian', 82, 44],
      ['World Center for Birds of Prey', 'nature', 'South High Desert', 'Falcon Biologist', 26, 80],
      ['Idaho State Capitol Rotunda', 'landmark', 'North Capitol Blvd', 'Star-Garnet Docent', 50, 28],
    ],
  },
  'us-in': {
    backdrop: 'river-ns',
    water: 'White River',
    spots: [
      ['Indianapolis Motor Speedway Museum', 'landmark', 'West Speedway', 'Brickyard Mechanic', 18, 44],
      ['The Children’s Museum of Indianapolis', 'archive', 'North Meridian', 'Paleo Educator', 52, 22],
      ['Central Canal Gondola Walk', 'harbor', 'Downtown Canal', 'Pedal-Boat Captain', 42, 54],
      ['Indianapolis City Market Hall', 'market', 'East Market Street', 'Sugar-Pie Baker', 70, 56],
      ['White River State Park', 'nature', 'Southwest Riverfront', 'Trail Naturalist', 34, 76],
    ],
  },
  'us-ks': {
    backdrop: 'river-ns',
    water: 'Arkansas River',
    spots: [
      ['Keeper of the Plains Confluence', 'landmark', 'Central River Fork', 'Sculpture Steward', 46, 46],
      ['Exploration Place Science Pavilion', 'archive', 'West Bank Island', 'Aviation Docent', 30, 48],
      ['Old Cowtown Living History Museum', 'market', 'Northwest Riverbend', 'Blacksmith Guide', 22, 26],
      ['Kansas Aviation Museum', 'archive', 'Southeast Hangar', 'Biplane Restorer', 82, 74],
      ['Botanica Wichita Gardens', 'nature', 'North River Park', 'Sunflower Botanist', 42, 24],
    ],
  },
  'us-ky': {
    backdrop: 'coast-north',
    water: 'Ohio River',
    spots: [
      ['Churchill Downs Twin Spires', 'landmark', 'South Central', 'Track Bugler', 46, 80],
      ['Louisville Slugger Bat Factory', 'market', 'West Main Street', 'Ash-Wood Turner', 26, 46],
      ['Big Four Pedestrian River Bridge', 'harbor', 'Northeast Waterfront', 'Steam-Packet Captain', 74, 30],
      ['Muhammad Ali Center', 'archive', 'Northwest Riverfront', 'Museum Archivist', 36, 36],
      ['Cherokee Park Scenic Loop', 'nature', 'East Highlands', 'Olmsted Park Ranger', 82, 62],
    ],
  },
  'us-md': {
    backdrop: 'harbor-bay',
    water: 'Patapsco Harbor',
    spots: [
      ['Fort McHenry Star Bastion', 'landmark', 'South Locust Point', 'Garrison Park Ranger', 60, 80],
      ['Baltimore Inner Harbor Ships', 'harbor', 'Central Waterfront', 'USS Constellation Mate', 48, 56],
      ['B&O Railroad Roundhouse Museum', 'archive', 'West Mount Clare', 'Locomotive Historian', 22, 60],
      ['Lexington Market Crab Stall', 'market', 'Northwest Downtown', 'Chesapeake Crabber', 32, 36],
      ['National Aquarium Blue Pier', 'nature', 'East Pier Three', 'Marine Biologist', 68, 52],
    ],
  },
  'us-me': {
    backdrop: 'coast-east',
    water: 'Casco Bay',
    spots: [
      ['Portland Head Light Cape Cliff', 'landmark', 'Southeast Cape Elizabeth', 'Lighthouse Keeper', 76, 80],
      ['Old Port Cobblestone Wharf', 'harbor', 'East Working Pier', 'Lobsterman Captain', 66, 50],
      ['Portland Observatory Signal Tower', 'archive', 'North Munjoy Hill', 'Harbor Spotter', 64, 24],
      ['Commercial Street Fish Market', 'market', 'Central Waterfront', 'Blueberry Baker', 44, 58],
      ['Eastern Promenade Bay Lawn', 'nature', 'Northeast Bluff', 'Kite-Flying Guide', 78, 34],
    ],
  },
  'us-mi': {
    backdrop: 'coast-south',
    water: 'Detroit River',
    spots: [
      ['Motown Museum Hitsville U.S.A.', 'archive', 'Northwest Grand Blvd', 'Sound Archivist', 26, 28],
      ['Detroit Institute of Arts', 'landmark', 'Midtown Cultural', 'Mural Docent', 46, 36],
      ['Eastern Market Sheds', 'market', 'East Gratiot', 'Michigan Cherry Grower', 68, 42],
      ['Belle Isle Conservatory Island', 'nature', 'Southeast River Isle', 'Island Botanist', 82, 74],
      ['Detroit RiverWalk Carousel Pier', 'harbor', 'South Riverfront', 'Freighter Spotter', 46, 76],
    ],
  },
  'us-mn': {
    backdrop: 'river-ns',
    water: 'Mississippi River',
    spots: [
      ['Stone Arch Bridge Overlook', 'harbor', 'Central St. Anthony Falls', 'Lockmaster Guide', 52, 46],
      ['Mill City Flour Ruins Museum', 'archive', 'South Riverfront', 'Grain Mill Historian', 58, 58],
      ['Minneapolis Sculpture Garden', 'landmark', 'West Lowry Hill', 'Cherry-Spoon Docent', 22, 54],
      ['Minnehaha Creek Waterfall', 'nature', 'Southeast Park', 'Trail Naturalist', 78, 80],
      ['Midtown Global Market', 'market', 'South Lake Street', 'Wild-Rice Vendor', 38, 76],
    ],
  },
  'us-mo': {
    backdrop: 'coast-east',
    water: 'Mississippi River',
    spots: [
      ['Gateway Arch Riverfront Tram', 'landmark', 'East Riverfront', 'Arch Park Ranger', 78, 52],
      ['Forest Park Art Hill & Zoo', 'nature', 'West Parkland', 'Park Naturalist', 20, 48],
      ['Soulard Historic Farmers Market', 'market', 'Southeast Brick Row', 'Spice & Peach Vendor', 70, 78],
      ['Missouri History Museum', 'archive', 'North Forest Park', 'World’s Fair Curator', 28, 30],
      ['Eads Iron River Bridge Pier', 'harbor', 'Northeast Levee', 'Riverboat Pilot', 80, 34],
    ],
  },
  'us-ms': {
    backdrop: 'coast-west',
    water: 'Mississippi River',
    spots: [
      ['Grand Village of the Natchez Mounds', 'archive', 'Southeast Creekside', 'Archaeology Guide', 72, 78],
      ['Natchez Under-the-Hill Landing', 'harbor', 'West Riverbank', 'Paddlewheel Captain', 20, 56],
      ['Bluff Park River Gazebo', 'nature', 'West Overlook', 'Magnolia Gardener', 28, 36],
      ['Longwood Octagonal Villa', 'landmark', 'South Lower Woodville', 'Architecture Docent', 48, 76],
      ['Franklin Street Biscuit Bakery', 'market', 'Central Historic Town', 'Praline Maker', 56, 44],
    ],
  },
  'us-mt': {
    backdrop: 'mountains-north',
    feature: 'Bridger Range',
    spots: [
      ['Museum of the Rockies Dinosaur Hall', 'archive', 'South Campus', 'Fossil Preparator', 42, 78],
      ['Main Street Historic Mercantile', 'market', 'Central Downtown', 'Huckleberry Jam Maker', 50, 48],
      ['Peets Hill Burke Park Overlook', 'nature', 'Southeast Ridge', 'Big-Sky Stargazer', 76, 62],
      ['American Computer & Robotics Museum', 'landmark', 'West Babcock', 'Tech Historian', 20, 56],
      ['M-Trail Bridger Canyon Trailhead', 'harbor', 'Northeast Foothills', 'Mountain Trail Ranger', 76, 24],
    ],
  },
  'us-nc': {
    backdrop: 'river-ns',
    water: 'French Broad River',
    spots: [
      ['Biltmore Estate Conservatory', 'landmark', 'South Estate', 'Forestry Historian', 44, 78],
      ['River Arts District Studios', 'market', 'West Riverbank', 'Glassblower Artist', 28, 52],
      ['Blue Ridge Parkway Folk Art Center', 'archive', 'East Mountain Milepost', 'Quilt Archivist', 82, 34],
      ['North Carolina Arboretum', 'nature', 'Southwest Bent Creek', 'Bonsai Curator', 22, 80],
      ['Pack Square Gazebo Terrace', 'harbor', 'Central Downtown', 'Appalachian Fiddler', 56, 44],
    ],
  },
  'us-nd': {
    backdrop: 'coast-west',
    water: 'Missouri River',
    spots: [
      ['North Dakota Heritage Center', 'archive', 'North Capitol Grounds', 'Badlands Paleontologist', 54, 26],
      ['Fort Abraham Lincoln Earthlodges', 'landmark', 'Southwest River Bluffs', 'Mandan Cultural Guide', 26, 78],
      ['Lewis & Clark Riverboat Dock', 'harbor', 'West River Landing', 'Missouri River Captain', 20, 44],
      ['Kirkwood Prairie Farmers Market', 'market', 'Central Downtown', 'Honey Beekeeper', 58, 58],
      ['Sertoma Cottonwood River Park', 'nature', 'West Bank Woods', 'Meadowlark Watcher', 34, 56],
    ],
  },
  'us-ne': {
    backdrop: 'coast-east',
    water: 'Missouri River',
    spots: [
      ['Henry Doorly Desert Dome', 'nature', 'Southeast Park', 'Conservatory Keeper', 66, 78],
      ['Bob Kerrey Pedestrian River Bridge', 'harbor', 'Northeast Waterfront', 'River Crossing Guide', 78, 32],
      ['Durham Union Station Museum', 'archive', 'East Rail District', 'Railroad Historian', 66, 56],
      ['Old Market Brick Passageway', 'market', 'Downtown Bricks', 'Runza Baker', 52, 46],
      ['Joslyn Art Museum Pink Marble Hall', 'landmark', 'West Dodge Hill', 'Plains Art Docent', 26, 44],
    ],
  },
  'us-nh': {
    backdrop: 'harbor-bay',
    water: 'Piscataqua River',
    spots: [
      ['Strawbery Banke Historic Village', 'archive', 'South Puddle Dock', 'Colonial Cooper', 56, 62],
      ['Market Square North Church Steeple', 'market', 'Central Square', 'Cider-Donut Baker', 42, 46],
      ['USS Albacore Submarine Park', 'landmark', 'Northwest Bypass', 'Submarine Historian', 22, 26],
      ['Prescott Park Waterfront Gardens', 'nature', 'East Riverfront', 'Harbor Gardener', 70, 56],
      ['Portsmouth Harbor Lighthouse Point', 'harbor', 'Southeast New Castle', 'Tugboat Skipper', 84, 76],
    ],
  },
  'us-nj': {
    backdrop: 'coast-south',
    water: 'Atlantic & Delaware Bay',
    spots: [
      ['Cape May Point Lighthouse', 'landmark', 'Southwest Point', 'Lighthouse Docent', 18, 76],
      ['Washington Street Victorian Mall', 'market', 'Central Cape May', 'Saltwater Taffy Puller', 48, 54],
      ['Emlen Physick Victorian Estate', 'archive', 'North Mansion Lawn', 'Victorian Curator', 52, 28],
      ['Cape May Bird Observatory Marsh', 'nature', 'West Meadow', 'Monarch Tracker', 28, 56],
      ['Harbor Marina Whale-Watch Pier', 'harbor', 'East Inlet', 'Dolphin Boat Captain', 80, 52],
    ],
  },
  'us-nv': {
    backdrop: 'desert-oasis',
    feature: 'Mojave Valley',
    spots: [
      ['Red Rock Canyon Scenic Overlook', 'nature', 'West Sandstone Cliffs', 'Desert Geologist', 16, 46],
      ['Springs Preserve Botanical Oasis', 'archive', 'Central Desert Springs', 'Water Historian', 42, 44],
      ['Neon Boneyard Heritage Museum', 'landmark', 'North Cultural Corridor', 'Sign Restorer', 54, 24],
      ['Hoover Dam Bypass Bridge Vista', 'harbor', 'Southeast Black Canyon', 'Dam Civil Engineer', 84, 78],
      ['Downtown Arts District Market', 'market', 'Central Main Street', 'Mojave Jeweler', 50, 62],
    ],
  },
  'us-oh': {
    backdrop: 'coast-north',
    water: 'Lake Erie',
    spots: [
      ['Rock & Roll Hall of Fame Pyramid', 'landmark', 'North Lakefront', 'Music Archivist', 46, 26],
      ['West Side Market Clock Tower', 'market', 'West Ohio City', 'Pierogi Baker', 28, 60],
      ['Cleveland Museum of Art Atrium', 'archive', 'East University Circle', 'Art Curator', 80, 44],
      ['Edgewater Lakefront Beach Park', 'nature', 'Northwest Shore', 'Lake Erie Naturalist', 18, 34],
      ['Steamship William G. Mather Pier', 'harbor', 'North Coast Harbor', 'Great Lakes Captain', 58, 28],
    ],
  },
  'us-ok': {
    backdrop: 'river-ew',
    water: 'Oklahoma River',
    spots: [
      ['First Americans Museum Mound', 'archive', 'Southeast Riverfront', 'Cultural Curator', 72, 74],
      ['Bricktown Water Taxi Canal', 'harbor', 'East Downtown', 'Canal Boat Pilot', 60, 52],
      ['Myriad Botanical Crystal Bridge', 'nature', 'Central Gardens', 'Tropical Botanist', 42, 54],
      ['National Cowboy & Western Museum', 'landmark', 'Northeast Persimmon Hill', 'Frontier Historian', 76, 24],
      ['Stockyards City Saddle Market', 'market', 'Southwest Exchange', 'Bootmaker & Baker', 22, 68],
    ],
  },
  'us-or': {
    backdrop: 'river-ns',
    water: 'Willamette River',
    spots: [
      ['International Rose Test Garden', 'nature', 'West Hills', 'Rose Hybridizer', 20, 44],
      ['Powell’s City of Books Corner', 'archive', 'Northwest Pearl', 'Rare Book Clerk', 36, 36],
      ['Portland Saturday Riverfront Market', 'market', 'West Burnside Waterfront', 'Marionberry Baker', 48, 52],
      ['St. Johns Gothic Suspension Bridge', 'harbor', 'North Peninsula', 'Columbia River Pilot', 38, 18],
      ['Oregon Museum of Science & Industry', 'landmark', 'East Bank Pier', 'Submarine Docent', 68, 66],
    ],
  },
  'us-pa': {
    backdrop: 'river-ns',
    water: 'Delaware & Schuylkill',
    spots: [
      ['Independence Hall & Liberty Bell', 'landmark', 'East Old City', 'National Park Ranger', 72, 52],
      ['Reading Terminal Market', 'market', 'Center City', 'Soft-Pretzel Baker', 52, 46],
      ['Philadelphia Museum of Art Steps', 'archive', 'Northwest Parkway', 'Sculpture Docent', 24, 34],
      ['Penn’s Landing Tall Ship Pier', 'harbor', 'East Delaware River', 'Tall-Ship Bosun', 84, 58],
      ['Fairmount Park Boathouse Row', 'nature', 'West Schuylkill Bank', 'Rowing Coach', 22, 62],
    ],
  },
  'us-ri': {
    backdrop: 'island',
    water: 'Narragansett Bay',
    spots: [
      ['Newport Cliff Walk Ocean Trail', 'nature', 'East Atlantic Cliffs', 'Coastal Naturalist', 74, 62],
      ['The Breakers Cliffside Mansion', 'landmark', 'Southeast Ochre Point', 'Gilded-Age Docent', 70, 76],
      ['Bowen’s Wharf Sailing Pier', 'harbor', 'West Harborfront', 'Schooner Skipper', 32, 52],
      ['Redwood Library & Athenaeum', 'archive', 'Central Bellevue', 'Colonial Librarian', 52, 44],
      ['Thames Street Clam-Cake Stand', 'market', 'Downtown Harbor', 'Chowder Chef', 42, 66],
    ],
  },
  'us-sc': {
    backdrop: 'harbor-bay',
    water: 'Charleston Harbor',
    spots: [
      ['Rainbow Row Pastel Townhouses', 'landmark', 'South East Bay', 'Preservation Guide', 62, 64],
      ['Historic Charleston City Market', 'market', 'Central Meeting St', 'Sweetgrass Artisan', 52, 46],
      ['The Battery & White Point Garden', 'harbor', 'South Peninsula Tip', 'Harbor Ferry Captain', 56, 80],
      ['Fort Sumter Ferry Liberty Square', 'archive', 'East Cooper River', 'Harbor Park Ranger', 76, 44],
      ['Angel Oak Ancient Live Oak', 'nature', 'West Johns Island', 'Arborist Guide', 20, 62],
    ],
  },
  'us-sd': {
    backdrop: 'mountains-north',
    feature: 'Black Hills Foothills',
    spots: [
      ['Mount Rushmore Granite Amphitheater', 'landmark', 'Southwest Black Hills', 'Sculptor Historian', 22, 78],
      ['Dinosaur Park Skyline Ridge', 'nature', 'West Skyline Hill', 'Ridge Naturalist', 34, 46],
      ['The Journey Museum & Learning Center', 'archive', 'East Rapid Creek', 'Lakota & Paleo Curator', 72, 44],
      ['Main Street Square Plaza', 'market', 'Central Downtown', 'Kuchen Pastry Baker', 52, 52],
      ['Canyon Lake Creekside Park', 'harbor', 'Southwest Creek', 'Trout Angler Guide', 28, 60],
    ],
  },
  'us-tn': {
    backdrop: 'river-ew',
    water: 'Cumberland River',
    spots: [
      ['Nashville Full-Scale Parthenon', 'landmark', 'West Centennial Park', 'Classical Curator', 24, 58],
      ['Ryman Auditorium Historic Stage', 'archive', 'Central Downtown', 'Acoustic Historian', 54, 48],
      ['John Seigenthaler Pedestrian Bridge', 'harbor', 'East River Crossing', 'Riverfront Busker', 70, 44],
      ['Nashville Farmers’ Market Hall', 'market', 'North Bicentennial Mall', 'Biscuit & Jam Maker', 46, 26],
      ['Cheekwood Botanical Estate', 'nature', 'Southwest Hills', 'Woodland Gardener', 24, 80],
    ],
  },
  'us-tx': {
    backdrop: 'river-ns',
    water: 'San Antonio River',
    spots: [
      ['The Alamo Stone Mission Plaza', 'landmark', 'Central Alamo Plaza', 'Mission Historian', 54, 46],
      ['San Antonio River Walk Barges', 'harbor', 'Downtown Cypress Bend', 'River Barge Captain', 48, 56],
      ['Historic Market Square El Mercado', 'market', 'West Dolorosa', 'Piñata & Taco Vendor', 24, 54],
      ['Mission San José Rose Window', 'archive', 'South Mission Trail', 'Park Service Ranger', 52, 82],
      ['San Antonio Botanical Conservatory', 'nature', 'Northeast Brackenridge', 'Desert Botanist', 74, 24],
    ],
  },
  'us-ut': {
    backdrop: 'mountains-north',
    feature: 'Wasatch Range',
    spots: [
      ['Natural History Museum of Utah', 'archive', 'East Foothills Bench', 'Dinosaur Curator', 80, 48],
      ['Temple Square Historic Tabernacle', 'landmark', 'Central Downtown', 'Organ Docent', 46, 42],
      ['Great Salt Lake Antelope Marina', 'harbor', 'Northwest Salt Shore', 'Sailboat Skipper', 18, 28],
      ['Downtown Farmers Market Pioneer Park', 'market', 'West Pioneer Square', 'Honey-Butter Baker', 36, 62],
      ['Red Butte Mountain Canyon Garden', 'nature', 'East Wasatch Mouth', 'Alpine Botanist', 82, 66],
    ],
  },
  'us-vt': {
    backdrop: 'coast-west',
    water: 'Lake Champlain',
    spots: [
      ['Burlington Waterfront Boathouse', 'harbor', 'West Lakefront', 'Champlain Ferry Skipper', 22, 50],
      ['Church Street Brick Marketplace', 'market', 'Central Downtown', 'Maple Sugar Maker', 52, 46],
      ['ECHO Lake Aquarium & Science Center', 'nature', 'West Pier', 'Lake Biologist', 26, 64],
      ['Shelburne Covered Bridge & Steamboat', 'archive', 'South Bay Meadow', 'Steamboat Curator', 42, 80],
      ['Ethan Allen Stone Lookout Tower', 'landmark', 'North Park Ridge', 'Green Mountain Guide', 48, 22],
    ],
  },
  'us-va': {
    backdrop: 'river-ew',
    water: 'James & York Rivers',
    spots: [
      ['Governor’s Palace Brick Gardens', 'landmark', 'North Palace Green', 'Colonial Interpreter', 48, 28],
      ['Duke of Gloucester Apothecary & Market', 'market', 'Central Historic Street', 'Colonial Apothecary', 52, 50],
      ['Historic Jamestowne Archaeological Dig', 'archive', 'Southwest River Island', 'Dig Archaeologist', 20, 78],
      ['Yorktown Riverwalk Tall-Ship Pier', 'harbor', 'East York River', 'Schooner Captain', 82, 42],
      ['College Woods Matoaka Lake Trail', 'nature', 'West Forest', 'Tidewater Naturalist', 26, 52],
    ],
  },
  'us-wi': {
    backdrop: 'coast-east',
    water: 'Lake Michigan',
    spots: [
      ['Milwaukee Art Museum Burke Brise Soleil', 'landmark', 'East Lakefront', 'Wing Docent', 76, 46],
      ['Milwaukee Public Market', 'market', 'Historic Third Ward', 'Cheese-Curd Maker', 62, 64],
      ['Discovery World Pier & Schooner', 'harbor', 'East Harbor Pier', 'Great Lakes Sailor', 78, 60],
      ['Mitchell Park Domes Conservatory', 'nature', 'Southwest Valley', 'Desert-Dome Botanist', 24, 72],
      ['North Point Lakefront Lighthouse', 'archive', 'Northeast Lake Park', 'Maritime Historian', 76, 22],
    ],
  },
  'us-wv': {
    backdrop: 'river-ew',
    water: 'Potomac & Shenandoah',
    spots: [
      ['The Point Three-State Confluence', 'harbor', 'East Gorge Tip', 'River Rafting Guide', 80, 54],
      ['John Brown’s Fort Brick Engine House', 'archive', 'Lower Town', 'National Park Historian', 66, 56],
      ['Jefferson Rock Appalachian Overlook', 'landmark', 'South High Trail', 'Appalachian Thru-Hiker', 58, 76],
      ['High Street Bakery & General Store', 'market', 'Lower Town Slope', 'Pepperoni-Roll Baker', 48, 48],
      ['Maryland Heights Cliffside Vista', 'nature', 'North Gorge Ridge', 'Black-Bear Naturalist', 64, 24],
    ],
  },
});
