
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

var NDVIvis = {min:0.2, max:1.0, palette:['lightgreen','darkgreen','yellow','orange','red','darkred']}
Map.addLayer(collectionNDVI.first(), NDVIvis, 'IN - collectionNDVI img1')
print(collectionNDVI)


/*--------- ! ATTENTION ! -----------

  Input collection for gif must be 
previously reprojected and clipped!
 
----------- ! ATTENTION ! -----------*/

var utils = require('users/luanabeckerdaluz/GEEtools:gif_label')

utils.gif_label({
  col: collectionNDVI,
  ROI: ROI,
  geom_label_top_left: geom_label_top_left,
  vis_params: NDVIvis,
  sensorScale: SCALE_M_PX,
  fontScale: 250,
  // projection,
  col_label_attribute: "date",
  labelParams: {
    fontType: 'Arial', 
    textColor: 'ffffff', 
    outlineColor: '000000', 
    outlineWidth: 1, 
    outlineOpacity: 0.7
  },
  gifParams:{
    crs: 'EPSG:4326',
    dimensions: 1024,
    region: ROI,
    framesPerSecond: 5
  }
})
