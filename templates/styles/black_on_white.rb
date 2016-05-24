# defaults are dark_roads                                                                                                                                                      


  def interpolate(color1,color2,fraction)
     rgb1          = color1.scan(/[0-9a-fA-F]{2}/).map{|x| x.to_i(16)}
     rgb2          = color2.scan(/[0-9a-fA-F]{2}/).map{|x| x.to_i(16)}
     rgb           = rgb1.zip(rgb2).map{|x,y| ((1-fraction)*x + fraction*y).round}
     "#%02x%02x%02x" % rgb.map{|x| x}
  end


land_color = '#e8e8e8'
road_outline = '#909090'

$map_colors = {

  water:       {color:'#ffffff'},
  industrial:  {color:land_color},
  country:     {color:land_color, outline:'#888888'},
  state:       {color:land_color, outline:'#cccccc'},
  land:        {color:land_color, outline:'#aaaaaa'},

  parking:     {color:'#e8e8e8', outline:'#666666'},   # should be noticably different from 'building'

  park:        {color:'#e8e8e8'},
  grass:       {color:'#e8e8e8'},
  forest:      {color:'#e8e8e8', outline:"#e0e0e0"},
  sand:        {color:'#e8e8e8', outline:"#e0e0e0"},
  mud:         {color:'#e8e8e8', outline:"#e0e0e0"},
  military:    {color:'#e8e8e8', outline:"#e0e0e0"},
  tourism:     {color:'#e8e8e8', outline:"#e0e0e0"},
  school:      {color:'#e8e8e8'},

  ferry:       {color:'#808080', label:'#808080'},
  barrier:     {color:'#808080', label:'#808080', outline:'#808080'},
  tree:        {color:'#808080'},

  building:    {color:'#dddddd', offset:'#cccccc'},
  citycircle:  {color:'#808080', outline:'#ffffff', inner:'#808080'},
  footway:     {color:'#808080'},

  hospital:    {color:'#808080'},
  pedestrian:  {color:'#808080'},
  rail:        {color:'#808080', outline:'#ffffff',symbol:'#808080'},

  oneway:      {color:'#c0c0c0'},

  motorway:     {color: interpolate('#ffffff','#ffffff',0.0), outline:road_outline},
  trunk:        {color: interpolate('#ffffff','#ffffff',0.1), outline:road_outline},
  primary:      {color: interpolate('#ffffff','#ffffff',0.2), outline:road_outline},
  secondary:    {color: interpolate('#ffffff','#ffffff',0.3), outline:road_outline},
  tertiary:     {color: interpolate('#ffffff','#ffffff',0.4), outline:road_outline},
  unclassified: {color: interpolate('#ffffff','#ffffff',0.5), outline:road_outline},
  residential:  {color: interpolate('#ffffff','#ffffff',0.6), outline:road_outline},
  service:      {color: interpolate('#ffffff','#ffffff',0.7), outline:road_outline},
  road:         {color: interpolate('#ffffff','#ffffff',1.0), outline:road_outline},
  road_line:    {color:'#808080'},
  road_label:      {color:'#000000',outline:'#ffffff'}, 

  track:       {outline:'#ffffff',symbol:'#808080'},
  tunnel:      {outline:'road_outline'},

  building_label:  {color:'#000000',outline:'#ffffff'},
  forest_label:    {color:'#000000',outline:'#ffffff'},
  land_label:      {color:'#000000',outline:'#ffffff'},
  place_label:     {color:'#000000',outline:'#ffffff'},
  water_label:     {color:'#000000',outline:'#ffffff'},
  
}

