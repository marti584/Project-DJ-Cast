FlowRouter.route('/', {
  name: 'home',
  action: function() {
    BlazeLayout.render("layoutDefault", {header: "navigation", main: "home"});
  }
});
