const path = require('path');
const fs = require('fs');

let fileName = 'file';

module.exports = function (req, form, callback) {
  fileName = 'file';
  let hasImage = false;
  form.multiples = true;
  form.uploadDir = 'files upload dir';
  const uploadDir = 'files upload dir';

  try {
    form.on('fileBegin', function (name, file) {
      if (file)
        hasImage = true;
      try {
        file.path = path.join(uploadDir, fileName);
      } catch (e) {
        console.log(e);
      }
    });

    form.parse(req, (err, fields, files) => {
      if (hasImage == true)
        fields.file = fileName;
      callback(fields, hasFile == true ? fileName : undefined);
    });
  } catch (e) {
    console.log(e);
  }
};
