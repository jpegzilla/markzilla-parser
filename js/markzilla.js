let filePath = mkzOptions.file;
let stylePath = mkzOptions.stylePath;
let styleName = mkzOptions.styleName;
let postObject = {};
let elements = [];

const when = (conditionFunc, execFunc, interval) => {
  if (conditionFunc()) {
    execFunc();
  } else {
    setTimeout(() => {
      when(conditionFunc, execFunc, interval);
    }, interval);
  }
};

const yyyymmdd = () => {
  let x = new Date();
  let y = x.getFullYear().toString();
  let m = (x.getMonth() + 1).toString();
  let d = x.getDate().toString();
  d.length == 1 && (d = "0" + d);
  m.length == 1 && (m = "0" + m);
  let yyyymmdd = y + m + d;
  return {
    yyyymmdd,
    y,
    m,
    d
  };
};

const parseDateString = str => {
  if (!/^(\d){8}$/.test(str)) return "invalid date";
  const y = str.substr(0, 4),
    m = str.substr(4, 2),
    d = str.substr(6, 2);
  return {
    y,
    m,
    d
  };
};

const getFile = filePath => {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", filePath);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
};

getFile(stylePath).then(response => {
  let style = document.createElement("style");
  let resp = JSON.parse(response);
  stylesheet = resp.styles.find(e => Object.keys(e)[0] == styleName);
  stylesheet = Object.values(stylesheet)[0];
  style.innerHTML = stylesheet;
  document.body.appendChild(style);
});

const markzilla = (mkz = {
  parse: filePath => {
    return new Promise(function(resolve, reject) {
      if (filePath) {
        elements = [];

        getFile(filePath).then(inputFile => {
          let lines = inputFile.split("\n");
          let arrayOfLines = [];
          for (let i = 0; i < lines.length; i++) {
            if (/^#/.test(lines[i])) {
              let lastIndicator = lines[i];
              arrayOfLines.push(lastIndicator);
              continue;
            }
            if (/\n\r/.test(lines[i])) {
              continue;
            }
            if (/^\s/.test(lines[i]) || lines[i] == "") {
              continue;
            }
            if (/^\/\//.test(lines[i])) {
              continue;
            } else {
              arrayOfLines[arrayOfLines.length - 1] = arrayOfLines[
                arrayOfLines.length - 1
              ] += "<br>" + lines[i];
              continue;
            }
          }
          for (let i = 0; i < arrayOfLines.length; i++) {
            lineText = arrayOfLines[i].split(/^#[a-z]*[0-9]*\s/)[1];
            lineType = arrayOfLines[i].split(/\s/)[0].split("#")[1];
            line = arrayOfLines[i];

            switch (lineType) {
              case "h1":
              case "h2":
              case "h3":
              case "h4":
              case "h5":
              case "h6":
              case "p":
              case "code":
                c = `<${lineType}>${lineText}</${lineType}>`;
                elements.push(c);
                break;
              case "img":
                x = lineText.split(/(^.*\/\S*)/);
                imgPath = x[1];
                imgAlt = x[2].trim();
                c = `<${lineType} src="${imgPath}" alt="${imgAlt}" title="${imgAlt}">`;
                elements.push(c);
                break;
              default:
            }
          }
          const matchesHL = /(\[[^\\a].*?\])/gi;
          const matchesLinks = /(\[[a].*?\]\(.*?\))/gi;
          const matchesEsc = /(\[\\)/gi;
          const matchesLinkText = /(\[[a].*?\])/;
          const matchesLinkAdd = /(\(.*?\))/;
          for (let i = 0; i < elements.length; i++) {
            let hl = elements[i].match(matchesHL);
            let li = elements[i].match(matchesLinks);

            if (li && hl) {
              let line = elements[i];
              let finalLine;
              el = elements[i].match(matchesHL);
              for (let c = 0; c < el.length; c++) {
                currentHL = el[c];
                elPosition = elements[i].indexOf(el[c]);
                elType = el[c]
                  .replace(/(\[|\])/gi, "")
                  .substr(0, el[c].replace(/(\[|\])/gi, "").indexOf(" "));
                elType = elType.split("").join(" ");
                elContent = el[c]
                  .replace(/(\[|\])/gi, "")
                  .substr(el[c].replace(/(\[|\])/gi, "").indexOf(" ") + 1);
                elToLast = currentHL.length + elPosition;
                lineLength = line.length;
                hLlength = currentHL.length;
                finalLine =
                  elements[i].substr(0, elPosition) +
                  `<span class='${elType}'>${elContent}</span>` +
                  elements[i].substr(elToLast, lineLength);
                elements[i] = finalLine;
              }

              el = elements[i].match(matchesLinks);
              for (let g = 0; g < el.length; g++) {
                line = elements[i];
                lineLength = line.length;
                elPosition = elements[i].indexOf(el[g]);
                currentLink = el[g];
                linkText = currentLink
                  .match(matchesLinkText)[0]
                  .replace(/(\[a\s|\])/gi, "");
                linkAdd = currentLink
                  .match(matchesLinkAdd)[0]
                  .replace(/(\(|\))/gi, "");
                elToLast = currentLink.length + elPosition;
                finalLine =
                  elements[i].substr(0, elPosition) +
                  `<a target="_blank" href="${linkAdd}">${linkText}</a>` +
                  elements[i].substr(elToLast, lineLength);
                elements[i] = finalLine;
              }
            } else if (hl) {
              let line = elements[i];
              let finalLine;
              el = elements[i].match(matchesHL);
              for (let c = 0; c < el.length; c++) {
                currentHL = el[c];
                elPosition = elements[i].indexOf(el[c]);
                elType = el[c]
                  .replace(/(\[|\])/gi, "")
                  .substr(0, el[c].replace(/(\[|\])/gi, "").indexOf(" "));
                elType = elType.split("").join(" ");
                elContent = el[c]
                  .replace(/(\[|\])/gi, "")
                  .substr(el[c].replace(/(\[|\])/gi, "").indexOf(" ") + 1);
                elToLast = currentHL.length + elPosition;
                lineLength = line.length;
                hLlength = currentHL.length;
                finalLine =
                  elements[i].substr(0, elPosition) +
                  `<span class='${elType}'>${elContent}</span>` +
                  elements[i].substr(elToLast, lineLength);
                elements[i] = finalLine;
              }
            } else if (li) {
              el = elements[i].match(matchesLinks);
              for (let g = 0; g < el.length; g++) {
                line = elements[i];
                lineLength = line.length;
                elPosition = elements[i].indexOf(el[g]);
                currentLink = el[g];
                linkText = currentLink
                  .match(matchesLinkText)[0]
                  .replace(/(\[a\s|\])/gi, "");
                linkAdd = currentLink
                  .match(matchesLinkAdd)[0]
                  .replace(/(\(|\))/gi, "");
                elToLast = currentLink.length + elPosition;
                finalLine =
                  elements[i].substr(0, elPosition) +
                  `<a target="_blank" href="${linkAdd}">${linkText}</a>` +
                  elements[i].substr(elToLast, lineLength);
                elements[i] = finalLine;
              }
            }
          }

          for (let i = 0; i < elements.length; i++) {
            elements[i] = elements[i].replace(matchesEsc, "[");
          }

          for (let i = 0; i < elements.length; i++) {
            element = elements[i];
            index = i;
            elements[i] = {
              [index]: element
            };
          }
          resolve(elements);
        });
        return elements;
      } else {
        console.warn("no file path specified.");
        reject("no file path specified");
      }
    });
  },

  decon: html => {
    // goes back from html layout to .mkz
  },

  insertPost: postObject => {
    if (Object.keys(postObject)[0]) {
      let start = window.performance.now();
      let title = Object.values(postObject)[0].title;
      let date = Object.keys(postObject)[0];
      let body = Object.values(postObject)[0].body;
      let parsedDate = parseDateString(date);
      // stuff that needs to be changed
      document.querySelector(".mkzTitle").innerHTML = title;
      document.querySelector(".mkzDate").textContent =
        parsedDate.y + " " + parsedDate.m + " " + parsedDate.d + " ";
      for (let i = 0; i < body.length; i++) {
        if (body[i]) {
          document.querySelector(".mkzBody").innerHTML =
            document.querySelector(".mkzBody").innerHTML + body[i];
        } else {
          continue;
        }
      }
      // end stuff that needs to be changed
      let end = window.performance.now();
      let time =
        "completed task in " + Math.floor(end - start) * 0.001 + " seconds.";
      return time;
    } else {
      console.warn("no postObject defined");
      return false;
    }
  },

  saveToPost: json => {
    return new Promise(function(resolve, reject) {
      if (json.length !== 0) {
        articleDate = yyyymmdd().yyyymmdd;
        articleTitle = Object.values(json[0])[0];
        postObject = {
          [articleDate]: {
            title: articleTitle,
            body: []
          }
        };
        for (let i = 1; i < json.length; i++) {
          postObject[articleDate].body[i] = Object.values(json[i])[0];
        }
        resolve(postObject);
      } else {
        console.warn("no json to save.");
        reject("no json to save");
      }
    });
  },

  createPost: filePath => {
    return new Promise(function(resolve, reject) {
      if (filePath) {
        markzilla.parse(filePath).then(k => {
          markzilla.saveToPost(k).then(v => {
            resolve(v);
          });
        });
      } else reject(new Error("no filepath"));
    });
  }
});
// immediately takes the .css and .mkz
// and makes the "blog post"
mkz.createPost(filePath);
