const $ = new DisplayJS(window);

$.on(".copyright", "click", () => {
    window.location = "https://kiwidocs.js.org"
})

let configLoaded = false;
let config = []
let dataPaths = []

function load(url = null) {
    $.html(".title", 'Loading...')
    // $.html(".sidebar", '<ul><li>Loading...</li></ul>')
    $.html(".content", '<div align="center">Loading...</div>')
    if (configLoaded === false) {
        fetch("config.json")
            .then(data => data.json())
            .then(data => {
                data = data[0]
                config = data;
                configLoaded = true;
                $.html("head>title", data.title)
                if (data.type == "wiki" || data.type == "github") {
                    const urlparser = document.createElement('a')
                    urlparser.href = window.location
                    load(`${data.url}/${urlparser.hash.split("#")[1]}`)
                    side(data.logo, data.copyright)
                } else {
                    $.html(".sidebar", "<ul></ul>")
                    if (data.hasOwnProperty("paths")) {
                        dataPaths = data.paths
                        const urlparser = document.createElement('a')
                        urlparser.href = window.location
                        load(Object.values(data.paths)[parseInt(urlparser.hash.split("#")[1]) < 0 || isNaN(parseInt(urlparser.hash.split("#")[1])) ? 0 : parseInt(urlparser.hash.split("#")[1])])
                        side(data.logo, data.copyright)
                    }
                }
                if (data.hasOwnProperty("analytics")) {
                    (function(i, s, o, g, r, a, m) {
                        i['GoogleAnalyticsObject'] = r;
                        i[r] = i[r] || function() {
                            (i[r].q = i[r].q || []).push(arguments)
                        }, i[r].l = 1 * new Date();
                        a = s.createElement(o),
                            m = s.getElementsByTagName(o)[0];
                        a.async = 1;
                        a.src = g;
                        m.parentNode.insertBefore(a, m)
                    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

                    ga('create', data.analytics, 'auto');
                    ga('send', 'pageview');
                }
                listener()
            })
    } else {
        if (/github.com/.test(url)) {
            fetch("https://cors-anywhere.herokuapp.com/" + url, {
				header: new Headers({
					"Accept": "*"
				})
			})
                .then(config => config.text())
                .then(data => {
                    const parser = new DOMParser();
                    const configEl = parser.parseFromString(data, "text/html");
                    const els = configEl.querySelectorAll(".markdown-body")
                    $.html(".title", configEl.querySelector(".gh-header-title").innerHTML)
                    $.html(".sidebar", els[0].innerHTML)
                    $.html(".content", els[1].innerHTML)
                    side(config.logo, config.copyright)
                })
        } else {
            $.html(".sidebar", "<ul></ul>")
            if (config.hasOwnProperty("paths")) {
                for (let i in config.paths) {
                    $.single(".sidebar>ul").innerHTML += `<li><a href="${config.paths[i]}">${i}</a></li>`
                }
                $.html(".title", Object.keys(config.paths)[Object.values(config.paths).indexOf(url)])
                render(url)
                side(config.logo, config.copyright)
            }
        }
    }
    listener()
}

function side(url, copy) {

    if (url != undefined) {
		console.log()
        $.single(".sidebar").innerHTML = `
		<center>
			<img src="${url}" alt="Logo" class="img">
		</center>
		` + $.single(".sidebar").innerHTML;
        $.single(".sidebar").innerHTML += `
		<center>
			<div class="copyright-side">© Copyright ${copy} ${new Date().getFullYear()}</div>
		</center>
		`
    }
	listener()
}

function listener() {
    $.all(".sidebar ul>li>a", el => {
        $.on(el, "click", e => {
            e.preventDefault()
            if (!config.hasOwnProperty("paths")) {

                window.location = `#${e.target.tagName.toLowerCase() != "a" ? e.target.parentNode.href.split("/").slice(-1)[0] : e.target.href.split("/").slice(-1)[0]}`
				load(e.target.tagName.toLowerCase() != "a" ? e.target.parentNode.href : e.target.href)
            } else {
                const hashtag = Object.keys(dataPaths).indexOf(e.target.innerHTML)
                window.location = `#${hashtag}`
                load(Object.values(dataPaths)[hashtag])
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
load()
listener()
