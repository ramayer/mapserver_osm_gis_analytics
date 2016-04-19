# Notes:
#    industrial =  airport, military, railways, brownfield, commercial, cemetary, parking
#    residential = some counties seem to use it, some don't so better to leave as the same as land
#    park = golf course, park, recreation_ground, some cemetaries
#    forest = redundant with some parks in some counties
#    oneway = arrows on one-way roads
#    pedestrian === note that there are some polygons tagged as pedestrian highways
#       road_1	# major highways
#       road_2	# oregon expressway, etc
#       road_3	# el camino, alma, hwy 9, etc.
#       road_4	# the inside of smaller roads - Stevenson and all smalll roads.
#       road_5	# roads zoomed out so they're just 1px wide


default_label = {color:'#ffffff',outline:'#000000'}
$map_colors = {
  land:            {color:'#111111', outline:'#333333'},
  forest:          {color:'#222222'},
  grass:           {color:'#112211'},
  industrial:      {color:'#111111'},
  residential:     {color:'#111111'},
  park:            {color:'#224422'},

  track:           {outline:'#cccccc',symbol:'#ffffff'},

  building:        {color:'#777777', offset:'#555555'},

  citycircle:      {color:'#ddcdcd', outline:'#000000', inner:'#000000'},
  footway:         {color:'#7f7f7f'},
  hospital:        {color:'#eedddd'},
  oneway:          {color:'#9A9ACA'},
  pedestrian:      {color:'#888888'},
  rail:            {color:'#000000', outline:'#A5A5A4',symbol:'#A5A5A4'},


  road_1:          {color:'#777777', outline:'#888888'},
  road_2:          {color:'#666666', outline:'#888888'},
  road_3:          {color:'#555555', outline:'#888888'},
  road_4:          {color:'#444444', outline:'#888888'},
  road_5:          {color:'#888888'},
  tunnel:          {outline:'#444444'},

  school:          {color:'#222200'},

  water:           {color:'#000033'},

  road_label:      default_label,
  place_label:     default_label,
  water_label:     default_label,
  building_label:  default_label,
  forest_label:    default_label,
  land_label:      default_label,

}

