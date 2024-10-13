<?php

/*
  Plugin Name: Dynamic SlideShow
  Description: Make slideshow of you recent posts.
  Version: 1.0
  Author: Tirth
  Author URI: 
*/

if (!defined('ABSPATH'))
  exit; // Exit if accessed directly

class DynamicSlideShow
{
  function __construct()
  {
    add_action('init', array($this, 'adminAssets'));
  }

  function adminAssets()
  {
    wp_register_style('slideshowCSS', plugin_dir_url(__FILE__) . './src/style/editor.css');
    wp_register_script('slideshowJS', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
    register_block_type('customblock/slideshow', array(
      'editor_script' => 'slideshowJS',
      'editor_style' => 'slideshowCSS',
      'render_callback' => array($this, 'theHTML')
    ));
  }

  function theHTML($attributes)
  {
    if (!is_admin()) {
      wp_enqueue_script('frontendJS', plugin_dir_url(__FILE__) . './src/frontend.js', array('wp-element'));
      wp_enqueue_style('frontendStyle', plugin_dir_url(__FILE__) . './src/style/editor.css');
    }
    $autoScroll = @$attributes['autoScroll'] ? $attributes['autoScroll'] : null;
    wp_localize_script('frontendJS', 'attributes', array("autoScroll" => $autoScroll))
      ?>

    <p class="mobile-indication"><span> &#8920; Swipe Left</span>&nbsp;&nbsp;<span>Swipe Right &#8921;</span></p>
    <div class="slideshow-container">
      <?php foreach ($attributes['slides'] as $key => $slide) {
        ?>
        <article class="slide <?php if ($key == 0)
          echo "activeSlide" ?>" data-index="<?php echo $key ?>">
          <img src='<?php echo $slide['thumbnail'] ?>' alt='<?php echo $slide['title'] ?>' class="person-img" />
          <div class="slider-content">
            <h4><?php echo $slide['title'] ?></h4>
            <p class="title"><?php echo $slide['date'] ?></p>
            <p class="text"><?php echo $slide['excerpt'] ?></p>
          </div>
        </article>
        <?php
      } ?>

      <button class="prev">&lt;</button>
      <button class="next">&gt;</button>

    </div>


  <?php }
}

new DynamicSlideShow();