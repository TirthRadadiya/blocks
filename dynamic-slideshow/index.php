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
    wp_register_style('slideshowCSS', plugin_dir_url(__FILE__) . 'src/style/editor.css');
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
      // wp_enqueue_script('attentionFrontend', plugin_dir_url(__FILE__) . './build/frontend.js', array('wp-element'));
      wp_enqueue_style('frontendStyle', plugin_dir_url(__FILE__) . './src/style/frontend.css');
    }    

    ob_start(); ?>
    <div class="paying-attention-update-me">frontend code here</div>
    <?php return ob_get_clean();
  }
}

new DynamicSlideShow();