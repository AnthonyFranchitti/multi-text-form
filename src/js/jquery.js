const inputMaxLength = 40;
let inputCharacters = 0;
const totalLength = 1000;
const buttonHtml = `<div class="inputs flex flex-wrap -mx-3 mb-3 lg:mb-6"">
<div
  class="w-full flex justify-between items-start px-3"
>
  <input
    class="inputField appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
    id="input0"
    type="text"
    placeholder="enter your text here ..."
  /><button
    class="button close-button ml-4 relative rounded shadow bg-emerald-600 hover:bg-emerald-700 focus:shadow-outline focus:outline-none text-white font-bold p-6"
  ></button>
</div>
</div>`;

function isTotalLength() {
  return inputCharacters > 0
    ? (inputCharacters + inputMaxLength) % totalLength === inputMaxLength
    : false;
}

function maxTextBoxes() {
  return totalLength / inputMaxLength;
}

// append attributes to input containers
function appendInputs() {
  $(".inputs").each(function (i) {
    $(this).attr("id", `elem${i}`);
    $(this).find("input").attr("id", `input${i}`);
    $(this).find("button").attr("data-id", `elem${i}`);
    // add zebra styling to inputs
    if (i % 2 !== 0) $(this).find("input").addClass("bg-field");
    else $(this).find("input").removeClass("bg-field");
  });
}

function trimInputValues(elem) {
  const elemInput = elem.find("input");
  elemInput.attr("maxlength", inputMaxLength);
  const str = elemInput.val().slice(0, -1);
  inputCharacters = inputCharacters + str.length;
  elemInput.val(str + "\n");
}

function nextElement(elm) {
  const nextElem = elm.next();
  console.log(nextElem);
}

function cloneElement(elm) {
  const elemClone = elm.clone();
  elemClone.find("input").val("");
  elm.after(elemClone);
}

function checkTextReduceFont() {
  const elem = document.getElementById("textArea");
  if (elem.clientHeight < elem.scrollHeight)
    $("#textArea").addClass("small-text");
}

function checkTextResetFont() {
  $("#textArea").removeClass("small-text");
}

// add inputs
function addInput(addMaxLength = false) {
  const elem = $(".inputs").last();
  console.log(elem);
  if (elem?.length === 0) {
    $("#form1").prepend(buttonHtml);
  } else {
    cloneElement(elem);
    if (addMaxLength) trimInputValues(elem);
    //nextElement(elem);
    appendInputs();
  }

  // remove last .inputs when totalLength is reached
  if (isTotalLength()) $(".inputs").last().remove();

  checkTextReduceFont();
  console.log(inputCharacters);
}

// focus newly added inpout
function triggerFocus() {
  $(".inputs").last().find("input").trigger("focus");
}

// add text to textarea
function appendTextArea(values) {
  const splitValues = values.slice(-1);
  const textVal = $("#textArea").val();
  const newVal = textVal + splitValues;
  $("#textArea").val(newVal.replace(/^\s+/g, ""));
}

// remove selected input
function removeInput(elem) {
  const elm = $(`#${elem}`);

  if (elm?.length === 0) return false;
  const valueLength = elm?.find("input").val().length;
  if (valueLength > 0) inputCharacters = inputCharacters - valueLength;
  if ($(".inputs")?.length > 1) {
    if (window.confirm("Do you want to remove this input field?")) elm.remove();
  } else alert("This input field can't be removed!");
}

// max input characters reached add new input
function characterCountAddInput(valueLength) {
  if (valueLength > inputMaxLength) {
    addInput(true);
    triggerFocus();
  }
}

$(function () {
  // add new input
  $("#newLine").on("click", function (e) {
    e.preventDefault();
    const inputsLength = $(".inputs")?.length;
    const lastElemValue = $(".inputs").last().find("input").val();
    if (inputsLength < maxTextBoxes() && lastElemValue.length > 0) {
      addInput();
      triggerFocus();
    } else alert("Last input field is empty, add text before creating new input!");
  });

  $("body").on("click", "button.close-button", function (e) {
    e.preventDefault();
    removeInput($(this).attr("data-id"));
  });

  //count characters in text field
  $("body").on("input", ".inputField", function () {
    const value = $(this).val();
    const valueLength = value?.length;
    characterCountAddInput(valueLength);
    appendTextArea(value);
  });

  $("body").on("keyup", "#textArea", function () {
    const value = $(this).val();
    console.log(value);
    if (value.length <= 0) checkTextResetFont();
  });
});
