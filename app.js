var config = {
    apiKey: "AIzaSyC9x7g9G9FrvEOPpZSIj_A9yXy2EobHDT4",
    authDomain: "test-database-480a4.firebaseapp.com",
    databaseURL: "https://test-database-480a4.firebaseio.com",
    projectId: "test-database-480a4",
    storageBucket: "test-database-480a4.appspot.com",
    messagingSenderId: "909099605812"
};
firebase.initializeApp(config);

var database = firebase.database();

$(".submit-btn").on("click", function (event) {
    event.preventDefault();

    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var time = $("#time-input").val().trim();


    var trainInfo = {
        name: name,
        destination: destination,
        frequency: frequency,
        time: time
    }

    database.ref().push(trainInfo);

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#time-input").val("");

});


database.ref().on("child_added", function (snap) {
      
    // finding time of next train and minutes away
    var tFrequency = snap.val().frequency;
    var firstTime = snap.val().time;

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format('LT');
    
    
    var newRow = $("<tr>");

    var trainName = $("<td>").text(snap.val().name);
    var destination = $("<td>").text(snap.val().destination);
    var frequency = $("<td>").text(snap.val().frequency);
    var nextTrainTime = $("<td>").text(nextTrain);
    var minAway = $("<td>").text(tMinutesTillTrain);
    

    newRow.append(trainName, destination, frequency, nextTrainTime, minAway);
    $("#table-body").append(newRow);

}, function (errorobject) {
    alert("error " + errorobject.code);
});