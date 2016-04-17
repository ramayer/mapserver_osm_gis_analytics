# defaults are subtlecolor                                                                                                                                                      

$map_colors = {

  building:    {color:'#888888', offset:'#444444'},
  building_label:  {color:'#000000',outline:'#ffffff'},
  citycircle:  {color:'#ddcdcd', outline:'#000000', inner:'#000000'},
  footway:     {color:'#7f7f7f'},
  forest:      {color:'#f8f8f8'},
  forest_label:{color:'#888888',outline:'#ffffff'},
  grass:       {color:'#f8f8f8'},
  hospital:    {color:'#eedddd'},
  industrial:  {color:'#f8f8f8'},
  land:        {color:'#f8f8f8', outline:'#aaaaaa'},
  land_label:  {color:'#000000',outline:'#ffffff'},
  oneway:      {color:'#9A9ACA'},
  park:        {color:'#B5D29C'},
  pedestrian:  {color:'#888888'},
  place_label: {color:'#000000',outline:'#ffffff'},
  rail:        {color:'#ffffff', outline:'#A5A5A4',symbol:'#A5A5A4'},
  residential: {color:'#f8f8f8'},
  road_1:      {color:'#cccccc', outline:'#888888'},
  road_2:      {color:'#bbbbbb', outline:'#888888'},
  road_3:      {color:'#aaaaaa', outline:'#888888'},
  road_4:      {color:'#999999', outline:'#888888'},
  road_5:      {color:'#888888'},
  road_label:  {color:'#000000',outline:'#ffffff'},
  school:      {color:'#ffffcc'},
  track:       {outline:'#cccccc',symbol:'#ffffff'},
  tunnel:      {outline:'#444444'},
  water:       {color:'#99b3cc'},
  water_label: {color:'#6B94B0',outline:'#ffffff'},
  
}



$map_options = {
       building_color:           '#888888',          # building
       building_offset_color:    '#444444',          # building offset
       forest_color:		 '#f8f8f8',          # forest
       grass_color:		 '#f8f8f8',          # grass  (but in Mantica it includes random subsets of farms
       hospital_color:           '#eedddd',          # hospital
       industrial_color:	 '#f8f8f8', 	     # airport, military, railways, brownfield, commercial, cemetary, parking
       land_color_1:		 '#eeeeee',          # basic polygons
       land_outline_color_1:	 '#aaaaaa',	     # state outline
       oneway_color:		 '#9A9ACA',          # the arrows on one-way roads
       park_color:               '#cceebb',          # golf course, park, recreation_ground, cemetary (other zoom)
       park_label_color:         '#000000',          # park labels
       rail_color:               '#ffffff',          # rail
       rail_outline_color:       '#A5A5A4',          # rail
       rail_symbol_color:        '#A5A5A4',          # rail
       residential_color:	 '#f8f8f8', 	     # 'residential'    # make this the same as land because some communities don't distinguish
       road_color_1:		 '#888888',          # major highways
       road_color_2:		 '#777777',          # oregon expressway, etc
       road_color_3:		 '#666666',          # el camino, alma, hwy 9, etc.
       road_color_4:		 '#555555',          # the inside of smaller roads - Stevenson and all smalll roads.
       road_color_5:		 '#444444',          # roads zoomed out so they're just 1px wide
       road_label_color:         '#000000',
       road_label_outline_color: '#ffffff',
       road_outline_color_1:	 '#444444',          # road outlines
       road_outline_color_3:	 '#eeddbb',          # road outlines
       school_color:		 '#ffffcc',          # school, college, university
       water_color:		 '#99b3cc',          # water

}
