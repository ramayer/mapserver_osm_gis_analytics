# defaults are subtlecolor

$map_options = {
       building_color:           '#aaaaaa',          # building
       building_label_color:        '#000000',          # building
       building_label_outline_color:'#ffffff',          # building
       building_offset_color:    '#444444',          # building offset
       footway_color:              '#7f7f7f',
       forest_color:		 '#CCDEAD',          # forest
       forest_label_color:       "#3D6035",
       forest_label_outline_color: "#ffffff",        # redundant with some parks
       grass_color:		 '#DADEAD',          # grass
       hospital_color:           '#E6C8C3',          # hospital
       hospital_label_color:      '#000000',
       hospital_label_outline_color: '#ffffff',
       industrial_color:	 '#f0f0f0', 	     # airport, military, railways, brownfield, commercial, cemetary, parking
       land_color_1:		 '#f8f8f8',          # basic polygons
       land_label_color:         '#000000',
       land_label_outline_color: '#ffffff',
       land_outline_color_1:	 '#aaaaaa',	     # state outline
       oneway_color:		 '#9A9ACA',          # the arrows on one-way roads
       park_color:               '#B5D29C',          # golf course, park, recreation_ground, cemetary (other zoom)
       park_label_color:         '#3D6035',          # park labels
       pedestrian_color:          '#FDFDF9',        # includes polygons too
       pedestrian_label_color:    '#000000',
       pedestrian_label_outline_color: '#ffffff',
       rail_color:               '#ffffff',          # rail
       rail_outline_color:       '#A5A5A4',          # rail
       rail_symbol_color:        '#A5A5A4',          # rail
       residential_color:	 '#f8f8f8', 	     # 'residential'    # make this the same as land because some communities don't distinguish
       road_color_1:		 '#aa9977',          # major highways
       road_color_2:		 '#ddccaa',          # oregon expressway, etc
       road_color_3:		 '#eeddbb',          # el camino, alma, hwy 9, etc.
       road_color_4:		 '#ffeecc',          # the inside of smaller roads - Stevenson and all smalll roads.
       road_color_5:		 '#aaaaaa',          # roads zoomed out so they're just 1px wide
       road_label_color:         '#000000',
       road_label_outline_color: '#ffffff',
       road_outline_color_1:	 '#444444',          # road outlines
       road_outline_color_2:	 '#888888',          # road outlines
       road_outline_color_3:	 '#eeddbb',          # road outlines
       road_outline_color_4:	 "#B7AC9A",          # road outlines
       school_color:		 '#ffffaa',          # school, college, university
       school_label_color:        '#000000',
       school_label_outline_color: '#ffffff',
       track_outline_color:       '#cec1ad',
       track_symbol_color:        '#ffffff',
       tunnel_outline_color:       '#444444',
       water_color:		 '#99b3cc',          # water
       water_label_color:	 '#6B94B0',
       water_label_outline_color: '#ffffff',
       place_label_color:         '#000000',
       place_label_outline_color: '#ffffff',
       citycircle_color:          '#ddcdcd',
       citycircle_outline_color:  '#000000',
       citycircle_inner_color:    '#000000',
   }

#TODO:
# consider this as a cleaner approach:
#
# features = {
#   building: {color:'#aaaaaa', offset:'#444444', label:['#000000','#ffffff']},
#   footway:  {color:'#7f7f7f'},
#   forest:   {color:'#ccdead', label:['#3d6035','#ffffff']},
#   
# }  
