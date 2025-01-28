
// Region of Interest (ROI)
var ROI_FC = ee.FeatureCollection("projects/ee-luanabeckerdaluz/assets/paper2NPP/shapefiles/shpMesoregionRS")
var ROI = ROI_FC.geometry()
Map.addLayer(ROI, {}, 'ROI')
Map.centerObject(ROI)

// Set scale (m/px)
var SCALE_M_PX = 1000

// NDVI collection
var collectionNDVI = ee.ImageCollection('MODIS/061/MOD13Q1')
  .filterBounds(ROI)
  .filterDate('2018-01-01', '2018-02-18')
  .select('NDVI')
  .map(function(img){
    return img
      .rename('NDVI')                               // Rename band
      .multiply(0.0001)                             // Apply band scale
      .reproject('EPSG:4326', null, SCALE_M_PX)     // Downscale/Upscale image
      .clip(ROI)                                    // Clipt to geometry
      .set("date", img.date().format("yyyy-MM-dd")) // Set date property
  })

Map.addLayer(
  collectionNDVI.first(), 
  {min:0.2, max:1.0, palette:['lightgreen','darkgreen','yellow','orange','red','darkred']},
  'IN - collectionNDVI img1'
)
print(collectionNDVI)


/*--------- ! ATTENTION ! -----------

  Input collection for gif must be 
previously reprojected and clipped!
 
----------- ! ATTENTION ! -----------*/

var utils = require('users/luanabeckerdaluz/GEEtools:gif_label')

utils.gif_label({
  col: collectionNDVI,
  ROI: ROI,
  geom_label_position: geom_label_top_left,
  vis_params: {
    min:0.2, 
    max:1.0, 
    palette:['lightgreen','darkgreen','yellow','orange','red','darkred']
  },
  backgroundColor: "white",
  backgroundValue: -1,
  sensorScale: SCALE_M_PX,
  fontScale: 250,
  proj: "EPSG:4326",
  col_label_attribute: "date",
  labelParams: {
    fontType: 'Arial', 
    textColor: 'ffffff', 
    outlineColor: '000000', 
    outlineWidth: 1, 
    outlineOpacity: 0.7
  },
  gifParams:{
    dimensions: 1024,
    framesPerSecond: 5
  }
})
