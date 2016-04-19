# Notes:
#    industrial =  airport, military, railways, brownfield, commercial, cemetary, parking
#    residential = some counties seem to use it, some don't so better to leave as the same as land
#    park = golf course, park, recreation_ground, some cemetaries
#    forest = redundant with some parks in some counties
#    oneway = arrows on one-way roads
#    pedestrian === note that there are some polygons tagged as pedestrian highways
#       road_1	motorway  # major highways
#       road_2	trunk     # oregon expressway, etc
#       road_3	primary   # el camino, alma, hwy 9, etc.
#       road_4	secondary # the inside of smaller roads - Stevenson and all smalll roads.
#       road_5	tertiary  # roads zoomed out so they're just 1px wide

$map_colors = {

  road_label:  {color:'#000000',outline:'#ffffff'},
  land_label:  {color:'#000000',outline:'#ffffff'},
  building_label:  {color:'#000000',outline:'#ffffff'},
  place_label: {color:'#000000',outline:'#ffffff'},
  water_label: {color:'#6B94B0',outline:'#ffffff'},
  forest_label:{color:'#3d6035',outline:'#ffffff'},
  building:    {color:'#aaaaaa', offset:'#444444'},
  footway:     {color:'#7f7f7f'},
  forest:      {color:'#ccdead'},
  grass:       {color:'#dadead'},
  hospital:    {color:'#E6C8C3'},
  industrial:  {color:'#f0f0f0'},
  land:        {color:'#f8f8f8', outline:'#aaaaaa'},
  oneway:      {color:'#9A9ACA'},
  park:        {color:'#B5D29C'},
  pedestrian:  {color:'#FDFDF9'},
  rail:        {color:'#ffffff', outline:'#A5A5A4',symbol:'#A5A5A4'},
  residential: {color:'#f8f8f8'},
  road_1:      {color:'#aa9977', outline:'#444444'},
  road_2:      {color:'#ddccaa', outline:'#888888'},
  road_3:      {color:'#eeddbb', outline:'#eeddbb'},
  road_4:      {color:'#ffeecc', outline:'#b7ac9a'},
  road_5:      {color:'#aaaaaa'},
  school:      {color:'#ffffaa'},
  track:       {outline:'#cec1ad',symbol:'#ffffff'},
  tunnel:      {outline:'#444444'},
  water:       {color:'#99b3cc'},
  citycircle:  {color:'#ddcdcd', outline:'#000000', inner:'#000000'},
  
}
