var data = []
$(document).ready(function() {
    loadData("https://moloypurcolourpoint.pythonanywhere.com/json%20data/Arambagh English UR.json")
})

function loadData(dataName) {
    data.length = 0;
    const mydata = JSON.parse(JSON.stringify(data))
    $.getJSON(dataName, function(response) {
        var mydata = response.data;
        data.push(...mydata);
        suggestions();
    })
    if (intervalId) {
        clearInterval(intervalId);
    }
}


$(".switch").click(function() {
    $("#amount").css("display", "none")
    var data_type = $("#s_query").attr("data-type")
    var input_field = $("#s_query");
    var curr_search_type = $(".cstype");
    var curr_fun_type = $(".search");
    if (data_type === "number") {
        $("#result").html("")
        input_field.attr({
            placeholder: "Enter name to search...", "data-type": "name", type: "text"
        })
        curr_search_type.html("Search by number instead...")
        curr_fun_type.attr("onclick", "search_by_name()")
        input_field.val("")

    } else {
        $("#result").html("")
        input_field.attr({
            placeholder: "Enter number to search...", "data-type": "number", type: "tel"
        })
        curr_search_type.html("Search by name instead...")
        curr_fun_type.attr("onclick", "search_by_number()")
        input_field.val("")
    }
    suggestions();
})

function search_by_name() {
    $("#amount").css("display",
        "none")
    var data_mode = $('input[name="details_mode"]:checked').val()
    var search_query = $("#s_query").val().trim();
    var checkpoint = 1;
    $("#result").css("display",
        "none")
    $("#result").html("")
    if (intervalId) {
        clearInterval(intervalId);
    }
    for (var i = 0; i < data.length; i++) {
        if (search_query === data[i].name) {
            $("#result").css("display", "flex")
            if (data_mode === "advance") {
                $("#result").html("<p>Name : "+capitalizeWords(data[i].name)+"</p><p>Father Name : "+capitalizeWords(data[i].father)+"</p><p>Mother Name : "+capitalizeWords(data[i].mother)+"</p><p>DOB : "+data[i].dob+"</p><p>Religion : "+data[i].religion+"</p><p>Blood Group : "+data[i].blood_group+"</p><p>Phone Number : +91"+data[i].mobile+"</p><p>Email : "+data[i].email+"</p><p>Adhaar No : "+data[i].aadhar+"</p><p>Address : "+capitalizeWords(data[i].village+", "+data[i].district+", "+data[i].pin)+"</p><p>School : "+capitalizeWords(data[i].school)+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'></img></p><p>Sign : <img class='owner_photo' src='"+data[i].sign+"'></img></p><div class='divider'></div>")
                checkpoint = 0;
            }
            if (checkpoint == 1) {
                $("#result").html("<p>Name : "+data[i].name+"</p><p>Phone Number : +91"+data[i].mobile+"</p><p>Address : "+data[i].village+","+data[i].district+","+data[i].pin+"</p><p>School : "+data[i].school+"</p><p>Photo : <img class='owner_photo' src='"+data[i].photo+"'></img></p><div class='divider'></div>")
                checkpoint = 0;
            }
            checkpoint = 0;
        }
        if (checkpoint == 1) {
            $("#result").css("display", "flex")
            $("#result").text("No data found!")
        }
    }
}
var intervalId;
$("#seeall").click(function() {
    $("#result").html("");
    showData();
    intervalId = setInterval(showData, 10000);
})

var currentIndex = 0;

function showData() {
    const chunkSize = 10;
    const endIndex = Math.min(currentIndex + chunkSize, data.length);
    for (var i = currentIndex; i < endIndex; i++) {
        $("#result").append(`<div class="result_data">
            <p>Name : `+capitalizeWords(data[i].name)+`</p>
            <p>Father Name : `+capitalizeWords(data[i].father)+`</p>
            <p>Mother Name : `+capitalizeWords(data[i].mother)+`</p>
            <p>DOB : `+data[i].dob+`</p>
            <p>Religion : `+data[i].religion+`</p>
            <p>Blood Group : `+data[i].blood_group+`</p>
            <p>Phone Number : +91 `+data[i].mobile+`</p>
            <p>Email : `+data[i].email+`</p>
            <p>Aadhar No : `+data[i].aadhar+`</p>
            <p>Address: `+capitalizeWords(data[i].village+`, `+data[i].district)+`</p>
            <p>School : `+capitalizeWords(data[i].school)+`</p>
            <p>Photo : <img class="owner_photo" src="`+data[i].photo+`" alt="" /></p>
            <p>Sign : <img class="owner_photo" src="`+data[i].sign+`" alt="" /></p>
            <div class="divider">

            </div>
            </div>`);
    }

    currentIndex += chunkSize;

    if (currentIndex >= data.length) {
        clearInterval(intervalId); // Stop the interval when all data is loaded
    }
}


function capitalizeWords(inputString) {
    const words = inputString.split(' ');

    const capitalizedWords = words.map(word => {
        if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
            return word;
        }
    });

    const result = capitalizedWords.join(' ');

    return result;
}

/*-------------- Suggestion --------------*/
function suggestions() {
    var data_type = $("#s_query").attr("data-type")
    $("#osint_sugg").html("")
    $(".loader").css("display",
        "flex")
    if (data_type === "number") {
        for (var i = 0; i < data.length; i++) {
            var num_sugg_list = document.createElement("li")
            num_sugg_list.className = "num_sugg";
            num_sugg_list.innerHTML = data[i].mobile;
            $("#osint_sugg").append(num_sugg_list)
        }
    }
    if (data_type === "name") {
        for (var i = 0; i < data.length; i++) {
            var name_sugg_list = document.createElement("li")
            name_sugg_list.className = "num_sugg"
            name_sugg_list.innerHTML = data[i].name;
            $("#osint_sugg").append(name_sugg_list)
        }
    }
    $(".loader").css("display", "none")
};

$("#s_query").keyup(function() {
    if ($("#s_query").val() === "") {
        $("#osint_sugg").css("display", "none")
    } else {
        $("#osint_sugg").css("display", "block")
    }
    mySearch()
})

function mySearch() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('s_query');
    filter = input.value.toUpperCase();
    ul = document.getElementById("osint_sugg");
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

$("#osint_sugg").click(function(event) {
    var sugg_target = event.target.innerText
    $("#s_query").val(sugg_target)
    $("#osint_sugg").css("display", "none")
    $(".search").click()
})

$("body").click(function() {
    if (event.target != $(".s_query")) {
        $("#osint_sugg").css("display", "none")
    }
})

$("#group_type").change(function() {
    var mDataName = $("#group_type").val()
    switch (mDataName) {
        case '1':
            loadData("https://moloypurcolourpoint.pythonanywhere.com/json%20data/Arambagh English UR.json");
            break;
        case '2':
            loadData("https://moloypurcolourpoint.pythonanywhere.com/json%20data/Arambagh Bengali UR.json");
            break;
        case '3':
            loadData("https://moloypurcolourpoint.pythonanywhere.com/json%20data/Keshabpur English UR.json");
            break;
        case '4':
            loadData("https://moloypurcolourpoint.pythonanywhere.com/json%20data/Keshabpur Education UR.json");
            break;
        case '5':
            loadData("https://moloypurcolourpoint.pythonanywhere.com/json%20data/English Gotan Honours.json")
            break;
        case '6':
            loadData("https://moloypurcolourpoint.pythonanywhere.com/json%20data/Kalipur English UR.json");
            break;
        case '7':
            loadData("https://moloypurcolourpoint.pythonanywhere.com/json%20data/Tarakeswar English UR.json");
            break;
        default:
            // code
        }
    })
