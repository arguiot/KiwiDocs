const $ = new DisplayJS(window);

$.on(".copyright", "click", e => {
    window.location = "https://kiwidocs.js.org"
})

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// lib
let dataPaths = []
fetch("config.json")
    .then(data => data.json())
    .then(data => {
        data = data[0]
        if (data.type == "wiki" || data.type == "github") {
            const urlparser = document.createElement('a')
            urlparser.href = window.location
            getPage(data.url + "/" + urlparser.hash.split("#")[1])
        } else {
            $.html(".sidebar", "<ul></ul>")
            if (data.hasOwnProperty("paths")) {
				dataPaths = data.paths
				const urlparser = document.createElement('a')
	            urlparser.href = window.location
	            getPage(Object.values(data.paths)[parseInt(urlparser.hash.split("#")[1]) < 0 || parseInt(urlparser.hash.split("#")[1]) == NaN ? 0 : parseInt(urlparser.hash.split("#")[1])])
				listener()
            }
        }
    })

function getPage(url) {
    $.html(".title", 'Loading...')
    $.html(".sidebar", '<ul><li>Loading...</li></ul>')
    $.html(".content", '<div align="center">Loading...</div>')
    if (/github.com/.test(url)) {
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
    } else {
        fetch("config.json")
            .then(data => data.json())
            .then(data => {
                data = data[0]
                if (data.type == "wiki" || data.type == "github") {
                    const urlparser = document.createElement('a')
                    urlparser.href = window.location
                    getPage(data.url + "/" + urlparser.hash.split("#")[1])
                } else {
                    $.html(".sidebar", "<ul></ul>")
                    if (data.hasOwnProperty("paths")) {
                        for (let i in data.paths) {
                            $.single(".sidebar>ul").innerHTML += `<li><a href="${data.paths[i]}">${i}</a></li>`
                        }
						console.log(url)
                        $.html(".title", Object.keys(data.paths)[Object.values(data.paths).indexOf(url)])
                        render(url)
                        listener()
                    }
                }
            })
    }
}

function listener() {
    $.all(".sidebar ul>li>a", el => {
        $.on(el, "click", e => {
            e.preventDefault()
            if (dataPaths == []) {
                window.location = `#${e.target.tagName.toLowerCase() != "a" ? e.target.parentNode.href.split("/").slice(-1)[0] : e.target.href.split("/").slice(-1)[0]}`
            } else {
                const hashtag = Object.values(dataPaths).indexOf(e.target.pathname.slice(1))
                window.location = `#${hashtag}`
				getPage(Object.values(dataPaths)[hashtag])
            }
            listener()
        })
    })
}

function render(path) {
    const converter = new showdown.Converter();
    fetch(path).then(data => data.text()).then(data => {
        const renderedhtml = converter.makeHtml(data)
        $.html(".content", renderedhtml)
    })
}
