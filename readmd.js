let markdown = document.getElementById("content")
let markdownFileName = document.URL.split(".html")[0].concat(".md")
console.log("Loading MD file: " + markdownFileName)
try {
  fetch(markdownFileName)
  .then(response => 
    response.text()
  )
  .then((data) => {
    markdown.innerHTML = marked(data, {breaks: false})
  })
} catch(Error) {
  console.log(Error)
  markdown.innerHTML = "Error '" + Error + "' when loading Markdown file. Please contact me!"
}

try {
  fetch(markdownFileName)
  .then(response => 
    document.getElementById("blog_created").innerText = "last modified " + response.headers.get("Last-Modified").split(" ").slice(0,4).toString().replaceAll(",", " ")
  )
} catch(Error) {
  console.log(Error)
  markdown.innerHTML = "Error '" + Error + "' when check markdown file's time. Please contact me!"
}

