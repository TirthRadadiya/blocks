import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, TextControl } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";

wp.blocks.registerBlockType("customblock/slideshow", {
  title: "SlideShow",
  icon: "smiley",
  category: "common",
  attributes: {
    showTitle: {
      type: "boolean",
      default: true,
    },
    showExcerpt: {
      type: "boolean",
      default: true,
    },
    showThumbnail: {
      type: "boolean",
      default: true,
    },
    autoScroll: {
      type: "boolean",
      default: false,
    },
    api: {
      type: "string",
      default: "", // Allow users to input a custom URL
    },
  },
  edit: EditComponent,
  save: function () {
    return null;
  },
});

function EditComponent(props) {
  const { attributes, setAttributes } = props;
  const { autoScroll, api, showTitle, showExcerpt, showThumbnail } = attributes;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (api) {
      fetch(`${api}/wp-json/wp/v2/posts`)
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  }, [api]);

  const setURL = (value) => {
    console.log(value);
    setAttributes({ api: value });
  };

  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Slideshow Settings", "custom-post-slideshow")}>
          <ToggleControl
            label={__("Auto Scroll", "custom-post-slideshow")}
            checked={autoScroll}
            onChange={() => setAttributes({ autoScroll: !autoScroll })}
          />
          <TextControl
            label={__("API URL", "custom-post-slideshow")}
            help={__(
              "Enter the custom URL to fetch posts from an external source.",
              "custom-post-slideshow"
            )}
            value={api}
            onChange={(value) => setURL(value)}
          />
        </PanelBody>

        <PanelBody
          title={__("Post Meta Settings", "custom-post-slideshow")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("Show Post Title", "custom-post-slideshow")}
            checked={showTitle}
            onChange={() => setAttributes({ showTitle: !showTitle })}
          />
          <ToggleControl
            label={__("Show Post Excerpt", "custom-post-slideshow")}
            checked={showExcerpt}
            onChange={() => setAttributes({ showExcerpt: !showExcerpt })}
          />
          <ToggleControl
            label={__("Show Post Thumbnail", "custom-post-slideshow")}
            checked={showThumbnail}
            onChange={() => setAttributes({ showThumbnail: !showThumbnail })}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {posts.length > 0 ? (
          <div className="cps-slideshow">
            {posts.map((post) => (
              <div className="cps-slide" key={post.id}>
                {showTitle && (
                  <h3>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {post.title.rendered}
                    </a>
                  </h3>
                )}
                {showThumbnail && post._embedded["wp:featuredmedia"] && (
                  <img
                    src={post._embedded["wp:featuredmedia"][0].source_url}
                    alt={post.title.rendered}
                  />
                )}
                {showExcerpt && (
                  <p>{post.excerpt.rendered.replace(/(<([^>]+)>)/gi, "")}</p>
                )}
                {showMeta && <p>{new Date(post.date).toLocaleDateString()}</p>}
              </div>
            ))}
          </div>
        ) : (api || posts.length === 0) ? (
          <p>{__("Loading posts...", "custom-post-slideshow")}</p>
        ) : (
          <p>
            {__(
              "Please enter URL to fetch posts from",
              "custom-post-slideshow"
            )}
          </p>
        )}
      </div>
    </>
  );
}
