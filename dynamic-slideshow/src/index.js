wp.blocks.registerBlockType("customblock/slideshow", {
  title: "SlideShow",
  icon: "smiley",
  category: "common",
  attributes: {},
  edit: EditComponent,
  save: function () {
    return null;
  },
});

function EditComponent(props) {
  return <h1>From Edit file</h1>;
}
