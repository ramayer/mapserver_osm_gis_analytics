load File.join(File.dirname(__FILE__), 'white_roads.rb')

overrides = {
  industrial:  {color:'#f0f0f0'},
  land:        {color:'#f0f0f0', outline:'#aaaaaa'},
  country:     {color:'#f0f0f0', outline:'#888888'},
  state:       {color:'#f0f0f0', outline:'#cccccc'},
  parking:     {color:'#d0d0d0', outline:'#666666'},   # should be noticably darker than 'building'

  park:        {color:'#f0fecd'},
  grass:       {color:'#e5f2cc'},
  forest:      {color:'#f8fff0', outline:"#b5c29c"},
  sand:        {color:'#f8f8f0', outline:"#ccaa77"},
  mud:         {color:'#f8f8f0', outline:"#ccbb77"},
  military:    {color:'#f8f0f0', outline:"#444444"},
  tourism:     {color:'#fff0ff', outline:"#ccaaff"},
  school:      {color:'#fffff0'},
  water:       {color:'#99b3cc'},

  building:    {color:'#d1d0cd', offset:'#8e8d8c'},
  citycircle:  {color:'#ddcdcd', outline:'#000000', inner:'#000000'},

  footway:     {color:'#7f7f7f'},

  hospital:    {color:'#f0f0f0'},
  oneway:      {color:'#ffffff'},
  pedestrian:  {color:'#aaaaaa'},
  rail:        {color:'#ffffff', outline:'#A5A5A4',symbol:'#A5A5A4'},


  building_label:  {color:'#000000',outline:'#ffffff'},
  forest_label:    {color:'#888888',outline:'#ffffff'},
  land_label:      {color:'#000000',outline:'#ffffff'},
  place_label:     {color:'#000000',outline:'#ffffff'},
  water_label:     {color:'#444488',outline:'#ffffff'},
  
}

$map_colors = $map_colors.merge(overrides)

