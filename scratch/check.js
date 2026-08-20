const fs = require('fs'); const content = fs.readFileSync('index.html', 'utf8'); const start = content.indexOf('deadlineScaricoTachigrafo'); console.log(content.substring(start - 300, start + 300));
