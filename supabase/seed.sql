-- Sample products across the current category set.
do $$
declare
  img text := 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900';
begin

insert into products (code, name, description, category, sub_category, price_mrp, price_retail, price_wholesale, images, featured, min_qty_wholesale)
values
  ('MH-ACC-001','Luxury Towel Rail','Premium chrome towel rail, 600mm','Accessories','Towel Rail',4200,3500,2900,array[img],false,10),
  ('MH-DIV-001','2-Way Diverter Valve','Smooth diverter for shower and spout control','Diverter and Shower Valve','Diverter Valve',5400,4550,3800,array[img],false,5),
  ('MH-FAU-001','Single Lever Basin Faucet','Premium basin mixer with ceramic disc technology','Faucet','Basin Faucet',4500,3800,3200,array[img],true,5),
  ('MH-FLS-001','Concealed Flush Plate','Dual-flush plate set with premium finish','Flush','Flush Plate',3800,3200,2700,array[img],false,5),
  ('MH-SAN-001','Wall-Hung WC Suite','Rimless wall-hung toilet with concealed cistern','Sanitary Ware','Wall-hung WC',28000,23500,19000,array[img],true,2),
  ('MH-PNL-001','Rainfall Shower Panel','Stainless steel shower panel with jets','Shower Panel','Rainfall Panels',35000,29500,24000,array[img],true,2),
  ('MH-THM-001','Thermostatic Shower Mixer','Steady temperature control with anti-scald','Thermostatic Mixture','Shower Mixer',18500,15600,12900,array[img],true,3),
  ('MH-WHT-001','Instant Water Heater 3kW','3kW instant water heater, ISI marked','Water Heater / Geyser','Instant',4800,4000,3300,array[img],false,5),
  ('MH-WHP-001','Whirpool Bath Tub','Luxury whirlpool tub with hydro-massage jets','Whirpool','Whirpool Tub',145000,122000,108000,array[img],true,1);

end $$;
