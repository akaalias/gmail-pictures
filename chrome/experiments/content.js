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

        console.log("populating: " + list[i].id);

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
        chrome.storage.sync.get('views', function (result) {
            // save action count
            chrome.storage.sync.set({'views': result.views + 1}, function (the_result) {
                console.log("Updated view count");

                if(result.views >= 10 && !result.user_token) {
                    var the_form = $.parseHTML("<form id='gif_signup'> \
<p>Please register to continue</p>\
<input type='text' id='email' placeholder='Your email'><br/><br/>\
<input type='password' id='password' placeholder='A password'><br/><br/>\
<input type='submit' id='register' value='Register'>\
</form>");
                    
                    $("#gif_forms").html(the_form);
                    $("#gif_forms").show();
                    $('#gif_large').hide();
                }
                

            });
        });

    });

    $('#gif_large').attr("src", list[0].image_url_large);

}

$(document).ready(function() {

    var button = $.parseHTML("<div id='gif_button'></div>");
    var container = $.parseHTML("\
<div id='gif_container'> \
<div id='gif_loading'><img src='" + chrome.extension.getURL('/spinner.gif') + "'></div>\
<div id='gif_forms'></div>\
<div id='gif_modal'><img id='gif_large'/></div>\
<div id='gif_list'></div>\
<div id='gif_actions'><a id='refresh' href='#refresh'>Refresh</a><a href='#close' id='gif_header'>X</a></div>\
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
                        
    var user_token = "";

    // check if we should require sign up
    chrome.storage.sync.get('views', function (result) {

        if(!result.views || result.views <= 0) {
            chrome.storage.sync.set({'views': 1}, function (the_result) {
                console.log('Initial viewcount set!');
            });
        } else {
            console.log('Current viewcount: ' + result.views);
        }


    });

    console.log("Finished content.js")
});
