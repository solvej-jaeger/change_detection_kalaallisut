
var jsPsych = initJsPsych({
  show_progress_bar: true,
  message_progress_bar: ' ',
  on_finish: function() {
      //jsPsych.data.get().localSave('csv',participant_id + '_changeblindness_v2.csv')
      //console.log('finished!')
      saveData(participant_id + '_changeblindness_v2.csv', jsPsych.data.get().csv());
      //window.location = "finish.html?participant_code=participant_code"
    }
  })

var timeline = [];

// saving data
function saveData(name, data){
  var url = 'record_results.php';
  var data = {filename: name, filedata: data};

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
            'Content-Type': 'application/json'
    })
  });
}

jsPsych.data.addProperties({start_time: (new Date()).toISOString()});
var participant_id = jsPsych.randomization.randomID(8);
var participant_code = jsPsych.randomization.randomID(8); // for confirming that they're done

jsPsych.data.addProperties({participant: participant_id});
jsPsych.data.addProperties({participant_finish_code: participant_code});


// welcome and full screen
var enter_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message: 
    "<p> Tikilluarit misissuinissamut. </p><p> Qujanaq peqataarusukkavit!</p> ", // Velkommen til eksperimentet. Tak fordi du vil være med!
    //"<p> Misissuineq 30-minutsit missaani sivisussuseqassaaq. </p>", // Undersøgelsen tager cirka 30 minutter
  button_label: "Ingerlaqqinniarlutit una tooruk" // Klik her for at fortsætte
};
timeline.push(enter_fullscreen)


// consent
/*
var consent = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 
    "<p> <i>Ingerlaqqigit</i> toorukku misissueqqissaarneq aallartissaaq. </p>"+ // Når du trykker på fortsæt vil forsøget starte.
    "<p> <i>Ingerlaqqigit</i> toorukku atuartariaasivit aamma apeqqutinut akissutivit paasissutissartaannik uagut katersuisinnaanitsinnut aamma akuersissaatit. </p>"+ // Ved at trykke på 'Fortsæt' giver du også os tilladelse til at indsamle data om hvordan du læser og dine svar på nogle spørgsmål. 
    "<p> Paasissutissat tamarmik kinaassusersineqarsinnaanngitsutut toqqorneqassapput. </p>"+ // Alt data vil blive gemt fuldstændig anonymt.
    "<p> Misilittaanermi peqataarusukkunnaassaguit peqataanerit unitsissinnaavat. Kingornatigut paasissutissat ilinnut tunngasut peerneqassapput. </p>"+ // Hvis du ikke længere har lyst til at være med i eksperimentet, kan du afbryde din deltagelse, hvorefter dine data vil blive slettet. 
    // For at modtage dit gavekort på 60 kr. til Katuaq skal du dog fortsætte helt til slutningen af eksperimentet. Når du er færdig bliver der gemt en fil på din computer som du skal sende til os på xxx@mail.com for at få dit gavekort tilsendt.
    //"<p> Katuamut gavekorti 60 koruuninik nalilik piniarukku, pisariaqarpoq misilittaanerup naammassinissaata tungaanut peqataanissat. </p>"+
    "<p> Allareernittut, qujanarujussuaq peqataaninnut! </p>", // Igen, tusind tak for din deltagelse!
  choices: ['Ingerlaqqigit']
};
timeline.push(consent)
*/

//demographics
var age = {
  type: jsPsychSurveyText,
  questions: [
    { prompt: "Qassinik ukioqarpit?", // How old are you?
      //placeholder: "18", 
      required: true,
      columns: 3, // makes input box smaller
      name: 'age'
    }
  ],
  button_label: "Ingerlaqqigit",
  on_finish: function(data) {
    // save as number
    data.age = parseInt(data.response.age)
  }
}
timeline.push(age)

var language = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    { prompt: "Oqaatsit sorliit ilitsoqqussaraagit?",
      options: ["Kalaallisut", "Qallunaatut", "Kalaallisut qallunaatullu", "Allat"], 
      required: true
    }
  ],
  button_label: "Ingerlaqqigit",
  on_finish: function(data) {
    data.language = data.response.Q0
  }
}
timeline.push(language)

var education = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    { prompt: "Ilinniakkanni sivisunerpaaq sorleq naammassinikuuiuk?",
      options: ["Meeqqat atuarfiat naammassinikuunngilara", "Meeqqat atuarfiat", "Ilinniarnertuunngorniarfik naammassinikuuara", 
        "Naatsumik ilinniagaqarpunga", "Ilinnigaqarpunga (bachelor)", "Ilinniagaqarpunga qaffasissumik, sivisuumik ilinniakkamik"], 
      required: true
    }
  ],
  button_label: "Ingerlaqqigit",
  on_finish: function(data) {
    data.education = data.response.Q0
  }
}
timeline.push(education)

// instructions
var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: 
      "<p>Uani misissuinermi kalaallisut allatanik atualaassuutit.</p>"+ // I dette eksperiment vil du blive bedt om at læse nogle sætninger på grønlandsk.
      "<p>Oqaaseqatigiit ilai assigiiaartiterput, illillu paasiniassavat oqaaseqatigiit sorliit assigeeqqissaarnersut.</p>"+ // Nogle af sætningerne ligner hinanden meget, og din opgave er at finde ud af, om sætningerne er helt ens eller ej.
      //"<p>Oqaaseqatigiinni oqaatsit ataasiakkaarlugit atuassavatit. Oqaatsimiit oqaatsip tullianut nuutsinniaraangakku computerip naqitassaani akunnilersuut tuussavat.</p>"+ // Du kommer til at læse sætningerne et ord ad gangen. Tryk på mellemrumstasten for at gå videre fra et ord til det næste.
      "Toortagaq AKUNNEQ toortassuat suliassap tullianut ingerlaqqinniarlutit."+ // Du skal trykke mellemrum for at gå videre fra den ene sætning til den næste.
      "<p>Siullermik suliassat sisamaasut misiliutigeqqaarumaarpatit.</p>", // Først er der fire øveopgaver.
    choices: ["Aallartinniarlutit una tooruk"], // Klik her for at begynde.
    post_trial_gap: 1000
  };
timeline.push(instructions)

// press space to continue
var press_space = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: " ",
  choices: [" "],
  prompt: "<i>Toortagaq AKUNNEQ tooruk ingerlaqqinniarlutit.</i>" // Tryk på mellemrum for at gå videre
};
timeline.push(press_space)

// total score
let totalScore = 0;

// function for making trials
function make_trial(sentence_id, sentence_id_specific, s1, s2, s1_with_line_breaks, s2_with_line_breaks, s1_danish, s2_danish, change_type, affix_type, affix, filler_condition, target_word, changed_word, target_word_no_affix, reverse_target_position, s1_words, correct_response) {
  var trial = {
    type: jsPsychHtmlKeyboardResponse, //plug into our template
               timeline:[
                // first fixation
                {stimulus: "<p style='font-size:48px'>+</p>",
               choices: "NO_KEYS",
               trial_duration: 200},
               // then show sentence 1
                {type: jsPsychHtmlKeyboardResponse,
                  stimulus:'<div style="font-size:40px">' + s1_with_line_breaks +"</div>",
                choices:[" "]},
                //trial_duration: 5000}, // show the sentence for 5 seconds at most
                // then masking
                {stimulus: "<p style='font-size:48px'>############<br>############<br>############</p>",
               choices: "NO_KEYS",
               trial_duration: 500},
              // then change detection
                {type: jsPsychHtmlButtonResponse,
                  stimulus:'<div style="font-size:40px">' + s2_with_line_breaks +"</div>",
                choices:["Aap","Naamik"], // Ja, Nej
                prompt:"<p><em>Oqaaseqatigiiinni allanngortoqarsimava?</em></p>", // Er der noget i sætningen der har forandret sig?
                on_finish: function(data) {
                  if (data.response == 0) {
                    data.Ychange_Nchange_response = "yes"
                  } else if (data.response == 1) {
                    data.Ychange_Nchange_response = "no"
                  }
                  if (data.response == 1 && change_type == "no_change")  {
                    totalScore += 1
                  }
                  console.log(totalScore)
                }
                },
                // change detection word click
                {type: jsPsychHtmlButtonResponse,
                  stimulus: " ",
                  choices: function() {
                    // if yes, choose which word has changed
                    // if no, press continue
                    if (jsPsych.data.get().last(1).values()[0].Ychange_Nchange_response === "yes") {
                      var splitted = s2.split(" ")
                      var words = []
                      for (var i=0; i<splitted.length; i++) {
                          words.push(splitted[i])
                      }
                      words.push("<span style='font-size: 16px'><i>Oqaaseq ataaseq peqanngilaq</i></span>") // Et ord er forsvundet.
                      return words
                    } else {
                      return ["Ingerlaqqigit"]; // 'continue'
                    }
                  },
                  prompt: function() {
                    if (jsPsych.data.get().last(1).values()[0].Ychange_Nchange_response === "yes") {
                      return "<p>Oqaaseq sorleq allanngorsimava?</p>"; // Hvilket ord har forandret sig?
                    } else {
                      return " ";
                    }
                  },
                  margin_horizontal: '2px',
                  button_html: '<button class="jspsych-btn" style="font-size: 25px";>%choice%</button>',
                  on_load: function() {
                    // move the last button to a new line
                    const buttons = document.querySelectorAll('.jspsych-html-button-response-button');
                    if (buttons.length > 1) {
                      const lastButton = buttons[buttons.length - 1];
                      lastButton.style.display = 'block';
                      lastButton.style.marginTop = '12px';
                    }
                  },
                  on_finish: function (data) {
                    data.sentence_id = sentence_id
                    data.sentence_id_specific = sentence_id_specific
                    data.original_sentence = s1
                    data.repeated_sentence = s2
                    data.original_sentence_with_line_breaks = s1_with_line_breaks
                    data.repeated_sentence_with_line_breaks = s2_with_line_breaks
                    data.original_sentence_danish = s1_danish
                    data.repeated_sentence_danish = s2_danish
                    data.correct_change_answer = change_type
                    data.affix_type = affix_type
                    data.target_affix = affix
                    data.filler_condition = filler_condition
                    data.target_word = target_word
                    data.changed_word = changed_word
                    data.target_word_no_affix = target_word_no_affix
                    data.reverse_target_position = reverse_target_position
                    data.original_sentence_word_count = s1_words
                    data.correct_response = correct_response
                    data.phase = 'change_blindness'
                    if (data.response == data.correct_response && jsPsych.data.get().last(2).values()[0].Ychange_Nchange_response === "yes") {
                      totalScore += 1
                    }
                    console.log(totalScore)
                    saveData(participant_id + '_changeblindness_v2.csv', jsPsych.data.get().csv())
                    //console.log(data.response)
                  }
                }
              ]}
  return trial //return the trial you have built
}

// Now it is easy to build multiple trials using this function.

// stimuli
var sentences = [
  {sentence_id: '1', sentence_id_specific: '1_1', s1: 'Ualimut kammalaatiga pulaariataarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', s2: 'Ualimut kammalaatiga pulaarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', s1_with_line_breaks: '<p> Ualimut kammalaatiga pulaariataarpoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', s2_with_line_breaks: '<p> Ualimut kammalaatiga pulaarpoq </p><p> taamaammat kaffiliorpunga kaagiliorlungalu. </p>', s1_danish: 'I eftermiddag besøgte min ven mig pludselig, så derfor lavede jeg kaffe og bagte kage.', s2_danish: 'I eftermiddag besøgte min ven mig, så derfor lavede jeg kaffe og bagte kage.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'riataar', filler_condition: 'critical', target_word: 'pulaariataarpoq', changed_word: 'pulaarpoq', target_word_no_affix: 'pulaarpoq', reverse_target_position: '4', s1_words: '6', correct_response: '2'},
  {sentence_id: '1', sentence_id_specific: '1_2', s1: 'Ualimut kammalaatiga pulaariataarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', s2: 'Ualimut kammalaatiga pulaariataarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', s1_with_line_breaks: '<p> Ualimut kammalaatiga pulaariataarpoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', s2_with_line_breaks: '<p> Ualimut kammalaatiga pulaariataarpoq </p><p> taamaammat kaffiliorpunga kaagiliorlungalu. </p>', s1_danish: 'I eftermiddag besøgte min ven mig pludselig, så derfor lavede jeg kaffe og bagte kage.', s2_danish: 'I eftermiddag besøgte min ven mig pludselig, så derfor lavede jeg kaffe og bagte kage.', change_type: 'no_change', affix_type: 'lexical', affix: 'riataar', filler_condition: 'filler', target_word: 'pulaariataarpoq', changed_word: 'pulaariataarpoq', target_word_no_affix: 'pulaarpoq', reverse_target_position: '4', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '1', sentence_id_specific: '1_3', s1: 'Ualimut kammalaatiga pulaarunnarsivoq taamaammat kaffiliorpunga kaagiliorlungalu.', s2: 'Ualimut kammalaatiga pulaarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', s1_with_line_breaks: '<p> Ualimut kammalaatiga pulaarunnarsivoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', s2_with_line_breaks: '<p> Ualimut kammalaatiga pulaarpoq </p><p> taamaammat kaffiliorpunga kaagiliorlungalu. </p>', s1_danish: 'I eftermiddag besøger min ven mig formodentlig, så derfor laver jeg kaffe og bager kage.', s2_danish: 'I eftermiddag besøger min ven mig, så derfor laver jeg kaffe og bager kage.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'junnarsi', filler_condition: 'critical', target_word: 'pulaarunnarsivoq', changed_word: 'pulaarpoq', target_word_no_affix: 'pulaarpoq', reverse_target_position: '4', s1_words: '6', correct_response: '2'},
  {sentence_id: '1', sentence_id_specific: '1_4', s1: 'Ualimut kammalaatiga pulaarunnarsivoq taamaammat kaffiliorpunga kaagiliorlungalu.', s2: 'Ualimut kammalaatiga pulaarunnarsivoq taamaammat kaffiliorpunga kaagiliorlungalu.', s1_with_line_breaks: '<p> Ualimut kammalaatiga pulaarunnarsivoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', s2_with_line_breaks: '<p> Ualimut kammalaatiga pulaarunnarsivoq </p><p> taamaammat kaffiliorpunga kaagiliorlungalu. </p>', s1_danish: 'I eftermiddag besøger min ven mig formodentlig, så derfor laver jeg kaffe og bager kage.', s2_danish: 'I eftermiddag besøger min ven mig formodentlig, så derfor laver jeg kaffe og bager kage.', change_type: 'no_change', affix_type: 'grammatical', affix: 'junnarsi', filler_condition: 'filler', target_word: 'pulaarunnarsivoq', changed_word: 'pulaarunnarsivoq', target_word_no_affix: 'pulaarpoq', reverse_target_position: '4', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '1', sentence_id_specific: '1_5', s1: 'Ualimut kammalaatiga pulaarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', s2: 'Ualimut pulaarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', s1_with_line_breaks: '<p> Ualimut kammalaatiga pulaarpoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', s2_with_line_breaks: '<p> Ualimut pulaarpoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', s1_danish: 'I eftermiddag besøgte min ven mig, så derfor lavede jeg kaffe og bagte kage.', s2_danish: 'I eftermiddag besøgte han mig, så derfor lavede jeg kaffe og bagte kage.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'kammalaatiga', changed_word: 'NA', target_word_no_affix: 'pulaarpoq', reverse_target_position: '5', s1_words: '6', correct_response: '5'},
  {sentence_id: '1', sentence_id_specific: '1_6', s1: 'Ualimut kammalaatiga pulaarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', s2: 'Ualimut kammalaatiga pulaarpoq taamaammat kaffiliorpunga torersaallugalu.', s1_with_line_breaks: '<p> Ualimut kammalaatiga pulaarpoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', s2_with_line_breaks: '<p> Ualimut kammalaatiga pulaarpoq </p><p> taamaammat kaffiliorpunga torersaallugalu. </p>', s1_danish: 'I eftermiddag besøgte min ven mig, så derfor lavede jeg kaffe og bagte kage.', s2_danish: 'I eftermiddag besøgte min ven mig, så derfor lavede jeg kaffe og ryddede op.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'kaagiliorlungalu', changed_word: 'torersaallugalu', target_word_no_affix: 'pulaarpoq', reverse_target_position: '1', s1_words: '6', correct_response: '5'},
  {sentence_id: '2', sentence_id_specific: '2_1', s1: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerniarsarivoq.', s2: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerpoq.', s1_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat taamaammat </p><p> Minik qulinik ukiulik sanerniarsarivoq. </p>', s2_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat </p><p> taamaammat Minik qulinik ukiulik sanerpoq. </p>', s1_danish: 'Køkkengulvet er meget snavset, derfor prøver tiårige Minik på at feje.', s2_danish: 'Køkkengulvet er meget snavset, derfor fejer tiårige Minik.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'niarsare', filler_condition: 'critical', target_word: 'sanerniarsarivoq', changed_word: 'sanerpoq', target_word_no_affix: 'sanerpoq', reverse_target_position: '1', s1_words: '8', correct_response: '7'},
  {sentence_id: '2', sentence_id_specific: '2_2', s1: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerniarsarivoq.', s2: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerniarsarivoq.', s1_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat taamaammat </p><p> Minik qulinik ukiulik sanerniarsarivoq. </p>', s2_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat </p><p> taamaammat Minik qulinik ukiulik sanerniarsarivoq. </p>', s1_danish: 'Køkkengulvet er meget snavset, derfor prøver tiårige Minik på at feje.', s2_danish: 'Køkkengulvet er meget snavset, derfor prøver tiårige Minik på at feje.', change_type: 'no_change', affix_type: 'lexical', affix: 'niarsare', filler_condition: 'filler', target_word: 'sanerniarsarivoq', changed_word: 'sanerniarsarivoq', target_word_no_affix: 'sanerpoq', reverse_target_position: '1', s1_words: '8', correct_response: 'NA'},
  {sentence_id: '2', sentence_id_specific: '2_3', s1: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanernikuuvoq.', s2: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerpoq.', s1_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat taamaammat </p><p> Minik qulinik ukiulik sanernikuuvoq. </p>', s2_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat </p><p> taamaammat Minik qulinik ukiulik sanerpoq. </p>', s1_danish: 'Køkkengulvet var meget snavset, derfor har tiårige Minik engang fejet.', s2_danish: 'Køkkengulvet er meget snavset, derfor fejer tiårige Minik.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'nikuu', filler_condition: 'critical', target_word: 'sanernikuuvoq', changed_word: 'sanerpoq', target_word_no_affix: 'sanerpoq', reverse_target_position: '1', s1_words: '8', correct_response: '7'},
  {sentence_id: '2', sentence_id_specific: '2_4', s1: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanernikuuvoq.', s2: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanernikuuvoq.', s1_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat taamaammat </p><p> Minik qulinik ukiulik sanernikuuvoq. </p>', s2_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat </p><p> taamaammat Minik qulinik ukiulik sanernikuuvoq. </p>', s1_danish: 'Køkkengulvet var meget snavset, derfor har tiårige Minik engang fejet.', s2_danish: 'Køkkengulvet var meget snavset, derfor har tiårige Minik engang fejet.', change_type: 'no_change', affix_type: 'grammatical', affix: 'nikuu', filler_condition: 'filler', target_word: 'sanernikuuvoq', changed_word: 'sanernikuuvoq', target_word_no_affix: 'sanerpoq', reverse_target_position: '1', s1_words: '8', correct_response: 'NA'},
  {sentence_id: '2', sentence_id_specific: '2_5', s1: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerpoq.', s2: 'Igaffimmi nateq saneqangaarmat taamaammat qulinik ukiulik sanerpoq.', s1_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat taamaammat </p><p> Minik qulinik ukiulik sanerpoq. </p>', s2_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat </p><p> taamaammat qulinik ukiulik sanerpoq. </p>', s1_danish: 'Køkkengulvet er meget snavset, derfor fejer tiårige Minik.', s2_danish: 'Køkkengulvet er meget snavset, derfor fejer den tiårige.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Minik', changed_word: 'NA', target_word_no_affix: 'sanerpoq', reverse_target_position: '4', s1_words: '8', correct_response: '7'},
  {sentence_id: '2', sentence_id_specific: '2_6', s1: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerpoq.', s2: 'Inimi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerpoq.', s1_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat taamaammat </p><p> Minik qulinik ukiulik sanerpoq. </p>', s2_with_line_breaks: '<p> Inimi nateq saneqangaarmat </p><p> taamaammat Minik qulinik ukiulik sanerpoq. </p>', s1_danish: 'Køkkengulvet er meget snavset, derfor fejer tiårige Minik.', s2_danish: 'Stuegulvet er meget snavset, derfor fejer tiårige Minik.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'Igaffimmi', changed_word: 'Inimi', target_word_no_affix: 'sanerpoq', reverse_target_position: '8', s1_words: '8', correct_response: '0'},
  {sentence_id: '3', sentence_id_specific: '3_1', s1: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisartuaannarpoq.', s2: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarpoq.', s1_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq </p><p> taamaattorli Aputsiaq suli aalisartuaannarpoq. </p>', s2_with_line_breaks: '<p> Ukiup taamaalinerani assut </p><p> silarluttarpoq taamaattorli Aputsiaq suli aalisarpoq. </p>', s1_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq fisker hele tiden alligevel.', s2_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq fisker alligevel.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'juaannar', filler_condition: 'critical', target_word: 'aalisartuaannarpoq', changed_word: 'aalisarpoq', target_word_no_affix: 'aalisarpoq', reverse_target_position: '1', s1_words: '8', correct_response: '7'},
  {sentence_id: '3', sentence_id_specific: '3_2', s1: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisartuaannarpoq.', s2: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisartuaannarpoq.', s1_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq </p><p> taamaattorli Aputsiaq suli aalisartuaannarpoq. </p>', s2_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq taamaattorli </p><p> Aputsiaq suli aalisartuaannarpoq. </p>', s1_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq fisker hele tiden alligevel.', s2_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq fisker hele tiden alligevel.', change_type: 'no_change', affix_type: 'lexical', affix: 'juaannar', filler_condition: 'filler', target_word: 'aalisartuaannarpoq', changed_word: 'aalisartuaannarpoq', target_word_no_affix: 'aalisarpoq', reverse_target_position: '1', s1_words: '8', correct_response: 'NA'},
  {sentence_id: '3', sentence_id_specific: '3_3', s1: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarumaarpoq.', s2: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarpoq.', s1_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq </p><p> taamaattorli Aputsiaq suli aalisarumaarpoq. </p>', s2_with_line_breaks: '<p> Ukiup taamaalinerani assut </p><p> silarluttarpoq taamaattorli Aputsiaq suli aalisarpoq. </p>', s1_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq vil nok fiske alligevel.', s2_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq fisker alligevel.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'jumaar', filler_condition: 'critical', target_word: 'aalisarumaarpoq', changed_word: 'aalisarpoq', target_word_no_affix: 'aalisarpoq', reverse_target_position: '1', s1_words: '8', correct_response: '7'},
  {sentence_id: '3', sentence_id_specific: '3_4', s1: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarumaarpoq.', s2: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarumaarpoq.', s1_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq </p><p> taamaattorli Aputsiaq suli aalisarumaarpoq. </p>', s2_with_line_breaks: '<p> Ukiup taamaalinerani assut </p><p> silarluttarpoq taamaattorli Aputsiaq suli aalisarumaarpoq. </p>', s1_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq vil nok fiske alligevel.', s2_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq vil nok fiske alligevel.', change_type: 'no_change', affix_type: 'grammatical', affix: 'jumaar', filler_condition: 'filler', target_word: 'aalisarumaarpoq', changed_word: 'aalisarumaarpoq', target_word_no_affix: 'aalisarpoq', reverse_target_position: '1', s1_words: '8', correct_response: 'NA'},
  {sentence_id: '3', sentence_id_specific: '3_5', s1: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarpoq.', s2: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli suli aalisarpoq.', s1_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq </p><p> taamaattorli Aputsiaq suli aalisarpoq. </p>', s2_with_line_breaks: '<p> Ukiup taamaalinerani assut </p><p> silarluttarpoq taamaattorli suli aalisarpoq. </p>', s1_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq fisker alligevel.', s2_danish: 'På denne tid af året er det meget dårligt vejr, men han fisker alligevel.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Aputsiaq', changed_word: 'NA', target_word_no_affix: 'aalisarpoq', reverse_target_position: '3', s1_words: '8', correct_response: '7'},
  {sentence_id: '3', sentence_id_specific: '3_6', s1: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarpoq.', s2: 'Ukiup taamaalinerani assut silagittarpoq taamaattorli Aputsiaq suli aalisarpoq.', s1_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq </p><p> taamaattorli Aputsiaq suli aalisarpoq. </p>', s2_with_line_breaks: '<p> Ukiup taamaalinerani assut </p><p> silagittarpoq taamaattorli Aputsiaq suli aalisarpoq. </p>', s1_danish: 'På denne tid af året er det meget dårligt vejr, men Aputsiaq fisker alligevel.', s2_danish: 'På denne tid af året er det meget godt vejr, men Aputsiaq fisker alligevel.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'silarluttarpoq', changed_word: 'silagittarpoq', target_word_no_affix: 'aalisarpoq', reverse_target_position: '5', s1_words: '8', correct_response: '3'},
  {sentence_id: '4', sentence_id_specific: '4_1', s1: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapinneruvoq atuagassaqaqaarlu.', s2: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapippoq atuagassaqaqaarlu.', s1_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat </p><p> ilinniartoq ulapinneruvoq atuagassaqaqaarlu. </p>', s2_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat ilinniartoq </p><p> ulapippoq atuagassaqaqaarlu. </p>', s1_danish: 'Det er eksamenstid, så den studerende har mere travlt og har meget at læse.', s2_danish: 'Det er eksamenstid, så den studerende har travlt og har meget at læse.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'neru', filler_condition: 'critical', target_word: 'ulapinneruvoq', changed_word: 'ulapippoq', target_word_no_affix: 'ulapippoq', reverse_target_position: '2', s1_words: '6', correct_response: '4'},
  {sentence_id: '4', sentence_id_specific: '4_2', s1: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapinneruvoq atuagassaqaqaarlu.', s2: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapinneruvoq atuagassaqaqaarlu.', s1_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat </p><p> ilinniartoq ulapinneruvoq atuagassaqaqaarlu. </p>', s2_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat ilinniartoq </p><p> ulapinneruvoq atuagassaqaqaarlu. </p>', s1_danish: 'Det er eksamenstid, så den studerende har mere travlt og har meget at læse.', s2_danish: 'Det er eksamenstid, så den studerende har mere travlt og har meget at læse.', change_type: 'no_change', affix_type: 'lexical', affix: 'neru', filler_condition: 'filler', target_word: 'ulapinneruvoq', changed_word: 'ulapinneruvoq', target_word_no_affix: 'ulapippoq', reverse_target_position: '2', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '4', sentence_id_specific: '4_3', s1: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapinnguatsiarpoq atuagassaqaqaarlu.', s2: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapippoq atuagassaqaqaarlu.', s1_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat </p><p> ilinniartoq ulapinnguatsiarpoq atuagassaqaqaarlu. </p>', s2_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat ilinniartoq </p><p> ulapippoq atuagassaqaqaarlu. </p>', s1_danish: 'Det er eksamenstid, så den studerende har sikkert travlt og har meget at læse.', s2_danish: 'Det er eksamenstid, så den studerende har travlt og har meget at læse.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'nnguatsiar', filler_condition: 'critical', target_word: 'ulapinnguatsiarpoq', changed_word: 'ulapippoq', target_word_no_affix: 'ulapippoq', reverse_target_position: '2', s1_words: '6', correct_response: '4'},
  {sentence_id: '4', sentence_id_specific: '4_4', s1: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapinnguatsiarpoq atuagassaqaqaarlu.', s2: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapinnguatsiarpoq atuagassaqaqaarlu.', s1_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat </p><p> ilinniartoq ulapinnguatsiarpoq atuagassaqaqaarlu. </p>', s2_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat ilinniartoq </p><p> ulapinnguatsiarpoq atuagassaqaqaarlu. </p>', s1_danish: 'Det er eksamenstid, så den studerende har sikkert travlt og har meget at læse.', s2_danish: 'Det er eksamenstid, så den studerende har sikkert travlt og har meget at læse.', change_type: 'no_change', affix_type: 'grammatical', affix: 'nnguatsiar', filler_condition: 'filler', target_word: 'ulapinnguatsiarpoq', changed_word: 'ulapinnguatsiarpoq', target_word_no_affix: 'ulapippoq', reverse_target_position: '2', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '4', sentence_id_specific: '4_5', s1: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapippoq atuagassaqaqaarlu.', s2: 'Soraarummeerfiup naligivaa taamaammat ulapippoq atuagassaqaqaarlu.', s1_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat </p><p> ilinniartoq ulapippoq atuagassaqaqaarlu. </p>', s2_with_line_breaks: '<p> Soraarummeerfiup naligivaa </p><p> taamaammat ulapippoq atuagassaqaqaarlu. </p>', s1_danish: 'Det er eksamenstid, så den studerende har travlt og har meget at læse.', s2_danish: 'Det er eksamenstid, så hun har travlt og har meget at læse.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'ilinniartoq', changed_word: 'NA', target_word_no_affix: 'ulapippoq', reverse_target_position: '3', s1_words: '6', correct_response: '5'},
  {sentence_id: '4', sentence_id_specific: '4_6', s1: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapippoq atuagassaqaqaarlu.', s2: 'Juullip naligivaa taamaammat ilinniartoq ulapippoq atuagassaqaqaarlu.', s1_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat </p><p> ilinniartoq ulapippoq atuagassaqaqaarlu. </p>', s2_with_line_breaks: '<p> Juullip naligivaa taamaammat ilinniartoq </p><p> ulapippoq atuagassaqaqaarlu. </p>', s1_danish: 'Det er eksamenstid, så den studerende har travlt og har meget at læse.', s2_danish: 'Det er juletid, så den studerende har travlt og har meget at læse.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'Soraarummeerfiup', changed_word: 'Juullip', target_word_no_affix: 'ulapippoq', reverse_target_position: '6', s1_words: '6', correct_response: '0'},
  {sentence_id: '5', sentence_id_specific: '5_1', s1: 'Sila qiianarmat siallerlunilu meeqqat nuffaseriataarput angerlarsimallutillu.', s2: 'Sila qiianarmat siallerlunilu meeqqat nuffaserput angerlarsimallutillu.', s1_with_line_breaks: '<p> Sila qiianarmat siallerlunilu meeqqat </p><p> nuffaseriataarput angerlarsimallutillu. </p>', s2_with_line_breaks: '<p> Sila qiianarmat siallerlunilu </p><p> meeqqat nuffaserput angerlarsimallutillu. </p>', s1_danish: 'Da vejret er koldt og det regner meget bliver børnene pludselig forkølede og bliver hjemme.', s2_danish: 'Da vejret er koldt og det regner meget bliver børnene forkølede og bliver hjemme.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'riataar', filler_condition: 'critical', target_word: 'nuffaseriataarput', changed_word: 'nuffaserput', target_word_no_affix: 'nuffaserput', reverse_target_position: '2', s1_words: '6', correct_response: '4'},
  {sentence_id: '5', sentence_id_specific: '5_2', s1: 'Sila qiianarmat siallerlunilu meeqqat nuffaseriataarput angerlarsimallutillu.', s2: 'Sila qiianarmat siallerlunilu meeqqat nuffaseriataarput angerlarsimallutillu.', s1_with_line_breaks: '<p> Sila qiianarmat siallerlunilu meeqqat </p><p> nuffaseriataarput angerlarsimallutillu. </p>', s2_with_line_breaks: '<p> Sila qiianarmat siallerlunilu </p><p> meeqqat nuffaseriataarput angerlarsimallutillu. </p>', s1_danish: 'Da vejret er koldt og det regner meget bliver børnene pludselig forkølede og bliver hjemme.', s2_danish: 'Da vejret er koldt og det regner meget bliver børnene pludselig forkølede og bliver hjemme.', change_type: 'no_change', affix_type: 'lexical', affix: 'riataar', filler_condition: 'filler', target_word: 'nuffaseriataarput', changed_word: 'nuffaseriataarput', target_word_no_affix: 'nuffaserput', reverse_target_position: '2', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '5', sentence_id_specific: '5_3', s1: 'Sila qiianarmat siallerlunilu meeqqat nuffaseqqajaapput angerlarsimallutillu.', s2: 'Sila qiianarmat siallerlunilu meeqqat nuffaserput angerlarsimallutillu.', s1_with_line_breaks: '<p> Sila qiianarmat siallerlunilu meeqqat </p><p> nuffaseqqajaapput angerlarsimallutillu. </p>', s2_with_line_breaks: '<p> Sila qiianarmat siallerlunilu </p><p> meeqqat nuffaserput angerlarsimallutillu. </p>', s1_danish: 'Da vejret er koldt og det regner meget har børnene nemt ved at blive forkølede og bliver hjemme.', s2_danish: 'Da vejret er koldt og det regner meget bliver børnene forkølede og bliver hjemme.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'qqajaa', filler_condition: 'critical', target_word: 'nuffaseqqajaapput', changed_word: 'nuffaserput', target_word_no_affix: 'nuffaserput', reverse_target_position: '2', s1_words: '6', correct_response: '4'},
  {sentence_id: '5', sentence_id_specific: '5_4', s1: 'Sila qiianarmat siallerlunilu meeqqat nuffaseqqajaapput angerlarsimallutillu.', s2: 'Sila qiianarmat siallerlunilu meeqqat nuffaseqqajaapput angerlarsimallutillu.', s1_with_line_breaks: '<p> Sila qiianarmat siallerlunilu meeqqat </p><p> nuffaseqqajaapput angerlarsimallutillu. </p>', s2_with_line_breaks: '<p> Sila qiianarmat siallerlunilu </p><p> meeqqat nuffaseqqajaapput angerlarsimallutillu. </p>', s1_danish: 'Da vejret er koldt og det regner meget har børnene nemt ved at blive forkølede og bliver hjemme.', s2_danish: 'Da vejret er koldt og det regner meget har børnene nemt ved at blive forkølede og bliver hjemme.', change_type: 'no_change', affix_type: 'grammatical', affix: 'qqajaa', filler_condition: 'filler', target_word: 'nuffaseqqajaapput', changed_word: 'nuffaseqqajaapput', target_word_no_affix: 'nuffaserput', reverse_target_position: '2', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '5', sentence_id_specific: '5_5', s1: 'Sila qiianarmat siallerlunilu meeqqat nuffaserput angerlarsimallutillu.', s2: 'Sila qiianarmat siallerlunilu nuffaserput angerlarsimallutillu.', s1_with_line_breaks: '<p> Sila qiianarmat siallerlunilu meeqqat </p><p> nuffaserput angerlarsimallutillu. </p>', s2_with_line_breaks: '<p> Sila qiianarmat siallerlunilu </p><p> nuffaserput angerlarsimallutillu. </p>', s1_danish: 'Da vejret er koldt og det regner meget bliver børnene forkølede og bliver hjemme.', s2_danish: 'Da vejret er koldt og det regner meget bliver de forkølede og bliver hjemme.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'meeqqat', changed_word: 'NA', target_word_no_affix: 'nuffaserput', reverse_target_position: '3', s1_words: '6', correct_response: '5'},
  {sentence_id: '5', sentence_id_specific: '5_6', s1: 'Sila qiianarmat siallerlunilu meeqqat nuffaserput angerlarsimallutillu.', s2: 'Sila anorlermat siallerlunilu meeqqat nuffaserput angerlarsimallutillu.', s1_with_line_breaks: '<p> Sila qiianarmat siallerlunilu meeqqat </p><p> nuffaserput angerlarsimallutillu. </p>', s2_with_line_breaks: '<p> Sila anorlermat siallerlunilu </p><p> meeqqat nuffaserput angerlarsimallutillu. </p>', s1_danish: 'Da vejret er koldt og det regner meget bliver børnene forkølede og bliver hjemme.', s2_danish: 'Da vejret er blæsende og det regner meget bliver børnene forkølede og bliver hjemme.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'qiianarmat', changed_word: 'anorlermat', target_word_no_affix: 'nuffaserput', reverse_target_position: '5', s1_words: '6', correct_response: '1'},
  {sentence_id: '6', sentence_id_specific: '6_1', s1: 'Assut siallingaatsialermat Ivalu anipallappoq manisallu eqqullugit.', s2: 'Assut siallingaatsialermat Ivalu anivoq manisallu eqqullugit.', s1_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu anipallappoq </p><p> manisallu eqqullugit. </p>', s2_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu </p><p> anivoq manisallu eqqullugit. </p>', s1_danish: 'Da det begynder at regne meget skynder Ivalu sig ud og tager vasketøjet ind.', s2_danish: 'Da det begynder at regne meget går Ivalu ud og tager vasketøjet ind.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'pallag', filler_condition: 'critical', target_word: 'anipallappoq', changed_word: 'anivoq', target_word_no_affix: 'anivoq', reverse_target_position: '3', s1_words: '6', correct_response: '3'},
  {sentence_id: '6', sentence_id_specific: '6_2', s1: 'Assut siallingaatsialermat Ivalu anipallappoq manisallu eqqullugit.', s2: 'Assut siallingaatsialermat Ivalu anipallappoq manisallu eqqullugit.', s1_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu anipallappoq </p><p> manisallu eqqullugit. </p>', s2_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu </p><p> anipallappoq manisallu eqqullugit. </p>', s1_danish: 'Da det begynder at regne meget skynder Ivalu sig ud og tager vasketøjet ind.', s2_danish: 'Da det begynder at regne meget skynder Ivalu sig ud og tager vasketøjet ind.', change_type: 'no_change', affix_type: 'lexical', affix: 'pallag', filler_condition: 'filler', target_word: 'anipallappoq', changed_word: 'anipallappoq', target_word_no_affix: 'anivoq', reverse_target_position: '3', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '6', sentence_id_specific: '6_3', s1: 'Assut siallingaatsialermat Ivalu aneriikatappoq manisallu eqqullugit.', s2: 'Assut siallingaatsialermat Ivalu anivoq manisallu eqqullugit.', s1_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu aneriikatappoq </p><p> manisallu eqqullugit. </p>', s2_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu </p><p> anivoq manisallu eqqullugit. </p>', s1_danish: 'Da det begynder at regne meget er Ivalu allerede gået ud og har taget vasketøjet ind.', s2_danish: 'Da det begynder at regne meget går Ivalu ud og tager vasketøjet ind.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'riikatag', filler_condition: 'critical', target_word: 'aneriikatappoq', changed_word: 'anivoq', target_word_no_affix: 'anivoq', reverse_target_position: '3', s1_words: '6', correct_response: '3'},
  {sentence_id: '6', sentence_id_specific: '6_4', s1: 'Assut siallingaatsialermat Ivalu aneriikatappoq manisallu eqqullugit.', s2: 'Assut siallingaatsialermat Ivalu aneriikatappoq manisallu eqqullugit.', s1_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu aneriikatappoq </p><p> manisallu eqqullugit. </p>', s2_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu </p><p> aneriikatappoq manisallu eqqullugit. </p>', s1_danish: 'Da det begynder at regne meget er Ivalu allerede gået ud og har taget vasketøjet ind.', s2_danish: 'Da det begynder at regne meget er Ivalu allerede gået ud og har taget vasketøjet ind.', change_type: 'no_change', affix_type: 'grammatical', affix: 'riikatag', filler_condition: 'filler', target_word: 'aneriikatappoq', changed_word: 'aneriikatappoq', target_word_no_affix: 'anivoq', reverse_target_position: '3', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '6', sentence_id_specific: '6_5', s1: 'Assut siallingaatsialermat Ivalu anivoq manisallu eqqullugit.', s2: 'Assut siallingaatsialermat anivoq manisallu eqqullugit.', s1_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu anivoq </p><p> manisallu eqqullugit. </p>', s2_with_line_breaks: '<p> Assut siallingaatsialermat anivoq </p><p> manisallu eqqullugit. </p>', s1_danish: 'Da det begynder at regne meget går Ivalu ud og tager vasketøjet ind.', s2_danish: 'Da det begynder at regne meget går hun ud og tager vasketøjet ind.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Ivalu', changed_word: 'NA', target_word_no_affix: 'anivoq', reverse_target_position: '4', s1_words: '6', correct_response: '5'},
  {sentence_id: '6', sentence_id_specific: '6_6', s1: 'Assut siallingaatsialermat Ivalu anivoq manisallu eqqullugit.', s2: 'Assut anorlingaatsialermat Ivalu anivoq manisallu eqqullugit.', s1_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu anivoq </p><p> manisallu eqqullugit. </p>', s2_with_line_breaks: '<p> Assut anorlingaatsialermat Ivalu </p><p> anivoq manisallu eqqullugit. </p>', s1_danish: 'Da det begynder at regne meget går Ivalu ud og tager vasketøjet ind.', s2_danish: 'Da det begynder at blæse meget går Ivalu ud og tager vasketøjet ind.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'siallingaatsialermat', changed_word: 'anorlingaatsialermat', target_word_no_affix: 'anivoq', reverse_target_position: '5', s1_words: '6', correct_response: '1'},
  {sentence_id: '7', sentence_id_specific: '7_1', s1: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerineruvoq.', s2: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerivoq.', s1_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat nukappiaraq pilerineruvoq. </p>', s2_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut piniarmat </p><p> nukappiaraq pilerivoq. </p>', s1_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig mere.', s2_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'neru', filler_condition: 'critical', target_word: 'pilerineruvoq', changed_word: 'pilerivoq', target_word_no_affix: 'pilerivoq', reverse_target_position: '1', s1_words: '6', correct_response: '5'},
  {sentence_id: '7', sentence_id_specific: '7_2', s1: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerineruvoq.', s2: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerineruvoq.', s1_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat nukappiaraq pilerineruvoq. </p>', s2_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut piniarmat </p><p> nukappiaraq pilerineruvoq. </p>', s1_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig mere.', s2_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig mere.', change_type: 'no_change', affix_type: 'lexical', affix: 'neru', filler_condition: 'filler', target_word: 'pilerineruvoq', changed_word: 'pilerineruvoq', target_word_no_affix: 'pilerivoq', reverse_target_position: '1', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '7', sentence_id_specific: '7_3', s1: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerinnguatsiarpoq.', s2: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerivoq.', s1_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat nukappiaraq pilerinnguatsiarpoq. </p>', s2_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut piniarmat </p><p> nukappiaraq pilerivoq. </p>', s1_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig formodentlig.', s2_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'nnguatsiar', filler_condition: 'critical', target_word: 'pilerinnguatsiarpoq', changed_word: 'pilerivoq', target_word_no_affix: 'pilerivoq', reverse_target_position: '1', s1_words: '6', correct_response: '5'},
  {sentence_id: '7', sentence_id_specific: '7_4', s1: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerinnguatsiarpoq.', s2: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerinnguatsiarpoq.', s1_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat nukappiaraq pilerinnguatsiarpoq. </p>', s2_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut piniarmat </p><p> nukappiaraq pilerinnguatsiarpoq. </p>', s1_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig formodentlig.', s2_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig formodentlig.', change_type: 'no_change', affix_type: 'grammatical', affix: 'nnguatsiar', filler_condition: 'filler', target_word: 'pilerinnguatsiarpoq', changed_word: 'pilerinnguatsiarpoq', target_word_no_affix: 'pilerivoq', reverse_target_position: '1', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '7', sentence_id_specific: '7_5', s1: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerivoq.', s2: 'Aqagu tivoli illoqarfimmut piniarmat pilerivoq.', s1_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat nukappiaraq pilerivoq. </p>', s2_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat pilerivoq. </p>', s1_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig.', s2_danish: 'I morgen kommer tivoli til byen, så han glæder sig.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'nukappiaraq', changed_word: 'NA', target_word_no_affix: 'pilerivoq', reverse_target_position: '2', s1_words: '6', correct_response: '5'},
  {sentence_id: '7', sentence_id_specific: '7_6', s1: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerivoq.', s2: 'Aqagu cirkusi illoqarfimmut piniarmat nukappiaraq pilerivoq.', s1_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat nukappiaraq pilerivoq. </p>', s2_with_line_breaks: '<p> Aqagu cirkusi illoqarfimmut piniarmat </p><p> nukappiaraq pilerivoq. </p>', s1_danish: 'I morgen kommer tivoli til byen, så drengen glæder sig.', s2_danish: 'I morgen kommer cirkus til byen, så drengen glæder sig.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'tivoli', changed_word: 'cirkusi', target_word_no_affix: 'pilerivoq', reverse_target_position: '5', s1_words: '6', correct_response: '1'},
  {sentence_id: '8', sentence_id_specific: '8_1', s1: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerniarsarivaa.', s2: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerpaa.', s1_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap </p><p> tujuuluk qilattarlugu inerniarsarivaa. </p>', s2_with_line_breaks: '<p> Arfininngorpat katittuussagatta </p><p> Miap tujuuluk qilattarlugu inerpaa. </p>', s1_danish: 'Vi skal til bryllup på lørdag, så Mia prøver at få trøjen strikket færdig.', s2_danish: 'Vi skal til bryllup på lørdag, så Mia strikker trøjen færdig.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'niarsare', filler_condition: 'critical', target_word: 'inerniarsarivaa', changed_word: 'inerpaa', target_word_no_affix: 'inerpaa', reverse_target_position: '1', s1_words: '6', correct_response: '5'},
  {sentence_id: '8', sentence_id_specific: '8_2', s1: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerniarsarivaa.', s2: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerniarsarivaa.', s1_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap </p><p> tujuuluk qilattarlugu inerniarsarivaa. </p>', s2_with_line_breaks: '<p> Arfininngorpat katittuussagatta </p><p> Miap tujuuluk qilattarlugu inerniarsarivaa. </p>', s1_danish: 'Vi skal til bryllup på lørdag, så Mia prøver at få trøjen strikket færdig.', s2_danish: 'Vi skal til bryllup på lørdag, så Mia prøver at få trøjen strikket færdig.', change_type: 'no_change', affix_type: 'lexical', affix: 'niarsare', filler_condition: 'filler', target_word: 'inerniarsarivaa', changed_word: 'inerniarsarivaa', target_word_no_affix: 'inerpaa', reverse_target_position: '1', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '8', sentence_id_specific: '8_3', s1: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu ineqqammerpaa.', s2: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerpaa.', s1_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap </p><p> tujuuluk qilattarlugu ineqqammerpaa. </p>', s2_with_line_breaks: '<p> Arfininngorpat katittuussagatta </p><p> Miap tujuuluk qilattarlugu inerpaa. </p>', s1_danish: 'Vi skal til bryllup på lørdag, så Mia har lige fået strikket trøjen færdig.', s2_danish: 'Vi skal til bryllup på lørdag, så Mia strikker trøjen færdig.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'qqammer', filler_condition: 'critical', target_word: 'ineqqammerpaa', changed_word: 'inerpaa', target_word_no_affix: 'inerpaa', reverse_target_position: '1', s1_words: '6', correct_response: '5'},
  {sentence_id: '8', sentence_id_specific: '8_4', s1: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu ineqqammerpaa.', s2: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu ineqqammerpaa.', s1_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap </p><p> tujuuluk qilattarlugu ineqqammerpaa. </p>', s2_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap tujuuluk </p><p> qilattarlugu ineqqammerpaa. </p>', s1_danish: 'Vi skal til bryllup på lørdag, så Mia har lige fået strikket trøjen færdig.', s2_danish: 'Vi skal til bryllup på lørdag, så Mia har lige fået strikket trøjen færdig.', change_type: 'no_change', affix_type: 'grammatical', affix: 'qqammer', filler_condition: 'filler', target_word: 'ineqqammerpaa', changed_word: 'ineqqammerpaa', target_word_no_affix: 'inerpaa', reverse_target_position: '1', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '8', sentence_id_specific: '8_5', s1: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerpaa.', s2: 'Arfininngorpat katittuussagatta tujuuluk qilattarlugu inerpaa.', s1_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap </p><p> tujuuluk qilattarlugu inerpaa. </p>', s2_with_line_breaks: '<p> Arfininngorpat katittuussagatta tujuuluk </p><p> qilattarlugu inerpaa. </p>', s1_danish: 'Vi skal til bryllup på lørdag, så Mia strikker trøjen færdig.', s2_danish: 'Vi skal til bryllup på lørdag, så hun strikker trøjen færdig.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Miap', changed_word: 'NA', target_word_no_affix: 'inerpaa', reverse_target_position: '4', s1_words: '6', correct_response: '5'},
  {sentence_id: '8', sentence_id_specific: '8_6', s1: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerpaa.', s2: 'Arfininngorpat illoqarfiliassagatta Miap tujuuluk qilattarlugu inerpaa.', s1_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap </p><p> tujuuluk qilattarlugu inerpaa. </p>', s2_with_line_breaks: '<p> Arfininngorpat illoqarfiliassagatta </p><p> Miap tujuuluk qilattarlugu inerpaa. </p>', s1_danish: 'Vi skal til bryllup på lørdag, så Mia strikker trøjen færdig.', s2_danish: 'Vi skal til byen på lørdag, så Mia strikker trøjen færdig.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'katittuussagatta', changed_word: 'illoqarfiliassagatta', target_word_no_affix: 'inerpaa', reverse_target_position: '5', s1_words: '6', correct_response: '1'},
  {sentence_id: '9', sentence_id_specific: '9_1', s1: 'Anorersuarpasilerpoq taamaattumik aataga angerlajaarpoq.', s2: 'Anorersuarpasilerpoq taamaattumik aataga angerlarpoq.', s1_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlajaarpoq. </p>', s2_with_line_breaks: '<p> Anorersuarpasilerpoq </p><p> taamaattumik aataga angerlarpoq. </p>', s1_danish: 'Det begynder at trække op til storm, derfor tager min bedstefar tidligt hjem.', s2_danish: 'Det begynder at trække op til storm, derfor tager min bedstefar hjem.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'jaar', filler_condition: 'critical', target_word: 'angerlajaarpoq', changed_word: 'angerlarpoq', target_word_no_affix: 'angerlarpoq', reverse_target_position: '1', s1_words: '4', correct_response: '3'},
  {sentence_id: '9', sentence_id_specific: '9_2', s1: 'Anorersuarpasilerpoq taamaattumik aataga angerlajaarpoq.', s2: 'Anorersuarpasilerpoq taamaattumik aataga angerlajaarpoq.', s1_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlajaarpoq. </p>', s2_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlajaarpoq. </p>', s1_danish: 'Det begynder at trække op til storm, derfor tager min bedstefar tidligt hjem.', s2_danish: 'Det begynder at trække op til storm, derfor tager min bedstefar tidligt hjem.', change_type: 'no_change', affix_type: 'lexical', affix: 'jaar', filler_condition: 'filler', target_word: 'angerlajaarpoq', changed_word: 'angerlajaarpoq', target_word_no_affix: 'angerlarpoq', reverse_target_position: '1', s1_words: '4', correct_response: 'NA'},
  {sentence_id: '9', sentence_id_specific: '9_3', s1: 'Anorersuarpasilerpoq taamaattumik aataga angerlarumaarpoq.', s2: 'Anorersuarpasilerpoq taamaattumik aataga angerlarpoq.', s1_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlarumaarpoq. </p>', s2_with_line_breaks: '<p> Anorersuarpasilerpoq </p><p> taamaattumik aataga angerlarpoq. </p>', s1_danish: 'Det begynder at trække op til storm, derfor vil min bedstefar nok tage hjem.', s2_danish: 'Det begynder at trække op til storm, derfor tager min bedstefar hjem.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'jumaar', filler_condition: 'critical', target_word: 'angerlarumaarpoq', changed_word: 'angerlarpoq', target_word_no_affix: 'angerlarpoq', reverse_target_position: '1', s1_words: '4', correct_response: '3'},
  {sentence_id: '9', sentence_id_specific: '9_4', s1: 'Anorersuarpasilerpoq taamaattumik aataga angerlarumaarpoq.', s2: 'Anorersuarpasilerpoq taamaattumik aataga angerlarumaarpoq.', s1_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlarumaarpoq. </p>', s2_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik aataga </p><p> angerlarumaarpoq. </p>', s1_danish: 'Det begynder at trække op til storm, derfor vil min bedstefar nok tage hjem.', s2_danish: 'Det begynder at trække op til storm, derfor vil min bedstefar nok tage hjem.', change_type: 'no_change', affix_type: 'grammatical', affix: 'jumaar', filler_condition: 'filler', target_word: 'angerlarumaarpoq', changed_word: 'angerlarumaarpoq', target_word_no_affix: 'angerlarpoq', reverse_target_position: '1', s1_words: '4', correct_response: 'NA'},
  {sentence_id: '9', sentence_id_specific: '9_5', s1: 'Anorersuarpasilerpoq taamaattumik aataga angerlarpoq.', s2: 'Anorersuarpasilerpoq taamaattumik angerlarpoq.', s1_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlarpoq. </p>', s2_with_line_breaks: '<p> Anorersuarpasilerpoq </p><p> taamaattumik angerlarpoq. </p>', s1_danish: 'Det begynder at trække op til storm, derfor tager min bedstefar hjem.', s2_danish: 'Det begynder at trække op til storm, derfor tager han hjem.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'aataga', changed_word: 'NA', target_word_no_affix: 'angerlarpoq', reverse_target_position: '2', s1_words: '4', correct_response: '3'},
  {sentence_id: '9', sentence_id_specific: '9_6', s1: 'Anorersuarpasilerpoq taamaattumik aataga angerlarpoq.', s2: 'Taasilerpoq taamaattumik aataga angerlarpoq.', s1_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlarpoq. </p>', s2_with_line_breaks: '<p> Taasilerpoq taamaattumik aataga </p><p> angerlarpoq. </p>', s1_danish: 'Det begynder at trække op til storm, derfor tager min bedstefar hjem.', s2_danish: 'Det begynder at blive mørkt, derfor tager min bedstefar hjem.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'Anorersuarpasilerpoq', changed_word: 'Taasilerpoq', target_word_no_affix: 'angerlarpoq', reverse_target_position: '4', s1_words: '4', correct_response: '0'},
  {sentence_id: '10', sentence_id_specific: '10_1', s1: 'Naalungiarsuk nipangilertorpoq pissutigalugu anaanaminiit nerisinneqarami.', s2: 'Naalungiarsuk nipangerpoq pissutigalugu anaanaminiit nerisinneqarami.', s1_with_line_breaks: '<p> Naalungiarsuk nipangilertorpoq pissutigalugu </p><p> anaanaminiit nerisinneqarami. </p>', s2_with_line_breaks: '<p> Naalungiarsuk nipangerpoq </p><p> pissutigalugu anaanaminiit nerisinneqarami. </p>', s1_danish: 'Babyen tier hurtigt stille, fordi den får mad af sin mor.', s2_danish: 'Babyen tier stille, fordi den får mad af sin mor.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'lertor', filler_condition: 'critical', target_word: 'nipangilertorpoq', changed_word: 'nipangerpoq', target_word_no_affix: 'nipangerpoq', reverse_target_position: '4', s1_words: '5', correct_response: '1'},
  {sentence_id: '10', sentence_id_specific: '10_2', s1: 'Naalungiarsuk nipangilertorpoq pissutigalugu anaanaminiit nerisinneqarami.', s2: 'Naalungiarsuk nipangilertorpoq pissutigalugu anaanaminiit nerisinneqarami.', s1_with_line_breaks: '<p> Naalungiarsuk nipangilertorpoq pissutigalugu </p><p> anaanaminiit nerisinneqarami. </p>', s2_with_line_breaks: '<p> Naalungiarsuk nipangilertorpoq </p><p> pissutigalugu anaanaminiit nerisinneqarami. </p>', s1_danish: 'Babyen tier hurtigt stille, fordi den får mad af sin mor.', s2_danish: 'Babyen tier hurtigt stille, fordi den får mad af sin mor.', change_type: 'no_change', affix_type: 'lexical', affix: 'lertor', filler_condition: 'filler', target_word: 'nipangilertorpoq', changed_word: 'nipangilertorpoq', target_word_no_affix: 'nipangerpoq', reverse_target_position: '4', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '10', sentence_id_specific: '10_3', s1: 'Naalungiarsuk nipangeqqammerpoq pissutigalugu anaanaminiit nerisinneqarami.', s2: 'Naalungiarsuk nipangerpoq pissutigalugu anaanaminiit nerisinneqarami.', s1_with_line_breaks: '<p> Naalungiarsuk nipangeqqammerpoq pissutigalugu </p><p> anaanaminiit nerisinneqarami. </p>', s2_with_line_breaks: '<p> Naalungiarsuk nipangerpoq </p><p> pissutigalugu anaanaminiit nerisinneqarami. </p>', s1_danish: 'Babyen er for lidt siden blevet stille, fordi den fik mad af sin mor.', s2_danish: 'Babyen tier stille, fordi den får mad af sin mor.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'qqammer', filler_condition: 'critical', target_word: 'nipangeqqammerpoq', changed_word: 'nipangerpoq', target_word_no_affix: 'nipangerpoq', reverse_target_position: '4', s1_words: '5', correct_response: '1'},
  {sentence_id: '10', sentence_id_specific: '10_4', s1: 'Naalungiarsuk nipangeqqammerpoq pissutigalugu anaanaminiit nerisinneqarami.', s2: 'Naalungiarsuk nipangeqqammerpoq pissutigalugu anaanaminiit nerisinneqarami.', s1_with_line_breaks: '<p> Naalungiarsuk nipangeqqammerpoq pissutigalugu </p><p> anaanaminiit nerisinneqarami. </p>', s2_with_line_breaks: '<p> Naalungiarsuk nipangeqqammerpoq </p><p> pissutigalugu anaanaminiit nerisinneqarami. </p>', s1_danish: 'Babyen er for lidt siden blevet stille, fordi den fik mad af sin mor.', s2_danish: 'Babyen er for lidt siden blevet stille, fordi den fik mad af sin mor.', change_type: 'no_change', affix_type: 'grammatical', affix: 'qqammer', filler_condition: 'filler', target_word: 'nipangeqqammerpoq', changed_word: 'nipangeqqammerpoq', target_word_no_affix: 'nipangerpoq', reverse_target_position: '4', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '10', sentence_id_specific: '10_5', s1: 'Naalungiarsuk nipangerpoq pissutigalugu anaanaminiit nerisinneqarami.', s2: 'Nipangerpoq pissutigalugu anaanaminiit nerisinneqarami.', s1_with_line_breaks: '<p> Naalungiarsuk nipangerpoq pissutigalugu </p><p> anaanaminiit nerisinneqarami. </p>', s2_with_line_breaks: '<p> Nipangerpoq pissutigalugu anaanaminiit </p><p> nerisinneqarami. </p>', s1_danish: 'Babyen tier stille, fordi den får mad af sin mor.', s2_danish: 'Den tier stille, fordi den får mad af sin mor.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Naalungiarsuk', changed_word: 'NA', target_word_no_affix: 'nipangerpoq', reverse_target_position: '5', s1_words: '5', correct_response: '4'},
  {sentence_id: '10', sentence_id_specific: '10_6', s1: 'Naalungiarsuk nipangerpoq pissutigalugu anaanaminiit nerisinneqarami.', s2: 'Naalungiarsuk nipangerpoq pissutigalugu ataataminiit nerisinneqarami.', s1_with_line_breaks: '<p> Naalungiarsuk nipangerpoq pissutigalugu </p><p> anaanaminiit nerisinneqarami. </p>', s2_with_line_breaks: '<p> Naalungiarsuk nipangerpoq </p><p> pissutigalugu ataataminiit nerisinneqarami. </p>', s1_danish: 'Babyen tier stille, fordi den får mad af sin mor.', s2_danish: 'Babyen tier stille, fordi den får mad af sin far.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'anaanaminiit', changed_word: 'ataataminiit', target_word_no_affix: 'nipangerpoq', reverse_target_position: '2', s1_words: '5', correct_response: '3'},
  {sentence_id: '11', sentence_id_specific: '11_1', s1: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasujaarpoq.', s2: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasuvoq.', s1_with_line_breaks: '<p> Ullumi ualeq naallugu kaffillertoqarmat </p><p> taamaammat aanaga qasujaarpoq. </p>', s2_with_line_breaks: '<p> Ullumi ualeq naallugu </p><p> kaffillertoqarmat taamaammat aanaga qasuvoq. </p>', s1_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor er min bedstemor tidligt træt.', s2_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor er min bedstemor træt.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'jaar', filler_condition: 'critical', target_word: 'qasujaarpoq', changed_word: 'qasuvoq', target_word_no_affix: 'qasuvoq', reverse_target_position: '1', s1_words: '7', correct_response: '6'},
  {sentence_id: '11', sentence_id_specific: '11_2', s1: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasujaarpoq.', s2: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasujaarpoq.', s1_with_line_breaks: '<p> Ullumi ualeq naallugu kaffillertoqarmat </p><p> taamaammat aanaga qasujaarpoq. </p>', s2_with_line_breaks: '<p> Ullumi ualeq naallugu </p><p> kaffillertoqarmat taamaammat aanaga qasujaarpoq. </p>', s1_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor er min bedstemor tidligt træt.', s2_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor er min bedstemor tidligt træt.', change_type: 'no_change', affix_type: 'lexical', affix: 'jaar', filler_condition: 'filler', target_word: 'qasujaarpoq', changed_word: 'qasujaarpoq', target_word_no_affix: 'qasuvoq', reverse_target_position: '1', s1_words: '7', correct_response: 'NA'},
  {sentence_id: '11', sentence_id_specific: '11_3', s1: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasoqqajaavoq.', s2: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasuvoq.', s1_with_line_breaks: '<p> Ullumi ualeq naallugu kaffillertoqarmat </p><p> taamaammat aanaga qasoqqajaavoq. </p>', s2_with_line_breaks: '<p> Ullumi ualeq naallugu </p><p> kaffillertoqarmat taamaammat aanaga qasuvoq. </p>', s1_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor har min bedstemor nemt ved at blive træt.', s2_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor er min bedstemor træt.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'qqajaa', filler_condition: 'critical', target_word: 'qasoqqajaavoq', changed_word: 'qasuvoq', target_word_no_affix: 'qasuvoq', reverse_target_position: '1', s1_words: '7', correct_response: '6'},
  {sentence_id: '11', sentence_id_specific: '11_4', s1: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasoqqajaavoq.', s2: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasoqqajaavoq.', s1_with_line_breaks: '<p> Ullumi ualeq naallugu kaffillertoqarmat </p><p> taamaammat aanaga qasoqqajaavoq. </p>', s2_with_line_breaks: '<p> Ullumi ualeq naallugu </p><p> kaffillertoqarmat taamaammat aanaga qasoqqajaavoq. </p>', s1_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor har min bedstemor nemt ved at blive træt.', s2_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor har min bedstemor nemt ved at blive træt.', change_type: 'no_change', affix_type: 'grammatical', affix: 'qqajaa', filler_condition: 'filler', target_word: 'qasoqqajaavoq', changed_word: 'qasoqqajaavoq', target_word_no_affix: 'qasuvoq', reverse_target_position: '1', s1_words: '7', correct_response: 'NA'},
  {sentence_id: '11', sentence_id_specific: '11_5', s1: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasuvoq.', s2: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat qasuvoq.', s1_with_line_breaks: '<p> Ullumi ualeq naallugu kaffillertoqarmat </p><p> taamaammat aanaga qasuvoq. </p>', s2_with_line_breaks: '<p> Ullumi ualeq naallugu </p><p> kaffillertoqarmat taamaammat qasuvoq. </p>', s1_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor er min bedstemor træt.', s2_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor er hun træt.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'aanaga', changed_word: 'NA', target_word_no_affix: 'qasuvoq', reverse_target_position: '2', s1_words: '7', correct_response: '6'},
  {sentence_id: '11', sentence_id_specific: '11_6', s1: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasuvoq.', s2: 'Ippassaq ualeq naallugu kaffillertoqarmat taamaammat aanaga qasuvoq.', s1_with_line_breaks: '<p> Ullumi ualeq naallugu kaffillertoqarmat </p><p> taamaammat aanaga qasuvoq. </p>', s2_with_line_breaks: '<p> Ippassaq ualeq naallugu </p><p> kaffillertoqarmat taamaammat aanaga qasuvoq. </p>', s1_danish: 'I dag har der været kaffemik hele eftermiddagen, så derfor er min bedstemor træt.', s2_danish: 'I går har der været kaffemik hele eftermiddagen, så derfor er min bedstemor træt.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'Ullumi', changed_word: 'Ippassaq', target_word_no_affix: 'qasuvoq', reverse_target_position: '7', s1_words: '7', correct_response: '0'},
  {sentence_id: '12', sentence_id_specific: '12_1', s1: 'Ukiuummat aataga angerlarsimajuaannarpoq qisunnik sanalulluni.', s2: 'Ukiuummat aataga angerlarsimavoq qisunnik sanalulluni.', s1_with_line_breaks: '<p> Ukiuummat aataga angerlarsimajuaannarpoq </p><p> qisunnik sanalulluni. </p>', s2_with_line_breaks: '<p> Ukiuummat aataga </p><p> angerlarsimavoq qisunnik sanalulluni. </p>', s1_danish: 'Det er vinter, så derfor er min bedstefar hele tiden hjemme og arbejder med træ.', s2_danish: 'Det er vinter, så derfor er min bedstefar hjemme og arbejder med træ.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'juaannar', filler_condition: 'critical', target_word: 'angerlarsimajuaannarpoq', changed_word: 'angerlarsimavoq', target_word_no_affix: 'angerlarsimavoq', reverse_target_position: '3', s1_words: '5', correct_response: '2'},
  {sentence_id: '12', sentence_id_specific: '12_2', s1: 'Ukiuummat aataga angerlarsimajuaannarpoq qisunnik sanalulluni.', s2: 'Ukiuummat aataga angerlarsimajuaannarpoq qisunnik sanalulluni.', s1_with_line_breaks: '<p> Ukiuummat aataga angerlarsimajuaannarpoq </p><p> qisunnik sanalulluni. </p>', s2_with_line_breaks: '<p> Ukiuummat aataga </p><p> angerlarsimajuaannarpoq qisunnik sanalulluni. </p>', s1_danish: 'Det er vinter, så derfor er min bedstefar hele tiden hjemme og arbejder med træ.', s2_danish: 'Det er vinter, så derfor er min bedstefar hele tiden hjemme og arbejder med træ.', change_type: 'no_change', affix_type: 'lexical', affix: 'juaannar', filler_condition: 'filler', target_word: 'angerlarsimajuaannarpoq', changed_word: 'angerlarsimajuaannarpoq', target_word_no_affix: 'angerlarsimavoq', reverse_target_position: '3', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '12', sentence_id_specific: '12_3', s1: 'Ukiuummat aataga angerlarsimajunnarsivoq qisunnik sanalulluni.', s2: 'Ukiuummat aataga angerlarsimavoq qisunnik sanalulluni.', s1_with_line_breaks: '<p> Ukiuummat aataga angerlarsimajunnarsivoq </p><p> qisunnik sanalulluni. </p>', s2_with_line_breaks: '<p> Ukiuummat aataga </p><p> angerlarsimavoq qisunnik sanalulluni. </p>', s1_danish: 'Det er vinter, så derfor er min bedstefar formodentlig hjemme og arbejder med træ.', s2_danish: 'Det er vinter, så derfor er min bedstefar hjemme og arbejder med træ.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'junnarsi', filler_condition: 'critical', target_word: 'angerlarsimajunnarsivoq', changed_word: 'angerlarsimavoq', target_word_no_affix: 'angerlarsimavoq', reverse_target_position: '3', s1_words: '5', correct_response: '2'},
  {sentence_id: '12', sentence_id_specific: '12_4', s1: 'Ukiuummat aataga angerlarsimajunnarsivoq qisunnik sanalulluni.', s2: 'Ukiuummat aataga angerlarsimajunnarsivoq qisunnik sanalulluni.', s1_with_line_breaks: '<p> Ukiuummat aataga angerlarsimajunnarsivoq </p><p> qisunnik sanalulluni. </p>', s2_with_line_breaks: '<p> Ukiuummat aataga </p><p> angerlarsimajunnarsivoq qisunnik sanalulluni. </p>', s1_danish: 'Det er vinter, så derfor er min bedstefar formodentlig hjemme og arbejder med træ.', s2_danish: 'Det er vinter, så derfor er min bedstefar formodentlig hjemme og arbejder med træ.', change_type: 'no_change', affix_type: 'grammatical', affix: 'junnarsi', filler_condition: 'filler', target_word: 'angerlarsimajunnarsivoq', changed_word: 'angerlarsimajunnarsivoq', target_word_no_affix: 'angerlarsimavoq', reverse_target_position: '3', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '12', sentence_id_specific: '12_5', s1: 'Ukiuummat aataga angerlarsimavoq qisunnik sanalulluni.', s2: 'Ukiuummat angerlarsimavoq qisunnik sanalulluni.', s1_with_line_breaks: '<p> Ukiuummat aataga angerlarsimavoq </p><p> qisunnik sanalulluni. </p>', s2_with_line_breaks: '<p> Ukiuummat angerlarsimavoq </p><p> qisunnik sanalulluni. </p>', s1_danish: 'Det er vinter, så derfor er min bedstefar hjemme og arbejder med træ.', s2_danish: 'Det er vinter, så derfor er han hjemme og arbejder med træ.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'aataga', changed_word: 'NA', target_word_no_affix: 'angerlarsimavoq', reverse_target_position: '4', s1_words: '5', correct_response: '4'},
  {sentence_id: '12', sentence_id_specific: '12_6', s1: 'Ukiuummat aataga angerlarsimavoq qisunnik sanalulluni.', s2: 'Ukiaammat aataga angerlarsimavoq qisunnik sanalulluni.', s1_with_line_breaks: '<p> Ukiuummat aataga angerlarsimavoq </p><p> qisunnik sanalulluni. </p>', s2_with_line_breaks: '<p> Ukiaammat aataga </p><p> angerlarsimavoq qisunnik sanalulluni. </p>', s1_danish: 'Det er vinter, så derfor er min bedstefar hjemme og arbejder med træ.', s2_danish: 'Det er efterår, så derfor er min bedstefar hjemme og arbejder med træ.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'Ukiuummat', changed_word: 'Ukiaammat', target_word_no_affix: 'angerlarsimavoq', reverse_target_position: '5', s1_words: '5', correct_response: '0'},
  {sentence_id: '13', sentence_id_specific: '13_1', s1: 'Ane aperilertorpoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s2: 'Ane aperivoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s1_with_line_breaks: '<p> Ane aperilertorpoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', s2_with_line_breaks: '<p> Ane aperivoq kammalaatini atuarfimmiit </p><p> illoqarfiliaqatigisinnaanerlugit. </p>', s1_danish: 'Ane spørger hurtigt om hun må tage i byen med sine veninder fra skolen.', s2_danish: 'Ane spørger om hun må tage i byen med sine veninder fra skolen.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'lertor', filler_condition: 'critical', target_word: 'aperilertorpoq', changed_word: 'aperivoq', target_word_no_affix: 'aperivoq', reverse_target_position: '4', s1_words: '5', correct_response: '1'},
  {sentence_id: '13', sentence_id_specific: '13_2', s1: 'Ane aperilertorpoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s2: 'Ane aperilertorpoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s1_with_line_breaks: '<p> Ane aperilertorpoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', s2_with_line_breaks: '<p> Ane aperilertorpoq </p><p> kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', s1_danish: 'Ane spørger hurtigt om hun må tage i byen med sine veninder fra skolen.', s2_danish: 'Ane spørger hurtigt om hun må tage i byen med sine veninder fra skolen.', change_type: 'no_change', affix_type: 'lexical', affix: 'lertor', filler_condition: 'filler', target_word: 'aperilertorpoq', changed_word: 'aperilertorpoq', target_word_no_affix: 'aperivoq', reverse_target_position: '4', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '13', sentence_id_specific: '13_3', s1: 'Ane aperinikuuvoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s2: 'Ane aperivoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s1_with_line_breaks: '<p> Ane aperinikuuvoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', s2_with_line_breaks: '<p> Ane aperivoq kammalaatini atuarfimmiit </p><p> illoqarfiliaqatigisinnaanerlugit. </p>', s1_danish: 'Ane har engang spurgt om hun må tage i byen med sine veninder fra skolen.', s2_danish: 'Ane spørger om hun må tage i byen med sine veninder fra skolen.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'nikuu', filler_condition: 'critical', target_word: 'aperinikuuvoq', changed_word: 'aperivoq', target_word_no_affix: 'aperivoq', reverse_target_position: '4', s1_words: '5', correct_response: '1'},
  {sentence_id: '13', sentence_id_specific: '13_4', s1: 'Ane aperinikuuvoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s2: 'Ane aperinikuuvoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s1_with_line_breaks: '<p> Ane aperinikuuvoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', s2_with_line_breaks: '<p> Ane aperinikuuvoq kammalaatini atuarfimmiit </p><p> illoqarfiliaqatigisinnaanerlugit. </p>', s1_danish: 'Ane har engang spurgt om hun må tage i byen med sine veninder fra skolen.', s2_danish: 'Ane har engang spurgt om hun må tage i byen med sine veninder fra skolen.', change_type: 'no_change', affix_type: 'grammatical', affix: 'nikuu', filler_condition: 'filler', target_word: 'aperinikuuvoq', changed_word: 'aperinikuuvoq', target_word_no_affix: 'aperivoq', reverse_target_position: '4', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '13', sentence_id_specific: '13_5', s1: 'Ane aperivoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s2: 'Aperivoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s1_with_line_breaks: '<p> Ane aperivoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', s2_with_line_breaks: '<p> Aperivoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', s1_danish: 'Ane spørger om hun må tage i byen med sine veninder fra skolen.', s2_danish: 'Hun spørger om hun må tage i byen med sine veninder fra skolen.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Ane', changed_word: 'NA', target_word_no_affix: 'aperivoq', reverse_target_position: '5', s1_words: '5', correct_response: '4'},
  {sentence_id: '13', sentence_id_specific: '13_6', s1: 'Ane aperivoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', s2: 'Ane aperivoq kammalaatini sulifimminiit illoqarfiliaqatigisinnaanerlugit.', s1_with_line_breaks: '<p> Ane aperivoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', s2_with_line_breaks: '<p> Ane aperivoq kammalaatini sulifimminiit </p><p> illoqarfiliaqatigisinnaanerlugit. </p>', s1_danish: 'Ane spørger om hun må tage i byen med sine veninder fra skolen.', s2_danish: 'Ane spørger om hun må tage i byen med sine veninder fra arbejdet.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'atuarfimmiit', changed_word: 'sulifimminiit', target_word_no_affix: 'aperivoq', reverse_target_position: '2', s1_words: '5', correct_response: '3'},
  {sentence_id: '14', sentence_id_specific: '14_1', s1: 'Malik pisiniarfimmut biilipallappoq kisianni ruuat nungussimapput.', s2: 'Malik pisiniarfimmut biilerpoq kisianni ruuat nungussimapput.', s1_with_line_breaks: '<p> Malik pisiniarfimmut biilipallappoq </p><p> kisianni ruuat nungussimapput. </p>', s2_with_line_breaks: '<p> Malik pisiniarfimmut biilerpoq kisianni </p><p> ruuat nungussimapput. </p>', s1_danish: 'Malik skynder sig at køre i bil hen til supermarkedet, men der er udsolgt af majroer.', s2_danish: 'Malik kører i bil hen til supermarkedet, men der er udsolgt af majroer.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'pallag', filler_condition: 'critical', target_word: 'biilipallappoq', changed_word: 'biilerpoq', target_word_no_affix: 'biilerpoq', reverse_target_position: '4', s1_words: '6', correct_response: '2'},
  {sentence_id: '14', sentence_id_specific: '14_2', s1: 'Malik pisiniarfimmut biilipallappoq kisianni ruuat nungussimapput.', s2: 'Malik pisiniarfimmut biilipallappoq kisianni ruuat nungussimapput.', s1_with_line_breaks: '<p> Malik pisiniarfimmut biilipallappoq </p><p> kisianni ruuat nungussimapput. </p>', s2_with_line_breaks: '<p> Malik pisiniarfimmut biilipallappoq kisianni </p><p> ruuat nungussimapput. </p>', s1_danish: 'Malik skynder sig at køre i bil hen til supermarkedet, men der er udsolgt af majroer.', s2_danish: 'Malik skynder sig at køre i bil hen til supermarkedet, men der er udsolgt af majroer.', change_type: 'no_change', affix_type: 'lexical', affix: 'pallag', filler_condition: 'filler', target_word: 'biilipallappoq', changed_word: 'biilipallappoq', target_word_no_affix: 'biilerpoq', reverse_target_position: '4', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '14', sentence_id_specific: '14_3', s1: 'Malik pisiniarfimmut biileraluarpoq kisianni ruuat nungussimapput.', s2: 'Malik pisiniarfimmut biilerpoq kisianni ruuat nungussimapput.', s1_with_line_breaks: '<p> Malik pisiniarfimmut biileraluarpoq </p><p> kisianni ruuat nungussimapput. </p>', s2_with_line_breaks: '<p> Malik pisiniarfimmut biilerpoq kisianni </p><p> ruuat nungussimapput. </p>', s1_danish: 'Malik kører ellers i bil hen til supermarkedet, men der er udsolgt af majroer.', s2_danish: 'Malik kører i bil hen til supermarkedet, men der er udsolgt af majroer.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'galuar', filler_condition: 'critical', target_word: 'biileraluarpoq', changed_word: 'biilerpoq', target_word_no_affix: 'biilerpoq', reverse_target_position: '4', s1_words: '6', correct_response: '2'},
  {sentence_id: '14', sentence_id_specific: '14_4', s1: 'Malik pisiniarfimmut biileraluarpoq kisianni ruuat nungussimapput.', s2: 'Malik pisiniarfimmut biileraluarpoq kisianni ruuat nungussimapput.', s1_with_line_breaks: '<p> Malik pisiniarfimmut biileraluarpoq </p><p> kisianni ruuat nungussimapput. </p>', s2_with_line_breaks: '<p> Malik pisiniarfimmut biileraluarpoq kisianni </p><p> ruuat nungussimapput. </p>', s1_danish: 'Malik kører ellers i bil hen til supermarkedet, men der er udsolgt af majroer.', s2_danish: 'Malik kører ellers i bil hen til supermarkedet, men der er udsolgt af majroer.', change_type: 'no_change', affix_type: 'grammatical', affix: 'galuar', filler_condition: 'filler', target_word: 'biileraluarpoq', changed_word: 'biileraluarpoq', target_word_no_affix: 'biilerpoq', reverse_target_position: '4', s1_words: '6', correct_response: 'NA'},
  {sentence_id: '14', sentence_id_specific: '14_5', s1: 'Malik pisiniarfimmut biilerpoq kisianni ruuat nungussimapput.', s2: 'Pisiniarfimmut biilerpoq kisianni ruuat nungussimapput.', s1_with_line_breaks: '<p> Malik pisiniarfimmut biilerpoq </p><p> kisianni ruuat nungussimapput. </p>', s2_with_line_breaks: '<p> Pisiniarfimmut biilerpoq kisianni </p><p> ruuat nungussimapput. </p>', s1_danish: 'Malik kører i bil hen til supermarkedet, men der er udsolgt af majroer.', s2_danish: 'Han kører i bil hen til supermarkedet, men der er udsolgt af majroer.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Malik', changed_word: 'NA', target_word_no_affix: 'biilerpoq', reverse_target_position: '6', s1_words: '6', correct_response: '5'},
  {sentence_id: '14', sentence_id_specific: '14_6', s1: 'Malik pisiniarfimmut biilerpoq kisianni ruuat nungussimapput.', s2: 'Malik pisiniarfimmut biilerpoq kisianni naatsiiat nungussimapput.', s1_with_line_breaks: '<p> Malik pisiniarfimmut biilerpoq </p><p> kisianni ruuat nungussimapput. </p>', s2_with_line_breaks: '<p> Malik pisiniarfimmut biilerpoq kisianni </p><p> naatsiiat nungussimapput. </p>', s1_danish: 'Malik kører i bil hen til supermarkedet, men der er udsolgt af majroer.', s2_danish: 'Malik kører i bil hen til supermarkedet, men der er udsolgt af kartofler.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'ruuat', changed_word: 'naatsiiat', target_word_no_affix: 'biilerpoq', reverse_target_position: '2', s1_words: '6', correct_response: '4'},
  {sentence_id: '15', sentence_id_specific: '15_1', s1: 'Nukaga toqqoqqissaarpoq kigutigissartinneq nuannarineq ajoramiuk.', s2: 'Nukaga toqqorpoq kigutigissartinneq nuannarineq ajoramiuk.', s1_with_line_breaks: '<p> Nukaga toqqoqqissaarpoq </p><p> kigutigissartinneq nuannarineq ajoramiuk. </p>', s2_with_line_breaks: '<p> Nukaga toqqorpoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', s1_danish: 'Min lillesøster gemmer sig godt, fordi hun ikke kan lide at få børstet tænder.', s2_danish: 'Min lillesøster gemmer sig, fordi hun ikke kan lide at få børstet tænder.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'qqissaar', filler_condition: 'critical', target_word: 'toqqoqqissaarpoq', changed_word: 'toqqorpoq', target_word_no_affix: 'toqqorpoq', reverse_target_position: '4', s1_words: '5', correct_response: '1'},
  {sentence_id: '15', sentence_id_specific: '15_2', s1: 'Nukaga toqqoqqissaarpoq kigutigissartinneq nuannarineq ajoramiuk.', s2: 'Nukaga toqqoqqissaarpoq kigutigissartinneq nuannarineq ajoramiuk.', s1_with_line_breaks: '<p> Nukaga toqqoqqissaarpoq </p><p> kigutigissartinneq nuannarineq ajoramiuk. </p>', s2_with_line_breaks: '<p> Nukaga toqqoqqissaarpoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', s1_danish: 'Min lillesøster gemmer sig godt, fordi hun ikke kan lide at få børstet tænder.', s2_danish: 'Min lillesøster gemmer sig godt, fordi hun ikke kan lide at få børstet tænder.', change_type: 'no_change', affix_type: 'lexical', affix: 'qqissaar', filler_condition: 'filler', target_word: 'toqqoqqissaarpoq', changed_word: 'toqqoqqissaarpoq', target_word_no_affix: 'toqqorpoq', reverse_target_position: '4', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '15', sentence_id_specific: '15_3', s1: 'Nukaga toqqoriikatappoq kigutigissartinneq nuannarineq ajoramiuk.', s2: 'Nukaga toqqorpoq kigutigissartinneq nuannarineq ajoramiuk.', s1_with_line_breaks: '<p> Nukaga toqqoriikatappoq </p><p> kigutigissartinneq nuannarineq ajoramiuk. </p>', s2_with_line_breaks: '<p> Nukaga toqqorpoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', s1_danish: 'Min lillesøster har allerede gemt sig, fordi hun ikke kan lide at få børstet tænder.', s2_danish: 'Min lillesøster gemmer sig, fordi hun ikke kan lide at få børstet tænder.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'riikatag', filler_condition: 'critical', target_word: 'toqqoriikatappoq', changed_word: 'toqqorpoq', target_word_no_affix: 'toqqorpoq', reverse_target_position: '4', s1_words: '5', correct_response: '1'},
  {sentence_id: '15', sentence_id_specific: '15_4', s1: 'Nukaga toqqoriikatappoq kigutigissartinneq nuannarineq ajoramiuk.', s2: 'Nukaga toqqoriikatappoq kigutigissartinneq nuannarineq ajoramiuk.', s1_with_line_breaks: '<p> Nukaga toqqoriikatappoq </p><p> kigutigissartinneq nuannarineq ajoramiuk. </p>', s2_with_line_breaks: '<p> Nukaga toqqoriikatappoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', s1_danish: 'Min lillesøster har allerede gemt sig, fordi hun ikke kan lide at få børstet tænder.', s2_danish: 'Min lillesøster har allerede gemt sig, fordi hun ikke kan lide at få børstet tænder.', change_type: 'no_change', affix_type: 'grammatical', affix: 'riikatag', filler_condition: 'filler', target_word: 'toqqoriikatappoq', changed_word: 'toqqoriikatappoq', target_word_no_affix: 'toqqorpoq', reverse_target_position: '4', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '15', sentence_id_specific: '15_5', s1: 'Nukaga toqqorpoq kigutigissartinneq nuannarineq ajoramiuk.', s2: 'Toqqorpoq kigutigissartinneq nuannarineq ajoramiuk.', s1_with_line_breaks: '<p> Nukaga toqqorpoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', s2_with_line_breaks: '<p> Toqqorpoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', s1_danish: 'Min lillesøster gemmer sig, fordi hun ikke kan lide at få børstet tænder.', s2_danish: 'Hun gemmer sig, fordi hun ikke kan lide at få børstet tænder.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Nukaga', changed_word: 'NA', target_word_no_affix: 'toqqorpoq', reverse_target_position: '5', s1_words: '5', correct_response: '4'},
  {sentence_id: '15', sentence_id_specific: '15_6', s1: 'Nukaga toqqorpoq kigutigissartinneq nuannarineq ajoramiuk.', s2: 'Nukaga toqqorpoq illaatinneq nuannarineq ajoramiuk.', s1_with_line_breaks: '<p> Nukaga toqqorpoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', s2_with_line_breaks: '<p> Nukaga toqqorpoq illaatinneq </p><p> nuannarineq ajoramiuk. </p>', s1_danish: 'Min lillesøster gemmer sig, fordi hun ikke kan lide at få børstet tænder.', s2_danish: 'Min lillesøster gemmer sig, fordi hun ikke kan lide at få redt hår.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'kigutigissartinneq', changed_word: 'illaatinneq', target_word_no_affix: 'toqqorpoq', reverse_target_position: '3', s1_words: '5', correct_response: '2'},
  {sentence_id: '16', sentence_id_specific: '16_1', s1: 'Nivi qineqqissaarpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s2: 'Nivi qinerpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s1_with_line_breaks: '<p> Nivi qineqqissaarpoq kisianni </p><p> apimmat takusaqarpiarsinnaanngilaq. </p>', s2_with_line_breaks: '<p> Nivi qinerpoq kisianni apimmat </p><p> takusaqarpiarsinnaanngilaq. </p>', s1_danish: 'Nivi ser sig omhyggeligt om, men det er svært at se noget på grund af snevejret.', s2_danish: 'Nivi ser sig om, men det er svært at se noget på grund af snevejret.', change_type: 'affix_deletion', affix_type: 'lexical', affix: 'qqissaar', filler_condition: 'critical', target_word: 'qineqqissaarpoq', changed_word: 'qinerpoq', target_word_no_affix: 'qinerpoq', reverse_target_position: '4', s1_words: '5', correct_response: '1'},
  {sentence_id: '16', sentence_id_specific: '16_2', s1: 'Nivi qineqqissaarpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s2: 'Nivi qineqqissaarpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s1_with_line_breaks: '<p> Nivi qineqqissaarpoq kisianni </p><p> apimmat takusaqarpiarsinnaanngilaq. </p>', s2_with_line_breaks: '<p> Nivi qineqqissaarpoq kisianni apimmat </p><p> takusaqarpiarsinnaanngilaq. </p>', s1_danish: 'Nivi ser sig omhyggeligt om, men det er svært at se noget på grund af snevejret.', s2_danish: 'Nivi ser sig omhyggeligt om, men det er svært at se noget på grund af snevejret.', change_type: 'no_change', affix_type: 'lexical', affix: 'qqissaar', filler_condition: 'filler', target_word: 'qineqqissaarpoq', changed_word: 'qineqqissaarpoq', target_word_no_affix: 'qinerpoq', reverse_target_position: '4', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '16', sentence_id_specific: '16_3', s1: 'Nivi qineraluarpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s2: 'Nivi qinerpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s1_with_line_breaks: '<p> Nivi qineraluarpoq kisianni </p><p> apimmat takusaqarpiarsinnaanngilaq. </p>', s2_with_line_breaks: '<p> Nivi qinerpoq kisianni apimmat </p><p> takusaqarpiarsinnaanngilaq. </p>', s1_danish: 'Nivi ser sig ellers om, men det er svært at se noget på grund af snevejret.', s2_danish: 'Nivi ser sig om, men det er svært at se noget på grund af snevejret.', change_type: 'affix_deletion', affix_type: 'grammatical', affix: 'galuar', filler_condition: 'critical', target_word: 'qineraluarpoq', changed_word: 'qinerpoq', target_word_no_affix: 'qinerpoq', reverse_target_position: '4', s1_words: '5', correct_response: '1'},
  {sentence_id: '16', sentence_id_specific: '16_4', s1: 'Nivi qineraluarpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s2: 'Nivi qineraluarpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s1_with_line_breaks: '<p> Nivi qineraluarpoq kisianni </p><p> apimmat takusaqarpiarsinnaanngilaq. </p>', s2_with_line_breaks: '<p> Nivi qineraluarpoq kisianni apimmat </p><p> takusaqarpiarsinnaanngilaq. </p>', s1_danish: 'Nivi ser sig ellers om, men det er svært at se noget på grund af snevejret.', s2_danish: 'Nivi ser sig ellers om, men det er svært at se noget på grund af snevejret.', change_type: 'no_change', affix_type: 'grammatical', affix: 'galuar', filler_condition: 'filler', target_word: 'qineraluarpoq', changed_word: 'qineraluarpoq', target_word_no_affix: 'qinerpoq', reverse_target_position: '4', s1_words: '5', correct_response: 'NA'},
  {sentence_id: '16', sentence_id_specific: '16_5', s1: 'Nivi qinerpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s2: 'Qinerpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s1_with_line_breaks: '<p> Nivi qinerpoq kisianni </p><p> apimmat takusaqarpiarsinnaanngilaq. </p>', s2_with_line_breaks: '<p> Qinerpoq kisianni apimmat </p><p> takusaqarpiarsinnaanngilaq. </p>', s1_danish: 'Nivi ser sig om, men det er svært at se noget på grund af snevejret.', s2_danish: 'Hun ser sig om, men det er svært at se noget på grund af snevejret.', change_type: 'subject_deletion', affix_type: 'NA', affix: 'NA', filler_condition: 'critical', target_word: 'Nivi', changed_word: 'NA', target_word_no_affix: 'qinerpoq', reverse_target_position: '5', s1_words: '5', correct_response: '4'},
  {sentence_id: '16', sentence_id_specific: '16_6', s1: 'Nivi qinerpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', s2: 'Nivi qinerpoq kisianni siallermat takusaqarpiarsinnaanngilaq.', s1_with_line_breaks: '<p> Nivi qinerpoq kisianni </p><p> apimmat takusaqarpiarsinnaanngilaq. </p>', s2_with_line_breaks: '<p> Nivi qinerpoq kisianni siallermat </p><p> takusaqarpiarsinnaanngilaq. </p>', s1_danish: 'Nivi ser sig om, men det er svært at se noget på grund af snevejret.', s2_danish: 'Nivi ser sig om, men det er svært at se noget på grund af regnvejret.', change_type: 'other_change', affix_type: 'NA', affix: 'NA', filler_condition: 'filler', target_word: 'apimmat', changed_word: 'siallermat', target_word_no_affix: 'qinerpoq', reverse_target_position: '2', s1_words: '5', correct_response: '3'}
];


function splitToNChunks(array, n) {
    let result = [];
    for (let i = n; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
  }
  
  // randomisation
let no_fill = [];
let fill = [];
  
  // split into fillers and non-fillers
for (var i in sentences) {
    if (sentences[i]["filler_condition"] == "critical") { 
      no_fill.push(sentences[i])
    }
    if (sentences[i]["filler_condition"] == "filler") {
      fill.push(sentences[i])
    }
  }
  // shuffle fillers
fill = jsPsych.randomization.repeat(fill, 1);
  // shuffle non-fillers
no_fill = jsPsych.randomization.repeat(no_fill, 1);
  // split to chunks
chunks_filler = splitToNChunks(fill, 4)
chunks_no_filler = splitToNChunks(no_fill, 4)
  // concatenate chunks and shuffle each of the four chunks separately
all_sentences = jsPsych.randomization.repeat(chunks_filler[0].concat(chunks_no_filler[0]), 1).concat(jsPsych.randomization.repeat(chunks_filler[1].concat(chunks_no_filler[1]), 1), 
jsPsych.randomization.repeat(chunks_filler[2].concat(chunks_no_filler[2]), 1), jsPsych.randomization.repeat(chunks_filler[3].concat(chunks_no_filler[3]), 1))
console.log(all_sentences)


// four practice trials
var practice_trial_1 = make_trial(
  'p1', 'p1', 'Piitaq kommunemut maalaarpoq kisianni sanaartorneq unitsinneqanngilaq.', 
  'Piitaq borgmesterimut maalaarpoq kisianni sanaartorneq unitsinneqanngilaq.', 
  '<p> Piitaq kommunemut maalaarpoq kisianni </p><p> sanaartorneq unitsinneqanngilaq. </p>', 
  '<p> Piitaq borgmesterimut maalaarpoq </p><p> kisianni sanaartorneq unitsinneqanngilaq. </p>',
  'Peter klager til kommunen men byggeriet bliver ikke stoppet.', 
  'Peter klager til borgmesteren men byggeriet bliver ikke stoppet.',
  'NA', 'NA', 'NA',  'NA', 'kommunemut', 'borgmesterimut',
  'NA', '5', '6', '1')

var practice_trial_2 = make_trial(
  'p2', 'p2',
  'Johanne igavoq unnugu amerlasuunik pulaartoqarniarami.', 
  'Johanne igavoq unnugu amerlasuunik pulaartoqarniarami.', 
  '<p> Johanne igavoq unnugu </p><p> amerlasuunik pulaartoqarniarami. </p>', 
  '<p> Johanne igavoq unnugu </p><p> amerlasuunik pulaartoqarniarami. </p>',
  'Johanne laver mad fordi hun får mange gæster i aften.', 
  'Johanne laver mad fordi hun får mange gæster i aften.',
  'NA', 'NA', 'NA', 'NA', 'NA', 'NA',
  'NA', 'NA', '5', 'NA'
)

var practice_trial_3 = make_trial(
  'p3', 'p3',
  'Nuka sapaatip akunnera kingulleq ilaquttani pulaarlugit Sisimiuniippoq.', 
  'Nuka sapaatip akunnera kingulleq ilaquttani pulaarlugit Ilulissaniippoq.', 
  '<p> Nuka sapaatip akunnera kingulleq </p><p> ilaquttani pulaarlugit Sisimiuniippoq. </p>', 
  '<p> Nuka sapaatip akunnera kingulleq </p><p> ilaquttani pulaarlugit Ilulissaniippoq. </p>',
  'Nuka har været i Sismiut i sidste uge for at besøge sin familie.', 
  'Nuka har været i Ilulissat i sidste uge for at besøge sin familie.',
  'NA', 'NA', 'NA', 'NA', 'Sisimiuniippoq', 'Ilulissaniippoq',
  'NA', '1', '7', '6'
)

var practice_trial_4 = make_trial(
  'p4', 'p4',
  'Nina umiatsiamik pisisimavoq taava angalaarsinnaavoq.', 
  'Nina umiatsiamik pisisimavoq taava angalaarsinnaavoq.', 
  '<p> Nina umiatsiamik pisisimavoq </p><p> taava angalaarsinnaavoq. </p>', 
  '<p> Nina umiatsiamik pisisimavoq </p><p> taava angalaarsinnaavoq. </p>',
  'Nina har købt en båd så hun kan sejle ud på tur.', 
  'Nina har købt en båd så hun kan sejle ud på tur.',
  'NA', 'NA', 'NA', 'NA', 'NA', 'NA',
  'NA', 'NA', '5', 'NA'
)

timeline.push(practice_trial_1)

// feedback practice trial 1
var feedback_trial_1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    var previousResponse = jsPsych.data.getLastTrialData().values()[0].response;
    //console.log('Previous Response:', previousResponse);
    // display different stimuli based on the previous response
    if (previousResponse === 1) {
      return '<p><span style="color: green">Eqqorpoq!</span></p><p>Oqaaseq <i>kommunemut</i>-mit <i>borgmesterimut</i>-mut allanngortinneqarsimavoq.</p>'; // Rigtigt! Ordet kommune var ændret til borgmester
    } else {
      return '<p><span style="color: red">Eqqunngilaq!</span></p><p>Oqaaseq <i>kommunemut</i>-mit <i>borgmesterimut</i>-mut allanngortinneqarsimavoq.</p>'; // Forkert! Ordet kommune var ændret til borgmester
    }
  },
  choices: ['Ingerlaqqigit'] // Fortsæt
}
timeline.push(feedback_trial_1)

timeline.push(practice_trial_2)

// feedback practice trial 2
var feedback_trial_2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    var previousPreviousResponse = jsPsych.data.get().last(2).values()[0].response;
    console.log('Previous previous Response:', previousPreviousResponse);
    // display different stimuli based on the previous response
    if (previousPreviousResponse === 1) {
      return '<p><span style="color: green">Eqqorpoq!</span></p><p>Oqaaseqatigiinni allanngortoqarsimanngilaq.</p>'; // Rigtigt! Der var ingen ændring i sætningen
    } else {
      return '<p><span style="color: red">Eqqunngilaq!</span></p><p>Oqaaseqatigiinni allanngortoqarsimanngilaq.</p>'; // Forkert! Der var ingen ændring i sætningen
    }
  },
  choices: ['Ingerlaqqigit'] // Fortsæt
}
timeline.push(feedback_trial_2)

timeline.push(practice_trial_3)

// feedback practice trial 3
var feedback_trial_3 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    var previousResponse = jsPsych.data.getLastTrialData().values()[0].response;
    console.log('Previous Response:', previousResponse);
    // display different stimuli based on the previous response
    if (previousResponse === 6) {
      return '<p><span style="color: green">Eqqorpoq!</span></p><p>Oqaaseq <i>Sisimiuniippoq</i>-mit <i>Ilulissaniippoq</i>-mut allanngortinneqarsimavoq.</p>'; // Rigtigt! Ordet kommune var ændret til borgmester
    } else {
      return '<p><span style="color: red">Eqqunngilaq!</span></p><p>Oqaaseq <i>Sisimiuniippoq</i>-mit <i>Ilulissaniippoq</i>-mut allanngortinneqarsimavoq.</p>'; // Forkert! Ordet kommune var ændret til borgmester
    }
  },
  choices: ['Ingerlaqqigit'] // Fortsæt
}
timeline.push(feedback_trial_3)

timeline.push(practice_trial_4)

// feedback practice trial 4
var feedback_trial_4 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function() {
    var previousPreviousResponse = jsPsych.data.get().last(2).values()[0].response;
    console.log('Previous previous Response:', previousPreviousResponse);
    // display different stimuli based on the previous response
    if (previousPreviousResponse === 1) {
      return '<p><span style="color: green">Eqqorpoq!</span></p><p>Oqaaseqatigiinni allanngortoqarsimanngilaq.</p>'; // Rigtigt! Der var ingen ændring i sætningen
    } else {
      return '<p><span style="color: red">Eqqunngilaq!</span></p><p>Oqaaseqatigiinni allanngortoqarsimanngilaq.</p>'; // Forkert! Der var ingen ændring i sætningen
    }
  },
  choices: ['Ingerlaqqigit'] // Fortsæt
}
timeline.push(feedback_trial_4)


// experiment start
var experiment_start = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "<p>Massakkut misissuinertavianut ingerlaqqilerpugut.</p><p>Sapinngisat naapertorlugu sukkasuumik kukkunaveersaartumik suliarissavatit.</p>", // Nu begynder det rigtige eksperiment. Du skal lave det så hurtigt og så rigtigt som muligt
  choices: ["Aallartinniarlutit una tooruk"], // Klik her for at begynde.
  post_trial_gap: 1000
};
timeline.push(experiment_start)

for (var i in all_sentences) {
  timeline.push(make_trial(
    all_sentences[i]['sentence_id'],all_sentences[i]["sentence_id_specific"],
    all_sentences[i]['s1'],all_sentences[i]['s2'],
    all_sentences[i]['s1_with_line_breaks'],all_sentences[i]['s2_with_line_breaks'],
    all_sentences[i]['s1_danish'],all_sentences[i]['s2_danish'],
    all_sentences[i]['change_type'],all_sentences[i]['affix_type'], 
    all_sentences[i]['affix'], all_sentences[i]['filler_condition'], all_sentences[i]['target_word'], 
    all_sentences[i]['changed_word'], all_sentences[i]['target_word_no_affix'], all_sentences[i]['reverse_target_position'], 
    all_sentences[i]['s1_words'], all_sentences[i]['correct_response']))
}


// experiment done
var done = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Ingerlaqqigit'], // Fortsæt
    stimulus: function() {
      return "<p>Misissuinermi suliassaq siulliit naammassivatit!</p>"; // Nu er du færdig med første del!
    },
    on_finish: saveData(participant_id + '_changeblindness_v2.csv', jsPsych.data.get().csv())
    };
timeline.push(done)

// ____________SENTENCE RATING________________
// ___________________________________________

// instructions
var instructions_ratings = {
  type: jsPsychHtmlButtonResponse,
  stimulus: 
    "<p> Misissuinerup immikkoortuata aappaanni, aamma kalaallisut oqaaseqatigiinnik atuaqquneqassaatit. </p>"+ // I den næste del af eksperimentet vil du igen blive bedt om at læse nogle sætninger på grønlandsk.
    "<p> Nalilersussavat oqaaseqatigiit naliginnaassusaat. </p>"+ // Du skal vurdere hvor normal sætningen er.
    "<p> Kalaallisut oqallorippallaanngitsup tamanna oqaatigissavaa? Immaqaluunniit kalaallisut oqallorissup kalaallisut oqaaseqatigiit taamatut oqaatigissavai? </p>"+ // Lyder det som noget en nybegynder i grønlandsk ville sige? Eller er det noget en flydende grønlandsktaler ville sige?
    "<p> Assersuutigalugu oqaaseqatigiit uku kalaallisut oqallorissup imatut oqaatigissavai: <span style='color: green'>Ullaaq makikkama atisalersorpunga.</span></p>"+ // Denne her sætning lyder fx som en flydende grønlandsktaler: Da jeg stod op i morges tog jeg tøj på.
    "<p> Oqallorippallaanngitsullu imatut oqaatigissavai: <span style='color: red'>Aviisimut anaanaga atuaqquara.</span></p>"+ // Og sådan her ville en nybegynder sige: Jeg beder avisen om at læse min mor. (skulle have været anaanannut aviisi atuaqquara)
    "<p> Oqaaseqatigiillu kalaallisut oqaatsitigut pikkorilaartup imatut oqaatigissavai: <span style='color: orange'>Ullut tamaasa ullaakkut allaffinnut sikkilerpunga.</span></p>", // Og sådan her ville én der er middelgod (lidt god) til grønlandsk sige: ”Hver dag om morgenen cykler jeg til kontoret.” (korrekt sætning bortset fra at der mangler habituelt -tar)
  choices: ["Aallartinniarlutit una tooruk"], // Klik her for at begynde.
  post_trial_gap: 1000
};
timeline.push(instructions_ratings)

// function for making rating trial
function make_rating_trial(sentence_id, condition, sentence, sentence_with_line_breaks, affix) {
var rating_trial = {type: jsPsychHtmlKeyboardResponse,
             timeline:[
              {type: jsPsychHtmlSliderResponse,
                stimulus:'<div style="font-size:40px">' + sentence_with_line_breaks +"</div>",
              labels:["Kalaallisut oqallorinngissup", "Kalaallisut oqallorippaallaanngitsup","Kalaallisut oqallorissup"], // Nybegynder (ikke god til grønlandsk), middelgod taler (lidt god til grønlandsk), flydende taler (god til grønlandsk)
              button_label: "Ingerlaqqigit",
              require_movement: true,
              prompt:"<p><em>Kiap oqaaseqatigiit ukua oqaatigisinnaavai?</em></p>", // Hvem kunne have sagt denne sætning?
                on_finish: function (data) {
                  data.sentence_for_rating = sentence
                  data.sentence_id = sentence_id
                  data.condition = condition
                  data.affix = affix
                  data.rating_response = data.response
                  data.phase = 'rating'
                  //data.response = 'NA'
                  saveData(participant_id + '_changeblindness_v2.csv', jsPsych.data.get().csv())
                }
              }
            ]}
return rating_trial //return the trial you have built
}

// stimuli
var rating_sentences = [
  {sentence_id: '1', condition: 'lexical_affix', sentence: 'Ualimut kammalaatiga pulaariataarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', sentence_with_line_breaks: '<p> Ualimut kammalaatiga pulaariataarpoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', affix: 'riataar'},
  {sentence_id: '1', condition: 'grammatical_affix', sentence: 'Ualimut kammalaatiga pulaarunnarsivoq taamaammat kaffiliorpunga kaagiliorlungalu.', sentence_with_line_breaks: '<p> Ualimut kammalaatiga pulaarunnarsivoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', affix: 'junnarsi'},
  {sentence_id: '1', condition: 'no_affix', sentence: 'Ualimut kammalaatiga pulaarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', sentence_with_line_breaks: '<p> Ualimut kammalaatiga pulaarpoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', affix: 'NA'},
  {sentence_id: '1', condition: 'no_subject', sentence: 'Ualimut pulaarpoq taamaammat kaffiliorpunga kaagiliorlungalu.', sentence_with_line_breaks: '<p> Ualimut pulaarpoq taamaammat </p><p> kaffiliorpunga kaagiliorlungalu. </p>', affix: 'NA'},
  {sentence_id: '2', condition: 'lexical_affix', sentence: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerniarsarivoq.', sentence_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat taamaammat </p><p> Minik qulinik ukiulik sanerniarsarivoq. </p>', affix: 'niarsare'},
  {sentence_id: '2', condition: 'grammatical_affix', sentence: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanernikuuvoq.', sentence_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat taamaammat </p><p> Minik qulinik ukiulik sanernikuuvoq. </p>', affix: 'nikuu'},
  {sentence_id: '2', condition: 'no_affix', sentence: 'Igaffimmi nateq saneqangaarmat taamaammat Minik qulinik ukiulik sanerpoq.', sentence_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat </p><p> taamaammat Minik qulinik ukiulik sanerpoq. </p>', affix: 'NA'},
  {sentence_id: '2', condition: 'no_subject', sentence: 'Igaffimmi nateq saneqangaarmat taamaammat qulinik ukiulik sanerpoq.', sentence_with_line_breaks: '<p> Igaffimmi nateq saneqangaarmat </p><p> taamaammat qulinik ukiulik sanerpoq. </p>', affix: 'NA'},
  {sentence_id: '3', condition: 'lexical_affix', sentence: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisartuaannarpoq.', sentence_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq </p><p> taamaattorli Aputsiaq suli aalisartuaannarpoq. </p>', affix: 'juaannar'},
  {sentence_id: '3', condition: 'grammatical_affix', sentence: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarumaarpoq.', sentence_with_line_breaks: '<p> Ukiup taamaalinerani assut silarluttarpoq </p><p> taamaattorli Aputsiaq suli aalisarumaarpoq. </p>', affix: 'jumaar'},
  {sentence_id: '3', condition: 'no_affix', sentence: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli Aputsiaq suli aalisarpoq.', sentence_with_line_breaks: '<p> Ukiup taamaalinerani assut </p><p> silarluttarpoq taamaattorli Aputsiaq suli aalisarpoq. </p>', affix: 'NA'},
  {sentence_id: '3', condition: 'no_subject', sentence: 'Ukiup taamaalinerani assut silarluttarpoq taamaattorli suli aalisarpoq.', sentence_with_line_breaks: '<p> Ukiup taamaalinerani assut </p><p> silarluttarpoq taamaattorli suli aalisarpoq. </p>', affix: 'NA'},
  {sentence_id: '4', condition: 'lexical_affix', sentence: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapinneruvoq atuagassaqaqaarlu.', sentence_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat </p><p> ilinniartoq ulapinneruvoq atuagassaqaqaarlu. </p>', affix: 'neru'},
  {sentence_id: '4', condition: 'grammatical_affix', sentence: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapinnguatsiarpoq atuagassaqaqaarlu.', sentence_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat </p><p> ilinniartoq ulapinnguatsiarpoq atuagassaqaqaarlu. </p>', affix: 'nnguatsiar'},
  {sentence_id: '4', condition: 'no_affix', sentence: 'Soraarummeerfiup naligivaa taamaammat ilinniartoq ulapippoq atuagassaqaqaarlu.', sentence_with_line_breaks: '<p> Soraarummeerfiup naligivaa taamaammat ilinniartoq </p><p> ulapippoq atuagassaqaqaarlu. </p>', affix: 'NA'},
  {sentence_id: '4', condition: 'no_subject', sentence: 'Soraarummeerfiup naligivaa taamaammat ulapippoq atuagassaqaqaarlu.', sentence_with_line_breaks: '<p> Soraarummeerfiup naligivaa </p><p> taamaammat ulapippoq atuagassaqaqaarlu. </p>', affix: 'NA'},
  {sentence_id: '5', condition: 'lexical_affix', sentence: 'Sila qiianarmat siallerlunilu meeqqat nuffaseriataarput angerlarsimallutillu.', sentence_with_line_breaks: '<p> Sila qiianarmat siallerlunilu meeqqat </p><p> nuffaseriataarput angerlarsimallutillu. </p>', affix: 'riataar'},
  {sentence_id: '5', condition: 'grammatical_affix', sentence: 'Sila qiianarmat siallerlunilu meeqqat nuffaseqqajaapput angerlarsimallutillu.', sentence_with_line_breaks: '<p> Sila qiianarmat siallerlunilu meeqqat </p><p> nuffaseqqajaapput angerlarsimallutillu. </p>', affix: 'qqajaa'},
  {sentence_id: '5', condition: 'no_affix', sentence: 'Sila qiianarmat siallerlunilu meeqqat nuffaserput angerlarsimallutillu.', sentence_with_line_breaks: '<p> Sila qiianarmat siallerlunilu </p><p> meeqqat nuffaserput angerlarsimallutillu. </p>', affix: 'NA'},
  {sentence_id: '5', condition: 'no_subject', sentence: 'Sila qiianarmat siallerlunilu nuffaserput angerlarsimallutillu.', sentence_with_line_breaks: '<p> Sila qiianarmat siallerlunilu </p><p> nuffaserput angerlarsimallutillu. </p>', affix: 'NA'},
  {sentence_id: '6', condition: 'lexical_affix', sentence: 'Assut siallingaatsialermat Ivalu anipallappoq manisallu eqqullugit.', sentence_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu anipallappoq </p><p> manisallu eqqullugit. </p>', affix: 'pallag'},
  {sentence_id: '6', condition: 'grammatical_affix', sentence: 'Assut siallingaatsialermat Ivalu aneriikatappoq manisallu eqqullugit.', sentence_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu aneriikatappoq </p><p> manisallu eqqullugit. </p>', affix: 'riikatag'},
  {sentence_id: '6', condition: 'no_affix', sentence: 'Assut siallingaatsialermat Ivalu anivoq manisallu eqqullugit.', sentence_with_line_breaks: '<p> Assut siallingaatsialermat Ivalu </p><p> anivoq manisallu eqqullugit. </p>', affix: 'NA'},
  {sentence_id: '6', condition: 'no_subject', sentence: 'Assut siallingaatsialermat anivoq manisallu eqqullugit.', sentence_with_line_breaks: '<p> Assut siallingaatsialermat anivoq </p><p> manisallu eqqullugit. </p>', affix: 'NA'},
  {sentence_id: '7', condition: 'lexical_affix', sentence: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerineruvoq.', sentence_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat nukappiaraq pilerineruvoq. </p>', affix: 'neru'},
  {sentence_id: '7', condition: 'grammatical_affix', sentence: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerinnguatsiarpoq.', sentence_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat nukappiaraq pilerinnguatsiarpoq. </p>', affix: 'nnguatsiar'},
  {sentence_id: '7', condition: 'no_affix', sentence: 'Aqagu tivoli illoqarfimmut piniarmat nukappiaraq pilerivoq.', sentence_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut piniarmat </p><p> nukappiaraq pilerivoq. </p>', affix: 'NA'},
  {sentence_id: '7', condition: 'no_subject', sentence: 'Aqagu tivoli illoqarfimmut piniarmat pilerivoq.', sentence_with_line_breaks: '<p> Aqagu tivoli illoqarfimmut </p><p> piniarmat pilerivoq. </p>', affix: 'NA'},
  {sentence_id: '8', condition: 'lexical_affix', sentence: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerniarsarivaa.', sentence_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap </p><p> tujuuluk qilattarlugu inerniarsarivaa. </p>', affix: 'niarsare'},
  {sentence_id: '8', condition: 'grammatical_affix', sentence: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu ineqqammerpaa.', sentence_with_line_breaks: '<p> Arfininngorpat katittuussagatta Miap </p><p> tujuuluk qilattarlugu ineqqammerpaa. </p>', affix: 'qqammer'},
  {sentence_id: '8', condition: 'no_affix', sentence: 'Arfininngorpat katittuussagatta Miap tujuuluk qilattarlugu inerpaa.', sentence_with_line_breaks: '<p> Arfininngorpat katittuussagatta </p><p> Miap tujuuluk qilattarlugu inerpaa. </p>', affix: 'NA'},
  {sentence_id: '8', condition: 'no_subject', sentence: 'Arfininngorpat katittuussagatta tujuuluk qilattarlugu inerpaa.', sentence_with_line_breaks: '<p> Arfininngorpat katittuussagatta tujuuluk </p><p> qilattarlugu inerpaa. </p>', affix: 'NA'},
  {sentence_id: '9', condition: 'lexical_affix', sentence: 'Anorersuarpasilerpoq taamaattumik aataga angerlajaarpoq.', sentence_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlajaarpoq. </p>', affix: 'jaar'},
  {sentence_id: '9', condition: 'grammatical_affix', sentence: 'Anorersuarpasilerpoq taamaattumik aataga angerlarumaarpoq.', sentence_with_line_breaks: '<p> Anorersuarpasilerpoq taamaattumik </p><p> aataga angerlarumaarpoq. </p>', affix: 'jumaar'},
  {sentence_id: '9', condition: 'no_affix', sentence: 'Anorersuarpasilerpoq taamaattumik aataga angerlarpoq.', sentence_with_line_breaks: '<p> Anorersuarpasilerpoq </p><p> taamaattumik aataga angerlarpoq. </p>', affix: 'NA'},
  {sentence_id: '9', condition: 'no_subject', sentence: 'Anorersuarpasilerpoq taamaattumik angerlarpoq.', sentence_with_line_breaks: '<p> Anorersuarpasilerpoq </p><p> taamaattumik angerlarpoq. </p>', affix: 'NA'},
  {sentence_id: '10', condition: 'lexical_affix', sentence: 'Naalungiarsuk nipangilertorpoq pissutigalugu anaanaminiit nerisinneqarami.', sentence_with_line_breaks: '<p> Naalungiarsuk nipangilertorpoq pissutigalugu </p><p> anaanaminiit nerisinneqarami. </p>', affix: 'lertor'},
  {sentence_id: '10', condition: 'grammatical_affix', sentence: 'Naalungiarsuk nipangeqqammerpoq pissutigalugu anaanaminiit nerisinneqarami.', sentence_with_line_breaks: '<p> Naalungiarsuk nipangeqqammerpoq pissutigalugu </p><p> anaanaminiit nerisinneqarami. </p>', affix: 'qqammer'},
  {sentence_id: '10', condition: 'no_affix', sentence: 'Naalungiarsuk nipangerpoq pissutigalugu anaanaminiit nerisinneqarami.', sentence_with_line_breaks: '<p> Naalungiarsuk nipangerpoq </p><p> pissutigalugu anaanaminiit nerisinneqarami. </p>', affix: 'NA'},
  {sentence_id: '10', condition: 'no_subject', sentence: 'Nipangerpoq pissutigalugu anaanaminiit nerisinneqarami.', sentence_with_line_breaks: '<p> Nipangerpoq pissutigalugu anaanaminiit </p><p> nerisinneqarami. </p>', affix: 'NA'},
  {sentence_id: '11', condition: 'lexical_affix', sentence: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasujaarpoq.', sentence_with_line_breaks: '<p> Ullumi ualeq naallugu kaffillertoqarmat </p><p> taamaammat aanaga qasujaarpoq. </p>', affix: 'jaar'},
  {sentence_id: '11', condition: 'grammatical_affix', sentence: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasoqqajaavoq.', sentence_with_line_breaks: '<p> Ullumi ualeq naallugu kaffillertoqarmat </p><p> taamaammat aanaga qasoqqajaavoq. </p>', affix: 'qqajaa'},
  {sentence_id: '11', condition: 'no_affix', sentence: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat aanaga qasuvoq.', sentence_with_line_breaks: '<p> Ullumi ualeq naallugu </p><p> kaffillertoqarmat taamaammat aanaga qasuvoq. </p>', affix: 'NA'},
  {sentence_id: '11', condition: 'no_subject', sentence: 'Ullumi ualeq naallugu kaffillertoqarmat taamaammat qasuvoq.', sentence_with_line_breaks: '<p> Ullumi ualeq naallugu </p><p> kaffillertoqarmat taamaammat qasuvoq. </p>', affix: 'NA'},
  {sentence_id: '12', condition: 'lexical_affix', sentence: 'Ukiuummat aataga angerlarsimajuaannarpoq qisunnik sanalulluni.', sentence_with_line_breaks: '<p> Ukiuummat aataga angerlarsimajuaannarpoq </p><p> qisunnik sanalulluni. </p>', affix: 'juaannar'},
  {sentence_id: '12', condition: 'grammatical_affix', sentence: 'Ukiuummat aataga angerlarsimajunnarsivoq qisunnik sanalulluni.', sentence_with_line_breaks: '<p> Ukiuummat aataga angerlarsimajunnarsivoq </p><p> qisunnik sanalulluni. </p>', affix: 'junnarsi'},
  {sentence_id: '12', condition: 'no_affix', sentence: 'Ukiuummat aataga angerlarsimavoq qisunnik sanalulluni.', sentence_with_line_breaks: '<p> Ukiuummat aataga </p><p> angerlarsimavoq qisunnik sanalulluni. </p>', affix: 'NA'},
  {sentence_id: '12', condition: 'no_subject', sentence: 'Ukiuummat angerlarsimavoq qisunnik sanalulluni.', sentence_with_line_breaks: '<p> Ukiuummat angerlarsimavoq </p><p> qisunnik sanalulluni. </p>', affix: 'NA'},
  {sentence_id: '13', condition: 'lexical_affix', sentence: 'Ane aperilertorpoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', sentence_with_line_breaks: '<p> Ane aperilertorpoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', affix: 'lertor'},
  {sentence_id: '13', condition: 'grammatical_affix', sentence: 'Ane aperinikuuvoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', sentence_with_line_breaks: '<p> Ane aperinikuuvoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', affix: 'nikuu'},
  {sentence_id: '13', condition: 'no_affix', sentence: 'Ane aperivoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', sentence_with_line_breaks: '<p> Ane aperivoq kammalaatini atuarfimmiit </p><p> illoqarfiliaqatigisinnaanerlugit. </p>', affix: 'NA'},
  {sentence_id: '13', condition: 'no_subject', sentence: 'Aperivoq kammalaatini atuarfimmiit illoqarfiliaqatigisinnaanerlugit.', sentence_with_line_breaks: '<p> Aperivoq kammalaatini </p><p> atuarfimmiit illoqarfiliaqatigisinnaanerlugit. </p>', affix: 'NA'},
  {sentence_id: '14', condition: 'lexical_affix', sentence: 'Malik pisiniarfimmut biilipallappoq kisianni ruuat nungussimapput.', sentence_with_line_breaks: '<p> Malik pisiniarfimmut biilipallappoq </p><p> kisianni ruuat nungussimapput. </p>', affix: 'pallag'},
  {sentence_id: '14', condition: 'grammatical_affix', sentence: 'Malik pisiniarfimmut biileraluarpoq kisianni ruuat nungussimapput.', sentence_with_line_breaks: '<p> Malik pisiniarfimmut biileraluarpoq </p><p> kisianni ruuat nungussimapput. </p>', affix: 'galuar'},
  {sentence_id: '14', condition: 'no_affix', sentence: 'Malik pisiniarfimmut biilerpoq kisianni ruuat nungussimapput.', sentence_with_line_breaks: '<p> Malik pisiniarfimmut biilerpoq kisianni </p><p> ruuat nungussimapput. </p>', affix: 'NA'},
  {sentence_id: '14', condition: 'no_subject', sentence: 'Pisiniarfimmut biilerpoq kisianni ruuat nungussimapput.', sentence_with_line_breaks: '<p> Pisiniarfimmut biilerpoq kisianni </p><p> ruuat nungussimapput. </p>', affix: 'NA'},
  {sentence_id: '15', condition: 'lexical_affix', sentence: 'Nukaga toqqoqqissaarpoq kigutigissartinneq nuannarineq ajoramiuk.', sentence_with_line_breaks: '<p> Nukaga toqqoqqissaarpoq </p><p> kigutigissartinneq nuannarineq ajoramiuk. </p>', affix: 'qqissaar'},
  {sentence_id: '15', condition: 'grammatical_affix', sentence: 'Nukaga toqqoriikatappoq kigutigissartinneq nuannarineq ajoramiuk.', sentence_with_line_breaks: '<p> Nukaga toqqoriikatappoq </p><p> kigutigissartinneq nuannarineq ajoramiuk. </p>', affix: 'riikatag'},
  {sentence_id: '15', condition: 'no_affix', sentence: 'Nukaga toqqorpoq kigutigissartinneq nuannarineq ajoramiuk.', sentence_with_line_breaks: '<p> Nukaga toqqorpoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', affix: 'NA'},
  {sentence_id: '15', condition: 'no_subject', sentence: 'Toqqorpoq kigutigissartinneq nuannarineq ajoramiuk.', sentence_with_line_breaks: '<p> Toqqorpoq kigutigissartinneq </p><p> nuannarineq ajoramiuk. </p>', affix: 'NA'},
  {sentence_id: '16', condition: 'lexical_affix', sentence: 'Nivi qineqqissaarpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', sentence_with_line_breaks: '<p> Nivi qineqqissaarpoq kisianni </p><p> apimmat takusaqarpiarsinnaanngilaq. </p>', affix: 'qqissaar'},
  {sentence_id: '16', condition: 'grammatical_affix', sentence: 'Nivi qineraluarpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', sentence_with_line_breaks: '<p> Nivi qineraluarpoq kisianni </p><p> apimmat takusaqarpiarsinnaanngilaq. </p>', affix: 'galuar'},
  {sentence_id: '16', condition: 'no_affix', sentence: 'Nivi qinerpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', sentence_with_line_breaks: '<p> Nivi qinerpoq kisianni apimmat </p><p> takusaqarpiarsinnaanngilaq. </p>', affix: 'NA'},
  {sentence_id: '16', condition: 'no_subject', sentence: 'Qinerpoq kisianni apimmat takusaqarpiarsinnaanngilaq.', sentence_with_line_breaks: '<p> Qinerpoq kisianni apimmat </p><p> takusaqarpiarsinnaanngilaq. </p>', affix: 'NA'},
  {sentence_id: 'ungram_1', condition: 'ungrammatical', sentence: 'Nina umiatsiamik pisisimavunga taava angalaarsinnaavoq.', sentence_with_line_breaks: '<p> Nina umiatsiamik pisisimavunga taava </p><p> angalaarsinnaavoq. </p>', affix: 'NA'},
  {sentence_id: 'ungram_2', condition: 'ungrammatical', sentence: 'Johanne igapput unnugu amerlasuunik pulaartoqarniarami.', sentence_with_line_breaks: '<p> Johanne igapput unnugu amerlasuunik </p><p> pulaartoqarniarami. </p>', affix: 'NA'},
  {sentence_id: 'ungram_3', condition: 'ungrammatical', sentence: 'Piitaq kommunemut maalaarpunga kisianni sanaartorneq unitsinneqanngilaq.', sentence_with_line_breaks: '<p> Piitaq kommunemut maalaarpunga kisianni </p><p> sanaartorneq unitsinneqanngilaq. </p>', affix: 'NA'},
  {sentence_id: 'ungram_4', condition: 'ungrammatical', sentence: 'Nuka sapaatip akunnera kingulleq ilaquttani pulaarlugit Sisimiuniipput.', sentence_with_line_breaks: '<p> Nuka sapaatip akunnera kingulleq ilaquttani </p><p> pulaarlugit Sisimiuniipput. </p>', affix: 'NA'}
];

/* // setting sentences_rating variable depending on whether participant is group a or b
if (random_number > 0.5) {
  sentences_rating = sentences_rating_a
}
else {
  sentences_rating = sentences_rating_b
} */

// randomise!
sentences_rating = jsPsych.randomization.repeat(rating_sentences, 1);

for (var i in sentences_rating) {
  timeline.push(make_rating_trial(sentences_rating[i]["sentence_id"],sentences_rating[i]['condition'], sentences_rating[i]['sentence'], sentences_rating[i]['sentence_with_line_breaks'], sentences_rating[i]['affix']))
}


// experiment done
var done_2 = {
type: jsPsychHtmlKeyboardResponse,
choices: "NO_KEYS", // Afslut
on_start: function(trial) {
    var experiment_end = Date.now();
    console.log("Experiment start: " + experiment_start);
    console.log("Experiment end: " + experiment_end);
    var duration_ms = experiment_end - experiment_start;
    var duration_min = Math.round(duration_ms / 60000); // convert to minutes
    trial.stimulus =
      "<p>Misissuineq naammassivoq!</p>" + // Nu er eksperimentet slut!
      "<p><span style='color: blue'>" + totalScore + "/96</span> point-innapputit minutsit <span style='color: blue'>" + duration_min + "</span>-t iluanni naammassinerani.</p>" + // Du fik _ point i alt, og du klarede det på _ minutter.
      "<p>Qujanarujussuaq peqataaninnut!</p>" + // Tusind tak for din deltagelse!
      "<p>Apeqqutissaqaruit uunga allassinnaavutit email: swj@hum.ku.dk.</p>" + // Du kan kontakte denne mail, hvis du har nogen spørgsmål: swj@hum.ku.dk.
      "<p>Matuinnarsinnaavat.</p>"; // Du må gerne lukke dette computervindue nu.
  },
/*stimulus:
  "<p> Naammassivutit! Qujanarujussuaq peqataaninnut! </p>"+ // Nu er du færdig! Tusind tak for din deltagelse!
  "<p> Pointit <span style='color: blue'>" + totalScore + "/96</span> eqqorsimavatit. </p>"+ // Du har fået x/y point.
  "<p> Du brugte " + totalScore + " minutter. </p>", // Du brugte x minutter*/
  //"<p> Illit nammineq isissutissarivat: <b>" + participant_code + "</b> </p>"+ // Din kode er: XXX
  //"<p> Gavekorti* piniarukku, isissutit uunga nassiutissavat: crv510@hum.ku.dk </p>"+ // Du skal sende koden til denne mail for at modtage dit gavekort: crv510@hum.ku.dk
  //"<p> Apeqqutissaqaruit mailimut tassunga aamma attaveqarsinnaavutit. </p>"+ // Det er også denne mail du kan kontakte, hvis du har nogen spørgsmål.
  //"<p> Isissutit kopeereerukku nassiutereerukkulu una nittartagaq matusinnaavat. </p>"+ // Når du har kopieret og sendt koden, må du gerne lukke dette vindue.
  //"<p> <b>Naammassivoq</b> tooruk. </p>" +
  //"<p> <span style='font-size: 12px'>*Gavekorti Akileraartarnermut Aqutsisoqarfimmut nalunaarutigineqassaaq.</span> </p>", // Gavekortet skal indberettes til Skat.
on_close: saveData(participant_id + '_changeblindness_v2.csv', jsPsych.data.get().csv())
};


timeline.push(done_2)

// set time stamp for beginning of experiment
var experiment_start = Date.now();

jsPsych.run(timeline)