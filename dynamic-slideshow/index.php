<?php
/*
Plugin Name: Dynamic SlideShow
Description: Make slideshow of your recent posts.
Version: 1.0
Author: Tirth
Author URI: 
*/

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Dynamic_Slide_Show {

    public function __construct() {
        add_action( 'init', array( $this, 'admin_assets' ) );
    }

    public function admin_assets() {
        wp_register_style( 'slideshow-css', plugin_dir_url( __FILE__ ) . 'src/style/slider.css' );
        wp_register_script( 'slideshow-js', plugin_dir_url( __FILE__ ) . 'build/index.js', array( 'wp-blocks', 'wp-element', 'wp-editor' ), null, true );

        register_block_type( 'customblock/slideshow', array(
            'editor_script'   => 'slideshow-js',
            'editor_style'    => 'slideshow-css',
            'render_callback' => array( $this, 'the_html' ),
        ));
    }

    public function the_html( $attributes ) {
        if ( ! is_admin() ) {
            wp_enqueue_script( 'frontend-js', plugin_dir_url( __FILE__ ) . 'src/frontend.js', array( 'wp-element' ), null, true );
            wp_enqueue_style( 'frontend-css', plugin_dir_url( __FILE__ ) . 'src/style/slider.css' );
        }

        $auto_scroll = isset( $attributes['autoScroll'] ) ? $attributes['autoScroll'] : null;
        wp_localize_script( 'frontend-js', 'attributes', array( 'autoScroll' => $auto_scroll ) );

        ob_start(); ?>

        <p class="mobile-indication"><span>&#8920; Swipe Left</span>&nbsp;&nbsp;<span>Swipe Right &#8921;</span></p>
        <div class="slideshow-container">
            <?php foreach ( $attributes['slides'] as $key => $slide ) : ?>
                <a href="<?php echo $slide['link'] ?>" target="_blank">
					<article class="slide <?php echo ( 0 === $key ) ? 'activeSlide' : ''; ?>" data-index="<?php echo esc_attr( $key ); ?>">
						<img src="<?php echo esc_url( $slide['thumbnail'] ); ?>" alt="<?php echo esc_attr( $slide['title'] ); ?>" class="person-img" />
						<div class="slider-content">
							<h4><?php echo esc_html( $slide['title'] ); ?></h4>
							<p class="title"><?php echo esc_html( $slide['date'] ); ?></p>
							<p class="text"><?php echo esc_html( $slide['excerpt'] ); ?></p>
						</div>
					</article>
                </a>
            <?php endforeach; ?>
            <button class="prev">&lt;</button>
            <button class="next">&gt;</button>
        </div>

        <?php
        return ob_get_clean();
    }
}

new Dynamic_Slide_Show();
