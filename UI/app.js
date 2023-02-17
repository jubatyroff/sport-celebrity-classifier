Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });

    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;

        var url = "http://127.0.0.1:5000/classify_image";

        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {

            console.log(data);
            if (!data || data.length==0) {
                $("#info").hide();
                $("#info1").hide();
                $("#info2").hide();
                $("#info3").hide();
                $("#info4").hide();
                $("#resultHolder").hide();
                $("#infoHolder").hide();
                $("#divClassTable").hide();
                $("#error").show();
                return;
            }
            let players = ["bauyrzhan_islamkhan", "daniyar_yeleussinov", "denis_ten", "elena_rybakina", "gennady_golovkin", "ilya_ilyin", "janibek_alimkhanuly", "olga_rypakova", "shavkat_rakhmonov", "yeldos_smetov"];

            let match = null;
            let bestScore = -1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }
            $("#data-player").hide();
            $("#info-player").hide();
            if (match) {
                $("#error").hide();
                $("#info").show();
                $("#info1").show();
                $("#info2").show();
                $("#info3").show();
                $("#info4").show();
                $("#resultHolder").show();
                $("#infoHolder").show();
                $("#divClassTable").show();
                $("#resultHolder").html($(`[data-player="${match.class}"`).html());
                $("#infoHolder").html($(`[info-player="${match.class}"`).html());
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore);
                }
            }
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#infoHolder").hide();
    $("#divClassTable").hide();
    $("#info").hide();
    $("#info1").hide();
    $("#info2").hide();
    $("#info3").hide();
    $("#info4").hide();


    init();
});