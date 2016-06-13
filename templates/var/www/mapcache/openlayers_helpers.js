var geolocation_position; // a convenient global variable.

/*
** A convenience function to walk through each layer on the map
** recursively, descending through LayerGroups.
*/
function forEachLayerRecursively(layergroup,f) {
    layergroup.forEach(function(lg){
        if (lg.getLayers) {
            forEachLayerRecursively(lg.getLayers(),f);
        } else {
            f(lg);
        }
    })
}

function set_map_view_using_geolocation() {
    function showPosition(position) {
	var position_in_3857 = ol.proj.transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857');
	geolocation_position = position;
	shouldUpdate         = false;
	map.getView().setCenter(position_in_3857);
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function get_layer_group_by_title(map,title) {
   return map.getLayers().getArray().find(function(l) {return l.get('title') == title});
}

function get_default_map_view() {
    var hash = window.location.hash.replace('#map=', '');
    var parts = hash.split('/');
    var zoom, center, rotation;
    if (parts.length === 5) {
        var zoom = parseInt(parts[0], 10);
        var center = [parseFloat(parts[1]),parseFloat(parts[2])];
        var rotation = parseFloat(parts[3]);
        var active_layers = JSON.parse(decodeURI(parts[4]));
        var view = { zoom:zoom, center:center, rotation:rotation, active_layers:active_layers}
        return view;
    }
    default_view = { zoom:12, center:[-13606244, 4548015], rotation:0, active_layers:['white_roads'] };
    set_map_view_using_geolocation();
    return default_view;
}

var default_view = get_default_map_view();


/*
** Make map layers visible if the layer's name is in a list of names specified by
** the URL parameters.
*/
function layer_should_be_visible(name) {
    return (default_view.active_layers.indexOf(name) >= 0);
}


/*
** Updates the URL so it can act as a permalink, and so the back
** button can restore the view state when navigating through the
** history.    Similar to the openlayers3 permalink example, and
** https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
*/
var debugevt = ''
var shouldUpdate = true;
var updatePermalink = function(evt) {

    debugevt = evt;
    // console.log("updatePermalink: "+JSON.stringify(evt));
    console.log("updatePermalink: "+evt.type);


    var view = map.getView();
    if (!shouldUpdate) {
        // do not update the URL when the view was changed in the 'popstate' handler
        shouldUpdate = true;
        return;
    }
    var center = view.getCenter();
    var active_layer_names=[];
    forEachLayerRecursively(map.getLayers(),function(lg){
        var props = lg.getProperties();
        if (props.visible) {
            active_layer_names.push(props.title);
        }
    });
    var active_layer_string = JSON.stringify(active_layer_names);
    var hash = '#map=' +
        view.getZoom() + '/' +
        Math.round(center[0] * 100) / 100 + '/' +
        Math.round(center[1] * 100) / 100 + '/' +
        view.getRotation()+'/'+
        encodeURI(active_layer_string);

    var state = {
        zoom: view.getZoom(),
        center: view.getCenter(),
        rotation: view.getRotation(),
        active_layers: active_layer_names
    };

   // Seems more people expect the back button to not go through
   // map interactions.   Perhaps it should happen conditionally
   // with just certain interactions?

    // window.history.pushState(state, 'map', hash);
    window.history.replaceState(state, 'map', hash);

};


/***********************************************************************
** OpenLayers is rather verbose when it comes to adding layers, 
** having to define both a Tile Source and a Tile Layer separetly.
**
** This gets extra burdensome when you want to add callbacks
** to each layer, for example, to update the browser's history
** when layers are eanbled and disabled.
**
** This wrapper makes it more convenient to create a tile source and
** tile layer with some convenient callbacks.
**
** Note - without "maxZoom" or "opaque", this fails on Chrome on
** Windows 10.  But works with Firefox everywhere and IE everywhere,
** and works on Chrome on Windows 7 and Chromium on Linux.  Strange.
** For overlay layers, 'opaque' is a lie; but Chrome on Windows 10
** will draw the layers incorrectly if 'opaque' is not specified.
***********************************************************************/

function debugevent(e){
 console.log(e);
}


function make_simple_tile_layer(properties) {
    var url = properties.url || ('/mapcache/tms/1.0.0/' + properties.name + '@g2/{z}/{x}/{-y}.png');
    var source = new ol.source.XYZ({
	maxZoom: 21,
	crossOrigin: 'anonymous',
	opaque: true,
	url: url,
        attributions: properties.attribution
    });
    var layer = new ol.layer.Tile({
	title: properties.desc,
	type: properties.type,
        visible: layer_should_be_visible(properties.desc),
	preload: Infinity,
	source: source
    });
    // layer.on('change:visible',updatePermalink);
    return layer;
}

////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////
// Useful sytles, colors, strokes, and fills
////////////////////////////////////////////////////////////////////////////////
var redStroke = new ol.style.Stroke({color: 'rgba(255, 0, 0, 0.9)',width: 1});
var textFill = new ol.style.Fill({color: '#000'});
var textStroke = new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.6)',  width: 2 });
var invisibleFill = new ol.style.Fill({ color: 'rgba(255, 0, 0, 1.00)'});

function nicecolor(num,maxFeatureCount) {
    var opacity = 0.8;
    if (num >= maxFeatureCount / 2) {
	var brightness = 1 - (2.0 * num / maxFeatureCount - 1.0);
	return [127 + 127 * brightness, 0,  0,opacity];
    } else {
	var brightness = 1 - (num / maxFeatureCount * 2);
	return [255, 255*brightness,  0,opacity];
    }
    // an interesting alternative is: 
    // [255, 153, 0, Math.min(0.8, 0.4 + (size / maxFeatureCount))]
    if      (num < 3.3)  {return [255,255,  0,opacity];}   // "#ffff00"
    else if (num < 10)   {return [255,191,  0,opacity];}   // "#ffcc00"
    else if (num < 33)   {return [255,127,  0,opacity];}   // "#ff8800"
    else if (num < 100)  {return [255, 63,  0,opacity];}   // "#ff4400"
    else if (num < 333)  {return [255,  0,  0,opacity];}   // "#ff0000"
    else if (num < 1000) {return [191,  0,  0,opacity];}   // "#cc0000"
    else if (num < 3333) {return [ 63,  0,  0,opacity];}   // "#880000"
    else                 {return [255,255,255,opacity];}   // "#880000"
}

function niceradius(num) {
    if (num < 2) {return 5;}
    if (num > 1000) {return Math.log(1000)/Math.log(2) + 5;}
    return Math.log(num)/Math.log(2) + 5;
}

function interestingClusterStyle(numFeatures,maxFeatureCount) {
        var color = nicecolor(numFeatures,maxFeatureCount);
        var radius = niceradius(numFeatures);
        var style = [new ol.style.Style({
	    image: new ol.style.Circle({
		radius: radius,
		fill: new ol.style.Fill({
		    color: color
		}),
		stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 1)', width: 1 })
	    }),
	    text: new ol.style.Text({
		text: numFeatures.toString(),
		fill: textFill,
		textAlign: 'center', 
		textBaseline: 'middle',
		offsetY: 1,
		font: 'bold 11px Arial'
		// ,
		//stroke: textStroke
	    })
	})];
	return style;
}

////////////////////////////////////////////////////////////////////////////////


var vectorSource; // for drag box example below

var debug_data = "";

// Assumes data has fields called 'lat' and 'lon'
//       300,000 1.5G after restart; 1.746 after zoomed in.


function create_layers_from_data(layername,data) {
    var features=[];
    var i = 0;

    data.forEach(function(d) {
        d.lat = +d.lat;
        d.lon = +d.lon;
        if (i > 10000) return; // avoid killing browsers - this can make firefox bloat to 2.5 GB.
        var d3857 = ol.proj.transform([d.lon,d.lat], 'EPSG:4326', 'EPSG:3857');
        geometry = new ol.geom.Point(d3857);
	feature = new ol.Feature({
	    geometry:geometry,
            data:d
        });
        feature.set('name',d['red_VRM']);
        features.push(feature);
        i += 1;
    });

    console.log("trying "+features.length+" features");
    var source = new ol.source.Vector({features: features});
    vectorSource = source;
    var heatmap = new ol.layer.Heatmap({
        title: 'Heat Map of '+layername,
        visible: layer_should_be_visible('Heat Map of '+layername),
        source: source,
        blur: 10,
        radius: 2
    });
    // heatmap.changed();  // TODO - look up why the example needed this 
    var cluster_source = new ol.source.Cluster({
            distance: 24,
            source: source
    });
    cluster_source.setProperties({style_caches:{}});

    var cool_style_function = function(feature,resolution){
        var cluster_props   = cluster_source.getProperties();
        var style_caches    = cluster_props.style_caches;
        var style_cache     = style_caches[resolution];
        if (!style_cache) {
            console.log("need to set style_cache for "+resolution);
            var features = cluster_source.getFeatures();
            var maxFeatureCount = 0;
            features.forEach(function(f) {
              var origFeatures = f.get('features');
              maxFeatureCount = Math.max(maxFeatureCount, origFeatures.length);
            });
            style_cache = {
                maxFeatureCount: maxFeatureCount,
                styles: {}
            };
            style_caches[resolution] = style_cache;
        }
        var maxFeatureCount = style_cache.maxFeatureCount;
        var numFeatures = feature.get('features').length;
        var style = interestingClusterStyle(numFeatures,maxFeatureCount);
	return style;
    }

    var clusters = new ol.layer.Vector({
        title: 'Clusters of '+layername,
        visible: layer_should_be_visible('Clusters of '+layername),
        source: cluster_source,
        style: cool_style_function
    });

    // clusters.on('change:visible',updatePermalink);
    // heatmap.on('change:visible',updatePermalink);

    return [clusters,heatmap];
}




////////////////////////////////////////////////////////////////////////////////



var layers = [
    new ol.layer.Group({'title': 'Base Maps'}),
    new ol.layer.Group({title: 'Overlays'})
];

layers.forEach(function(lg){ lg.on('change', updatePermalink); })



// Consider: 
//     renderer: 'webgl'  //  faster, but the heatmap fails
var map = new ol.Map({
    layers: layers,
    target: 'map',
    view: new ol.View({
	center: default_view.center,
        zoom: default_view.zoom,
        rotation: default_view.rotation
    }),
    controls: ol.control.defaults({attributionOptions: {collapsed:false}})
});


var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    undefinedHTML: '&nbsp;'
});
map.addControl(mousePositionControl);


var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);

var scaleline = new ol.control.ScaleLine();
map.addControl(scaleline);
map.on('moveend', updatePermalink);



/*
all_base_layers.forEach(function(l) {
    l.on('change:visible',updatePermalink);
});
all_overlay_layers.forEach(function(l) {
    l.on('change:visible',updatePermalink);
});
*/
window.addEventListener('popstate', function(event) {
    if (event.state === null) {
        return;
    }
    map.getView().setCenter(event.state.center);
    map.getView().setZoom(event.state.zoom);
    map.getView().setRotation(event.state.rotation);

    // TODO - restore active layers

    shouldUpdate = false;
});


////////////////////////////////////////////////////////////////////////////////
// Map Overlay.
// based on http://openlayers.org/en/latest/examples/popup.html?q=popup		       
////////////////////////////////////////////////////////////////////////////////

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
    element: container,
    autoPan: true,
    autoPanAnimation: {
	duration: 250
    }
}));
map.addOverlay(overlay);
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

////////////////////////////////////////////////////////////////////////////////


function query_osm_data(evt) {
    var coordinate = evt.coordinate;
    var crd4326 = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    var hdms = ol.coordinate.toStringXY(crd4326,4);

    message = '<b>Data from Open Street Map at '+hdms+'</b><hr>';
    content.innerHTML = message + "<br>...loading...</br>";
    $.get('/map_data?q='+crd4326[0]+','+crd4326[1],function(data) { $("#popup-content").html(message + data)});
    overlay.setPosition(coordinate);
}
// If someone clicked on an overlay or something else selectable,
// they probably want information on the thing that was selected.
// So moving this to the selectInteraction instead.
// map.on('singleclick', query_osm_data);
// interesting select examples
// https://openlayersbook.github.io/ch08-interacting-with-your-map/example-02.html
var debug_select='';


var selectInteraction = new ol.interaction.Select({});
map.addInteraction(selectInteraction);  // map.getInteractions().extend([selectInteraction]);

selectInteraction.on('select', function(e) {
    // document.getElementById('status').innerHTML = '&nbsp;
    var selected_features = e.target.getFeatures().getArray();
    if (selected_features.length == 1) {
	var selected_feature = selected_features[0];
	debug_select = selected_feature;
	overlay.setPosition(selected_feature.getGeometry().getCoordinates());
	var features = selected_feature.getProperties().features;
	if (features) { 
	    var s = (features.length == 1) ? "" : "s";
	    var popup_text = "<b>"+features.length+" license plate"+s+" seen in this cluster</b>";
	    features.forEach(function(d) {
		data = d.getProperties().data;
		popup_text += "<br>"+data['red_VRM']+" at "+data['red_Timestamp'];;
	    });
	    $("#popup-content").html(popup_text)
	}
    }
    if (selected_features.length == 0) {
      	query_osm_data(e.mapBrowserEvent);
    }
});
var selectedFeatures = selectInteraction.getFeatures();

// http://openlayers.org/en/v3.2.0/examples/box-selection.js
// a DragBox interaction used to select features by drawing boxes

var dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly
});
map.addInteraction(dragBox);
dragBox.on('boxend', function() {
    var infoBox = document.getElementById('popup-content');
    // features that intersect the box are added to the collection of
    // selected features
    var info = [];
    var extent = dragBox.getGeometry().getExtent();
    // TODO --- identify which sources are selectable.
    vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
	selectedFeatures.push(feature);
	info.push(feature.get('name'));
    });
    if (info.length > 0) {
	infoBox.innerHTML = info.join(', ');
    }
});

// clear selection when drawing a new box and when clicking on the map
dragBox.on('boxstart', function() {
    var infoBox = document.getElementById('popup-content');
    selectedFeatures.clear();
    infoBox.innerHTML = '&nbsp;';
});
map.on('click', function() {
    var infoBox = document.getElementById('popup-content');
    selectedFeatures.clear();
    infoBox.innerHTML = '&nbsp;';
});



////////////////////////////////////////////////////////////////////////////////


var more_base_layers = [
    new ol.layer.Tile({
        title: 'OSM',
        type: 'base',
        visible: false,
        source: new ol.source.OSM()
    }),
    new ol.layer.Tile({
        title: 'Old OSM Data',
        visible: false,
        type: 'base',
        source: new ol.source.TileWMS({
            url: 'https://go.leapportal.us/tilecache/tilecache.cgi',
            params: {'LAYERS': 'subtlecolor'} //,
            // serverType: 'geoserver'
        })
    }),
    new ol.layer.Tile({
	preload: Infinity,
	type: 'base',
	title: 'composited wms layer',
	visible: false,
	source: new ol.source.TileWMS({
	    url: '/mapcache/',
	    params: {
		'VERSION': '1.1.1',
		'LAYERS': 'dark_roads,opd_lpr,opd_beats'
            }
	})
    }),
    new ol.layer.Tile({
        title: 'Satellite',
        type: 'base',
        visible: false,
        source: new ol.source.MapQuest({layer: 'sat'})
    })
];

function add_layer_to_layergroup_by_type(map,lgname,layer) {
    var layertype = layer.getProperties().type;
    var lgname = (layertype == 'base') ? 'Base Maps' :
                 (layertype == 'overlay') ? 'Overlays' :
                 'Other';
    var lg = get_layer_group_by_title(map,lgname);
    lg.getLayers().push(l);
}

var external_overlays = [
			 // Consider:
			 // "tile_map_edge_buffer" "256"  
			 // in the .map file instead of a gutter here.
			 // If we do that, we need to use mode=tile, and send
			 // tile requests instead.
			 new ol.layer.Tile({
			     preload: Infinity,
			     title: 'Uncached user-generated layers',
			     visible: layer_should_be_visible('Uncached user-generated layers'),
 		             source: new ol.source.TileWMS({
		                 gutter: 200,
				 url: '/mapserv/user_layers',
				 params: {
		                     'VERSION': '1.1.1',
		                     'features': '1,2,3',
		                     'highlights': '-1',
		                     'userid': '1',
		                     'session': '1',
		                     'LAYERS': 'default'
                                 }
			     })
			 })
			];

