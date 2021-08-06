<?php
    require_once('wp-load.php');
    $get = $wpdb->get_results(" 
        SELECT 
            posts.* 
            FROM 
                ".$wpdb->prefix."posts as posts
            
            WHERE 
                posts.post_type='post' 
                AND 
                posts.post_status = 'publish' 
            ");
    echo "<pre>";print_r($get);echo "</pre>";

?>