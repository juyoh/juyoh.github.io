rawLog = "";
const LineType = {
    INFO: "INFO",
    WARNING: "WARNING",
    ERROR: "ERROR"
}
class LogLine {
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}
allLogLines = [];
groupedErrors = [];
shownErrorLines = [];
const minecraftColors = {
  "0": "#000000",
  "1": "#0000AA",
  "2": "#00AA00",
  "3": "#00AAAA",
  "4": "#AA0000",
  "5": "#AA00AA",
  "6": "#FFAA00",
  "7": "#AAAAAA",
  "8": "#555555",
  "9": "#5555FF",
  a: "#55FF55",
  b: "#55FFFF",
  c: "#FF5555",
  d: "#FF55FF",
  e: "#FFFF55",
  f: "#FFFFFF"
};
//if a error has minecraft color formatting, convert it to html formatting
function minecraftToHtml(input) {
  let current = {
    color: "#FFFFFF",
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    obfuscated: false
  };

  const segments = [];
  let text = "";

  function flush() {
    if (!text) return;

    const styles = [
      `color: ${current.color}`,
      current.bold && "font-weight: bold",
      current.italic && "font-style: italic",
      current.underline && "text-decoration: underline",
      current.strikethrough && "text-decoration: line-through",
      current.obfuscated && "filter: blur(2px)"
    ].filter(Boolean).join("; ");

    segments.push(
      `<span style="${styles}">${escapeHtml(text)}</span>`
    );

    text = "";
  }

  for (let i = 0; i < input.length; i++) {
    if (input[i] !== "§" || i + 1 >= input.length) {
      text += input[i];
      continue;
    }

    flush();

    const code = input[++i].toLowerCase();

    if (minecraftColors[code]) {
      current.color = minecraftColors[code];

      // Minecraft color codes reset formatting such as bold/underline.
      current.bold = false;
      current.italic = false;
      current.underline = false;
      current.strikethrough = false;
      current.obfuscated = false;
    } else {
      switch (code) {
        case "l":
          current.bold = true;
          break;
        case "o":
          current.italic = true;
          break;
        case "n":
          current.underline = true;
          break;
        case "m":
          current.strikethrough = true;
          break;
        case "k":
          current.obfuscated = true;
          break;
        case "r":
          current = {
            color: "#FFFFFF",
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false,
            obfuscated: false
          };
          break;
      }
    }
  }

  flush();
  return segments.join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function processLog(log) {
    wasError = false;
    currentErrorGroup = [];
    allLogLines = [];
    groupedErrors = [];
    shownErrorLines = [];
    document.getElementById("shown-lines").innerHTML = ""
    document.getElementById("fixes").innerHTML = ""
    for (const line of log.split('\n')) {
        if (line.split(' ')[3] === "[INFO]") {
            allLogLines.push(new LogLine(LineType.INFO, line));
            if (wasError) {
                groupedErrors.push(currentErrorGroup);
                currentErrorGroup = [];
            }
            wasError = false;
        }
        else if (line.split(' ')[3] === "[WARNING]") {
            allLogLines.push(new LogLine(LineType.WARNING, line));
            if (wasError) {
                groupedErrors.push(currentErrorGroup);
                currentErrorGroup = [];
            }
            wasError = false;
        }
        else if (line.split(' ')[3] === "[ERROR]") {
            logLine = new LogLine(LineType.ERROR, line.split(' ').slice(4).join(' '));
            allLogLines.push(logLine);
            currentErrorGroup.push(logLine);
            wasError = true;
        }
    }
    if (wasError) {
        groupedErrors.push(currentErrorGroup);
        currentErrorGroup = [];
    };
    for (let i = groupedErrors.length - 1; i >= 0; i--) {
        parseErrorGroup(groupedErrors[i]);
    }
      if (document.getElementById('shown-lines').innerHTML === "") {
        document.getElementById('fixes').innerHTML = "<b>No errors found! :3</b>";
    }
    document.getElementById('output').innerText = "Finished processing, found " + groupedErrors.length + (groupedErrors.length === 1 ? " error group." : " error groups.");
}
function addFix(fixHtml){
    const fixesContainer = document.getElementById('fixes');
    const fixElement = document.createElement('div');
    fixElement.classList.add('fix');
    fixElement.innerHTML = fixHtml;
    fixesContainer.appendChild(fixElement);
}
function errorLineToFixHtml(line) {
    if (line.includes("java.lang.OutOfMemoryError")) {
        addFix("Your server <b> ran out of memory</b>. Remove some mods!");
    }
    if (line.startsWith("java.lang.NoClassDefFoundError: ")) {
        const missingClass = line.split("java.lang.NoClassDefFoundError: ")[1];
        const packageName = missingClass.split("/")[2];
        addFix("A mod is missing a dependency. Try looking for modid: <b>" + packageName + "</b>.<p></p> Missing class: <i>" + missingClass + "</i>");
    }
    if (line.startsWith("- Mod ")) {
        const requirementWanter = line.split(" ")[2];
        const requirement = line.split(" ")[4];
        addFix("A mod is missing a dependency. Download modid: <b>" + requirement + "</b> (wanted by <b>" + requirementWanter + "</b>)");
    }
    if (line.endsWith(" has failed to load correctly")) {
        const nameAndId = line.substring(2, line.length - " has failed to load correctly".length);
        addFix("A mod has failed to load correctly. Check the following mod: <b>" + nameAndId + "</b>");
    }
    if (line.startsWith("Mod ") && line.includes(" requires ")) {
        const modName = line.split("Mod ")[1].split(" requires ")[0];
        const requiredMod = line.split(" requires ")[1];
        addFix("A mod is missing a dependency. Download modid: <b>" + minecraftToHtml(requiredMod) + "</b> (wanted by <b>" + minecraftToHtml(modName) + "</b>)");
    }
}
function parseErrorGroup(errorGroup) {
    parsingFMLLoadFailure = false;
    for (const logLine of errorGroup) {
        line = logLine.message;
        if (line.includes("java.lang.OutOfMemoryError")) {
            shownErrorLines.push(line);
            continue;
        }
        if (line.startsWith("[minecraft/MinecraftServer]: This crash report has been saved to:")) {
            continue;
        }
        if (line === "net.minecraftforge.fml.LoadingFailedException: Loading errors encountered: [") {
            parsingFMLLoadFailure = true;
            continue;
        }
        if (parsingFMLLoadFailure) {
            if (line === "]\"" || line === "]") {
                parsingFMLLoadFailure = false;
                break;
            } else {
                shownErrorLines.push(line);
            }
            continue;
        }
        if (line.startsWith("java.lang.NoClassDefFoundError: ")) {
            shownErrorLines = [];
            shownErrorLines.push(line);
            break;
        }
        // fallback for other errors
        shownErrorLines.push(line);
    }
    //todo create a child in shown-lines, and add each line as a child of that child, so that each error group is separated
    const shownLinesContainer = document.getElementById('shown-lines');
    document.getElementById("logHider").style.display = "block";
    document.getElementById("explanation").style.display = "none";
    const fixContainer = document.getElementById('fixes');
    const errorGroupContainer = document.createElement('div');
    errorGroupContainer.classList.add('error-group');
    for (const line of shownErrorLines) {
        const lineElement = document.createElement('div');
        lineElement.classList.add('error-line');
        lineElement.innerHTML = minecraftToHtml(line);
        errorGroupContainer.appendChild(lineElement);
        errorLineToFixHtml(line);
    }
    shownLinesContainer.appendChild(errorGroupContainer);
    shownErrorLines = [];
    if (fixContainer.innerHTML === "") {
        fixContainer.innerHTML = "<b>Couldn't find any fixes! Click below to show the errors:</b>";
    }
}
function getRawURL(url) {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    return `https://paste.shockbyte.com/raw/${lastSegment}`;
}
function downloadLog(url) {
    const rawURL = getRawURL(url);
    fetch(rawURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            rawLog = data;
            document.getElementById('output').innerText = "Log downloaded successfully. Processing...";
            processLog(rawLog);
        })
        .catch(error => {
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.error('There has been a problem with your fetch operation:', error);
                document.getElementById('output').innerText = "Failed to download log. Please check the URL.";
            } else {
                document.getElementById('output').innerText = "An error occurred: " + error.message;
            }
            
        });
}
function begin() {
    const urlInput = document.getElementById('url-input').value;
    if (!urlInput) {
        document.getElementById('output').innerText = "Please enter a URL.";
        return;
    }
    if (!urlInput.startsWith("https://paste.shockbyte.com/")) {
        document.getElementById('output').innerText = "Invalid URL. Please enter a valid Shockbyte paste URL, eg. https://paste.shockbyte.com/something";
        return;
    }
    downloadLog(getRawURL(urlInput));
}
document.getElementById('url-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        begin();
    }
});
document.getElementById('logHider').addEventListener('click', function () {
    const shownLinesContainer = document.getElementById('shown-lines');
    const logHider = document.getElementById('logHider');
    if (shownLinesContainer.style.display === 'none') {
        shownLinesContainer.style.display = 'block';
        logHider.innerText = 'Click to hide errors -';
    } else {
        shownLinesContainer.style.display = 'none';
        logHider.innerText = 'Click to show errors +';
    }
});