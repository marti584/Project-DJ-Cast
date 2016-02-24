FlowRouter.route('/Admin', {
  name: 'Admin',
  action: function() {
    BlazeLayout.render("layoutDefault", {header: "navigation", main: "Admin"});
  }
});

