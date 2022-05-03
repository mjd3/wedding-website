const pw_form = document.forms["rsvp-pw-form"]
const email_form = document.forms["rsvp-email-form"]
const events_form = document.forms["rsvp-events-form"]
const food_form = document.forms["rsvp-food-form"]

var events_form_created = false
var food_form_created = false
var ready_to_submit = false

const dinner_q = "Will you be attending the rehearsal dinner?"
const wedding_q = "Will you be attending the wedding?"
const bbq_q = "Will you be attending the barbecue?"
const schedule_str = (attending) => `Your schedule${(attending > 1) ? "s" : ""} for the weekend ${(attending > 1) ? "are" : "is"} below!`
const success_str = (attending) => `Your RSVP was successfully submitted. ${attending > 0 ? "We are excited to see you soon!" : "We will be sad to miss you!"} Please feel free to update your RSVP at any time if your plans change by returning to the RSVP page and submitting the form again. ${attending > 0 ? schedule_str(attending) : ""}`
const failure_str = "Something went wrong! Please try again or contact us directly if things still don't work."

var rh;
var attending = []
var forms = []
var stored = {}

const person_events_fn = (nm, i) => `
<fieldset>
  <legend>${nm}</legend>
<div class="wrapper" id="form-wrapper-events-${i}">
<div class="grid-row">
  <div class="flex-item-25"></div>
  <div class="flex-item-25"></div>
  <div class="flex-item-25">Yes</div>
  <div class="flex-item-25">No</div>
</div>
</div>
</fieldset>`

const row_events_fn = (q, ev, i) => `
<div class="grid-row">
  <div class="flex-item-50">${q}</div>
  <label class="flex-item-25">
  <input type="radio" value="yes" name="${ev}-${i}" required> <span></span>
  </label>
  <label class="flex-item-25">
  <input type="radio" value="no" name="${ev}-${i}" required> <span></span>
  </label>
</div>`

const person_food_fn = (nm, i) => `
<fieldset id="rsvp-food-${i}">
  <legend>${nm}</legend>
<div class="wrapper" id="form-wrapper-food-${i}">
<div class="grid-row">
  <div class="header-item-100">Any dietary restrictions? (leave blank if None)</div>
</div>
<div class="grid-row">
  <div class="flex-item-25">Vegetarian</div>
  <div class="flex-item-25">Vegan</div>
  <div class="flex-item-25">Gluten Free</div>
  <div class="flex-item-25">Dairy Free</div>
</div>
<div class="grid-row">
  <label class="flex-item-25">
  <input type="checkbox" name="veggie-${i}"> <span></span>
  </label>
  <label class="flex-item-25">
  <input type="checkbox" name="vegan-${i}"> <span></span>
  </label>
  <label class="flex-item-25">
  <input type="checkbox" name="gf-${i}"> <span></span>
  </label>
  <label class="flex-item-25">
  <input type="checkbox" name="df-${i}"> <span></span>
  </label>
</div>
<div class="grid-row">
  <div class="flex-item-100">Other:</div>
</div>
<div class="grid-row">
  <label class="flex-item-100">
    <input type="text" class="diet-other" name="other-${i}"> <span></span>
  </label>
</div>
</div>
</fieldset>`

const row_food_fn = (i) => `
<div id="rh-meal-choice-${i}">
<div class="grid-row">
  <div class="header-item-100">Which meal would you prefer at the rehearsal dinner?</div>
</div>
<div class="grid-row">
  <div class="flex-item-25">Pork</div>
  <div class="flex-item-25">Chicken</div>
  <div class="flex-item-25">Salmon</div>
  <div class="flex-item-25">Vegetarian</div>
</div>
<div class="grid-row">
  <label class="flex-item-25">
  <input type="radio" value="Pork" name="meal-${i}" required> <span></span>
  </label>
  <label class="flex-item-25">
  <input type="radio" value="Chicken" name="meal-${i}" required> <span></span>
  </label>
  <label class="flex-item-25">
  <input type="radio" value="Salmon" name="meal-${i}" required> <span></span>
  </label>
  <label class="flex-item-25">
  <input type="radio" value="Vegetarian" name="meal-${i}" required> <span></span>
  </label>
</div>
</div>`

const person_schedule_fn = (nm, i) => `
<fieldset id="rsvp-schedule-${i}" style="display: none">
  <legend>${nm}</legend>
<div class="wrapper">
<div id="rsvp-schedule-rh-${i}" style="display: none">
<div class="grid-row">
  <span class="header-item-100">Rehearsal Dinner</span>
</div>
<div class="grid-row">
  <span class="flex-item-100 tag tag_custom">475 E Strawberry Dr, Mill Valley, CA 94941</span>
</div>
<div class="grid-row">
  <span class="flex-item-50 tag tag_custom">6pm</span>
  <span class="flex-item-50 tag tag_custom">Dressy Casual</span>
</div>
</div>

<div id="rsvp-schedule-wed-${i}" style="display: none">
<div class="grid-row">
  <span class="header-item-100">Wedding</span>
</div>
<div class="grid-row">
  <span class="flex-item-100 tag tag_custom">Deer Park Villa, 367 Bolinas Rd, Fairfax, CA 94930</span>
</div>
<div class="grid-row">
  <span class="flex-item-50 tag tag_custom">3:30pm</span>
  <span class="flex-item-50 tag tag_custom">Cocktail</span>
</div>
</div>

<div id="rsvp-schedule-bbq-${i}" style="display: none">
<div class="grid-row">
  <span class="header-item-100">BBQ</span>
</div>
<div class="grid-row">
  <span class="flex-item-100 tag tag_custom">Way Station, 2001 Sir Francis Drake Blvd, Fairfax, CA 94930</span>
</div>
<div class="grid-row">
  <span class="flex-item-50 tag tag_custom">11am</span>
  <span class="flex-item-50 tag tag_custom">Casual</span>
</div>
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
    .then(res => {
        pw_load.setAttribute("style", "display: none")
        if (res.result === "failure") {
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
            for (const nm of res.names) {
                let fd = new FormData()
                fd.set("Name", nm)
                fd.set("Password", data.get("rsvp_id"))
                forms.push(fd)
            }
            rh = res.rh
            if ("stored" in res) {
                stored = res.stored
                let welcome_back = document.createElement("div")
                welcome_back.setAttribute("class", "thin")
                welcome_back.textContent = "Welcome back! We've filled in your information from your previous RSVP. Please update anything that has changed."
                email_form.prepend(welcome_back)
                email_form["rsvp_email"].value = stored[Object.keys(stored)[0]][1]
            }
            email_form.setAttribute("style", "display: block")
        }
    })
    .catch(console.error);
}

function record_email(e) {
    e.preventDefault()
    email = document.getElementById("rsvp_email").value
    for (let fd of forms) {
        fd.set("Email", email)
    }
    email_form.setAttribute("style", "display: none")

    if (!events_form_created) {
        for (let i=0; i < forms.length; i++) {
            events_form.innerHTML += person_events_fn(forms[i].get("Name"), i)
            let wrapper = document.getElementById(`form-wrapper-events-${i}`)
            if (rh)
                wrapper.innerHTML += row_events_fn(dinner_q, "rh", i)
            wrapper.innerHTML += row_events_fn(wedding_q, "wed", i)
            wrapper.innerHTML += row_events_fn(bbq_q, "bbq", i)
        }
        // let back = document.createElement("button")
        // back.textContent = "Back"
        // back.setAttribute("type", "button")
        // back.setAttribute("onclick", "events_back()")
        // events_form.append(back)
        let submit = document.createElement("button")
        submit.setAttribute("type", "submit")
        submit.textContent = "Next"
        events_form.append(submit)
        events_form_created = true

        for (let i=0; i < forms.length; i++) { 
            nm = forms[i].get("Name")
            if (nm in stored) {
                if (rh)
                    events_form[`rh-${i}`].value = stored[nm][2] ? "yes" : "no"
                events_form[`wed-${i}`].value = stored[nm][3] ? "yes" : "no"
                events_form[`bbq-${i}`].value = stored[nm][4] ? "yes" : "no"
            }
        }
    }
    events_form.setAttribute("style", "display: block")
}

// function events_back() {
//     events_form.setAttribute("style", "display: none")
//     email_form.setAttribute("style", "display: block")
// }

function record_events(e) {
    e.preventDefault()
    events_form.setAttribute("style", "display: none")
    for (let i=0; i < forms.length; i++) {
        forms[i].set("BBQ", events_form[`bbq-${i}`].value === "yes" ? 1 : 0)
        forms[i].set("Wedding", events_form[`wed-${i}`].value === "yes" ? 1 : 0)
        forms[i].set("Rehearsal", `rh-${i}` in events_form ? (events_form[`rh-${i}`].value === "yes" ? 1 : 0) : 0)
    }

    ready_to_submit = true
    for (let i=0; i < forms.length; i++) {
        if ((forms[i].get("Rehearsal") == 1) | (forms[i].get("Wedding") == 1) | (forms[i].get("BBQ") == 1)) {
            attending.push(1)
            ready_to_submit = false;
            if (!food_form_created) {
                food_form.innerHTML += person_food_fn(forms[i].get("Name"), i)
                let wrapper = document.getElementById(`form-wrapper-food-${i}`)
                if (forms[i].get("Rehearsal") === "1")
                    wrapper.innerHTML = row_food_fn(i) + wrapper.innerHTML
            }
            else
                document.getElementById(`rsvp-food-${i}`).setAttribute("style", "display: block")
            if (forms[i].get("Rehearsal") === "1" & !document.getElementById(`rh-meal-choice-${i}`)) {
                let wrapper = document.getElementById(`form-wrapper-food-${i}`)
                wrapper.innerHTML = row_food_fn(i) + wrapper.innerHTML
            }
            else if (forms[i].get("Rehearsal") === "1" & !!document.getElementById(`rh-meal-choice-${i}`))
                document.getElementById(`rh-meal-choice-${i}`).setAttribute("style", "display: block")
            else if (forms[i].get("Rehearsal") === "0" & !!document.getElementById(`rh-meal-choice-${i}`))
                document.getElementById(`rh-meal-choice-${i}`).setAttribute("style", "display: none")
        }
        else
            attending.push(0)
    }
    if (!food_form_created) {
        // let back = document.createElement("button")
        // back.textContent = "Back"
        // back.setAttribute("type", "button")
        // back.setAttribute("onclick", "food_back()")
        // food_form.append(back)
        let submit = document.createElement("button")
        submit.setAttribute("type", "submit")
        submit.id = "rsvp-food-sub"
        submit.textContent = "Submit"
        food_form.append(submit)
        food_form_created = true

        for (let i=0; i < forms.length; i++) { 
            nm = forms[i].get("Name")
            if (nm in stored) {
                if (!!food_form[`meal-${i}`])
                    food_form[`meal-${i}`].value = stored[nm][5]
                if (!!food_form[`veggie-${i}`])
                    food_form[`veggie-${i}`].checked = !!stored[nm][6]
                if (!!food_form[`vegan-${i}`])
                    food_form[`vegan-${i}`].checked = !!stored[nm][7]
                if (!!food_form[`gf-${i}`])
                    food_form[`gf-${i}`].checked = !!stored[nm][8]
                if (!!food_form[`df-${i}`])
                    food_form[`df-${i}`].checked = !!stored[nm][9]
                if (!!food_form[`other-${i}`])
                    food_form[`other-${i}`].value = stored[nm][10]
            }
        }
    }
    if (ready_to_submit)
        document.getElementById("rsvp-food-sub").click()
    else
        food_form.setAttribute("style", "display: block")
}

// function food_back() {
//     ready_to_submit = false
//     for (let i=0; i < forms.length; i++)
//         attending.pop()
//     food_form.setAttribute("style", "display: none")
//     events_form.setAttribute("style", "display: block")
// }

function submit_form(e) {
    e.preventDefault()
    food_form.setAttribute("style", "display: none")
    let el = document.getElementById("end-loader")
    el.setAttribute("style", "display: block")
    let success = true
    let submitted = document.createElement("span")
    submitted.setAttribute("class", "thin")
    submitted.setAttribute("style", "display: block")
    const num_attending = attending.reduce((a, b) => a + b)
    let form_entries = []
    for (let i=0; i < forms.length; i++) {
        forms[i].set("Meal", !!food_form[`meal-${i}`] ? food_form[`meal-${i}`].value : "")
        forms[i].set("Vegetarian", !!food_form[`veggie-${i}`] ? (food_form[`veggie-${i}`].checked ? 1 : 0) : 0)
        forms[i].set("Vegan", !!food_form[`vegan-${i}`] ? (food_form[`vegan-${i}`].checked ? 1 : 0) : 0)
        forms[i].set("Gluten Free", !!food_form[`gf-${i}`] ? (food_form[`gf-${i}`].checked ? 1 : 0) : 0)
        forms[i].set("Dairy Free", !!food_form[`df-${i}`] ? (food_form[`df-${i}`].checked ? 1 : 0) : 0)
        forms[i].set("Other", !!food_form[`other-${i}`] ? food_form[`other-${i}`].value : "")
        form_entries.push(Object.fromEntries(forms[i].entries()))
    }
    fetch(e.target.action, {
      method: 'POST',
      body: JSON.stringify(form_entries),
    })
    .then(res => res.json())
    .then(data => {
        submitted.textContent = (success | data.result === "success") ? success_str(num_attending) : failure_str
        for (let i=0; i < forms.length; i++) {
          if ((forms[i].get("Rehearsal") == 1) | (forms[i].get("Wedding") == 1) | (forms[i].get("BBQ") == 1))
            document.getElementById("rsvp-form-div").innerHTML += person_schedule_fn(forms[i].get("Name"), i)
        }
        let el = document.getElementById("end-loader")
        el.setAttribute("style", "display: none")
        document.getElementById("rsvp-form-div").prepend(submitted)
        for (let i=0; i < forms.length; i++) {
            let sch = document.getElementById(`rsvp-schedule-${i}`)
            if (sch) {
                sch.setAttribute("style", "display: block")
                if (forms[i].get("Rehearsal") == 1)
                    document.getElementById(`rsvp-schedule-rh-${i}`).setAttribute("style", "display: block")
                if (forms[i].get("Wedding") == 1)
                    document.getElementById(`rsvp-schedule-wed-${i}`).setAttribute("style", "display: block")
                if (forms[i].get("BBQ") == 1)
                    document.getElementById(`rsvp-schedule-bbq-${i}`).setAttribute("style", "display: block")
            }
        }
        let back = document.createElement("button")
        back.textContent = "Return to Homepage"
        back.setAttribute("type", "button")
        back.onclick = function () {
            location.href = "./index.html";
        }
        document.getElementById("rsvp-form-div").append(back)
    })
}

pw_form.addEventListener("submit", check_pw)
email_form.addEventListener("submit", record_email)
events_form.addEventListener("submit", record_events)
food_form.addEventListener("submit", submit_form)