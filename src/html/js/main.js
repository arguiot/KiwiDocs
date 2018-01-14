const $ = new DisplayJS(window);

$.on(".copyright", "click", e => {
    window.location = "https://kiwidocs.js.org"
})


// lib

fetch("config.json")
    .then(data => data.json())
    .then(data => {
		if (data.type == "wiki" || data.type == "github") {
			const urlparser = document.createElement('a')
			urlparser.href = window.location
			getPage(data.url + "/" + urlparser.hash.split("#")[1])
		}
    })

function getPage(url) {
	$.html(".title", 'Loading...')
	$.html(".sidebar", '<ul><li>Loading...</li></ul>')
	$.html(".content", '<div align="center">Loading...</div>')
    fetch(url, {
            mode: 'cors'
        })
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
