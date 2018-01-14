const $ = new DisplayJS(window);

$.on(".copyright", "click", e => {
    window.location = "https://kiwidocs.js.org"
})
// function getREADME(name, org = "arguiot") {
//     const head = new Headers({
//         "Accept": "application/vnd.github.v3.html"
//     })
//     fetch(`https://api.github.com/repos/${org}/${name}/contents/$.ajax().md`, {
//         headers: head
//     }).then(data => data.text()).then(data => {
//         $.html(".content", data)
//     })
// }
// getREADME("DisplayJS.wiki")

function getPage(url) {
    fetch(url, {mode: 'cors'})
        .then(data => data.text())
        .then(data => {
            const parser = new DOMParser();
            const dataEl = parser.parseFromString(data, "text/html");
            const els = dataEl.querySelectorAll(".markdown-body")
			$.html(".title", dataEl.querySelector(".gh-header-title").innerHTML)
            $.html(".sidebar", els[0].innerHTML)
            $.html(".content", els[1].innerHTML)
			listener()
        })
}
function listener() {
	$.all(".sidebar ul>li>a", el => {
		$.on(el, "click", e => {
			e.preventDefault()
			window.location = `#${e.target.tagName.toLowerCase() != "a" ? e.target.parentNode.href.split("/").slice(-1)[0] : e.target.href.split("/").slice(-1)[0]}`
			getPage(e.target.tagName.toLowerCase() != "a" ? e.target.parentNode.href : e.target.href)
			listener()
		})
	})
}
const urlparser = document.createElement('a')
urlparser.href = window.location
getPage("https://github.com/arguiot/EyeJS/wiki/" + urlparser.hash.split("#")[1])
