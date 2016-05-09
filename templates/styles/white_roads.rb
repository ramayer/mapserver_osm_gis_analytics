load File.join(File.dirname(__FILE__), 'subtlecolor.rb')

$map_colors = $map_colors.merge({

  industrial:  {color:'#e9e5dc'},
  country:     {color:'#e9e5dc', outline:'#444444'},
  land:        {color:'#e9e5dc', outline:'#aaaaaa'},
  residential: {color:'#e9e5dc'},

  road_label:  {color:'#000000', outline:'#ffffff'},
  road_1:      {color:'#ffffff', outline:'#776644'},
  road_2:      {color:'#ffffff', outline:'#887755'},
  road_3:      {color:'#ffffff', outline:'#998866'},
  road_4:      {color:'#ffffff', outline:'#aa9977'},
  road_5:      {color:'#ffffff'},
  oneway:      {color:'#998866'},
})
