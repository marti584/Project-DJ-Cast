FlowRouter.route('/channels', {
  action: function() {
    BlazeLayout.render("layoutDefault", {header: "navigation", main: "openchannels"})
  }
});

FlowRouter.route('/channels/new', {
  name: 'newchannel',
  action: function() {
    BlazeLayout.render("layoutDefault", {header: "navigation", main: "newchannel"});
  }
});

FlowRouter.route('/channels/:id', {
  action: function() {
    BlazeLayout.render("layoutDefault", {header: "navigation", main: "channel"})
  }
});

