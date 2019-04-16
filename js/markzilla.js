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
      inputFile = data;
    }).then((inputFile) => {
      let lines = inputFile.split('\n');
      let arrayOfLines = [];
      for (var i = 0; i < lines.length; i++) {
        if (/^#/.test(lines[i])) {
          let lastIndicator = lines[i];
          arrayOfLines.push(
            lastIndicator
          );
          continue;
        }
        if (/\n\r/.test(lines[i])) {
          continue;
        }
        if (/^\s/.test(lines[i]) || lines[i] == '') {
          continue;
        }
        if (/^\/\//.test(lines[i])) {
          continue;
        } else {
          arrayOfLines[(arrayOfLines.length - 1)] = arrayOfLines[(arrayOfLines.length - 1)] += ('<br>' + lines[i]);
          continue;
        }
      }

      let elements = [];
      for (var i = 0; i < arrayOfLines.length; i++) {
        lineText = arrayOfLines[i].split(/^#[a-z]*[0-9]*\s/)[1];
        lineType = arrayOfLines[i].split(/\s/)[0].split('#')[1];
        line = arrayOfLines[i];

        switch (lineType) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
          case 'p':
          case 'code':
            c = `<${lineType}>${lineText}</${lineType}>`;
            elements.push(c);
            break;
          case 'img':
            x = lineText.split(/(^.*\/\S*)/);
            imgPath = x[1];
            imgAlt = x[2].trim();
            c = `<${lineType} src="${imgPath}" alt="${imgAlt}">`;
            elements.push(c);
            break;
          default:

        }

      } // end loop
      // const matchesHL = /(?:[^\'|\"])(\[.*?\])(?:[^\'|\"])/gi;
      const matchesHL = /(\[[^\\a].*?\])/gi;
      const matchesLinks = /(\[[a].*?\]\(.*?\))/gi;
      const matchesEsc = /(\[\\)/gi;
      const matchesLinkText = /(\[[a].*?\])/;
      const matchesLinkAdd = /(\(.*?\))/;
      for (var i = 0; i < elements.length; i++) {

        let hl = elements[i].match(matchesHL);
        let li = elements[i].match(matchesLinks);

        if (li && hl) {
          let line = elements[i];
          let finalLine;
          el = elements[i].match(matchesHL);
          for (var c = 0; c < el.length; c++) {
            currentHL = el[c];
            elPosition = elements[i].indexOf(el[c]);
            elType = el[c].replace(/(\[|\])/gi, '').substr(0, el[c].replace(/(\[|\])/gi, '').indexOf(' '));
            elType = elType.split('').join(' ');
            elContent = el[c].replace(/(\[|\])/gi, '').substr(el[c].replace(/(\[|\])/gi, '').indexOf(' ') + 1);
            let lineHTML = line.substr(elPosition, currentHL.length);
            elToLast = (currentHL.length + elPosition);
            lineLength = line.length;
            hLlength = currentHL.length;
            finalLine = elements[i].substr(0, elPosition) + `<span class='${elType}'>${elContent}</span>` + elements[i].substr(elToLast, lineLength);
            elements[i] = finalLine;
          }

          el = elements[i].match(matchesLinks);
          for (var g = 0; g < el.length; g++) {
            line = elements[i];
            lineLength = line.length;
            elPosition = elements[i].indexOf(el[g]);
            currentLink = el[g];
            linkText = currentLink.match(matchesLinkText)[0].replace(/(\[|\])/gi, '');
            linkAdd = currentLink.match(matchesLinkAdd)[0].replace(/(\(|\))/gi, '');
            elToLast = (currentLink.length + elPosition);
            finalLine = elements[i].substr(0, elPosition) + `<a target="_blank" href="${linkAdd}">${linkText}</a>` + elements[i].substr(elToLast, lineLength);
            elements[i] = finalLine;
          }
        } else if (hl) {


          let line = elements[i];
          let finalLine;
          el = elements[i].match(matchesHL);
          for (var c = 0; c < el.length; c++) {
            currentHL = el[c];
            elPosition = elements[i].indexOf(el[c]);
            elType = el[c].replace(/(\[|\])/gi, '').substr(0, el[c].replace(/(\[|\])/gi, '').indexOf(' '));
            elType = elType.split('').join(' ');
            elContent = el[c].replace(/(\[|\])/gi, '').substr(el[c].replace(/(\[|\])/gi, '').indexOf(' ') + 1);
            let lineHTML = line.substr(elPosition, currentHL.length);
            elToLast = (currentHL.length + elPosition);
            lineLength = line.length;
            hLlength = currentHL.length;
            finalLine = elements[i].substr(0, elPosition) + `<span class='${elType}'>${elContent}</span>` + elements[i].substr(elToLast, lineLength);
            elements[i] = finalLine;
          }
        } else if (li) {

          el = elements[i].match(matchesLinks);
          for (var g = 0; g < el.length; g++) {
            line = elements[i];
            lineLength = line.length;
            elPosition = elements[i].indexOf(el[g]);
            currentLink = el[g];
            linkText = currentLink.match(matchesLinkText)[0].replace(/(\[|\])/gi, '');
            linkAdd = currentLink.match(matchesLinkAdd)[0].replace(/(\(|\))/gi, '');
            elToLast = (currentLink.length + elPosition);
            finalLine = elements[i].substr(0, elPosition) + `<a target="_blank" href="${linkAdd}">${linkText}</a>` + elements[i].substr(elToLast, lineLength);
            elements[i] = finalLine;
          }
        }
      }

      for (var i = 0; i < elements.length; i++) {
        elements[i] = elements[i].replace(matchesEsc, '[');
      }
      console.log(elements);
      return;


    });
  },
  decon: (html) => {
    console.log('converting from .html to .mkz');
  },
  save: (json) => {
    console.log('saving as json object.');
  }
}