const pw_form = document.forms["rsvp-pw-form"]
const email_form = document.forms["rsvp-email-form"]
const events_form = document.forms["rsvp-events-form"]
const food_form = document.forms["rsvp-food-form"]

const dinner_q = "Will you be attending the rehearsal dinner?"
const wedding_q = "Will you be attending the wedding?"
const bbq_q = "Will you be attending the barbecue?"
const schedule_str = (attending) => `Your schedule${(attending > 1) ? "s" : ""} for the weekend ${(attending > 1) ? "are" : "is"} below!`
const success_str = (attending) => `Your RSVP was successfully submitted. ${attending > 0 ? "We are excited to see you soon!" : "We will be sad to miss you!"} Please feel free to update your RSVP at any time if your plans change by returning to the RSVP page and submitting the form again. ${attending > 0 ? schedule_str(attending) : ""}`
const failure_str = "Something went wrong! Please try again or contact us directly if things still don't work."

var rh;
var attending = [];
var forms = [];

const person_events_fn = (nm, i) => `
<fieldset>
  <legend>${nm}</legend>
<div class="wrapper" id="form-wrapper-events-${i}">
<div class="grid-header">
  <div class="header-item-ev"></div>
  <div class="header-item-ev"></div>
  <div class="header-item-ev">Yes</div>
  <div class="header-item-ev">No</div>
</div>
</div>
</fieldset>`

const row_events_fn = (q, ev, i) => `
<div class="grid-row">
  <div class="flex-item-name">${q}</div>
  <label class="flex-item-ev">
  <input type="radio" value="yes" name="${ev}-${i}" required> <span></span>
  </label>
  <label class="flex-item-ev">
  <input type="radio" value="no" name="${ev}-${i}" required> <span></span>
  </label>
</div>`

const person_food_fn = (nm, i) => `
<fieldset>
  <legend>${nm}</legend>
<div class="wrapper" id="form-wrapper-food-${i}">
<div class="grid-header">
  <div class="header-item-food"></div>
  <div class="header-item-food"></div>
  <div class="header-item-food"></div>
  <div class="header-item-food"></div>
  <div class="header-item-food">Vegetarian</div>
  <div class="header-item-food">Vegan</div>
  <div class="header-item-food">Gluten Free</div>
  <div class="header-item-food">Dairy Free</div>
</div>
<div class="grid-row">
  <div class="flex-item-name">Any Dietary Restrictions?</div>
  <label class="flex-item-food">
  <input type="checkbox" name="veggie-${i}"> <span></span>
  </label>
  <label class="flex-item-food">
  <input type="checkbox" name="vegan-${i}"> <span></span>
  </label>
  <label class="flex-item-food">
  <input type="checkbox" name="gf-${i}"> <span></span>
  </label>
  <label class="flex-item-food">
  <input type="checkbox" name="df-${i}"> <span></span>
  </label>
</div>
<div class="grid-header">
  <div class="header-item-other"></div>
  <div class="header-item-other">Other:</div>
</div>
<div class="grid-row">
  <div class="flex-item-name"></div>
  <label class="flex-item-other">
    <input type="text" class="diet-other" name="other-${i}"> <span></span>
  </label>
</div>
</div>
</fieldset>`

const row_food_fn = (i) => `
<div id="rh-meal-choice">
<div class="grid-header">
  <div class="header-item-food"></div>
  <div class="header-item-food"></div>
  <div class="header-item-food"></div>
  <div class="header-item-food"></div>
  <div class="header-item-food">Pork</div>
  <div class="header-item-food">Chicken</div>
  <div class="header-item-food">Salmon</div>
  <div class="header-item-food">Vegetarian</div>
</div>
<div class="grid-row">
  <div class="flex-item-name">Which meal would you prefer at the rehearsal dinner?</div>
  <label class="flex-item-food">
  <input type="radio" value="Pork" name="meal-${i}" required> <span></span>
  </label>
  <label class="flex-item-food">
  <input type="radio" value="Chicken" name="meal-${i}" required> <span></span>
  </label>
  <label class="flex-item-food">
  <input type="radio" value="Salmon" name="meal-${i}" required> <span></span>
  </label>
  <label class="flex-item-food">
  <input type="radio" value="Vegetarian" name="meal-${i}" required> <span></span>
  </label>
</div>
</div>`

const person_schedule_fn = (nm, i) => `
<fieldset id="rsvp-schedule-${i}" style="display: none">
  <legend>${nm}</legend>
<div class="wrapper">
<div class="grid-row" id="rsvp-schedule-rh-${i}-1" style="display: none">
  <span class="flex-item-other">Rehearsal Dinner</span>
  <span class="flex-item-other tag is-medium">475 E Strawberry Dr, Mill Valley, CA 94941</span>
</div>
<div class="grid-row" id="rsvp-schedule-rh-${i}-2" style="display: none">
  <span class="flex-item-other"></span> 
  <span class="flex-item-ev tag is-medium">6pm</span>
  <span class="flex-item-ev tag is-medium">Dressy Casual</span>
</div>
<div class="grid-row" id="rsvp-schedule-wed-${i}-1" style="display: none">
  <span class="flex-item-other">Wedding</span>
  <span class="flex-item-other tag is-medium">Deer Park Villa, 367 Bolinas Rd, Fairfax, CA 94930</span>
</div>
<div class="grid-row" id="rsvp-schedule-wed-${i}-2" style="display: none">
  <span class="flex-item-other"></span> 
  <span class="flex-item-ev tag is-medium">3:30pm</span>
  <span class="flex-item-ev tag is-medium">Cocktail</span>
</div>
<div class="grid-row" id="rsvp-schedule-bbq-${i}-1" style="display: none">
  <span class="flex-item-other">BBQ</span>
  <span class="flex-item-other tag is-medium">Way Station, 2001 Sir Francis Drake Blvd, Fairfax, CA 94930</span>
</div>
<div class="grid-row" id="rsvp-schedule-bbq-${i}-2" style="display: none">
  <span class="flex-item-other"></span> 
  <span class="flex-item-ev tag is-medium">11am</span>
  <span class="flex-item-ev tag is-medium">Casual</span>
</div>
</div>
</fieldset>`

function check_pw(e) {
    e.preventDefault();
    let pw_sub = document.getElementById("rsvp-pw-sub")
    pw_sub.setAttribute("style", "display: none")
    let pw_load = document.getElementById("pw-loader")
    pw_load.setAttribute("style", "display: block")
    const data = new FormData(pw_form);
    const action = e.target.action;
    fetch(action, {method: 'POST', body: data})
    .then(res => res.json())
    .then(data => {
        pw_load.setAttribute("style", "display: none")
        if (data.result === "failure") {
            let helpText = document.getElementById("invalid-id")
            helpText.setAttribute("style", "opacity: 1")
            setTimeout(function(){
                helpText.classList.add("fadeOut")
                setTimeout(function() {
                    helpText.setAttribute("style", "opacity: 0")
                    helpText.classList.remove("fadeOut")
                }, 3000)
            }, 2000);
            pw_sub.setAttribute("style", "display: block")
        }
        else {
            pw_form.setAttribute("style", "display: none")
            let names = data.info[2].split(",")
            for (const nm of names) {
                let fd = new FormData()
                fd.set("Name", nm.trim())
                forms.push(fd)
            }
            rh = data.info[1] === "Y"
            email_form.setAttribute("style", "display: block")
        }
    })
    .catch(console.error);
}

function record_email() {
    email = document.getElementById("rsvp_email").value
    for (let fd of forms) {
        fd.set("Email", email)
    }
    email_form.setAttribute("style", "display: none")

    for (let i=0; i < forms.length; i++) {
        events_form.innerHTML += person_events_fn(forms[i].get("Name"), i)
        let wrapper = document.getElementById(`form-wrapper-events-${i}`)
        if (rh) {
            wrapper.innerHTML += row_events_fn(dinner_q, "rh", i)
        }
        wrapper.innerHTML += row_events_fn(wedding_q, "wed", i)
        wrapper.innerHTML += row_events_fn(bbq_q, "bbq", i)
    }
    // let back = document.createElement("button")
    // back.textContent = "Back"
    // back.setAttribute("type", "back")
    // back.setAttribute("onclick", "events_back()")
    // events_form.append(back)
    let submit = document.createElement("button")
    submit.setAttribute("type", "submit")
    submit.setAttribute("onclick", "record_events()")
    submit.textContent = "Next"
    events_form.append(submit)
    events_form.setAttribute("style", "display: block")
}

// function events_back() {
//     events_form.setAttribute("style", "display: none")
//     email_form.setAttribute("style", "display: block")
// }

function record_events() {
    events_form.setAttribute("style", "display: none")
    for (let i=0; i < forms.length; i++) {
        forms[i].set("BBQ", events_form.elements[`bbq-${i}`].value === "yes" ? 1 : 0)
        forms[i].set("Wedding", events_form.elements[`wed-${i}`].value === "yes" ? 1 : 0)
        if (!events_form.elements[`rh-${i}`])
            forms[i].set("Rehearsal",  0)
        else
            forms[i].set("Rehearsal", events_form.elements[`rh-${i}`].value === "yes" ? 1 : 0)
    }

    ready_to_submit = true;
    for (let i=0; i < forms.length; i++) {
        if ((forms[i].get("Rehearsal") == 1) | (forms[i].get("Wedding") == 1) | (forms[i].get("BBQ") == 1)) {
            attending.push(1)
            ready_to_submit = false;
            food_form.innerHTML += person_food_fn(forms[i].get("Name"), i)
            let wrapper = document.getElementById(`form-wrapper-food-${i}`)
            if (forms[i].get("Rehearsal") === "1")
                wrapper.innerHTML = row_food_fn(i) + wrapper.innerHTML
        }
        else
            attending.push(0)
    }
    let submit = document.createElement("button")
    submit.setAttribute("type", "submit")
    submit.textContent = "Submit"
    food_form.append(submit)
    console.log(ready_to_submit)
    if (ready_to_submit)
        submit.click()
    else
        food_form.setAttribute("style", "display: block")
}

function submit_form(e) {
    e.preventDefault()
    food_form.setAttribute("style", "display: none")
    let el = document.getElementById("end-loader")
    el.setAttribute("style", "display: block")
    let success = true
    let submitted = document.createElement("span")
    submitted.setAttribute("class", "thin")
    const num_attending = attending.reduce((a,b)=>a+b)
    let promises = []
    for (let i=0; i < forms.length; i++){
        forms[i].set("Meal", food_form.elements[`meal-${i}`] ? food_form.elements[`meal-${i}`].value : "")
        forms[i].set("Vegetarian", food_form.elements[`veggie-${i}`] ? (food_form.elements[`veggie-${i}`].checked ? 1 : 0) : 0)
        forms[i].set("Vegan", food_form.elements[`vegan-${i}`] ? (food_form.elements[`vegan-${i}`].checked ? 1 : 0) : 0)
        forms[i].set("Gluten Free", food_form.elements[`gf-${i}`] ? (food_form.elements[`gf-${i}`].checked ? 1 : 0) : 0)
        forms[i].set("Dairy Free", food_form.elements[`df-${i}`] ? (food_form.elements[`df-${i}`].checked ? 1: 0) : 0)
        forms[i].set("Other", food_form.elements[`other-${i}`] ? food_form.elements[`other-${i}`].value : "")
        promises.push(fetch(e.target.action, {
            method: 'POST',
            body: forms[i],
        })
        .then(res => res.json())
        .then(data => {
            submitted.textContent = (success | data.result === "success") ? success_str(num_attending) : failure_str
            if ((forms[i].get("Rehearsal") == 1) | (forms[i].get("Wedding") == 1) | (forms[i].get("BBQ") == 1)) {
              document.getElementById("rsvp-form-div").innerHTML += person_schedule_fn(forms[i].get("Name"), i)
            }
        })
        .catch())
    }
    Promise.all(promises).then(() => {
      let el = document.getElementById("end-loader")
      el.setAttribute("style", "display: none")
      document.getElementById("rsvp-form-div").prepend(submitted)
      for (let i=0; i < forms.length; i++) {
        let sch = document.getElementById(`rsvp-schedule-${i}`)
        if (sch) {
          sch.setAttribute("style", "display: block")
          if (forms[i].get("Rehearsal") == 1) {
            document.getElementById(`rsvp-schedule-rh-${i}-1`).setAttribute("style", "display: block")
            document.getElementById(`rsvp-schedule-rh-${i}-2`).setAttribute("style", "display: block")
          }
          if (forms[i].get("Wedding") == 1) {
            document.getElementById(`rsvp-schedule-wed-${i}-1`).setAttribute("style", "display: block")
            document.getElementById(`rsvp-schedule-wed-${i}-2`).setAttribute("style", "display: block")
          }
          if (forms[i].get("BBQ") == 1) {
            document.getElementById(`rsvp-schedule-bbq-${i}-1`).setAttribute("style", "display: block")
            document.getElementById(`rsvp-schedule-bbq-${i}-2`).setAttribute("style", "display: block")
          }
        }
      }
    })
}

pw_form.addEventListener("submit", check_pw)
food_form.addEventListener("submit", submit_form)