Meteor.startup( () => {
	BrowserPolicy.content.allowOriginForAll("https://s.ytimg.com")
	BrowserPolicy.content.allowOriginForAll("https://www.youtube.com")
})
