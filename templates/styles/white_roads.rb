load File.join(File.dirname(__FILE__), 'subtlecolor.rb')

$map_colors = $map_colors.merge({

  industrial:  {color:'#e9e5dc'},
  country:     {color:'#e9e5dc', outline:'#888888'},
  state:       {color:'#f0f0f0', outline:'#cccccc'},


  # bing   is fill #e9e6df, road border #ded5c2
  # google is fill #e9e5dc, road border #dedad2

  land:        {color:'#e9e5dc', outline:'#aaaaaa'},   

  road_label:  {color:'#000000', outline:'#ffffff'},

  # more: http://wiki.openstreetmap.org/wiki/Key:highway
  motorway:     {color:'#fcd6a4', outline:'#ded5c2'},
  trunk:        {color:'#f6f9be', outline:'#ded5c2'},
  primary:      {color:'#ffffff', outline:'#ded5c2'},
  secondary:    {color:'#ffffff', outline:'#ded5c2'},
  tertiary:     {color:'#ffffff', outline:'#ded5c2'},
  unclassified: {color:'#ffffff', outline:'#ded5c2'},
  residential:  {color:'#ffffff', outline:'#ded5c2'},
  service:      {color:'#ffffff', outline:'#ded5c2'},
  road:         {color:'#ffffff', outline:'#ded5c2'},

  road_line:    {color:'#ffffff'},

  oneway:      {color:'#998866'},
})
