Meteor.startup( () => {
	BrowserPolicy.content.allowOriginForAll("https://s.ytimg.com")
	BrowserPolicy.content.allowOriginForAll("https://www.youtube.com")
	BrowserPolicy.content.allowOriginForAll("https://www.billboard.com")
})
