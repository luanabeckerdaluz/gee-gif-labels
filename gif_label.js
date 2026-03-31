var text = require('users/gena/packages:text')
var style = require('users/gena/packages:style')

function generate_gif(params){
  // Verify if params has all keys
  var requiredKeys = [
    'col', 'coord_label_position', 
    'fontScale', 'col_label_attribute', 
    'gifParams'
  ];
  var allKeysPresent = requiredKeys.every(function(key) {
    return params.hasOwnProperty(key);
  });
  if (!allKeysPresent) {
    throw new Error('ERROR: params needs to have all the following keys: ' + requiredKeys.join(', '));
  }

  // If params.labelParams does not exists, set default
  if (!('labelParams' in params)) {
    params.labelParams = {
      fontType: 'Arial', 
      textColor: 'ffffff', 
      outlineColor: '000000', 
      outlineWidth: 1, 
      outlineOpacity: 0.7
    }
  }
  
  /* Force fontSize = 64
    This is done in order to have a good resolution font. 
    Its size is actually controlled by fontSize parameter 
    (which is the 'scale' parameter in text.draw function)
  */
  params.labelParams.fontSize = 64
  
  // For each col image, apply visualize and blend with label
  var blended_col = params.col.map(function(img){
    var label = text.draw(
      img.get(params.col_label_attribute),
      params.coord_label_position, 
      params.fontScale,
      params.labelParams
    )
    return img
      .blend(label)
      .copyProperties(img, [params.col_label_attribute])
  })
  
  // Generate GIF
  return ui.Thumbnail({
    image: blended_col, 
    params: params.gifParams
  });
}


exports.gif_label = function(params){
  var gif = generate_gif(params);
  print(gif);
};

exports.gif_label_return = function(params){
  return generate_gif(params);
};
