var API_ENDPOINT = 'http://localhost:3000/api/v1'

function getGifs(query, limit, callback, errorCallback) {

    console.log("Getting gifs...");

    var searchUrl = API_ENDPOINT + '/gifs.json?order=random&limit=' + limit;

    var x = new XMLHttpRequest();

    x.open('GET', searchUrl);

    x.responseType = 'json';

    x.onload = function() {

        console.log(x.response);

        // Parse and process the response from Google Image Search.
        var response = x.response;

        if (!response || response.length === 0) {
            console.log('No response from API search!');
            return;
        }

        console.log("returning gifs...");
        callback(response);
    };
    x.onerror = function() {
        console.log('Network error.');
    };
    x.send();
}

function populate_list_from_json(list) {

    $("#gif_list").empty();

    for(i = 0; i < list.length; i++) {

        //console.log("populating: " + list[i].id);

        var image_url_large = list[i].image_url_large;
        var id = list[i].id;
        var gif = $.parseHTML("<img id='gif_small_" + id + "' class='gif_small' src='" + list[i].image_url_small + "' data-image-url-large='" + list[i].image_url_large + "' />");

        $("#gif_list").append(gif);
    }


    $(".gif_small").click(function() {  
        console.log("clicked: " + $(this).attr("id"));
        $('#gif_loading').show();

        $('#gif_large').attr("src", "");

        $('#gif_large').attr("src", $(this).attr("data-image-url-large"));

        $('#gif_large').on('load', function(){
            // hide/remove the loading image
            $('#gif_loading').hide();
        });
        

        // update view count
        chrome.storage.sync.get(['views', 'user_id'], function (result) {
            
            console.log("currently " + result.views + " views");
            console.log("currently " + result.user_id + " user_id");

            // save view count
            chrome.storage.sync.set({'views': result.views + 1}, function (the_result) {

                console.log("Updating views");

                if(result.views >= 1 && !result.user_id) {

                    var the_form = $.parseHTML("<form id='gif_signup'> \
Please sign up to continue\
<input type='text' class='user_email' name='user[email]' id='user_email' placeholder='Your email'><br/>\
<input type='password' class='user_password' name='user[password]' id='user_password' placeholder='A password'><br/>\
<a href='#register' id='register_button'>Sign me up!</a>\
</form>");
                    
                    $("#gif_forms").html(the_form);
                    $("#gif_forms").show();
                    $('#gif_large').hide();
                    
                    /* allow for call*/
                    $("#register_button").click(function() {
                        
                        var url = API_ENDPOINT + '/users.json?user[email]=' + $(".user_email").val() + '&user[password]=' + $(".user_password").val();
                        
                        var x = new XMLHttpRequest();
                        x.open('POST', url);
                        x.responseType = 'json';

                        x.onload = function() {
                            console.log(x.response);
                            var response = x.response;
                            if (!response || response.length === 0) {
                                console.log('No response from User API!');
                                return;
                            }
                            
                            chrome.storage.sync.set({'user_id': response.id}, function (the_next_result) {
                            });
                            
                            $("#gif_forms").hide();
                            $('#gif_large').show();
                            
                        };
                        
                        x.onerror = function() {
                            console.log('Network error.');
                        };
                        x.send();
                    });
                }
            });
        });
    });

    $('#gif_large').attr("src", list[0].image_url_large);

}

$(document).ready(function() {

    var button = $.parseHTML("<div id='gif_button'><img src='" + chrome.extension.getURL('/button.png') + "'></div>");
    var container = $.parseHTML("\
<div id='gif_container'> \
<div id='gif_loading'><img src='" + chrome.extension.getURL('/spinner.gif') + "'></div>\
<div id='gif_close'><a href='#close' id='gif_header'>&times;</a></div>\
<div id='gif_forms'></div>\
<div id='gif_modal'><img id='gif_large'/></div>\
<div id='gif_instructions'>Click and drag me on an email &rarr;</div>\
<div id='gif_list'></div>\
<div id='gif_actions'><a id='refresh' href='#refresh_me'>Refresh</a><a href='#logout' id='logout'>Logout</a></div>\
</div>"
);
    $("body").append(button);
    $("body").append(container);
    
    $("#gif_button").click(function() {
        $("#gif_container").toggle();
        $(this).toggle();
    });

    $("#gif_header").click(function() {
        $("#gif_container").toggle();
        $("#gif_button").toggle();
    });

    // populate initial list
    getGifs("random", 25, function(response) {
        populate_list_from_json(response)
    }, function(errorMessage) {
        alert('Cannot display image. ' + errorMessage);
    });

    $("#refresh").click(function() {
        getGifs("random", 25, function(response) {
            populate_list_from_json(response)
        }, function(errorMessage) {
            alert('Cannot display image. ' + errorMessage);
        });
        
    });

    $("#logout").click(function() {
        chrome.storage.sync.set({'views': null, 'user_id': null}, function (the_result) {
            console.log('Logged out!');
        });
    });
                        
    console.log("Finished content.js")
});
