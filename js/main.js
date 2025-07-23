// --- ДАННЫЕ КАРТОЧЕК ---
const materialOptions = [
  {
    id: "fibreglass",
    title: "Fibreglass",
    desc: "Prefabricated, fast installation, smooth finish. Wide range of shapes and sizes.",
    img: "images/fiberglass.jpg",
    badge: "Popular",
    link: { label: "Learn more", url: "#" },
    included: false
  },
  {
    id: "concrete",
    title: "Concrete",
    desc: "Custom shape and size, durable, suitable for any site. Fully tailored to your needs.",
    img: "images/concrete.jpg",
    badge: "Customizable",
    link: { label: "Learn more", url: "#" },
    included: false
  },
  {
    id: "vinyl",
    title: "Vinyl",
    desc: "Affordable, flexible design, soft surface. Quick installation and easy maintenance.",
    img: "images/placeholder.jfif",
    link: { label: "Learn more", url: "#" },
    included: false
  }
];

// --- МОДЕЛИ ДЛЯ FIBREGLASS ---
const fibreglassModels = [
  { 
    id: "eden-center-steps", 
    title: "Eden Center Steps", 
    desc: "Blue Shell Pool", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/eden-center-steps-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.2x3.2", size: "6.2m x 3.2m x 1.6m", length: 6.2, width: 3.2, depth: 1.6 },
      { id: "7.5x3.5", size: "7.5m x 3.5m x 1.7m", length: 7.5, width: 3.5, depth: 1.7 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "halo-oval-spa", 
    title: "Halo Oval Spa", 
    desc: "Mini Shell Pool", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/halo-oval-spa-fibreglass-pool-shell" }, 
    sizes: [
      { id: "4.0x2.5", size: "4.0m x 2.5m x 1.3m", length: 4.0, width: 2.5, depth: 1.3 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "the-stride", 
    title: "The Stride", 
    desc: "Lap Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/the-stride-fibreglass-pool-shell" }, 
    sizes: [
      { id: "10.0x2.5", size: "10.0m x 2.5m x 1.6m", length: 10.0, width: 2.5, depth: 1.6 },
      { id: "12.0x2.5", size: "12.0m x 2.5m x 1.6m", length: 12.0, width: 2.5, depth: 1.6 },
      { id: "15.0x2.5", size: "15.0m x 2.5m x 1.6m", length: 15.0, width: 2.5, depth: 1.6 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "luma", 
    title: "Luma", 
    desc: "Shell Swimming Pool", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/luma-fibreglass-pool-shell" }, 
    sizes: [
      { id: "7.0x3.5", size: "7.0m x 3.5m x 1.7m", length: 7.0, width: 3.5, depth: 1.7 },
      { id: "8.0x4.0", size: "8.0m x 4.0m x 1.8m", length: 8.0, width: 4.0, depth: 1.8 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "avoca", 
    title: "Avoca", 
    desc: "Plunge Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/avoca-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.0x3.2", size: "6.0m x 3.2m x 1.6m", length: 6.0, width: 3.2, depth: 1.6 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "olympia", 
    title: "Olympia", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/olympia-fibreglass-pool-shell" }, 
    sizes: [
      { id: "8.0x4.0", size: "8.0m x 4.0m x 1.8m", length: 8.0, width: 4.0, depth: 1.8 },
      { id: "9.0x4.5", size: "9.0m x 4.5m x 1.8m", length: 9.0, width: 4.5, depth: 1.8 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "horizon", 
    title: "Horizon", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/horizon-fibreglass-pool-shell" }, 
    sizes: [
      { id: "7.5x3.5", size: "7.5m x 3.5m x 1.7m", length: 7.5, width: 3.5, depth: 1.7 },
      { id: "8.5x4.0", size: "8.5m x 4.0m x 1.8m", length: 8.5, width: 4.0, depth: 1.8 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "marra-coora", 
    title: "Marra Coora", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/marra-coora-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.5x3.2", size: "6.5m x 3.2m x 1.6m", length: 6.5, width: 3.2, depth: 1.6 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "azure", 
    title: "Azure", 
    desc: "Pool Fibreglass Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/azure-fibreglass-pool-shell" }, 
    sizes: [
      { id: "5.5x2.5", size: "5.5m x 2.5m x 1.5m", length: 5.5, width: 2.5, depth: 1.5 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "moana", 
    title: "Moana", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/moana-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.0x3.0", size: "6.0m x 3.0m x 1.6m", length: 6.0, width: 3.0, depth: 1.6 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "yara-with-spa", 
    title: "Yara with SPA", 
    desc: "Spa Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/yara-with-spa-fibreglass-pool-shell" }, 
    sizes: [
      { id: "7.5x3.5", size: "7.5m x 3.5m x 1.7m", length: 7.5, width: 3.5, depth: 1.7 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "billabong", 
    title: "Billabong", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/billabong-fibreglass-pool-shell" }, 
    sizes: [
      { id: "5.0x2.5", size: "5.0m x 2.5m x 1.5m", length: 5.0, width: 2.5, depth: 1.5 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "mirra", 
    title: "Mirra", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/mirra-fibreglass-pool-shell" }, 
    sizes: [
      { id: "4.5x2.5", size: "4.5m x 2.5m x 1.4m", length: 4.5, width: 2.5, depth: 1.4 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "drift", 
    title: "Drift", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/drift-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.0x2.5", size: "6.0m x 2.5m x 1.5m", length: 6.0, width: 2.5, depth: 1.5 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "ariki", 
    title: "Ariki", 
    desc: "Big Shell Pool", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/ariki-fibreglass-pool-shell" }, 
    sizes: [
      { id: "8.5x4.0", size: "8.5m x 4.0m x 1.8m", length: 8.5, width: 4.0, depth: 1.8 },
      { id: "10.0x4.5", size: "10.0m x 4.5m x 1.8m", length: 10.0, width: 4.5, depth: 1.8 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "aloha", 
    title: "Aloha", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/aloha-fibreglass-pool-shell" }, 
    sizes: [
      { id: "7.0x3.5", size: "7.0m x 3.5m x 1.7m", length: 7.0, width: 3.5, depth: 1.7 },
      { id: "8.0x4.0", size: "8.0m x 4.0m x 1.8m", length: 8.0, width: 4.0, depth: 1.8 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "aria", 
    title: "Aria", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/aria-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.0x3.0", size: "6.0m x 3.0m x 1.6m", length: 6.0, width: 3.0, depth: 1.6 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "eden-end-steps", 
    title: "Eden End Steps", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/eden-end-steps-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.2x3.2", size: "6.2m x 3.2m x 1.6m", length: 6.2, width: 3.2, depth: 1.6 },
      { id: "7.5x3.5", size: "7.5m x 3.5m x 1.7m", length: 7.5, width: 3.5, depth: 1.7 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "solenne", 
    title: "Solenne", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/solenne-fibreglass-pool-shell" }, 
    sizes: [
      { id: "7.5x3.5", size: "7.5m x 3.5m x 1.7m", length: 7.5, width: 3.5, depth: 1.7 },
      { id: "8.5x4.0", size: "8.5m x 4.0m x 1.8m", length: 8.5, width: 4.0, depth: 1.8 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "triton", 
    title: "Triton", 
    desc: "Fiberglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/triton-fibreglass-pool-shell" }, 
    sizes: [
      { id: "10.0x2.5", size: "10.0m x 2.5m x 1.6m", length: 10.0, width: 2.5, depth: 1.6 },
      { id: "12.0x2.5", size: "12.0m x 2.5m x 1.6m", length: 12.0, width: 2.5, depth: 1.6 },
      { id: "15.0x2.5", size: "15.0m x 2.5m x 1.6m", length: 15.0, width: 2.5, depth: 1.6 }
    ],
    hasMultipleSizes: true
  },
  { 
    id: "alto", 
    title: "Alto", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/alto-fibreglass-pool-shell" }, 
    sizes: [
      { id: "5.5x2.5", size: "5.5m x 2.5m x 1.5m", length: 5.5, width: 2.5, depth: 1.5 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "vela-spa", 
    title: "Vela Spa", 
    desc: "Plunge Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/vela-spa-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.0x2.5", size: "6.0m x 2.5m x 1.4m", length: 6.0, width: 2.5, depth: 1.4 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "the-rocks", 
    title: "The Rocks", 
    desc: "Plunge Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/the-rocks-fibreglass-pool-shell" }, 
    sizes: [
      { id: "4.0x2.5", size: "4.0m x 2.5m x 1.3m", length: 4.0, width: 2.5, depth: 1.3 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "eden-with-spa", 
    title: "7.5m Eden with Spa", 
    desc: "Plunge Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/eden-with-spa-fibreglass-pool-shell" }, 
    sizes: [
      { id: "7.5x3.5", size: "7.5m x 3.5m x 1.7m", length: 7.5, width: 3.5, depth: 1.7 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "longbeach", 
    title: "Longbeach", 
    desc: "Large Shell Pool", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/longbeach-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.0x2.5", size: "6.0m x 2.5m x 1.5m", length: 6.0, width: 2.5, depth: 1.5 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "yara", 
    title: "Yara", 
    desc: "Fibreglass Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/yara-fibreglass-pool-shell" }, 
    sizes: [
      { id: "6.2x3.2", size: "6.2m x 3.2m x 1.6m", length: 6.2, width: 3.2, depth: 1.6 }
    ],
    hasMultipleSizes: false
  },
  { 
    id: "arctic-white", 
    title: "Arctic White", 
    desc: "Plunge Pool Shell", 
    img: "images/fiberglass.jpg", 
    link: { label: "Learn more", url: "https://pooltools.au/products/arctic-white-fibreglass-pool-shell" }, 
    sizes: [
      { id: "4.0x2.0", size: "4.0m x 2.0m x 1.2m", length: 4.0, width: 2.0, depth: 1.2 }
    ],
    hasMultipleSizes: false
  }
];

// --- ФОРМЫ ДЛЯ CONCRETE ---
const concreteShapes = [
  { id: "rectangle", title: "Rectangle", img: "images/concrete.jpg", desc: "Classic rectangular shape." },
  { id: "oval", title: "Oval", img: "images/concrete.jpg", desc: "Smooth oval shape." },
  { id: "square", title: "Square", img: "images/concrete.jpg", desc: "Modern square shape." }
];

// --- ДАННЫЕ ДЛЯ EQUIPMENT ---
const equipmentOptions = [
  { id: "basic", title: "Basic", desc: "Single Speed Pump, Chlorinator, Filter", img: "images/placeholder.jfif", badge: "Included", included: true, price: 0 },
  { id: "intermediate", title: "Intermediate", desc: "Variable Speed Pump, Halo Chlor 25, Med Spec Filter, 2 Lights", img: "images/placeholder.jfif", included: false, price: 12000 },
  { id: "family", title: "Family Size", desc: "Variable Speed Pump, Quad Core Filter, Halo 35 Chlor, 2 Lights", img: "images/placeholder.jfif", included: false, price: 15000 }
];

// --- ДАННЫЕ ДЛЯ FINISHES ---
const finishesCoping = [
  { id: "concrete_pool_edge", title: "Concrete Pool Edge System", desc: "Standard edge system.", badge: "Included", included: true, img: "images/placeholder.jfif", price: 0 },
  { id: "natural_stone", title: "Drop Down Face Paver - Natural Stone", desc: "Premium natural stone.", included: false, img: "images/placeholder.jfif", price: 8500, included: false },
  { id: "porcelain", title: "Drop Down Face Paver - Porcelain", desc: "Modern porcelain finish.", included: false, img: "images/placeholder.jfif", price: 7000, included: false },
  { id: "ceramic", title: "Drop Down Face Paver - Ceramic", desc: "Classic ceramic finish.", included: false, img: "images/placeholder.jfif", price: 6000, included: false }
];

const finishesInternal = [
  { id: "glass_mosaic", title: "Glass Mosaic", desc: "Premium glass mosaic.", badge: "Included", included: true, img: "images/placeholder.jfif", price: 0 },
  { id: "porcelain_40", title: "40x40 Porcelain", desc: "Porcelain tile 40x40mm.", included: false, img: "images/placeholder.jfif", price: 5000, included: false },
  { id: "penny_rounds", title: "Penny Rounds", desc: "Stylish penny rounds.", included: false, img: "images/placeholder.jfif", price: 4000, included: false }
];

// Объединенный массив для finishes с группировкой
const finishesOptions = [
  // Coping Materials
  { id: "concrete_pool_edge", title: "Concrete Pool Edge System", desc: "Standard edge system.", badge: "Included", group: "coping", included: true, img: "images/placeholder.jfif", price: 0 },
  { id: "natural_stone", title: "Drop Down Face Paver - Natural Stone", desc: "Premium natural stone.", group: "coping", included: false, img: "images/placeholder.jfif", price: 8500 },
  { id: "porcelain", title: "Drop Down Face Paver - Porcelain", desc: "Modern porcelain finish.", group: "coping", included: false, img: "images/placeholder.jfif", price: 7000 },
  { id: "ceramic", title: "Drop Down Face Paver - Ceramic", desc: "Classic ceramic finish.", group: "coping", included: false, img: "images/placeholder.jfif", price: 6000 },
  
  // Internal Finishes
  { id: "glass_mosaic", title: "Glass Mosaic", desc: "Premium glass mosaic.", badge: "Included", group: "internal", included: true, img: "images/placeholder.jfif", price: 0 },
  { id: "porcelain_40", title: "40x40 Porcelain", desc: "Porcelain tile 40x40mm.", group: "internal", included: false, img: "images/placeholder.jfif", price: 5000 },
  { id: "penny_rounds", title: "Penny Rounds", desc: "Stylish penny rounds.", group: "internal", included: false, img: "images/placeholder.jfif", price: 4000 }
];

// --- ДАННЫЕ СТЕППЕРА ---
const steps = [
  { label: "Material" },
  { label: "Design" },
  { label: "Equipment" },
  { label: "Finishes" },
  { label: "Hardscape" },
  { label: "Cover" },
  { label: "Amenities" },
  { label: "Included" },
  { label: "Planning" },
  { label: "Cost" }
];

// --- СОСТОЯНИЕ ---
let stepIndex = 0;
let selectedMaterial = null;
let selectedDesign = null;
let selectedShape = null;
let selectedSize = null; // Новая переменная для выбранного размера
concreteDims = { length: 8, width: 4, depth: 1.5 };
let selectedEquipment = null;
let selectedCoping = null;
let selectedInternal = null;
let selectedHardscape = null;
let selectedCover = null;
let selectedAmenities = [];
let selectedPlanning = [];

// --- ДАННЫЕ ДЛЯ WHAT'S INCLUDED ---
const includedOptions = [
  { id: "excavation", title: "Excavation", desc: "Site preparation and excavation work.", img: "images/placeholder.jfif", included: true, price: 0 },
  { id: "reinforced_steel", title: "Reinforced Steel", desc: "Steel reinforcement for structural integrity.", img: "images/placeholder.jfif", included: true, price: 0 },
  { id: "plumbing_electric", title: "Plumbing & Electric", desc: "Complete plumbing and electrical installation.", img: "images/placeholder.jfif", included: true, price: 0 },
  { id: "shotcrete", title: "Shotcrete", desc: "Concrete application for pool shell.", img: "images/placeholder.jfif", included: true, price: 0 },
  { id: "ceramic_tile", title: "Ceramic/Porcelain Tile Installation", desc: "Professional tile installation service.", img: "images/placeholder.jfif", included: true, price: 0 },
  { id: "coping_installation", title: "Coping Installation", desc: "Pool edge coping installation.", img: "images/placeholder.jfif", included: true, price: 0 },
  { id: "equipment_operation", title: "Equipment Required for Operation", desc: "All necessary operational equipment.", img: "images/placeholder.jfif", included: true, price: 0 },
  { id: "white_plaster", title: "White Plaster Finish", desc: "Standard white plaster pool finish.", img: "images/placeholder.jfif", included: true, price: 0 },
  { id: "warranties", title: "Warranties", desc: "Comprehensive warranty coverage.", img: "images/placeholder.jfif", included: true, price: 0 }
];

// --- ДАННЫЕ ДЛЯ PLANNING ---
const planningOptions = [
  { id: "permits", title: "Permits", desc: "Building permits and approvals required.", img: "images/placeholder.jfif", included: false, price: 0 },
  { id: "small_access", title: "Small Access", desc: "Limited site access considerations.", img: "images/placeholder.jfif", included: false, price: 0 },
  { id: "rock_dig", title: "Rock Dig", desc: "Rock excavation and removal.", img: "images/placeholder.jfif", included: false, price: 0 },
  { id: "hillside", title: "Hillside", desc: "Sloped site considerations.", img: "images/placeholder.jfif", included: false, price: 0 },
  { id: "caissons", title: "Caissons", desc: "Foundation caissons for stability.", img: "images/placeholder.jfif", included: false, price: 0 },
  { id: "retaining_wall", title: "Retaining Wall", desc: "Retaining wall construction.", img: "images/placeholder.jfif", included: false, price: 0 },
  { id: "pool_fence", title: "Pool Fence", desc: "Safety fencing requirements.", img: "images/placeholder.jfif", included: false, price: 0 },
  { id: "easements", title: "Easements", desc: "Property easement considerations.", img: "images/placeholder.jfif", included: false, price: 0 },
  { id: "hoa", title: "Home Owner's Association (HOA)", desc: "HOA approval and requirements.", img: "images/placeholder.jfif", included: false, price: 0 }
];

// --- ДАННЫЕ ДЛЯ ESTIMATED COST ---
// Функция для расчета общей стоимости
function calculateTotalCost() {
  let breakdown = {};
  let total = 0;
  let length, width, depth;
  
  // 1. Определяем размеры
  if (selectedMaterial === 'fibreglass' && selectedDesign && selectedSize) {
    const model = fibreglassModels.find(m => m.id === selectedDesign);
    const size = model.sizes.find(s => s.id === selectedSize);
    if (size) {
      length = size.length;
      width = size.width;
      depth = size.depth;
    }
    breakdown['construction'] = {
      title: 'Construction (Fibreglass)',
      cost: priceConfig.FIBREGLASS_BASE,
      description: 'Fibreglass pool shell and structural work',
      included: false,
      removable: false,
      id: 'construction'
    };
    total += priceConfig.FIBREGLASS_BASE;
  } else if (selectedMaterial === 'concrete' && selectedShape) {
    length = concreteDims.length;
    width = concreteDims.width;
    depth = concreteDims.depth;
    // Стоимость чаши рассчитывается по объёму (пример: цена за м³)
    const shellVolume = length * width * depth;
    const shellCost = shellVolume * (priceConfig.CONCRETE_SHELL_PER_M3 || 3500); // добавить в priceConfig
    breakdown['construction'] = {
      title: 'Construction (Concrete)',
      cost: shellCost,
      description: `Concrete pool shell (${shellVolume.toFixed(1)} m³)`,
      included: false,
      removable: false,
      id: 'construction'
    };
    total += shellCost;
  }
  
  // 2. Плитка
  if (length && width) {
    const tile = calcTileCost(length, width);
    breakdown['tile'] = {
      title: 'Tile',
      cost: tile,
      description: `Tile for ${(length * width).toFixed(1)} m²`,
      included: false,
      removable: false,
      id: 'tile'
    };
    total += tile;
  }
  // 3. Парапет (Finishes Coping)
  if (selectedCoping) {
    const opt = finishesOptions.find(o => o.id === selectedCoping && o.group === 'coping');
    breakdown['finishesCoping'] = {
      title: opt.title,
      cost: opt.included ? 0 : opt.price,
      description: opt.desc,
      included: !!opt.included,
      removable: !opt.included,
      id: opt.id
    };
    total += opt.included ? 0 : opt.price;
  }
  // 4. Внутренняя отделка (Finishes Internal)
  if (selectedInternal) {
    const opt = finishesOptions.find(o => o.id === selectedInternal && o.group === 'internal');
    breakdown['finishesInternal'] = {
      title: opt.title,
      cost: opt.included ? 0 : opt.price,
      description: opt.desc,
      included: !!opt.included,
      removable: !opt.included,
      id: opt.id
    };
    total += opt.included ? 0 : opt.price;
  }
  // 5. Земляные работы
  if (length && width && depth) {
    const excavation = calcExcavationCost(length, width, depth);
    breakdown['excavation'] = {
      title: 'Excavation',
      cost: excavation,
      description: `Excavation for ${(length * width * depth).toFixed(1)} m³`,
      included: false,
      removable: false,
      id: 'excavation'
    };
    total += excavation;
  }
  // 6. Бетонирование (Concrete)
  if (length && width) {
    const concrete = calcConcreteCost(length, width);
    breakdown['concrete'] = {
      title: 'Concrete',
      cost: concrete,
      description: `Concrete for ${(length * width).toFixed(1)} m²`,
      included: false,
      removable: false,
      id: 'concrete'
    };
    total += concrete;
  }
  // 7. Электрика/коммуникации (фикс, всегда включено)
  breakdown['electrical'] = {
    title: 'Electrical & Plumbing',
    cost: priceConfig.ELECTRICAL,
    description: 'Electrical and plumbing installation (always included)',
    included: true,
    removable: false,
    id: 'electrical'
  };
  total += priceConfig.ELECTRICAL;
  // 8. Оборудование (Equipment)
  if (selectedEquipment) {
    const opt = equipmentOptions.find(o => o.id === selectedEquipment);
    breakdown['equipment'] = {
      title: opt.title,
      cost: opt.included ? 0 : opt.price,
      description: opt.desc,
      included: !!opt.included,
      removable: !opt.included,
      id: opt.id
    };
    total += opt.included ? 0 : opt.price;
  }
  // 9. Ландшафтный дизайн (Hardscape)
  if (selectedHardscape) {
    const opt = hardscapeOptions.find(o => o.id === selectedHardscape);
    breakdown['hardscape'] = {
      title: opt.title,
      cost: opt.included ? 0 : opt.price,
      description: opt.desc,
      included: !!opt.included,
      removable: !opt.included,
      id: opt.id
    };
    total += opt.included ? 0 : opt.price;
  }
  // 10. Крышка (Cover)
  if (selectedCover) {
    const opt = coverOptions.find(o => o.id === selectedCover);
    breakdown['cover'] = {
      title: opt.title,
      cost: opt.included ? 0 : opt.price,
      description: opt.desc,
      included: !!opt.included,
      removable: !opt.included,
      id: opt.id
    };
    total += opt.included ? 0 : opt.price;
  }
  // 11. Amenities (множественный выбор)
  if (selectedAmenities && selectedAmenities.length > 0) {
    selectedAmenities.forEach(aid => {
      const opt = amenitiesOptions.find(o => o.id === aid);
      breakdown[`amenity_${aid}`] = {
        title: opt.title,
        cost: opt.included ? 0 : opt.price,
        description: opt.desc,
        included: !!opt.included,
        removable: !opt.included,
        id: opt.id
      };
      total += opt.included ? 0 : opt.price;
    });
  }
  // 12. Included Options (всегда показывать все)
  includedOptions.forEach(opt => {
    breakdown[`included_${opt.id}`] = {
      title: opt.title,
      cost: 0,
      description: opt.desc,
      included: true,
      removable: false,
      id: opt.id
    };
  });
  return { total, breakdown };
}

// Функции для кнопок в шаге 9
function getConsultation() {
  alert('Thank you for your interest! Our team will contact you soon for a detailed consultation.');
  // Здесь можно добавить интеграцию с CRM или отправку формы
}

function addToCart() {
  alert('Pool package added to cart! Redirecting to checkout...');
  // Здесь можно добавить интеграцию с Shopify или другой e-commerce платформой
}

function editOptions() {
  // Возвращаемся к шагу 6 (Amenities) для редактирования опций
  stepIndex = 6;
  renderStep();
}

// === 1. КОНФИГ: ВСЕ ЦЕНЫ И КОЭФФИЦИЕНТЫ ===
// TODO: заменить на реальные значения при интеграции
const priceConfig = {
  FIBREGLASS_BASE: 25000, // Фиксированная цена для fibreglass
  CONCRETE_BASE: 29000,   // Фиксированная цена для concrete
  TILE_PRICE_PER_M2: 80,  // Плитка за м²
  COPING_PRICE_PER_M: 50, // Парапет за м
  EXCAVATION_PRICE_PER_M3: 40, // Земляные работы за м³
  CONCRETE_PRICE_PER_M2: 100,  // Бетонирование за м²
  ELECTRICAL: 2500,       // Электрика/коммуникации (всегда включено)
  LANDSCAPING: 5000,      // Ландшафтный дизайн (пример)
  // Оборудование
  equipment: {
    basic: 8000,
    intermediate: 12000,
    family: 15000
  },
  CONCRETE_SHELL_PER_M3: 3500 // новая строка
};

// === 2. ОПЦИИ/КАРТОЧКИ: ВСЕГДА С ПОЛЕМ price и included ===
// Amenities, hardscape, cover, etc. — все с price и included
// TODO: заменить на реальные значения/структуру при интеграции
const amenitiesOptions = [
  { id: "bubblers", title: "Bubblers", desc: "Bubble jets for water features.", img: "images/placeholder.jfif", price: 1200, included: false },
  { id: "fire_pits", title: "Fire Pits", desc: "Outdoor fire features.", img: "images/placeholder.jfif", price: 3500, included: false },
  { id: "lounge_area", title: "Lounge Area", desc: "Comfortable seating area.", img: "images/placeholder.jfif", price: 2800, included: false },
  { id: "deck_jets", title: "Deck Jets", desc: "Water jets on deck surface.", img: "images/placeholder.jfif", price: 1800, included: false },
  { id: "scuppers", title: "Scuppers", desc: "Water overflow features.", img: "images/placeholder.jfif", price: 2200, included: false },
  { id: "in_floor_system", title: "In-Floor System", desc: "Hidden cleaning system.", img: "images/placeholder.jfif", price: 4500, included: false },
  { id: "ozone_sanitation", title: "Ozone Sanitation", desc: "Advanced water treatment.", img: "images/placeholder.jfif", price: 3200, included: false },
  { id: "led_waterbowls", title: "LED Waterbowls", desc: "Illuminated water features.", img: "images/placeholder.jfif", price: 1600, included: false },
  { id: "equipment_automation", title: "Equipment Automation Controls", desc: "Smart pool control system.", img: "images/placeholder.jfif", price: 2800, included: false }
];

const hardscapeOptions = [
  { id: "honed_concrete", title: "Honed Concrete", desc: "Smooth, modern concrete finish.", img: "images/placeholder.jfif", price: 3500, included: false },
  { id: "natural_stone", title: "Natural Stone", desc: "Premium natural stone paving.", img: "images/placeholder.jfif", price: 8500, included: false },
  { id: "pavers", title: "Pavers", desc: "Classic paver hardscape.", img: "images/placeholder.jfif", price: 4200, included: false },
  { id: "timber_decking", title: "Timber Decking", desc: "Warm timber deck area.", img: "images/placeholder.jfif", price: 3800, included: false }
];

const coverOptions = [
  { id: "solar_bubble", title: "Solar Bubble Cover", desc: "Energy-efficient solar cover.", img: "images/placeholder.jfif", price: 800, included: false },
  { id: "automatic", title: "Automatic Pool Cover", desc: "Convenient automatic cover.", img: "images/placeholder.jfif", price: 12000, included: false }
];

// === 3. ФУНКЦИИ РАСЧЁТА ДЛЯ КАЖДОЙ СТАТЬИ ===
// Плитка по площади
function calcTileCost(length, width) {
  return length * width * priceConfig.TILE_PRICE_PER_M2;
}
// Парапет по периметру
function calcCopingCost(length, width) {
  return 2 * (length + width) * priceConfig.COPING_PRICE_PER_M;
}
// Земляные работы по объёму
function calcExcavationCost(length, width, depth) {
  return length * width * depth * priceConfig.EXCAVATION_PRICE_PER_M3;
}
// Бетонирование по площади дна
function calcConcreteCost(length, width) {
  return length * width * priceConfig.CONCRETE_PRICE_PER_M2;
}
// Оборудование
function calcEquipmentCost(selectedEquipment) {
  const opt = equipmentOptions.find(o => o.id === selectedEquipment);
  return calcOptionCost(opt);
}
// Ландшафтный дизайн (если выбран)
function calcLandscapingCost(selectedLandscaping) {
  // Можно расширить для разных вариантов
  return selectedLandscaping ? priceConfig.LANDSCAPING : 0;
}
// Доп.опции (amenities, hardscape, cover, ...)
function calcExtrasCost(selectedExtras, optionsList) {
  if (!selectedExtras || !selectedExtras.length) return 0;
  return selectedExtras.reduce((sum, id) => {
    const opt = optionsList.find(o => o.id === id);
    return sum + calcOptionCost(opt);
  }, 0);
}
// Если опция included, цена всегда 0
function calcOptionCost(option) {
  return option && option.included ? 0 : (option.price || 0);
}

// Функция для удаления опции из breakdown (глобально)
function removeBreakdownOption(key, id) {
  // Amenities
  if (key.startsWith('amenity_') || key === 'amenities') {
    selectedAmenities = selectedAmenities.filter(aid => aid !== id);
  }
  // Equipment
  else if (key === 'equipment') {
    selectedEquipment = null;
  }
  // Cover
  else if (key === 'cover') {
    selectedCover = null;
  }
  // Hardscape
  else if (key === 'hardscape') {
    selectedHardscape = null;
  }
  // Finishes Coping
  else if (key === 'finishesCoping') {
    selectedCoping = null;
  }
  // Finishes Internal
  else if (key === 'finishesInternal') {
    selectedInternal = null;
  }
  // Included options (нельзя удалять, но на всякий случай)
  else if (key.startsWith('included_')) {
    // ничего не делаем
  }
  renderStep();
}
// Делаем функцию глобальной для вызова из HTML:
window.removeBreakdownOption = removeBreakdownOption;

// === КНОПКА "New Calculation" ===
function resetCalculator() {
  stepIndex = 0;
  selectedMaterial = null;
  selectedDesign = null;
  selectedShape = null;
  selectedSize = null; // Сбрасываем выбранный размер
  concreteDims = { length: 8, width: 4, depth: 1.5 };
  selectedEquipment = null;
  selectedCoping = null;
  selectedInternal = null;
  selectedHardscape = null;
  selectedCover = null;
  selectedAmenities = [];
  selectedPlanning = [];
  renderStep();
}
window.resetCalculator = resetCalculator;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  renderStep();
}); 