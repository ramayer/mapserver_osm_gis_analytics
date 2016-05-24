load File.join(File.dirname(__FILE__), 'dark_roads.rb')


# bing   is fill #e9e6df, road border #ded5c2
# google is fill #e9e5dc, road border #dedad2

land_color = '#e4e0d8'


$map_colors = $map_colors.merge({

  land:        {color:land_color, outline:'#aaaaaa'},   
  industrial:  {color:land_color},
  country:     {color:land_color, outline:'#888888'},
  state:       {color:'#f0f0f0', outline:'#cccccc'},

  road_label:  {color:'#000000', outline:'#ffffff'},

  # more: http://wiki.openstreetmap.org/wiki/Key:highway
  motorway:     {color:'#ffbe65', outline:'#ded5c2'},
  trunk:        {color:'#ffe168', outline:'#ded5c2'},
  primary:      {color:'#ffffee', outline:'#ded5c2'},
  secondary:    {color:'#ffffff', outline:'#ded5c2'},
  tertiary:     {color:'#ffffff', outline:'#ded5c2'},
  unclassified: {color:'#ffffff', outline:'#ded5c2'},
  residential:  {color:'#ffffff', outline:'#ded5c2'},
  service:      {color:'#ffffff', outline:'#ded5c2'},
  road:         {color:'#ffffff', outline:'#ded5c2'},

  road_line:    {color:'#ffffff'},

  oneway:      {color:'#998866'},
})
