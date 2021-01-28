var counter = 0;
var right = 0;
var questions = [
    ["How and where did Katie and Mike meet?", "At Princeton orientation", "In the Catskills", "On a backpacking trip", "All of the above", "4"],
    ["For the first six months, we disagreed over our anniversary date – why?", "Katie counted our anniversary from our first kiss and Mike counted it from our first date", "Mike thought our anniversary was September 31st and Katie believed it was October 1st – check a calendar to see who won this one", "Anniversaries are a social construct", "We both forgot the day and couldn’t decide which date to use as a placeholder", "2"],
    ["Despite our different majors, we squeezed in a few classes together - which course did we NOT both take?", "American Cinema", "Children's Literature", "Microeconomics for Public Policy", "Mass Media and American Politics", "4"],
    ["In New York, what was our favorite Sunday morning routine?", "Takeout burritos with Mike’s roommates", "Bagel runs at Tompkins Square", "Eggs and bacon, obviously", "What morning? Sleeping past 2 pm", "1"],
    ["In the year and a half that we were long distance, what was our longest time zone difference?", "3 hours", "2 hours", "7 hours", "10 hours", "4"],
    ["Approximately how many miles have we backpacked together?", "Zero to 100 miles", "Between 100 and 200 miles", "Between 200 and 300 miles", "Idk, but check Mike’s Strava for future updates", "2"],
    ["Mike proposed in Berkeley in August 2019 – which of these things were NOT a part of the experience?", "A trail around sunset", "Katie getting lost and almost not arriving", "A casual long run", "Views of the Bay", "3"],
];

$(document).ready(function () {
    $(document).on("click", ".true", function () {
        right = right + 1;
        $(".true").css("background-color", "#A1C065");
        $(".true").css("color", "white");
        $(".false").css("background-color", "#596B81");
        $(".false").css("color", "white");
        window.setTimeout(nextQuestion, 1200);
    });
    $(document).on("click", ".false", function () {
        $(".true").css("background-color", "#A1C065");
        $(".true").css("color", "white");
        $(".false").css("background-color", "#596B81");
        $(".false").css("color", "white");
        window.setTimeout(nextQuestion, 1200);
    });

    function nextQuestion() {
        document.getElementById("progress").value += 100 / questions.length 
        counter = counter + 1;
        if (counter >= questions.length) {
            $('#a1, #a2, #a3, #a4, #a5, #question').fadeOut("slow", function () {
                if (right == questions.length){
                    var result = $(`<div id='question' class='field is-size-4'><strong class='has-text-success'>You got all ${right}/${questions.length} right.</strong></br><div class='is-size-5'> Wow! You got them all right! Not that you need it, but scroll down to read the full story!</div></div>`).hide();
                }
                else if (right == questions.length - 1){
                    var result = $(`<div id='question' class='field is-size-4'><strong class='has-text-success'>You got ${right}/${questions.length} right.</strong></br><div class='is-size-5'> Pretty good! You must be quite close to Katie and Mike. Scroll down for the full story!</div></div>`).hide();
                }
                else if (right < questions.length - 1 && right >= 2){
                    var result = $(`<div id='question' class='field is-size-4'><strong class='orange'>You got ${right}/${questions.length} right.</strong></br><div class='is-size-5'> You've got some work to do! Scroll down and read up...</div></div>`).hide();
                }
                else {
                    var result = $(`<div id='question' class='field is-size-4'><strong class='has-text-danger'>You got ${right}/${questions.length} right.</strong></br><div class='is-size-5'> Looks like we have a lot to catch up on! Scroll down and take notes...</div></div>`).hide();
                }
                $('#couple-20').replaceWith('<div id="couple-20" class="column is-4 is-offset-1"><p class="title is-2 "><span class="rsvp-label">Your Results</span></p></div>');
                $('#question').replaceWith(result);
                $('#question').fadeIn("slow");
                $('#progress').replaceWith("<p style='line-height:0px;margin:-15px;'><br></p>");
            });
        }
        else {
            $(".true").css("background-color", "#FFFEFE");
            $(".true").css("color", "black");
            $(".false").css("background-color", "#FFFEFE");
            $(".false").css("color", "black");

            $('#question').fadeOut("slow", function () {
                var newQ = $("<div id='question' class='field'><strong>Question " + (counter + 1) + "/" + questions.length + "</strong><label id='real-question' class='label is-size-5'>" + questions[counter][0] + "</label ></div >").hide();
                $(this).replaceWith(newQ);
                $('#question').fadeIn("slow");
            });

            var numAnswers = questions[counter].length - 2;
            var correctAnswer = questions[counter][numAnswers + 1];
            console.log(correctAnswer)

            $('#a1').fadeOut("slow", function () {
                var newa = $(`<p id='a1' class='control'><a class='box ${correctAnswer == 1} '> ${questions[counter][1]}</a></p>`).hide();
                $(this).replaceWith(newa);
                $('#a1').fadeIn("slow");
            });
            $('#a2').fadeOut("slow", function () {
                newa = $(`<p id='a2' class='control'><a class='box ${correctAnswer == 2} '> ${questions[counter][2]}</a></p>`).hide();
                $(this).replaceWith(newa);
                $('#a2').fadeIn("slow");
            });
            $('#a3').fadeOut("slow", function () {
                newa = $(`<p id='a3' class='control'><a class='box ${correctAnswer == 3} '> ${questions[counter][3]}</a></p>`).hide();
                $(this).replaceWith(newa);
                $('#a3').fadeIn("slow");
            });
            $('#a4').fadeOut("slow", function () {
                newa = $(`<p id='a4' class='control'><a class='box ${correctAnswer == 4} '> ${questions[counter][4]}</a></p>`).hide();
                $(this).replaceWith(newa);
                $('#a4').fadeIn("slow");
            });

        }
    }
});
