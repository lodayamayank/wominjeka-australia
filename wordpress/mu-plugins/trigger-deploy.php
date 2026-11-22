<?php
/**
 * Plugin Name: Wominjeka Australia static site deploy
 */

defined( 'ABSPATH' ) || exit;

function wominjeka_trigger_static_deploy( $new_status, $old_status, $post ) {
	if ( $new_status === $old_status || ( 'publish' !== $new_status && 'publish' !== $old_status ) ) {
		return;
	}

	if ( 'post' !== $post->post_type || wp_is_post_revision( $post->ID ) || wp_is_post_autosave( $post->ID ) ) {
		return;
	}

	if ( ! defined( 'GITHUB_DEPLOY_TOKEN' ) || ! GITHUB_DEPLOY_TOKEN ) {
		return;
	}

	wp_remote_post(
		'https://api.github.com/repos/lodayamayank/wominjeka-australia/dispatches',
		array(
			'blocking'   => false,
			'redirection' => 0,
			'headers'    => array(
				'Authorization' => 'Bearer ' . GITHUB_DEPLOY_TOKEN,
				'Accept'        => 'application/vnd.github+json',
				'Content-Type'  => 'application/json',
			),
			'body'       => wp_json_encode( array( 'event_type' => 'wp-publish' ) ),
		)
	);
}

add_action( 'transition_post_status', 'wominjeka_trigger_static_deploy', 10, 3 );
