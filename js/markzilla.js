let jsonObject;
let inputFile;
let filePath = '/../mkz/test.mkz';
let postObject = {};

const yyyymmdd = () => {
  var x = new Date();
  var y = x.getFullYear().toString();
  var m = (x.getMonth() + 1).toString();
  var d = x.getDate().toString();
  (d.length == 1) && (d = '0' + d);
  (m.length == 1) && (m = '0' + m);
  var yyyymmdd = y + m + d;
  return {
    yyyymmdd,
    y,
    m,
    d
  };
}

const parseDateString = (str) => {
  if (!/^(\d){8}$/.test(str)) return "invalid date";
  var y = str.substr(0, 4),
    m = str.substr(4, 2),
    d = str.substr(6, 2);
  return {
    y,
    m,
    d
  };
}

const markzilla = mkz = {
  parse: (filePath) => {
    $.get(filePath, (data) => {
      console.log(data);
      inputFile = data;
    }).then((inputFile) => {
      let lines = inputFile.split('\n');
      let lastLine;
      let line;
      let elements = [];
      console.log(elements);
      for (var i = 0; i < lines.length; i++) {
        // console.log(lastLine);
        let str = lines[i].split(' ')[0];
        if (lastLine) {

        }
        switch (true) {
          case (/\s/.test(str) || str == ''):
            console.log('blank line');
            break;

          case str == '#p':
            line = lines[i].split('#p ');
            line = '<p>' + line[1] + '</p>';
            break;
          case str == '//':
            break;
          case str == '#h1':
            line = lines[i].split('#h1 ');
            line = '<h1>' + line[1] + '</h1>';
            elements.push({
              line
            });
            break;
          case str == '#h2':
            line = lines[i].split('#h2 ');
            line = '<h2>' + line[1] + '</h2>';
            elements.push({
              line
            });
            break;
          case str == '#h3':
            line = lines[i].split('#h3 ');
            line = '<h3>' + line[1] + '</h3>';
            elements.push({
              line
            });
            break;
          case str == '#h4':
            line = lines[i].split('#h4 ');
            line = '<h4>' + line[1] + '</h4>';
            elements.push({
              line
            });
            break;
          case str == '#h5':
            line = lines[i].split('#h5 ');
            line = '<h5>' + line[1] + '</h5>';
            elements.push({
              line
            });
            break;
          case str == '#h6':
            line = lines[i].split('#h6 ');
            line = '<h6>' + line[1] + '</h6>';
            elements.push({
              line
            });
            break;
          case str == '#img':
            line = lines[i].split('#h1 ');
            line = '<img src=\'' + line[1] + '\'/>';
            elements.push({
              line
            });
            break;
          default:
            // if ((lastLine !== '') || (/\s/.test(str) == false)) {
            //   console.log('last line was not blank, and had no markup information associated with it.');
            // } else {
            //   console.log('last line was blank, and had no markup information associated with it.');
            // }
            break;
        } // end switch
        lastLine = lines[i];
      } // end loop

    });
  },
  decon: (html) => {
    console.log('converting from .html to .mkz');
  },
  save: (json) => {
    console.log('saving as json object.');
  }
}