import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl, TextControl } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";

wp.blocks.registerBlockType("customblock/slideshow", {
  title: "SlideShow",
  icon: "images-alt2",
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
    slides: {
      type: "array",
      default: [],
    },
  },
  edit: EditComponent,
  save: function () {
    return null;
  },
});

function EditComponent(props) {
  const { attributes, setAttributes } = props;
  const { autoScroll, api, showTitle, showExcerpt, showThumbnail, slides } =
    attributes;
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const lastIndex = slides.length - 1;
    if (currentIndex < 0) {
      setCurrentIndex(lastIndex);
    }
    if (currentIndex > lastIndex) {
      setCurrentIndex(0);
    }
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (!autoScroll) return;
    let slider = setInterval(() => {
      setCurrentIndex(currentIndex + 1);
    }, 2500);
    return () => {
      clearInterval(slider);
    };
  }, [autoScroll, currentIndex]);

  useEffect(() => {
    if (api) {
      fetch(`${api}/wp-json/wp/v2/posts`)
        .then((response) => response.json())
        .then((data) => {
          setPosts(data);
          const slides = getSlideData(data);
          setAttributes({ slides: [...slides] });
        });
    }
  }, [api]);

  function removeHtmlAndBrackets(str) {
    // Remove HTML tags
    let cleanStr = str.replace(/<\/?[^>]+(>|$)/g, "");
    // Remove brackets but keep the content inside
    cleanStr = cleanStr.replace(/[\[\]\(\)\{\}]/g, "");
    return cleanStr.trim();
}

  const getSlideData = (posts) => {
    const temp = [];

    posts.forEach((post) => {
      const postData = {};
      fetch(post._links["wp:featuredmedia"][0].href)
        .then((response) => response.json())
        .then((data) => {
          postData["thumbnail"] = data.guid.rendered;
        });

      postData["title"] = post.title.rendered;
      postData["excerpt"] = removeHtmlAndBrackets(post.excerpt.rendered);
      postData["temp"] = post.excerpt.rendered;
      postData["date"] = post.date;

      temp.push(postData);
    });

    return temp;
  };
  

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const setURL = (value) => {
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
        {slides.length > 0 ? (
          <>
            <div className="slideshow-container">
              {slides.map((slide, index) => {
                let position = "nextSlide";
                if (index === currentIndex) {
                  position = "activeSlide";
                }
                if (
                  index === currentIndex - 1 ||
                  (currentIndex === 0 && index === slides.length - 1)
                ) {
                  position = "lastSlide";
                }
                return (
                  <article className={position} key={slide.title}>
                    <img
                      src={slide.thumbnail}
                      alt={slide.title}
                      className="person-img"
                    />
                    <div className="slider-content">
                      <h4>{slide.title}</h4>
                      <p className="title">{slide.date}</p>
                      <p className="text">{slide.excerpt}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="controls">
              <button className="prev" onClick={handlePrevSlide}>&lt;</button>
              <button className="next" onClick={handleNextSlide}>&gt;</button>
            </div>
          </>
        ) : api || slides.length === 0 ? (
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
