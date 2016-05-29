var html5_position;

var default_view = { zoom:12, center:[-13606244, 4548015], rotation:0, active_layers:['White Roads'] };

function get_default_map_view_from_url() {
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
    return default_view;
}

function set_map_view_using_geolocation() {
    function showPosition(position) {
	var position_in_3857 = ol.proj.transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857');
	html5_position = position;
	map.getView().setCenter(position_in_3857);
	shouldUpdate = false;
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

if (window.location.hash !== '') {
    default_view = get_default_map_view_from_url();
} else {
    set_map_view_using_geolocation();
}

function layer_should_be_visible(name) {
    return (default_view.active_layers.indexOf(name) >= 0);
}


var layer_json = [];
jQuery.ajax({ url: "./layers.json", success: function(body) { layer_json = body; }, async:false });
var base_layers    = layer_json.filter( function(value) { return value.type=='base' });
var overlay_layers = layer_json.filter( function(value) { return value.type!='base' });
var local_base_layers = base_layers.map( function(item,index){
    console.log("for "+item.desc+" "+ (default_view.active_layers.indexOf(item.desc) >= 0));
    return new ol.layer.Tile({
	preload: Infinity,
	type: 'base',
	title: item.desc,
        visible: layer_should_be_visible(item.desc),
        // Note - without "maxZoom", this fails on Chrome on Windows 10.
        // but works with Firefox everywhere, IE everywhere,
	// Chrome on Windows 7 and Chromium on Linux.  Strange.
	source: new ol.source.XYZ({
	    url: '/mapcache/tms/1.0.0/' + item.name + '@g2/{z}/{x}/{-y}.png',
	    maxZoom: 21,
            attributions: [ol.source.OSM.ATTRIBUTION]

	})
    });
});

var local_overlay_layers = overlay_layers.map( function(item,index){
    return new ol.layer.Tile({
	title: item.desc,
        visible: false,
	source: new ol.source.XYZ({
	    attributions: item.attribution,
	    url: '/mapcache/tms/1.0.0/' + item.name + '@g2/{z}/{x}/{-y}.png',
	}),
    });
});




// Assumes data has fields called 'lat' and 'lon'
function create_layers_from_data(layername,data) {
    var features=[];
    var i = 0;
    data.forEach(function(d) {
        d.lat = +d.lat;
        d.lon = +d.lon;
        if (i > 100000) return;
        onerow=d;
        var d3857 = ol.proj.transform([d.lon,d.lat], 'EPSG:4326', 'EPSG:3857');
        geometry = new ol.geom.Point(d3857);
	feature = new ol.Feature({
	    geometry:geometry,
            data:d
        });
        features.push(feature);
        i += 1;
    });
    var source = new ol.source.Vector({features: features});
    var heatmap = new ol.layer.Heatmap({
        title: 'Heat Map of '+layername,
        visible: false,
        source: source,
        blur: 10,
        radius: 2
    });

    var cluster_source = new ol.source.Cluster({
            distance: 18,
            source: source
    });
    cluster_source.setProperties({size_cache:{}});

      /*
	  OL: 3.16.0
	  Note that the following fails to find the features in the extent:
	      extent = map.getView().calculateExtent(map.getSize());
	      clusters.getSource().getFeaturesInExtent(extent);
	  Manually getting the clusters and comparing
	      clusters.getSource().getFeatures()[0].getGeometry().getExtent();
	  with the extent returns more clusters.
      */    

    var cool_style_function = function(feature,resolution){

        var cluster_props   = cluster_source.getProperties();
        var size_cache      = cluster_props.size_cache;
        var num_of_clusters = cluster_source.getFeatures().length; 
        if (!size_cache[resolution]) {
            console.log("need to set size_cache for "+resolution);
            size_cache[resolution]=1;
        }

        var size = feature.get('features').length;
        var style = [new ol.style.Style({
	    image: new ol.style.Circle({
		radius: 10,
		fill: new ol.style.Fill({
		    color: 'rgba(255, 255, 0, 0.5)',
		}),
		stroke: new ol.style.Stroke({    color: 'rgba(255, 0, 0, 1)',    width: 2 })
	    }),
	    text: new ol.style.Text({
		text: size.toString() + " of " + num_of_clusters,
		fill: textFill,
		textAlign: 'center', 
		textBaseline: 'middle',
		offsetY: 1,
		font: 'bold 12px Arial',
		//stroke: textStroke
	    })
	})];
	return style;
    }

    var clusters = new ol.layer.Vector({
        title: 'Clusters',
        visible: true,
        source: cluster_source,
        style: cool_style_function
    });
    return [clusters,heatmap];
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/// get more features from csv
/// http://zeroviscosity.com/d3-js-step-by-step/step-4-loading-external-data
//
// TODO - try atlas vectors to save RAM on webgl browsers
// # http://openlayers.org/en/v3.16.0/examples/symbol-atlas-webgl.html?q=vector
// OR: https://github.com/openlayers/ol3/issues/5054
//     http://openlayers.org/en/v3.14.2/examples/image-vector-layer.html
//
// TODO - try if even more can load with something like this: http://openlayers.org/en/v3.16.0/examples/dynamic-data.html?q=clear+layer
var onerow = ''
var i = 0;
var lpr_features = [];
var lpr_source = new ol.source.Vector({features: lpr_features});
d3.csv('lpr.csv', function(error, dataset) {
    dataset.forEach(function(d) {
        d.lat = +d.lat;
        d.lon = +d.lon;
        if (i > 100000) return;
        onerow=d;
        var d3857 = ol.proj.transform([d.lon,d.lat], 'EPSG:4326', 'EPSG:3857');
        geometry = new ol.geom.Point(d3857);
	feature = new ol.Feature({
	    geometry:geometry,
            data:d
        });
        i += 1;
        lpr_features.push(feature);
    });
    lpr_source = new ol.source.Vector({features: lpr_features});
    heatmap.setSource(lpr_source);
    clusters.setSource(new ol.source.Cluster({ distance: 16, source:lpr_source}));
    // atlasvector.changed();
    heatmap.changed();
    map.render();
});

////////////////////////////////////////////////////////////////////////////////
// Heatmap
////////////////////////////////////////////////////////////////////////////////
var heatmap = new ol.layer.Heatmap({
    title: 'Heat Map',
    visible: false,
    source: new ol.source.Vector({features: lpr_features}),
    blur: 10,
    radius: 2
});

////////////////////////////////////////////////////////////////////////////////
// Clusters
////////////////////////////////////////////////////////////////////////////////

var earthquakeStroke = new ol.style.Stroke({color: 'rgba(255, 0, 0, 0.9)',width: 1});
var textFill = new ol.style.Fill({
    color: '#000'
});
var textStroke = new ol.style.Stroke({
    color: 'rgba(255, 255, 255, 0.6)',
    width: 2
});
var invisibleFill = new ol.style.Fill({
    color: 'rgba(255, 0, 0, 1.00)'
});

function createEarthquakeStyle(feature) {
    var name = feature.get('name');
    return new ol.style.Style({
	geometry: feature.getGeometry(),
	image: new ol.style.RegularShape({
	    radius1: 7,
	    radius2: 3,
	    points: 5,
	    angle: Math.PI,
	    fill: new ol.style.Fill({ color: 'rgba(255, 255, 0, 0.8)'}),
	    stroke: earthquakeStroke
	})
    });
}

function nicecolor(num,maxFeatureCount) {
    var opacity = 0.8;
    if (num >= maxFeatureCount / 2) {
	var brightness = 1 - (2.0 * num / maxFeatureCount - 1.0);
	return [127 + 127 * brightness, 0,  0,opacity];
    } else {
	var brightness = 1 - (num / maxFeatureCount * 2);
	return [255, 255*brightness,  0,opacity];
    }
    // their demo had:
    // [255, 153, 0, Math.min(0.8, 0.4 + (size / maxFeatureCount))]
    if      (num < 3.3)  {return [255,255,  0,opacity];}   // "#ffff00"
    else if (num < 10)   {return [255,191,  0,opacity];}   // "#ffcc00"
    else if (num < 33)   {return [255,127,  0,opacity];}   // "#ff8800"
    else if (num < 100)  {return [255, 63,  0,opacity];}   // "#ff4400"
    else if (num < 333)  {return [255,  0,  0,opacity];}   // "#ff0000"
    else if (num < 1000) {return [191,  0,  0,opacity];}   // "#cc0000"
    else if (num < 3333) {return [ 63,  0,  0,opacity];}   // "#880000"
    else                 {return [255,255,255,opacity];} // "#880000"
}

function clustersize(num) {
    if (num < 2) {return 2;}
    return Math.log(num)/Math.log(2) + 5;
}


var maxFeatureCount;
function calculateClusterInfo(resolution) {
    maxFeatureCount = 0;
    var features = clusters.getSource().getFeatures();
    var feature, radius, color;
    for (var i = features.length - 1; i >= 0; --i) {
	var feature = features[i];
	var origFeatures = feature.get('features');
	maxFeatureCount = Math.max(maxFeatureCount, origFeatures.length)
    }
    for (var i = features.length - 1; i >= 0; --i) {
	feature = features[i];
	var originalFeatures = feature.get('features');
	var extent = ol.extent.createEmpty();
	for (var j = 0, jj = originalFeatures.length; j < jj; ++j) {
	    ol.extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
	}
	radius = clustersize(originalFeatures.length);
	feature.set('radius', radius);
	color = nicecolor(originalFeatures.length,maxFeatureCount);
	feature.set('color', color);
    }
}
var debugfeature = '';
var currentResolution;
function styleFunction(feature, resolution) {
    debugfeature = feature;
    if (resolution != currentResolution) {
	calculateClusterInfo(resolution);
	currentResolution = resolution;
    }
    var style;
    var size = feature.get('features').length;
    if (size > 1) {
	style = [new ol.style.Style({
	    image: new ol.style.Circle({
		radius: feature.get('radius'),
		fill: new ol.style.Fill({
		    color: feature.get('color')
		}),
		stroke: earthquakeStroke
	    }),
	    text: new ol.style.Text({
		text: size.toString(),
		fill: textFill,
		textAlign: 'center', 
		textBaseline: 'middle',
		offsetY: 1,
		font: 'bold 12px Arial',
		//stroke: textStroke
	    })
	})];
    } else {
	var originalFeature = feature.get('features')[0];
	style = [createEarthquakeStyle(originalFeature)];
    }
    return style;
}

function selectStyleFunction(feature, resolution) {
    var styles = [new ol.style.Style({
	image: new ol.style.Circle({
	    radius: feature.get('radius'),
	    fill: invisibleFill
	})
    })];
    var originalFeatures = feature.get('features');
    var originalFeature;
    for (var i = originalFeatures.length - 1; i >= 0; --i) {
	originalFeature = originalFeatures[i];
	styles.push(createEarthquakeStyle(originalFeature));
    }
    return styles;
}

var clusters = new ol.layer.Vector({
    title: 'Clusters',
    visible: false,
    source: new ol.source.Cluster({
	distance: 18,
	source: new ol.source.Vector({features: lpr_features}),
    }),
    style: styleFunction
});
////////////////////////////////////////////////////////////////////////////////

// The parallel tile loading test assumes your servers are named something like 'map1.example.com'
var parallel_server_1 = location.hostname.replace('1','1');
var parallel_server_2 = location.hostname.replace('1','2');
var parallel_server_3 = location.hostname.replace('1','3');
var parallel_server_4 = location.hostname.replace('1','4');

var external_base_layers = [

    // http://www.acuriousanimal.com/thebookofopenlayers3/chapter02_04_image_layer.html
    new ol.layer.Image({
	opacity: 0.75,
  	type: 'base',
	title: 'test image layer',
        visible: false,
	source: new ol.source.ImageStatic({
	    attributions: [
		new ol.Attribution({
		    html: '&copy; <a href="https://www.lib.utexas.edu/maps/historical/">University of Texas Libraries</a>'
		})
	    ],
	    url: 'https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
	    imageSize: [691, 541],
	    projection: ol.proj.get('EPSG:3857'), // map.getView().getProjection(),
	    imageExtent: ol.extent.applyTransform([-74.22655, 40.71222, -74.12544, 40.77394], ol.proj.getTransform("EPSG:4326", "EPSG:3857"))
	})
    }),

    new ol.layer.Tile({
	preload: Infinity,
	type: 'base',
	title: "test parallel loading",
        visible: false,
	source: new ol.source.XYZ({
	    urls: [
		'http://'+parallel_server_1+'/mapcache/tms/1.0.0/black_on_white@g2/{z}/{x}/{-y}.png',
		'http://'+parallel_server_2+'/mapcache/tms/1.0.0/white_on_black@g2/{z}/{x}/{-y}.png',
		'http://'+parallel_server_3+'/mapcache/tms/1.0.0/dark_roads@g2/{z}/{x}/{-y}.png',
  		'http://'+parallel_server_4+'/mapcache/tms/1.0.0/white_roads@g2/{z}/{x}/{-y}.png'
	    ]
	}),
    }),




    new ol.layer.Tile({
        title: 'Stamen Watercolor',
        type: 'base',
        visible: false,
        source: new ol.source.Stamen({
            layer: 'watercolor'
        })
    }),
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


var external_overlays = [heatmap,clusters,
			 // Consider:
			 // "tile_map_edge_buffer" "256"  
			 // in the .map file instead of a gutter here.
			 // If we do that, we need to use mode=tile, and send
			 // tile requests instead.
			 new ol.layer.Tile({
			     preload: Infinity,
			     title: 'Uncached user-generated layers',
			     visible: false,
 		             source: new ol.source.TileWMS({
		                 gutter: 200,
				 url: '/mapserv/user_layers',
				 params: {
		                     'VERSION': '1.1.1',
		                     'features': '1,2,3',
		                     'userid': '1',
		                     'session': '1',
		                     'LAYERS': 'default'
                                 }
			     })
			 }),
			 new ol.layer.Tile({
                             title: 'State Overlay',
                             visible: false,
                             source: new ol.source.TileWMS({
				 url: 'http://demo.opengeo.org/geoserver/wms',
				 params: {'LAYERS': 'ne:ne_10m_admin_1_states_provinces_lines_shp'},
				 serverType: 'geoserver'
                             })
			 })
			];

var all_base_layers = local_base_layers.concat(external_base_layers);
var all_overlay_layers = local_overlay_layers.concat(external_overlays);

var layers = [
    new ol.layer.Group({
        'title': 'Base maps',
        layers: all_base_layers
    }),
    new ol.layer.Group({
        title: 'Overlays',
        layers: all_overlay_layers
    })
];

var attribution = new ol.control.Attribution({
    collapsed: false
});


var map = new ol.Map({
    layers: layers,
    target: 'map',
    //  renderer: 'webgl',  faster, but heatmap fails
    view: new ol.View({
	center: default_view.center,
        zoom: default_view.zoom,
        rotation: default_view.rotation
    }),
    controls: ol.control.defaults({attribution: false}).extend([attribution])
});


var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    undefinedHTML: '&nbsp;'
});
map.addControl(mousePositionControl);



var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: 'Légende' // Optional label for button
});
map.addControl(layerSwitcher);


var scaleline = new ol.control.ScaleLine();
map.addControl(scaleline);


function forEachLayerRecursively(layergroup,f) {
    layergroup.forEach(function(lg){
        if (lg.getLayers) {
            forEachLayerRecursively(lg.getLayers(),f);
        } else {
            f(lg);
        }
    })
}



var shouldUpdate = true;
var view = map.getView();
var updatePermalink = function() {
    if (!shouldUpdate) {
        // do not update the URL when the view was changed in the 'popstate' handler
        shouldUpdate = true;
        return;
    }
    var center = view.getCenter();
    // save visible layers
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
    window.history.pushState(state, 'map', hash);
};

map.on('moveend', updatePermalink);
all_base_layers.forEach(function(l) {
    l.on('change:visible',updatePermalink);
});
all_overlay_layers.forEach(function(l) {
    l.on('change:visible',updatePermalink);
});

// restore the view state when navigating through the history, see
// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
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

// http://openlayers.org/en/latest/examples/popup.html?q=popup		       
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

function query_osm_data(evt) {
    var coordinate = evt.coordinate;
    var crd4326 = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    var hdms = ol.coordinate.toStringXY(crd4326,4);


    message = '<b>Data from Open Street Map at '+hdms+'</b><hr>';
    content.innerHTML = message + "<br>...loading...</br>";
    $.get('/map_data?q='+crd4326[0]+','+crd4326[1],function(data) { $("#popup-content").html(message + data)});
    overlay.setPosition(coordinate);
}
// If someone clicked on an overlay, they want information on the overlay,
// so moving this to the selectInteraction instead.
// map.on('singleclick', query_osm_data);

// interesting select examples
// https://openlayersbook.github.io/ch08-interacting-with-your-map/example-02.html
var debug_select='';

var selectEuropa = new ol.style.Style({
    stroke: new ol.style.Stroke({
	color: '#ff0000',
	width: 2
    })
});


var selectInteraction = new ol.interaction.Select({
    /*
      layers: function (layer) {
      debug_select=layer;
      return layer.get('id') == 'europa';
      },
    */
});
map.getInteractions().extend([selectInteraction]);
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

var infoBox = document.getElementById('popup-content');

dragBox.on('boxend', function() {
    // features that intersect the box are added to the collection of
    // selected features, and their names are displayed in the "info"
    // div
    var info = [];
    var extent = dragBox.getGeometry().getExtent();
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
    selectedFeatures.clear();
    infoBox.innerHTML = '&nbsp;';
});
map.on('click', function() {
    selectedFeatures.clear();
    infoBox.innerHTML = '&nbsp;';
});


var more_layers = create_layers_from_data('dynamically_added',[{lat:37,lon:-123},{lat:38,lon:-120}]);
map.addLayer(more_layers[0]);
