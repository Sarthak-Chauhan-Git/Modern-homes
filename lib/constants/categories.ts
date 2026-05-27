export interface CategoryTile {
  name: string;
  slug: string;
  image: string;
}

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dl5threci/image/upload';

const cloudinaryImage = (path: string) => `${CLOUDINARY_BASE}/${path}`;

export const HERO_PARALLAX_IMAGE = cloudinaryImage('v1779795937/Hero_paralax_fcfsov.png');

export const CATEGORY_TILES: CategoryTile[] = [
  {
    name: 'Accessories',
    slug: 'accessories',
    image: cloudinaryImage('v1779795877/accessories_cbjbnp.png'),
  },
  {
    name: 'Diverter and Shower Valve',
    slug: 'diverter-shower-valve',
    image: cloudinaryImage('v1779795876/diverter_shower_valve_itu9ah.png'),
  },
  {
    name: 'Faucet',
    slug: 'faucet',
    image: cloudinaryImage('v1779795880/faucet_hh8xls.png'),
  },
  {
    name: 'Flush',
    slug: 'flush',
    image: cloudinaryImage('v1779795924/flush_iixnx9.png'),
  },
  {
    name: 'Sanitary Ware',
    slug: 'sanitary-ware',
    image: cloudinaryImage('v1779795924/sanitary_ware_vjmmfl.png'),
  },
  {
    name: 'Shower Panel',
    slug: 'shower-panel',
    image: cloudinaryImage('v1779795909/shower_panel_t547by.png'),
  },
  {
    name: 'Thermostatic Mixture',
    slug: 'thermostatic-mixture',
    image: cloudinaryImage('v1779795918/thermostatic_mixture_ir6zjx.png'),
  },
  {
    name: 'Water Heater / Geyser',
    slug: 'water-heater-geyser',
    image: cloudinaryImage('v1779795889/water_heater_hc0q3y.png'),
  },
  {
    name: 'Whirpool',
    slug: 'whirpool',
    image: cloudinaryImage('v1779795915/whirpool_gxolo6.png'),
  },
];

export const CATEGORIES = CATEGORY_TILES.map((category) => category.name);

export const SUB_CATEGORIES: Record<string, string[]> = {
  Accessories: ['Towel Rail', 'Soap Dispenser', 'Grab Bar'],
  'Diverter and Shower Valve': ['Diverter Valve', 'Shower Valve'],
  Faucet: ['Basin Faucet', 'Wall Faucet', 'Kitchen Faucet'],
  Flush: ['Concealed Cistern', 'Flush Plate'],
  'Sanitary Ware': ['Wall-hung WC', 'Washbasins', 'Pedestals'],
  'Shower Panel': ['Rainfall Panels', 'Jet Panels'],
  'Thermostatic Mixture': ['Shower Mixer', 'Bath Mixer'],
  'Water Heater / Geyser': ['Instant', 'Storage'],
  Whirpool: ['Whirpool Tub', 'Spa Tub'],
};
