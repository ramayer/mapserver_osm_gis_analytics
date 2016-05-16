load File.join(File.dirname(__FILE__), 'white_roads.rb')

$old_map_colors = $map_colors

$new_map_colors = Hash[ $old_map_colors.map{|k0,v0| [k0, Hash[v0.map{|k1,v1| [k1,v1.tr('0123456789abcdef','0123456789abcdef'.reverse)] }] ]}]

$map_colors = $new_map_colors
