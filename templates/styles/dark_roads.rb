
def interpolate(color1,color2,fraction)
     rgb1          = color1.scan(/[0-9a-fA-F]{2}/).map{|x| x.to_i(16)}
     rgb2          = color2.scan(/[0-9a-fA-F]{2}/).map{|x| x.to_i(16)}
     rgb           = rgb1.zip(rgb2).map{|x,y| ((1-fraction)*x + fraction*y).round}
     "#%02x%02x%02x" % rgb.map{|x| x}
end

$map_colors = {

  industrial:  {color:'#ffffff'},
  country:     {color:'#ffffff', outline:'#888888'},
  state:       {color:'#ffffff', outline:'#cccccc'},
  land:        {color:'#ffffff', outline:'#aaaaaa'},
  parking:     {color:'#f0e8e0', outline:'#666666'},   # should be noticably different from 'building'

  tree:        {color:'#143306'},
  park:        {color:'#dadead'},
  grass:       {color:'#d5e2bc'},
  forest:      {color:'#c5d2ac', outline:"#b5c29c"},
  sand:        {color:'#f5e9c6', outline:"#ccaa77"},
  mud:         {color:'#eeddbb', outline:"#ccbb77"},
  military:    {color:'#999999', outline:"#666666"},
  tourism:     {color:'#ddbbff', outline:"#ccaaff"},
  school:      {color:'#ffffcc'},
  water:       {color:'#99b3cc'},
  ferry:       {color:'#7793cc', label:'#5573cc'},
  barrier:     {color:'#888888', label:'#444444', outline:'#cccccc'},

  building:    {color:'#d8d8d0', offset:'#a8a8a0'},
  citycircle:  {color:'#ddcdcd', outline:'#000000', inner:'#000000'},
  footway:     {color:'#7f7f7f'},

  hospital:    {color:'#ebd2cf'},
  pedestrian:  {color:'#aaaaaa'},
  rail:        {color:'#ffffff', outline:'#A5A5A4',symbol:'#A5A5A4'},

  oneway:      {color:'#887755'},

  # The old pallete was based on beige's  like #ddccaa
  # motorway:     {color:'#aa9977', outline:'#ded5c2'},
  # more: http://wiki.openstreetmap.org/wiki/Key:highway
  motorway:     {color: interpolate('#f6dca4','#ffffff',0.0), outline:'#aaaaaa'},
  trunk:        {color: interpolate('#f6dca4','#ffffff',0.1), outline:'#aaaaaa'},
  primary:      {color: interpolate('#f6dca4','#ffffff',0.2), outline:'#aaaaaa'},
  secondary:    {color: interpolate('#f6dca4','#ffffff',0.3), outline:'#aaaaaa'},
  tertiary:     {color: interpolate('#f6dca4','#ffffff',0.4), outline:'#aaaaaa'},
  unclassified: {color: interpolate('#f6dca4','#ffffff',0.5), outline:'#aaaaaa'},
  residential:  {color: interpolate('#f6dca4','#ffffff',0.6), outline:'#aaaaaa'},
  service:      {color: interpolate('#f6dca4','#ffffff',0.7), outline:'#aaaaaa'},
  road:         {color: interpolate('#f6dca4','#ffffff',1.0), outline:'#aaaaaa'},
  living_street:{color: interpolate('#f6dca4','#ffffff',0.7), outline:'#aaaaaa'},
  road_line:    {color:'#aaaaaa'},
  road_label:      {color:'#000000',outline:'#ffe5ad'}, 

  track:       {outline:'#cccccc',symbol:'#ffffff'},
  tunnel:      {outline:'#444444'},

  building_label:  {color:'#000000',outline:'#ffffff'},
  forest_label:    {color:'#888888',outline:'#ffffff'},
  land_label:      {color:'#000000',outline:'#ffffff'},
  place_label:     {color:'#000000',outline:'#ffffff'},
  water_label:     {color:'#444488',outline:'#ffffff'},
  
}

